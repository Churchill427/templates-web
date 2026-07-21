/* ============================================================
   DENT — Main JavaScript
   Navigation, Theme, RTL, Scroll Animations, Form Validation
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. THEME MANAGEMENT (Dark/Light Mode)
  // ============================================================
  const ThemeManager = {
    STORAGE_KEY: 'dent-theme',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.set(saved, false);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.set(prefersDark ? 'dark' : 'light', false);
      }
      this.bindToggle();
    },

    set(theme, persist = true) {
      document.documentElement.setAttribute('data-theme', theme);
      if (persist) localStorage.setItem(this.STORAGE_KEY, theme);
      this.updateIcons(theme);
    },

    get() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    toggle() {
      this.set(this.get() === 'light' ? 'dark' : 'light');
    },

    updateIcons(theme) {
      document.querySelectorAll('.theme-toggle-icon').forEach(el => {
        el.className = theme === 'light'
          ? 'fa-solid fa-moon theme-toggle-icon'
          : 'fa-solid fa-sun theme-toggle-icon';
      });
      document.querySelectorAll('.theme-toggle-text').forEach(el => {
        el.textContent = theme === 'light' ? '' : '';
      });
    },

    bindToggle() {
      document.querySelectorAll('[data-toggle-theme]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      });
    }
  };

  // ============================================================
  // 2. RTL/LTR MANAGEMENT
  // ============================================================
  const RTLManager = {
    STORAGE_KEY: 'dent-direction',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      this.set(saved || 'ltr', false);
      this.bindToggle();
    },

    set(dir, persist = true) {
      document.documentElement.setAttribute('dir', dir);
      if (persist) localStorage.setItem(this.STORAGE_KEY, dir);
      this.updateLabels(dir);
    },

    get() {
      return document.documentElement.getAttribute('dir') || 'ltr';
    },

    toggle() {
      this.set(this.get() === 'ltr' ? 'rtl' : 'ltr');
    },

    updateLabels(dir) {
      document.querySelectorAll('.rtl-toggle-text').forEach(el => {
        el.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      });
    },

    bindToggle() {
      document.querySelectorAll('[data-toggle-rtl]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      });
    }
  };

  // ============================================================
  // 3. NAVBAR
  // ============================================================
  const Navbar = {
    init() {
      this.navbar = document.querySelector('.navbar');
      if (!this.navbar) return;

      this.hamburger = document.querySelector('.navbar__hamburger');
      this.mobileMenu = document.querySelector('.navbar__mobile-menu');
      this.overlay = document.querySelector('.navbar__mobile-overlay');

      this.bindScroll();
      this.bindHamburger();
      this.setActiveLink();
      this.bindDropdowns();
    },

    bindScroll() {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (window.scrollY > 50) {
              this.navbar.classList.add('scrolled');
            } else {
              this.navbar.classList.remove('scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      });
    },

    bindHamburger() {
      if (!this.hamburger) return;

      this.hamburger.addEventListener('click', () => {
        this.hamburger.classList.toggle('active');
        this.mobileMenu.classList.toggle('open');
        if (this.overlay) this.overlay.classList.toggle('show');
        document.body.style.overflow = this.mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      if (this.overlay) {
        this.overlay.addEventListener('click', () => {
          this.closeMenu();
        });
      }

      // Close on link click
      this.mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    },

    closeMenu() {
      this.hamburger?.classList.remove('active');
      this.mobileMenu?.classList.remove('open');
      this.overlay?.classList.remove('show');
      document.body.style.overflow = '';
    },

    setActiveLink() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const links = document.querySelectorAll('.navbar__links a, .mobile-links a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    },

    bindDropdowns() {
      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar__dropdown')) {
          document.querySelectorAll('.navbar__dropdown-menu').forEach(d => {
            d.classList.remove('show');
          });
        }
      });
    }
  };

  // ============================================================
  // 4. SCROLL REVEAL ANIMATIONS
  // ============================================================
  const ScrollReveal = {
    init() {
      this.elements = document.querySelectorAll('.reveal');
      if (!this.elements.length) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      this.elements.forEach(el => this.observer.observe(el));
    }
  };

  // ============================================================
  // 5. PARALLAX EFFECT
  // ============================================================
  const Parallax = {
    init() {
      this.heroes = document.querySelectorAll('.hero__bg');
      if (!this.heroes.length) return;

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            this.heroes.forEach(bg => {
              const hero = bg.closest('.hero');
              if (!hero) return;
              const rect = hero.getBoundingClientRect();
              if (rect.bottom > 0 && rect.top < window.innerHeight) {
                bg.style.transform = `translateY(${scrollY * 0.3}px)`;
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  };

  // ============================================================
  // 6. ANIMATED COUNTERS
  // ============================================================
  const CounterAnimation = {
    init() {
      this.counters = document.querySelectorAll('[data-counter]');
      if (!this.counters.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      this.counters.forEach(el => observer.observe(el));
    },

    animate(el) {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  };

  // ============================================================
  // 7. TIMELINE ANIMATION
  // ============================================================
  const TimelineAnimation = {
    init() {
      const timelines = document.querySelectorAll('.timeline');
      if (!timelines.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      timelines.forEach(tl => observer.observe(tl));
    }
  };

  // ============================================================
  // 8. ACCORDION
  // ============================================================
  const Accordion = {
    init() {
      document.querySelectorAll('.accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.accordion__item');
          const accordion = item.closest('.accordion');
          const isActive = item.classList.contains('active');

          // Close all in this accordion
          accordion.querySelectorAll('.accordion__item').forEach(i => {
            i.classList.remove('active');
          });

          // Open clicked if it was closed
          if (!isActive) {
            item.classList.add('active');
          }
        });
      });
    }
  };

  // ============================================================
  // 9. BEFORE/AFTER SLIDER
  // ============================================================
  const BASlider = {
    init() {
      document.querySelectorAll('.ba-slider').forEach(slider => {
        const before = slider.querySelector('.ba-slider__before');
        const divider = slider.querySelector('.ba-slider__divider');
        const handle = slider.querySelector('.ba-slider__handle');
        let isDragging = false;

        const move = (x) => {
          const rect = slider.getBoundingClientRect();
          let pos = ((x - rect.left) / rect.width) * 100;
          pos = Math.max(5, Math.min(95, pos));
          before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
          divider.style.left = pos + '%';
          handle.style.left = pos + '%';
        };

        slider.addEventListener('mousedown', (e) => { isDragging = true; move(e.clientX); });
        slider.addEventListener('touchstart', (e) => { isDragging = true; move(e.touches[0].clientX); }, { passive: true });

        window.addEventListener('mousemove', (e) => { if (isDragging) move(e.clientX); });
        window.addEventListener('touchmove', (e) => { if (isDragging) move(e.touches[0].clientX); }, { passive: true });

        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
      });
    }
  };

  // ============================================================
  // 10. FORM VALIDATION
  // ============================================================
  const FormValidation = {
    init() {
      document.querySelectorAll('form[data-validate]').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (this.validate(form)) {
            this.showSuccess(form);
          }
        });
      });
    },

    validate(form) {
      let valid = true;
      const fields = form.querySelectorAll('[required]');

      fields.forEach(field => {
        this.clearError(field);

        if (!field.value.trim()) {
          this.showError(field, 'This field is required');
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          this.showError(field, 'Please enter a valid email address');
          valid = false;
        } else if (field.type === 'tel' && !/^[\d\s\+\-\(\)]{7,}$/.test(field.value)) {
          this.showError(field, 'Please enter a valid phone number');
          valid = false;
        } else if (field.name === 'confirm-password') {
          const password = form.querySelector('[name="password"]');
          if (password && field.value !== password.value) {
            this.showError(field, 'Passwords do not match');
            valid = false;
          }
        }
      });

      return valid;
    },

    showError(field, message) {
      field.classList.add('form-control--error');
      let errorEl = field.nextElementSibling;
      if (!errorEl || !errorEl.classList.contains('form-error')) {
        errorEl = document.createElement('div');
        errorEl.classList.add('form-error');
        field.after(errorEl);
      }
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    },

    clearError(field) {
      field.classList.remove('form-control--error');
      const errorEl = field.nextElementSibling;
      if (errorEl && errorEl.classList.contains('form-error')) {
        errorEl.style.display = 'none';
      }
    },

    showSuccess(form) {
      const confirmation = form.closest('.section')?.querySelector('.confirmation');
      if (confirmation) {
        form.style.display = 'none';
        confirmation.style.display = 'block';
        // Generate reference number
        const refEl = confirmation.querySelector('.reference-number');
        if (refEl) {
          refEl.textContent = 'DENT-' + Date.now().toString(36).toUpperCase();
        }
      } else {
        // Generic success
        const btn = form.querySelector('[type="submit"]');
        if (btn) {
          const original = btn.textContent;
          btn.textContent = 'Submitted Successfully!';
          btn.style.background = '#20BF55';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
          }, 3000);
        }
      }
    }
  };

  // ============================================================
  // 11. COUNTDOWN TIMER (Coming Soon page)
  // ============================================================
  const CountdownTimer = {
    init() {
      const countdownEl = document.querySelector('.countdown');
      if (!countdownEl) return;

      // Set target to 30 days from now
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);

      const update = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
          countdownEl.innerHTML = '<p class="text-center" style="font-size:24px;color:var(--color-secondary);">We\'re Live!</p>';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        const daysEl = countdownEl.querySelector('[data-countdown="days"]');
        const hoursEl = countdownEl.querySelector('[data-countdown="hours"]');
        const minsEl = countdownEl.querySelector('[data-countdown="minutes"]');
        const secsEl = countdownEl.querySelector('[data-countdown="seconds"]');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
      };

      update();
      setInterval(update, 1000);
    }
  };

  // ============================================================
  // 12. SMOOTH SCROLL (for anchor links)
  // ============================================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            e.preventDefault();
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height-desktop')) || 72;
            window.scrollTo({
              top: target.offsetTop - offset,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ============================================================
  // 13. PAGE LOAD ANIMATION
  // ============================================================
  const PageLoad = {
    init() {
      window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
      });
    }
  };

  // ============================================================
  // INITIALIZE ALL MODULES
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    PageLoad.init();
    ThemeManager.init();
    RTLManager.init();
    Navbar.init();
    ScrollReveal.init();
    Parallax.init();
    CounterAnimation.init();
    TimelineAnimation.init();
    Accordion.init();
    BASlider.init();
    FormValidation.init();
    CountdownTimer.init();
    SmoothScroll.init();
  });

})();
