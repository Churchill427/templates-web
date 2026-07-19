/* ============================================
   PAWLY — Main JavaScript
   Navigation, Dropdowns, Hamburger, Utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initDropdowns();
  initActiveNavLink();
  initSmoothScroll();
});

/* ── Navbar Scroll Behavior ── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ── Mobile Navigation ── */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  if (!hamburger || !mobileNav) return;

  function toggleMobileNav() {
    const isActive = mobileNav.classList.contains('active');

    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');

    if (mobileOverlay) {
      mobileOverlay.classList.toggle('active');
    }

    document.body.style.overflow = isActive ? '' : 'hidden';

    hamburger.setAttribute('aria-expanded', !isActive);
  }

  function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    if (mobileOverlay) {
      mobileOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', toggleMobileNav);

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close on nav link click
  mobileNav.querySelectorAll('.nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Mobile dropdown toggles
  mobileNav.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const items = toggle.nextElementSibling;
      if (items && items.classList.contains('mobile-dropdown-items')) {
        items.classList.toggle('open');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.style.transform = items.classList.contains('open') ? 'rotate(180deg)' : '';
        }
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });
}

/* ── Desktop Dropdowns ── */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    if (!toggle || !menu) return;

    // Keyboard accessibility
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  });
}

/* ── Active Nav Link Detection ── */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav .nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPage = href.split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active');
    }

    // Handle dropdown parent active state
    if (link.closest('.nav-dropdown')) {
      const dropdownMenu = link.closest('.nav-dropdown-menu');
      if (dropdownMenu) {
        const parentToggle = link.closest('.nav-dropdown').querySelector('.nav-dropdown-toggle');
        if (parentToggle && linkPage === currentPage) {
          parentToggle.classList.add('active');
        }
      }
    }
  });
}

/* ── Smooth Scroll for Anchor Links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ── Utility: Debounce ── */
function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/* ── Utility: Throttle ── */
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ── Utility: Format Number ── */
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/* ── Utility: Get CSS Variable ── */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ── Accordion ── */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasActive = item.classList.contains('active');

      // Close all accordions in same container
      const container = item.parentElement;
      container.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
      });

      // Toggle clicked
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ── Tabs ── */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.tab-btn');
    const contentContainer = tabContainer.nextElementSibling;

    if (!contentContainer) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        // Update buttons
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content
        if (contentContainer) {
          contentContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          const targetContent = contentContainer.querySelector(`[data-tab-content="${target}"]`);
          if (targetContent) {
            targetContent.classList.add('active');
          }
        }
      });
    });
  });
}

/* ── Modal ── */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initModals() {
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
}

/* ── Toast Notifications ── */
function showToast(message, type = 'success', duration = 4000) {
  // Remove any existing toast
  const existing = document.querySelector('.toast.show');
  if (existing) {
    existing.classList.remove('show');
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="ph ${type === 'success' ? 'ph-check-circle' : type === 'error' ? 'ph-x-circle' : 'ph-warning-circle'}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Initialize common interactive elements ── */
document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initTabs();
  initModals();
});
