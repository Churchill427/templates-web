/* ============================================
   RTL/LTR TOGGLE
   ============================================ */
'use strict';

const RTLToggle = (() => {
  const STORAGE_KEY = 'elevate-direction';
  const RTL = 'rtl';
  const LTR = 'ltr';

  /**
   * Gets the preferred direction from localStorage
   * @returns {string} 'rtl' or 'ltr'
   */
  function getPreferredDirection() {
    return localStorage.getItem(STORAGE_KEY) || LTR;
  }

  /**
   * Applies direction to document
   * @param {string} dir - 'rtl' or 'ltr'
   */
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === RTL ? 'ar' : 'en');
    localStorage.setItem(STORAGE_KEY, dir);
    updateToggleIcons(dir);
  }

  /**
   * Updates all RTL toggle button icons/state
   * @param {string} dir
   */
  function updateToggleIcons(dir) {
    const toggleBtns = document.querySelectorAll('[data-rtl-toggle]');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', dir === RTL ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('title', dir === RTL ? 'Switch to LTR' : 'Switch to RTL');
      btn.textContent = dir.toUpperCase();
    });
  }

  /**
   * Toggles between RTL and LTR
   */
  function toggle() {
    const current = document.documentElement.getAttribute('dir') || LTR;
    const next = current === RTL ? LTR : RTL;
    applyDirection(next);
  }

  /**
   * Initializes RTL system
   */
  function init() {
    const dir = getPreferredDirection();
    applyDirection(dir);

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-rtl-toggle]');
      if (toggleBtn) {
        e.preventDefault();
        toggle();
      }
    });
  }

  return { init, toggle, applyDirection, getPreferredDirection };
})();

document.addEventListener('DOMContentLoaded', RTLToggle.init);
