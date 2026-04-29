/* ============================================
   THEME TOGGLE - Dark/Light Mode
   ============================================ */
'use strict';

const ThemeToggle = (() => {
  const STORAGE_KEY = 'elevate-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  /**
   * Gets the preferred theme from localStorage or system preference
   * @returns {string} 'dark' or 'light'
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  /**
   * Applies theme to document
   * @param {string} theme - 'dark' or 'light'
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcons(theme);
  }

  /**
   * Updates all theme toggle button icons
   * @param {string} theme
   */
  function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('[data-theme-toggle]');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === DARK ? 'ri-sun-line' : 'ri-moon-line';
      }
    });
  }

  /**
   * Toggles between dark and light
   */
  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
  }

  /**
   * Initializes theme system
   */
  function init() {
    // Apply saved/preferred theme immediately
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Listen for toggle clicks
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-theme-toggle]');
      if (toggleBtn) {
        e.preventDefault();
        toggle();
      }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

  return { init, toggle, applyTheme, getPreferredTheme };
})();

// Auto-initialize
document.addEventListener('DOMContentLoaded', ThemeToggle.init);
