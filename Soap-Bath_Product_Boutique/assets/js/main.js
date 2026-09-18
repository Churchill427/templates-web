/* ============================================================================
   SUDZ — Global JavaScript Module
   ============================================================================
   
   Modules:
   1. Theme Toggle (light/dark, localStorage, system preference)
   2. RTL/LTR Toggle (localStorage persisted)
   3. Navbar Controller (scroll, hamburger, dropdowns, active link)
   4. Scroll Reveal (Intersection Observer)
   5. Animated Counters
   6. Cart State Management (localStorage)
   7. Form Validation
   8. Scroll Row (horizontal scroll with arrows)
   9. Accordion
   10. Tabs
   11. Countdown Timer
   12. Toast Notifications
   13. Parallax
   ============================================================================ */

'use strict';

/* ── 1. Theme Toggle ───────────────────────────────────────────────────────── */
const ThemeManager = {
  STORAGE_KEY: 'sudz-theme',
  
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.apply(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.apply('dark');
    } else {
      this.apply('light');
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
    
    // Bind toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcons(theme);
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },
  
  updateIcons(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
      }
    });
  }
};

/* ── 2. RTL/LTR Toggle ─────────────────────────────────────────────────────── */
const DirectionManager = {
  STORAGE_KEY: 'sudz-direction',
  
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.apply(saved);
    } else {
      this.apply('ltr');
    }
    
    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  
  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    this.updateLabels(dir);
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },
  
  updateLabels(dir) {
    // Button shows the mode you'll switch TO
    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
    });
  }
};

/* ── 3. Navbar Controller ──────────────────────────────────────────────────── */
const NavbarController = {
  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Scroll shadow
    this.handleScroll(navbar);
    window.addEventListener('scroll', () => this.handleScroll(navbar), { passive: true });
    
    // Hamburger
    this.initHamburger();
    
    // Dropdowns
    this.initDropdowns();
    
    // Active link
    this.highlightActiveLink();
  },
  
  handleScroll(navbar) {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  },
  
  initHamburger() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const panel = document.querySelector('.navbar__mobile-panel');
    if (!hamburger || !panel) return;
    
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      panel.classList.toggle('open');
      document.body.style.overflow = panel.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close on link click
    panel.querySelectorAll('.navbar__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  },
  
  initDropdowns() {
    document.querySelectorAll('.navbar__dropdown').forEach(dropdown => {
      const toggle = dropdown.querySelector('.navbar__dropdown-toggle');
      if (!toggle) return;
      
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.navbar__dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        
        dropdown.classList.toggle('open');
      });
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.navbar__dropdown.open').forEach(d => {
        d.classList.remove('open');
      });
    });
  },
  
  highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || href === './' + currentPage)) {
        link.classList.add('active');
      }
    });
  }
};

/* ── 4. Scroll Reveal ──────────────────────────────────────────────────────── */
const ScrollReveal = {
  init() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};

/* ── 5. Animated Counters ──────────────────────────────────────────────────── */
const AnimatedCounters = {
  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.count-up').forEach(el => {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
  },
  
  animate(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();
    
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    };
    
    requestAnimationFrame(step);
  }
};

/* ── 6. Cart State Management ──────────────────────────────────────────────── */
const CartManager = {
  STORAGE_KEY: 'sudz-cart',
  
  init() {
    this.updateBadge();
  },
  
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },
  
  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.updateBadge();
  },
  
  addItem(product) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    this.saveCart(cart);
    this.flyToCartAnimation(event);
    ToastManager.show('Added to cart!', 'success');
  },
  
  removeItem(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
  },
  
  updateQuantity(productId, delta) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(productId);
        return;
      }
    }
    this.saveCart(cart);
  },
  
  getTotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  getItemCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },
  
  clearCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateBadge();
  },
  
  updateBadge() {
    const count = this.getItemCount();
    document.querySelectorAll('.navbar__cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    });
  },
  
  flyToCartAnimation(e) {
    if (!e || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const cartIcon = document.querySelector('.navbar__cart');
    if (!cartIcon) return;
    
    // Create flying element
    const flyer = document.createElement('div');
    flyer.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: var(--clr-accent);
      border-radius: 50%;
      z-index: 9999;
      pointer-events: none;
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    const startRect = e.target ? e.target.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
    const endRect = cartIcon.getBoundingClientRect();
    
    flyer.style.left = startRect.left + 'px';
    flyer.style.top = startRect.top + 'px';
    
    document.body.appendChild(flyer);
    
    requestAnimationFrame(() => {
      flyer.style.left = endRect.left + endRect.width / 2 + 'px';
      flyer.style.top = endRect.top + endRect.height / 2 + 'px';
      flyer.style.transform = 'scale(0)';
      flyer.style.opacity = '0';
    });
    
    setTimeout(() => flyer.remove(), 700);
  }
};

/* ── 7. Form Validation ────────────────────────────────────────────────────── */
const FormValidator = {
  init() {
    document.querySelectorAll('[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateForm(form)) {
          this.handleSubmit(form);
        }
      });
      
      // Live validation on blur
      form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.closest('.form-group')?.classList.contains('has-error')) {
            this.validateField(input);
          }
        });
      });
    });
  },
  
  validateForm(form) {
    let isValid = true;
    form.querySelectorAll('[required], [data-validate-type]').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  },
  
  validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;
    
    const errorEl = group.querySelector('.form-error');
    let isValid = true;
    let errorMsg = '';
    
    // Required check
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMsg = 'This field is required';
    }
    
    // Email check
    if (isValid && field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address';
      }
    }
    
    // Min length
    if (isValid && field.getAttribute('minlength')) {
      const min = parseInt(field.getAttribute('minlength'));
      if (field.value.length < min) {
        isValid = false;
        errorMsg = `Must be at least ${min} characters`;
      }
    }
    
    // Password match
    if (isValid && field.getAttribute('data-match')) {
      const matchField = document.getElementById(field.getAttribute('data-match'));
      if (matchField && field.value !== matchField.value) {
        isValid = false;
        errorMsg = 'Passwords do not match';
      }
    }
    
    // Checkbox required
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMsg = 'You must accept the terms';
    }
    
    // Apply state
    if (isValid) {
      group.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
    } else {
      group.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMsg;
    }
    
    return isValid;
  },
  
  handleSubmit(form) {
    const formId = form.id || 'form';
    ToastManager.show('Form submitted successfully!', 'success');
    
    // Reset form
    setTimeout(() => {
      form.reset();
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    }, 1000);
  }
};

/* ── 8. Scroll Row Controller ──────────────────────────────────────────────── */
const ScrollRowController = {
  init() {
    document.querySelectorAll('.scroll-row-wrapper').forEach(wrapper => {
      const row = wrapper.querySelector('.scroll-row');
      const prevBtn = wrapper.querySelector('.scroll-row__btn--prev');
      const nextBtn = wrapper.querySelector('.scroll-row__btn--next');
      
      if (!row) return;
      
      const scrollAmount = 320;
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
      }
    });
  }
};

/* ── 9. Accordion Controller ───────────────────────────────────────────────── */
const AccordionController = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const parent = item.parentElement;
        
        // Close others (single open mode)
        parent.querySelectorAll('.accordion-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            const body = openItem.querySelector('.accordion-body');
            if (body) body.style.maxHeight = '0';
          }
        });
        
        // Toggle current
        item.classList.toggle('open');
        const body = item.querySelector('.accordion-body');
        if (body) {
          body.style.maxHeight = item.classList.contains('open') 
            ? body.scrollHeight + 'px' 
            : '0';
        }
      });
    });
  }
};

/* ── 10. Tabs Controller ───────────────────────────────────────────────────── */
const TabsController = {
  init() {
    document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
      const pills = tabGroup.querySelectorAll('.tab-pill');
      const panels = tabGroup.querySelectorAll('[data-tab-panel]');
      
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          const target = pill.getAttribute('data-tab');
          
          // Update pills
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          
          // Update panels with crossfade
          panels.forEach(panel => {
            if (panel.getAttribute('data-tab-panel') === target) {
              panel.style.display = 'block';
              panel.style.opacity = '0';
              requestAnimationFrame(() => {
                panel.style.transition = 'opacity 0.3s ease';
                panel.style.opacity = '1';
              });
            } else {
              panel.style.opacity = '0';
              setTimeout(() => { panel.style.display = 'none'; }, 300);
            }
          });
        });
      });
    });
  }
};

/* ── 11. Countdown Timer ───────────────────────────────────────────────────── */
const CountdownTimer = {
  init() {
    document.querySelectorAll('[data-countdown]').forEach(timer => {
      const target = new Date(timer.getAttribute('data-countdown')).getTime();
      
      const update = () => {
        const now = Date.now();
        const diff = Math.max(0, target - now);
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = timer.querySelector('[data-days]');
        const hoursEl = timer.querySelector('[data-hours]');
        const minsEl = timer.querySelector('[data-minutes]');
        const secsEl = timer.querySelector('[data-seconds]');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
        
        if (diff > 0) {
          requestAnimationFrame(() => setTimeout(update, 1000));
        }
      };
      
      update();
    });
  }
};

/* ── 12. Toast Notifications ───────────────────────────────────────────────── */
const ToastManager = {
  show(message, type = 'default', duration = 3000) {
    // Remove existing toast
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const iconSvg = type === 'success' 
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
      : type === 'error'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    
    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => toast.classList.add('visible'));
    
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

/* ── 13. Parallax ──────────────────────────────────────────────────────────── */
const ParallaxController = {
  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Only enable on desktop
    if (window.innerWidth < 768) return;
    
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + scrollY) * speed;
            el.style.transform = `translateY(${scrollY * speed - offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
};

/* ── 14. Password Visibility Toggle ────────────────────────────────────────── */
const PasswordToggle = {
  init() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling || btn.closest('.form-group')?.querySelector('input[type="password"], input[type="text"]');
        if (!input) return;
        
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const showIcon = btn.querySelector('.icon-eye');
        const hideIcon = btn.querySelector('.icon-eye-off');
        if (showIcon) showIcon.style.display = isPassword ? 'none' : 'block';
        if (hideIcon) hideIcon.style.display = isPassword ? 'block' : 'none';
      });
    });
  }
};

/* ── 15. Password Strength Meter ───────────────────────────────────────────── */
const PasswordStrength = {
  init() {
    document.querySelectorAll('[data-password-strength]').forEach(input => {
      const meter = document.querySelector(input.getAttribute('data-password-strength'));
      if (!meter) return;
      
      input.addEventListener('input', () => {
        const strength = this.calculate(input.value);
        const bars = meter.querySelectorAll('.password-strength__bar');
        
        bars.forEach((bar, i) => {
          bar.className = 'password-strength__bar';
          if (i < strength) {
            const level = ['weak', 'fair', 'good', 'strong'][Math.min(strength - 1, 3)];
            bar.classList.add(level);
          }
        });
      });
    });
  },
  
  calculate(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  }
};

/* ── 16. Bubbles Generator (for heroes and backgrounds) ────────────────────── */
const BubbleGenerator = {
  init() {
    document.querySelectorAll('[data-bubbles]').forEach(container => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const count = parseInt(container.getAttribute('data-bubbles')) || 12;
      
      for (let i = 0; i < count; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 30 + 8;
        bubble.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          bottom: -${size}px;
          animation: bubbleRise ${Math.random() * 6 + 6}s linear ${Math.random() * 5}s infinite;
          opacity: ${Math.random() * 0.3 + 0.1};
        `;
        container.appendChild(bubble);
      }
    });
  }
};

/* ── 17. Recently Viewed (Session Storage) ─────────────────────────────────── */
const RecentlyViewed = {
  STORAGE_KEY: 'sudz-recently-viewed',
  MAX_ITEMS: 4,
  
  add(product) {
    let items = this.get();
    items = items.filter(i => i.id !== product.id);
    items.unshift(product);
    items = items.slice(0, this.MAX_ITEMS);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  },
  
  get() {
    try {
      return JSON.parse(sessionStorage.getItem(this.STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }
};

/* ── 18. Smooth Scroll to anchors ──────────────────────────────────────────── */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }
};

/* ── 19. Build-a-Box (Gifting page) ────────────────────────────────────────── */
const BuildABox = {
  state: {
    step: 1,
    size: null,
    products: [],
    note: '',
    minProducts: 3,
    maxProducts: 6
  },
  
  init() {
    const builder = document.querySelector('[data-build-a-box]');
    if (!builder) return;
    
    this.builder = builder;
    this.bindEvents();
    this.updateUI();
  },
  
  bindEvents() {
    // Box size selection
    this.builder.querySelectorAll('[data-box-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.size = btn.getAttribute('data-box-size');
        this.state.maxProducts = this.state.size === 'small' ? 3 : this.state.size === 'medium' ? 4 : 6;
        this.state.minProducts = this.state.size === 'small' ? 3 : this.state.size === 'medium' ? 4 : 5;
        this.goToStep(2);
      });
    });
    
    // Product selection
    this.builder.querySelectorAll('[data-box-product]').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.getAttribute('data-box-product');
        if (this.state.products.includes(id)) {
          this.state.products = this.state.products.filter(p => p !== id);
          tile.classList.remove('selected');
        } else if (this.state.products.length < this.state.maxProducts) {
          this.state.products.push(id);
          tile.classList.add('selected');
        }
        this.updateUI();
      });
    });
    
    // Navigation
    this.builder.querySelectorAll('[data-box-next]').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });
    
    this.builder.querySelectorAll('[data-box-prev]').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });
  },
  
  nextStep() {
    if (this.state.step === 2 && this.state.products.length < this.state.minProducts) {
      ToastManager.show(`Please select at least ${this.state.minProducts} products`, 'error');
      return;
    }
    this.goToStep(this.state.step + 1);
  },
  
  prevStep() {
    this.goToStep(this.state.step - 1);
  },
  
  goToStep(step) {
    this.state.step = step;
    this.builder.querySelectorAll('[data-box-step]').forEach(panel => {
      panel.style.display = parseInt(panel.getAttribute('data-box-step')) === step ? 'block' : 'none';
    });
    
    // Update progress
    this.builder.querySelectorAll('.build-progress__step').forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 <= step);
      dot.classList.toggle('current', i + 1 === step);
    });
    
    this.updateUI();
  },
  
  updateUI() {
    // Update running total
    const totalEl = this.builder.querySelector('[data-box-total]');
    if (totalEl) {
      const prices = { small: 35, medium: 49, large: 65 };
      totalEl.textContent = '$' + (prices[this.state.size] || 0);
    }
    
    // Update count
    const countEl = this.builder.querySelector('[data-box-count]');
    if (countEl) {
      countEl.textContent = `${this.state.products.length}/${this.state.maxProducts}`;
    }
  }
};

/* ── Global Init ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  DirectionManager.init();
  NavbarController.init();
  ScrollReveal.init();
  AnimatedCounters.init();
  CartManager.init();
  FormValidator.init();
  ScrollRowController.init();
  AccordionController.init();
  TabsController.init();
  CountdownTimer.init();
  ParallaxController.init();
  PasswordToggle.init();
  PasswordStrength.init();
  BubbleGenerator.init();
  BuildABox.init();
  SmoothScroll.init();
});
