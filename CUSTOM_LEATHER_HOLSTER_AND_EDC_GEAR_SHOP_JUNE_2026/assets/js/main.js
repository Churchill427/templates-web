/* ============================================================
   GRAIN LEATHER WORKS — Main JavaScript
   Handles: Theme Toggle, RTL Toggle, Navigation, Scroll Reveals
   ============================================================ */

'use strict';

// ============================================================
// 1. THEME MANAGEMENT
// ============================================================
const ThemeManager = {
  STORAGE_KEY: 'grain-theme',
  DARK: 'dark',
  LIGHT: 'light',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.apply(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.apply(this.DARK);
    } else {
      this.apply(this.LIGHT);
    }

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.apply(e.matches ? this.DARK : this.LIGHT);
      }
    });

    // Bind toggle buttons
    document.querySelectorAll('[data-toggle-theme]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcons(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || this.LIGHT;
    const next = current === this.DARK ? this.LIGHT : this.DARK;
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },

  updateIcons(theme) {
    document.querySelectorAll('.theme-icon--light').forEach(el => {
      el.style.display = theme === this.DARK ? 'none' : 'block';
    });
    document.querySelectorAll('.theme-icon--dark').forEach(el => {
      el.style.display = theme === this.DARK ? 'block' : 'none';
    });
  }
};

// ============================================================
// 2. RTL / LTR MANAGEMENT
// ============================================================
const RTLManager = {
  STORAGE_KEY: 'grain-dir',
  RTL: 'rtl',
  LTR: 'ltr',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.apply(saved || this.LTR);

    document.querySelectorAll('[data-toggle-rtl]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    // Update button labels to show current mode
    document.querySelectorAll('[data-toggle-rtl] .rtl-label').forEach(el => {
      el.textContent = dir.toUpperCase();
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || this.LTR;
    const next = current === this.RTL ? this.LTR : this.RTL;
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  }
};

// ============================================================
// 3. NAVIGATION
// ============================================================
const Navigation = {
  init() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.navbar__hamburger');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.dropdowns = document.querySelectorAll('.navbar__dropdown');

    if (this.hamburger && this.mobileNav) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile nav on link click
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });

    // Dropdown menus
    this.dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.navbar__dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleDropdown(dropdown);
        });
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      this.dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    });

    // Navbar scroll behavior
    if (this.navbar) {
      this.handleScroll();
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    // Highlight active nav link
    this.highlightActive();
  },

  toggleMobile() {
    const isOpen = this.mobileNav.classList.contains('open');
    if (isOpen) {
      this.closeMobile();
    } else {
      this.openMobile();
    }
  },

  openMobile() {
    this.mobileNav.classList.add('open');
    this.hamburger.classList.add('open');
    document.body.classList.add('no-scroll');
  },

  closeMobile() {
    this.mobileNav.classList.remove('open');
    this.hamburger.classList.remove('open');
    document.body.classList.remove('no-scroll');
  },

  toggleDropdown(dropdown) {
    const isOpen = dropdown.classList.contains('open');
    this.dropdowns.forEach(d => d.classList.remove('open'));
    if (!isOpen) {
      dropdown.classList.add('open');
    }
  },

  handleScroll() {
    if (window.scrollY > 20) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  },

  highlightActive() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';

    document.querySelectorAll('.navbar__link, .mobile-nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      if (linkFile === filename || (filename === '' && linkFile === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

// ============================================================
// 4. SCROLL REVEAL ANIMATIONS
// ============================================================
const ScrollReveal = {
  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve stagger parents until children animate
          if (!entry.target.classList.contains('reveal-stagger')) {
            this.observer.unobserve(entry.target);
          } else {
            // Unobserve after animation completes
            setTimeout(() => this.observer.unobserve(entry.target), 800);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      this.observer.observe(el);
    });
  }
};

// ============================================================
// 5. ACCORDION
// ============================================================
const Accordion = {
  init() {
    document.querySelectorAll('.accordion__trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion__item');
        const accordion = item.closest('.accordion');
        const isOpen = item.classList.contains('open');

        // Close all items in this accordion
        accordion.querySelectorAll('.accordion__item').forEach(i => {
          i.classList.remove('open');
          const content = i.querySelector('.accordion__content');
          if (content) content.style.maxHeight = null;
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('open');
          const content = item.querySelector('.accordion__content');
          if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
      });
    });
  }
};

// ============================================================
// 6. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

// ============================================================
// 7. MATERIAL SWATCHES (Interactive)
// ============================================================
const Swatches = {
  init() {
    document.querySelectorAll('.swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        // Deselect siblings
        const grid = swatch.closest('.swatch-grid');
        if (grid) {
          grid.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
        }
        swatch.classList.add('selected');
      });
    });
  }
};

// ============================================================
// 8. COMPARISON SLIDER (Portfolio)
// ============================================================
const ComparisonSlider = {
  init() {
    document.querySelectorAll('.comparison-slider').forEach(slider => {
      const handle = slider.querySelector('.comparison-slider__handle');
      const beforeWrap = slider.querySelector('.comparison-slider__before-wrap');
      let isDragging = false;

      const updatePosition = (x) => {
        const rect = slider.getBoundingClientRect();
        let percentage = ((x - rect.left) / rect.width) * 100;
        percentage = Math.max(5, Math.min(95, percentage));

        if (handle) handle.style.left = percentage + '%';
        if (beforeWrap) beforeWrap.style.width = percentage + '%';
      };

      slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updatePosition(e.clientX);
      });

      window.addEventListener('mousemove', (e) => {
        if (isDragging) updatePosition(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch support
      slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updatePosition(e.touches[0].clientX);
      }, { passive: true });

      slider.addEventListener('touchmove', (e) => {
        if (isDragging) updatePosition(e.touches[0].clientX);
      }, { passive: true });

      slider.addEventListener('touchend', () => {
        isDragging = false;
      });
    });
  }
};

// ============================================================
// 9. FILTER BUTTONS (Gallery / Products)
// ============================================================
const FilterButtons = {
  init() {
    document.querySelectorAll('.filter-bar, [data-filter-target]').forEach(bar => {
      const buttons = bar.querySelectorAll('.filter-btn, .pill');
      const targetId = bar.getAttribute('data-filter-target');
      const target = targetId ? document.getElementById(targetId) : null;

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filter = btn.getAttribute('data-filter');
          if (target) {
            target.querySelectorAll('[data-category]').forEach(item => {
              if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = '';
                item.style.animation = 'fadeInUp 0.4s ease forwards';
              } else {
                item.style.display = 'none';
              }
            });
          }
        });
      });
    });
  }
};
// ============================================================
// 10. BACK TO TOP
// ============================================================
const BackToTop = {
  init() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ============================================================
// 11. STAR RATING (Testimonials)
// ============================================================
function generateStars(count) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < count) {
      html += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else {
      html += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
  }
  return html;
}

// ============================================================
// 12. INITIALIZE EVERYTHING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navigation.init();
  ScrollReveal.init();
  Accordion.init();
  SmoothScroll.init();
  Swatches.init();
  ComparisonSlider.init();
  FilterButtons.init();
  BackToTop.init();
});
