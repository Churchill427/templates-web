/* ============================================
   WASH — Theme Toggle (Dark/Light Mode)
   ============================================ */
'use strict';

const ThemeManager = (() => {
  const STORAGE_KEY = 'wash-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK;
    }
    return LIGHT;
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage not available
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcons(theme);
  }

  function updateToggleIcons(theme) {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
      const sunIcon = toggle.querySelector('.icon-sun');
      const moonIcon = toggle.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === DARK) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    saveTheme(next);
    // Dispatch event for charts/graphs to update
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  function init() {
    const saved = getSavedTheme();
    const theme = saved || getSystemPreference();
    applyTheme(theme);

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getSavedTheme()) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
    }

    // Bind toggle buttons
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.theme-toggle');
      if (toggleBtn) {
        toggle();
      }
    });
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || LIGHT;
  }

  return { init, toggle, getCurrentTheme };
})();

document.addEventListener('DOMContentLoaded', ThemeManager.init);
