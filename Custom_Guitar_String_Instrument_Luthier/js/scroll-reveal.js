/**
 * FRET — Scroll Reveal Animation System
 * Uses IntersectionObserver to trigger animations when elements enter viewport.
 * Respects prefers-reduced-motion media query.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // If reduced motion is preferred, immediately reveal everything
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  // Configuration for the observer
  const observerOptions = {
    root: null,           // use viewport
    rootMargin: '0px',    // margin around root
    threshold: 0.15       // trigger when 15% of element is visible
  };

  // Callback for when elements intersect
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the 'revealed' class to trigger CSS transition
        entry.target.classList.add('revealed');
        
        // Specific handling for draw-line SVG animations
        if (entry.target.classList.contains('draw-line')) {
          entry.target.classList.add('animated');
        }
        
        // Optional: stop observing once revealed (run once)
        if (!entry.target.hasAttribute('data-reveal-repeat')) {
          observer.unobserve(entry.target);
        }
      } else if (entry.target.hasAttribute('data-reveal-repeat')) {
        // If element should animate every time it enters viewport
        entry.target.classList.remove('revealed');
        if (entry.target.classList.contains('draw-line')) {
          entry.target.classList.remove('animated');
        }
      }
    });
  };

  // Create the observer instance
  const revealObserver = new IntersectionObserver(observerCallback, observerOptions);

  // Target all elements with the .reveal class
  const revealElements = document.querySelectorAll('.reveal, .draw-line');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});
