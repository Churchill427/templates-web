/* ============================================
   SAAS TEMPLATE — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── MOBILE NAV TOGGLE ───
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }

  // ─── NAVBAR SCROLL EFFECT ───
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        navbar.style.borderBottomColor = 'rgba(255,255,255,0.1)';
      } else {
        navbar.style.borderBottomColor = '';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ─── ACTIVE NAV LINK ───
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── FAQ ACCORDION ───
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ─── PRICING TOGGLE ───
  const pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isAnnual = pricingToggle.checked;
      document.querySelectorAll('.price-amount').forEach(el => {
        const monthly = el.dataset.monthly;
        const annual = el.dataset.annual;
        el.textContent = isAnnual ? annual : monthly;
      });
      document.querySelectorAll('.price-period').forEach(el => {
        el.textContent = isAnnual ? '/year' : '/month';
      });
    });
  }

  // ─── COUNTDOWN TIMER (coming-soon) ───
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const targetDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) return;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = n => String(n).padStart(2, '0');
      ['days','hours','mins','secs'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = pad([d,h,m,s][i]);
      });
    };
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ─── COUNTER ANIMATION ───
  const counters = document.querySelectorAll('[data-count]');
  const observerOptions = { threshold: 0.5 };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 60;
        const update = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current < target) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, observerOptions);
  counters.forEach(el => counterObserver.observe(el));

  // ─── SMOOTH SCROLL REVEAL ───
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => revealObserver.observe(el));
  }

  // ─── CONTACT FORM ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent! We\'ll get back to you soon.', 'success');
      contactForm.reset();
    });
  }

  // ─── AUTH FORMS ───
  ['loginForm','registerForm'].forEach(id => {
    const form = document.getElementById(id);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Redirecting...', 'success');
        setTimeout(() => window.location.href = 'user-dashboard.html', 800);
      });
    }
  });

  // ─── SIDEBAR TOGGLE (dashboard) ───
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // ─── TOAST SYSTEM ───
  window.showToast = (message, type = 'success') => {
    let area = document.querySelector('.toast-area');
    if (!area) {
      area = document.createElement('div');
      area.className = 'toast-area';
      document.body.appendChild(area);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '✗'}</span>
      <span>${message}</span>
    `;
    area.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; setTimeout(() => toast.remove(), 300); }, 3500);
  };

});

  // ─── NAV DROPDOWN ───
  document.querySelectorAll('.nav-item-dropdown').forEach(item => {
    const trigger = item.querySelector(':scope > a');

    // Mobile: tap trigger to toggle open; dropdown items navigate normally
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        document.querySelectorAll('.nav-item-dropdown').forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      }
      // Desktop: CSS hover handles show/hide — trigger navigates freely
    });

    // Dropdown items: always allow navigation, just close dropdown
    item.querySelectorAll('.nav-dropdown-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.remove('open');
        // href navigation proceeds naturally
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
  });

});
