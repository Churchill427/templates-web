/* ============================================================
   MYST — Dashboard JavaScript
   Handles: sidebar, charts (line, bar, donut, area, radar,
   heatmap), notifications, avatar menu, and dashboard widgets.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. SIDEBAR COLLAPSE / EXPAND
  ---------------------------------------------------------- */
  const Sidebar = {
    STORAGE_KEY: 'myst-sidebar-collapsed',

    init() {
      this.sidebar = document.querySelector('.sidebar');
      this.toggleBtn = document.querySelector('.sidebar__toggle');
      if (!this.sidebar || !this.toggleBtn) return;

      var saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'true' && window.innerWidth >= 1024) {
        this.sidebar.classList.add('collapsed');
      }

      this.toggleBtn.addEventListener('click', this.toggle.bind(this));
      this.handleResponsive();
      window.addEventListener('resize', this.handleResponsive.bind(this));
    },

    toggle() {
      if (window.innerWidth < 1024) {
        this.sidebar.classList.toggle('open');
        if (this.sidebar.classList.contains('open')) {
          this.createOverlay();
        } else {
          this.removeOverlay();
        }
      } else {
        this.sidebar.classList.toggle('collapsed');
        localStorage.setItem(this.STORAGE_KEY, this.sidebar.classList.contains('collapsed'));
      }
    },

    handleResponsive() {
      if (window.innerWidth >= 1024) {
        this.sidebar.classList.remove('open');
        this.removeOverlay();
      }
    },

    createOverlay() {
      if (document.querySelector('.sidebar-overlay')) return;
      var overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--z-drawer')) - 1) + ';';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function () {
        Sidebar.sidebar.classList.remove('open');
        Sidebar.removeOverlay();
      });
    },

    removeOverlay() {
      var overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.remove();
    }
  };

  /* ----------------------------------------------------------
     2. NOTIFICATION BELL
  ---------------------------------------------------------- */
  const NotificationBell = {
    init() {
      var btn = document.querySelector('.notification-bell__btn');
      var dropdown = document.querySelector('.notification-dropdown');
      if (!btn || !dropdown) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        document.querySelectorAll('.avatar-menu__dropdown.open').forEach(function (d) {
          d.classList.remove('open');
        });
      });
    }
  };

  /* ----------------------------------------------------------
     3. AVATAR MENU
  ---------------------------------------------------------- */
  const AvatarMenu = {
    init() {
      var btn = document.querySelector('.avatar-menu__btn');
      var dropdown = document.querySelector('.avatar-menu__dropdown');
      if (!btn || !dropdown) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        document.querySelectorAll('.notification-dropdown.open').forEach(function (d) {
          d.classList.remove('open');
        });
      });
    }
  };

  /* ----------------------------------------------------------
     4. PURE CSS/JS CHARTS
  ---------------------------------------------------------- */

  /* --- 4a. LINE CHART (SVG) --- */
  const LineChart = {
    draw(container, data, options) {
      if (!container) return;
      options = options || {};
      var width = container.offsetWidth || 600;
      var height = parseInt(getComputedStyle(container).height) || 240;
      var padding = { top: 20, right: 20, bottom: 40, left: 50 };
      var chartW = width - padding.left - padding.right;
      var chartH = height - padding.top - padding.bottom;

      var maxVal = Math.max.apply(null, data.values);
      var minVal = Math.min.apply(null, data.values);
      var range = maxVal - minVal || 1;

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.display = 'block';

      var gridLines = 5;
      for (var g = 0; g <= gridLines; g++) {
        var y = padding.top + (chartH / gridLines) * g;
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', padding.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', width - padding.right);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'var(--border-light)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);

        var labelVal = maxVal - (range / gridLines) * g;
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', padding.left - 8);
        text.setAttribute('y', y + 4);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('fill', 'var(--text-tertiary)');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.textContent = Math.round(labelVal);
        svg.appendChild(text);
      }

      var points = [];
      data.values.forEach(function (val, i) {
        var x = padding.left + (chartW / (data.values.length - 1)) * i;
        var y = padding.top + chartH - ((val - minVal) / range) * chartH;
        points.push(x + ',' + y);

        if (data.labels && data.labels[i]) {
          var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', x);
          text.setAttribute('y', height - 8);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', 'var(--text-tertiary)');
          text.setAttribute('font-size', '11');
          text.setAttribute('font-family', 'Inter, sans-serif');
          text.textContent = data.labels[i];
          svg.appendChild(text);
        }
      });

      if (options.fill) {
        var areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        var firstX = padding.left;
        var lastX = padding.left + chartW;
        var bottomY = padding.top + chartH;
        areaPath.setAttribute('points', firstX + ',' + bottomY + ' ' + points.join(' ') + ' ' + lastX + ',' + bottomY);
        areaPath.setAttribute('fill', options.fillColor || 'rgba(242, 163, 60, 0.1)');
        svg.appendChild(areaPath);
      }

      var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', points.join(' '));
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', options.color || 'var(--ember-amber)');
      polyline.setAttribute('stroke-width', '2.5');
      polyline.setAttribute('stroke-linecap', 'round');
      polyline.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(polyline);

      data.values.forEach(function (val, i) {
        var x = padding.left + (chartW / (data.values.length - 1)) * i;
        var y = padding.top + chartH - ((val - minVal) / range) * chartH;
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', 'var(--bg-card)');
        circle.setAttribute('stroke', options.color || 'var(--ember-amber)');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);
      });

      container.innerHTML = '';
      container.appendChild(svg);
    }
  };

  /* --- 4b. BAR CHART (CSS/HTML) --- */
  const BarChart = {
    draw(container, data, options) {
      if (!container) return;
      options = options || {};
      var maxVal = Math.max.apply(null, data.values);
      container.innerHTML = '';

      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:flex-end;gap:8px;height:100%;padding:0 4px;';

      data.values.forEach(function (val, i) {
        var col = document.createElement('div');
        col.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end;';

        var valLabel = document.createElement('span');
        valLabel.textContent = val;
        valLabel.style.cssText = 'font-size:11px;color:var(--text-tertiary);font-weight:600;';

        var bar = document.createElement('div');
        var pct = (val / maxVal) * 100;
        bar.style.cssText = 'width:100%;max-width:' + (options.maxBarWidth || 48) + 'px;height:0%;background:' + (options.color || 'var(--ember-amber)') + ';border-radius:4px 4px 0 0;transition:height 0.8s cubic-bezier(.34,1.56,.64,1);';

        var label = document.createElement('span');
        label.textContent = data.labels ? data.labels[i] : '';
        label.style.cssText = 'font-size:11px;color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60px;text-align:center;';

        col.appendChild(valLabel);
        col.appendChild(bar);
        col.appendChild(label);
        wrapper.appendChild(col);

        setTimeout(function () {
          bar.style.height = pct + '%';
        }, i * 80 + 100);
      });

      container.appendChild(wrapper);
    }
  };

  /* --- 4c. DONUT CHART (SVG) --- */
  const DonutChart = {
    draw(container, data, options) {
      if (!container) return;
      options = options || {};
      var size = Math.min(container.offsetWidth, parseInt(getComputedStyle(container).height) || 220);
      var radius = size / 2 - 10;
      var innerRadius = radius * 0.6;
      var cx = size / 2;
      var cy = size / 2;
      var total = data.values.reduce(function (a, b) { return a + b; }, 0);
      var colors = options.colors || ['#F2A33C', '#7E8CA3', '#0C1222', '#4A5568', '#C7D0DE', '#E5922E'];

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');

      var startAngle = -90;
      data.values.forEach(function (val, i) {
        var angle = (val / total) * 360;
        var endAngle = startAngle + angle;

        var startRad = (startAngle * Math.PI) / 180;
        var endRad = (endAngle * Math.PI) / 180;

        var x1 = cx + radius * Math.cos(startRad);
        var y1 = cy + radius * Math.sin(startRad);
        var x2 = cx + radius * Math.cos(endRad);
        var y2 = cy + radius * Math.sin(endRad);
        var ix1 = cx + innerRadius * Math.cos(startRad);
        var iy1 = cy + innerRadius * Math.sin(startRad);
        var ix2 = cx + innerRadius * Math.cos(endRad);
        var iy2 = cy + innerRadius * Math.sin(endRad);

        var largeArc = angle > 180 ? 1 : 0;

        var d = 'M ' + x1 + ' ' + y1 +
          ' A ' + radius + ' ' + radius + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2 +
          ' L ' + ix2 + ' ' + iy2 +
          ' A ' + innerRadius + ' ' + innerRadius + ' 0 ' + largeArc + ' 0 ' + ix1 + ' ' + iy1 +
          ' Z';

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', colors[i % colors.length]);
        path.style.transition = 'opacity 0.3s';
        path.addEventListener('mouseenter', function () { path.style.opacity = '0.8'; });
        path.addEventListener('mouseleave', function () { path.style.opacity = '1'; });
        svg.appendChild(path);

        startAngle = endAngle;
      });

      if (options.centerLabel) {
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'var(--text-primary)');
        text.setAttribute('font-size', '18');
        text.setAttribute('font-weight', '700');
        text.setAttribute('font-family', 'Playfair Display, serif');
        text.textContent = options.centerLabel;
        svg.appendChild(text);
      }

      container.innerHTML = '';
      container.appendChild(svg);

      if (data.labels) {
        var legend = document.createElement('div');
        legend.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:12px;';
        data.labels.forEach(function (label, i) {
          var item = document.createElement('div');
          item.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-secondary);';
          var dot = document.createElement('span');
          dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + colors[i % colors.length] + ';flex-shrink:0;';
          item.appendChild(dot);
          item.appendChild(document.createTextNode(label));
          legend.appendChild(item);
        });
        container.parentElement.appendChild(legend);
      }
    }
  };

  /* --- 4d. AREA CHART (SVG — line with fill) --- */
  const AreaChart = {
    draw(container, data, options) {
      LineChart.draw(container, data, Object.assign({ fill: true, fillColor: 'rgba(242, 163, 60, 0.12)' }, options || {}));
    }
  };

  /* --- 4e. RADAR CHART (SVG) --- */
  const RadarChart = {
    draw(container, data, options) {
      if (!container) return;
      options = options || {};
      var size = Math.min(container.offsetWidth, parseInt(getComputedStyle(container).height) || 260);
      var cx = size / 2;
      var cy = size / 2;
      var radius = size / 2 - 40;
      var n = data.labels.length;
      var maxVal = options.maxValue || 100;
      var levels = 5;

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');

      for (var l = 1; l <= levels; l++) {
        var r = (radius / levels) * l;
        var polyPoints = [];
        for (var i = 0; i < n; i++) {
          var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
          polyPoints.push((cx + r * Math.cos(angle)).toFixed(1) + ',' + (cy + r * Math.sin(angle)).toFixed(1));
        }
        var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', polyPoints.join(' '));
        poly.setAttribute('fill', 'none');
        poly.setAttribute('stroke', 'var(--border-light)');
        poly.setAttribute('stroke-width', '1');
        svg.appendChild(poly);
      }

      for (var i = 0; i < n; i++) {
        var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
        var lx = cx + radius * Math.cos(angle);
        var ly = cy + radius * Math.sin(angle);
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx);
        line.setAttribute('y1', cy);
        line.setAttribute('x2', lx);
        line.setAttribute('y2', ly);
        line.setAttribute('stroke', 'var(--border-light)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);

        var labelX = cx + (radius + 18) * Math.cos(angle);
        var labelY = cy + (radius + 18) * Math.sin(angle);
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'var(--text-secondary)');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.textContent = data.labels[i];
        svg.appendChild(text);
      }

      var dataPoints = [];
      data.values.forEach(function (val, i) {
        var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
        var r = (val / maxVal) * radius;
        dataPoints.push((cx + r * Math.cos(angle)).toFixed(1) + ',' + (cy + r * Math.sin(angle)).toFixed(1));
      });

      var dataPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      dataPoly.setAttribute('points', dataPoints.join(' '));
      dataPoly.setAttribute('fill', 'rgba(242, 163, 60, 0.15)');
      dataPoly.setAttribute('stroke', 'var(--ember-amber)');
      dataPoly.setAttribute('stroke-width', '2');
      svg.appendChild(dataPoly);

      data.values.forEach(function (val, i) {
        var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
        var r = (val / maxVal) * radius;
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', (cx + r * Math.cos(angle)).toFixed(1));
        circle.setAttribute('cy', (cy + r * Math.sin(angle)).toFixed(1));
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', 'var(--ember-amber)');
        svg.appendChild(circle);
      });

      container.innerHTML = '';
      container.appendChild(svg);
    }
  };

  /* --- 4f. HEATMAP CALENDAR (HTML/CSS grid) --- */
  const HeatmapChart = {
    draw(container, data, options) {
      if (!container) return;
      options = options || {};
      container.innerHTML = '';

      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;flex-direction:column;gap:4px;';

      var hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'];
      var days = data.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      var headerRow = document.createElement('div');
      headerRow.style.cssText = 'display:flex;gap:3px;';
      var cornerCell = document.createElement('div');
      cornerCell.style.cssText = 'width:36px;flex-shrink:0;';
      headerRow.appendChild(cornerCell);

      hours.forEach(function (h) {
        var cell = document.createElement('div');
        cell.style.cssText = 'flex:1;font-size:9px;color:var(--text-tertiary);text-align:center;min-width:24px;';
        cell.textContent = h;
        headerRow.appendChild(cell);
      });
      wrapper.appendChild(headerRow);

      days.forEach(function (day, di) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:3px;align-items:center;';

        var dayLabel = document.createElement('div');
        dayLabel.style.cssText = 'width:36px;font-size:11px;color:var(--text-tertiary);flex-shrink:0;font-weight:500;';
        dayLabel.textContent = day;
        row.appendChild(dayLabel);

        hours.forEach(function (h, hi) {
          var value = data.values[di] ? data.values[di][hi] || 0 : 0;
          var maxVal = options.maxValue || 10;
          var intensity = value / maxVal;

          var cell = document.createElement('div');
          cell.style.cssText = 'flex:1;aspect-ratio:1;min-width:18px;max-width:32px;border-radius:3px;' +
            'background:rgba(242,163,60,' + (0.05 + intensity * 0.85) + ');' +
            'cursor:pointer;transition:transform 0.15s;';
          cell.title = day + ' ' + h + ': ' + value + ' bookings';
          cell.addEventListener('mouseenter', function () { cell.style.transform = 'scale(1.15)'; });
          cell.addEventListener('mouseleave', function () { cell.style.transform = 'scale(1)'; });
          row.appendChild(cell);
        });

        wrapper.appendChild(row);
      });

      var legendRow = document.createElement('div');
      legendRow.style.cssText = 'display:flex;align-items:center;gap:6px;justify-content:flex-end;margin-top:8px;font-size:10px;color:var(--text-tertiary);';
      legendRow.innerHTML = 'Less ';
      for (var i = 0; i < 5; i++) {
        var block = document.createElement('span');
        block.style.cssText = 'width:14px;height:14px;border-radius:2px;background:rgba(242,163,60,' + (0.1 + i * 0.2) + ');display:inline-block;';
        legendRow.appendChild(block);
      }
      legendRow.appendChild(document.createTextNode(' More'));
      wrapper.appendChild(legendRow);

      container.appendChild(wrapper);
    }
  };

  /* ----------------------------------------------------------
     5. CHART INITIALIZATION (auto-discovers chart containers)
  ---------------------------------------------------------- */
  const ChartInit = {
    init() {
      /* Line Charts */
      document.querySelectorAll('[data-chart="line"]').forEach(function (el) {
        var data = JSON.parse(el.getAttribute('data-chart-data') || '{}');
        var opts = JSON.parse(el.getAttribute('data-chart-options') || '{}');
        LineChart.draw(el, data, opts);
      });

      /* Bar Charts */
      document.querySelectorAll('[data-chart="bar"]').forEach(function (el) {
        var data = JSON.parse(el.getAttribute('data-chart-data') || '{}');
        var opts = JSON.parse(el.getAttribute('data-chart-options') || '{}');
        BarChart.draw(el, data, opts);
      });

      /* Donut Charts */
      document.querySelectorAll('[data-chart="donut"]').forEach(function (el) {
        var data = JSON.parse(el.getAttribute('data-chart-data') || '{}');
        var opts = JSON.parse(el.getAttribute('data-chart-options') || '{}');
        DonutChart.draw(el, data, opts);
      });

      /* Area Charts */
      document.querySelectorAll('[data-chart="area"]').forEach(function (el) {
        var data = JSON.parse(el.getAttribute('data-chart-data') || '{}');
        var opts = JSON.parse(el.getAttribute('data-chart-options') || '{}');
        AreaChart.draw(el, data, opts);
      });

      /* Radar Charts */
      document.querySelectorAll('[data-chart="radar"]').forEach(function (el) {
        var data = JSON.parse(el.getAttribute('data-chart-data') || '{}');
        var opts = JSON.parse(el.getAttribute('data-chart-options') || '{}');
        RadarChart.draw(el, data, opts);
      });

      /* Heatmap Charts */
      document.querySelectorAll('[data-chart="heatmap"]').forEach(function (el) {
        var data = JSON.parse(el.getAttribute('data-chart-data') || '{}');
        var opts = JSON.parse(el.getAttribute('data-chart-options') || '{}');
        HeatmapChart.draw(el, data, opts);
      });
    }
  };

  /* ----------------------------------------------------------
     6. DASHBOARD TABLE INTERACTIONS
  ---------------------------------------------------------- */
  const TableActions = {
    init() {
      document.querySelectorAll('[data-table-sort]').forEach(function (header) {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function () {
          var table = header.closest('table');
          var tbody = table.querySelector('tbody');
          var colIndex = Array.from(header.parentElement.children).indexOf(header);
          var rows = Array.from(tbody.querySelectorAll('tr'));
          var isAsc = header.classList.contains('sort-asc');

          table.querySelectorAll('th').forEach(function (th) {
            th.classList.remove('sort-asc', 'sort-desc');
          });

          rows.sort(function (a, b) {
            var aVal = a.children[colIndex].textContent.trim();
            var bVal = b.children[colIndex].textContent.trim();
            var aNum = parseFloat(aVal);
            var bNum = parseFloat(bVal);
            if (!isNaN(aNum) && !isNaN(bNum)) {
              return isAsc ? bNum - aNum : aNum - bNum;
            }
            return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          });

          header.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
          rows.forEach(function (row) { tbody.appendChild(row); });
        });
      });
    }
  };

  /* ----------------------------------------------------------
     7. DASHBOARD SEARCH
  ---------------------------------------------------------- */
  const DashboardSearch = {
    init() {
      var searchInput = document.querySelector('.topbar__search input');
      if (!searchInput) return;

      searchInput.addEventListener('input', function () {
        var query = searchInput.value.toLowerCase().trim();
        var tables = document.querySelectorAll('.dashboard__content table tbody');
        tables.forEach(function (tbody) {
          var rows = tbody.querySelectorAll('tr');
          rows.forEach(function (row) {
            var text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) || !query ? '' : 'none';
          });
        });
      });
    }
  };

  /* ----------------------------------------------------------
     INITIALIZATION
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    Sidebar.init();
    NotificationBell.init();
    AvatarMenu.init();
    ChartInit.init();
    TableActions.init();
    DashboardSearch.init();
  });

  /* Expose chart functions globally for pages that need manual chart setup */
  window.MystCharts = {
    line: LineChart,
    bar: BarChart,
    donut: DonutChart,
    area: AreaChart,
    radar: RadarChart,
    heatmap: HeatmapChart
  };

})();
