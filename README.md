# Power Plates Website

A simple 8-page static site. No build step, no framework. Open `index.html`
in a browser or upload the folder to any static host.

## Pages
- `index.html`: Home
- `about.html`: About
- `events.html`: Events (lunches, brewery meetups, special events)
- `media.html`: Photos & media gallery
- `members.html`: Featured members
- `books.html`: Books of the month (Amazon links)
- `places-we-ate.html`: Places We Ate (real restaurants and breweries from the newsletter archive)
- `faq.html`: Frequently asked questions
- `contact.html`: Contact form (emails go to whoever owns the Web3Forms key)

## 1. Newsletter signup to Google Sheet

The signup form on every page posts to **Web3Forms**, already wired up with
your access key (`b1203def-ff63-4af1-85cd-ab7c9e30a74a`), so submissions
go straight to the inbox registered with that key. Nothing left to do here
unless you want to rotate the key later.

1. (Optional) In your Web3Forms dashboard, open the form and turn on the **Zapier**
   integration (under Integrations). Web3Forms will give you a webhook URL.
2. In Zapier, create a Zap. Trigger: "Webhooks by Zapier" (Catch Hook) using
   that URL. Action: "Google Sheets: Create Spreadsheet Row." Map the
   `name` and `email` fields to your sheet's columns.

Each submission collects name and email. Edit the `<input>` fields in the
newsletter form blocks if you want to collect more, such as phone.

## 2. Logo

Your logo (`images/logo.png`) is already wired into the header and footer
on every page, sitting on a dark badge so the white linework stays visible.
To swap it for a different file later, just replace `images/logo.png` with
the new file (same name) or update the `src` in the `<img>` tags.

## 3. Adding real photos

Drop image files into the `images/` folder. Then:
- **Flyers**: swap each `.flyer-thumb` div for `<img src="images/your-flyer.jpg">`.
- **Media gallery**: swap each `.gallery-item` div for an `<img>` inside it.
- **Members**: swap each `.plate-photo-inner` initials for a member photo.
- **Books**: swap each `.book-cover` for the real book cover art.

Comments above each section in the HTML mark exactly where to do this.

## 4. Amazon links for Books of the Month

Each "Find it on Amazon" button searches Amazon for that exact title and
author. Swap any of these for your real product link (or an Amazon
Associates affiliate link) any time.

Book cover art loads live from Open Library's free cover API (no files to
manage). If a specific edition doesn't have a cover on file there, the card
falls back automatically to a plain title card, no broken image icons.

## 5. Events page

`events.html` has placeholder dates and RSVP links since these change every
month. Update the three event cards near the top with the real date,
location, and Eventbrite (or other RSVP) link each time you announce a new
lunch or meetup.

## 6. Homepage hero photo

The circle that says "Pull up a chair" on the homepage rotates through 6
food photos automatically (no clicking needed, it just cycles every few
seconds). Those are hotlinked from Unsplash for now. To swap in real photos
from your own events, drop images into `images/` and update the
`heroPhotos` array near the bottom of `js/script.js`.

## 7. Places We Ate

The 35 restaurants and breweries on `places-we-ate.html` are the real,
complete list of everywhere Power Plates has eaten, provided directly by
you. Each card links out to that business's real website (or a Google Maps
listing for the couple that don't have one). Where a photo was available,
it's hotlinked from that business's own site or, for Troubled Waters
Brewing, a photo you uploaded directly (saved at
`images/places/troubled-waters-brewing.webp`). If a hotlinked photo ever
breaks, the card falls back automatically to a plain text card rather than
a broken image icon.

Every card currently has a photo. If a hotlinked photo ever breaks, the
card falls back automatically to a plain text card rather than a broken
image icon.

## 8. Hosting

Any static host works, no server required. Easiest options:
- **Netlify**: drag the whole `powerplates` folder onto netlify.com/drop.
- **GitHub Pages**: push the folder to a repo, enable Pages in settings.

## Colors

Defined once in `css/style.css` under `:root`:
- Paper `#F2F0EF`
- Stone `#BBBDBC`
- Teal `#245F73`
- Rust `#733E24`
Plus a few darker shades derived from teal and rust for hover states and
dark sections.

## Notes

- Featured Members and Books of the Month are pulled from your real
  newsletter archive. The Events page is still placeholder copy since
  dates change monthly, see section 5 above.
- The site is fully responsive and works down to mobile width.
