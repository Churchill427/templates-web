/* ============================================
   AquaLux — Dashboard JavaScript
   Charts (Canvas), Sidebar, Tables
   ============================================ */

'use strict';

const Dashboard = (() => {
  // ============================================
  // 1. SIDEBAR TOGGLE
  // ============================================
  function initSidebar() {
    const toggle = document.querySelector('.dashboard__sidebar-toggle');
    const sidebar = document.querySelector('.dashboard__sidebar');
    const overlay = document.querySelector('.dashboard__overlay');
    const main = document.querySelector('.dashboard__main');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.toggle('dashboard__sidebar--open');
        sidebar.classList.remove('dashboard__sidebar--collapsed'); // Ensure it's not collapsed on mobile
        if (overlay) overlay.classList.toggle('dashboard__overlay--visible');
      } else {
        sidebar.classList.toggle('dashboard__sidebar--collapsed');
        sidebar.classList.remove('dashboard__sidebar--open'); // Not needed on desktop
        if (main) main.classList.toggle('dashboard__main--collapsed');
      }
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('dashboard__sidebar--open');
        overlay.classList.remove('dashboard__overlay--visible');
      });
    }

    // Sidebar nav active state
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav__link').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('sidebar-nav__link--active');
      }
    });
  }

  // ============================================
  // 2. LINE CHART
  // ============================================
  function drawLineChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (options.height || 250) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (options.height || 250) + 'px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = options.height || 250;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const maxVal = Math.max(...data.values) * 1.1;
    const minVal = 0;

    // Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();

      // Y-axis labels
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#718096';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(options.prefix ? options.prefix + val.toLocaleString() : val.toLocaleString(), pad.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    data.labels.forEach((label, i) => {
      const x = pad.left + (chartW / (data.labels.length - 1)) * i;
      ctx.fillText(label, x, h - 8);
    });

    // Line
    ctx.beginPath();
    ctx.strokeStyle = options.color || '#319795';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';

    data.values.forEach((val, i) => {
      const x = pad.left + (chartW / (data.values.length - 1)) * i;
      const y = pad.top + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    gradient.addColorStop(0, (options.color || '#319795') + '30');
    gradient.addColorStop(1, (options.color || '#319795') + '05');

    ctx.lineTo(pad.left + chartW, h - pad.bottom);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Dots
    data.values.forEach((val, i) => {
      const x = pad.left + (chartW / (data.values.length - 1)) * i;
      const y = pad.top + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = options.color || '#319795';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // ============================================
  // 3. BAR CHART
  // ============================================
  function drawBarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (options.height || 200) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (options.height || 200) + 'px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = options.height || 200;
    const pad = { top: 15, right: 15, bottom: 35, left: 45 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const maxVal = Math.max(...data.values) * 1.15;
    const barW = Math.min(chartW / data.values.length * 0.6, 40);
    const gap = chartW / data.values.length;
    const colors = options.colors || ['#319795', '#ed8936', '#1a365d', '#4fd1c5', '#f6ad55', '#2a4a7f'];

    // Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 3; i++) {
      const y = pad.top + (chartH / 3) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
    }

    // Bars
    data.values.forEach((val, i) => {
      const x = pad.left + gap * i + (gap - barW) / 2;
      const barH = (val / maxVal) * chartH;
      const y = pad.top + chartH - barH;

      const grad = ctx.createLinearGradient(x, y, x, pad.top + chartH);
      grad.addColorStop(0, colors[i % colors.length]);
      grad.addColorStop(1, colors[i % colors.length] + '80');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Label
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#718096';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[i], x + barW / 2, h - 8);
    });
  }

  // ============================================
  // 4. PIE CHART
  // ============================================
  function drawPieChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const size = options.size || 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 10;
    const total = data.values.reduce((a, b) => a + b, 0);
    const colors = options.colors || ['#319795', '#ed8936', '#1a365d', '#4fd1c5', '#f6ad55', '#2a4a7f'];

    let startAngle = -Math.PI / 2;
    data.values.forEach((val, i) => {
      const sliceAngle = (val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center hole (donut)
    if (options.donut !== false) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#fff';
      ctx.fill();

      // Center text
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#1a202c';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(total.toLocaleString(), cx, cy - 8);
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#718096';
      ctx.fillText(options.centerLabel || 'Total', cx, cy + 10);
    }
  }

  // ============================================
  // 5. AREA CHART
  // ============================================
  function drawAreaChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (options.height || 200) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (options.height || 200) + 'px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = options.height || 200;
    const pad = { top: 15, right: 15, bottom: 35, left: 45 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const maxVal = Math.max(...data.values) * 1.1;

    // X labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#718096';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.labels.forEach((label, i) => {
      const x = pad.left + (chartW / (data.labels.length - 1)) * i;
      ctx.fillText(label, x, h - 8);
    });

    // Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 3; i++) {
      const y = pad.top + (chartH / 3) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
    }

    // Area fill
    const points = data.values.map((val, i) => ({
      x: pad.left + (chartW / (data.values.length - 1)) * i,
      y: pad.top + chartH - (val / maxVal) * chartH
    }));

    // Smooth curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpx = (points[i - 1].x + points[i].x) / 2;
      ctx.quadraticCurveTo(points[i - 1].x + (cpx - points[i - 1].x) * 0.8, points[i - 1].y, cpx, (points[i - 1].y + points[i].y) / 2);
      ctx.quadraticCurveTo(points[i].x - (points[i].x - cpx) * 0.8, points[i].y, points[i].x, points[i].y);
    }

    const color = options.color || '#319795';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
    ctx.lineTo(points[0].x, pad.top + chartH);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    gradient.addColorStop(0, color + '35');
    gradient.addColorStop(1, color + '05');
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // ============================================
  // 6. LEGEND HELPER
  // ============================================
  function createLegend(containerId, labels, colors) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = labels.map((label, i) =>
      `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);"><span style="width:10px;height:10px;border-radius:50%;background:${colors[i % colors.length]};display:inline-block;"></span>${label}</div>`
    ).join('');
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    initSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, drawLineChart, drawBarChart, drawPieChart, drawAreaChart, createLegend };
})();
