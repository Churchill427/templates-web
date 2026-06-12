/* ============================================================
   HIDE LEATHER WORKS — Dashboard JavaScript
   Handles: Sidebar Toggle, Charts (Chart.js), Drag-Drop,
   File Upload, Sketch Viewer, Material Preview, Chat
   ============================================================ */

'use strict';

// ============================================================
// 1. SIDEBAR MANAGEMENT
// ============================================================
const Sidebar = {
  init() {
    this.sidebar = document.querySelector('.sidebar');
    this.toggleBtn = document.querySelector('.sidebar__toggle');
    this.mobileToggle = document.getElementById('sidebar-mobile-toggle');

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile sidebar on overlay click
    document.addEventListener('click', (e) => {
      if (this.sidebar && this.sidebar.classList.contains('mobile-open') && !this.sidebar.contains(e.target) && !this.mobileToggle.contains(e.target)) {
        this.sidebar.classList.remove('mobile-open');
      }
    });
  },

  toggle() {
    if (this.sidebar) {
      this.sidebar.classList.toggle('collapsed');
      // Re-render charts when sidebar changes width
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 350);
    }
  },

  toggleMobile() {
    if (this.sidebar) {
      this.sidebar.classList.toggle('mobile-open');
    }
  }
};

// ============================================================
// 2. CHART INITIALIZATION (Chart.js)
// ============================================================
const DashboardCharts = {
  // Common chart options
  baseOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { family: "'Inter', sans-serif", size: 12 },
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 20, 10, 0.9)',
        titleFont: { family: "'Inter', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    }
  },

  getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      primary: isDark ? '#A0622D' : '#8B4513',
      accent: isDark ? '#CC8844' : '#B87333',
      success: '#2E7D32',
      warning: '#FF8F00',
      error: '#C62828',
      info: '#1565C0',
      gridColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      textColor: isDark ? '#A89F91' : '#6D5E54'
    };
  },

  init() {
    if (typeof Chart === 'undefined') return;

    const colors = this.getColors();

    // Detect which dashboard we're on
    const isAdmin = document.getElementById('admin-dashboard') !== null;
    const isUser = document.getElementById('user-dashboard') !== null;

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = colors.textColor;

    if (isAdmin) this.initAdminCharts(colors);
    if (isUser) this.initUserCharts(colors);
  },

  // --- ADMIN DASHBOARD CHARTS ---
  initAdminCharts(colors) {
    // 1. Line Chart: Monthly Revenue
    const revenueCtx = document.getElementById('chart-revenue');
    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue ($)',
            data: [12400, 15200, 13800, 18600, 21000, 24500, 19800, 22300, 26100, 28400, 31200, 34800],
            borderColor: colors.accent,
            backgroundColor: 'rgba(184, 115, 51, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors.accent,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2.5
          }]
        },
        options: {
          ...this.baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: colors.gridColor },
              ticks: { callback: (v) => '$' + (v / 1000) + 'k' }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Bar Chart: Order Status
    const ordersCtx = document.getElementById('chart-orders');
    if (ordersCtx) {
      new Chart(ordersCtx, {
        type: 'bar',
        data: {
          labels: ['Pending', 'In Production', 'Shipped', 'Delivered'],
          datasets: [{
            label: 'Orders',
            data: [8, 14, 6, 42],
            backgroundColor: [colors.warning, colors.primary, colors.info, colors.success],
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 40
          }]
        },
        options: {
          ...this.baseOptions,
          scales: {
            y: { beginAtZero: true, grid: { color: colors.gridColor } },
            x: { grid: { display: false } }
          },
          plugins: { ...this.baseOptions.plugins, legend: { display: false } }
        }
      });
    }

    // 3. Pie Chart: Customer Acquisition
    const acquisitionCtx = document.getElementById('chart-acquisition');
    if (acquisitionCtx) {
      new Chart(acquisitionCtx, {
        type: 'doughnut',
        data: {
          labels: ['Referrals', 'Social Media', 'Search Engine', 'Direct', 'Partnerships'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [colors.primary, colors.accent, colors.success, colors.info, colors.warning],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          ...this.baseOptions,
          cutout: '65%',
          plugins: {
            ...this.baseOptions.plugins,
            legend: { ...this.baseOptions.plugins.legend, position: 'bottom' }
          }
        }
      });
    }

    // 4. Area Chart: Production Capacity
    const capacityCtx = document.getElementById('chart-capacity');
    if (capacityCtx) {
      new Chart(capacityCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
          datasets: [
            {
              label: 'Capacity',
              data: [20, 20, 20, 22, 22, 22, 24, 24],
              borderColor: colors.success,
              backgroundColor: 'rgba(46, 125, 50, 0.08)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
              borderDash: [6, 3],
              pointRadius: 3
            },
            {
              label: 'Demand',
              data: [15, 18, 16, 21, 19, 23, 20, 22],
              borderColor: colors.accent,
              backgroundColor: 'rgba(184, 115, 51, 0.08)',
              fill: true,
              tension: 0.3,
              borderWidth: 2.5,
              pointRadius: 3
            }
          ]
        },
        options: {
          ...this.baseOptions,
          scales: {
            y: { beginAtZero: true, grid: { color: colors.gridColor }, title: { display: true, text: 'Orders / Week' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  },

  // --- USER DASHBOARD CHARTS ---
  initUserCharts(colors) {
    // 1. Line Chart: Order History
    const historyCtx = document.getElementById('chart-order-history');
    if (historyCtx) {
      new Chart(historyCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Orders Placed',
            data: [1, 0, 2, 1, 0, 1, 2, 1, 0, 1, 1, 2],
            borderColor: colors.accent,
            backgroundColor: 'rgba(184, 115, 51, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors.accent,
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 2.5
          }]
        },
        options: {
          ...this.baseOptions,
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: colors.gridColor } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Bar Chart: Gear Types Ordered
    const gearCtx = document.getElementById('chart-gear-types');
    if (gearCtx) {
      new Chart(gearCtx, {
        type: 'bar',
        data: {
          labels: ['IWB Holsters', 'OWB Holsters', 'Knife Sheaths', 'Mag Pouches', 'Belts'],
          datasets: [{
            label: 'Orders',
            data: [4, 2, 3, 2, 1],
            backgroundColor: [colors.primary, colors.accent, colors.success, colors.warning, colors.info],
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 32
          }]
        },
        options: {
          ...this.baseOptions,
          indexAxis: 'y',
          scales: {
            x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: colors.gridColor } },
            y: { grid: { display: false } }
          },
          plugins: { ...this.baseOptions.plugins, legend: { display: false } }
        }
      });
    }

    // 3. Pie Chart: Sketch Approval Status
    const sketchCtx = document.getElementById('chart-sketch-status');
    if (sketchCtx) {
      new Chart(sketchCtx, {
        type: 'doughnut',
        data: {
          labels: ['Approved', 'Pending Review', 'Revisions Requested'],
          datasets: [{
            data: [8, 2, 1],
            backgroundColor: [colors.success, colors.warning, colors.error],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          ...this.baseOptions,
          cutout: '65%',
          plugins: {
            ...this.baseOptions.plugins,
            legend: { ...this.baseOptions.plugins.legend, position: 'bottom' }
          }
        }
      });
    }

    // 4. Area Chart: Production Progress
    const progressCtx = document.getElementById('chart-production-progress');
    if (progressCtx) {
      new Chart(progressCtx, {
        type: 'line',
        data: {
          labels: ['Ordered', 'Sketch Sent', 'Approved', 'Cutting', 'Stitching', 'Molding', 'Finishing', 'QA', 'Shipped'],
          datasets: [{
            label: 'Current Order',
            data: [100, 100, 100, 100, 100, 75, 0, 0, 0],
            borderColor: colors.accent,
            backgroundColor: 'rgba(184, 115, 51, 0.12)',
            fill: true,
            tension: 0.2,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: colors.accent
          }]
        },
        options: {
          ...this.baseOptions,
          scales: {
            y: {
              beginAtZero: true, max: 100, grid: { color: colors.gridColor },
              ticks: { callback: (v) => v + '%' }
            },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          },
          plugins: { ...this.baseOptions.plugins, legend: { display: false } }
        }
      });
    }
  }
};

// ============================================================
// 3. KANBAN DRAG & DROP (Admin Dashboard)
// ============================================================
const KanbanBoard = {
  init() {
    const columns = document.querySelectorAll('.kanban__column');
    if (!columns.length) return;

    columns.forEach(column => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.style.background = 'rgba(184, 115, 51, 0.05)';
        const dragging = document.querySelector('.kanban__card.dragging');
        const afterElement = this.getDragAfterElement(column, e.clientY);
        const cardArea = column.querySelector('.kanban__cards');
        if (cardArea && dragging) {
          if (afterElement == null) {
            cardArea.appendChild(dragging);
          } else {
            cardArea.insertBefore(dragging, afterElement);
          }
        }
      });

      column.addEventListener('dragleave', () => {
        column.style.background = '';
      });

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.style.background = '';
        // Update count
        this.updateCounts();
      });
    });

    document.querySelectorAll('.kanban__card').forEach(card => {
      card.setAttribute('draggable', 'true');
      card.addEventListener('dragstart', () => card.classList.add('dragging'));
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });
  },

  getDragAfterElement(column, y) {
    const cards = [...column.querySelectorAll('.kanban__card:not(.dragging)')];
    return cards.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },

  updateCounts() {
    document.querySelectorAll('.kanban__column').forEach(col => {
      const count = col.querySelectorAll('.kanban__card').length;
      const countEl = col.querySelector('.kanban__column-count');
      if (countEl) countEl.textContent = count;
    });
  }
};

// ============================================================
// 4. SKETCH VIEWER (User Dashboard)
// ============================================================
const SketchViewer = {
  init() {
    const viewer = document.getElementById('sketch-viewer');
    if (!viewer) return;

    let scale = 1;
    let panning = false;
    let start = { x: 0, y: 0 };
    let offset = { x: 0, y: 0 };
    const img = viewer.querySelector('img');
    if (!img) return;

    // Zoom
    viewer.addEventListener('wheel', (e) => {
      e.preventDefault();
      scale += e.deltaY * -0.001;
      scale = Math.min(Math.max(0.5, scale), 3);
      img.style.transform = `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`;
    });

    // Pan
    viewer.addEventListener('mousedown', (e) => {
      panning = true;
      start = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      viewer.style.cursor = 'grabbing';
    });

    viewer.addEventListener('mousemove', (e) => {
      if (!panning) return;
      offset = { x: e.clientX - start.x, y: e.clientY - start.y };
      img.style.transform = `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`;
    });

    window.addEventListener('mouseup', () => {
      panning = false;
      if (viewer) viewer.style.cursor = 'grab';
    });
  }
};

// ============================================================
// 5. MATERIAL COMBINATION PREVIEW (User Dashboard)
// ============================================================
const MaterialPreview = {
  init() {
    const previewBox = document.getElementById('material-preview');
    if (!previewBox) return;

    document.querySelectorAll('[data-material-select]').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const type = swatch.dataset.materialSelect;
        const color = swatch.dataset.materialColor;
        const name = swatch.dataset.materialName;

        // Update preview
        const section = previewBox.querySelector(`[data-preview="${type}"]`);
        if (section) {
          section.style.background = color;
          const label = section.querySelector('.preview-label');
          if (label) label.textContent = name;
        }

        // Highlight selected swatch
        swatch.closest('.swatch-grid').querySelectorAll('[data-material-select]').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
      });
    });
  }
};

// ============================================================
// 6. SIMULATED CHAT (User Dashboard)
// ============================================================
const ChatInterface = {
  init() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');

    if (!form || !input || !messages) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      // Add sent message
      this.addMessage(messages, text, 'sent');
      input.value = '';

      // Simulate response after delay
      setTimeout(() => {
        const responses = [
          "Thank you for your message! I'll review the details and get back to you shortly.",
          "Got it. Let me check on the status of your order and I'll update you within the hour.",
          "Great choice on the leather selection. I'll incorporate that into the design sketch.",
          "Your gear dimensions look good. I'll start the pattern layout today.",
          "I appreciate the feedback on the sketch. I'll make those revisions and send an updated version."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(messages, randomResponse, 'received');
      }, 1200);
    });
  },

  addMessage(container, text, type) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const bubble = document.createElement('div');
    bubble.innerHTML = `
      <div class="chat__bubble chat__bubble--${type}">${text}</div>
      <p class="chat__bubble-time" style="text-align:${type === 'sent' ? 'right' : 'left'};">${time}</p>
    `;

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }
};

// ============================================================
// 7. INITIALIZE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  Sidebar.init();
  KanbanBoard.init();
  SketchViewer.init();
  MaterialPreview.init();
  ChatInterface.init();

  // Wait for Chart.js to load then init charts
  if (typeof Chart !== 'undefined') {
    DashboardCharts.init();
  } else {
    // Chart.js may load async via CDN
    window.addEventListener('load', () => {
      if (typeof Chart !== 'undefined') {
        DashboardCharts.init();
      }
    });
  }
});
