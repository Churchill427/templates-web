/* ============================================================
   DENT — Canvas Chart Engine
   Custom chart rendering: Bar, Doughnut, Line, Area,
   Horizontal Bar, Radar, Stacked Bar
   ============================================================ */

(function () {
  'use strict';

  const COLORS = {
    primary: '#0B4F6C',
    primaryLight: 'rgba(11, 79, 108, 0.2)',
    secondary: '#20BF55',
    secondaryLight: 'rgba(32, 191, 85, 0.2)',
    accent: '#F7B538',
    accentLight: 'rgba(247, 181, 56, 0.2)',
    extra1: '#6366F1',
    extra2: '#EC4899',
    text: '#475569',
    grid: '#E2E8F0',
    gridDark: '#334155',
    white: '#FFFFFF',
  };

  function getGridColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? COLORS.gridDark : COLORS.grid;
  }

  function getTextColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? '#94A3B8' : COLORS.text;
  }

  // ============================================================
  // BASE CHART CLASS
  // ============================================================
  class Chart {
    constructor(canvasId, config) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.config = config;
      this.animProgress = 0;
      this.animated = false;
      this.resize();
      this.observe();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      const parent = this.canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = Math.min(280, w * 0.6);
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.scale(dpr, dpr);
      this.w = w;
      this.h = h;
      if (this.animated) this.draw(1);
    }

    observe() {
      if (!this.canvas) return;
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !this.animated) {
          this.animate();
          obs.unobserve(this.canvas);
        }
      }, { threshold: 0.3 });
      obs.observe(this.canvas);
    }

    animate() {
      this.animated = true;
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        this.animProgress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - this.animProgress, 3);
        this.clear();
        this.draw(eased);
        if (this.animProgress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    clear() {
      this.ctx.clearRect(0, 0, this.w, this.h);
    }

    draw() { /* Override */ }
  }

  // ============================================================
  // BAR CHART
  // ============================================================
  class BarChart extends Chart {
    draw(progress) {
      const { ctx, w, h, config } = this;
      const { labels, data, colors, title } = config;
      const padding = { top: 30, right: 20, bottom: 40, left: 50 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;
      const maxVal = Math.max(...data) * 1.15;
      const barW = (chartW / data.length) * 0.6;
      const gap = (chartW / data.length) * 0.4;

      // Grid lines
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();
        // Y-axis labels
        ctx.fillStyle = getTextColor();
        ctx.font = '11px "Open Sans"';
        ctx.textAlign = 'right';
        const val = Math.round(maxVal - (maxVal / 4) * i);
        ctx.fillText(val, padding.left - 8, y + 4);
      }

      // Bars
      data.forEach((val, i) => {
        const barH = (val / maxVal) * chartH * progress;
        const x = padding.left + (chartW / data.length) * i + gap / 2;
        const y = padding.top + chartH - barH;
        const color = colors ? colors[i % colors.length] : COLORS.primary;

        // Bar with rounded top
        ctx.fillStyle = color;
        ctx.beginPath();
        const r = Math.min(4, barW / 2);
        ctx.moveTo(x, y + r);
        ctx.arcTo(x, y, x + barW, y, r);
        ctx.arcTo(x + barW, y, x + barW, y + barH, r);
        ctx.lineTo(x + barW, padding.top + chartH);
        ctx.lineTo(x, padding.top + chartH);
        ctx.closePath();
        ctx.fill();

        // X-axis label
        ctx.fillStyle = getTextColor();
        ctx.font = '11px "Open Sans"';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barW / 2, h - padding.bottom + 20);
      });
    }
  }

  // ============================================================
  // DOUGHNUT CHART
  // ============================================================
  class DoughnutChart extends Chart {
    draw(progress) {
      const { ctx, w, h, config } = this;
      const { labels, data, colors } = config;
      const total = data.reduce((a, b) => a + b, 0);
      const cx = w * 0.4;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 20;
      const inner = radius * 0.55;
      let startAngle = -Math.PI / 2;

      data.forEach((val, i) => {
        const sliceAngle = (val / total) * Math.PI * 2 * progress;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.arc(cx, cy, inner, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        startAngle += sliceAngle;
      });

      // Center text
      ctx.fillStyle = getTextColor();
      ctx.font = 'bold 20px "Montserrat"';
      ctx.textAlign = 'center';
      ctx.fillText(total, cx, cy + 2);
      ctx.font = '11px "Open Sans"';
      ctx.fillText('Total', cx, cy + 18);

      // Legend
      const legendX = w * 0.7;
      let legendY = 30;
      ctx.textAlign = 'left';
      data.forEach((val, i) => {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(legendX, legendY - 8, 12, 12);
        ctx.fillStyle = getTextColor();
        ctx.font = '12px "Open Sans"';
        ctx.fillText(`${labels[i]} (${Math.round(val / total * 100)}%)`, legendX + 18, legendY + 2);
        legendY += 24;
      });
    }
  }

  // ============================================================
  // LINE CHART
  // ============================================================
  class LineChart extends Chart {
    draw(progress) {
      const { ctx, w, h, config } = this;
      const { labels, data, color, fillColor } = config;
      const padding = { top: 30, right: 20, bottom: 40, left: 50 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;
      const maxVal = Math.max(...data) * 1.15;

      // Grid
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();
        ctx.fillStyle = getTextColor();
        ctx.font = '11px "Open Sans"';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
      }

      // Calculate points
      const points = data.map((val, i) => ({
        x: padding.left + (chartW / (data.length - 1)) * i,
        y: padding.top + chartH - (val / maxVal) * chartH * progress
      }));

      // Fill area
      if (fillColor) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartH);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      // Line
      ctx.beginPath();
      ctx.strokeStyle = color || COLORS.secondary;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Dots
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color || COLORS.secondary;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.white;
        ctx.fill();
      });

      // X-axis labels
      ctx.fillStyle = getTextColor();
      ctx.font = '11px "Open Sans"';
      ctx.textAlign = 'center';
      labels.forEach((lbl, i) => {
        const x = padding.left + (chartW / (labels.length - 1)) * i;
        ctx.fillText(lbl, x, h - padding.bottom + 20);
      });
    }
  }

  // ============================================================
  // AREA CHART (extends Line with fill)
  // ============================================================
  class AreaChart extends LineChart {
    constructor(canvasId, config) {
      config.fillColor = config.fillColor || COLORS.accentLight;
      super(canvasId, config);
    }
  }

  // ============================================================
  // HORIZONTAL BAR CHART
  // ============================================================
  class HorizontalBarChart extends Chart {
    draw(progress) {
      const { ctx, w, h, config } = this;
      const { labels, datasets } = config;
      const padding = { top: 20, right: 20, bottom: 20, left: 100 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;
      const barH = (chartH / labels.length) * 0.4;
      const groupH = chartH / labels.length;
      const allData = datasets.flatMap(d => d.data);
      const maxVal = Math.max(...allData) * 1.15;

      labels.forEach((lbl, i) => {
        const groupY = padding.top + groupH * i;

        // Label
        ctx.fillStyle = getTextColor();
        ctx.font = '12px "Open Sans"';
        ctx.textAlign = 'right';
        ctx.fillText(lbl, padding.left - 10, groupY + groupH / 2 + 4);

        // Bars per dataset
        datasets.forEach((ds, di) => {
          const barY = groupY + (groupH - barH * datasets.length) / 2 + barH * di;
          const barW = (ds.data[i] / maxVal) * chartW * progress;
          ctx.fillStyle = ds.color;
          ctx.beginPath();
          const r = 3;
          ctx.moveTo(padding.left, barY);
          ctx.lineTo(padding.left + barW - r, barY);
          ctx.arcTo(padding.left + barW, barY, padding.left + barW, barY + barH, r);
          ctx.arcTo(padding.left + barW, barY + barH, padding.left, barY + barH, r);
          ctx.lineTo(padding.left, barY + barH);
          ctx.closePath();
          ctx.fill();

          // Value
          ctx.fillStyle = getTextColor();
          ctx.font = '10px "Open Sans"';
          ctx.textAlign = 'left';
          ctx.fillText(ds.data[i], padding.left + barW + 6, barY + barH / 2 + 4);
        });
      });

      // Legend
      let lx = padding.left;
      datasets.forEach(ds => {
        ctx.fillStyle = ds.color;
        ctx.fillRect(lx, h - 12, 10, 10);
        ctx.fillStyle = getTextColor();
        ctx.font = '10px "Open Sans"';
        ctx.textAlign = 'left';
        ctx.fillText(ds.label, lx + 14, h - 3);
        lx += ctx.measureText(ds.label).width + 30;
      });
    }
  }

  // ============================================================
  // RADAR CHART
  // ============================================================
  class RadarChart extends Chart {
    draw(progress) {
      const { ctx, w, h, config } = this;
      const { labels, data, color, fillColor } = config;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 40;
      const n = labels.length;
      const angleStep = (Math.PI * 2) / n;

      // Grid circles
      for (let r = 1; r <= 5; r++) {
        const cr = (radius / 5) * r;
        ctx.beginPath();
        ctx.strokeStyle = getGridColor();
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= n; i++) {
          const angle = angleStep * i - Math.PI / 2;
          const x = cx + Math.cos(angle) * cr;
          const y = cy + Math.sin(angle) * cr;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Axes
      for (let i = 0; i < n; i++) {
        const angle = angleStep * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.strokeStyle = getGridColor();
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Labels
        const labelR = radius + 18;
        const lx = cx + Math.cos(angle) * labelR;
        const ly = cy + Math.sin(angle) * labelR;
        ctx.fillStyle = getTextColor();
        ctx.font = '11px "Open Sans"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], lx, ly);
      }

      // Data polygon
      ctx.beginPath();
      data.forEach((val, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const r = (val / 100) * radius * progress;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = fillColor || COLORS.primaryLight;
      ctx.fill();
      ctx.strokeStyle = color || COLORS.primary;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dots
      data.forEach((val, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const r = (val / 100) * radius * progress;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 4, 0, Math.PI * 2);
        ctx.fillStyle = color || COLORS.primary;
        ctx.fill();
      });
    }
  }

  // ============================================================
  // STACKED BAR CHART
  // ============================================================
  class StackedBarChart extends Chart {
    draw(progress) {
      const { ctx, w, h, config } = this;
      const { labels, datasets } = config;
      const padding = { top: 30, right: 20, bottom: 40, left: 50 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      // Calculate max stacked value
      const maxVal = labels.reduce((max, _, i) => {
        const sum = datasets.reduce((s, ds) => s + ds.data[i], 0);
        return Math.max(max, sum);
      }, 0) * 1.15;

      const barW = (chartW / labels.length) * 0.5;

      // Grid
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();
        ctx.fillStyle = getTextColor();
        ctx.font = '11px "Open Sans"';
        ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
      }

      // Stacked bars
      labels.forEach((lbl, i) => {
        const x = padding.left + (chartW / labels.length) * i + (chartW / labels.length - barW) / 2;
        let cumH = 0;

        datasets.forEach((ds) => {
          const segH = (ds.data[i] / maxVal) * chartH * progress;
          const y = padding.top + chartH - cumH - segH;
          ctx.fillStyle = ds.color;
          ctx.fillRect(x, y, barW, segH);
          cumH += segH;
        });

        // X label
        ctx.fillStyle = getTextColor();
        ctx.font = '11px "Open Sans"';
        ctx.textAlign = 'center';
        ctx.fillText(lbl, x + barW / 2, h - padding.bottom + 20);
      });

      // Legend
      let lx = padding.left;
      const ly = 12;
      datasets.forEach(ds => {
        ctx.fillStyle = ds.color;
        ctx.fillRect(lx, ly, 10, 10);
        ctx.fillStyle = getTextColor();
        ctx.font = '10px "Open Sans"';
        ctx.textAlign = 'left';
        ctx.fillText(ds.label, lx + 14, ly + 9);
        lx += ctx.measureText(ds.label).width + 30;
      });
    }
  }

  // ============================================================
  // EXPOSE GLOBALLY
  // ============================================================
  window.DentCharts = {
    BarChart,
    DoughnutChart,
    LineChart,
    AreaChart,
    HorizontalBarChart,
    RadarChart,
    StackedBarChart,
    COLORS
  };

})();
