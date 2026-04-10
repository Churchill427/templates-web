/* ============================================
   AquaLux — Main JavaScript
   Navigation, dropdowns, forms, smooth scroll
   ============================================ */

'use strict';

const AquaLux = (() => {
  // ---- DOM Cache ----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ============================================
  // 1. NAVIGATION
  // ============================================
  function initNavigation() {
    const navbar = $('.navbar');
    if (!navbar) return;

    // Scroll behavior
    let lastScroll = 0;
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
        navbar.classList.remove('navbar--transparent');
      } else {
        navbar.classList.remove('navbar--scrolled');
        if (navbar.dataset.transparent === 'true') {
          navbar.classList.add('navbar--transparent');
        }
      }
      lastScroll = scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check

    // Hamburger menu
    const hamburger = $('.navbar__hamburger');
    const mobileMenu = $('.navbar__mobile-menu');
    const mobileOverlay = $('.navbar__mobile-overlay');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('navbar__hamburger--active');
        mobileMenu.classList.toggle('navbar__mobile-menu--open', isOpen);
        if (mobileOverlay) {
          mobileOverlay.classList.toggle('navbar__mobile-overlay--visible', isOpen);
        }
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
          hamburger.classList.remove('navbar__hamburger--active');
          mobileMenu.classList.remove('navbar__mobile-menu--open');
          mobileOverlay.classList.remove('navbar__mobile-overlay--visible');
          document.body.style.overflow = '';
        });
      }

      // Close mobile menu on link click
      $$('.navbar__mobile-link', mobileMenu).forEach(link => {
        link.addEventListener('click', () => {
          if (!link.parentElement.classList.contains('navbar__dropdown')) {
            hamburger.classList.remove('navbar__hamburger--active');
            mobileMenu.classList.remove('navbar__mobile-menu--open');
            if (mobileOverlay) mobileOverlay.classList.remove('navbar__mobile-overlay--visible');
            document.body.style.overflow = '';
          }
        });
      });
    }

    // Desktop dropdowns
    $$('.navbar__dropdown').forEach(dropdown => {
      const link = dropdown.querySelector('.navbar__link');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth < 1024) {
            e.preventDefault();
            dropdown.classList.toggle('navbar__dropdown--open');
          }
        });
      }
    });

    // User dropdown
    const userBtn = $('.navbar__util-btn--user');
    const userMenu = $('.navbar__user-menu');
    if (userBtn && userMenu) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('navbar__user-menu--open');
      });
      document.addEventListener('click', () => {
        userMenu.classList.remove('navbar__user-menu--open');
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      $$('.navbar__dropdown--open').forEach(dd => {
        if (!dd.contains(e.target)) {
          dd.classList.remove('navbar__dropdown--open');
        }
      });
    });
  }

  // ============================================
  // 2. SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  // ============================================
  // 3. FORM VALIDATION
  // ============================================
  function initForms() {
    $$('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Clear previous errors
        $$('.form-input--error', form).forEach(el => el.classList.remove('form-input--error'));
        $$('.form-error', form).forEach(el => el.remove());

        // Validate required fields
        $$('[required]', form).forEach(input => {
          if (!input.value.trim()) {
            valid = false;
            showFieldError(input, 'This field is required');
          }
        });

        // Email validation
        $$('[type="email"]', form).forEach(input => {
          if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            valid = false;
            showFieldError(input, 'Please enter a valid email address');
          }
        });

        // Phone validation
        $$('[type="tel"]', form).forEach(input => {
          if (input.value && !/^[\+]?[\d\s\-\(\)]{7,}$/.test(input.value)) {
            valid = false;
            showFieldError(input, 'Please enter a valid phone number');
          }
        });

        // Password match
        const pass = $('[name="password"]', form);
        const confirm = $('[name="confirm-password"]', form);
        if (pass && confirm && pass.value !== confirm.value) {
          valid = false;
          showFieldError(confirm, 'Passwords do not match');
        }

        // Terms checkbox
        const terms = $('[name="terms"]', form);
        if (terms && !terms.checked) {
          valid = false;
          const label = terms.closest('.form-checkbox');
          if (label) {
            const err = document.createElement('span');
            err.className = 'form-error';
            err.textContent = 'You must accept the terms';
            label.after(err);
          }
        }

        if (valid) {
          // Show success (for demo)
          showFormSuccess(form);
        }
      });

      // Clear error on input
      form.addEventListener('input', (e) => {
        const input = e.target;
        if (input.classList.contains('form-input--error')) {
          input.classList.remove('form-input--error');
          const err = input.parentElement.querySelector('.form-error');
          if (err) err.remove();
        }
      });
    });
  }

  function showFieldError(input, message) {
    input.classList.add('form-input--error');
    const err = document.createElement('span');
    err.className = 'form-error';
    err.textContent = message;
    input.parentElement.appendChild(err);
  }

  function showFormSuccess(form) {
    const btn = $('[type="submit"]', form);
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ Success!';
      btn.style.background = '#38a169';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 2000);
    }
  }

  // ============================================
  // 4. ACCORDION / FAQ
  // ============================================
  function initAccordions() {
    $$('.accordion').forEach(accordion => {
      $$('.accordion__header', accordion).forEach(header => {
        header.addEventListener('click', () => {
          const item = header.closest('.accordion__item');
          const content = item.querySelector('.accordion__content');
          const isActive = item.classList.contains('accordion__item--active');

          // Close all others in same accordion
          $$('.accordion__item--active', accordion).forEach(active => {
            if (active !== item) {
              active.classList.remove('accordion__item--active');
              const c = active.querySelector('.accordion__content');
              if (c) c.style.maxHeight = '0';
            }
          });

          // Toggle current
          item.classList.toggle('accordion__item--active', !isActive);
          if (content) {
            content.style.maxHeight = isActive ? '0' : content.scrollHeight + 'px';
          }
        });
      });
    });
  }

  // ============================================
  // 5. TABS
  // ============================================
  function initTabs() {
    $$('[data-tabs]').forEach(tabContainer => {
      const tabs = $$('.tab', tabContainer);
      const panels = $$('.tab-panel', tabContainer);

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;

          tabs.forEach(t => t.classList.remove('tab--active'));
          panels.forEach(p => p.classList.remove('tab-panel--active'));

          tab.classList.add('tab--active');
          const panel = $(`#${target}`, tabContainer);
          if (panel) panel.classList.add('tab-panel--active');
        });
      });
    });
  }

  // ============================================
  // 6. LIGHTBOX
  // ============================================
  function initLightbox() {
    const images = $$('[data-lightbox]');
    if (!images.length) return;

    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Close lightbox">&times;</button>
        <img class="lightbox__image" src="" alt="" />
        <button class="lightbox__prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
        <button class="lightbox__next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
      </div>
    `;

    // Lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      .lightbox { position:fixed; inset:0; z-index:2000; display:none; align-items:center; justify-content:center; }
      .lightbox--open { display:flex; }
      .lightbox__overlay { position:absolute; inset:0; background:rgba(0,0,0,0.9); }
      .lightbox__content { position:relative; max-width:90vw; max-height:90vh; }
      .lightbox__image { max-width:90vw; max-height:85vh; object-fit:contain; border-radius:8px; }
      .lightbox__close { position:absolute; top:-40px; right:0; color:#fff; font-size:2rem; background:none; border:none; cursor:pointer; }
      .lightbox__prev, .lightbox__next { position:absolute; top:50%; transform:translateY(-50%); color:#fff; font-size:1.5rem; background:rgba(255,255,255,0.1); border:none; cursor:pointer; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
      .lightbox__prev:hover, .lightbox__next:hover { background:rgba(255,255,255,0.2); }
      .lightbox__prev { left:-60px; }
      .lightbox__next { right:-60px; }
      @media(max-width:768px) { .lightbox__prev { left:8px; } .lightbox__next { right:8px; } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(lightbox);

    let currentIndex = 0;
    const lbImage = lightbox.querySelector('.lightbox__image');
    const lbOverlay = lightbox.querySelector('.lightbox__overlay');
    const lbClose = lightbox.querySelector('.lightbox__close');
    const lbPrev = lightbox.querySelector('.lightbox__prev');
    const lbNext = lightbox.querySelector('.lightbox__next');

    const openLightbox = (index) => {
      currentIndex = index;
      lbImage.src = images[index].src || images[index].dataset.lightbox;
      lbImage.alt = images[index].alt || '';
      lightbox.classList.add('lightbox--open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('lightbox--open');
      document.body.style.overflow = '';
    };

    images.forEach((img, i) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(i));
    });

    lbClose.addEventListener('click', closeLightbox);
    lbOverlay.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => openLightbox((currentIndex - 1 + images.length) % images.length));
    lbNext.addEventListener('click', () => openLightbox((currentIndex + 1) % images.length));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    });
  }

  // ============================================
  // 7. NEWSLETTER / TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type = 'success') {
    let container = $('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = 'position:fixed;top:80px;right:20px;z-index:1100;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      padding: 14px 24px;
      border-radius: 10px;
      color: #fff;
      font-size: 14px;
      font-family: var(--font-primary);
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#ed8936'};
    `;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================
  // 8. SCROLL TO TOP
  // ============================================
  function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--color-secondary);
      color: #fff;
      border: none;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(49,151,149,0.3);
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
        btn.style.transform = 'translateY(0)';
      } else {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
        btn.style.transform = 'translateY(20px)';
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 9. ACTIVE NAV LINK
  // ============================================
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $$('.navbar__link, .navbar__dropdown-item, .navbar__mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('navbar__link--active');
        // Also highlight parent dropdown
        const dropdown = link.closest('.navbar__dropdown');
        if (dropdown) {
          const parentLink = dropdown.querySelector('.navbar__link');
          if (parentLink) parentLink.classList.add('navbar__link--active');
        }
      }
    });
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    initNavigation();
    initSmoothScroll();
    initForms();
    initAccordions();
    initTabs();
    initLightbox();
    initScrollToTop();
    setActiveNavLink();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return { showToast, init };
})();
