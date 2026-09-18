/**
 * FRET — Animated Counters
 * Animates numbers counting up when they scroll into view (Home 2).
 * Respects prefers-reduced-motion.
 */

document.addEventListener('DOMContentLoaded', () => {
  const counterNumbers = document.querySelectorAll('.counter-number');
  if (!counterNumbers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // ms
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    
    let frame = 0;
    
    // Easing function (easeOutExpo)
    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      const current = Math.round(target * progress);
      
      el.textContent = current + suffix;

      if (frame === totalFrames) {
        clearInterval(counter);
        el.textContent = target + suffix;
      }
    }, frameRate);
  };

  if (prefersReducedMotion) {
    // Instantly set to target values
    counterNumbers.forEach(el => {
      const target = el.getAttribute('data-target');
      const suffix = el.getAttribute('data-suffix') || '';
      el.textContent = target + suffix;
    });
    return;
  }

  // Use IntersectionObserver to start animation
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target); // Run once
      }
    });
  }, observerOptions);

  counterNumbers.forEach(el => {
    observer.observe(el);
  });
});
