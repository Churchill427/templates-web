/* ============================================================
   LUME — Main JavaScript
   Theme Toggle, RTL Toggle, Navbar, Scroll Animations
   ============================================================ */

(function () {
  'use strict';

  // ── Constants ──
  const THEME_KEY = 'lume-theme';
  const DIR_KEY = 'lume-dir';

  // ── DOM Ready ──
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initTheme();
    initDirection();
    initNavbar();
    initScrollAnimations();
    initAccordions();
    initDropdowns();
  }

  // ════════════════════════════════════════════════════════════
  // THEME TOGGLE (Light / Dark)
  // ════════════════════════════════════════════════════════════
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);

    // Bind all theme toggle buttons
    document.querySelectorAll('[data-toggle-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update toggle icons
    document.querySelectorAll('[data-toggle-theme]').forEach(function (btn) {
      var sunIcon = btn.querySelector('.icon-sun');
      var moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // RTL / LTR TOGGLE
  // ════════════════════════════════════════════════════════════
  function initDirection() {
    var saved = localStorage.getItem(DIR_KEY);
    var dir = saved || 'ltr';
    applyDirection(dir);

    document.querySelectorAll('[data-toggle-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('dir') || 'ltr';
        var next = current === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(next);
        localStorage.setItem(DIR_KEY, next);
      });
    });
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    // Update toggle text: shows opposite (what you'll switch TO)
    document.querySelectorAll('[data-toggle-dir]').forEach(function (btn) {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
    });
  }

  // ════════════════════════════════════════════════════════════
  // NAVBAR
  // ════════════════════════════════════════════════════════════
  function initNavbar() {
    var hamburger = document.querySelector('.hamburger');
    var mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('hamburger--active');
        mobileMenu.classList.toggle('mobile-menu--open');
        document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--open') ? 'hidden' : '';
      });

      // Close menu on link click
      mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('hamburger--active');
          mobileMenu.classList.remove('mobile-menu--open');
          document.body.style.overflow = '';
        });
      });
    }

    // Active page highlighting
    highlightActiveNav();
  }

  function highlightActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('nav__link--active', 'mobile-menu__link--active');
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // DROPDOWNS
  // ════════════════════════════════════════════════════════════
  function initDropdowns() {
    document.querySelectorAll('.nav__dropdown').forEach(function (dropdown) {
      var toggle = dropdown.querySelector('.nav__dropdown-toggle');
      if (toggle) {
        toggle.addEventListener('click', function (e) {
          e.preventDefault();
          dropdown.classList.toggle('nav__dropdown--open');
        });
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function (e) {
      document.querySelectorAll('.nav__dropdown--open').forEach(function (dropdown) {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('nav__dropdown--open');
        }
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // SCROLL ANIMATIONS (IntersectionObserver)
  // ════════════════════════════════════════════════════════════
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll(
      '.animate-on-scroll, .animate-on-scroll--left, .animate-on-scroll--right, .animate-on-scroll--scale'
    );

    if (!animatedElements.length) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animatedElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ════════════════════════════════════════════════════════════
  // ACCORDIONS
  // ════════════════════════════════════════════════════════════
  function initAccordions() {
    document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion__item');
        var content = item.querySelector('.accordion__content');
        var isOpen = item.classList.contains('accordion__item--open');

        // Close all siblings
        var accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion__item--open').forEach(function (openItem) {
            openItem.classList.remove('accordion__item--open');
            var openContent = openItem.querySelector('.accordion__content');
            if (openContent) openContent.style.maxHeight = null;
          });
        }

        if (!isOpen) {
          item.classList.add('accordion__item--open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }
})();
