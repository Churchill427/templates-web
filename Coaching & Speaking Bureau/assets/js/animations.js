/* ============================================
   ANIMATIONS MODULE
   Scroll reveal, counters, and effects
   ============================================ */
'use strict';

const Animations = (() => {
  let observer = null;

  /**
   * Initialize Intersection Observer for scroll reveals
   */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Animate counting numbers
   */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));
  }

  /**
   * Animate a single counter element
   * @param {HTMLElement} el
   */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = parseInt(el.getAttribute('data-duration') || '2000', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(start + (target - start) * eased);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Easing function
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Initialize parallax-like effects
   */
  function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * Initialize staggered animations for children
   */
  function initStagger() {
    const containers = document.querySelectorAll('[data-stagger]');
    if (!containers.length) return;

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = entry.target.children;
            const delay = parseInt(entry.target.getAttribute('data-stagger') || '100', 10);

            Array.from(children).forEach((child, index) => {
              child.style.transitionDelay = `${index * delay}ms`;
              child.classList.add('visible');
            });

            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    containers.forEach(el => staggerObserver.observe(el));
  }

  /**
   * Initialize all animations
   */
  function init() {
    initScrollReveal();
    initCounters();
    initParallax();
    initStagger();
  }

  return { init, animateCounter };
})();

document.addEventListener('DOMContentLoaded', Animations.init);
