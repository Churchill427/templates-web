/* ═══════════════════════════════════════════════════════════════════
   PRNT — Global JavaScript
   Theme toggle, RTL, hamburger, dropdowns, scroll animations,
   active nav, back-to-top, preloader, cart badge
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Preloader ───────────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('is-hidden'), 400);
    }
  });

  /* ── Theme Toggle (Dark / Light) ─────────────────────────────────── */
  const THEME_KEY = 'prnt-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update toggle icons
    document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
      if (theme === 'dark') {
        icon.classList.remove('lucide-moon');
        icon.classList.add('lucide-sun');
      } else {
        icon.classList.remove('lucide-sun');
        icon.classList.add('lucide-moon');
      }
    });
  }

  // Apply on load
  applyTheme(getPreferredTheme());

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Theme toggle buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-toggle-theme]');
    if (!btn) return;
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ── RTL / LTR Toggle ───────────────────────────────────────────── */
  const DIR_KEY = 'prnt-dir';

  function getPreferredDir() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    // Update toggle text: show the MODE YOU'D SWITCH TO (opposite)
    document.querySelectorAll('.rtl-toggle-text').forEach(el => {
      el.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
    });
  }

  // Apply on load
  applyDir(getPreferredDir());

  // RTL toggle buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-toggle-dir]');
    if (!btn) return;
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'ltr' ? 'rtl' : 'ltr');
  });

  /* ── Hamburger Menu ──────────────────────────────────────────────── */
  document.addEventListener('click', e => {
    const hamburger = e.target.closest('.navbar__hamburger');
    if (!hamburger) return;

    hamburger.classList.toggle('is-active');
    const menu = document.querySelector('.navbar__mobile-menu');
    if (menu) {
      menu.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll', menu.classList.contains('is-open'));
    }
  });

  /* ── Dropdown Menus ──────────────────────────────────────────────── */
  // Mobile: click toggle
  document.addEventListener('click', e => {
    const dropdownTrigger = e.target.closest('.navbar__dropdown > .navbar__link');
    if (!dropdownTrigger) return;

    // Only handle on mobile
    if (window.innerWidth >= 1024) return;

    e.preventDefault();
    const dropdown = dropdownTrigger.closest('.navbar__dropdown');
    dropdown.classList.toggle('is-open');
  });

  // Desktop: keyboard support for dropdowns
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.navbar__dropdown.is-open').forEach(d => {
        d.classList.remove('is-open');
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar__dropdown')) {
      document.querySelectorAll('.navbar__dropdown.is-open').forEach(d => {
        d.classList.remove('is-open');
      });
    }
  });

  /* ── Active Nav Link ─────────────────────────────────────────────── */
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link, .navbar__dropdown-item').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('is-active');
        // If inside dropdown, also highlight parent
        const parentDropdown = link.closest('.navbar__dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector(':scope > .navbar__link');
          if (parentLink) parentLink.classList.add('is-active');
        }
      }
    });
  }
  highlightActiveNav();

  /* ── Navbar Scroll Effect ────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 10) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ── Scroll Reveal (Intersection Observer) ───────────────────────── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }
  initScrollReveal();

  /* ── Back to Top Button ──────────────────────────────────────────── */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Cart Badge Update ───────────────────────────────────────────── */
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('prnt-cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    document.querySelectorAll('.navbar__cart-badge').forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
  }
  updateCartBadge();

  // Expose globally for other scripts
  window.PRNT = window.PRNT || {};
  window.PRNT.updateCartBadge = updateCartBadge;
  window.PRNT.applyTheme = applyTheme;
  window.PRNT.applyDir = applyDir;
  window.PRNT.initScrollReveal = initScrollReveal;

})();
