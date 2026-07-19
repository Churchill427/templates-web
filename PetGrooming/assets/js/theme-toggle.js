/* ============================================
   PAWLY — Theme Toggle (Dark/Light Mode)
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'pawly-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  /**
   * Get the preferred theme:
   * 1. Check localStorage
   * 2. Check system preference
   * 3. Default to light
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK;
    }

    return LIGHT;
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcons(theme);
  }

  /**
   * Update all toggle button icons
   */
  function updateToggleIcons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle');

    buttons.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');

      if (sunIcon && moonIcon) {
        if (theme === DARK) {
          sunIcon.style.display = 'inline-block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'inline-block';
        }
      }

      btn.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  /**
   * Toggle between dark and light
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
  }

  /**
   * Initialize theme on page load
   */
  function init() {
    // Apply theme immediately (before DOMContentLoaded to prevent flash)
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Bind click handlers once DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindToggleButtons);
    } else {
      bindToggleButtons();
    }

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
    }
  }

  /**
   * Bind click events to all theme toggle buttons
   */
  function bindToggleButtons() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Re-apply icons after DOM is ready
    const theme = getPreferredTheme();
    updateToggleIcons(theme);
  }

  // Make toggleTheme available globally for inline handlers
  window.toggleTheme = toggleTheme;

  // Initialize immediately
  init();
})();
