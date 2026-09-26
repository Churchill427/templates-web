/* ============================================================
   PUTT — Dashboard JavaScript
   Sidebar, Charts (vanilla SVG/Canvas), Dashboard interactions
   ============================================================ */

(function () {
  'use strict';

  /* ==================== SIDEBAR ==================== */
  const Sidebar = {
    isMobile() {
      return window.innerWidth <= 1024;
    },

    closeMobile(sidebar, overlay) {
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    },

    openMobile(sidebar, overlay) {
      sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    init() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      if (!sidebar) return;

      const self = this;

      // Toggle collapse (desktop) / close sidebar (mobile)
      const toggleBtn = sidebar.querySelector('.sidebar-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          if (self.isMobile()) {
            // On mobile, the sidebar-toggle should close the sidebar
            self.closeMobile(sidebar, overlay);
          } else {
            // On desktop, toggle collapsed state
            sidebar.classList.toggle('collapsed');
          }
        });
      }

      // Mobile hamburger (open/close toggle)
      const dashHamburger = document.querySelector('.dash-hamburger');
      if (dashHamburger) {
        dashHamburger.addEventListener('click', () => {
          if (sidebar.classList.contains('mobile-open')) {
            self.closeMobile(sidebar, overlay);
          } else {
            self.openMobile(sidebar, overlay);
          }
        });
      }

      // Close via overlay click
      if (overlay) {
        overlay.addEventListener('click', () => {
          self.closeMobile(sidebar, overlay);
        });
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
          self.closeMobile(sidebar, overlay);
        }
      });

      // Handle window resize: if resizing from mobile to desktop, clean up mobile state
      window.addEventListener('resize', () => {
        if (!self.isMobile() && sidebar.classList.contains('mobile-open')) {
          self.closeMobile(sidebar, overlay);
        }
      });

      // Nav items
      sidebar.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.addEventListener('click', () => {
          sidebar.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          const view = item.getAttribute('data-view');
          if (view) {
            document.querySelectorAll('.dash-view').forEach(v => v.classList.remove('active'));
            const targetView = document.querySelector(`#${view}`);
            if (targetView) targetView.classList.add('active');

            // Update topbar title
            const title = document.querySelector('.dash-topbar-left h1');
            if (title) title.textContent = item.querySelector('span')?.textContent || '';
          }

          // Close mobile sidebar after nav selection
          self.closeMobile(sidebar, overlay);
        });
      });
    }
  };

  /* ==================== CHART UTILITIES ==================== */
  const ChartUtils = {
    colors: {
      primary: '#0B6E4F',
      secondary: '#FF6B5B',
      accent: '#FFC53D',
      primaryLight: '#0D8A63',
      secondaryLight: '#FF877A',
      accentLight: '#FFD76B',
      text: '#22272E',
      textMuted: '#6B7280',
      border: '#D4D1CC',
    },
    isDark() {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    },
    getTextColor() {
      return this.isDark() ? '#E8EDF2' : '#22272E';
    },
    getMutedColor() {
      return this.isDark() ? '#8892A0' : '#6B7280';
    },
    getBorderColor() {
      return this.isDark() ? '#2E3640' : '#D4D1CC';
    }
  };

  /* ==================== LINE / AREA CHART (Canvas) ==================== */
  function drawLineChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(...data.values) * 1.15;
    const minVal = 0;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = ChartUtils.getBorderColor();
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Labels
      ctx.fillStyle = ChartUtils.getMutedColor();
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(val, padding.left - 8, y + 3);
    }

    // X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = ChartUtils.getMutedColor();
    data.labels.forEach((label, i) => {
      const x = padding.left + (chartW / (data.labels.length - 1)) * i;
      ctx.fillText(label, x, h - 8);
    });

    // Area gradient
    if (options.area) {
      const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
      gradient.addColorStop(0, (options.color || ChartUtils.colors.primary) + '40');
      gradient.addColorStop(1, (options.color || ChartUtils.colors.primary) + '05');

      ctx.beginPath();
      data.values.forEach((val, i) => {
        const x = padding.left + (chartW / (data.values.length - 1)) * i;
        const y = padding.top + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(padding.left + chartW, padding.top + chartH);
      ctx.lineTo(padding.left, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Line
    ctx.beginPath();
    ctx.strokeStyle = options.color || ChartUtils.colors.primary;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    data.values.forEach((val, i) => {
      const x = padding.left + (chartW / (data.values.length - 1)) * i;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Points
    data.values.forEach((val, i) => {
      const x = padding.left + (chartW / (data.values.length - 1)) * i;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = options.color || ChartUtils.colors.primary;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    });
  }

  /* ==================== BAR CHART (Canvas) ==================== */
  function drawBarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = Math.max(...data.values) * 1.15;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = ChartUtils.getBorderColor();
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = ChartUtils.getMutedColor();
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 8, y + 3);
    }

    const barWidth = (chartW / data.values.length) * 0.6;
    const gap = (chartW / data.values.length) * 0.4;

    const colors = options.colors || [ChartUtils.colors.primary, ChartUtils.colors.secondary, ChartUtils.colors.accent,
      ChartUtils.colors.primaryLight, ChartUtils.colors.secondaryLight, ChartUtils.colors.accentLight,
      ChartUtils.colors.primary];

    data.values.forEach((val, i) => {
      const x = padding.left + (chartW / data.values.length) * i + gap / 2;
      const barH = (val / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Bar with rounded top
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, padding.top + chartH);
      ctx.lineTo(x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = options.singleColor || colors[i % colors.length];
      ctx.fill();

      // X label
      ctx.fillStyle = ChartUtils.getMutedColor();
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[i], x + barWidth / 2, h - 8);
    });
  }

  /* ==================== HORIZONTAL BAR CHART (Canvas) ==================== */
  function drawHorizontalBarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 10, right: 30, bottom: 10, left: 70 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = Math.max(...data.values) * 1.1;

    ctx.clearRect(0, 0, w, h);

    const barHeight = (chartH / data.values.length) * 0.6;
    const gap = (chartH / data.values.length) * 0.4;

    const colors = [ChartUtils.colors.primary, ChartUtils.colors.secondary, ChartUtils.colors.accent,
      ChartUtils.colors.primaryLight, ChartUtils.colors.secondaryLight, ChartUtils.colors.accentLight];

    data.values.forEach((val, i) => {
      const y = padding.top + (chartH / data.values.length) * i + gap / 2;
      const barW = (val / maxVal) * chartW;

      // Label
      ctx.fillStyle = ChartUtils.getMutedColor();
      ctx.font = '11px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(data.labels[i], padding.left - 8, y + barHeight / 2 + 4);

      // Bar
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + barW - radius, y);
      ctx.quadraticCurveTo(padding.left + barW, y, padding.left + barW, y + radius);
      ctx.lineTo(padding.left + barW, y + barHeight - radius);
      ctx.quadraticCurveTo(padding.left + barW, y + barHeight, padding.left + barW - radius, y + barHeight);
      ctx.lineTo(padding.left, y + barHeight);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      // Value
      ctx.fillStyle = ChartUtils.getTextColor();
      ctx.font = '10px Inter';
      ctx.textAlign = 'left';
      ctx.fillText('$' + val, padding.left + barW + 6, y + barHeight / 2 + 4);
    });
  }

  /* ==================== DOUGHNUT / POLAR CHART (Canvas) ==================== */
  function drawDoughnutChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 30;
    const innerRadius = options.inner ? radius * 0.55 : 0;
    const total = data.values.reduce((a, b) => a + b, 0);

    const colors = [ChartUtils.colors.primary, ChartUtils.colors.secondary, ChartUtils.colors.accent,
      ChartUtils.colors.primaryLight, ChartUtils.colors.secondaryLight];

    ctx.clearRect(0, 0, w, h);

    let startAngle = -Math.PI / 2;
    data.values.forEach((val, i) => {
      const sliceAngle = (val / total) * Math.PI * 2;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      if (innerRadius > 0) {
        ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      } else {
        ctx.lineTo(cx, cy);
      }
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelR = radius + 16;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;
      ctx.fillStyle = ChartUtils.getMutedColor();
      ctx.font = '10px Inter';
      ctx.textAlign = Math.cos(midAngle) > 0 ? 'left' : 'right';
      ctx.fillText(data.labels[i], lx, ly + 3);

      startAngle += sliceAngle;
    });

    // Center text for doughnut
    if (innerRadius > 0 && options.centerText) {
      ctx.fillStyle = ChartUtils.getTextColor();
      ctx.font = 'bold 16px Baloo 2';
      ctx.textAlign = 'center';
      ctx.fillText(options.centerText, cx, cy + 5);
    }
  }

  /* ==================== PROGRESS RING (SVG-based) ==================== */
  function drawProgressRing(containerId, value, max, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 180;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / max) * circumference;
    const color = options.color || ChartUtils.colors.primary;

    container.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block;margin:auto;">
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}"
          fill="none" stroke="${ChartUtils.getBorderColor()}" stroke-width="${strokeWidth}" />
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}"
          fill="none" stroke="${color}" stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference - progress}"
          stroke-linecap="round"
          transform="rotate(-90 ${size / 2} ${size / 2})"
          style="transition: stroke-dashoffset 1s ease;" />
        <text x="${size / 2}" y="${size / 2 - 8}" text-anchor="middle"
          fill="${ChartUtils.getTextColor()}" font-family="Baloo 2" font-size="24" font-weight="700">
          ${value}
        </text>
        <text x="${size / 2}" y="${size / 2 + 14}" text-anchor="middle"
          fill="${ChartUtils.getMutedColor()}" font-family="Inter" font-size="11">
          of ${max} pts
        </text>
      </svg>`;
  }

  /* ==================== RADAR CHART (Canvas) ==================== */
  function drawRadarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 35;
    const sides = data.labels.length;
    const maxVal = Math.max(...data.values) * 1.2;
    const angleStep = (Math.PI * 2) / sides;

    ctx.clearRect(0, 0, w, h);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
      const r = (radius / 4) * ring;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = ChartUtils.getBorderColor();
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < sides; i++) {
      const angle = angleStep * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.strokeStyle = ChartUtils.getBorderColor();
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Labels
      const labelR = radius + 18;
      const lx = cx + Math.cos(angle) * labelR;
      const ly = cy + Math.sin(angle) * labelR;
      ctx.fillStyle = ChartUtils.getMutedColor();
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.labels[i], lx, ly);
    }

    // Data polygon
    ctx.beginPath();
    data.values.forEach((val, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const r = (val / maxVal) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = ChartUtils.colors.primary + '30';
    ctx.fill();
    ctx.strokeStyle = ChartUtils.colors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points
    data.values.forEach((val, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const r = (val / maxVal) * radius;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 4, 0, Math.PI * 2);
      ctx.fillStyle = ChartUtils.colors.primary;
      ctx.fill();
    });
  }

  /* ==================== DASHBOARD PAGINATION ==================== */
  const DashPagination = {
    init() {
      document.querySelectorAll('.pagination').forEach(pag => {
        pag.querySelectorAll('.page-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            pag.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          });
        });
      });
    }
  };

  /* ==================== DASHBOARD FILTER TABS ==================== */
  const DashFilterTabs = {
    init() {
      document.querySelectorAll('.dash-tabs').forEach(tabs => {
        tabs.querySelectorAll('.dash-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            tabs.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter');
            const target = tabs.getAttribute('data-target');
            if (!target) return;

            const table = document.querySelector(`#${target}`);
            if (!table) return;

            table.querySelectorAll('tbody tr').forEach(row => {
              if (filter === 'all') {
                row.style.display = '';
              } else {
                row.style.display = row.getAttribute('data-status') === filter ? '' : 'none';
              }
            });
          });
        });
      });
    }
  };

  /* ==================== SKELETON LOADING SIM ==================== */
  const SkeletonLoader = {
    init() {
      // Remove skeletons after simulated load
      setTimeout(() => {
        document.querySelectorAll('.skeleton').forEach(skel => {
          skel.classList.remove('skeleton');
        });
      }, 1500);
    }
  };

  /* ==================== INIT DASHBOARD ==================== */
  function initDashboard() {
    Sidebar.init();
    DashPagination.init();
    DashFilterTabs.init();
    SkeletonLoader.init();

    // Expose chart functions globally for page-specific init
    window.PuttCharts = {
      drawLineChart,
      drawBarChart,
      drawHorizontalBarChart,
      drawDoughnutChart,
      drawProgressRing,
      drawRadarChart
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
