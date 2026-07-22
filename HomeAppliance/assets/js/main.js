/**
 * HOME - Home Appliance Store & Service Center
 * Master Main Script (assets/js/main.js)
 * Handles Theme Toggle, RTL/LTR Toggle, Mobile Navbar, Cart Drawer, Scroll Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initNavbar();
  initCartDrawer();
  initScrollReveal();
  initStatsCounter();
  initSocialLogos();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('home_theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('home_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const themeIcons = document.querySelectorAll('.theme-icon');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      // Sun icon for switching back to light
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    } else {
      // Moon icon for switching to dark
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
  });
}

/* --------------------------------------------------------------------------
   2. Direction Management (LTR / RTL)
   -------------------------------------------------------------------------- */
function initDirection() {
  const dirToggles = document.querySelectorAll('.dir-toggle-btn');
  const savedDir = localStorage.getItem('home_dir') || 'ltr';

  document.documentElement.setAttribute('dir', savedDir);
  updateDirButtons(savedDir);

  dirToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('home_dir', newDir);
      updateDirButtons(newDir);
    });
  });
}

function updateDirButtons(dir) {
  const dirLabels = document.querySelectorAll('.dir-label');
  dirLabels.forEach(label => {
    label.textContent = dir.toUpperCase();
  });
}

/* --------------------------------------------------------------------------
   3. Navbar & Mobile Menu Logic
   -------------------------------------------------------------------------- */
function initNavbar() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Highlight active link based on window location
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-item-dropdown');
      if (parentDropdown) {
        const topLink = parentDropdown.querySelector('.nav-link');
        if (topLink) topLink.classList.add('active');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   4. Cart Drawer Logic & Badge Count
   -------------------------------------------------------------------------- */
let cart = JSON.parse(localStorage.getItem('home_cart')) || [
  { id: 'p1', name: 'Smart Inverter Refrigerator 450L', price: 1299, image: 'assets/img/fridge.png', qty: 1 }
];

function initCartDrawer() {
  const cartBtns = document.querySelectorAll('.cart-toggle-btn');
  const overlay = document.querySelector('.cart-drawer-overlay');
  const closeBtn = document.querySelector('.cart-close-btn');

  updateCartUI();

  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (overlay) overlay.classList.add('active');
    });
  });

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  }
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem('home_cart', JSON.stringify(cart));
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

function updateCartUI() {
  const badgeCounts = document.querySelectorAll('.cart-badge-count');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  badgeCounts.forEach(b => b.textContent = totalItems);

  const cartList = document.querySelector('.cart-items-list');
  const cartTotalEl = document.querySelector('.cart-total-price');

  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-muted);">Your cart is empty</div>`;
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      html += `
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          <div style="flex: 1;">
            <h5 style="font-size: 0.9rem; margin-bottom: 0.25rem;">${item.name}</h5>
            <div style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem;">$${item.price} x ${item.qty}</div>
          </div>
          <button onclick="removeFromCart('${item.id}')" style="background:none; color: #EF4444; font-size: 1.1rem;">&times;</button>
        </div>
      `;
    });

    cartList.innerHTML = html;
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('home_cart', JSON.stringify(cart));
  updateCartUI();
}

/* --------------------------------------------------------------------------
   5. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--color-primary);
      color: #FFF;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 999;
      font-weight: 600;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
}

/* --------------------------------------------------------------------------
   6. Scroll Reveal, Navbar Shrink, Card Tilt, Back-to-Top & Stats Counter
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  // Respect reduced motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Premium Scroll Reveal (Intersection Observer)
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active', 'revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Dynamically add reveal classes to premium elements if not already present
  document.querySelectorAll('.card, .section-header, .product-card, .category-card, .split-image-wrapper, .accordion-item, .wizard-card, .timeline-step').forEach(el => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-fade') && !el.classList.contains('reveal-scale')) {
      el.classList.add('reveal-up');
    }
  });

  // Add stagger class to all grids for cascading reveal
  document.querySelectorAll('.grid-2, .grid-3, .grid-4').forEach(grid => {
    grid.classList.add('reveal-stagger');
  });

  // Target all reveal classes
  document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-scale, .reveal-on-scroll').forEach(el => observer.observe(el));

  // 2. Navbar Shrink Interactive Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('shrink');
      } else {
        navbar.classList.remove('shrink');
      }
    }, { passive: true });
  }

  // 3. Premium Card Tilt Effect (disabled on mobile & reduced motion)
  if (!prefersReducedMotion && window.innerWidth >= 768) {
    initCardTilt();
  }

  // 4. Wishlist Toggle
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        btn.style.color = '#EF4444';
        showToast('Added to wishlist!');
      } else {
        btn.style.color = '';
        showToast('Removed from wishlist');
      }
    });
  });

  // 5. Back to Top Button (auto-created)
  createBackToTop();
}

function initCardTilt() {
  const cards = document.querySelectorAll('.card, .category-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function createBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Back to Top');
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
  btn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-primary);
    color: #FFF;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-primary);
    z-index: 90;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s ease;
    pointer-events: none;
  `;
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'var(--color-secondary)';
    btn.style.color = '#0F172A';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'var(--color-primary)';
    btn.style.color = '#FFF';
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
      btn.style.pointerEvents = 'none';
    }
  }, { passive: true });
}

function initStatsCounter() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 50;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            counter.innerText = Math.ceil(count) + '+';
            setTimeout(updateCount, 30);
          } else {
            counter.innerText = target + '+';
          }
        };

        updateCount();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   7. Official Social Media Logos
   -------------------------------------------------------------------------- */
function initSocialLogos() {
  const googleBtn = document.querySelectorAll('.social-btn.google');
  const appleBtn = document.querySelectorAll('.social-btn.apple');
  const facebookBtn = document.querySelectorAll('.social-btn.facebook');

  const googleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.886H12.24z"/></svg>`;
  const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/></svg>`;
  const facebookSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;

  googleBtn.forEach(btn => btn.innerHTML = googleSvg);
  appleBtn.forEach(btn => btn.innerHTML = appleSvg);
  facebookBtn.forEach(btn => btn.innerHTML = facebookSvg);
}
