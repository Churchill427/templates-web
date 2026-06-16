/**
 * KILN Studio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     Theme Toggle
     ========================================================================== */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check local storage or system preference
  const getPreferredTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icons
    themeToggles.forEach(toggle => {
      if (theme === 'dark') {
        toggle.innerHTML = '<i class="ph ph-sun"></i>';
      } else {
        toggle.innerHTML = '<i class="ph ph-moon"></i>';
      }
    });
  };

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  /* ==========================================================================
     RTL/LTR Toggle
     ========================================================================== */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  const getPreferredDir = () => {
    return localStorage.getItem('dir') || 'ltr';
  };

  const setDir = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('dir', dir);
    
    // Update button text: displays opposite of current mode
    rtlToggles.forEach(toggle => {
      toggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  };

  // Initialize dir
  setDir(getPreferredDir());

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      setDir(currentDir === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  /* ==========================================================================
     Navbar Scroll & Mobile Menu
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navRight = document.querySelector('.nav-right');

  // Scroll effect
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init
  }

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  /* ==========================================================================
     Scroll Animations (Intersection Observer)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.fade-in-up');
  
  if (animatedElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
      // Add stagger delay based on siblings if needed
      el.style.transitionDelay = `${(index % 4) * 100}ms`;
      observer.observe(el);
    });
  }

  /* ==========================================================================
     Navbar Dropdown for Mobile
     ========================================================================== */
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      // Prevent page jumping to top on click for dummy '#' hrefs
      if (toggle.getAttribute('href') === '#') {
        e.preventDefault();
      }
      
      if (window.innerWidth < 1024) {
        const menu = toggle.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
          const isOpen = menu.style.display === 'block';
          menu.style.display = isOpen ? 'none' : 'block';
          const caret = toggle.querySelector('i');
          if (caret) {
            caret.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
          }
        }
      }
    });
  });

  /* ==========================================================================
     Team Card Touch Toggle for Mobile/Tablet
     ========================================================================== */
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active from other cards
      teamCards.forEach(c => {
        if (c !== card) c.classList.remove('active');
      });
      card.classList.toggle('active');
    });
  });
});
