/* ============================================================
   POPZ Main Application JavaScript
   Handles: Theme, RTL, Navbar, Scroll Reveal, Counters
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     THEME TOGGLE (Dark / Light)
     ────────────────────────────────────────────────────────── */

  /**
   * Initialize theme based on localStorage or system preference.
   * Stores preference in localStorage under 'popz-theme'.
   */
  function initTheme() {
    var stored = localStorage.getItem('popz-theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcons();
  }

  /**
   * Toggle between 'light' and 'dark' themes.
   */
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('popz-theme', next);
    updateThemeIcons();
  }

  /**
   * Update all theme toggle icons (sun/moon) across the page.
   */
  function updateThemeIcons() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var btns = document.querySelectorAll('.js-theme-toggle');
    btns.forEach(function (btn) {
      var sunIcon = btn.querySelector('.icon-sun');
      var moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     RTL / LTR TOGGLE
     ────────────────────────────────────────────────────────── */

  /**
   * Initialize direction from localStorage.
   */
  function initDirection() {
    var stored = localStorage.getItem('popz-dir');
    if (stored) {
      document.documentElement.setAttribute('dir', stored);
    }
    updateDirButtons();
  }

  /**
   * Toggle between LTR and RTL.
   */
  function toggleDirection() {
    var current = document.documentElement.getAttribute('dir') || 'ltr';
    var next = current === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('popz-dir', next);
    updateDirButtons();
  }

  /**
   * Update RTL button text — shows "RTL" in LTR mode, "LTR" in RTL mode.
   */
  function updateDirButtons() {
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    var btns = document.querySelectorAll('.js-rtl-toggle');
    btns.forEach(function (btn) {
      btn.textContent = isRtl ? 'LTR' : 'RTL';
    });
  }

  /* ──────────────────────────────────────────────────────────
     NAVBAR
     ────────────────────────────────────────────────────────── */

  /**
   * Initialize sticky navbar scroll effect, hamburger menu, and dropdowns.
   */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    var hamburger = document.querySelector('.navbar__hamburger');
    var drawer = document.querySelector('.navbar__drawer');
    var overlay = document.querySelector('.navbar__drawer-overlay');

    /* Sticky scroll effect */
    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    /* Hamburger toggle */
    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        var isOpen = drawer.classList.contains('open');
        if (isOpen) {
          closeDrawer(hamburger, drawer, overlay);
        } else {
          openDrawer(hamburger, drawer, overlay);
        }
      });
    }

    /* Overlay click closes drawer */
    if (overlay) {
      overlay.addEventListener('click', function () {
        closeDrawer(hamburger, drawer, overlay);
      });
    }

    /* Close drawer on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
        closeDrawer(hamburger, drawer, overlay);
      }
    });

    /* Dropdown toggle (Home dropdown) */
    var dropdowns = document.querySelectorAll('.navbar__dropdown');
    dropdowns.forEach(function (dropdown) {
      var toggle = dropdown.querySelector('.navbar__dropdown-toggle');
      if (toggle) {
        toggle.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('open');
        });
      }
    });

    /* Close dropdown when clicking outside */
    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (dropdown) {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    });

    /* Active page highlighting */
    highlightActiveLink();
  }

  function openDrawer(hamburger, drawer, overlay) {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeDrawer(hamburger, drawer, overlay) {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  /**
   * Highlight the active nav link based on current page URL.
   */
  function highlightActiveLink() {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.navbar__link, .navbar__drawer-link');

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop();

      link.classList.remove('active');
      if (linkPage === currentPath) {
        link.classList.add('active');
      }
      /* Special case: index.html matches both Home links */
      if (currentPath === '' && (linkPage === 'index.html' || linkPage === '')) {
        link.classList.add('active');
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL (IntersectionObserver)
     ────────────────────────────────────────────────────────── */

  /**
   * Observe .reveal, .reveal-left, .reveal-right, .reveal-scale elements
   * and add .revealed class when they enter the viewport.
   */
  function initScrollReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      /* Show all elements immediately */
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     ANIMATED COUNTERS
     ────────────────────────────────────────────────────────── */

  /**
   * Animate a number from 0 to its data-target value.
   * Uses IntersectionObserver to trigger only when visible.
   */
  function initAnimatedCounters() {
    var counters = document.querySelectorAll('.js-counter');
    if (!counters.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var prefix = el.getAttribute('data-prefix') || '';
          var duration = 2000;

          if (prefersReduced) {
            el.textContent = prefix + target.toLocaleString() + suffix;
          } else {
            animateCounter(el, target, prefix, suffix, duration);
          }

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /**
   * Smoothly animate a counter element from 0 to target.
   */
  function animateCounter(el, target, prefix, suffix, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* Ease-out cubic */
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ──────────────────────────────────────────────────────────
     ACCORDION
     ────────────────────────────────────────────────────────── */

  /**
   * Initialize FAQ/accordion toggle behavior.
   */
  function initAccordions() {
    var items = document.querySelectorAll('.accordion__item');
    items.forEach(function (item) {
      var header = item.querySelector('.accordion__header');
      if (header) {
        header.addEventListener('click', function () {
          var isOpen = item.classList.contains('open');
          /* Close all siblings */
          var parent = item.closest('.accordion');
          if (parent) {
            parent.querySelectorAll('.accordion__item').forEach(function (sibling) {
              sibling.classList.remove('open');
            });
          }
          /* Toggle current */
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     NEWSLETTER FORM
     ────────────────────────────────────────────────────────── */

  /**
   * Handle footer newsletter form submission.
   */
  function initNewsletterForms() {
    var forms = document.querySelectorAll('.js-newsletter-form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var success = form.closest('.footer__newsletter, .newsletter-section')
          ? form.closest('.footer__newsletter, .newsletter-section').querySelector('.footer__newsletter-success, .newsletter-success')
          : null;

        if (input && input.value && isValidEmail(input.value)) {
          form.style.display = 'none';
          if (success) {
            success.classList.add('show');
            success.textContent = 'Thank you for subscribing!';
          }
        } else if (input) {
          input.classList.add('error');
          input.focus();
          setTimeout(function () {
            input.classList.remove('error');
          }, 2000);
        }
      });
    });
  }

  /**
   * Basic email validation.
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ──────────────────────────────────────────────────────────
     CART BADGE UPDATE
     ────────────────────────────────────────────────────────── */

  /**
   * Update the cart badge count from localStorage.
   */
  function updateCartBadge() {
    var cart = JSON.parse(localStorage.getItem('popz-cart') || '[]');
    var totalItems = cart.reduce(function (sum, item) {
      return sum + (item.qty || 1);
    }, 0);
    var badges = document.querySelectorAll('.navbar__cart-badge');
    badges.forEach(function (badge) {
      badge.textContent = totalItems;
      badge.setAttribute('data-count', totalItems);
      if (totalItems > 0) {
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  /**
   * Add an item to the cart stored in localStorage.
   */
  window.addToCart = function (productId, name, price, image) {
    var cart = JSON.parse(localStorage.getItem('popz-cart') || '[]');
    var existing = cart.find(function (item) { return item.id === productId; });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: productId, name: name, price: price, image: image, qty: 1 });
    }
    localStorage.setItem('popz-cart', JSON.stringify(cart));
    updateCartBadge();

    /* Brief visual feedback */
    var cartBtn = document.querySelector('.navbar__cart');
    if (cartBtn) {
      cartBtn.classList.add('pulse');
      setTimeout(function () {
        cartBtn.classList.remove('pulse');
      }, 600);
    }
  };

  /* ──────────────────────────────────────────────────────────
     SMOOTH SCROLL FOR ANCHOR LINKS
     ────────────────────────────────────────────────────────── */

  function initSmoothScroll() {
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

  /* ──────────────────────────────────────────────────────────
     EVENT BINDING FOR TOGGLES
     ────────────────────────────────────────────────────────── */

  function bindToggles() {
    /* Theme toggles */
    document.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });

    /* RTL toggles */
    document.querySelectorAll('.js-rtl-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggleDirection);
    });
  }

  /* ──────────────────────────────────────────────────────────
     INITIALIZATION
     ────────────────────────────────────────────────────────── */

  function init() {
    initTheme();
    initDirection();
    initNavbar();
    initScrollReveal();
    initAnimatedCounters();
    initAccordions();
    initNewsletterForms();
    initSmoothScroll();
    bindToggles();
    initFlavorMatcher();
    updateCartBadge();
  }

  /* ──────────────────────────────────────────────────────────
     FLAVOR MATCHER MOOD FILTER
     ────────────────────────────────────────────────────────── */

  function initFlavorMatcher() {
    var moodBtns = document.querySelectorAll('.flavor-matcher__mood');
    var cards = document.querySelectorAll('#matcherResults .card');
    if (!moodBtns.length || !cards.length) return;

    moodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetMood = btn.getAttribute('data-mood');

        /* Toggle active button */
        moodBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        /* Filter cards */
        cards.forEach(function (card) {
          var cardMoods = (card.getAttribute('data-mood') || '').split(' ');
          if (targetMood === 'all' || cardMoods.indexOf(targetMood) !== -1) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
