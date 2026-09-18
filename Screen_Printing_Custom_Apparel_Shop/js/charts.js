/* ═══════════════════════════════════════════════════════════════════
   PRNT — Hand-Rolled Canvas Charts
   8 chart types for Admin + User dashboards
   Line/Area, Bar (compact), Doughnut, Radar, Progress Ring,
   Horizontal Bar, Polar/Doughnut variant
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  window.PRNT = window.PRNT || {};

  /* ── Helpers ─────────────────────────────────────────────────────── */
  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      primary: '#16233F',
      secondary: '#17A2B8',
      accent: '#F4A100',
      text: isDark ? '#D7DDE6' : '#2B3445',
      textMuted: isDark ? '#6B7C8E' : '#8492A6',
      grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      bg: isDark ? '#22303F' : '#FFFFFF',
      cyan: '#17A2B8',
      cyanLight: 'rgba(23,162,184,0.15)',
      amber: '#F4A100',
      amberLight: 'rgba(244,161,0,0.15)',
      navy: '#16233F',
      navyLight: 'rgba(22,35,63,0.12)',
      success: '#28A745',
      danger: '#DC3545',
      purple: '#7C3AED',
      pink: '#EC4899',
    };
  }

  function resizeCanvas(canvas) {
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (canvas.getAttribute('data-height') ? parseInt(canvas.getAttribute('data-height')) : 250) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (canvas.getAttribute('data-height') ? parseInt(canvas.getAttribute('data-height')) : 250) + 'px';
    return { ctx: canvas.getContext('2d'), dpr, w: canvas.width, h: canvas.height };
  }

  /* ── LINE / AREA CHART ───────────────────────────────────────────── */
  window.PRNT.lineChart = function (canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    function draw() {
      const { ctx, dpr, w, h } = resizeCanvas(canvas);
      const colors = getThemeColors();
      const padding = { top: 20 * dpr, right: 20 * dpr, bottom: 40 * dpr, left: 50 * dpr };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      ctx.clearRect(0, 0, w, h);

      const maxVal = Math.max(...data.values) * 1.15;
      const minVal = 0;
      const range = maxVal - minVal;
      const stepX = chartW / (data.values.length - 1);

      // Grid lines
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1 * dpr;
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const y = padding.top + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        // Labels
        const val = Math.round(maxVal - (range / gridLines) * i);
        ctx.fillStyle = colors.textMuted;
        ctx.font = `${11 * dpr}px Inter, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(val.toLocaleString(), padding.left - 8 * dpr, y + 4 * dpr);
      }

      // X labels
      ctx.textAlign = 'center';
      data.labels.forEach((label, i) => {
        const x = padding.left + stepX * i;
        ctx.fillStyle = colors.textMuted;
        ctx.fillText(label, x, h - 10 * dpr);
      });

      // Area gradient
      const points = data.values.map((val, i) => ({
        x: padding.left + stepX * i,
        y: padding.top + chartH - ((val - minVal) / range) * chartH
      }));

      if (options.area !== false) {
        const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
        gradient.addColorStop(0, 'rgba(23, 162, 184, 0.25)');
        gradient.addColorStop(1, 'rgba(23, 162, 184, 0.02)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, h - padding.bottom);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Line
      ctx.beginPath();
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 2.5 * dpr;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Dots
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 2 * dpr;
        ctx.stroke();
      });
    }

    draw();
    window.addEventListener('resize', draw);

    // Redraw on theme change
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  };

  /* ── BAR CHART (Compact) ─────────────────────────────────────────── */
  window.PRNT.barChart = function (canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    function draw() {
      const { ctx, dpr, w, h } = resizeCanvas(canvas);
      const colors = getThemeColors();
      const padding = { top: 20 * dpr, right: 20 * dpr, bottom: 40 * dpr, left: 50 * dpr };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      ctx.clearRect(0, 0, w, h);

      const maxVal = Math.max(...data.values) * 1.15;
      const barCount = data.values.length;
      const barGap = chartW * 0.15 / barCount;
      const barWidth = (chartW - barGap * (barCount + 1)) / barCount;

      const barColors = [colors.secondary, colors.accent, colors.primary, colors.success, colors.purple, colors.pink];

      // Grid
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1 * dpr;
      const gridLines = 4;
      for (let i = 0; i <= gridLines; i++) {
        const y = padding.top + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        const val = Math.round(maxVal - (maxVal / gridLines) * i);
        ctx.fillStyle = colors.textMuted;
        ctx.font = `${11 * dpr}px Inter, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(val, padding.left - 8 * dpr, y + 4 * dpr);
      }

      // Bars
      data.values.forEach((val, i) => {
        const x = padding.left + barGap + (barWidth + barGap) * i;
        const barH = (val / maxVal) * chartH;
        const y = padding.top + chartH - barH;

        // Rounded top
        const radius = Math.min(4 * dpr, barWidth / 2);
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
        ctx.lineTo(x + barWidth, padding.top + chartH);
        ctx.lineTo(x, padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = barColors[i % barColors.length];
        ctx.fill();

        // Label
        ctx.fillStyle = colors.textMuted;
        ctx.font = `${10 * dpr}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[i], x + barWidth / 2, h - 10 * dpr);
      });
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  };

  /* ── DOUGHNUT CHART ──────────────────────────────────────────────── */
  window.PRNT.doughnutChart = function (canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    function draw() {
      const { ctx, dpr, w, h } = resizeCanvas(canvas);
      const colors = getThemeColors();
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 30 * dpr;
      const innerRadius = radius * 0.6;
      const total = data.values.reduce((a, b) => a + b, 0);

      const sliceColors = data.colors || [colors.secondary, colors.accent, colors.primary, colors.success, colors.purple, colors.pink];

      ctx.clearRect(0, 0, w, h);

      let startAngle = -Math.PI / 2;

      data.values.forEach((val, i) => {
        const sliceAngle = (val / total) * Math.PI * 2;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = sliceColors[i % sliceColors.length];
        ctx.fill();

        // Label
        const midAngle = startAngle + sliceAngle / 2;
        const labelR = radius + 18 * dpr;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        ctx.fillStyle = colors.text;
        ctx.font = `${10 * dpr}px Inter, sans-serif`;
        ctx.textAlign = Math.cos(midAngle) > 0 ? 'left' : 'right';
        ctx.fillText(`${data.labels[i]} ${Math.round(val / total * 100)}%`, lx, ly);

        startAngle += sliceAngle;
      });

      // Center text
      if (options.centerText) {
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${16 * dpr}px 'Barlow Condensed', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(options.centerText, cx, cy);
      }
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  };

  /* ── RADAR CHART ─────────────────────────────────────────────────── */
  window.PRNT.radarChart = function (canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    function draw() {
      const { ctx, dpr, w, h } = resizeCanvas(canvas);
      const colors = getThemeColors();
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 40 * dpr;
      const sides = data.labels.length;
      const angleStep = (Math.PI * 2) / sides;
      const levels = 5;

      ctx.clearRect(0, 0, w, h);

      // Grid
      for (let level = 1; level <= levels; level++) {
        const r = (radius / levels) * level;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const angle = -Math.PI / 2 + angleStep * i;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();
      }

      // Axes
      for (let i = 0; i < sides; i++) {
        const angle = -Math.PI / 2 + angleStep * i;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.strokeStyle = colors.grid;
        ctx.stroke();

        // Labels
        const lx = cx + Math.cos(angle) * (radius + 16 * dpr);
        const ly = cy + Math.sin(angle) * (radius + 16 * dpr);
        ctx.fillStyle = colors.textMuted;
        ctx.font = `${10 * dpr}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.labels[i], lx, ly);
      }

      // Data sets
      const dataSets = [
        { values: data.values1, color: colors.secondary, fillColor: 'rgba(23,162,184,0.15)' },
        { values: data.values2, color: colors.accent, fillColor: 'rgba(244,161,0,0.15)' },
      ];

      dataSets.forEach(ds => {
        if (!ds.values) return;
        ctx.beginPath();
        ds.values.forEach((val, i) => {
          const angle = -Math.PI / 2 + angleStep * i;
          const r = (val / 100) * radius;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = ds.fillColor;
        ctx.fill();
        ctx.strokeStyle = ds.color;
        ctx.lineWidth = 2 * dpr;
        ctx.stroke();

        // Dots
        ds.values.forEach((val, i) => {
          const angle = -Math.PI / 2 + angleStep * i;
          const r = (val / 100) * radius;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          ctx.beginPath();
          ctx.arc(x, y, 3 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = ds.color;
          ctx.fill();
        });
      });
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  };

  /* ── PROGRESS RINGS (SVG-based for crisp rendering) ──────────────── */
  window.PRNT.progressRing = function (containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 120;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    container.innerHTML = '';

    data.forEach(item => {
      const offset = circumference - (item.value / 100) * circumference;
      const div = document.createElement('div');
      div.className = 'progress-ring-item';
      div.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;gap:8px;';

      div.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="var(--border-color)" stroke-width="${strokeWidth}" />
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="${item.color || 'var(--color-secondary)'}"
            stroke-width="${strokeWidth}" stroke-linecap="round"
            stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
            style="transition: stroke-dashoffset 1.5s ease; --ring-circumference:${circumference}; --ring-offset:${offset}" />
        </svg>
        <div style="position:absolute;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;font-family:var(--font-heading);font-weight:800;font-size:1.25rem;color:var(--text-heading);">${item.value}%</div>
        <span style="font-size:var(--fs-xs);color:var(--text-muted);text-align:center;">${item.label}</span>
      `;
      div.style.position = 'relative';
      container.appendChild(div);

      // Animate on intersection
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const circle = div.querySelector('circle:nth-child(2)');
            setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(div);
    });
  };

  /* ── HORIZONTAL BAR CHART ────────────────────────────────────────── */
  window.PRNT.horizontalBarChart = function (canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    function draw() {
      const { ctx, dpr, w, h } = resizeCanvas(canvas);
      const colors = getThemeColors();
      const padding = { top: 10 * dpr, right: 30 * dpr, bottom: 10 * dpr, left: 90 * dpr };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;
      const maxVal = Math.max(...data.values) * 1.1;

      ctx.clearRect(0, 0, w, h);

      const barCount = data.values.length;
      const barGap = 8 * dpr;
      const barHeight = Math.min(28 * dpr, (chartH - barGap * (barCount - 1)) / barCount);

      const barColors = data.colors || [colors.secondary, colors.accent, colors.primary, colors.success, colors.purple];

      data.values.forEach((val, i) => {
        const y = padding.top + (barHeight + barGap) * i;
        const barW = (val / maxVal) * chartW;

        // Bar
        const radius = Math.min(4 * dpr, barHeight / 2);
        ctx.beginPath();
        ctx.moveTo(padding.left + radius, y);
        ctx.lineTo(padding.left + barW - radius, y);
        ctx.arcTo(padding.left + barW, y, padding.left + barW, y + radius, radius);
        ctx.arcTo(padding.left + barW, y + barHeight, padding.left + barW - radius, y + barHeight, radius);
        ctx.lineTo(padding.left + radius, y + barHeight);
        ctx.arcTo(padding.left, y + barHeight, padding.left, y + barHeight - radius, radius);
        ctx.arcTo(padding.left, y, padding.left + radius, y, radius);
        ctx.closePath();
        ctx.fillStyle = barColors[i % barColors.length];
        ctx.fill();

        // Label
        ctx.fillStyle = colors.text;
        ctx.font = `${11 * dpr}px Inter, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.labels[i], padding.left - 8 * dpr, y + barHeight / 2);

        // Value
        ctx.fillStyle = colors.textMuted;
        ctx.textAlign = 'left';
        ctx.fillText(val, padding.left + barW + 8 * dpr, y + barHeight / 2);
      });
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  };

  /* ── POLAR / DOUGHNUT VARIANT ────────────────────────────────────── */
  window.PRNT.polarChart = function (canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    function draw() {
      const { ctx, dpr, w, h } = resizeCanvas(canvas);
      const colors = getThemeColors();
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.min(cx, cy) - 40 * dpr;
      const innerRadius = maxRadius * 0.3;
      const total = data.values.reduce((a, b) => a + b, 0);
      const maxVal = Math.max(...data.values);

      const sliceColors = data.colors || [colors.secondary, colors.accent, colors.primary, colors.success, colors.purple, colors.pink];

      ctx.clearRect(0, 0, w, h);

      let startAngle = -Math.PI / 2;

      data.values.forEach((val, i) => {
        const sliceAngle = (val / total) * Math.PI * 2;
        const sliceRadius = innerRadius + (maxRadius - innerRadius) * (val / maxVal);

        ctx.beginPath();
        ctx.arc(cx, cy, sliceRadius, startAngle, startAngle + sliceAngle);
        ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = sliceColors[i % sliceColors.length];
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = colors.bg;
        ctx.lineWidth = 2 * dpr;
        ctx.stroke();

        // Label
        const midAngle = startAngle + sliceAngle / 2;
        const labelR = sliceRadius + 14 * dpr;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        ctx.fillStyle = colors.text;
        ctx.font = `${10 * dpr}px Inter, sans-serif`;
        ctx.textAlign = Math.cos(midAngle) > 0 ? 'left' : 'right';
        ctx.fillText(data.labels[i], lx, ly);

        startAngle += sliceAngle;
      });
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  };

})();
