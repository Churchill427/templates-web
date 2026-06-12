/* ============================================
   WASH — Dashboard Module
   Sidebar navigation, stats, interactions
   ============================================ */
'use strict';

const DashboardManager = (() => {

  /* --- Sidebar Toggle --- */
  function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const layout = document.querySelector('.dashboard-layout');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!sidebar || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isMobile = window.innerWidth < 640;

      if (isMobile) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      } else {
        layout.classList.toggle('collapsed');
        // Save collapsed state
        try {
          localStorage.setItem('wash-sidebar-collapsed', layout.classList.contains('collapsed'));
        } catch { /* ignore */ }
      }
    });

    // Close on overlay click (mobile)
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Restore collapsed state on desktop / tablet
    try {
      const collapsed = localStorage.getItem('wash-sidebar-collapsed');
      if (collapsed === 'true' || (collapsed === null && window.innerWidth <= 1024)) {
        if (window.innerWidth >= 640 && layout) {
          layout.classList.add('collapsed');
        }
      }
    } catch { /* ignore */ }

    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 640) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }
    });
  }

  /* --- Active Sidebar Item --- */
  function initActiveItem() {
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Show corresponding section
        const target = item.getAttribute('data-section');
        if (target) {
          document.querySelectorAll('.dashboard-section').forEach(s => {
            s.style.display = 'none';
          });
          const section = document.getElementById(target);
          if (section) section.style.display = 'block';
        }
      });
    });
  }

  /* --- Notification Panel --- */
  function initNotifications() {
    const btn = document.querySelector('.notification-btn');
    const panel = document.querySelector('.notification-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('active');
      }
    });
  }

  /* --- Search Filter --- */
  function initSearch() {
    const searchInput = document.querySelector('.dashboard-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.table tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /* --- Init --- */
  function init() {
    initSidebar();
    initActiveItem();
    initNotifications();
    initSearch();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', DashboardManager.init);
