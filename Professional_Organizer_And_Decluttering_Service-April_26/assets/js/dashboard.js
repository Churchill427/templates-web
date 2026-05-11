/* ============================================
   DASHBOARD JAVASCRIPT
   ============================================ */

'use strict';

const Dashboard = {
  init() {
    this.initSidebar();
    this.initSearch();
    this.initNotifications();
    this.initMiniCharts();
    this.handleRoleParam();
  },

  handleRoleParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || 'user';
    this.setRole(role);
  },

  setRole(role) {
    const adminView = document.querySelector('.admin-view');
    const userView = document.querySelector('.user-view');
    if (role === 'admin') {
      if (adminView) adminView.style.display = 'block';
      if (userView) userView.style.display = 'none';
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'flex');
    } else {
      if (adminView) adminView.style.display = 'none';
      if (userView) userView.style.display = 'block';
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
  },

  initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    const isDesktop = () => window.innerWidth >= 1024;

    // ── Mobile/tablet: slide-out drawer ──
    const openDrawer = () => {
      sidebar?.classList.add('open');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
    };

    // ── Desktop: toggle expanded/collapsed ──
    const toggleDesktopSidebar = () => {
      sidebar?.classList.toggle('expanded');
    };

    toggle?.addEventListener('click', () => {
      if (isDesktop()) {
        toggleDesktopSidebar();
      } else {
        sidebar?.classList.contains('open') ? closeDrawer() : openDrawer();
      }
    });

    closeBtn?.addEventListener('click', () => {
      if (isDesktop()) {
        sidebar?.classList.remove('expanded');
      } else {
        closeDrawer();
      }
    });
    overlay?.addEventListener('click', closeDrawer);

    sidebar?.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (!isDesktop()) closeDrawer();
        // On desktop, collapse sidebar after navigation click
        if (isDesktop()) sidebar?.classList.remove('expanded');
      });
    });

    window.addEventListener('resize', () => {
      if (isDesktop()) {
        // Clean up mobile state when switching to desktop
        sidebar?.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        // Clean up desktop state when switching to mobile
        sidebar?.classList.remove('expanded');
      }
    });
  },

  initSearch() {
    const input = document.getElementById('dashSearch');
    input?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.dash-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  },

  initNotifications() {
    const btn = document.getElementById('notifBtn');
    const panel = document.getElementById('notifPanel');
    btn?.addEventListener('click', () => panel?.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#notifBtn') && !e.target.closest('#notifPanel')) {
        panel?.classList.remove('open');
      }
    });
  },

  initMiniCharts() {
    document.querySelectorAll('.mini-chart').forEach(chart => {
      const data = JSON.parse(chart.dataset.points || '[]');
      if (!data.length) return;
      const w = chart.clientWidth || 120;
      const h = chart.clientHeight || 40;
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      const step = w / (data.length - 1);
      let path = '';
      data.forEach((val, i) => {
        const x = i * step;
        const y = h - ((val - min) / range) * (h - 4) - 2;
        path += (i === 0 ? 'M' : 'L') + x + ',' + y;
      });
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.innerHTML = `<path d="${path}" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/>`;
      chart.appendChild(svg);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());
