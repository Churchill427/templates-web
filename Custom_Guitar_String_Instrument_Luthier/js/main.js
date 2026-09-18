/**
 * FRET — Main JavaScript
 * Handles Theme toggling, RTL toggling, Navbar, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ── Theme Toggle ──────────────────────────────────────────────────────── */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const htmlEl = document.documentElement;
  
  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    const savedTheme = localStorage.getItem('fret-theme');
    if (savedTheme) {
      htmlEl.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    // Add transition class for smooth color change
    document.body.classList.add('theme-transitioning');
    
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('fret-theme', newTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300); // matches --transition-theme duration
  };

  // Bind theme toggles
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
    // Add aria-label
    toggle.setAttribute('aria-label', 'Toggle light/dark theme');
  });

  initTheme();

  /* ── RTL / LTR Toggle ──────────────────────────────────────────────────── */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  // Initialize direction from localStorage
  const initRTL = () => {
    const savedDir = localStorage.getItem('fret-dir') || 'ltr';
    htmlEl.setAttribute('dir', savedDir);
    updateRtlToggleText(savedDir);
  };

  const updateRtlToggleText = (currentDir) => {
    // Requirements: "displays 'RTL' while in LTR mode (tap to switch) and 'LTR' while in RTL mode"
    const textToShow = currentDir === 'ltr' ? 'RTL' : 'LTR';
    rtlToggles.forEach(toggle => {
      toggle.textContent = textToShow;
      toggle.setAttribute('aria-label', `Switch to ${textToShow} layout`);
    });
  };

  const toggleRTL = () => {
    const currentDir = htmlEl.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    
    htmlEl.setAttribute('dir', newDir);
    localStorage.setItem('fret-dir', newDir);
    updateRtlToggleText(newDir);
  };

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleRTL);
  });

  initRTL();

  /* ── Mobile Menu (Hamburger) ───────────────────────────────────────────── */
  const hamburger = document.querySelector('.header__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const hasDropdowns = document.querySelectorAll('.mobile-menu__link[data-toggle="dropdown"]');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.contains('active');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? '' : 'hidden';
      
      hamburger.setAttribute('aria-expanded', !isActive);
    });

    // Mobile dropdowns
    hasDropdowns.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const subMenu = document.getElementById(targetId);
        
        if (subMenu) {
          subMenu.classList.toggle('active');
          const icon = link.querySelector('svg');
          if (icon) {
            icon.style.transform = subMenu.classList.contains('active') ? 'rotate(180deg)' : '';
          }
        }
      });
    });
  }

  /* ── Active Nav Link Highlighting ──────────────────────────────────────── */
  // Get current page path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (href === 'index.html' && currentPath === ''))) {
      link.classList.add('nav-link--active');
    }
  });

  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (href === 'index.html' && currentPath === ''))) {
      link.classList.add('mobile-menu__link--active');
    }
  });
});
