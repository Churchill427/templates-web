/* ============================================
   DASHBOARD.JS — Admin & User Panel
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.dashboard')) return;
    initSidebar();
    initRoleSwitcher();
    initDashboardCharts();
    initOrderFilters();
    initProfileForm();
    initMessagePanel();
  });

  /* ================================================
     SIDEBAR NAVIGATION
     ================================================ */
  function initSidebar() {
    const dashboard = document.querySelector('.dashboard');
    const links = document.querySelectorAll('.sidebar__link');
    const panels = document.querySelectorAll('.dashboard__panel');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebarToggle && dashboard) {
      sidebarToggle.addEventListener('click', () => {
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        if (isDesktop) {
          dashboard.classList.toggle('sidebar-expanded');
        } else {
          dashboard.classList.toggle('sidebar-open');
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        dashboard.classList.remove('sidebar-open');
      });
    }

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.dataset.panel;

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        panels.forEach(p => {
          p.classList.remove('active');
          if (p.id === target) p.classList.add('active');
        });

        // Close on link click (mobile focus)
        dashboard.classList.remove('sidebar-open');
      });
    });
  }

  /* ================================================
     ROLE SWITCHER (Admin ↔ User)
     ================================================ */
  function initRoleSwitcher() {
    const switcher = document.getElementById('role-switcher');

    // Check query param first
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    const saved = roleParam || localStorage.getItem('dashboardRole') || 'admin';
    applyRole(saved);
    if (switcher) switcher.value = saved;
    
    // Save it if it came from param
    if (roleParam) localStorage.setItem('dashboardRole', roleParam);

    if (switcher) {
      switcher.addEventListener('change', () => {
        const role = switcher.value;
        applyRole(role);
        localStorage.setItem('dashboardRole', role);
        // Clean up URL if we manually switch
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      });
    }
  }

  function applyRole(role) {
    document.querySelectorAll('[data-role]').forEach(el => {
      const roles = el.dataset.role.split(',').map(r => r.trim());
      el.style.display = roles.includes(role) || roles.includes('both') ? '' : 'none';
    });

    // Update sidebar visibility
    document.querySelectorAll('.sidebar__link[data-role]').forEach(link => {
      const roles = link.dataset.role.split(',').map(r => r.trim());
      link.style.display = roles.includes(role) || roles.includes('both') ? '' : 'none';
    });

    // Show first visible panel
    const firstLink = document.querySelector(`.sidebar__link[data-role*="${role}"]:not([style*="none"]), .sidebar__link[data-role="both"]`);
    if (firstLink) firstLink.click();
  }

  /* ================================================
     DASHBOARD CHARTS (Chart.js Integration)
     ================================================ */
  let charts = {};

  function initDashboardCharts() {
    // Clear existing charts if any
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#A0988C' : '#7A7A7A';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const primaryColor = '#6F4E37';
    const accentColor = '#D4A574';

    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#252119' : '#FFFFFF';
    Chart.defaults.plugins.tooltip.titleColor = isDark ? '#FFFFFF' : '#1A1A1A';
    Chart.defaults.plugins.tooltip.bodyColor = isDark ? '#E0D8CC' : '#7A7A7A';
    Chart.defaults.plugins.tooltip.borderColor = isDark ? '#2E2A24' : '#E0D5C1';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    // Admin Charts
    drawRevenueChart(primaryColor, accentColor, gridColor);
    drawOrdersChart(primaryColor, gridColor);
    drawGrowthChart('#E85D04', gridColor);
    drawCategoriesChart(primaryColor, gridColor);

    // User Charts
    drawConsumptionChart(accentColor, gridColor);
    drawSpendingChart(primaryColor, gridColor);
    drawTasteChart(accentColor, gridColor);
    drawProgressChart(primaryColor);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          initDashboardCharts();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  function drawRevenueChart(primary, accent, grid) {
    const ctx = document.getElementById('revenue-chart')?.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, primary);
    gradient.addColorStop(1, accent);

    charts.revenue = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [1200, 1900, 1500, 2800, 2200, 3100, 2700, 3400, 2900, 3800, 3200, 4100],
          backgroundColor: gradient,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: grid }, ticks: { callback: value => '$' + (value >= 1000 ? value / 1000 + 'k' : value) } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function drawOrdersChart(primary, grid) {
    const ctx = document.getElementById('orders-chart')?.getContext('2d');
    if (!ctx) return;

    charts.orders = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Orders',
          data: [45, 62, 58, 78, 71, 90, 85, 95, 88, 102, 96, 110],
          borderColor: primary,
          borderWidth: 3,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: primary,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: grid } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function drawGrowthChart(color, grid) {
    const ctx = document.getElementById('growth-chart')?.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(232, 93, 4, 0.4)');
    gradient.addColorStop(1, 'rgba(232, 93, 4, 0)');

    charts.growth = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'Customers',
          data: [200, 350, 600, 900, 1400, 2100, 3000, 4200, 5800, 7500],
          borderColor: color,
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: grid }, max: 10000 },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function drawCategoriesChart(primary, grid) {
    const ctx = document.getElementById('categories-chart')?.getContext('2d');
    if (!ctx) return;

    charts.categories = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Single Origin', 'Blends', 'Equipment', 'Merch', 'Courses'],
        datasets: [{
          label: 'Sales Share',
          data: [85, 65, 45, 30, 15],
          backgroundColor: primary,
          borderRadius: 20,
          barThickness: 12
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: grid }, max: 100 },
          y: { grid: { display: false } }
        }
      }
    });
  }

  function drawConsumptionChart(accent, grid) {
    const ctx = document.getElementById('consumption-chart')?.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(212, 165, 116, 0.4)');
    gradient.addColorStop(1, 'rgba(212, 165, 116, 0)');

    charts.consumption = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Cups',
          data: [2, 3, 2, 4, 3, 5, 4],
          borderColor: accent,
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: accent,
          pointBorderColor: '#FFF',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.parsed.y} cups consumed`
            }
          }
        },
        scales: {
          y: { grid: { color: grid }, min: 0, max: 6, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function drawSpendingChart(primary, grid) {
    const ctx = document.getElementById('spending-chart')?.getContext('2d');
    if (!ctx) return;

    charts.spending = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Spending',
          data: [45, 82, 35, 64],
          backgroundColor: primary,
          borderRadius: 4,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: grid }, ticks: { callback: v => '$' + v } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function drawTasteChart(accent, grid) {
    const ctx = document.getElementById('taste-chart')?.getContext('2d');
    if (!ctx) return;

    charts.taste = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Acidity', 'Body', 'Sweet', 'Roast', 'Price'],
        datasets: [{
          label: 'Preference',
          data: [80, 60, 90, 40, 70],
          backgroundColor: 'rgba(212, 165, 116, 0.3)',
          borderColor: accent,
          borderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            grid: { color: grid },
            angleLines: { color: grid },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { display: false }
          }
        }
      }
    });
  }

  function drawProgressChart(primary) {
    const ctx = document.getElementById('progress-chart')?.getContext('2d');
    if (!ctx) return;

    charts.progress = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [75, 25],
          backgroundColor: [primary, 'rgba(0,0,0,0.05)'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
          cutout: '80%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  /* ================================================
     ORDER STATUS FILTERS
     ================================================ */
  function initOrderFilters() {
    const btns = document.querySelectorAll('.order-filter__btn');
    const rows = document.querySelectorAll('.order-row');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        rows.forEach(row => {
          if (filter === 'all' || row.dataset.status === filter) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  /* ================================================
     PROFILE FORM
     ================================================ */
  function initProfileForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Profile updated successfully! ✓', 'success');
    });

    // Avatar upload preview
    const avatarInput = document.getElementById('avatar-upload');
    const avatarPreview = document.querySelector('.profile__avatar img');
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('change', () => {
        const file = avatarInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => { avatarPreview.src = e.target.result; };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  /* ================================================
     MESSAGES PANEL
     ================================================ */
  function initMessagePanel() {
    const msgItems = document.querySelectorAll('.message-item');
    const msgContent = document.querySelector('.message-content');
    if (!msgItems.length || !msgContent) return;

    msgItems.forEach(item => {
      item.addEventListener('click', () => {
        msgItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        item.classList.remove('unread');

        msgContent.innerHTML = `
          <div class="message-content__header">
            <h4>${item.dataset.from}</h4>
            <span class="text-muted">${item.dataset.date}</span>
          </div>
          <div class="message-content__body">
            <p>${item.dataset.message}</p>
          </div>
          <div class="message-content__reply" style="margin-top:24px">
            <textarea class="form-input" placeholder="Type your reply..." rows="3"></textarea>
            <button class="btn btn--primary" style="margin-top:12px" onclick="showToast('Reply sent! ✉️','success')">Send Reply</button>
          </div>
        `;
      });
    });
  }

})();
