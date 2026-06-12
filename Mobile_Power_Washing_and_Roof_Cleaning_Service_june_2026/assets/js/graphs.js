/* ============================================
   WASH — Custom Charts (Canvas-based)
   No external chart libraries — pure Canvas API
   ============================================ */
'use strict';

const WashCharts = (() => {
  const charts = [];

  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      primary: '#1B4D72',
      secondary: '#4ECDC4',
      accent: '#FF8C42',
      text: isDark ? '#F1F5F9' : '#0F172A',
      textSecondary: isDark ? '#94A3B8' : '#475569',
      gridLine: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      bg: isDark ? '#1E293B' : '#FFFFFF',
      palette: [
        '#1B4D72', '#4ECDC4', '#FF8C42',
        '#6366F1', '#EC4899', '#14B8A6',
        '#F59E0B', '#8B5CF6'
      ]
    };
  }

  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  /* ========== LINE CHART ========== */
  function drawLineChart(canvas, config) {
    const { ctx, width, height } = setupCanvas(canvas);
    const colors = getColors();
    const padding = { top: 30, right: 20, bottom: 50, left: 55 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const { labels, datasets } = config;
    let allValues = [];
    datasets.forEach(ds => allValues = allValues.concat(ds.data));
    const maxVal = Math.ceil(Math.max(...allValues) * 1.15);
    const minVal = 0;

    // Grid
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y labels
      const val = Math.round(maxVal - ((maxVal - minVal) / gridLines) * i);
      ctx.fillStyle = colors.textSecondary;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toLocaleString(), padding.left - 10, y + 4);
    }

    // X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.textSecondary;
    labels.forEach((label, i) => {
      const x = padding.left + (chartW / (labels.length - 1)) * i;
      ctx.fillText(label, x, height - padding.bottom + 20);
    });

    // Lines
    datasets.forEach((ds, di) => {
      const color = ds.color || colors.palette[di];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      ds.data.forEach((val, i) => {
        const x = padding.left + (chartW / (labels.length - 1)) * i;
        const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Area fill
      if (ds.fill !== false) {
        ctx.beginPath();
        ds.data.forEach((val, i) => {
          const x = padding.left + (chartW / (labels.length - 1)) * i;
          const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.lineTo(padding.left + chartW, padding.top + chartH);
        ctx.lineTo(padding.left, padding.top + chartH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, color + '30');
        grad.addColorStop(1, color + '05');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Dots
      ds.data.forEach((val, i) => {
        const x = padding.left + (chartW / (labels.length - 1)) * i;
        const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = colors.bg;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    addTooltipHandler(canvas, config, padding, chartW, chartH, maxVal, minVal, 'line');
  }

  /* ========== BAR CHART ========== */
  function drawBarChart(canvas, config) {
    const { ctx, width, height } = setupCanvas(canvas);
    const colors = getColors();
    const padding = { top: 30, right: 20, bottom: 50, left: 55 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const { labels, datasets } = config;
    let allValues = [];
    datasets.forEach(ds => allValues = allValues.concat(ds.data));
    const maxVal = Math.ceil(Math.max(...allValues) * 1.15);

    // Grid
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const val = Math.round(maxVal - (maxVal / gridLines) * i);
      ctx.fillStyle = colors.textSecondary;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toLocaleString(), padding.left - 10, y + 4);
    }

    const barGroupWidth = chartW / labels.length;
    const barWidth = Math.min(barGroupWidth * 0.5 / datasets.length, 40);
    const totalBarWidth = barWidth * datasets.length;
    const groupPad = (barGroupWidth - totalBarWidth) / 2;

    datasets.forEach((ds, di) => {
      const color = ds.color || colors.palette[di];
      ds.data.forEach((val, i) => {
        const barH = (val / maxVal) * chartH;
        const x = padding.left + barGroupWidth * i + groupPad + barWidth * di;
        const y = padding.top + chartH - barH;

        // Bar with rounded top
        const r = Math.min(4, barWidth / 2);
        ctx.beginPath();
        ctx.moveTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, padding.top + chartH);
        ctx.lineTo(x, padding.top + chartH);
        ctx.closePath();

        const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '80');
        ctx.fillStyle = grad;
        ctx.fill();
      });
    });

    // X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.textSecondary;
    ctx.font = '11px Inter, sans-serif';
    labels.forEach((label, i) => {
      const x = padding.left + barGroupWidth * i + barGroupWidth / 2;
      ctx.fillText(label, x, height - padding.bottom + 20);
    });

    addTooltipHandler(canvas, config, padding, chartW, chartH, maxVal, 0, 'bar');
  }

  /* ========== PIE / DOUGHNUT CHART ========== */
  function drawPieChart(canvas, config, isDoughnut = false) {
    const { ctx, width, height } = setupCanvas(canvas);
    const colors = getColors();

    const { labels, data, chartColors } = config;
    const total = data.reduce((a, b) => a + b, 0);
    const cx = width / 2;
    const cy = height / 2 - 10;
    const outerRadius = Math.min(cx, cy) - 30;
    const innerRadius = isDoughnut ? outerRadius * 0.55 : 0;

    let startAngle = -Math.PI / 2;

    data.forEach((val, i) => {
      const sliceAngle = (val / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      const color = (chartColors && chartColors[i]) || colors.palette[i];

      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, startAngle, endAngle);
      if (isDoughnut) {
        ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
      } else {
        ctx.lineTo(cx, cy);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelR = outerRadius * (isDoughnut ? 0.8 : 0.7);
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;

      const pct = Math.round((val / total) * 100);
      if (pct > 5) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pct + '%', lx, ly);
      }

      startAngle = endAngle;
    });

    // Center text for doughnut
    if (isDoughnut) {
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(total.toLocaleString(), cx, cy - 5);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = colors.textSecondary;
      ctx.fillText('Total', cx, cy + 15);
    }

    // Legend
    const legendY = height - 20;
    const legendX = width / 2 - (labels.length * 70) / 2;
    labels.forEach((label, i) => {
      const x = legendX + i * 80;
      const color = (chartColors && chartColors[i]) || colors.palette[i];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, legendY - 5, 10, 10, 2);
      ctx.fill();

      ctx.fillStyle = colors.textSecondary;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, x + 14, legendY + 4);
    });
  }

  /* ========== AREA CHART ========== */
  function drawAreaChart(canvas, config) {
    config.datasets = config.datasets.map(ds => ({ ...ds, fill: true }));
    drawLineChart(canvas, config);
  }

  /* ========== PROGRESS CHART ========== */
  function drawProgressChart(canvas, config) {
    const { ctx, width, height } = setupCanvas(canvas);
    const colors = getColors();

    const { value, maxValue, label, sublabel } = config;
    const pct = value / maxValue;
    const cx = width / 2;
    const cy = height / 2 - 15;
    const radius = Math.min(cx, cy) - 20;
    const lineWidth = 14;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Progress
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + Math.PI * 2 * pct;

    const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    grad.addColorStop(0, colors.primary);
    grad.addColorStop(1, colors.secondary);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(pct * 100) + '%', cx, cy - 5);

    if (label) {
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = colors.textSecondary;
      ctx.fillText(label, cx, cy + 18);
    }

    if (sublabel) {
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = colors.textSecondary;
      ctx.fillText(sublabel, cx, height - 15);
    }
  }

  /* ========== TOOLTIP HANDLER ========== */
  function addTooltipHandler(canvas, config, padding, chartW, chartH, maxVal, minVal, type) {
    let tooltip = canvas.parentElement.querySelector('.chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: var(--surface, #fff);
        border: 1px solid var(--border, #e2e8f0);
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        font-family: Inter, sans-serif;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s ease;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        white-space: nowrap;
      `;
      canvas.parentElement.style.position = 'relative';
      canvas.parentElement.appendChild(tooltip);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { labels, datasets } = config;

      if (type === 'line') {
        const stepX = chartW / (labels.length - 1);
        const idx = Math.round((x - padding.left) / stepX);
        if (idx >= 0 && idx < labels.length) {
          let html = `<strong>${labels[idx]}</strong>`;
          datasets.forEach(ds => {
            html += `<br>${ds.label}: ${ds.data[idx].toLocaleString()}`;
          });
          tooltip.innerHTML = html;
          tooltip.style.opacity = '1';
          tooltip.style.left = (x + 10) + 'px';
          tooltip.style.top = (y - 10) + 'px';
        }
      } else if (type === 'bar') {
        const barGroupWidth = chartW / labels.length;
        const idx = Math.floor((x - padding.left) / barGroupWidth);
        if (idx >= 0 && idx < labels.length) {
          let html = `<strong>${labels[idx]}</strong>`;
          datasets.forEach(ds => {
            html += `<br>${ds.label}: ${ds.data[idx].toLocaleString()}`;
          });
          tooltip.innerHTML = html;
          tooltip.style.opacity = '1';
          tooltip.style.left = (x + 10) + 'px';
          tooltip.style.top = (y - 10) + 'px';
        }
      }
    });

    canvas.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  }

  /* ========== CREATE CHART API ========== */
  function create(canvasId, type, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const chartEntry = { canvasId, type, config };
    charts.push(chartEntry);

    function render() {
      switch (type) {
        case 'line': drawLineChart(canvas, config); break;
        case 'bar': drawBarChart(canvas, config); break;
        case 'pie': drawPieChart(canvas, config, false); break;
        case 'doughnut': drawPieChart(canvas, config, true); break;
        case 'area': drawAreaChart(canvas, config); break;
        case 'progress': drawProgressChart(canvas, config); break;
      }
    }

    render();

    // Re-render on theme change
    window.addEventListener('themechange', render);

    // Re-render on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(render, 200);
    });

    return { render };
  }

  return { create };
})();
