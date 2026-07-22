/**
 * HOME - Home Appliance Store & Service Center
 * Coming Soon Live Countdown Timer (assets/js/countdown.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
});

function initCountdownTimer() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Set launch target to 30 days in future
  const launchDate = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  const notifyForm = document.getElementById('notify-form');
  if (notifyForm) {
    notifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = notifyForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        if (typeof showToast === 'function') {
          showToast(`Thank you! We will notify ${emailInput.value} when we launch.`);
        }
        notifyForm.reset();
      }
    });
  }
}
