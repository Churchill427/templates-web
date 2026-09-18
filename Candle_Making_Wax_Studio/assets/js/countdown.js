/* ============================================================
   LUME — Countdown Timer (Coming Soon page)
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('launch-countdown');
    if (!container) return;

    // Set launch date to 30 days from now
    var launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    function update() {
      var now = new Date();
      var diff = launchDate - now;

      if (diff <= 0) {
        container.innerHTML = '<div style="text-align:center;"><h3 style="color:var(--color-primary);">We\'re Live!</h3></div>';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      var els = {
        d: document.getElementById('cs-days'),
        h: document.getElementById('cs-hours'),
        m: document.getElementById('cs-minutes'),
        s: document.getElementById('cs-seconds')
      };

      if (els.d) els.d.textContent = String(days).padStart(2, '0');
      if (els.h) els.h.textContent = String(hours).padStart(2, '0');
      if (els.m) els.m.textContent = String(minutes).padStart(2, '0');
      if (els.s) els.s.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  });
})();
