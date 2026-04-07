/* ============================================
   INK STUDIO - Dashboard JavaScript
   ============================================ */

'use strict';

const Dashboard = (() => {
  function init() {
    initSidebar();
    initRoleToggle();
    // initCharts will be called by setRole during initialization
    initDataTables();
    initMessageInteractions();
  }

  // ---- Sidebar ----
  function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const drawerToggle = document.querySelector('.dashboard-toggle-drawer');

    if (drawerToggle && sidebar) {
      drawerToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('mobile-open');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('mobile-open')) {
          if (!e.target.closest('.sidebar') && !e.target.closest('.dashboard-toggle-drawer')) {
            sidebar.classList.remove('mobile-open');
          }
        }
      });
    }

    // Active link highlight
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const linkPath = link.getAttribute('href')?.split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // ---- Role Toggle ----
  function initRoleToggle() {
    const toggleBtns = document.querySelectorAll('.role-toggle-btn');
    const adminContent = document.querySelectorAll('.admin-content');
    const userContent = document.querySelectorAll('.user-content');

    const setRole = (role) => {
      if (role === 'admin') {
        adminContent.forEach(el => el.style.display = '');
        userContent.forEach(el => el.style.display = 'none');
      } else {
        adminContent.forEach(el => el.style.display = 'none');
        userContent.forEach(el => el.style.display = '');
      }

      // Re-initialize charts after role change using requestAnimationFrame
      // to ensure display:block has taken effect and dimensions are available.
      requestAnimationFrame(() => {
        initCharts();
      });

      // Update UI for any existing toggle buttons
      toggleBtns.forEach(btn => {
        if (btn.getAttribute('data-role') === role) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    };

    // Check URL for role parameter
    const urlParams = new URLSearchParams(window.location.search);
    const initialRole = urlParams.get('role') || 'admin';
    setRole(initialRole);

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        setRole(role);
        
        // Update URL without reloading
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('role', role);
        window.history.pushState({ role }, '', newUrl);
      });
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', (e) => {
      const urlParams = new URLSearchParams(window.location.search);
      setRole(urlParams.get('role') || 'admin');
    });
  }

  // ---- Simple Chart Drawing (Canvas) ----
  function initCharts() {
    const charts = [
      { id: 'lineChart', fn: drawLineChart },
      { id: 'barChart', fn: drawBarChart },
      { id: 'pieChart', fn: drawPieChart },
      { id: 'growthChart', fn: drawGrowthChart },
      { id: 'userSpendingChart', fn: drawUserSpendingChart },
      { id: 'userSessionTypeChart', fn: drawUserSessionTypeChart },
      { id: 'userHealingChart', fn: drawUserHealingChart },
      { id: 'userArtistVisitsChart', fn: drawUserArtistVisitsChart }
    ];

    charts.forEach(c => {
      const canvas = document.getElementById(c.id);
      if (canvas && canvas.offsetParent !== null) { // Only draw if visible
        c.fn(canvas);
      }
    });
  }

  function drawLineChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [20, 45, 35, 60, 80, 55, 90, 70, 95, 85, 110, 100];
    const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const maxVal = Math.max(...data) * 1.1;
    const paddingX = 50;
    const paddingY = 40;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    // Grid lines
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = paddingY + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(paddingX, y);
      ctx.lineTo(width - paddingX, y);
      ctx.stroke();
    }

    // Adjust chart height calculation for better "zoom out"
    const usableChartH = chartH;
    const chartYOffset = paddingY;

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';

    data.forEach((val, i) => {
      const x = paddingX + (chartW / (data.length - 1)) * i;
      const y = paddingY + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, paddingY, 0, height - paddingY);
    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.15)');
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.lineTo(paddingX + chartW, height - paddingY);
    ctx.lineTo(paddingX, height - paddingY);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Points
    data.forEach((val, i) => {
      const x = paddingX + (chartW / (data.length - 1)) * i;
      const y = paddingY + chartH - (val / maxVal) * chartH;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#737373';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((_, i) => {
      const x = paddingX + (chartW / (data.length - 1)) * i;
      ctx.fillText(labels[i], x, height - 8);
    });
  }

  function drawBarChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 40;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [
      { label: 'Custom', value: 85, color: '#dc2626' },
      { label: 'Trad.', value: 60, color: '#f59e0b' },
      { label: 'Neo', value: 45, color: '#3b82f6' },
      { label: 'Japan.', value: 70, color: '#10b981' },
      { label: 'Piercing', value: 55, color: '#ec4899' },
      { label: 'Minimal', value: 40, color: '#8b5cf6' }
    ];

    const maxVal = Math.max(...data.map(d => d.value)) * 1.15;
    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const barWidth = chartW / data.length * 0.6;
    const gap = chartW / data.length * 0.4;

    // Grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Bars
    data.forEach((item, i) => {
      const x = padding + (chartW / data.length) * i + gap / 2;
      const barH = (item.value / maxVal) * chartH;
      const y = padding + chartH - barH;

      // Bar with rounded top
      ctx.beginPath();
      ctx.fillStyle = item.color;
      const radius = 4;
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y, x + barWidth, y, radius);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + barH, radius);
      ctx.lineTo(x + barWidth, padding + chartH);
      ctx.lineTo(x, padding + chartH);
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#737373';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - 8);

      // Value
      ctx.fillStyle = '#525252';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(item.value, x + barWidth / 2, y - 6);
    });
  }

  function drawPieChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [
      { label: 'New Clients', value: 65, color: '#dc2626' },
      { label: 'Returning', value: 35, color: '#f59e0b' }
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 30;
    let startAngle = -Math.PI / 2;

    data.forEach(item => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = cx + Math.cos(midAngle) * (radius * 0.65);
      const labelY = cy + Math.sin(midAngle) * (radius * 0.65);
      ctx.fillStyle = '#fff';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, labelX, labelY);

      startAngle += sliceAngle;
    });

    // Center circle (donut)
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
  }

  function drawGrowthChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 400;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [
      { label: 'Marcus', value: 85, color: '#dc2626' },
      { label: 'Luna', value: 72, color: '#f59e0b' },
      { label: 'Jake', value: 64, color: '#3b82f6' },
      { label: 'Sasha', value: 91, color: '#10b981' }
    ];

    const maxVal = 100;
    const padLeft = 60;
    const padRight = 60;
    const padTop = 40;
    const padBottom = 30;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;
    const barWidth = chartW / data.length * 0.4;
    const gap = chartW / data.length * 0.6;

    // Grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
    }

    // Horizontal bars
    data.forEach((item, i) => {
      const y = padTop + (chartH / data.length) * i + 10;
      const barW = (item.value / maxVal) * chartW;
      const h = 18;

      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(padLeft, y, chartW, h);

      ctx.fillStyle = item.color;
      ctx.fillRect(padLeft, y, barW, h);

      ctx.fillStyle = '#737373';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, padLeft, y - 6);

      ctx.textAlign = 'right';
      ctx.fillText(item.value + '%', padLeft + chartW, y - 6);
    });
  }

  function drawUserSpendingChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 400;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [120, 0, 450, 0, 280, 0];
    const labels = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const maxVal = 500;
    const paddingX = 50;
    const paddingY = 40;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    data.forEach((val, i) => {
      const x = paddingX + (chartW / (data.length - 1)) * i;
      const y = paddingY + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    const gradient = ctx.createLinearGradient(0, paddingY, 0, height - paddingY);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.lineTo(paddingX + chartW, height - paddingY);
    ctx.lineTo(paddingX, height - paddingY);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Labels
    ctx.fillStyle = '#737373';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((l, i) => {
      const x = paddingX + (chartW / (labels.length - 1)) * i;
      ctx.fillText(l, x, height - 8);
    });
  }

  function drawUserSessionTypeChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [
      { label: 'Tattoo', value: 3, color: '#dc2626' },
      { label: 'Piercing', value: 1, color: '#f59e0b' }
    ];

    const total = 4;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    let startAngle = -Math.PI / 2;

    data.forEach(item => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('4 Total', cx, cy + 5);
  }

  function drawUserHealingChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const percentage = 85;
    const cx = width / 2;
    const cy = height / 2 + 10;
    const radius = 70;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#262626';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Progress
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 0.8 + (Math.PI * 1.4 * (percentage / 100)));
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#dc2626';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(percentage + '%', cx, cy);

    ctx.fillStyle = '#737373';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Heal Complete', cx, cy + 20);
  }

  function drawUserArtistVisitsChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const data = [
      { label: 'Marcus', value: 3, color: '#dc2626' },
      { label: 'Luna', value: 1, color: '#f59e0b' }
    ];

    const maxVal = 4;
    const padLeft = 60;
    const padRight = 30;
    const padTop = 40;
    const padBottom = 30;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;
    const barH = 20;

    data.forEach((item, i) => {
      const y = padTop + (chartH / data.length) * i + 10;
      const barW = (item.value / maxVal) * chartW;

      ctx.fillStyle = '#262626';
      ctx.fillRect(padLeft, y, chartW, barH);

      ctx.fillStyle = item.color;
      ctx.fillRect(padLeft, y, barW, barH);

      ctx.fillStyle = '#737373';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(item.label, padLeft - 10, y + 14);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.value + ' Sessions', padLeft + 10, y + 14);
    });
  }

  // ---- Data Tables ----
  function initDataTables() {
    // Search
    const searchInputs = document.querySelectorAll('.table-search');
    searchInputs.forEach(input => {
      input.addEventListener('input', debounce(() => {
        const query = input.value.toLowerCase();
        const tableId = input.getAttribute('data-table');
        const table = document.getElementById(tableId);
        if (!table) return;

        table.querySelectorAll('tbody tr').forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      }, 250));
    });

    // Sort
    document.querySelectorAll('.sortable').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const table = th.closest('table');
        const index = Array.from(th.parentElement.children).indexOf(th);
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = th.classList.contains('sort-asc');

        rows.sort((a, b) => {
          const aVal = a.children[index]?.textContent.trim() || '';
          const bVal = b.children[index]?.textContent.trim() || '';
          return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });

        // Reset all sort indicators
        th.parentElement.querySelectorAll('th').forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  // ---- Messages ----
  function initMessageInteractions() {
    document.querySelectorAll('.message-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.remove('unread');
        document.querySelectorAll('.message-item').forEach(m => m.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
  }

  // ---- Utility ----
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Dashboard.init);
