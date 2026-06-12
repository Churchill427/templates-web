/* ============================================
   WASH — Animations Module
   ============================================ */
'use strict';

const AnimationManager = (() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Scroll Reveal --- */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
      observer.observe(el);
    });
  }

  /* --- Animated Counters --- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const duration = prefersReducedMotion ? 0 : 2000;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    if (duration === 0) {
      el.textContent = prefix + target.toLocaleString() + suffix;
    } else {
      requestAnimationFrame(update);
    }
  }

  /* --- Countdown Timer --- */
  function initCountdown() {
    const countdownEl = document.querySelector('[data-countdown]');
    if (!countdownEl) return;

    const targetDate = new Date(countdownEl.getAttribute('data-countdown')).getTime();

    function update() {
      const now = Date.now();
      const diff = Math.max(targetDate - now, 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = countdownEl.querySelector('[data-unit="days"]');
      const hoursEl = countdownEl.querySelector('[data-unit="hours"]');
      const minutesEl = countdownEl.querySelector('[data-unit="minutes"]');
      const secondsEl = countdownEl.querySelector('[data-unit="seconds"]');

      if (daysEl) updateFlip(daysEl, String(days).padStart(2, '0'));
      if (hoursEl) updateFlip(hoursEl, String(hours).padStart(2, '0'));
      if (minutesEl) updateFlip(minutesEl, String(minutes).padStart(2, '0'));
      if (secondsEl) updateFlip(secondsEl, String(seconds).padStart(2, '0'));

      if (diff > 0) {
        requestAnimationFrame(update);
      }
    }

    // Use setInterval for 1s updates instead of rAF for efficiency
    function tick() {
      update();
    }

    tick();
    setInterval(tick, 1000);
  }

  function updateFlip(el, value) {
    if (el.textContent !== value) {
      if (!prefersReducedMotion) {
        el.style.transform = 'scaleY(0.8)';
        el.style.opacity = '0.5';
        setTimeout(() => {
          el.textContent = value;
          el.style.transform = 'scaleY(1)';
          el.style.opacity = '1';
        }, 100);
      } else {
        el.textContent = value;
      }
    }
  }

  /* --- Before/After Slider --- */
  function initBeforeAfterSliders() {
    document.querySelectorAll('.ba-slider').forEach(slider => {
      let isDown = false;

      function updateSlider(x) {
        const rect = slider.getBoundingClientRect();
        let pos = ((x - rect.left) / rect.width) * 100;
        pos = Math.max(5, Math.min(95, pos));

        const before = slider.querySelector('.ba-before');
        const handle = slider.querySelector('.ba-handle');

        if (before) before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
        if (handle) handle.style.left = pos + '%';
      }

      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        updateSlider(e.clientX);
      });

      document.addEventListener('mousemove', (e) => {
        if (isDown) updateSlider(e.clientX);
      });

      document.addEventListener('mouseup', () => { isDown = false; });

      // Touch support
      slider.addEventListener('touchstart', (e) => {
        isDown = true;
        updateSlider(e.touches[0].clientX);
      }, { passive: true });

      slider.addEventListener('touchmove', (e) => {
        if (isDown) updateSlider(e.touches[0].clientX);
      }, { passive: true });

      slider.addEventListener('touchend', () => { isDown = false; });
    });
  }

  /* --- Parallax (subtle) --- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- Init all --- */
  function init() {
    initScrollReveal();
    initCounters();
    initCountdown();
    initBeforeAfterSliders();
    initParallax();
  }

  return { init, animateCounter, initScrollReveal };
})();

document.addEventListener('DOMContentLoaded', AnimationManager.init);
