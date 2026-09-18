/* ============================================================
   POPZ Countdown Timer
   Reusable countdown for Seasonal Specials & Coming Soon page.
   ============================================================ */

(function () {
  'use strict';

  /**
   * Initialize all countdown timers on the page.
   * Each timer element should have data-target-date attribute.
   */
  function initCountdowns() {
    var timers = document.querySelectorAll('.js-countdown');
    timers.forEach(function (timer) {
      var targetDate = timer.getAttribute('data-target-date');
      if (targetDate) {
        startCountdown(timer, new Date(targetDate).getTime());
      }
    });
  }

  /**
   * Start a countdown timer that updates every second.
   * @param {HTMLElement} container - The countdown container element
   * @param {number} targetTime - Target timestamp in milliseconds
   */
  function startCountdown(container, targetTime) {
    var daysEl = container.querySelector('[id$="-days"], .countdown__number:nth-child(1)') ||
                 container.querySelectorAll('.countdown__number')[0];
    var hoursEl = container.querySelectorAll('.countdown__number')[1];
    var minsEl = container.querySelectorAll('.countdown__number')[2];
    var secsEl = container.querySelectorAll('.countdown__number')[3];

    function update() {
      var now = Date.now();
      var diff = targetTime - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = padZero(days);
      if (hoursEl) hoursEl.textContent = padZero(hours);
      if (minsEl) minsEl.textContent = padZero(mins);
      if (secsEl) secsEl.textContent = padZero(secs);

      requestAnimationFrame(function () {
        setTimeout(update, 1000);
      });
    }

    update();
  }

  /**
   * Pad a number with a leading zero if less than 10.
   */
  function padZero(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdowns);
  } else {
    initCountdowns();
  }

})();
