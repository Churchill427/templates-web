/* ============================================
   PAWLY — RTL/LTR Toggle
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'pawly-dir';
  const RTL = 'rtl';
  const LTR = 'ltr';

  /**
   * Get stored direction or default to LTR
   */
  function getDirection() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === RTL || stored === LTR) return stored;
    return LTR;
  }

  /**
   * Apply direction to document
   */
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateToggleLabels(dir);
  }

  /**
   * Update all RTL toggle button labels
   */
  function updateToggleLabels(dir) {
    const buttons = document.querySelectorAll('.rtl-toggle');

    buttons.forEach(btn => {
      btn.textContent = dir.toUpperCase();
      btn.setAttribute('aria-label', `Currently ${dir.toUpperCase()} mode. Click to switch to ${dir === LTR ? 'RTL' : 'LTR'}`);
    });
  }

  /**
   * Toggle between RTL and LTR
   */
  function toggleDirection() {
    const current = document.documentElement.getAttribute('dir') || LTR;
    const next = current === RTL ? LTR : RTL;
    applyDirection(next);
  }

  /**
   * Initialize direction on page load
   */
  function init() {
    const dir = getDirection();
    applyDirection(dir);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindToggleButtons);
    } else {
      bindToggleButtons();
    }
  }

  /**
   * Bind click events to all RTL toggle buttons
   */
  function bindToggleButtons() {
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.addEventListener('click', toggleDirection);
    });

    // Re-apply labels
    const dir = getDirection();
    updateToggleLabels(dir);
  }

  // Make available globally
  window.toggleDirection = toggleDirection;

  // Initialize
  init();
})();
