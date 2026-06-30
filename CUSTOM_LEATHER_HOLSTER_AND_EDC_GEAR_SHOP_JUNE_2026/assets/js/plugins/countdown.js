/* ============================================================
   GRAIN LEATHER WORKS — Countdown Timer Plugin
   Targets 30 days from now by default
   ============================================================ */

'use strict';

const CountdownTimer = {
  init() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Target: 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    targetDate.setHours(0, 0, 0, 0);

    const update = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CountdownTimer.init();
});
