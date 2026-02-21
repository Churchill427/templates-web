/* ============================================
   RTL TOGGLE — rtl-toggle.js
   Sets dir="rtl" on <html> and persists to localStorage
   ============================================ */

(function () {
  // Restore saved direction on page load
  const savedDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('rtlToggle');
    if (!btn) return;

    const updateBtn = () => {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      btn.textContent = '🌐';
      btn.setAttribute('title', isRTL ? 'Switch to LTR' : 'Switch to RTL');
    };

    updateBtn();

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('dir', next);
      updateBtn();
    });
  });
})();
