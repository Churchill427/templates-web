/* ============================================
   CRUM BAKERY — NAVIGATION JS
   Navbar scroll, Hamburger, Home Dropdown
   ============================================ */

'use strict';

const Navigation = {
  navbar: null,
  hamburger: null,
  mobileMenu: null,
  homeDropdown: null,

  init() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.homeDropdown = document.querySelector('.nav-dropdown');

    if (!this.navbar) return;

    this.initScrollBehavior();
    this.initHamburger();
    this.initHomeDropdown();
    this.initMobileDropdown();
    this.highlightActiveLink();
  },

  /* --- Navbar Scroll Behavior --- */
  initScrollBehavior() {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on init
  },

  /* --- Hamburger Menu --- */
  initHamburger() {
    if (!this.hamburger || !this.mobileMenu) return;

    this.hamburger.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close on overlay click
    this.mobileMenu.addEventListener('click', (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMobileMenu();
      }
    });

    // Close on link click
    this.mobileMenu.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.mobileMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  },

  toggleMobileMenu() {
    const isActive = this.mobileMenu.classList.contains('active');
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  openMobileMenu() {
    this.mobileMenu.classList.add('active');
    this.hamburger.classList.add('active');
    document.body.classList.add('menu-open');
    this.hamburger.setAttribute('aria-expanded', 'true');

    // Focus management
    const firstLink = this.mobileMenu.querySelector('.mobile-nav-link');
    if (firstLink) firstLink.focus();
  },

  closeMobileMenu() {
    this.mobileMenu.classList.remove('active');
    this.hamburger.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.hamburger.setAttribute('aria-expanded', 'false');
  },

  /* --- Desktop Home Dropdown --- */
  initHomeDropdown() {
    if (!this.homeDropdown) return;

    const toggle = this.homeDropdown.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.homeDropdown.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.homeDropdown.contains(e.target)) {
        this.homeDropdown.classList.remove('open');
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.homeDropdown.classList.remove('open');
      }
    });

    // Keyboard navigation
    const items = this.homeDropdown.querySelectorAll('.nav-dropdown-item');
    items.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[Math.min(index + 1, items.length - 1)].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[Math.max(index - 1, 0)].focus();
        }
      });
    });
  },

  /* --- Mobile Home Dropdown --- */
  initMobileDropdown() {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const mobileDropdownContent = document.querySelector('.mobile-dropdown-content');
    
    if (!mobileDropdownToggle || !mobileDropdownContent) return;

    mobileDropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileDropdownContent.classList.toggle('open');
      mobileDropdownToggle.classList.toggle('active');
      
      // Rotate chevron
      const chevron = mobileDropdownToggle.querySelector('.chevron');
      if (chevron) {
        chevron.style.transform = mobileDropdownContent.classList.contains('open') 
          ? 'rotate(180deg)' : 'rotate(0)';
      }
    });
  },

  /* --- Active Link Highlighting --- */
  highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Dropdown items
    document.querySelectorAll('.nav-dropdown-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPath) {
        item.classList.add('active');
        // Also mark parent dropdown toggle as active
        const parentDropdown = item.closest('.nav-dropdown');
        if (parentDropdown) {
          parentDropdown.querySelector('.nav-link')?.classList.add('active');
        }
      }
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
};


/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
});

// Export
window.CrumNav = Navigation;
