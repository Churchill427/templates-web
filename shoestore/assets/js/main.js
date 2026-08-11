/* ========================================
   SOLE — Core JavaScript
   Navigation, Theme, RTL, Utilities
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initRTLToggle();
  initBackToTop();
  setActiveNavLink();
  initFooterYear();
});

/* ---------- Footer Year ---------- */
function initFooterYear() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = currentYear || '2026';
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Sticky navbar with blur on scroll
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          // If clicking a dropdown trigger, do not close the mobile menu
          if (link.parentElement.classList.contains('nav-dropdown')) {
            return;
          }
          hamburger.classList.remove('active');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Dropdown toggle for mobile
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-link');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // Close dropdown on outside click (desktop)
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
  const toggles = document.querySelectorAll('.theme-toggle');
  const savedTheme = localStorage.getItem('sole-theme');

  // Apply saved theme
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    toggles.forEach(t => t.textContent = 'Light');
  }

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('sole-theme', isDark ? 'dark' : 'light');

      // Update all toggle buttons
      document.querySelectorAll('.theme-toggle').forEach(t => {
        t.textContent = isDark ? 'Light' : 'Dark';
      });
    });
  });
}

/* ---------- RTL Toggle ---------- */
function initRTLToggle() {
  const toggles = document.querySelectorAll('.rtl-toggle');
  const savedDir = localStorage.getItem('sole-direction');

  // Apply saved direction
  if (savedDir === 'rtl') {
    document.documentElement.classList.add('rtl');
    document.documentElement.setAttribute('dir', 'rtl');
    toggles.forEach(t => t.textContent = 'RTL');
  }

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRtl = document.documentElement.classList.toggle('rtl');
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      localStorage.setItem('sole-direction', isRtl ? 'rtl' : 'ltr');

      // Update all toggle buttons — show active mode
      document.querySelectorAll('.rtl-toggle').forEach(t => {
        t.textContent = isRtl ? 'RTL' : 'LTR';
      });
    });
  });
}

/* ---------- Active Nav Link ---------- */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPage = href.split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active');
    }

    // Handle home dropdown — mark Home link active for index.html and home-b.html
    if ((currentPage === 'index.html' || currentPage === 'home-b.html' || currentPage === '') && 
        link.closest('.nav-dropdown') && link.classList.contains('nav-link')) {
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        parentDropdown.querySelector('.nav-link').classList.add('active');
      }
    }
  });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Smooth Scroll for Anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- Utility: Format Currency ---------- */
function formatCurrency(amount) {
  return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* ---------- Utility: Debounce ---------- */
function debounce(func, wait = 250) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
