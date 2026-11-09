// Photo slideshow: swipeable slides, thumbnails, autoplay with a pause button,
// and a full screen viewer. Markup contract: see the [data-slideshow] block in
// speed-networking.html. Without JavaScript the slides still scroll sideways and
// the controls stay hidden.

(function () {
  var roots = document.querySelectorAll('[data-slideshow]');
  Array.prototype.forEach.call(roots, initSlideshow);

  function initSlideshow(root) {
    var track = root.querySelector('.sn-slides');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.sn-slide'));
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('.sn-thumb'));
    var thumbBar = root.querySelector('.sn-thumbs');
    var prevBtn = root.querySelector('.sn-prev');
    var nextBtn = root.querySelector('.sn-next');
    var playBtn = root.querySelector('.sn-play');
    var expandBtn = root.querySelector('.sn-expand');
    var countEl = root.querySelector('.sn-count');
    var nowEl = root.querySelector('.sn-count-now');
    var total = slides.length;
    if (!track || !total) return;

    var INTERVAL = 5500;
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var current = 0;
    var playing = !reduceMotion;
    var timer = null;
    var visible = !('IntersectionObserver' in window);
    var hold = { hover: false, focus: false, touch: false, viewer: false };

    root.classList.add('is-js');

    function wrap(i) { return ((i % total) + total) % total; }

    // Load the photos around the current one ahead of time.
    function warm(i) {
      [-1, 0, 1, 2].forEach(function (d) {
        var lazy = slides[wrap(i + d)].querySelectorAll('img[loading="lazy"]');
        Array.prototype.forEach.call(lazy, function (img) { img.loading = 'eager'; });
      });
    }

    function centerThumb(i) {
      var t = thumbs[i];
      if (!thumbBar || !t) return;
      var left = t.offsetLeft - (thumbBar.clientWidth - t.offsetWidth) / 2;
      thumbBar.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    function canRun() {
      return playing && visible && !document.hidden && !hold.hover && !hold.focus && !hold.touch && !hold.viewer;
    }

    function schedule() {
      clearTimeout(timer);
      if (!canRun()) return;
      timer = setTimeout(function () {
        goTo(current + 1, current === total - 1);
      }, INTERVAL);
    }

    function setActive(i) {
      current = wrap(i);
      if (nowEl) nowEl.textContent = String(current + 1);
      thumbs.forEach(function (t, k) {
        var on = k === current;
        t.classList.toggle('is-active', on);
        if (on) { t.setAttribute('aria-current', 'true'); } else { t.removeAttribute('aria-current'); }
      });
      centerThumb(current);
      warm(current);
      schedule();
    }

    function goTo(i, instant) {
      var target = wrap(i);
      track.scrollTo({ left: target * track.clientWidth, behavior: (instant || reduceMotion) ? 'auto' : 'smooth' });
      setActive(target);
    }

    // Keep the counter and thumbnails right after a swipe or trackpad scroll settles.
    var settle = null;
    track.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== current) setActive(i);
      }, 90);
    }, { passive: true });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        track.scrollTo({ left: current * track.clientWidth, behavior: 'auto' });
      }, 150);
    });

    // Controls
    prevBtn.addEventListener('click', function () { goTo(current - 1, current === 0); });
    nextBtn.addEventListener('click', function () { goTo(current + 1, current === total - 1); });
    thumbs.forEach(function (t, k) { t.addEventListener('click', function () { goTo(k); }); });

    function syncPlay() {
      playBtn.setAttribute('data-state', playing ? 'playing' : 'paused');
      playBtn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
      if (countEl) countEl.setAttribute('aria-live', playing ? 'off' : 'polite');
    }
    playBtn.addEventListener('click', function () {
      playing = !playing;
      syncPlay();
      schedule();
    });

    root.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === 'ArrowLeft') { prevBtn.click(); }
      else if (e.key === 'ArrowRight') { nextBtn.click(); }
      else if (e.key === 'Home') { goTo(0, true); }
      else if (e.key === 'End') { goTo(total - 1, true); }
      else { return; }
      e.preventDefault();
    });

    // Autoplay holds: mouse over, keyboard focus, finger down, viewer open, tab hidden, scrolled away.
    root.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') { hold.hover = true; schedule(); }
    });
    root.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') { hold.hover = false; schedule(); }
    });
    root.addEventListener('focusin', function (e) {
      var viaKeyboard = true;
      try { viaKeyboard = e.target.matches(':focus-visible'); } catch (err) { /* older browsers */ }
      if (viaKeyboard) { hold.focus = true; schedule(); }
    });
    root.addEventListener('focusout', function (e) {
      if (!e.relatedTarget || !root.contains(e.relatedTarget)) { hold.focus = false; schedule(); }
    });
    track.addEventListener('touchstart', function () { hold.touch = true; schedule(); }, { passive: true });
    ['touchend', 'touchcancel'].forEach(function (name) {
      track.addEventListener(name, function () { hold.touch = false; schedule(); }, { passive: true });
    });
    document.addEventListener('visibilitychange', schedule);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        schedule();
      }, { threshold: 0.25 }).observe(root);
    }

    // Full screen viewer
    var box = null, boxImg = null, boxCount = null, boxIndex = 0, swipeStart = null;

    function showInViewer(i) {
      boxIndex = wrap(i);
      var img = slides[boxIndex].querySelector('.sn-slide-img');
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      boxCount.textContent = (boxIndex + 1) + ' / ' + total;
      warm(boxIndex);
    }

    function buildViewer() {
      if (box || typeof window.HTMLDialogElement === 'undefined') return;
      box = document.createElement('dialog');
      box.className = 'sn-lightbox';
      box.setAttribute('aria-label', 'Photo viewer');
      box.innerHTML =
        '<div class="sn-lb-stage"><img class="sn-lb-img" alt=""></div>' +
        '<button class="sn-lb-btn sn-lb-close" type="button" aria-label="Close photo viewer"><svg aria-hidden="true"><use href="#i-close"/></svg></button>' +
        '<button class="sn-lb-btn sn-lb-prev" type="button" aria-label="Previous photo"><svg aria-hidden="true"><use href="#i-chev-l"/></svg></button>' +
        '<button class="sn-lb-btn sn-lb-next" type="button" aria-label="Next photo"><svg aria-hidden="true"><use href="#i-chev-r"/></svg></button>' +
        '<div class="sn-lb-count" aria-live="polite"></div>';
      document.body.appendChild(box);
      boxImg = box.querySelector('.sn-lb-img');
      boxCount = box.querySelector('.sn-lb-count');

      box.querySelector('.sn-lb-close').addEventListener('click', function () { box.close(); });
      box.querySelector('.sn-lb-prev').addEventListener('click', function () { showInViewer(boxIndex - 1); });
      box.querySelector('.sn-lb-next').addEventListener('click', function () { showInViewer(boxIndex + 1); });
      box.addEventListener('click', function (e) {
        if (e.target === box || e.target.classList.contains('sn-lb-stage')) box.close();
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { showInViewer(boxIndex - 1); e.preventDefault(); }
        else if (e.key === 'ArrowRight') { showInViewer(boxIndex + 1); e.preventDefault(); }
      });
      box.addEventListener('touchstart', function (e) { swipeStart = e.changedTouches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', function (e) {
        if (swipeStart === null) return;
        var dx = e.changedTouches[0].clientX - swipeStart;
        swipeStart = null;
        if (Math.abs(dx) > 50) showInViewer(boxIndex + (dx < 0 ? 1 : -1));
      }, { passive: true });
      box.addEventListener('close', function () {
        document.documentElement.classList.remove('sn-lb-open');
        hold.viewer = false;
        goTo(boxIndex, true);
      });
    }

    function openViewer(i) {
      buildViewer();
      if (!box) return;
      showInViewer(i);
      hold.viewer = true;
      schedule();
      document.documentElement.classList.add('sn-lb-open');
      box.showModal();
    }

    if (typeof window.HTMLDialogElement === 'undefined') {
      if (expandBtn) expandBtn.hidden = true;
    } else {
      if (expandBtn) expandBtn.addEventListener('click', function () { openViewer(current); });
      slides.forEach(function (s, k) { s.addEventListener('click', function () { openViewer(k); }); });
    }

    syncPlay();
    setActive(0);
  }
})();
