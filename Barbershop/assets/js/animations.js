/* ============================================================
   SHARP — Animations Module
   Scroll Reveal, Counter Animations, Parallax, Timeline Draw
   ============================================================ */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── SCROLL REVEAL (IntersectionObserver) ─────────────────
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // Show all elements immediately
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ─── COUNTER ANIMATION ───────────────────────────────────
  function animateCounter(element, target, suffix = '', prefix = '') {
    if (prefersReducedMotion) {
      element.textContent = prefix + target + suffix;
      return;
    }

    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * eased);

      element.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';

            if (!isNaN(target)) {
              animateCounter(el, target, suffix, prefix);
            }

            counterObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    document.querySelectorAll('[data-count]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  // ─── PARALLAX EFFECT ─────────────────────────────────────
  function initParallax() {
    if (prefersReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const offset = (scrollY - elementTop) * speed;

        el.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── TIMELINE LINE DRAW ──────────────────────────────────
  function initTimelineDraw() {
    if (prefersReducedMotion) return;

    const connectors = document.querySelectorAll('.timeline__connector');
    if (!connectors.length) return;

    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'drawLine 1s ease forwards';
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    connectors.forEach(connector => {
      connector.style.width = '0';
      timelineObserver.observe(connector);
    });
  }

  // ─── STAGGERED FADE-IN ───────────────────────────────────
  function initStaggeredFadeIn() {
    if (prefersReducedMotion) return;

    const staggerContainers = document.querySelectorAll('.stagger');
    if (!staggerContainers.length) return;

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.reveal');
            children.forEach((child, index) => {
              child.style.transitionDelay = `${index * 0.1}s`;
              child.classList.add('revealed');
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    staggerContainers.forEach(container => {
      staggerObserver.observe(container);
    });
  }

  // ─── COUNTDOWN TIMER ─────────────────────────────────────
  function initCountdown() {
    const countdownEl = document.querySelector('.countdown');
    if (!countdownEl) return;

    const targetDate = countdownEl.getAttribute('data-target');
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minutesEl.textContent = '0';
        secondsEl.textContent = '0';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = days;
      hoursEl.textContent = hours;
      minutesEl.textContent = minutes;
      secondsEl.textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ─── IMAGE LAZY LOADING ENHANCEMENT ──────────────────────
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback with IntersectionObserver
      const lazyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
              }
              img.removeAttribute('loading');
              lazyObserver.unobserve(img);
            }
          });
        },
        {
          rootMargin: '200px'
        }
      );

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        lazyObserver.observe(img);
      });
    }
  }

  // ─── HOVER GRAYSCALE TO COLOR (Team Cards) ────────────────
  function initGrayscaleHover() {
    const grayscaleImages = document.querySelectorAll('[data-grayscale]');

    grayscaleImages.forEach(img => {
      img.style.filter = 'grayscale(100%)';
      img.style.transition = 'filter 0.5s ease';

      const card = img.closest('.card');
      if (card) {
        card.addEventListener('mouseenter', () => {
          img.style.filter = 'grayscale(0%)';
        });
        card.addEventListener('mouseleave', () => {
          img.style.filter = 'grayscale(100%)';
        });
      }
    });
  }

  // ─── INIT ─────────────────────────────────────────────────
  function init() {
    initScrollReveal();
    initCounters();
    initParallax();
    initTimelineDraw();
    initStaggeredFadeIn();
    initCountdown();
    initLazyImages();
    initGrayscaleHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
