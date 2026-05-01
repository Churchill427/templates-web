/* ============================================
   PROFESSIONAL ORGANIZER - MAIN JAVASCRIPT
   ============================================ */

'use strict';

// --- Theme Management ---
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme);
    document.getElementById('themeToggle')?.addEventListener('click', () => this.toggle());
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// --- RTL Management ---
const RTLManager = {
  init() {
    const saved = localStorage.getItem('dir') || 'ltr';
    this.apply(saved);
    document.getElementById('rtlToggle')?.addEventListener('click', () => this.toggle());
  },
  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('dir', dir);
    const toggleBtn = document.getElementById('rtlToggle');
    if (toggleBtn) {
      toggleBtn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      toggleBtn.style.fontSize = '0.75rem';
      toggleBtn.style.fontWeight = '700';
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('dir');
    this.apply(current === 'rtl' ? 'ltr' : 'rtl');
  }
};

// --- Navbar ---
const Navbar = {
  init() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.navLinks = document.querySelector('.nav-links');
    if (!this.navbar) return;

    this.progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
      this.navbar.classList.toggle('scrolled', window.scrollY > 50);
      
      // Scroll Progress
      if (this.progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        this.progressBar.style.width = scrolled + "%";
      }
    });

    this.hamburger?.addEventListener('click', () => {
      this.hamburger.classList.toggle('active');
      this.navLinks.classList.toggle('open');
    });

    // Dropdowns
    document.querySelectorAll('.nav-dropdown').forEach(dd => {
      const toggle = dd.querySelector('.nav-dropdown-toggle');
      toggle?.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-dropdown').forEach(d => {
          if (d !== dd) d.classList.remove('open');
        });
        dd.classList.toggle('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link:not(.nav-dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        this.hamburger?.classList.remove('active');
        this.navLinks?.classList.remove('open');
      });
    });
  }
};

// --- Scroll Reveal ---
const ScrollReveal = {
  init() {
    this.elements = document.querySelectorAll('.reveal');
    if (!this.elements.length) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    this.elements.forEach(el => this.observer.observe(el));
  }
};

// --- FAQ Accordion ---
const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('open');

        // Close others
        document.querySelectorAll('.faq-item.open').forEach(open => {
          if (open !== item) {
            open.classList.remove('open');
            open.querySelector('.faq-answer').style.maxHeight = '0';
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }
};

// --- Counter Animation ---
const Counter = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => observer.observe(el));
  },
  animate(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};

// --- Before/After Slider ---
const BASlider = {
  init() {
    document.querySelectorAll('.ba-slider').forEach(slider => {
      const handle = slider.querySelector('.ba-handle');
      const after = slider.querySelector('.ba-after');
      if (!handle || !after) return;
      let isDragging = false;

      const updatePosition = (x) => {
        const rect = slider.getBoundingClientRect();
        let pos = ((x - rect.left) / rect.width) * 100;
        pos = Math.max(5, Math.min(95, pos));
        handle.style.left = pos + '%';
        after.style.width = (100 - pos) + '%';
      };

      handle.addEventListener('mousedown', () => isDragging = true);
      handle.addEventListener('touchstart', () => isDragging = true);
      document.addEventListener('mouseup', () => isDragging = false);
      document.addEventListener('touchend', () => isDragging = false);
      slider.addEventListener('mousemove', (e) => { if (isDragging) updatePosition(e.clientX); });
      slider.addEventListener('touchmove', (e) => { if (isDragging) updatePosition(e.touches[0].clientX); });
      slider.addEventListener('click', (e) => updatePosition(e.clientX));
    });
  }
};

// --- Form Validation ---
const FormValidator = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate(form)) {
          this.showSuccess(form);
        }
      });
    });
  },
  validate(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      this.clearError(input);
      if (!input.value.trim()) {
        this.showError(input, 'This field is required');
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        this.showError(input, 'Please enter a valid email');
        valid = false;
      }
    });
    return valid;
  },
  showError(input, msg) {
    input.classList.add('error');
    const err = document.createElement('div');
    err.className = 'form-error';
    err.textContent = msg;
    input.parentNode.appendChild(err);
  },
  clearError(input) {
    input.classList.remove('error');
    const err = input.parentNode.querySelector('.form-error');
    if (err) err.remove();
  },
  showSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
      btn.style.background = 'var(--success)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3000);
    }
  }
};

// --- Filter ---
const Filter = {
  init() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.filter-bar');
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const cards = document.querySelectorAll('[data-category]');
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
};

// --- View Toggle ---
const ViewToggle = {
  init() {
    document.querySelectorAll('.view-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.view-toggle');
        group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const grid = document.querySelector('.services-grid');
        if (!grid) return;
        if (btn.dataset.view === 'list') {
          grid.style.gridTemplateColumns = '1fr';
          grid.querySelectorAll('.service-card').forEach(c => c.style.display = 'grid');
        } else {
          grid.style.gridTemplateColumns = 'repeat(2,1fr)';
          grid.querySelectorAll('.service-card').forEach(c => c.style.display = 'block');
        }
      });
    });
  }
};

// --- Countdown Timer ---
const Countdown = {
  init() {
    const el = document.querySelector('.countdown');
    if (!el) return;
    const target = new Date();
    target.setDate(target.getDate() + 30);
    this.update(el, target);
    setInterval(() => this.update(el, target), 1000);
  },
  update(el, target) {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const days = el.querySelector('[data-days]');
    const hours = el.querySelector('[data-hours]');
    const mins = el.querySelector('[data-mins]');
    const secs = el.querySelector('[data-secs]');
    if (days) days.textContent = d;
    if (hours) hours.textContent = String(h).padStart(2, '0');
    if (mins) mins.textContent = String(m).padStart(2, '0');
    if (secs) secs.textContent = String(s).padStart(2, '0');
  }
};

// --- Active Page Highlight ---
const ActivePage = {
  init() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
    document.querySelectorAll('.nav-dropdown-item').forEach(link => {
      if (link.getAttribute('href') === path) {
        link.closest('.nav-dropdown')?.querySelector('.nav-dropdown-toggle')?.classList.add('active');
      }
    });
  }
};

// --- Smooth Scroll for Anchor Links ---
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  ScrollReveal.init();
  FAQ.init();
  Counter.init();
  BASlider.init();
  FormValidator.init();
  Filter.init();
  ViewToggle.init();
  Countdown.init();
  ActivePage.init();
  SmoothScroll.init();
});

// CSS animation for filter
const styleSheet = document.createElement('style');
styleSheet.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(styleSheet);
