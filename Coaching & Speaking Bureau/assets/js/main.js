/* ============================================
   MAIN.JS - Core Application Logic
   ============================================ */
'use strict';

const App = (() => {
  /**
   * Initialize Navbar scroll behavior
   */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;

          if (scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }

          lastScroll = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check initial position
  }

  /**
   * Initialize mobile menu
   */
  function initMobileMenu() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.navbar__mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Initialize dropdowns (user menu, etc.)
   */
  function initDropdowns() {
    // User dropdown toggle
    const userDropdowns = document.querySelectorAll('.navbar__user-dropdown');
    userDropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.navbar__util-btn');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      userDropdowns.forEach(d => d.classList.remove('active'));
    });
  }

  /**
   * Initialize accordion components
   */
  function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
      const items = accordion.querySelectorAll('.accordion__item');

      items.forEach(item => {
        const trigger = item.querySelector('.accordion__trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all items in this accordion
          items.forEach(i => i.classList.remove('active'));

          // Toggle clicked item
          if (!isActive) {
            item.classList.add('active');
          }
        });
      });
    });
  }

  /**
   * Initialize scroll to top button
   */
  function initScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.pageYOffset > 400) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Initialize form validation
   */
  function initForms() {
    const forms = document.querySelectorAll('[data-validate]');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        let valid = true;
        const inputs = form.querySelectorAll('[required]');

        inputs.forEach(input => {
          clearError(input);

          if (!input.value.trim()) {
            showError(input, 'This field is required');
            valid = false;
          } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            valid = false;
          }
        });

        if (valid) {
          showToast('Form submitted successfully!', 'success');
          form.reset();
        }
      });

      // Real-time validation
      form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', () => {
          clearError(input);
          if (input.required && !input.value.trim()) {
            showError(input, 'This field is required');
          } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
          }
        });

        input.addEventListener('input', () => {
          clearError(input);
        });
      });
    });
  }

  /**
   * Show form error
   */
  function showError(input, message) {
    input.classList.add('form-input--error');
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);
  }

  /**
   * Clear form error
   */
  function clearError(input) {
    input.classList.remove('form-input--error');
    const error = input.parentNode.querySelector('.form-error');
    if (error) error.remove();
  }

  /**
   * Email validation
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Show toast notification
   */
  function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.borderLeftColor = type === 'success' ? 'var(--color-accent)' :
                                   type === 'error' ? 'var(--color-error)' : 'var(--color-info)';

    // RTL support
    if (document.documentElement.dir === 'rtl') {
      toast.style.borderLeftColor = 'transparent';
      toast.style.borderRightColor = type === 'success' ? 'var(--color-accent)' :
                                      type === 'error' ? 'var(--color-error)' : 'var(--color-info)';
    }

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /**
   * Initialize lightbox
   */
  function initLightbox() {
    const triggers = document.querySelectorAll('[data-lightbox]');
    const lightbox = document.querySelector('.lightbox');
    if (!triggers.length || !lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.getAttribute('data-lightbox') || trigger.src;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /**
   * Initialize category tabs
   */
  function initCategoryTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');
    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.category-tab');
      const targetId = container.getAttribute('data-tabs');
      const items = document.querySelectorAll(`[data-category]`);

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const category = tab.getAttribute('data-filter');

          items.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
              item.style.display = '';
              item.classList.add('fade-in');
            } else {
              item.style.display = 'none';
              item.classList.remove('fade-in');
            }
          });
        });
      });
    });
  }

  /**
   * Initialize smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * Set active nav link based on current page
   */
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar__link, .navbar__dropdown-item');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
        // If in dropdown, also activate parent
        const parentDropdown = link.closest('.navbar__dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector('.navbar__dropdown-toggle');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });
  }

  /**
   * Initialize page transition effect
   */
  function initPageTransition() {
    document.body.classList.add('page-transition');
  }

  /**
   * Initialize everything
   */
  function init() {
    initNavbar();
    initMobileMenu();
    initDropdowns();
    initAccordions();
    initScrollTop();
    initForms();
    initLightbox();
    initCategoryTabs();
    initSmoothScroll();
    setActiveNavLink();
    initPageTransition();
  }

  return { init, showToast };
})();

document.addEventListener('DOMContentLoaded', App.init);
