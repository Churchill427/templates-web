/* ============================================
   SHINE — Main JavaScript Module
   Global navigation, forms, utilities
   ============================================ */
'use strict';

const WashApp = (() => {

  /* === SVG ICON LIBRARY === */
  const Icons = {
    droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    messageSquare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    fileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    logOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    trendingUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>',
    alertCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    google: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>',
    apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
    yelp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 7.26 7.26 0 0 1 2.054 3.128 1.074 1.074 0 0 1-.384 1.583zm-7.166 3.975l1.48 4.976a1.073 1.073 0 0 1-.672 1.405 7.259 7.259 0 0 1-3.737.109 1.074 1.074 0 0 1-.75-1.31l1.349-5.07c.255-.96 1.64-1.097 2.09-.2l.24.09zM8.58 14.73l-4.79 2.14a1.074 1.074 0 0 1-1.49-.593 7.26 7.26 0 0 1-.18-3.74 1.073 1.073 0 0 1 1.28-.836l5.04.96c.98.19 1.12 1.59.14 2.07zm-.97-4.47L3.42 8.2a1.074 1.074 0 0 1-.66-1.43A7.259 7.259 0 0 1 5.37 4.04a1.072 1.072 0 0 1 1.59.34l2.59 4.5c.5.87-.36 1.87-1.32 1.6l-.63-.22zm2.95-1.63L8.55 3.37A1.074 1.074 0 0 1 9.24 2a7.262 7.262 0 0 1 3.81.21c.54.17.84.74.72 1.29l-1.14 5.08c-.22.98-1.63 1.08-2.08.12l-.03-.05z"/></svg>'
  };

  /* === NAVBAR === */
  function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });

      if (overlay) {
        overlay.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      }

      // Close on link click
      mobileMenu.querySelectorAll('.nav-link:not(.nav-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // Dropdown toggles
    document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.nav-dropdown');
        // Close other dropdowns
        document.querySelectorAll('.nav-dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });

    // Active page highlighting
    highlightActiveNav();

    // Sticky navbar shadow on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
          navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
          navbar.style.boxShadow = 'none';
        }
      }, { passive: true });
    }
  }

  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPage = href.split('/').pop();
        if (linkPage === currentPage) {
          link.classList.add('active');
        }
      }
    });
  }

  /* === ACCORDION === */
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close siblings
        const accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion-item.active').forEach(activeItem => {
            if (activeItem !== item) {
              activeItem.classList.remove('active');
              activeItem.querySelector('.accordion-content').style.maxHeight = '0';
            }
          });
        }

        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /* === FORM VALIDATION === */
  function initFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        form.querySelectorAll('[required]').forEach(field => {
          clearError(field);

          if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
          } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, 'Please enter a valid email address');
            isValid = false;
          } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            showError(field, 'Please enter a valid phone number');
            isValid = false;
          } else if (field.dataset.minlength && field.value.length < parseInt(field.dataset.minlength)) {
            showError(field, `Minimum ${field.dataset.minlength} characters required`);
            isValid = false;
          }
        });

        // Confirm password
        const password = form.querySelector('[name="password"]');
        const confirm = form.querySelector('[name="confirm-password"]');
        if (password && confirm && password.value !== confirm.value) {
          showError(confirm, 'Passwords do not match');
          isValid = false;
        }

        // Terms checkbox
        const terms = form.querySelector('[name="terms"]');
        if (terms && !terms.checked) {
          showError(terms, 'You must accept the terms and conditions');
          isValid = false;
        }

        if (isValid) {
          showToast('Success! Your form has been submitted.', 'success');
          form.reset();
        }
      });

      // Real-time validation
      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => {
          clearError(field);
          if (field.required && !field.value.trim()) {
            showError(field, 'This field is required');
          } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            showError(field, 'Please enter a valid email address');
          }
        });

        field.addEventListener('input', () => {
          if (field.classList.contains('error')) {
            clearError(field);
          }
        });
      });
    });
  }

  function showError(field, message) {
    field.classList.add('error');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\d\s\-()+]{7,15}$/.test(phone);
  }

  /* === TOAST NOTIFICATIONS === */
  function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.className = `toast toast-${type}`;
    const iconSvg = type === 'success' ? Icons.checkCircle : Icons.alertCircle;
    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span>${message}</span>
    `;

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4000);
  }

  /* === LIGHTBOX === */
  function initLightbox() {
    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
        if (!src) return;

        let lightbox = document.querySelector('.lightbox');
        if (!lightbox) {
          lightbox = document.createElement('div');
          lightbox.className = 'lightbox';
          lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close lightbox">${Icons.x}</button>
            <img src="" alt="Lightbox image">
          `;
          document.body.appendChild(lightbox);

          lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
          });

          lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
              lightbox.classList.remove('active');
              document.body.style.overflow = '';
            }
          });

          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
              lightbox.classList.remove('active');
              document.body.style.overflow = '';
            }
          });
        }

        lightbox.querySelector('img').src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  /* === FILTER TABS === */
  function initFilterTabs() {
    document.querySelectorAll('.filter-tabs').forEach(tabContainer => {
      const tabs = tabContainer.querySelectorAll('.filter-tab');
      const targetGrid = tabContainer.getAttribute('data-target');
      const items = targetGrid ? document.querySelectorAll(`${targetGrid} [data-category]`) : [];

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const category = tab.getAttribute('data-filter');

          items.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
              item.style.display = '';
              item.style.animation = 'fadeIn 0.4s ease';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    });
  }

  /* === LAZY LOADING === */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      lazyImages.forEach(img => observer.observe(img));
    } else {
      // Fallback
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  /* === SCROLL TO TOP === */
  function initScrollToTop() {
    const btn = document.querySelector('.scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* === PRICING CALCULATOR === */
  function initCalculator() {
    const sqftInput = document.getElementById('sqft-input');
    const serviceSelect = document.getElementById('service-select');
    const priceDisplay = document.querySelector('.price-value');

    if (!sqftInput || !priceDisplay) return;

    const rates = {
      'house-wash': 0.25,
      'roof-clean': 0.35,
      'driveway': 0.20,
      'deck': 0.30,
      'gutter': 0.40,
      'window': 0.45
    };

    function updatePrice() {
      const sqft = parseInt(sqftInput.value) || 0;
      const service = serviceSelect ? serviceSelect.value : 'house-wash';
      const rate = rates[service] || 0.25;
      const price = Math.round(sqft * rate);
      if (priceDisplay) {
        animateValue(priceDisplay, price);
      }
    }

    function animateValue(el, target) {
      const current = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
      const diff = target - current;
      const duration = 500;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(current + diff * progress);
        el.textContent = '$' + value.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    sqftInput.addEventListener('input', updatePrice);
    if (serviceSelect) serviceSelect.addEventListener('change', updatePrice);

    // Range slider sync
    const rangeInput = document.getElementById('sqft-range');
    if (rangeInput) {
      rangeInput.addEventListener('input', () => {
        sqftInput.value = rangeInput.value;
        updatePrice();
      });
      sqftInput.addEventListener('input', () => {
        rangeInput.value = sqftInput.value;
      });
    }
  }

  /* === BOOKING MULTI-STEP === */
  function initBookingSteps() {
    const steps = document.querySelectorAll('.booking-form-step');
    const stepIndicators = document.querySelectorAll('.booking-step');
    const connectors = document.querySelectorAll('.step-connector');
    let currentStep = 0;

    if (!steps.length) return;

    function showStep(index) {
      steps.forEach((step, i) => {
        step.style.display = i === index ? 'block' : 'none';
      });

      stepIndicators.forEach((indicator, i) => {
        indicator.classList.remove('active', 'completed');
        if (i < index) indicator.classList.add('completed');
        if (i === index) indicator.classList.add('active');
      });

      connectors.forEach((conn, i) => {
        conn.classList.toggle('completed', i < index);
      });

      currentStep = index;
    }

    document.querySelectorAll('[data-step-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          showStep(currentStep + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('[data-step-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 0) {
          showStep(currentStep - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    showStep(0);
  }

  /* === GENERATE PARTICLES === */
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 20 + 5;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      container.appendChild(particle);
    }
  }

  /* === ICON HELPER === */
  function getIcon(name) {
    return Icons[name] || '';
  }

  /* === INIT === */
  function init() {
    initNavbar();
    initAccordions();
    initFormValidation();
    initLightbox();
    initFilterTabs();
    initLazyLoading();
    initScrollToTop();
    initCalculator();
    initBookingSteps();
    initParticles();
  }

  return { init, Icons, getIcon, showToast };
})();

document.addEventListener('DOMContentLoaded', WashApp.init);
