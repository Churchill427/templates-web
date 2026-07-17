/* ============================================
   CRUM BAKERY — MAIN JS
   Theme Toggle, RTL Toggle, Utilities
   ============================================ */

'use strict';

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
const Utils = {
  /**
   * Debounce function — delays execution until after wait ms of inactivity
   */
  debounce(fn, wait = 150) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  },

  /**
   * Throttle function — limits execution to once per wait ms
   */
  throttle(fn, wait = 100) {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  },

  /**
   * Select single element
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Select all elements
   */
  $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  },

  /**
   * Create element with attributes and children
   */
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') el.className = value;
      else if (key === 'textContent') el.textContent = value;
      else if (key === 'innerHTML') el.innerHTML = value;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
      else el.setAttribute(key, value);
    });
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child) el.appendChild(child);
    });
    return el;
  },

  /**
   * LocalStorage helpers
   */
  storage: {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('LocalStorage unavailable:', e);
      }
    }
  },

  /**
   * Format price
   */
  formatPrice(price) {
    return `$${price.toFixed(2)}`;
  },

  /**
   * Generate unique ID
   */
  uid() {
    return Math.random().toString(36).slice(2, 9);
  }
};


/* ============================================
   THEME MANAGER
   ============================================ */
const ThemeManager = {
  STORAGE_KEY: 'crum-theme',
  
  init() {
    // Check saved preference, then system preference
    const saved = Utils.storage.get(this.STORAGE_KEY);
    if (saved) {
      this.apply(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(prefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!Utils.storage.get(this.STORAGE_KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });

    // Bind toggle buttons
    this.bindToggles();
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcons(theme);
    this.currentTheme = theme;
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    Utils.storage.set(this.STORAGE_KEY, next);
  },

  updateIcons(theme) {
    const icons = Utils.$$('.theme-toggle-icon');
    icons.forEach(icon => {
      // Show sun when dark (to switch to light), moon when light (to switch to dark)
      if (theme === 'dark') {
        icon.className = icon.className.replace(/ph-moon[^\s]*/g, '').trim();
        if (!icon.className.includes('ph-sun')) {
          icon.className = 'ph ph-sun theme-toggle-icon';
        }
        icon.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.className = icon.className.replace(/ph-sun[^\s]*/g, '').trim();
        if (!icon.className.includes('ph-moon')) {
          icon.className = 'ph ph-moon theme-toggle-icon';
        }
        icon.setAttribute('aria-label', 'Switch to dark mode');
      }
    });
  },

  bindToggles() {
    Utils.$$('[data-toggle-theme]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};


/* ============================================
   RTL MANAGER
   ============================================ */
const RTLManager = {
  STORAGE_KEY: 'crum-direction',

  init() {
    const saved = Utils.storage.get(this.STORAGE_KEY, 'ltr');
    this.apply(saved);
    this.bindToggles();
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    this.currentDir = dir;
    this.updateLabels(dir);
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    this.apply(next);
    Utils.storage.set(this.STORAGE_KEY, next);
  },

  updateLabels(dir) {
    Utils.$$('[data-toggle-rtl]').forEach(btn => {
      // Show current mode text
      const label = btn.querySelector('.rtl-label') || btn;
      if (label.classList.contains('rtl-label')) {
        label.textContent = dir.toUpperCase();
      } else {
        // If no inner label, update the button text
        const textNode = [...btn.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
        if (textNode) textNode.textContent = dir.toUpperCase();
      }
    });
  },

  bindToggles() {
    Utils.$$('[data-toggle-rtl]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};


/* ============================================
   TOAST NOTIFICATION SYSTEM
   ============================================ */
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = Utils.createElement('div', { 
        id: 'toast-container', 
        className: 'toast-container' 
      });
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 4000) {
    if (!this.container) this.init();

    const toast = Utils.createElement('div', {
      className: `toast toast-${type}`,
      innerHTML: `
        <i class="ph ph-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
        <span>${message}</span>
      `
    });

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error'); },
  info(message) { this.show(message, 'info'); }
};


/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
const ScrollProgress = {
  bar: null,

  init() {
    this.bar = document.querySelector('.scroll-progress');
    if (!this.bar) {
      this.bar = Utils.createElement('div', { className: 'scroll-progress' });
      document.body.prepend(this.bar);
    }

    window.addEventListener('scroll', Utils.throttle(() => this.update(), 16));
  },

  update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    this.bar.style.width = `${progress}%`;
  }
};


/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
const BackToTop = {
  btn: null,

  init() {
    this.btn = document.querySelector('.back-to-top');
    if (!this.btn) return;

    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));
    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  handleScroll() {
    if (window.scrollY > 500) {
      this.btn.classList.add('visible');
    } else {
      this.btn.classList.remove('visible');
    }
  }
};


/* ============================================
   LAZY LOADING IMAGES
   ============================================ */
const LazyLoader = {
  init() {
    const images = Utils.$$('img[data-src]');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px 0px' });

      images.forEach(img => observer.observe(img));
    } else {
      // Fallback: load all
      images.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.classList.add('loaded');
      });
    }
  }
};


/* ============================================
   BUTTON RIPPLE EFFECT
   ============================================ */
const RippleEffect = {
  init() {
    Utils.$$('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = Utils.createElement('span', {
          className: 'ripple',
        });
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;

        btn.classList.add('btn-ripple');
        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
};


/* ============================================
   ACCORDION
   ============================================ */
const Accordion = {
  init() {
    Utils.$$('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close siblings (single open mode)
        const accordion = item.closest('.accordion');
        if (accordion && accordion.dataset.singleOpen !== 'false') {
          Utils.$$('.accordion-item.active', accordion).forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove('active');
              openItem.querySelector('.accordion-content').style.maxHeight = '0';
            }
          });
        }

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }
};


/* ============================================
   MODAL / LIGHTBOX
   ============================================ */
const Modal = {
  init() {
    // Open triggers
    Utils.$$('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const target = document.getElementById(trigger.dataset.modal);
        if (target) this.open(target);
      });
    });

    // Close triggers
    Utils.$$('.modal-close, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          const overlay = el.closest('.modal-overlay') || el;
          this.close(overlay);
        }
      });
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const active = document.querySelector('.modal-overlay.active');
        if (active) this.close(active);
      }
    });
  },

  open(overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close(overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};


/* ============================================
   LIGHTBOX (for gallery images)
   ============================================ */
const Lightbox = {
  overlay: null,

  init() {
    // Create lightbox overlay
    this.overlay = document.querySelector('.lightbox-overlay');
    if (!this.overlay) {
      this.overlay = Utils.createElement('div', {
        className: 'lightbox-overlay',
        id: 'lightbox'
      });
      this.overlay.innerHTML = '<img src="" alt="Lightbox image">';
      document.body.appendChild(this.overlay);
    }

    // Bind triggers
    Utils.$$('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.dataset.lightbox || trigger.src || trigger.querySelector('img')?.src;
        const alt = trigger.alt || trigger.querySelector('img')?.alt || 'Gallery image';
        if (src) this.open(src, alt);
      });
    });

    // Close on click
    this.overlay.addEventListener('click', () => this.close());

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.close();
      }
    });
  },

  open(src, alt) {
    const img = this.overlay.querySelector('img');
    img.src = src;
    img.alt = alt;
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};


/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
const SmoothScroll = {
  init() {
    Utils.$$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }
};


/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Toast.init();
  ScrollProgress.init();
  BackToTop.init();
  LazyLoader.init();
  RippleEffect.init();
  Accordion.init();
  Modal.init();
  Lightbox.init();
  SmoothScroll.init();
});

// Export for use in other modules
window.CrumApp = {
  Utils,
  ThemeManager,
  RTLManager,
  Toast,
  ScrollProgress,
  BackToTop,
  LazyLoader,
  RippleEffect,
  Accordion,
  Modal,
  Lightbox,
  SmoothScroll
};
