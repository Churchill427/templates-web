/* ============================================
   PAWLY — Scroll Animations
   IntersectionObserver, Counters, Parallax
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounterAnimations();
  initParallax();
  initStaggerChildren();
});

/* ── Scroll-Triggered Fade Animations ── */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-scale-in, .anim-ready'
  );

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ── Counter Animations ── */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.counter, 10);
  const suffix = element.dataset.counterSuffix || '';
  const prefix = element.dataset.counterPrefix || '';
  const duration = parseInt(element.dataset.counterDuration, 10) || 2000;

  let start = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(updateCounter);
}

/* ── Parallax Effect ── */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-bg');

  if (parallaxElements.length === 0) return;

  function updateParallax() {
    const scrollY = window.pageYOffset;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const offset = (scrollY - elementTop) * speed;

      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  // Use passive listener for performance
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  }, { passive: true });
}

/* ── Stagger Children Animation ── */
function initStaggerChildren() {
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  if (staggerContainers.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const delay = parseInt(container.dataset.stagger, 10) || 100;
        const children = container.children;

        Array.from(children).forEach((child, index) => {
          child.style.transitionDelay = `${index * delay}ms`;
          child.classList.add('anim-visible');
        });

        observer.unobserve(container);
      }
    });
  }, {
    threshold: 0.1
  });

  staggerContainers.forEach(container => {
    // Add initial state to children
    Array.from(container.children).forEach(child => {
      if (!child.classList.contains('anim-fade-up') &&
          !child.classList.contains('anim-scale-in')) {
        child.classList.add('anim-fade-up');
      }
    });
    observer.observe(container);
  });
}

/* ── Before/After Slider ── */
function initBeforeAfterSliders() {
  document.querySelectorAll('.before-after-slider').forEach(slider => {
    const handle = slider.querySelector('.slider-handle');
    const afterImg = slider.querySelector('.after-image');

    if (!handle || !afterImg) return;

    let isDragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let percentage = ((x - rect.left) / rect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      handle.style.left = `${percentage}%`;
      afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        setPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Keyboard support
    handle.addEventListener('keydown', (e) => {
      const rect = slider.getBoundingClientRect();
      const currentLeft = parseFloat(handle.style.left) || 50;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newPos = Math.max(0, currentLeft - 2);
        handle.style.left = `${newPos}%`;
        afterImg.style.clipPath = `inset(0 ${100 - newPos}% 0 0)`;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newPos = Math.min(100, currentLeft + 2);
        handle.style.left = `${newPos}%`;
        afterImg.style.clipPath = `inset(0 ${100 - newPos}% 0 0)`;
      }
    });

    // Initialize at 50%
    handle.style.left = '50%';
    afterImg.style.clipPath = 'inset(0 50% 0 0)';
  });
}

/* ── Carousel ── */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelector('.carousel-dots');

    if (!track) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;
    const autoSlideInterval = parseInt(carousel.dataset.autoSlide, 10) || 0;
    let autoTimer = null;

    function updateCarousel() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      // Update dots
      if (dots) {
        dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Create dots
    if (dots && slides.length > 1) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dots.appendChild(dot);
      });
    }

    // Auto-slide
    if (autoSlideInterval > 0) {
      autoTimer = setInterval(nextSlide, autoSlideInterval);

      carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
      carousel.addEventListener('mouseleave', () => {
        autoTimer = setInterval(nextSlide, autoSlideInterval);
      });
    }

    // Handle resize
    window.addEventListener('resize', debounce(updateCarousel, 250));
  });
}

/* ── Countdown Timer ── */
function initCountdown() {
  const countdownEl = document.querySelector('[data-countdown]');
  if (!countdownEl) return;

  const targetDate = new Date(countdownEl.dataset.countdown).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownEl.innerHTML = '<span class="countdown-ended">We\'re Live!</span>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = countdownEl.querySelector('[data-days]');
    const hoursEl = countdownEl.querySelector('[data-hours]');
    const minutesEl = countdownEl.querySelector('[data-minutes]');
    const secondsEl = countdownEl.querySelector('[data-seconds]');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ── Gallery Filter ── */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter .tag');
  const items = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0 || items.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      items.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Initialize additional interactive components
document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSliders();
  initCarousels();
  initCountdown();
  initGalleryFilter();
});
