/* ==========================================================================
   TINY - Global Main JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRtl();
  initMobileNav();
  initHomeSwitcher();
  initMobileDropdowns();
  highlightActiveLink();
});

/* 1. Theme Controller (Dark / Light Mode) */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const body = document.body;

  // Retrieve saved preference or auto-detect system theme
  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentTheme = prefersDark ? 'dark' : 'light';
  }

  // Apply theme
  if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
    updateThemeToggleText('dark');
  } else {
    body.classList.remove('dark-theme');
    updateThemeToggleText('light');
  }

  // Bind toggles
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        updateThemeToggleText('light');
      } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeToggleText('dark');
      }
    });
  });
}

function updateThemeToggleText(theme) {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      btn.setAttribute('title', 'Switch to Light Mode');
    } else {
      btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      btn.setAttribute('title', 'Switch to Dark Mode');
    }
  });
}

/* 2. RTL Layout Controller */
function initRtl() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const html = document.documentElement;

  // Retrieve saved layout setting
  let currentDir = localStorage.getItem('dir') || 'ltr';

  // Apply layout
  applyLayoutDirection(currentDir);

  // Bind click
  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = html.getAttribute('dir') || 'ltr';
      const newDir = activeDir === 'ltr' ? 'rtl' : 'ltr';
      applyLayoutDirection(newDir);
    });
  });
}

function applyLayoutDirection(direction) {
  const html = document.documentElement;
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');

  html.setAttribute('dir', direction);
  localStorage.setItem('dir', direction);

  // Show ONLY the active mode as text button (e.g. LTR in LTR mode, RTL in RTL mode)
  rtlToggleBtns.forEach(btn => {
    btn.textContent = direction.toUpperCase();
  });

  // Dynamically load/enable rtl.css link if needed (pre-linked, styles applied conditionally by [dir="rtl"])
}

/* 3. Mobile Hamburger Navigation Drawer */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('open');

      // Animate hamburger bars to X
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile nav drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('open');
          const spans = hamburger.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
          
          // Also close any open dropdowns inside the nav drawer
          const openDropdowns = document.querySelectorAll('.nav-dropdown-item.open');
          openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
          });
        }
      }
    });
  }
}

/* 4. Dual Home Page Switcher Dropdown */
function initHomeSwitcher() {
  const switcherBtn = document.querySelector('.switcher-btn');
  const dropdown = document.querySelector('.switcher-dropdown');

  if (switcherBtn && dropdown) {
    // Show toggle on hover is done via CSS, but let's support touch tap for mobile
    switcherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
  }
}

/* 5. Highlight Active Navbar Page Link */
function highlightActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* 6. Mobile Navigation Dropdowns (Accordion Toggling) */
function initMobileDropdowns() {
  const dropdownTrigger = document.getElementById('home-dropdown-trigger');
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      // Toggle dropdown only on mobile/tablet viewports
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const parent = dropdownTrigger.closest('.nav-dropdown-item');
        if (parent) {
          parent.classList.toggle('open');
        }
      }
    });
  }
}
