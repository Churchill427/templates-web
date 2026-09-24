/* ============================================================
   JUMP TRAMPOLINE PARK — Shared JavaScript
   Handles: navbar, footer, theme, RTL, scroll reveal,
   progress bar, counters, accordions, tabs, back-to-top,
   lightbox, form validation, sidebar, marquee, filters
   ============================================================ */

(function () {
  'use strict';

  /* ========== SVG ICONS ========== */
  const ICONS = {
    logo: `<svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4C8 4 4 4 4 8v12c0 6 4 12 12 12s12-6 12-12" stroke="#FF4757" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <circle cx="16" cy="6" r="3" fill="#FFB020"/>
      <text x="34" y="27" font-family="Outfit,sans-serif" font-weight="800" font-size="28" fill="currentColor">JUMP</text>
    </svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    starEmpty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowUpRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,
    trendUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    trendDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`,
    barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    pieChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
    activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    dollar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    ticket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
    gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    creditCard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    megaphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`,
    google: `<svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    apple: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="#E4405F" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    jumping: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="4" r="2"/><path d="M7 22l3-7 2 2 2-2 3 7"/><path d="M9 12l-2-3h10l-2 3"/></svg>`,
    grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  };

  /* ========== CURRENT PAGE DETECTION ========== */
  function getCurrentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  /* ========== THEME MANAGEMENT ========== */
  function initTheme() {
    const saved = localStorage.getItem('jump-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jump-theme', next);
    updateThemeIcons();
  }

  function updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = isDark ? ICONS.sun : ICONS.moon;
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  /* ========== RTL MANAGEMENT ========== */
  function initRTL() {
    const saved = localStorage.getItem('jump-dir');
    if (saved) {
      document.documentElement.setAttribute('dir', saved);
    }
    updateRTLLabels();
  }

  function toggleRTL() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('jump-dir', next);
    updateRTLLabels();
  }

  function updateRTLLabels() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.textContent = isRTL ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', isRTL ? 'Switch to LTR mode' : 'Switch to RTL mode');
    });
  }

  /* ========== NAVBAR ========== */
  function injectNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    const page = getCurrentPage();

    const links = [
      { label: 'Home', href: '#', dropdown: [
        { label: 'Home Classic', href: 'index.html' },
        { label: 'Home Modern', href: 'home-modern.html' }
      ]},
      { label: 'Attractions', href: 'attractions.html' },
      { label: 'Pricing', href: 'pricing.html' },
      { label: 'About', href: 'about.html' },
      { label: 'Blog', href: 'blog.html' },
      { label: 'Contact', href: 'contact.html' },
      { label: 'Dashboard', href: '#', dropdown: [
        { label: 'User Dashboard', href: 'dashboard-user.html', badge: 'Public' },
        { label: 'Admin Dashboard', href: 'dashboard-admin.html', badge: 'Public' }
      ]},
    ];

    const homePages = ['index.html', 'home-modern.html'];
    const dashboardPages = ['dashboard-user.html', 'dashboard-admin.html'];

    let linksHTML = '';
    links.forEach(link => {
      if (link.dropdown) {
        const isHome = link.label === 'Home' && homePages.includes(page);
        const isDash = link.label === 'Dashboard' && dashboardPages.includes(page);
        const isActive = isHome || isDash;
        linksHTML += `
          <div class="nav-dropdown">
            <a href="#" class="nav-link nav-dropdown-trigger ${isActive ? 'active' : ''}">${link.label} ${ICONS.chevron}</a>
            <div class="nav-dropdown-panel">
              ${link.dropdown.map(d => `
                <a href="${d.href}" ${d.href === page ? 'class="active"' : ''}>
                  <span style="display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;">
                    <span>${d.label}</span>
                    ${d.badge ? `<span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:999px;background:rgba(34,197,94,0.15);color:#16a34a;letter-spacing:0.3px;">${d.badge}</span>` : ''}
                  </span>
                </a>
              `).join('')}
            </div>
          </div>`;
      } else {
        const isActive = link.href === page;
        linksHTML += `<a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">${link.label}</a>`;
      }
    });

    container.innerHTML = `
      <nav class="navbar" id="main-navbar">
        <div class="navbar-inner">
          <a href="index.html" class="navbar-logo" aria-label="JUMP Home">${ICONS.logo}</a>
          <div class="navbar-menu" id="navbar-menu">
            <div class="navbar-links">${linksHTML}</div>
            <div class="navbar-actions">
              <button class="rtl-toggle" onclick="window.JUMPToggleRTL()" aria-label="Toggle text direction">RTL</button>
              <button class="toggle-btn theme-toggle" onclick="window.JUMPToggleTheme()" aria-label="Toggle theme">${ICONS.moon}</button>
              <div class="nav-account">
                <button class="nav-account-btn" aria-label="Account menu">${ICONS.user}</button>
                <div class="nav-account-panel">
                  <a href="login.html">Login</a>
                  <a href="signup.html">Sign Up</a>
                  <a href="dashboard-user.html">User Dashboard</a>
                  <a href="dashboard-admin.html">Admin Dashboard</a>
                </div>
              </div>
              <a href="login.html" class="nav-login-btn ${page === 'login.html' ? 'active' : ''}">Login</a>
              <a href="pricing.html" class="btn btn-primary nav-cta">Book Now</a>
            </div>
          </div>
          <button class="hamburger" id="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>`;

    setupNavbar();
  }

  function setupNavbar() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('navbar-menu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Dropdowns
    document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = trigger.closest('.nav-dropdown');
        const isOpen = dropdown.classList.contains('open');

        // Close all dropdowns first
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.nav-account').forEach(d => d.classList.remove('open'));

        if (!isOpen) dropdown.classList.add('open');
      });
    });

    // Account dropdown
    document.querySelectorAll('.nav-account-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const account = btn.closest('.nav-account');
        const isOpen = account.classList.contains('open');
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.nav-account').forEach(d => d.classList.remove('open'));
        if (!isOpen) account.classList.add('open');
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-account')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.nav-account').forEach(d => d.classList.remove('open'));
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.nav-account').forEach(d => d.classList.remove('open'));
        if (menu.classList.contains('open')) {
          menu.classList.remove('open');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    // Close mobile menu on link click
    menu.querySelectorAll('a:not(.nav-dropdown-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          menu.classList.remove('open');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ========== FOOTER ========== */
  function injectFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    container.innerHTML = `
      <footer class="footer">
        <div class="footer-grid">
          <div class="footer-col">
            <a href="index.html" class="footer-logo" aria-label="JUMP Home">${ICONS.logo}</a>
            <p class="footer-desc">The ultimate indoor trampoline park experience. Bounce, flip, and soar with family and friends in a safe, thrilling environment.</p>
            <div class="footer-socials">
              <a href="#" class="footer-social-btn" aria-label="Google">${ICONS.google}</a>
              <a href="#" class="footer-social-btn" aria-label="Facebook">${ICONS.facebook}</a>
              <a href="#" class="footer-social-btn" aria-label="Instagram">${ICONS.instagram}</a>
              <a href="#" class="footer-social-btn" aria-label="YouTube">${ICONS.youtube}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Explore</h4>
            <div class="footer-links">
              <a href="index.html">Home</a>
              <a href="attractions.html">Attractions</a>
              <a href="pricing.html">Pricing</a>
              <a href="parties.html">Parties</a>
              <a href="about.html">About</a>
              <a href="blog.html">Blog</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <div class="footer-links">
              <a href="contact.html">Contact</a>
              <a href="attractions.html#safety">Safety Rules</a>
              <a href="pricing.html#faq">FAQs</a>
              <a href="dashboard-user.html">User Dashboard</a>
              <a href="dashboard-admin.html">Admin Dashboard</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <div class="footer-contact-item">${ICONS.mapPin}<span>123 Bounce Avenue, Jumpville, CA 90210</span></div>
            <div class="footer-contact-item">${ICONS.phone}<span>(555) 123-JUMP</span></div>
            <div class="footer-contact-item">${ICONS.mail}<span>hello@jumppark.com</span></div>
            <div class="footer-contact-item">${ICONS.clock}<span>Mon–Fri 10am–9pm · Sat–Sun 9am–10pm</span></div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 JUMP. All rights reserved.</span>
          <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>`;
  }

  /* ========== BACK TO TOP ========== */
  function injectBackToTop() {
    if (document.querySelector('.back-to-top')) return;
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = ICONS.arrowUp;
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  /* ========== PAGE PROGRESS BAR ========== */
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'page-progress';
    bar.id = 'page-progress';
    document.body.prepend(bar);

    window.addEventListener('load', () => {
      bar.style.width = '100%';
      setTimeout(() => {
        bar.style.animation = 'progressFade 0.5s forwards';
      }, 300);
    });

    // Animate on scroll for visual effect
    let loaded = false;
    window.addEventListener('load', () => { loaded = true; });

    const updateProgress = () => {
      if (!loaded) {
        const random = Math.min(90, Math.random() * 30 + 60);
        bar.style.width = random + '%';
      }
    };
    setTimeout(updateProgress, 100);
    setTimeout(updateProgress, 300);
  }

  /* ========== SCROLL REVEAL ========== */
  function initScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    const isMobile = window.innerWidth <= 768;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for siblings
          const parent = entry.target.parentElement;
          if (parent && parent.classList.contains('stagger')) {
            const siblings = Array.from(parent.querySelectorAll('.reveal'));
            const index = siblings.indexOf(entry.target);
            const delay = isMobile ? 0 : index * 80;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
          } else {
            entry.target.classList.add('revealed');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ========== COUNTER ANIMATION ========== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = el.getAttribute('data-decimals') || 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = eased * target;
      el.textContent = prefix + (decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ========== ACCORDIONS ========== */
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const panel = item.querySelector('.accordion-panel');
        const isOpen = item.classList.contains('open');

        // Close siblings (optional: remove this block for allow-multiple)
        const accordion = item.closest('.accordion');
        accordion.querySelectorAll('.accordion-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion-panel').style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* ========== TABS ========== */
  function initTabs() {
    document.querySelectorAll('[data-tab-group]').forEach(group => {
      const buttons = group.querySelectorAll('.tab-btn');
      const panels = group.querySelectorAll('.tab-panel');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-tab');
          buttons.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const panel = group.querySelector(`#${target}`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  /* ========== FILTER CHIPS (Blog) ========== */
  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      const chips = group.querySelectorAll('.tab-btn');
      const items = document.querySelectorAll('[data-category]');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const filter = chip.getAttribute('data-filter');
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          items.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
              item.style.display = '';
              item.style.opacity = '0';
              requestAnimationFrame(() => { item.style.opacity = '1'; });
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    });
  }

  /* ========== LIGHTBOX ========== */
  function initLightbox() {
    // Create lightbox element
    let lightbox = document.getElementById('lightbox');
    if (!lightbox && document.querySelector('[data-lightbox]')) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.id = 'lightbox';
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">${ICONS.close}</button>
        <img src="" alt="" />
      `;
      document.body.appendChild(lightbox);

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox-close')) {
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

    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
        const alt = trigger.querySelector('img')?.alt || '';
        if (lightbox && src) {
          lightbox.querySelector('img').src = src;
          lightbox.querySelector('img').alt = alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  /* ========== FORM VALIDATION ========== */
  function initFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Clear previous errors
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

        // Validate required fields
        form.querySelectorAll('[required]').forEach(input => {
          const group = input.closest('.form-group');
          if (!input.value.trim()) {
            valid = false;
            if (group) {
              group.classList.add('error');
              const errorEl = group.querySelector('.form-error');
              if (errorEl) errorEl.textContent = 'This field is required';
            }
          }
        });

        // Validate email
        form.querySelectorAll('input[type="email"]').forEach(input => {
          if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            valid = false;
            const group = input.closest('.form-group');
            if (group) {
              group.classList.add('error');
              const errorEl = group.querySelector('.form-error');
              if (errorEl) errorEl.textContent = 'Please enter a valid email address';
            }
          }
        });

        // Validate password match
        const password = form.querySelector('input[name="password"]');
        const confirm = form.querySelector('input[name="confirm-password"]');
        if (password && confirm && password.value !== confirm.value) {
          valid = false;
          const group = confirm.closest('.form-group');
          if (group) {
            group.classList.add('error');
            const errorEl = group.querySelector('.form-error');
            if (errorEl) errorEl.textContent = 'Passwords do not match';
          }
        }

        // Validate checkbox
        form.querySelectorAll('input[type="checkbox"][required]').forEach(cb => {
          if (!cb.checked) {
            valid = false;
            const group = cb.closest('.form-group');
            if (group) {
              group.classList.add('error');
              const errorEl = group.querySelector('.form-error');
              if (errorEl) errorEl.textContent = 'This is required';
            }
          }
        });

        if (valid) {
          // Show success state
          const successEl = form.closest('.auth-card, .contact-form-wrap, .newsletter-wrap')?.querySelector('.form-success');
          if (successEl) {
            form.style.display = 'none';
            successEl.classList.add('show');
          } else {
            // Demo: button loading state
            const btn = form.querySelector('.btn[type="submit"]');
            if (btn) {
              btn.classList.add('loading');
              btn.innerHTML = '<div class="spinner"></div>';
              setTimeout(() => {
                btn.classList.remove('loading');
                btn.innerHTML = '<span>Sent!</span>';
                btn.style.background = '#16a34a';
                setTimeout(() => {
                  btn.innerHTML = '<span>Send Message</span>';
                  btn.style.background = '';
                  form.reset();
                }, 2000);
              }, 1500);
            }
          }
        }
      });
    });
  }

  /* ========== PASSWORD VISIBILITY ========== */
  function initPasswordToggles() {
    document.querySelectorAll('.password-eye').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-password-wrap').querySelector('input');
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword ? ICONS.eyeOff : ICONS.eye;
      });
    });
  }

  /* ========== PASSWORD STRENGTH ========== */
  function initPasswordStrength() {
    document.querySelectorAll('input[data-strength]').forEach(input => {
      const bar = input.closest('.form-group').querySelector('.password-strength-bar');
      if (!bar) return;

      input.addEventListener('input', () => {
        const val = input.value;
        let strength = 0;
        if (val.length >= 6) strength++;
        if (val.length >= 10) strength++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        bar.className = 'password-strength-bar';
        if (strength <= 1) bar.classList.add('weak');
        else if (strength === 2) bar.classList.add('fair');
        else if (strength === 3) bar.classList.add('good');
        else bar.classList.add('strong');
      });
    });
  }

  /* ========== SAVINGS CALCULATOR ========== */
  function initCalculator() {
    const calc = document.getElementById('savings-calculator');
    if (!calc) return;

    const visitorsSlider = calc.querySelector('#calc-visitors');
    const sessionsSlider = calc.querySelector('#calc-sessions');
    const visitorsVal = calc.querySelector('#calc-visitors-val');
    const sessionsVal = calc.querySelector('#calc-sessions-val');
    const resultEl = calc.querySelector('#calc-result');

    const regularPrice = 25; // per session
    const legendPrice = 79; // per month unlimited

    function update() {
      const visitors = parseInt(visitorsSlider.value);
      const sessions = parseInt(sessionsSlider.value);
      if (visitorsVal) visitorsVal.textContent = visitors;
      if (sessionsVal) sessionsVal.textContent = sessions;

      const regularTotal = visitors * sessions * regularPrice;
      const legendTotal = visitors * legendPrice;
      const savings = Math.max(0, regularTotal - legendTotal);

      if (resultEl) {
        resultEl.textContent = '$' + savings.toLocaleString();
      }
    }

    if (visitorsSlider) visitorsSlider.addEventListener('input', update);
    if (sessionsSlider) sessionsSlider.addEventListener('input', update);
    update();
  }

  /* ========== COUNTDOWN TIMER ========== */
  function initCountdown() {
    const el = document.getElementById('countdown-timer');
    if (!el) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45); // 45 days from now

    function update() {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        el.innerHTML = '<span class="countdown-value" style="font-size:var(--h2-size)">We\'re Live!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      el.innerHTML = `
        <div class="countdown-unit"><span class="countdown-value">${String(days).padStart(2,'0')}</span><span class="countdown-label">Days</span></div>
        <div class="countdown-unit"><span class="countdown-value">${String(hours).padStart(2,'0')}</span><span class="countdown-label">Hours</span></div>
        <div class="countdown-unit"><span class="countdown-value">${String(minutes).padStart(2,'0')}</span><span class="countdown-label">Min</span></div>
        <div class="countdown-unit"><span class="countdown-value">${String(seconds).padStart(2,'0')}</span><span class="countdown-label">Sec</span></div>
      `;
    }

    update();
    setInterval(update, 1000);
  }

  /* ========== DASHBOARD SIDEBAR ========== */
  function initDashboardSidebar() {
    const dashboard = document.querySelector('.dashboard');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggles = document.querySelectorAll('.sidebar-toggle, .sidebar-toggle-btn, #sidebar-toggle, #sidebar-header-toggle');

    if (!dashboard || !sidebar || !toggles.length) return;

    function handleToggle(e) {
      if (e) e.preventDefault();
      if (window.innerWidth <= 768) {
        const isOpen = sidebar.classList.toggle('sidebar-open');
        if (overlay) overlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        toggles.forEach(btn => btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false'));
      } else {
        const isCollapsed = dashboard.classList.toggle('sidebar-collapsed');
        sidebar.classList.toggle('sidebar-collapsed', isCollapsed);
        toggles.forEach(btn => {
          btn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
          btn.setAttribute('title', isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar');
        });
      }
    }

    toggles.forEach(btn => {
      btn.addEventListener('click', handleToggle);
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        toggles.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
        sidebar.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ========== SKELETON LOADER REMOVAL ========== */
  function initSkeletonRemoval() {
    setTimeout(() => {
      document.querySelectorAll('.skeleton').forEach(el => {
        el.style.transition = 'opacity 0.3s';
        el.style.opacity = '0';
        setTimeout(() => {
          el.style.display = 'none';
          const content = el.nextElementSibling;
          if (content && content.classList.contains('skeleton-content')) {
            content.style.display = '';
          }
        }, 300);
      });
    }, 1200);
  }

  /* ========== MARQUEE DUPLICATE FOR SEAMLESS ========== */
  function initMarquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      const items = track.innerHTML;
      track.innerHTML = items + items; // duplicate for seamless loop
    });
  }

  /* ========== GLOBAL EXPOSE ========== */
  window.JUMPToggleTheme = toggleTheme;
  window.JUMPToggleRTL = toggleRTL;
  window.JUMP_ICONS = ICONS;

  /* ========== INIT ON DOM READY ========== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    injectNavbar();
    injectFooter();
    injectBackToTop();
    initProgressBar();
    updateThemeIcons();
    updateRTLLabels();

    // Delay non-critical init
    requestAnimationFrame(() => {
      initScrollReveal();
      initCounters();
      initAccordions();
      initTabs();
      initFilters();
      initLightbox();
      initFormValidation();
      initPasswordToggles();
      initPasswordStrength();
      initCalculator();
      initCountdown();
      initDashboardSidebar();
      initSkeletonRemoval();
      initMarquee();
    });
  });

})();
