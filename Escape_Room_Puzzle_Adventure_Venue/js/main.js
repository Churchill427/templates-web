/* ============================================================
   MYST — Site-Wide JavaScript
   Handles: theme, RTL, navigation, animations, particles,
   forms, carousels, accordions, count-up, and more.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. THEME MANAGEMENT (Dark / Light)
  ---------------------------------------------------------- */
  const ThemeManager = {
    STORAGE_KEY: 'myst-theme',
    DARK: 'dark',
    LIGHT: 'light',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.apply(saved);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.apply(prefersDark ? this.DARK : this.LIGHT);
      }
      this.bindToggles();
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      this.updateIcons(theme);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      this.apply(current === this.DARK ? this.LIGHT : this.DARK);
    },

    updateIcons(theme) {
      document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        var sunIcon = btn.querySelector('.icon-sun');
        var moonIcon = btn.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
          sunIcon.style.display = theme === ThemeManager.DARK ? 'block' : 'none';
          moonIcon.style.display = theme === ThemeManager.DARK ? 'none' : 'block';
        }
      });
    },

    bindToggles() {
      document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          ThemeManager.toggle();
        });
      });
    }
  };

  /* ----------------------------------------------------------
     2. RTL / LTR DIRECTION MANAGEMENT
  ---------------------------------------------------------- */
  const DirectionManager = {
    STORAGE_KEY: 'myst-direction',
    RTL: 'rtl',
    LTR: 'ltr',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      this.apply(saved || this.LTR);
      this.bindToggles();
    },

    apply(dir) {
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem(this.STORAGE_KEY, dir);
      this.updateLabels(dir);
    },

    toggle() {
      const current = document.documentElement.getAttribute('dir') || this.LTR;
      this.apply(current === this.RTL ? this.LTR : this.RTL);
    },

    updateLabels(dir) {
      document.querySelectorAll('.rtl-toggle').forEach(function (btn) {
        btn.textContent = dir.toUpperCase();
      });
    },

    bindToggles() {
      document.querySelectorAll('.rtl-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          DirectionManager.toggle();
        });
      });
    }
  };

  /* ----------------------------------------------------------
     3. NAVBAR
  ---------------------------------------------------------- */
  const Navbar = {
    init() {
      this.navbar = document.querySelector('.navbar');
      if (!this.navbar) return;
      this.handleScroll();
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      this.highlightActiveLink();
    },

    handleScroll() {
      if (!this.navbar) return;
      if (window.scrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    },

    highlightActiveLink() {
      var currentPath = window.location.pathname;
      var filename = currentPath.split('/').pop() || 'index.html';
      document.querySelectorAll('.navbar__link').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href) return;
        var linkFile = href.split('/').pop();
        if (linkFile === filename || (filename === '' && linkFile === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  };

  /* ----------------------------------------------------------
     4. MOBILE HAMBURGER MENU
  ---------------------------------------------------------- */
  const MobileMenu = {
    init() {
      this.hamburger = document.querySelector('.hamburger');
      this.drawer = document.querySelector('.mobile-drawer');
      if (!this.hamburger || !this.drawer) return;

      this.hamburger.addEventListener('click', this.toggle.bind(this));

      this.drawer.querySelectorAll('.mobile-drawer__link').forEach(function (link) {
        link.addEventListener('click', function () {
          MobileMenu.close();
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') MobileMenu.close();
      });
    },

    toggle() {
      this.hamburger.classList.toggle('open');
      this.drawer.classList.toggle('open');
      document.body.style.overflow = this.drawer.classList.contains('open') ? 'hidden' : '';
    },

    close() {
      if (!this.hamburger || !this.drawer) return;
      this.hamburger.classList.remove('open');
      this.drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  /* ----------------------------------------------------------
     5. HOME SWITCHER & NAVBAR DROPDOWN
  ---------------------------------------------------------- */
  const HomeSwitcher = {
    init() {
      // 1. Desktop Navbar Dropdown (Home tab)
      var dropdowns = document.querySelectorAll('.navbar__dropdown');
      dropdowns.forEach(function (dd) {
        var toggle = dd.querySelector('.navbar__dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var isOpen = dd.classList.contains('open');

          // Close other open dropdowns
          document.querySelectorAll('.navbar__dropdown.open').forEach(function (other) {
            if (other !== dd) {
              other.classList.remove('open');
              var otherToggle = other.querySelector('.navbar__dropdown-toggle');
              if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
            }
          });

          dd.classList.toggle('open', !isOpen);
          toggle.setAttribute('aria-expanded', String(!isOpen));
        });
      });

      // 2. Mobile Drawer Dropdowns
      var drawerDropdowns = document.querySelectorAll('.mobile-drawer__dropdown');
      drawerDropdowns.forEach(function (mdd) {
        var toggle = mdd.querySelector('.mobile-drawer__dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var isOpen = mdd.classList.contains('open');
          mdd.classList.toggle('open', !isOpen);
          toggle.setAttribute('aria-expanded', String(!isOpen));
        });
      });

      // 3. Document click to close desktop dropdowns
      document.addEventListener('click', function (e) {
        dropdowns.forEach(function (dd) {
          if (!dd.contains(e.target)) {
            dd.classList.remove('open');
            var toggle = dd.querySelector('.navbar__dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          }
        });

        // Legacy switcher
        if (HomeSwitcher.container && !HomeSwitcher.container.contains(e.target)) {
          HomeSwitcher.closeMenu();
        }
      });

      // 4. Keyboard Escape to close
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          dropdowns.forEach(function (dd) {
            dd.classList.remove('open');
            var toggle = dd.querySelector('.navbar__dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          });
          HomeSwitcher.closeMenu();
        }
      });

      // 5. Backward compatibility for legacy .home-switcher
      this.container = document.querySelector('.home-switcher');
      if (this.container) {
        this.toggle = this.container.querySelector('.home-switcher__toggle');
        this.menu = this.container.querySelector('.home-switcher__menu');
        if (this.toggle && this.menu) {
          this.toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            HomeSwitcher.toggleMenu();
          });
        }
      }
    },

    toggleMenu() {
      if (!this.toggle || !this.menu) return;
      this.toggle.classList.toggle('open');
      this.menu.classList.toggle('open');
    },

    closeMenu() {
      if (!this.toggle || !this.menu) return;
      this.toggle.classList.remove('open');
      this.menu.classList.remove('open');
    }
  };

  /* ----------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  ---------------------------------------------------------- */
  const ScrollReveal = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      if (!elements.length) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      elements.forEach(function (el) {
        observer.observe(el);
      });
    }
  };

  /* ----------------------------------------------------------
     7. ANIMATED COUNT-UP
  ---------------------------------------------------------- */
  const CountUp = {
    init() {
      var counters = document.querySelectorAll('[data-count-target]');
      if (!counters.length) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            CountUp.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counters.forEach(function (counter) {
        observer.observe(counter);
      });
    },

    animate(element) {
      var target = parseFloat(element.getAttribute('data-count-target'));
      var suffix = element.getAttribute('data-count-suffix') || '';
      var prefix = element.getAttribute('data-count-prefix') || '';
      var duration = parseInt(element.getAttribute('data-count-duration')) || 2000;
      var isDecimal = target % 1 !== 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = eased * target;
        if (isDecimal) {
          element.textContent = prefix + current.toFixed(1) + suffix;
        } else {
          element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        }
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }
  };

  /* ----------------------------------------------------------
     8. EMBER PARTICLE EFFECT (Canvas)
  ---------------------------------------------------------- */
  const ParticleEffect = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var containers = document.querySelectorAll('.hero__particles');
      containers.forEach(function (container) {
        ParticleEffect.create(container);
      });
    },

    create(container) {
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var particles = [];
      var particleCount = window.innerWidth < 768 ? 20 : 40;

      function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }

      resize();
      window.addEventListener('resize', resize);

      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedY: -(Math.random() * 1.5 + 0.3),
          speedX: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.6 + 0.2,
          flickerSpeed: Math.random() * 0.02 + 0.005,
          flickerPhase: Math.random() * Math.PI * 2
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) {
          p.y += p.speedY;
          p.x += p.speedX;
          p.flickerPhase += p.flickerSpeed;
          var flicker = Math.sin(p.flickerPhase) * 0.3 + 0.7;
          var alpha = p.opacity * flicker;

          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(242, 163, 60, ' + alpha + ')';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
          gradient.addColorStop(0, 'rgba(242, 163, 60, ' + (alpha * 0.3) + ')');
          gradient.addColorStop(1, 'rgba(242, 163, 60, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }

      draw();
    }
  };

  /* ----------------------------------------------------------
     9. ACCORDION
  ---------------------------------------------------------- */
  const Accordion = {
    init() {
      document.querySelectorAll('.accordion__header').forEach(function (header) {
        header.addEventListener('click', function () {
          var item = header.parentElement;
          var body = item.querySelector('.accordion__body');
          var content = item.querySelector('.accordion__content');
          var isOpen = item.classList.contains('open');

          var accordion = item.parentElement;
          accordion.querySelectorAll('.accordion__item.open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('open');
              openItem.querySelector('.accordion__body').style.maxHeight = '0';
            }
          });

          if (isOpen) {
            item.classList.remove('open');
            body.style.maxHeight = '0';
          } else {
            item.classList.add('open');
            body.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });
    }
  };

  /* ----------------------------------------------------------
     10. FORM VALIDATION ENGINE
  ---------------------------------------------------------- */
  const FormValidator = {
    init() {
      document.querySelectorAll('form[data-validate]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (FormValidator.validateForm(form)) {
            FormValidator.showSuccess(form);
          }
        });

        form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (input) {
          input.addEventListener('blur', function () {
            FormValidator.validateField(input);
          });
          input.addEventListener('input', function () {
            var group = input.closest('.form-group');
            if (group && group.classList.contains('error')) {
              FormValidator.validateField(input);
            }
          });
        });
      });
    },

    validateForm(form) {
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!FormValidator.validateField(field)) {
          valid = false;
        }
      });
      return valid;
    },

    validateField(field) {
      var group = field.closest('.form-group');
      if (!group) return true;
      var error = group.querySelector('.form-error');
      var value = field.value.trim();
      var type = field.type;
      var isRequired = field.hasAttribute('required');

      group.classList.remove('error');

      if (isRequired && !value) {
        group.classList.add('error');
        if (error) error.textContent = 'This field is required';
        return false;
      }

      if (type === 'email' && value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          group.classList.add('error');
          if (error) error.textContent = 'Please enter a valid email address';
          return false;
        }
      }

      if (type === 'tel' && value) {
        var phonePattern = /^[\+]?[\d\s\-\(\)]{7,15}$/;
        if (!phonePattern.test(value)) {
          group.classList.add('error');
          if (error) error.textContent = 'Please enter a valid phone number';
          return false;
        }
      }

      if (field.getAttribute('data-min-length')) {
        var minLen = parseInt(field.getAttribute('data-min-length'));
        if (value.length < minLen) {
          group.classList.add('error');
          if (error) error.textContent = 'Minimum ' + minLen + ' characters required';
          return false;
        }
      }

      if (field.getAttribute('data-match')) {
        var matchField = document.querySelector(field.getAttribute('data-match'));
        if (matchField && value !== matchField.value) {
          group.classList.add('error');
          if (error) error.textContent = 'Passwords do not match';
          return false;
        }
      }

      return true;
    },

    showSuccess(form) {
      var btn = form.querySelector('.btn-primary');
      if (btn) {
        var originalText = btn.textContent;
        btn.textContent = 'Sent Successfully!';
        btn.style.background = '#1E8E3E';
        btn.style.borderColor = '#1E8E3E';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          form.reset();
        }, 2500);
      }
    }
  };

  /* ----------------------------------------------------------
     11. PASSWORD VISIBILITY TOGGLE
  ---------------------------------------------------------- */
  const PasswordToggle = {
    init() {
      document.querySelectorAll('.password-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var wrapper = btn.closest('.password-wrapper');
          var input = wrapper.querySelector('.form-input');
          if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
          } else {
            input.type = 'password';
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
          }
        });
      });
    }
  };

  /* ----------------------------------------------------------
     12. PASSWORD STRENGTH METER
  ---------------------------------------------------------- */
  const PasswordStrength = {
    init() {
      document.querySelectorAll('[data-password-strength]').forEach(function (input) {
        input.addEventListener('input', function () {
          PasswordStrength.evaluate(input);
        });
      });
    },

    evaluate(input) {
      var value = input.value;
      var container = input.closest('.form-group');
      if (!container) return;
      var bars = container.querySelectorAll('.password-strength__bar');
      var label = container.querySelector('.password-strength__label');
      var score = 0;

      if (value.length >= 6) score++;
      if (value.length >= 10) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;

      var level = score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';
      var filledCount = score <= 1 ? 1 : score <= 3 ? 2 : 3;

      bars.forEach(function (bar, i) {
        bar.classList.remove('active', 'weak', 'medium', 'strong');
        if (value.length > 0 && i < filledCount) {
          bar.classList.add('active', level);
        }
      });

      if (label) {
        if (value.length === 0) {
          label.textContent = '';
        } else {
          var labels = { weak: 'Weak password', medium: 'Fair password', strong: 'Strong password' };
          label.textContent = labels[level];
          label.style.color = level === 'weak' ? 'var(--text-error)' : level === 'medium' ? 'var(--ember-amber)' : 'var(--text-success)';
        }
      }
    }
  };

  /* ----------------------------------------------------------
     13. CAROUSEL SCROLL
  ---------------------------------------------------------- */
  const Carousel = {
    init() {
      document.querySelectorAll('.carousel').forEach(function (carousel) {
        var prevBtn = carousel.parentElement.querySelector('.carousel-prev');
        var nextBtn = carousel.parentElement.querySelector('.carousel-next');
        var scrollAmount = 360;

        if (prevBtn) {
          prevBtn.addEventListener('click', function () {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', function () {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          });
        }
      });
    }
  };

  /* ----------------------------------------------------------
     14. TABS
  ---------------------------------------------------------- */
  const Tabs = {
    init() {
      document.querySelectorAll('[data-tabs]').forEach(function (tabContainer) {
        var buttons = tabContainer.querySelectorAll('[data-tab-target]');
        var panels = tabContainer.querySelectorAll('[data-tab-panel]');

        buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            var target = btn.getAttribute('data-tab-target');
            buttons.forEach(function (b) { b.classList.remove('active'); });
            panels.forEach(function (p) { p.classList.remove('active'); p.style.display = 'none'; });
            btn.classList.add('active');
            var panel = tabContainer.querySelector('[data-tab-panel="' + target + '"]');
            if (panel) {
              panel.classList.add('active');
              panel.style.display = 'block';
            }
          });
        });
      });
    }
  };

  /* ----------------------------------------------------------
     15. FILTER SYSTEM (Rooms, Journal)
  ---------------------------------------------------------- */
  const FilterSystem = {
    init() {
      document.querySelectorAll('[data-filter-group]').forEach(function (group) {
        var buttons = group.querySelectorAll('[data-filter]');
        var container = document.querySelector(group.getAttribute('data-filter-target'));
        if (!container) return;

        buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            buttons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');
            var items = container.querySelectorAll('[data-category]');

            items.forEach(function (item) {
              if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = '';
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                setTimeout(function () {
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0)';
                }, 50);
              } else {
                item.style.display = 'none';
              }
            });
          });
        });
      });
    }
  };

  /* ----------------------------------------------------------
     16. COUNTDOWN TIMER
  ---------------------------------------------------------- */
  const CountdownTimer = {
    init() {
      var el = document.querySelector('[data-countdown]');
      if (!el) return;
      var targetDate = new Date(el.getAttribute('data-countdown'));

      function update() {
        var now = new Date();
        var diff = targetDate - now;
        if (diff <= 0) {
          el.innerHTML = '<span class="countdown__item"><span class="countdown__number">0</span><span class="countdown__label">Days</span></span>';
          return;
        }
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        var mins = Math.floor((diff / (1000 * 60)) % 60);
        var secs = Math.floor((diff / 1000) % 60);

        var daysEl = el.querySelector('[data-cd-days]');
        var hoursEl = el.querySelector('[data-cd-hours]');
        var minsEl = el.querySelector('[data-cd-mins]');
        var secsEl = el.querySelector('[data-cd-secs]');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
      }

      update();
      setInterval(update, 1000);
    }
  };

  /* ----------------------------------------------------------
     17. GROUP SIZE CALCULATOR (Pricing page)
  ---------------------------------------------------------- */
  const GroupCalculator = {
    init() {
      var calculator = document.querySelector('[data-calculator]');
      if (!calculator) return;

      var groupInput = calculator.querySelector('[data-calc-group]');
      var daySelect = calculator.querySelector('[data-calc-day]');
      var resultPanel = calculator.querySelector('[data-calc-result]');
      var priceEl = calculator.querySelector('[data-calc-price]');
      var roomEl = calculator.querySelector('[data-calc-room]');

      if (!groupInput || !resultPanel) return;

      function calculate() {
        var groupSize = parseInt(groupInput.value) || 2;
        var day = daySelect ? daySelect.value : 'weekday';
        var basePrice = day === 'weekend' ? 35 : 28;
        var total = groupSize * basePrice;
        var room = groupSize <= 4 ? 'The Cipher Room' : groupSize <= 6 ? 'The Vault' : 'The Labyrinth';

        if (groupSize >= 6) {
          total = Math.round(total * 0.9);
        }

        if (priceEl) priceEl.textContent = '$' + total;
        if (roomEl) roomEl.textContent = room;
        resultPanel.style.display = 'block';
      }

      if (groupInput) groupInput.addEventListener('input', calculate);
      if (daySelect) daySelect.addEventListener('change', calculate);

      var minusBtn = calculator.querySelector('[data-calc-minus]');
      var plusBtn = calculator.querySelector('[data-calc-plus]');

      if (minusBtn) {
        minusBtn.addEventListener('click', function () {
          var val = parseInt(groupInput.value) || 2;
          if (val > 1) groupInput.value = val - 1;
          calculate();
        });
      }

      if (plusBtn) {
        plusBtn.addEventListener('click', function () {
          var val = parseInt(groupInput.value) || 2;
          if (val < 20) groupInput.value = val + 1;
          calculate();
        });
      }
    }
  };

  /* ----------------------------------------------------------
     18. COPYRIGHT YEAR
  ---------------------------------------------------------- */
  const Copyright = {
    init() {
      document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
      });
    }
  };

  /* ----------------------------------------------------------
     19. DROPDOWN CLOSE ON OUTSIDE CLICK
  ---------------------------------------------------------- */
  const DropdownManager = {
    init() {
      document.addEventListener('click', function (e) {
        document.querySelectorAll('.notification-dropdown.open').forEach(function (dd) {
          if (!dd.parentElement.contains(e.target)) {
            dd.classList.remove('open');
          }
        });
        document.querySelectorAll('.avatar-menu__dropdown.open').forEach(function (dd) {
          if (!dd.parentElement.contains(e.target)) {
            dd.classList.remove('open');
          }
        });
      });
    }
  };

  /* ----------------------------------------------------------
     20. SMOOTH SCROLL FOR ANCHOR LINKS
  ---------------------------------------------------------- */
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          var target = document.querySelector(link.getAttribute('href'));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  };

  /* ----------------------------------------------------------
     21. HERO ENTRANCE ANIMATION
  ---------------------------------------------------------- */
  const HeroEntrance = {
    init() {
      var hero = document.querySelector('.hero');
      if (!hero) return;
      var elements = hero.querySelectorAll('.hero__title, .hero__subtitle, .hero__ctas, .hero__scroll-indicator');
      elements.forEach(function (el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease ' + (i * 0.15 + 0.3) + 's, transform 0.6s ease ' + (i * 0.15 + 0.3) + 's';
        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      });
    }
  };

  /* ----------------------------------------------------------
     22. DIFFICULTY SLIDER (Rooms page)
  ---------------------------------------------------------- */
  const DifficultySlider = {
    init() {
      var slider = document.querySelector('[data-difficulty-slider]');
      if (!slider) return;
      var output = document.querySelector('[data-difficulty-output]');

      slider.addEventListener('input', function () {
        if (output) output.textContent = slider.value;
        var container = document.querySelector('[data-filter-target]') || document.querySelector('.room-grid');
        if (!container) return;
        var cards = container.querySelectorAll('[data-difficulty]');
        var selectedLevel = parseInt(slider.value);

        cards.forEach(function (card) {
          var cardLevel = parseInt(card.getAttribute('data-difficulty'));
          if (selectedLevel === 0 || cardLevel <= selectedLevel) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  };

  /* ----------------------------------------------------------
     INITIALIZATION
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    ThemeManager.init();
    DirectionManager.init();
    Navbar.init();
    MobileMenu.init();
    HomeSwitcher.init();
    ScrollReveal.init();
    CountUp.init();
    ParticleEffect.init();
    Accordion.init();
    FormValidator.init();
    PasswordToggle.init();
    PasswordStrength.init();
    Carousel.init();
    Tabs.init();
    FilterSystem.init();
    CountdownTimer.init();
    GroupCalculator.init();
    Copyright.init();
    DropdownManager.init();
    SmoothScroll.init();
    HeroEntrance.init();
    DifficultySlider.init();
  });

})();
