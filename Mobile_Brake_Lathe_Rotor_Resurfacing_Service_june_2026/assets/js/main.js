/* ============================================================
   BRAKE — Main JavaScript
   main.js
   Navigation, Theme, RTL, Scroll Animations, Accordion, etc.
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. THEME SYSTEM (Dark / Light)
     -------------------------------------------------------- */
  const ThemeManager = {
    init() {
      this.body = document.body;
      this.toggleBtn = document.getElementById('theme-toggle');
      this.toggleIcon = this.toggleBtn?.querySelector('i');

      // Check saved preference or system preference
      const saved = localStorage.getItem('brake-theme');
      if (saved === 'dark') {
        this.setDark();
      } else if (saved === 'light') {
        this.setLight();
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setDark();
      } else {
        this.setLight();
      }

      // Toggle button click
      this.toggleBtn?.addEventListener('click', () => {
        if (this.body.classList.contains('dark-mode')) {
          this.setLight();
        } else {
          this.setDark();
        }
      });

      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('brake-theme')) {
          e.matches ? this.setDark() : this.setLight();
        }
      });
    },

    setDark() {
      this.body.classList.add('dark-mode');
      if (this.toggleIcon) {
        this.toggleIcon.className = 'ph ph-sun';
      }
      localStorage.setItem('brake-theme', 'dark');
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: 'dark' }));
    },

    setLight() {
      this.body.classList.remove('dark-mode');
      if (this.toggleIcon) {
        this.toggleIcon.className = 'ph ph-moon';
      }
      localStorage.setItem('brake-theme', 'light');
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: 'light' }));
    }
  };

  /* --------------------------------------------------------
     2. RTL / LTR TOGGLE
     -------------------------------------------------------- */
  const RTLManager = {
    init() {
      this.html = document.documentElement;
      this.toggleBtns = document.querySelectorAll('.rtl-toggle');

      const saved = localStorage.getItem('brake-direction');
      if (saved === 'rtl') {
        this.setRTL();
      } else {
        this.setLTR();
      }

      this.toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.html.getAttribute('dir') === 'rtl') {
            this.setLTR();
          } else {
            this.setRTL();
          }
        });
      });
    },

    setRTL() {
      this.html.setAttribute('dir', 'rtl');
      this.toggleBtns.forEach(btn => btn.textContent = 'RTL');
      localStorage.setItem('brake-direction', 'rtl');
    },

    setLTR() {
      this.html.setAttribute('dir', 'ltr');
      this.toggleBtns.forEach(btn => btn.textContent = 'LTR');
      localStorage.setItem('brake-direction', 'ltr');
    }
  };

  /* --------------------------------------------------------
     3. NAVIGATION
     -------------------------------------------------------- */
  const Navigation = {
    init() {
      this.navbar = document.querySelector('.navbar');
      this.hamburger = document.querySelector('.hamburger');
      this.mobileMenu = document.querySelector('.mobile-menu');
      this.mobileOverlay = document.querySelector('.mobile-menu-overlay');
      this.navDropdowns = document.querySelectorAll('.nav-dropdown');

      // Hamburger toggle
      this.hamburger?.addEventListener('click', () => this.toggleMobileMenu());
      this.mobileOverlay?.addEventListener('click', () => this.closeMobileMenu());

      // Close mobile menu on link click
      this.mobileMenu?.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });

      // Desktop dropdowns
      this.navDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        toggle?.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleDropdown(dropdown);
        });
      });

      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        this.navDropdowns.forEach(dropdown => {
          if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
          }
        });
      });

      // Scroll effect on navbar
      window.addEventListener('scroll', () => {
        if (this.navbar) {
          this.navbar.classList.toggle('scrolled', window.scrollY > 20);
        }
      });

      // Active link highlighting
      this.highlightActiveLink();

      // Close mobile menu on resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
          this.closeMobileMenu();
        }
      });

      // Escape key closes menus
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu();
          this.navDropdowns.forEach(d => d.classList.remove('open'));
        }
      });
    },

    toggleMobileMenu() {
      const isOpen = this.mobileMenu?.classList.contains('open');
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    },

    openMobileMenu() {
      this.hamburger?.classList.add('open');
      this.mobileMenu?.classList.add('open');
      this.mobileOverlay?.classList.add('open');
      this.mobileOverlay.style.display = 'block';
      document.body.classList.add('no-scroll');
    },

    closeMobileMenu() {
      this.hamburger?.classList.remove('open');
      this.mobileMenu?.classList.remove('open');
      this.mobileOverlay?.classList.remove('open');
      setTimeout(() => {
        if (this.mobileOverlay) this.mobileOverlay.style.display = 'none';
      }, 300);
      document.body.classList.remove('no-scroll');
    },

    toggleDropdown(dropdown) {
      const isOpen = dropdown.classList.contains('open');
      // Close all dropdowns first
      this.navDropdowns.forEach(d => d.classList.remove('open'));
      if (!isOpen) {
        dropdown.classList.add('open');
      }
    },

    highlightActiveLink() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const allLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
      allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const linkPage = href.split('/').pop();
          if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
          }
        }
      });
    }
  };

  /* --------------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
     -------------------------------------------------------- */
  const ScrollReveal = {
    init() {
      this.elements = document.querySelectorAll('.reveal');
      if (this.elements.length === 0) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Optionally unobserve after animation
            // this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      });

      this.elements.forEach(el => this.observer.observe(el));
    }
  };

  /* --------------------------------------------------------
     5. ACCORDION
     -------------------------------------------------------- */
  const Accordion = {
    init() {
      const accordionHeaders = document.querySelectorAll('.accordion-header');
      accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const item = header.closest('.accordion-item');
          const isOpen = item.classList.contains('open');

          // Close all items in this accordion
          const accordion = item.closest('.accordion');
          accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

          // Toggle current
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      });
    }
  };

  /* --------------------------------------------------------
     6. FORM VALIDATION
     -------------------------------------------------------- */
  const FormValidator = {
    init() {
      const forms = document.querySelectorAll('[data-validate]');
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
          // Real-time validation on blur
          input.addEventListener('blur', () => this.validateField(input));
          // Clear error on input
          input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group?.classList.contains('error')) {
              group.classList.remove('error');
            }
          });
        });

        form.addEventListener('submit', (e) => {
          let isValid = true;
          inputs.forEach(input => {
            if (!this.validateField(input)) {
              isValid = false;
            }
          });
          if (!isValid) {
            e.preventDefault();
          }
        });
      });
    },

    validateField(input) {
      const group = input.closest('.form-group');
      if (!group) return true;

      const errorEl = group.querySelector('.form-error');
      let isValid = true;
      let message = '';

      // Required check
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        message = 'This field is required';
      }

      // Email check
      if (isValid && input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
      }

      // Phone check
      if (isValid && input.type === 'tel' && input.value.trim()) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
        if (!phoneRegex.test(input.value.trim())) {
          isValid = false;
          message = 'Please enter a valid phone number';
        }
      }

      // Min length
      if (isValid && input.minLength > 0 && input.value.length < input.minLength) {
        isValid = false;
        message = `Minimum ${input.minLength} characters required`;
      }

      // Apply state
      if (!isValid) {
        group.classList.add('error');
        group.classList.remove('success');
        if (errorEl) errorEl.textContent = message;
      } else if (input.value.trim()) {
        group.classList.remove('error');
        group.classList.add('success');
      }

      return isValid;
    }
  };

  /* --------------------------------------------------------
     7. PARALLAX (Simple)
     -------------------------------------------------------- */
  const Parallax = {
    init() {
      this.heroBgs = document.querySelectorAll('.hero-bg');
      if (this.heroBgs.length === 0) return;

      // Use requestAnimationFrame for performance
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            this.heroBgs.forEach(bg => {
              const speed = 0.3;
              bg.style.transform = `translateY(${scrollY * speed}px)`;
            });
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  };

  /* --------------------------------------------------------
     8. SMOOTH SCROLL (Anchor links)
     -------------------------------------------------------- */
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    }
  };

  /* --------------------------------------------------------
     9. TABS
     -------------------------------------------------------- */
  const Tabs = {
    init() {
      document.querySelectorAll('[data-tabs]').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.dash-tab, .filter-tab, .category-tab');
        const panels = tabContainer.querySelectorAll('.dash-panel');

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            // Deactivate all
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Activate clicked
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.target);
            if (target) target.classList.add('active');
          });
        });
      });
    }
  };

  /* --------------------------------------------------------
     10. COUNTER ANIMATION
     -------------------------------------------------------- */
  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('[data-count]');
      if (counters.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(el) {
      const target = parseInt(el.dataset.count);
      const duration = 1500;
      const start = 0;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * (target - start) + start);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(animate);
    }
  };

  /* --------------------------------------------------------
     11. COUNTDOWN TIMER (Coming Soon page)
     -------------------------------------------------------- */
  const CountdownTimer = {
    init() {
      const countdownEl = document.querySelector('.countdown');
      if (!countdownEl) return;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 45); // 45 days from now

      const daysEl = document.getElementById('countdown-days');
      const hoursEl = document.getElementById('countdown-hours');
      const minutesEl = document.getElementById('countdown-minutes');
      const secondsEl = document.getElementById('countdown-seconds');

      if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

      const update = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
          daysEl.textContent = '00';
          hoursEl.textContent = '00';
          minutesEl.textContent = '00';
          secondsEl.textContent = '00';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
      };

      update();
      setInterval(update, 1000);
    }
  };

  /* --------------------------------------------------------
     12. SVG LOGO (Shared across all pages)
     -------------------------------------------------------- */
  window.BrakeLogo = function (size = 40) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" stroke="#C41E3A" stroke-width="6" fill="none"/>
      <circle cx="60" cy="60" r="38" stroke="#C41E3A" stroke-width="3" fill="none" stroke-dasharray="8 4"/>
      <circle cx="60" cy="60" r="18" fill="#C41E3A"/>
      <circle cx="60" cy="60" r="8" fill="#FAFAFA"/>
      <line x1="60" y1="4" x2="60" y2="22" stroke="#C41E3A" stroke-width="3" stroke-linecap="round"/>
      <line x1="60" y1="98" x2="60" y2="116" stroke="#C41E3A" stroke-width="3" stroke-linecap="round"/>
      <line x1="4" y1="60" x2="22" y2="60" stroke="#C41E3A" stroke-width="3" stroke-linecap="round"/>
      <line x1="98" y1="60" x2="116" y2="60" stroke="#C41E3A" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  };

  /* --------------------------------------------------------
     13. INITIALIZATION
     -------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    RTLManager.init();
    Navigation.init();
    ScrollReveal.init();
    Accordion.init();
    FormValidator.init();
    Parallax.init();
    SmoothScroll.init();
    Tabs.init();
    CounterAnimation.init();
    CountdownTimer.init();
  });

})();
