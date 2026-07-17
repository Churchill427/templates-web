/* ============================================
   CRUM BAKERY — ANIMATIONS JS
   Scroll Reveal, Parallax, Counters, Carousel
   ============================================ */

'use strict';

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
const ScrollReveal = {
  observer: null,

  init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .mask-reveal, .mask-reveal-left').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .mask-reveal, .mask-reveal-left').forEach(el => {
      this.observer.observe(el);
    });
  },

  // Re-observe new elements (for dynamically added content)
  observe(elements) {
    if (!this.observer) return;
    if (elements instanceof Element) elements = [elements];
    elements.forEach(el => this.observer.observe(el));
  }
};


/* ============================================
   PARALLAX EFFECT
   ============================================ */
const Parallax = {
  elements: [],

  init() {
    this.elements = [...document.querySelectorAll('[data-parallax]')];
    if (!this.elements.length) return;

    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => this.update());
    }, { passive: true });

    this.update();
  },

  update() {
    const scrollY = window.scrollY;

    this.elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const rect = el.getBoundingClientRect();
      const offsetTop = rect.top + scrollY;
      const viewHeight = window.innerHeight;

      // Only parallax when element is in viewport
      if (scrollY + viewHeight > offsetTop && scrollY < offsetTop + el.offsetHeight) {
        const yPos = (scrollY - offsetTop) * speed;
        el.style.transform = `translateY(${yPos}px) scale(1.1)`;
      }
    });
  }
};


/* ============================================
   COUNTER ANIMATION (Count Up)
   ============================================ */
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animate(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.countSuffix || '';
    const duration = parseInt(el.dataset.countDuration, 10) || 2000;
    const start = 0;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(start + (target - start) * eased);
      
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
};


/* ============================================
   CHARACTER-BY-CHARACTER REVEAL
   ============================================ */
const CharReveal = {
  init() {
    const elements = document.querySelectorAll('[data-char-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    elements.forEach(el => observer.observe(el));
  },

  animate(el) {
    const text = el.textContent;
    const delay = parseInt(el.dataset.charDelay, 10) || 50;
    el.textContent = '';
    el.classList.add('char-reveal');

    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${i * delay}ms`;
      el.appendChild(span);
    });
  }
};


/* ============================================
   CAROUSEL / SLIDER
   ============================================ */
const Carousel = {
  init() {
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
      this.setup(carousel);
    });
  },

  setup(container) {
    const track = container.querySelector('.carousel-track');
    const slides = [...track.querySelectorAll('.carousel-slide')];
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const dotsContainer = container.querySelector('.carousel-dots');
    const autoplay = container.dataset.autoplay === 'true';
    const interval = parseInt(container.dataset.interval, 10) || 5000;

    let currentIndex = 0;
    let autoplayTimer;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = slides.length - 1;
      if (currentIndex >= slides.length) currentIndex = 0;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }

      // Update slides active state
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Autoplay
    if (autoplay) {
      autoplayTimer = setInterval(next, interval);
      
      container.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
      container.addEventListener('mouseleave', () => {
        autoplayTimer = setInterval(next, interval);
      });
    }

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
      isDragging = false;
    }, { passive: true });

    // Keyboard nav
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // Initialize first slide
    goTo(0);
  }
};


/* ============================================
   TIMELINE ANIMATION
   ============================================ */
const Timeline = {
  init() {
    const timelines = document.querySelectorAll('.timeline');
    if (!timelines.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Animate each timeline item sequentially
          const items = entry.target.querySelectorAll('.timeline-item');
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('revealed');
            }, i * 300);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    timelines.forEach(t => observer.observe(t));
  }
};


/* ============================================
   FILTER / MASONRY
   ============================================ */
const Filter = {
  init() {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      this.setup(group);
    });
  },

  setup(group) {
    const pills = group.querySelectorAll('.filter-pill');
    const targetId = group.dataset.filterGroup;
    const grid = document.getElementById(targetId);
    if (!grid) return;

    const items = [...grid.querySelectorAll('[data-filter-category]')];

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Update active state
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;

        items.forEach(item => {
          if (filter === 'all' || item.dataset.filterCategory === filter) {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
};


/* ============================================
   COUNTDOWN TIMER
   ============================================ */
const Countdown = {
  init() {
    const countdowns = document.querySelectorAll('[data-countdown]');
    if (!countdowns.length) return;

    countdowns.forEach(el => {
      const target = new Date(el.dataset.countdown).getTime();
      this.update(el, target);
      setInterval(() => this.update(el, target), 1000);
    });
  },

  update(el, target) {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = el.querySelector('[data-countdown-days]');
    const hoursEl = el.querySelector('[data-countdown-hours]');
    const minutesEl = el.querySelector('[data-countdown-minutes]');
    const secondsEl = el.querySelector('[data-countdown-seconds]');

    if (daysEl) this.updateUnit(daysEl, days);
    if (hoursEl) this.updateUnit(hoursEl, hours);
    if (minutesEl) this.updateUnit(minutesEl, minutes);
    if (secondsEl) this.updateUnit(secondsEl, seconds);
  },

  updateUnit(el, value) {
    const formatted = String(value).padStart(2, '0');
    if (el.textContent !== formatted) {
      el.classList.add('flip-animation');
      el.textContent = formatted;
      setTimeout(() => el.classList.remove('flip-animation'), 600);
    }
  }
};


/* ============================================
   HORIZONTAL SCROLL WITH DRAG
   ============================================ */
const DragScroll = {
  init() {
    document.querySelectorAll('.drag-scroll').forEach(container => {
      let isDown = false;
      let startX;
      let scrollLeft;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('dragging');
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('dragging');
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });
    });
  }
};


/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  ScrollReveal.init();
  Parallax.init();
  CounterAnimation.init();
  CharReveal.init();
  Carousel.init();
  Timeline.init();
  Filter.init();
  Countdown.init();
  DragScroll.init();
});

// Export
window.CrumAnimations = {
  ScrollReveal,
  Parallax,
  CounterAnimation,
  CharReveal,
  Carousel,
  Timeline,
  Filter,
  Countdown,
  DragScroll
};
