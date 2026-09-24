/* ============================================================
   PUTT — Global JavaScript
   Theme, RTL, Navigation, Scroll Reveals, Counters, Accordions
   ============================================================ */

(function () {
  'use strict';

  /* ==================== THEME MANAGEMENT ==================== */
  const ThemeManager = {
    init() {
      const saved = localStorage.getItem('putt-theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      // Listen for system changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('putt-theme')) {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
    },
    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('putt-theme', next);
    }
  };

  /* ==================== RTL/LTR MANAGEMENT ==================== */
  const DirManager = {
    init() {
      const saved = localStorage.getItem('putt-dir');
      if (saved) {
        document.documentElement.setAttribute('dir', saved);
      }
      this.updateButtons();
    },
    toggle() {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('putt-dir', next);
      this.updateButtons();
    },
    updateButtons() {
      const dir = document.documentElement.getAttribute('dir') || 'ltr';
      document.querySelectorAll('.rtl-toggle').forEach(btn => {
        btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      });
    }
  };

  /* ==================== NAVBAR ==================== */
  const Navbar = {
    init() {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      // Scroll effect
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
      });

      // Hamburger
      const hamburger = document.querySelector('.hamburger');
      const mobileNav = document.querySelector('.mobile-nav');
      if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          mobileNav.classList.toggle('open');
          document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        mobileNav.querySelectorAll('.nav-link:not(.nav-dropdown-btn)').forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
          });
        });
      }

      // Desktop dropdowns (Home, Dashboard)
      document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Close other open dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(other => {
              if (other !== dropdown) other.classList.remove('open');
            });
            dropdown.classList.toggle('open');
          });
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
          document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        }
      });

      // Mobile dropdowns
      document.querySelectorAll('.mobile-nav-dropdown').forEach(mobileDropdown => {
        const btn = mobileDropdown.querySelector('.nav-dropdown-btn');
        const menu = mobileDropdown.querySelector('.mobile-nav-dropdown-menu');
        if (btn && menu) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            menu.classList.toggle('open');
            mobileDropdown.classList.toggle('open');
          });
        }
      });
    }
  };

  /* ==================== SCROLL REVEAL ==================== */
  const ScrollReveal = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
  };

  /* ==================== COUNTER ANIMATION ==================== */
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
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(step);
    }
  };

  /* ==================== ACCORDION ==================== */
  const Accordion = {
    init() {
      document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          const item = header.parentElement;
          const body = item.querySelector('.accordion-body');
          const isOpen = item.classList.contains('open');

          // Close all in same accordion group
          const group = item.closest('.accordion-group');
          if (group) {
            group.querySelectorAll('.accordion-item').forEach(other => {
              other.classList.remove('open');
              other.querySelector('.accordion-body').style.maxHeight = null;
            });
          }

          if (!isOpen) {
            item.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
          } else {
            item.classList.remove('open');
            body.style.maxHeight = null;
          }
        });
      });
    }
  };

  /* ==================== TABS ==================== */
  const Tabs = {
    init() {
      document.querySelectorAll('.tabs-nav').forEach(nav => {
        const container = nav.closest('.tabs-container') || nav.parentElement;
        nav.querySelectorAll('.tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            // Update active tab button
            nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show active panel
            const target = btn.getAttribute('data-tab');
            container.querySelectorAll('.tab-panel').forEach(panel => {
              panel.classList.remove('active');
            });
            const targetPanel = container.querySelector(`#${target}`);
            if (targetPanel) targetPanel.classList.add('active');
          });
        });
      });
    }
  };

  /* ==================== LIGHTBOX ==================== */
  const Lightbox = {
    init() {
      const overlay = document.querySelector('.lightbox-overlay');
      if (!overlay) return;

      const img = overlay.querySelector('.lightbox-img');
      const closeBtn = overlay.querySelector('.lightbox-close');

      document.querySelectorAll('[data-lightbox]').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const lbSrc = trigger.getAttribute('data-lightbox');
          img.src = (lbSrc && lbSrc !== 'true') ? lbSrc : trigger.src;
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      });

      const close = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    }
  };

  /* ==================== FORM VALIDATION ==================== */
  const FormValidation = {
    init() {
      document.querySelectorAll('form[data-validate]').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          let valid = true;

          form.querySelectorAll('[required]').forEach(input => {
            const error = input.closest('.form-group')?.querySelector('.form-error');
            if (!input.value.trim()) {
              input.classList.add('error');
              if (error) {
                error.textContent = 'This field is required';
                error.classList.add('visible');
              }
              valid = false;
            } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
              input.classList.add('error');
              if (error) {
                error.textContent = 'Please enter a valid email address';
                error.classList.add('visible');
              }
              valid = false;
            } else {
              input.classList.remove('error');
              if (error) error.classList.remove('visible');
            }
          });

          // Check password confirmation
          const pass = form.querySelector('[name="password"]');
          const confirm = form.querySelector('[name="confirmPassword"]');
          if (pass && confirm && pass.value !== confirm.value) {
            confirm.classList.add('error');
            const error = confirm.closest('.form-group')?.querySelector('.form-error');
            if (error) {
              error.textContent = 'Passwords do not match';
              error.classList.add('visible');
            }
            valid = false;
          }

          // Check terms checkbox
          const terms = form.querySelector('[name="terms"]');
          if (terms && !terms.checked) {
            const error = terms.closest('.form-group')?.querySelector('.form-error');
            if (error) {
              error.textContent = 'You must accept the terms';
              error.classList.add('visible');
            }
            valid = false;
          }

          if (valid) {
            const successMsg = form.querySelector('.form-success');
            if (successMsg) {
              successMsg.classList.add('visible');
              form.reset();
              setTimeout(() => successMsg.classList.remove('visible'), 4000);
            }
          }
        });

        // Clear errors on input
        form.querySelectorAll('input, select, textarea').forEach(input => {
          input.addEventListener('input', () => {
            input.classList.remove('error');
            const error = input.closest('.form-group')?.querySelector('.form-error');
            if (error) error.classList.remove('visible');
          });
        });
      });
    }
  };

  /* ==================== PASSWORD STRENGTH ==================== */
  const PasswordStrength = {
    init() {
      document.querySelectorAll('[data-strength]').forEach(input => {
        const meter = input.closest('.form-group')?.querySelector('.strength-meter');
        if (!meter) return;

        input.addEventListener('input', () => {
          const val = input.value;
          let strength = 0;
          if (val.length >= 6) strength++;
          if (val.length >= 10) strength++;
          if (/[A-Z]/.test(val)) strength++;
          if (/[0-9]/.test(val)) strength++;
          if (/[^A-Za-z0-9]/.test(val)) strength++;

          const bars = meter.querySelectorAll('.strength-bar');
          bars.forEach((bar, i) => {
            bar.className = 'strength-bar';
            if (i < strength) {
              if (strength <= 2) bar.classList.add('weak');
              else if (strength <= 3) bar.classList.add('medium');
              else bar.classList.add('strong');
            }
          });
        });
      });
    }
  };

  /* ==================== PASSWORD TOGGLE ==================== */
  const PasswordToggle = {
    init() {
      document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
          const input = toggle.closest('.password-toggle-wrap').querySelector('input');
          const type = input.type === 'password' ? 'text' : 'password';
          input.type = type;
          // Update icon
          const showIcon = toggle.querySelector('.icon-eye');
          const hideIcon = toggle.querySelector('.icon-eye-off');
          if (showIcon && hideIcon) {
            showIcon.style.display = type === 'password' ? 'block' : 'none';
            hideIcon.style.display = type === 'password' ? 'none' : 'block';
          }
        });
      });
    }
  };

  /* ==================== COUNTDOWN TIMER ==================== */
  const Countdown = {
    init() {
      const el = document.querySelector('.countdown');
      if (!el) return;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 45); // 45 days from now

      const update = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const daysEl = el.querySelector('[data-countdown="days"]');
        const hoursEl = el.querySelector('[data-countdown="hours"]');
        const minutesEl = el.querySelector('[data-countdown="minutes"]');
        const secondsEl = el.querySelector('[data-countdown="seconds"]');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      };

      update();
      setInterval(update, 1000);
    }
  };

  /* ==================== BLOG SEARCH FILTER ==================== */
  const BlogSearch = {
    init() {
      const searchInput = document.querySelector('#blogSearch');
      const cards = document.querySelectorAll('.blog-card');
      if (!searchInput || !cards.length) return;

      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(query) ? '' : 'none';
        });
      });

      // Tag filter
      document.querySelectorAll('.tag[data-tag]').forEach(tag => {
        tag.addEventListener('click', () => {
          document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
          tag.classList.add('active');
          const tagValue = tag.getAttribute('data-tag');

          cards.forEach(card => {
            if (tagValue === 'all') {
              card.style.display = '';
            } else {
              const cardTags = card.getAttribute('data-tags') || '';
              card.style.display = cardTags.includes(tagValue) ? '' : 'none';
            }
          });
        });
      });
    }
  };

  /* ==================== MARQUEE DUPLICATION ==================== */
  const Marquee = {
    init() {
      document.querySelectorAll('.marquee-inner').forEach(inner => {
        const clone = inner.innerHTML;
        inner.innerHTML = clone + clone;
      });
    }
  };

  /* ==================== GLOBAL INIT ==================== */
  function initGlobal() {
    ThemeManager.init();
    DirManager.init();
    Navbar.init();
    ScrollReveal.init();
    CounterAnimation.init();
    Accordion.init();
    Tabs.init();
    Lightbox.init();
    FormValidation.init();
    PasswordStrength.init();
    PasswordToggle.init();
    Countdown.init();
    BlogSearch.init();
    Marquee.init();

    // Theme toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => ThemeManager.toggle());
    });

    // RTL toggle buttons
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.addEventListener('click', () => DirManager.toggle());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobal);
  } else {
    initGlobal();
  }
})();
