/* ============================================
   AquaLux — Scroll Animations
   Intersection Observer + Counter Animation
   ============================================ */

'use strict';

const ScrollAnimations = (() => {
  // ============================================
  // 1. SCROLL REVEAL (Intersection Observer)
  // ============================================
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ============================================
  // 2. COUNTER ANIMATION
  // ============================================
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // 3. PARALLAX (subtle)
  // ============================================
  function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    // Only on desktop
    if (window.innerWidth < 1024) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const yPos = -(scrollY * speed);
          el.style.transform = `translateY(${yPos}px)`;
        }
      });
    }, { passive: true });
  }

  // ============================================
  // 4. PROGRESS BARS
  // ============================================
  function initProgressBars() {
    const bars = document.querySelectorAll('[data-progress]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.progress-bar__fill');
          if (fill) {
            fill.style.width = entry.target.dataset.progress + '%';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(el => observer.observe(el));
  }

  // ============================================
  // 5. TYPEWRITER EFFECT
  // ============================================
  function typewriter(element, texts, speed = 80, pause = 2000) {
    if (!element) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? speed / 2 : speed;

      if (!isDeleting && charIndex === currentText.length) {
        delay = pause;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        delay = speed / 2;
      }

      setTimeout(type, delay);
    }

    type();
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    initReveal();
    initCounters();
    initParallax();
    initProgressBars();

    // Typewriter elements
    const tw = document.querySelector('[data-typewriter]');
    if (tw) {
      const texts = JSON.parse(tw.dataset.typewriter);
      typewriter(tw, texts);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, typewriter, animateCounter };
})();
