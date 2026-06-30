/* ============================================
   SHINE — RTL/LTR Toggle
   ============================================ */
'use strict';

const RTLManager = (() => {
  const STORAGE_KEY = 'wash-direction';
  const RTL = 'rtl';
  const LTR = 'ltr';

  function getSavedDirection() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveDirection(dir) {
    try {
      localStorage.setItem(STORAGE_KEY, dir);
    } catch {
      // localStorage not available
    }
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === RTL ? 'ar' : 'en');
    updateToggleLabels(dir);
  }

  function updateToggleLabels(dir) {
    const toggles = document.querySelectorAll('.rtl-toggle');
    toggles.forEach(toggle => {
      toggle.textContent = dir.toUpperCase();
      toggle.setAttribute('aria-label', `Current direction: ${dir.toUpperCase()}. Click to switch.`);
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('dir') || LTR;
    const next = current === RTL ? LTR : RTL;
    applyDirection(next);
    saveDirection(next);
    window.dispatchEvent(new CustomEvent('directionchange', { detail: { dir: next } }));
  }

  function init() {
    const saved = getSavedDirection();
    const dir = saved || LTR;
    applyDirection(dir);

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.rtl-toggle');
      if (toggleBtn) {
        toggle();
      }
    });
  }

  function getCurrentDirection() {
    return document.documentElement.getAttribute('dir') || LTR;
  }

  return { init, toggle, getCurrentDirection };
})();

document.addEventListener('DOMContentLoaded', RTLManager.init);
