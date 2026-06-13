/* ============================================================
   BRAKE — Vanilla JS Chart Library
   plugins/charts.js
   Line, Bar, Doughnut, Area, Pie, Horizontal Bar charts
   ============================================================ */

(function () {
  'use strict';

  const isDark = () => document.body.classList.contains('dark-mode');

  const Colors = {
    primary: '#C41E3A',
    primaryLight: 'rgba(196, 30, 58, 0.2)',
    accent: '#FF6B35',
    accentLight: 'rgba(255, 107, 53, 0.2)',
    success: '#22C55E',
    successLight: 'rgba(34, 197, 94, 0.2)',
    info: '#3B82F6',
    infoLight: 'rgba(59, 130, 246, 0.2)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.2)',
    text: () => isDark() ? '#F0F0F0' : '#1A1A1A',
    textSecondary: () => isDark() ? '#808080' : '#888888',
    grid: () => isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    bg: () => isDark() ? '#242424' : '#FFFFFF',
    palette: ['#C41E3A', '#FF6B35', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']
  };

  /* ---- Helper: Tooltip ---- */
  class ChartTooltip {
    constructor(canvas) {
      this.canvas = canvas;
      this.el = document.createElement('div');
      this.el.style.cssText = `
        position: fixed; pointer-events: none; z-index: 1000;
        background: ${isDark() ? '#333' : '#fff'}; color: ${isDark() ? '#f0f0f0' : '#1a1a1a'};
        padding: 8px 12px; border-radius: 8px; font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0;
        transition: opacity 0.15s ease; font-family: 'Roboto', sans-serif;
        white-space: nowrap;
      `;
      document.body.appendChild(this.el);
    }

    show(x, y, html) {
      this.el.innerHTML = html;
      this.el.style.opacity = '1';
      this.el.style.background = isDark() ? '#333' : '#fff';
      this.el.style.color = isDark() ? '#f0f0f0' : '#1a1a1a';

      const rect = this.el.getBoundingClientRect();
      let left = x + 12;
      let top = y - rect.height / 2;

      if (left + rect.width > window.innerWidth) left = x - rect.width - 12;
      if (top < 0) top = 4;
      if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height - 4;

      this.el.style.left = left + 'px';
      this.el.style.top = top + 'px';
    }

    hide() {
      this.el.style.opacity = '0';
    }

    destroy() {
      this.el.remove();
    }
  }

  /* ---- Base Chart ---- */
  class BaseChart {
    constructor(canvasId, options = {}) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.options = options;
      this.tooltip = new ChartTooltip(this.canvas);
      this.animated = false;
      this.animationProgress = 0;
      this.dpr = window.devicePixelRatio || 1;

      this.resize();
      window.addEventListener('resize', () => {
        this.resize();
        this.draw();
      });

      document.addEventListener('themeChanged', () => this.draw());

      // Intersection observer for draw-in animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animated) {
            this.animate();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(this.canvas);
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height || 250;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.ctx.scale(this.dpr, this.dpr);
    }

    animate() {
      this.resize();
      this.animated = true;
      const duration = 800;
      const start = performance.now();

      const frame = (now) => {
        const elapsed = now - start;
        this.animationProgress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        this.animationProgress = 1 - Math.pow(1 - this.animationProgress, 3);
        this.draw();
        if (elapsed < duration) {
          requestAnimationFrame(frame);
        }
      };
      requestAnimationFrame(frame);
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw() {
      // Override in subclasses
    }
  }

  /* ============================================================
     LINE CHART
     ============================================================ */
  class LineChart extends BaseChart {
    constructor(canvasId, data, options = {}) {
      super(canvasId, options);
      this.data = data; // { labels: [], datasets: [{ label, data, color }] }
      this.padding = { top: 20, right: 20, bottom: 40, left: 50 };
      this.hoveredPoint = null;

      this.canvas?.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas?.addEventListener('mouseleave', () => {
        this.hoveredPoint = null;
        this.tooltip.hide();
        this.draw();
      });
    }

    draw() {
      if (!this.ctx) return;
      this.clear();
      const { top, right, bottom, left } = this.padding;
      const chartW = this.width - left - right;
      const chartH = this.height - top - bottom;

      // Find min/max
      let allVals = this.data.datasets.flatMap(d => d.data);
      let maxVal = Math.max(...allVals) * 1.1;
      let minVal = Math.min(0, Math.min(...allVals));

      // Grid lines
      const gridLines = 5;
      this.ctx.strokeStyle = Colors.grid();
      this.ctx.lineWidth = 1;
      this.ctx.font = `12px 'Roboto', sans-serif`;
      this.ctx.fillStyle = Colors.textSecondary();
      this.ctx.textAlign = 'right';

      for (let i = 0; i <= gridLines; i++) {
        const y = top + (chartH / gridLines) * i;
        const val = maxVal - ((maxVal - minVal) / gridLines) * i;

        this.ctx.beginPath();
        this.ctx.setLineDash([4, 4]);
        this.ctx.moveTo(left, y);
        this.ctx.lineTo(left + chartW, y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillText(Math.round(val).toString(), left - 8, y + 4);
      }

      // X labels
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = Colors.textSecondary();
      const labelCount = this.data.labels.length;
      for (let i = 0; i < labelCount; i++) {
        const x = left + (chartW / (labelCount - 1)) * i;
        this.ctx.fillText(this.data.labels[i], x, this.height - bottom + 20);
      }

      // Draw datasets
      this.data.datasets.forEach((dataset, di) => {
        const points = dataset.data.map((val, i) => ({
          x: left + (chartW / (labelCount - 1)) * i,
          y: top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH,
          val: val,
          label: this.data.labels[i]
        }));

        // Animated points
        const animatedPoints = points.map(p => ({
          ...p,
          y: top + chartH - ((p.y - (top + chartH)) * this.animationProgress * -1)
        }));

        // Line
        this.ctx.beginPath();
        this.ctx.strokeStyle = dataset.color || Colors.palette[di];
        this.ctx.lineWidth = 2.5;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';

        animatedPoints.forEach((p, i) => {
          if (i === 0) this.ctx.moveTo(p.x, p.y);
          else this.ctx.lineTo(p.x, p.y);
        });
        this.ctx.stroke();

        // Dots
        animatedPoints.forEach((p, i) => {
          const isHovered = this.hoveredPoint &&
            this.hoveredPoint.datasetIndex === di &&
            this.hoveredPoint.pointIndex === i;

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, isHovered ? 6 : 4, 0, Math.PI * 2);
          this.ctx.fillStyle = dataset.color || Colors.palette[di];
          this.ctx.fill();
          this.ctx.strokeStyle = Colors.bg();
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
        });
      });
    }

    onMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const { top, right, bottom, left } = this.padding;
      const chartW = this.width - left - right;
      const chartH = this.height - top - bottom;
      const labelCount = this.data.labels.length;

      let allVals = this.data.datasets.flatMap(d => d.data);
      let maxVal = Math.max(...allVals) * 1.1;
      let minVal = Math.min(0, Math.min(...allVals));

      let closest = null;
      let minDist = Infinity;

      this.data.datasets.forEach((dataset, di) => {
        dataset.data.forEach((val, i) => {
          const px = left + (chartW / (labelCount - 1)) * i;
          const py = top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
          const dist = Math.sqrt(Math.pow(mx - px, 2) + Math.pow(my - py, 2));
          if (dist < minDist && dist < 30) {
            minDist = dist;
            closest = { datasetIndex: di, pointIndex: i, x: px, y: py, val, label: this.data.labels[i], dsLabel: dataset.label };
          }
        });
      });

      this.hoveredPoint = closest;
      if (closest) {
        this.tooltip.show(e.clientX, e.clientY,
          `<strong>${closest.dsLabel || ''}</strong><br>${closest.label}: <strong>${closest.val}</strong>`);
      } else {
        this.tooltip.hide();
      }
      this.draw();
    }
  }

  /* ============================================================
     BAR CHART
     ============================================================ */
  class BarChart extends BaseChart {
    constructor(canvasId, data, options = {}) {
      super(canvasId, options);
      this.data = data; // { labels: [], datasets: [{ label, data, color }] }
      this.padding = { top: 20, right: 20, bottom: 40, left: 50 };
      this.hoveredBar = null;

      this.canvas?.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas?.addEventListener('mouseleave', () => {
        this.hoveredBar = null;
        this.tooltip.hide();
        this.draw();
      });
    }

    draw() {
      if (!this.ctx) return;
      this.clear();
      const { top, right, bottom, left } = this.padding;
      const chartW = this.width - left - right;
      const chartH = this.height - top - bottom;
      const dsCount = this.data.datasets.length;
      const labelCount = this.data.labels.length;
      const groupWidth = chartW / labelCount;
      const barWidth = (groupWidth * 0.6) / dsCount;
      const gap = groupWidth * 0.4;

      let allVals = this.data.datasets.flatMap(d => d.data);
      let maxVal = Math.max(...allVals) * 1.15;

      // Grid
      const gridLines = 5;
      this.ctx.font = `12px 'Roboto', sans-serif`;
      for (let i = 0; i <= gridLines; i++) {
        const y = top + (chartH / gridLines) * i;
        const val = maxVal - (maxVal / gridLines) * i;
        this.ctx.strokeStyle = Colors.grid();
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(left, y);
        this.ctx.lineTo(left + chartW, y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = Colors.textSecondary();
        this.ctx.textAlign = 'right';
        this.ctx.fillText(Math.round(val).toString(), left - 8, y + 4);
      }

      // X labels
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = Colors.textSecondary();
      for (let i = 0; i < labelCount; i++) {
        const x = left + groupWidth * i + groupWidth / 2;
        this.ctx.fillText(this.data.labels[i], x, this.height - bottom + 20);
      }

      // Bars
      this.bars = [];
      this.data.datasets.forEach((dataset, di) => {
        dataset.data.forEach((val, i) => {
          const barH = (val / maxVal) * chartH * this.animationProgress;
          const x = left + groupWidth * i + gap / 2 + barWidth * di;
          const y = top + chartH - barH;

          const isHovered = this.hoveredBar &&
            this.hoveredBar.di === di && this.hoveredBar.i === i;

          this.ctx.fillStyle = isHovered
            ? (dataset.hoverColor || Colors.palette[di + 1] || Colors.accent)
            : (dataset.color || Colors.palette[di]);
          this.ctx.beginPath();
          this.roundedRect(x, y, barWidth, barH, 4);
          this.ctx.fill();

          this.bars.push({ x, y, w: barWidth, h: barH, val, di, i, label: this.data.labels[i], dsLabel: dataset.label });
        });
      });
    }

    roundedRect(x, y, w, h, r) {
      if (h < r * 2) r = h / 2;
      if (r < 0) r = 0;
      this.ctx.moveTo(x + r, y);
      this.ctx.lineTo(x + w - r, y);
      this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      this.ctx.lineTo(x + w, y + h);
      this.ctx.lineTo(x, y + h);
      this.ctx.lineTo(x, y + r);
      this.ctx.quadraticCurveTo(x, y, x + r, y);
    }

    onMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      for (const bar of this.bars || []) {
        if (mx >= bar.x && mx <= bar.x + bar.w && my >= bar.y && my <= bar.y + bar.h) {
          found = bar;
          break;
        }
      }

      this.hoveredBar = found;
      if (found) {
        this.tooltip.show(e.clientX, e.clientY,
          `<strong>${found.dsLabel || ''}</strong><br>${found.label}: <strong>${found.val}</strong>`);
      } else {
        this.tooltip.hide();
      }
      this.draw();
    }
  }

  /* ============================================================
     DOUGHNUT / PIE CHART
     ============================================================ */
  class DoughnutChart extends BaseChart {
    constructor(canvasId, data, options = {}) {
      super(canvasId, options);
      this.data = data; // { labels: [], values: [], colors: [] }
      this.isPie = options.isPie || false;
      this.hoveredSlice = null;

      this.canvas?.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas?.addEventListener('mouseleave', () => {
        this.hoveredSlice = null;
        this.tooltip.hide();
        this.draw();
      });
    }

    draw() {
      if (!this.ctx) return;
      this.clear();
      const cx = this.width / 2;
      const cy = this.height / 2;
      const radius = Math.min(cx, cy) - 30;
      const innerRadius = this.isPie ? 0 : radius * 0.55;
      const total = this.data.values.reduce((a, b) => a + b, 0);

      let startAngle = -Math.PI / 2;
      this.slices = [];

      this.data.values.forEach((val, i) => {
        const sliceAngle = (val / total) * Math.PI * 2 * this.animationProgress;
        const endAngle = startAngle + sliceAngle;
        const isHovered = this.hoveredSlice === i;
        const offset = isHovered ? 6 : 0;
        const midAngle = startAngle + sliceAngle / 2;
        const ox = Math.cos(midAngle) * offset;
        const oy = Math.sin(midAngle) * offset;

        this.ctx.beginPath();
        this.ctx.arc(cx + ox, cy + oy, radius, startAngle, endAngle);
        if (!this.isPie) {
          this.ctx.arc(cx + ox, cy + oy, innerRadius, endAngle, startAngle, true);
        } else {
          this.ctx.lineTo(cx + ox, cy + oy);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = this.data.colors?.[i] || Colors.palette[i % Colors.palette.length];
        this.ctx.fill();

        this.slices.push({ startAngle, endAngle, val, i });
        startAngle = endAngle;
      });

      // Center text for doughnut
      if (!this.isPie && this.animationProgress >= 1) {
        this.ctx.fillStyle = Colors.text();
        this.ctx.font = `bold 20px 'Inter', sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(total.toLocaleString(), cx, cy - 6);
        this.ctx.font = `12px 'Roboto', sans-serif`;
        this.ctx.fillStyle = Colors.textSecondary();
        this.ctx.fillText('Total', cx, cy + 14);
      }

      // Legend
      const legendY = this.height - 16;
      const legendWidth = this.data.labels.length * 100;
      let legendX = (this.width - legendWidth) / 2;
      if (legendX < 10) legendX = 10;

      this.ctx.font = `11px 'Roboto', sans-serif`;
      this.ctx.textAlign = 'left';
      this.data.labels.forEach((label, i) => {
        const x = legendX + i * (this.width / this.data.labels.length);
        this.ctx.fillStyle = this.data.colors?.[i] || Colors.palette[i % Colors.palette.length];
        this.ctx.fillRect(x, legendY - 5, 10, 10);
        this.ctx.fillStyle = Colors.textSecondary();
        this.ctx.fillText(label, x + 14, legendY + 4);
      });
    }

    onMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = this.width / 2;
      const cy = this.height / 2;
      const radius = Math.min(cx, cy) - 30;
      const innerRadius = this.isPie ? 0 : radius * 0.55;

      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > radius || (!this.isPie && dist < innerRadius)) {
        this.hoveredSlice = null;
        this.tooltip.hide();
        this.draw();
        return;
      }

      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += Math.PI * 2;

      let found = null;
      for (const slice of this.slices || []) {
        let sa = slice.startAngle;
        let ea = slice.endAngle;
        if (angle >= sa && angle < ea) {
          found = slice.i;
          break;
        }
      }

      this.hoveredSlice = found;
      if (found !== null) {
        const total = this.data.values.reduce((a, b) => a + b, 0);
        const pct = ((this.data.values[found] / total) * 100).toFixed(1);
        this.tooltip.show(e.clientX, e.clientY,
          `<strong>${this.data.labels[found]}</strong><br>${this.data.values[found]} (${pct}%)`);
      } else {
        this.tooltip.hide();
      }
      this.draw();
    }
  }

  /* ============================================================
     AREA CHART
     ============================================================ */
  class AreaChart extends BaseChart {
    constructor(canvasId, data, options = {}) {
      super(canvasId, options);
      this.data = data; // { labels: [], datasets: [{ label, data, color, fillColor }] }
      this.padding = { top: 20, right: 20, bottom: 40, left: 50 };
      this.hoveredPoint = null;

      this.canvas?.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas?.addEventListener('mouseleave', () => {
        this.hoveredPoint = null;
        this.tooltip.hide();
        this.draw();
      });
    }

    draw() {
      if (!this.ctx) return;
      this.clear();
      const { top, right, bottom, left } = this.padding;
      const chartW = this.width - left - right;
      const chartH = this.height - top - bottom;
      const labelCount = this.data.labels.length;

      let allVals = this.data.datasets.flatMap(d => d.data);
      let maxVal = Math.max(...allVals) * 1.1;
      let minVal = 0;

      // Grid
      const gridLines = 5;
      this.ctx.font = `12px 'Roboto', sans-serif`;
      for (let i = 0; i <= gridLines; i++) {
        const y = top + (chartH / gridLines) * i;
        const val = maxVal - (maxVal / gridLines) * i;
        this.ctx.strokeStyle = Colors.grid();
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(left, y);
        this.ctx.lineTo(left + chartW, y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.fillStyle = Colors.textSecondary();
        this.ctx.textAlign = 'right';
        this.ctx.fillText(Math.round(val).toString(), left - 8, y + 4);
      }

      // X labels
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = Colors.textSecondary();
      for (let i = 0; i < labelCount; i++) {
        const x = left + (chartW / (labelCount - 1)) * i;
        this.ctx.fillText(this.data.labels[i], x, this.height - bottom + 20);
      }

      // Draw datasets
      this.data.datasets.forEach((dataset, di) => {
        const points = dataset.data.map((val, i) => ({
          x: left + (chartW / (labelCount - 1)) * i,
          y: top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH * this.animationProgress
        }));

        // Fill area
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, top + chartH);
        points.forEach(p => this.ctx.lineTo(p.x, p.y));
        this.ctx.lineTo(points[points.length - 1].x, top + chartH);
        this.ctx.closePath();

        const gradient = this.ctx.createLinearGradient(0, top, 0, top + chartH);
        const color = dataset.color || Colors.palette[di];
        gradient.addColorStop(0, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ', 0.02)').replace('rgb', 'rgba'));

        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          const gradient2 = this.ctx.createLinearGradient(0, top, 0, top + chartH);
          gradient2.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
          gradient2.addColorStop(1, `rgba(${r},${g},${b},0.02)`);
          this.ctx.fillStyle = gradient2;
        } else {
          this.ctx.fillStyle = gradient;
        }
        this.ctx.fill();

        // Line
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2.5;
        this.ctx.lineJoin = 'round';
        points.forEach((p, i) => {
          if (i === 0) this.ctx.moveTo(p.x, p.y);
          else this.ctx.lineTo(p.x, p.y);
        });
        this.ctx.stroke();

        // Dots
        points.forEach((p, i) => {
          const isHovered = this.hoveredPoint && this.hoveredPoint.di === di && this.hoveredPoint.i === i;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, isHovered ? 6 : 3, 0, Math.PI * 2);
          this.ctx.fillStyle = color;
          this.ctx.fill();
          if (isHovered) {
            this.ctx.strokeStyle = Colors.bg();
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
          }
        });
      });
    }

    onMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const { top, right, bottom, left } = this.padding;
      const chartW = this.width - left - right;
      const chartH = this.height - top - bottom;
      const labelCount = this.data.labels.length;
      let allVals = this.data.datasets.flatMap(d => d.data);
      let maxVal = Math.max(...allVals) * 1.1;

      let closest = null;
      let minDist = Infinity;

      this.data.datasets.forEach((dataset, di) => {
        dataset.data.forEach((val, i) => {
          const px = left + (chartW / (labelCount - 1)) * i;
          const py = top + chartH - (val / maxVal) * chartH;
          const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
          if (dist < minDist && dist < 30) {
            minDist = dist;
            closest = { di, i, val, label: this.data.labels[i], dsLabel: dataset.label };
          }
        });
      });

      this.hoveredPoint = closest;
      if (closest) {
        this.tooltip.show(e.clientX, e.clientY,
          `<strong>${closest.dsLabel || ''}</strong><br>${closest.label}: <strong>${closest.val}</strong>`);
      } else {
        this.tooltip.hide();
      }
      this.draw();
    }
  }

  /* ============================================================
     HORIZONTAL BAR CHART
     ============================================================ */
  class HorizontalBarChart extends BaseChart {
    constructor(canvasId, data, options = {}) {
      super(canvasId, options);
      this.data = data; // { labels: [], values: [], colors: [] }
      this.padding = { top: 10, right: 30, bottom: 10, left: 100 };
      this.hoveredBar = null;

      this.canvas?.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.canvas?.addEventListener('mouseleave', () => {
        this.hoveredBar = null;
        this.tooltip.hide();
        this.draw();
      });
    }

    draw() {
      if (!this.ctx) return;
      this.clear();
      const { top, right, bottom, left } = this.padding;
      const chartW = this.width - left - right;
      const chartH = this.height - top - bottom;
      const barCount = this.data.labels.length;
      const barHeight = (chartH / barCount) * 0.6;
      const barGap = (chartH / barCount) * 0.4;
      const maxVal = Math.max(...this.data.values) * 1.1;

      this.bars = [];

      this.ctx.font = `12px 'Roboto', sans-serif`;
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';

      this.data.labels.forEach((label, i) => {
        const y = top + (chartH / barCount) * i + barGap / 2;
        const barW = (this.data.values[i] / maxVal) * chartW * this.animationProgress;
        const color = this.data.colors?.[i] || Colors.palette[i % Colors.palette.length];
        const isHovered = this.hoveredBar === i;

        // Label
        this.ctx.fillStyle = Colors.textSecondary();
        this.ctx.fillText(label, left - 8, y + barHeight / 2);

        // Bar
        this.ctx.beginPath();
        this.ctx.fillStyle = isHovered ? Colors.accent : color;
        this.roundedRect(left, y, barW, barHeight, 4);
        this.ctx.fill();

        // Value text
        if (barW > 30) {
          this.ctx.fillStyle = '#fff';
          this.ctx.textAlign = 'right';
          this.ctx.font = `bold 12px 'Inter', sans-serif`;
          this.ctx.fillText(this.data.values[i].toString(), left + barW - 8, y + barHeight / 2);
          this.ctx.font = `12px 'Roboto', sans-serif`;
        }

        this.bars.push({ x: left, y, w: barW, h: barHeight, val: this.data.values[i], label, i });
      });
    }

    roundedRect(x, y, w, h, r) {
      if (w < r * 2) r = w / 2;
      if (r < 0) r = 0;
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + w - r, y);
      this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      this.ctx.lineTo(x + w, y + h - r);
      this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.ctx.lineTo(x, y + h);
      this.ctx.lineTo(x, y);
    }

    onMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      for (const bar of this.bars || []) {
        if (mx >= bar.x && mx <= bar.x + bar.w && my >= bar.y && my <= bar.y + bar.h) {
          found = bar.i;
          break;
        }
      }

      this.hoveredBar = found;
      if (found !== null) {
        this.tooltip.show(e.clientX, e.clientY,
          `<strong>${this.data.labels[found]}</strong>: ${this.data.values[found]}`);
      } else {
        this.tooltip.hide();
      }
      this.draw();
    }
  }

  /* ---- Expose globally ---- */
  window.BrakeCharts = {
    LineChart,
    BarChart,
    DoughnutChart,
    AreaChart,
    HorizontalBarChart,
    Colors
  };

})();
