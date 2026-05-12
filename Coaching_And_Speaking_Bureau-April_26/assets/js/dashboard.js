/* ============================================
   DASHBOARD MODULE
   Charts, sidebar, and dashboard interactions
   ============================================ */
'use strict';

const Dashboard = (() => {
  /**
   * Initialize sidebar toggle
   */
  function initSidebar() {
    const toggle = document.querySelector('[data-sidebar-toggle]');
    const sidebar = document.querySelector('.dashboard__sidebar');
    const overlay = document.querySelector('.dashboard__overlay');
    if (!toggle || !sidebar) return;

    // Restore desktop collapsed state
    if (window.innerWidth >= 1024 && localStorage.getItem('dashboardSidebarCollapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }

    toggle.addEventListener('click', () => {
      if (window.innerWidth >= 1024) {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('dashboardSidebarCollapsed', sidebar.classList.contains('collapsed'));
      } else {
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
      }
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close sidebar on nav link click (mobile)
    sidebar.querySelectorAll('.dashboard__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /**
   * Initialize dashboard tab navigation
   */
  function initTabs() {
    const navLinks = document.querySelectorAll('.dashboard__nav-link');
    const sections = document.querySelectorAll('.dashboard__section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('data-section');
        if (!targetId) return; // Allow normal navigation for links without data-section
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        sections.forEach(section => {
          section.classList.remove('active');
          if (section.id === targetId) {
            section.classList.add('active');
          }
        });
      });
    });
  }

  /**
   * Draw a simple line chart using Canvas
   */
  function drawLineChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.style.width = '100%';
    const cw = canvas.offsetWidth || canvas.parentElement.clientWidth;
    canvas.width = cw;
    canvas.height = options.height || 200;

    const w = canvas.width;
    const h = canvas.height;
    const padding = 40;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    const maxVal = Math.max(...data.values);
    const minVal = 0;

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim() || '#fff';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    // Data line
    const gradient = ctx.createLinearGradient(0, padding, 0, h - padding);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    // Fill area
    ctx.beginPath();
    data.values.forEach((val, i) => {
      const x = padding + (chartW / (data.values.length - 1)) * i;
      const y = padding + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + chartW, padding + chartH);
    ctx.lineTo(padding, padding + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    data.values.forEach((val, i) => {
      const x = padding + (chartW / (data.values.length - 1)) * i;
      const y = padding + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Points
    data.values.forEach((val, i) => {
      const x = padding + (chartW / (data.values.length - 1)) * i;
      const y = padding + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

    // Labels
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim() || '#666';
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    if (data.labels) {
      data.labels.forEach((label, i) => {
        const x = padding + (chartW / (data.labels.length - 1)) * i;
        ctx.fillText(label, x, h - 10);
      });
    }
  }

  /**
   * Draw a doughnut chart
   */
  function drawDoughnutChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = options.size || 200;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;
    const innerRadius = radius * 0.6;

    const colors = options.colors || ['#4f46e5', '#f97316', '#10b981', '#3b82f6', '#f59e0b'];
    const total = data.values.reduce((a, b) => a + b, 0);

    let startAngle = -Math.PI / 2;

    data.values.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center text
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#333';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toLocaleString(), centerX, centerY - 8);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim() || '#666';
    ctx.fillText('Total', centerX, centerY + 12);
  }

  /**
   * Draw a bar chart
   */
  function drawBarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.style.width = '100%';
    const cw = canvas.offsetWidth || canvas.parentElement.clientWidth;
    canvas.width = cw;
    canvas.height = options.height || 200;

    const w = canvas.width;
    const h = canvas.height;
    const padding = 40;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    const maxVal = Math.max(...data.values) * 1.1;
    const barWidth = Math.min((chartW / data.values.length) * 0.5, 40);
    const barGap = (chartW - barWidth * data.values.length) / (data.values.length + 1);

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim() || '#fff';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    const colors = options.colors || ['#4f46e5', '#f97316', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    data.values.forEach((val, i) => {
      const x = padding + barGap + (barWidth + barGap) * i;
      const barH = (val / maxVal) * chartH;
      const y = padding + chartH - barH;

      // Bar with rounded top
      const r = 4;
      ctx.beginPath();
      ctx.moveTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + r, r);
      ctx.lineTo(x + barWidth, padding + chartH);
      ctx.lineTo(x, padding + chartH);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
    });

    // Labels
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim() || '#666';
    ctx.fillStyle = textColor;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    if (data.labels) {
      data.labels.forEach((label, i) => {
        const x = padding + barGap + (barWidth + barGap) * i + barWidth / 2;
        ctx.fillText(label, x, h - 10);
      });
    }
  }

  /**
   * Draw an area chart
   */
  function drawAreaChart(canvasId, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.style.width = '100%';
    const cw = canvas.offsetWidth || canvas.parentElement.clientWidth;
    canvas.width = cw;
    canvas.height = options.height || 200;

    const w = canvas.width;
    const h = canvas.height;
    const padding = 40;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    const allValues = datasets.flatMap(d => d.values);
    const maxVal = Math.max(...allValues);

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim() || '#fff';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e5e5e5';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    const colors = ['rgba(79, 70, 229, ', 'rgba(16, 185, 129, '];

    datasets.forEach((dataset, di) => {
      const colorBase = colors[di % colors.length];

      // Area fill
      ctx.beginPath();
      dataset.values.forEach((val, i) => {
        const x = padding + (chartW / (dataset.values.length - 1)) * i;
        const y = padding + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(padding + chartW, padding + chartH);
      ctx.lineTo(padding, padding + chartH);
      ctx.closePath();
      ctx.fillStyle = colorBase + '0.15)';
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = colorBase + '1)';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      dataset.values.forEach((val, i) => {
        const x = padding + (chartW / (dataset.values.length - 1)) * i;
        const y = padding + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Labels
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim() || '#666';
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    if (options.labels) {
      options.labels.forEach((label, i) => {
        const x = padding + (chartW / (options.labels.length - 1)) * i;
        ctx.fillText(label, x, h - 10);
      });
    }
  }

  /**
   * Draw a radar chart
   */
  function drawRadarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = options.size || 220;
    canvas.width = size;
    canvas.height = size;

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 30;
    const levels = 5;
    const count = data.labels.length;
    const angle = (Math.PI * 2) / count;

    // Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e5e5e5';
    ctx.lineWidth = 0.5;

    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const x = cx + r * Math.cos(angle * i - Math.PI / 2);
        const y = cy + r * Math.sin(angle * i - Math.PI / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Axes
    for (let i = 0; i < count; i++) {
      const x = cx + radius * Math.cos(angle * i - Math.PI / 2);
      const y = cy + radius * Math.sin(angle * i - Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Data
    ctx.beginPath();
    data.values.forEach((val, i) => {
      const r = (val / 100) * radius;
      const x = cx + r * Math.cos(angle * i - Math.PI / 2);
      const y = cy + r * Math.sin(angle * i - Math.PI / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    data.values.forEach((val, i) => {
      const r = (val / 100) * radius;
      const x = cx + r * Math.cos(angle * i - Math.PI / 2);
      const y = cy + r * Math.sin(angle * i - Math.PI / 2);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
    });

    // Labels
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim() || '#666';
    ctx.fillStyle = textColor;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    data.labels.forEach((label, i) => {
      const r = radius + 18;
      const x = cx + r * Math.cos(angle * i - Math.PI / 2);
      const y = cy + r * Math.sin(angle * i - Math.PI / 2);
      ctx.fillText(label, x, y);
    });
  }

  /**
   * Draw a progress ring
   */
  function drawProgressRing(canvasId, percentage, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = options.size || 160;
    canvas.width = size;
    canvas.height = size;

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 15;
    const lineWidth = options.lineWidth || 12;

    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e5e5e5';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Progress arc
    const endAngle = -Math.PI / 2 + (percentage / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, endAngle);
    ctx.strokeStyle = options.color || '#4f46e5';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#333';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percentage + '%', cx, cy - 5);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim() || '#666';
    ctx.fillText('Complete', cx, cy + 15);
  }

  /**
   * Initialize dashboard sections display
   */
  function initSections() {
    const sections = document.querySelectorAll('.dashboard__section');
    if (sections.length > 0) {
      sections[0].classList.add('active');
    }
  }

  /**
   * Redraw all charts (for theme changes / resize)
   */
  function redrawCharts() {
    // This will be called with specific chart data from each dashboard page
    if (typeof window.renderDashboardCharts === 'function') {
      window.renderDashboardCharts();
    }
  }

  /**
   * Initialize
   */
  function init() {
    initSidebar();
    initTabs();
    initSections();

    // Redraw charts on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(redrawCharts, 250);
    });

    // Redraw on theme change
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (m.attributeName === 'data-theme') {
          setTimeout(redrawCharts, 50);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
  }

  return {
    init,
    drawLineChart,
    drawDoughnutChart,
    drawBarChart,
    drawAreaChart,
    drawRadarChart,
    drawProgressRing,
    redrawCharts
  };
})();

document.addEventListener('DOMContentLoaded', Dashboard.init);
