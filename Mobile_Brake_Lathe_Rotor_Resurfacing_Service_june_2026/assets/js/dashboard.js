/* ============================================================
   BRAKE — Dashboard JavaScript
   dashboard.js
   Sidebar, Tables, Calendar, Data, Tab Switching
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. SIDEBAR
     -------------------------------------------------------- */
  const Sidebar = {
    init() {
      this.sidebar = document.querySelector('.sidebar');
      this.toggleBtn = document.querySelector('.sidebar-toggle');
      this.main = document.querySelector('.dashboard-main');
      this.mobileToggle = document.querySelector('.sidebar-mobile-toggle');
      this.overlay = document.querySelector('.sidebar-overlay');

      this.toggleBtn?.addEventListener('click', () => this.toggle());
      this.mobileToggle?.addEventListener('click', () => this.toggleMobile());
      this.overlay?.addEventListener('click', () => this.closeMobile());

      // Active link
      const currentPage = window.location.pathname.split('/').pop();
      document.querySelectorAll('.sidebar-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.split('/').pop() === currentPage) {
          link.classList.add('active');
        }
      });

      // Close sidebar on mobile/tablet when clicking outside
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && this.sidebar?.classList.contains('mobile-open')) {
          if (!this.sidebar.contains(e.target) && !this.mobileToggle?.contains(e.target) && !this.overlay?.contains(e.target)) {
            this.closeMobile();
          }
        }
      });
    },

    toggle() {
      if (window.innerWidth <= 1024) {
        this.closeMobile();
      } else {
        this.sidebar?.classList.toggle('collapsed');
      }
    },

    toggleMobile() {
      const isOpen = this.sidebar?.classList.toggle('mobile-open');
      this.overlay?.classList.toggle('open', isOpen);
    },

    closeMobile() {
      this.sidebar?.classList.remove('mobile-open');
      this.overlay?.classList.remove('open');
    }
  };

  /* --------------------------------------------------------
     2. DASHBOARD TABS
     -------------------------------------------------------- */
  const DashTabs = {
    init() {
      document.querySelectorAll('.dash-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const container = tab.closest('[data-tabs]') || tab.parentElement.parentElement;
          const tabs = container.querySelectorAll('.dash-tab');
          const panels = container.querySelectorAll('.dash-panel');

          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          const target = document.getElementById(tab.dataset.target);
          if (target) {
            target.classList.add('active');
            // Trigger window resize event to redraw/animate charts inside the newly visible tab
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 50);
          }
        });
      });
    }
  };

  /* --------------------------------------------------------
     3. DATA TABLE (with Search, Filter, Pagination)
     -------------------------------------------------------- */
  const DataTable = {
    init() {
      document.querySelectorAll('[data-table]').forEach(wrapper => {
        const searchInput = wrapper.querySelector('.table-search');
        const filterSelect = wrapper.querySelector('.table-filter');
        const table = wrapper.querySelector('table');
        const tbody = table?.querySelector('tbody');
        const paginationEl = wrapper.querySelector('.table-pagination');
        const rows = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];
        const perPage = 8;
        let currentPage = 1;
        let filteredRows = [...rows];

        const filter = () => {
          const search = (searchInput?.value || '').toLowerCase();
          const status = filterSelect?.value || 'all';

          filteredRows = rows.filter(row => {
            const text = row.textContent.toLowerCase();
            const rowStatus = row.dataset.status || '';
            const matchSearch = text.includes(search);
            const matchFilter = status === 'all' || rowStatus === status;
            return matchSearch && matchFilter;
          });

          currentPage = 1;
          render();
        };

        const render = () => {
          rows.forEach(r => r.style.display = 'none');
          const start = (currentPage - 1) * perPage;
          const end = start + perPage;
          filteredRows.slice(start, end).forEach(r => r.style.display = '');

          // Pagination
          if (paginationEl) {
            const totalPages = Math.ceil(filteredRows.length / perPage);
            let html = '';
            html += `<button class="btn btn-sm btn-ghost" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&laquo;</button>`;
            for (let i = 1; i <= totalPages; i++) {
              html += `<button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-ghost'}" data-page="${i}">${i}</button>`;
            }
            html += `<button class="btn btn-sm btn-ghost" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">&raquo;</button>`;
            paginationEl.innerHTML = html;

            paginationEl.querySelectorAll('button[data-page]').forEach(btn => {
              btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page >= 1 && page <= totalPages) {
                  currentPage = page;
                  render();
                }
              });
            });
          }
        };

        searchInput?.addEventListener('input', filter);
        filterSelect?.addEventListener('change', filter);

        filter(); // Initial render
      });
    }
  };

  /* --------------------------------------------------------
     4. CALENDAR
     -------------------------------------------------------- */
  const Calendar = {
    init() {
      const calendarEl = document.getElementById('service-calendar');
      if (!calendarEl) return;

      this.el = calendarEl;
      this.currentDate = new Date();
      this.bookings = this.generateMockBookings();

      this.render();

      // Navigation
      document.getElementById('cal-prev')?.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
      });

      document.getElementById('cal-next')?.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
      });
    },

    generateMockBookings() {
      const bookings = {};
      const today = new Date();
      for (let i = -15; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        if (Math.random() > 0.4) {
          const key = d.toISOString().split('T')[0];
          bookings[key] = Math.floor(Math.random() * 4) + 1;
        }
      }
      return bookings;
    },

    render() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Header
      const headerEl = document.getElementById('cal-header');
      if (headerEl) headerEl.textContent = `${monthNames[month]} ${year}`;

      let html = '';
      dayNames.forEach(d => {
        html += `<div class="calendar-header-cell">${d}</div>`;
      });

      // Empty cells
      for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-cell" style="opacity:0.3"></div>`;
      }

      // Day cells
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        const bookingCount = this.bookings[dateStr] || 0;

        let dots = '';
        const dotColors = ['green', 'blue', 'orange', 'red'];
        for (let i = 0; i < Math.min(bookingCount, 4); i++) {
          dots += `<span class="calendar-dot ${dotColors[i]}"></span>`;
        }

        html += `
          <div class="calendar-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
            <span class="calendar-date">${day}</span>
            <div style="margin-top:4px">${dots}</div>
          </div>`;
      }

      this.el.innerHTML = html;
    }
  };

  /* --------------------------------------------------------
     5. NOTIFICATION DROPDOWN
     -------------------------------------------------------- */
  const Notifications = {
    init() {
      const btn = document.querySelector('.notification-btn');
      const dropdown = document.querySelector('.notification-dropdown');
      if (!btn || !dropdown) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    }
  };

  /* --------------------------------------------------------
     6. MOCK DATA FOR ADMIN DASHBOARD CHARTS
     -------------------------------------------------------- */
  const AdminCharts = {
    init() {
      if (!document.getElementById('admin-line-chart')) return;

      // Line Chart — Bookings over 30 days
      new BrakeCharts.LineChart('admin-line-chart', {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Bookings',
          data: [28, 45, 38, 52],
          color: '#C41E3A'
        }]
      });

      // Bar Chart — Revenue by service
      new BrakeCharts.BarChart('admin-bar-chart', {
        labels: ['Rotor', 'Pads', 'Drum', 'Caliper', 'Fluid', 'Inspect'],
        datasets: [{
          label: 'Revenue ($)',
          data: [4200, 3100, 1800, 2400, 900, 1200],
          color: '#FF6B35'
        }]
      });

      // Doughnut Chart — Service distribution
      new BrakeCharts.DoughnutChart('admin-doughnut-chart', {
        labels: ['Rotor', 'Pads', 'Drum', 'Other'],
        values: [42, 28, 18, 12],
        colors: ['#C41E3A', '#FF6B35', '#3B82F6', '#22C55E']
      });

      // Area Chart — Monthly growth
      new BrakeCharts.AreaChart('admin-area-chart', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Growth',
          data: [120, 145, 168, 190, 225, 260],
          color: '#22C55E'
        }]
      });
    }
  };

  /* --------------------------------------------------------
     7. MOCK DATA FOR ADMIN REPORTS CHARTS
     -------------------------------------------------------- */
  const AdminReports = {
    init() {
      if (!document.getElementById('report-bar-chart')) return;

      // Bar — Weekly revenue
      new BrakeCharts.BarChart('report-bar-chart', {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'This Week',
          data: [850, 1200, 980, 1450, 1100, 750],
          color: '#C41E3A'
        }, {
          label: 'Last Week',
          data: [700, 900, 1100, 1200, 950, 600],
          color: '#3B82F6'
        }]
      });

      // Line — Customer acquisition
      new BrakeCharts.LineChart('report-line-chart', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Customers',
          data: [15, 22, 28, 35, 42, 56],
          color: '#FF6B35'
        }]
      });

      // Pie — Service popularity
      new BrakeCharts.DoughnutChart('report-pie-chart', {
        labels: ['Resurface', 'Pads', 'Drum', 'Fluid', 'Inspect'],
        values: [35, 25, 15, 12, 13],
        colors: ['#C41E3A', '#FF6B35', '#3B82F6', '#22C55E', '#F59E0B']
      }, { isPie: true });

      // Horizontal Bar — Tech performance
      new BrakeCharts.HorizontalBarChart('report-hbar-chart', {
        labels: ['Mike R.', 'Sarah J.', 'David L.', 'Amy K.'],
        values: [48, 42, 38, 35],
        colors: ['#C41E3A', '#FF6B35', '#3B82F6', '#22C55E']
      });
    }
  };

  /* --------------------------------------------------------
     8. MOCK DATA FOR USER DASHBOARD CHARTS
     -------------------------------------------------------- */
  const UserCharts = {
    init() {
      if (!document.getElementById('user-line-chart')) return;

      // Line — Service history
      new BrakeCharts.LineChart('user-line-chart', {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        datasets: [{
          label: 'Services',
          data: [1, 2, 1, 3, 2, 1],
          color: '#C41E3A'
        }]
      });

      // Bar — Maintenance costs
      new BrakeCharts.BarChart('user-bar-chart', {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        datasets: [{
          label: 'Cost ($)',
          data: [150, 320, 180, 450, 280, 120],
          color: '#FF6B35'
        }]
      });

      // Doughnut — Service types
      new BrakeCharts.DoughnutChart('user-doughnut-chart', {
        labels: ['Rotor', 'Pads', 'Inspect'],
        values: [4, 3, 3],
        colors: ['#C41E3A', '#FF6B35', '#3B82F6']
      });

      // Area — Vehicle health score
      new BrakeCharts.AreaChart('user-area-chart', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Health Score',
          data: [72, 68, 75, 82, 88, 92],
          color: '#22C55E'
        }]
      });
    }
  };

  /* --------------------------------------------------------
     9. INITIALIZATION
     -------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    Sidebar.init();
    DashTabs.init();
    DataTable.init();
    Calendar.init();
    Notifications.init();
    AdminCharts.init();
    AdminReports.init();
    UserCharts.init();
  });

})();
