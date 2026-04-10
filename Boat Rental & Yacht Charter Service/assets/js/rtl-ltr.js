/* ============================================
   AquaLux — RTL/LTR Toggle
   Globe icon toggles text direction
   Persists to localStorage
   ============================================ */

'use strict';

const RTLToggle = (() => {
  const STORAGE_KEY = 'aqualux-direction';

  function getDirection() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function setDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
    localStorage.setItem(STORAGE_KEY, dir);
    updateToggleIcons(dir);
  }

  function updateToggleIcons(dir) {
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        // Visual indicator: globe stays but tooltip changes
        btn.title = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
      }
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    setDirection(current === 'rtl' ? 'ltr' : 'rtl');
  }

  function init() {
    setDirection(getDirection());

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Apply direction early
  const earlyDir = localStorage.getItem(STORAGE_KEY) || 'ltr';
  document.documentElement.setAttribute('dir', earlyDir);

  return { toggle, setDirection, init };
})();
