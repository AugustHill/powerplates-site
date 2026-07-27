// Generic countdown timer. Reusable for future events -- just add a
// container with data-countdown-target="<ISO datetime>" and four
// [data-unit] spans inside it (days/hours/minutes/seconds), plus an
// optional separate element with [data-countdown-done] to show once
// the target time has passed.

document.addEventListener('DOMContentLoaded', function () {
  var el = document.querySelector('[data-countdown-target]');
  if (!el) return;

  var target = new Date(el.getAttribute('data-countdown-target'));
  var doneMessage = document.querySelector('[data-countdown-done]');
  var daysEl = el.querySelector('[data-unit="days"]');
  var hoursEl = el.querySelector('[data-unit="hours"]');
  var minutesEl = el.querySelector('[data-unit="minutes"]');
  var secondsEl = el.querySelector('[data-unit="seconds"]');

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var timer;

  function tick() {
    var diff = target.getTime() - Date.now();
    if (diff <= 0) {
      clearInterval(timer);
      el.style.display = 'none';
      if (doneMessage) doneMessage.style.display = 'block';
      return;
    }
    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  tick();
  timer = setInterval(tick, 1000);
});
