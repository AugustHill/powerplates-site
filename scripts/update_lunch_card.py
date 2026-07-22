"""
Checks whether the Power Plates monthly lunch card on events.html has
passed its date, and if so, tries to advance it to next month's
Eventbrite listing (https://{month}powerplates.eventbrite.com).

This script ONLY reads/writes events.html. It does not touch git or
Netlify -- the caller is expected to check RESULT on the last line of
stdout and, if it is not NO_CHANGE, commit/push/deploy separately.

Usage: python scripts/update_lunch_card.py
Exit code is always 0 on a normal decision; non-zero only on a bug
(missing state block, unreadable file, etc).
"""
import json
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
EVENTS_HTML = REPO / "events.html"
# NOTE: intentionally uses naive local time rather than zoneinfo -- this
# script only ever runs on this machine, which is configured for Eastern
# Time (confirmed: `Eastern Standard Time` Windows TZ id, DST-aware), and
# the scheduling cron itself also fires in the machine's local time. Using
# zoneinfo("America/New_York") would require the `tzdata` package, which
# isn't bundled with Python on Windows -- not worth the extra dependency
# for a script tied to one specific, already-Eastern machine.
MONTHS = ["january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"]
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")
# How many days in the future a fetched startDate is allowed to be
# before we treat it as probably-wrong data and refuse to publish it.
MAX_FUTURE_DAYS = 45

STATE_RE = re.compile(r"<!-- LUNCH_STATE_START\s*(.*?)\s*LUNCH_STATE_END -->", re.DOTALL)
CARD_RE = re.compile(r"<!-- LUNCH_CARD_START -->.*?<!-- LUNCH_CARD_END -->", re.DOTALL)
JSONLD_RE = re.compile(r"<!-- LUNCH_JSONLD_START -->.*?<!-- LUNCH_JSONLD_END -->", re.DOTALL)
SITE_URL = "https://tampapowerplates.com"


def log(msg):
    print(f"[update_lunch_card] {msg}")


def parse_state(html):
    m = STATE_RE.search(html)
    if not m:
        sys.exit("FATAL: could not find LUNCH_STATE_START/END block in events.html")
    fields = {}
    for line in m.group(1).splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        key, _, val = line.partition(":")
        fields[key.strip()] = val.strip()
    for required in ("month", "eventbrite", "startDate"):
        if required not in fields:
            sys.exit(f"FATAL: LUNCH_STATE block is missing '{required}'")
    return fields


def next_month_name(month_name):
    i = MONTHS.index(month_name.lower())
    return MONTHS[(i + 1) % 12]


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.status, resp.read().decode("utf-8", errors="replace")


def extract_event(html):
    def meta(prop):
        m = re.search(rf'<meta property="{re.escape(prop)}" content="([^"]*)"', html)
        return m.group(1) if m else None

    def jsonld(key):
        m = re.search(rf'"{key}":"([^"]*)"', html)
        return m.group(1) if m else None

    og_title = meta("og:title")
    og_image = meta("og:image")
    start = jsonld("startDate")
    end = jsonld("endDate")
    address = jsonld("streetAddress")

    if not (og_title and og_image and start and address):
        return None

    return {
        "title": og_title,
        "image": og_image.replace("&amp;", "&"),
        "start": start,
        "end": end,
        "address": address,
    }


def format_time(dt):
    hour = dt.hour % 12 or 12
    period = "AM" if dt.hour < 12 else "PM"
    if dt.minute:
        return f"{hour}:{dt.minute:02d} {period}"
    return f"{hour} {period}"


def format_card_meta(start_iso, end_iso):
    start = datetime.fromisoformat(start_iso)
    end = datetime.fromisoformat(end_iso) if end_iso else None
    weekday_month_day = f"{start.strftime('%A')}, {start.strftime('%B')} {start.day}"

    if end:
        s_period = "AM" if start.hour < 12 else "PM"
        e_period = "AM" if end.hour < 12 else "PM"
        s_txt = format_time(start)
        if s_period == e_period:
            s_txt = s_txt.replace(f" {s_period}", "")
        time_range = f"{s_txt}&ndash;{format_time(end)}"
    else:
        time_range = format_time(start)

    return f"{weekday_month_day} &middot; {time_range}"


def build_card_html(eventbrite_url, event):
    tag = format_card_meta(event["start"], event["end"])
    return f"""<!-- LUNCH_CARD_START -->
      <div class="lunch-card-wrap">
        <div class="card place-card">
          <a class="place-photo-link" href="{eventbrite_url}" target="_blank" rel="noopener">
            <div class="place-photo">
              <img src="{event['image']}" alt="{event['title']}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
              <div class="place-photo-fallback">{event['title']}</div>
            </div>
          </a>
          <div class="place-body">
            <span class="tag">{tag}</span>
            <h3>{event['title']}</h3>
            <p>{event['address']}</p>
            <a href="{eventbrite_url}" target="_blank" rel="noopener" class="btn btn-primary mt-lg">RSVP on Eventbrite</a>
          </div>
        </div>
      </div>
      <!-- LUNCH_CARD_END -->"""


def build_fallback_html():
    return """<!-- LUNCH_CARD_START -->
      <div class="lunch-card-wrap">
        <div class="card" style="text-align:center;">
          <span class="tag">Stay tuned</span>
          <h3>Next lunch coming soon</h3>
          <p>We're finalizing the details for next month's lunch. Join the newsletter below and you'll be the first to know when RSVP opens.</p>
        </div>
      </div>
      <!-- LUNCH_CARD_END -->"""


def build_jsonld_html(eventbrite_url, event):
    data = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event["title"],
        "startDate": event["start"],
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
            "@type": "Place",
            "address": event["address"],
        },
        "image": [event["image"]],
        "organizer": {
            "@type": "Organization",
            "name": "Power Plates",
            "url": f"{SITE_URL}/",
        },
        "url": eventbrite_url,
    }
    if event.get("end"):
        data["endDate"] = event["end"]
    body = json.dumps(data, indent=2)
    return (
        '<!-- LUNCH_JSONLD_START -->\n'
        '<script type="application/ld+json">\n'
        f'{body}\n'
        '</script>\n'
        '<!-- LUNCH_JSONLD_END -->'
    )


def build_fallback_jsonld_html():
    return (
        "<!-- LUNCH_JSONLD_START -->\n"
        "<!-- No Event structured data while next month's lunch isn't confirmed yet. -->\n"
        "<!-- LUNCH_JSONLD_END -->"
    )


def build_state_html(month, eventbrite_url, start_iso, end_iso):
    return f"""<!-- LUNCH_STATE_START
      month: {month}
      eventbrite: {eventbrite_url}
      startDate: {start_iso}
      endDate: {end_iso}
      LUNCH_STATE_END -->"""


def main():
    if not EVENTS_HTML.exists():
        sys.exit(f"FATAL: {EVENTS_HTML} not found")

    html = EVENTS_HTML.read_text(encoding="utf-8")
    state = parse_state(html)
    log(f"current state: {state}")

    event_day = datetime.fromisoformat(state["startDate"]).date()
    today = datetime.now().date()

    if today <= event_day:
        log(f"today ({today}) has not passed the current lunch date ({event_day}). No change needed.")
        print("RESULT: NO_CHANGE")
        return

    log(f"today ({today}) is past the current lunch date ({event_day}). Checking next month's Eventbrite page.")
    nm = next_month_name(state["month"])
    nm_url = f"https://{nm}powerplates.eventbrite.com"
    log(f"fetching {nm_url}")

    event = None
    try:
        status, body = fetch(nm_url)
        if status == 200:
            event = extract_event(body)
        else:
            log(f"unexpected status {status}")
    except (urllib.error.URLError, urllib.error.HTTPError) as e:
        log(f"fetch failed: {e}")

    if event:
        fetched_day = datetime.fromisoformat(event["start"]).date()
        delta_days = (fetched_day - today).days
        if not (0 <= delta_days <= MAX_FUTURE_DAYS):
            log(f"WARNING: {nm_url} startDate is {fetched_day}, which is not within "
                f"0-{MAX_FUTURE_DAYS} days of today ({today}). This looks like stale/wrong "
                f"data on the Eventbrite listing -- NOT publishing it automatically. "
                f"Falling back to the placeholder and will retry tomorrow.")
            event = None

    if event:
        log(f"found a real event for {nm}: \"{event['title']}\" on {event['start']}")
        new_card = build_card_html(nm_url, event)
        new_jsonld = build_jsonld_html(nm_url, event)
        new_state = build_state_html(nm, nm_url, event["start"], event["end"])
        result = f"CHANGED month={nm}"
    else:
        log(f"{nm_url} is not a ready/valid event yet. Using the 'coming soon' placeholder "
            f"and will check again on the next run.")
        new_card = build_fallback_html()
        new_jsonld = build_fallback_jsonld_html()
        new_state = None  # keep existing state so we keep retrying nm_url on future runs
        result = "CHANGED_FALLBACK"

    new_html = CARD_RE.sub(lambda m: new_card, html, count=1)
    new_html = JSONLD_RE.sub(lambda m: new_jsonld, new_html, count=1)
    if new_state:
        new_html = STATE_RE.sub(lambda m: new_state, new_html, count=1)

    if new_html == html:
        log("computed content is identical to what's already published. No change needed.")
        print("RESULT: NO_CHANGE")
        return

    EVENTS_HTML.write_text(new_html, encoding="utf-8")
    log(f"events.html updated on disk ({EVENTS_HTML}).")
    print(f"RESULT: {result}")


if __name__ == "__main__":
    main()
