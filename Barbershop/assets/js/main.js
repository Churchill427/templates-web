/* ============================================================
   SHARP — Main JavaScript
   Global: Theme, RTL, Navbar, Hamburger, Active Links
   ============================================================ */

(function () {
  'use strict';

  // ─── DOM REFERENCES ───────────────────────────────────────
  const html = document.documentElement;
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const rtlToggle = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');
  const scrollTopBtn = document.querySelector('.scroll-top');

  // ─── THEME MANAGEMENT ────────────────────────────────────
  const THEME_KEY = 'sharp-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT;
  }

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY);
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');

    sunIcons.forEach(icon => {
      icon.style.display = theme === THEME_DARK ? 'block' : 'none';
    });
    moonIcons.forEach(icon => {
      icon.style.display = theme === THEME_DARK ? 'none' : 'block';
    });
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || THEME_LIGHT;
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(next);
  }

  function initTheme() {
    const saved = getSavedTheme();
    const theme = saved || getSystemPreference();
    applyTheme(theme);

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });

    // Bind toggle buttons
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
  }

  // ─── RTL/LTR MANAGEMENT ──────────────────────────────────
  const DIR_KEY = 'sharp-dir';
  const DIR_RTL = 'rtl';
  const DIR_LTR = 'ltr';

  function getSavedDir() {
    return localStorage.getItem(DIR_KEY);
  }

  function applyDir(dir) {
    html.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    updateDirLabels(dir);
  }

  function updateDirLabels(dir) {
    const rtlLabels = document.querySelectorAll('.rtl-toggle-label');
    rtlLabels.forEach(label => {
      label.textContent = dir.toUpperCase();
    });
  }

  function toggleDir() {
    const current = html.getAttribute('dir') || DIR_LTR;
    const next = current === DIR_RTL ? DIR_LTR : DIR_RTL;
    applyDir(next);
  }

  function initDir() {
    const saved = getSavedDir();
    const dir = saved || DIR_LTR;
    applyDir(dir);

    if (rtlToggle) rtlToggle.addEventListener('click', toggleDir);
    if (rtlToggleMobile) rtlToggleMobile.addEventListener('click', toggleDir);
  }

  // ─── NAVBAR SCROLL BEHAVIOR ──────────────────────────────
  let lastScrollY = 0;
  const SCROLL_THRESHOLD = 50;

  function handleNavbarScroll() {
    if (!navbar) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  function initNavbarScroll() {
    if (!navbar) return;
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Check on load
  }

  // ─── HAMBURGER MENU ──────────────────────────────────────
  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    if (!mobileMenu) return;
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function initHamburger() {
    if (!hamburger) return;
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close menu when a link is clicked
    if (mobileMenu) {
      const mobileLinks = mobileMenu.querySelectorAll('a.mobile-menu__link, a.mobile-menu__sublink');
      mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ─── ACTIVE NAV LINK ─────────────────────────────────────
  function initActiveLinks() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkFile = href.split('/').pop();

      // Match current page
      if (linkFile === filename ||
          (filename === '' && linkFile === 'index.html') ||
          (filename === 'index.html' && linkFile === 'index.html') ||
          (filename === 'home-b.html' && linkFile === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ─── DROPDOWN MENU ────────────────────────────────────────
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav__dropdown');

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav__link');

      // Desktop: hover
      dropdown.addEventListener('mouseenter', () => {
        dropdown.classList.add('open');
      });
      dropdown.addEventListener('mouseleave', () => {
        dropdown.classList.remove('open');
      });

      // Mobile: click
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            dropdown.classList.toggle('open');
          }
        });
      }
    });
  }

  // ─── SCROLL TO TOP ────────────────────────────────────────
  function handleScrollTop() {
    if (!scrollTopBtn) return;

    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  function initScrollTop() {
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', handleScrollTop, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ─── ACCORDION ────────────────────────────────────────────
  function initAccordions() {
    const accordionItems = document.querySelectorAll('.accordion__item');

    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion__trigger');
      const content = item.querySelector('.accordion__content');

      if (!trigger || !content) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all in same accordion
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.accordion__item').forEach(sibling => {
            sibling.classList.remove('active');
            const siblingTrigger = sibling.querySelector('.accordion__trigger');
            const siblingContent = sibling.querySelector('.accordion__content');
            if (siblingTrigger) siblingTrigger.setAttribute('aria-expanded', 'false');
            if (siblingContent) siblingContent.style.maxHeight = null;
          });
        }

        // Toggle current
        if (!isOpen) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // ─── COMPARISON SLIDER ────────────────────────────────────
  function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-slider');

    sliders.forEach(slider => {
      const before = slider.querySelector('.comparison-slider__before');
      const handle = slider.querySelector('.comparison-slider__handle');
      const beforeImg = before ? before.querySelector('img') : null;

      if (!before || !handle) return;

      let isDragging = false;

      function updateSlider(x) {
        const rect = slider.getBoundingClientRect();
        let pos = (x - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));

        // Use clip-path for smooth revealing without squishing
        before.style.width = '100%';
        before.style.clipPath = `inset(0 ${100 - (pos * 100)}% 0 0)`;
        before.style.webkitClipPath = `inset(0 ${100 - (pos * 100)}% 0 0)`;
        
        handle.style.left = (pos * 100) + '%';
      }

      slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) updateSlider(e.clientX);
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch support
      slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (isDragging) updateSlider(e.touches[0].clientX);
      }, { passive: true });

      document.addEventListener('touchend', () => {
        isDragging = false;
      });
    });
  }

  // ─── GALLERY FILTERS ─────────────────────────────────────
  function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filters__btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            item.style.animation = 'scaleIn 0.4s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = navbar ? navbar.offsetHeight : 0;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          closeMobileMenu();
        }
      });
    });
  }

  // ─── FORM VALIDATION ─────────────────────────────────────
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('.form__input, .form__select, .form__textarea');

      inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
          validateField(input);
        });

        // Clear error on input
        input.addEventListener('input', () => {
          const group = input.closest('.form__group');
          if (group && group.classList.contains('has-error')) {
            group.classList.remove('has-error');
          }
        });
      });

      // Form submission
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        inputs.forEach(input => {
          if (!validateField(input)) {
            isValid = false;
          }
        });

        if (isValid) {
          // Show success state
          const submitBtn = form.querySelector('[type="submit"]');
          if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sent!';
            submitBtn.disabled = true;
            submitBtn.style.background = '#27AE60';

            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
              submitBtn.style.background = '';
              form.reset();
              // Clear all success states
              form.querySelectorAll('.form__group').forEach(g => {
                g.classList.remove('has-success', 'has-error');
              });
            }, 3000);
          }
        }
      });
    });
  }

  function validateField(input) {
    const group = input.closest('.form__group');
    if (!group) return true;

    const value = input.value.trim();
    const type = input.type;
    const required = input.required;
    const errorEl = group.querySelector('.form__error');

    // Reset
    group.classList.remove('has-error', 'has-success');

    // Required check
    if (required && !value) {
      group.classList.add('has-error');
      if (errorEl) errorEl.textContent = 'This field is required';
      return false;
    }

    // Skip optional empty fields
    if (!value) return true;

    // Email validation
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = 'Please enter a valid email address';
        return false;
      }
    }

    // Phone validation
    if (type === 'tel') {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = 'Please enter a valid phone number (min 10 digits)';
        return false;
      }
    }

    // Password validation
    if (type === 'password' && input.dataset.validate === 'password') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(value)) {
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = 'Min 8 chars, 1 uppercase, 1 number, 1 special character';
        return false;
      }
    }

    // Confirm password
    if (input.dataset.match) {
      const matchInput = document.getElementById(input.dataset.match);
      if (matchInput && value !== matchInput.value) {
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = 'Passwords do not match';
        return false;
      }
    }

    // Date not in past
    if (type === 'date') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(value);
      if (selected < today) {
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = 'Please select a future date';
        return false;
      }
    }

    group.classList.add('has-success');
    return true;
  }

  // ─── PASSWORD TOGGLE ──────────────────────────────────────
  function initPasswordToggles() {
    const toggles = document.querySelectorAll('.form__password-toggle');

    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        // Toggle icon
        const showIcon = toggle.querySelector('.pw-show');
        const hideIcon = toggle.querySelector('.pw-hide');
        if (showIcon) showIcon.style.display = isPassword ? 'none' : 'block';
        if (hideIcon) hideIcon.style.display = isPassword ? 'block' : 'none';
      });
    });
  }

  // ─── PAGE LOAD ANIMATION ─────────────────────────────────
  function initPageLoad() {
    body.classList.add('page-loaded');
  }

  // ─── INIT ─────────────────────────────────────────────────
  function init() {
    initTheme();
    initDir();
    initNavbarScroll();
    initHamburger();
    initActiveLinks();
    initDropdowns();
    initScrollTop();
    initSmoothScroll();
    initAccordions();
    initComparisonSliders();
    initGalleryFilters();
    initFormValidation();
    initPasswordToggles();
    initPageLoad();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
