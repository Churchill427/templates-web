/* ============================================================
   DENT — Dashboard JavaScript
   Sidebar toggle, stat counters, calendar rendering
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. SIDEBAR TOGGLE
  // ============================================================
  const Sidebar = {
    init() {
      this.sidebar = document.querySelector('.sidebar');
      this.main = document.querySelector('.dashboard__main');
      this.toggle = document.querySelector('.sidebar__toggle');
      this.mobileToggle = document.querySelector('.dashboard__mobile-toggle');

      if (!this.sidebar) return;

      this.toggle?.addEventListener('click', () => this.toggleSidebar());
      this.mobileToggle?.addEventListener('click', () => this.toggleMobile());

      // Close on mobile tap outside
      this.main?.addEventListener('click', () => {
        if (window.innerWidth <= 639 && this.sidebar.classList.contains('mobile-open')) {
          this.sidebar.classList.remove('mobile-open');
        }
      });
    },

    toggleSidebar() {
      this.sidebar.classList.toggle('collapsed');
      this.main?.classList.toggle('expanded');
    },

    toggleMobile() {
      this.sidebar.classList.toggle('mobile-open');
    }
  };

  // ============================================================
  // 2. STAT COUNTER ANIMATION
  // ============================================================
  const StatCounters = {
    init() {
      document.querySelectorAll('[data-stat]').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.animate(el);
            observer.unobserve(el);
          }
        }, { threshold: 0.5 });
        observer.observe(el);
      });
    },

    animate(el) {
      const target = parseInt(el.getAttribute('data-stat'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  };

  // ============================================================
  // 3. CALENDAR
  // ============================================================
  const Calendar = {
    init() {
      this.container = document.querySelector('.calendar');
      if (!this.container) return;

      this.grid = this.container.querySelector('.calendar__grid');
      this.title = this.container.querySelector('.calendar__title');
      this.prevBtn = this.container.querySelector('.calendar__prev');
      this.nextBtn = this.container.querySelector('.calendar__next');

      this.currentDate = new Date();
      this.month = this.currentDate.getMonth();
      this.year = this.currentDate.getFullYear();

      // Sample booked dates
      this.booked = [5, 8, 12, 15, 19, 22, 26];
      this.available = [3, 6, 9, 13, 16, 20, 23, 27];

      this.prevBtn?.addEventListener('click', () => { this.month--; if (this.month < 0) { this.month = 11; this.year--; } this.render(); });
      this.nextBtn?.addEventListener('click', () => { this.month++; if (this.month > 11) { this.month = 0; this.year++; } this.render(); });

      this.render();
    },

    render() {
      if (!this.grid) return;
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      if (this.title) this.title.textContent = `${months[this.month]} ${this.year}`;

      // Clear
      this.grid.innerHTML = '';

      // Day labels
      days.forEach(d => {
        const label = document.createElement('div');
        label.className = 'calendar__day-label';
        label.textContent = d;
        this.grid.appendChild(label);
      });

      // First day offset
      const firstDay = new Date(this.year, this.month, 1).getDay();
      const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
      const today = new Date();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar__day empty';
        this.grid.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar__day';
        dayEl.textContent = d;

        if (d === today.getDate() && this.month === today.getMonth() && this.year === today.getFullYear()) {
          dayEl.classList.add('today');
        } else if (this.booked.includes(d)) {
          dayEl.classList.add('booked');
        } else if (this.available.includes(d)) {
          dayEl.classList.add('available');
        }

        this.grid.appendChild(dayEl);
      }
    }
  };

  // ============================================================
  // INIT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    Sidebar.init();
    StatCounters.init();
    Calendar.init();
  });

})();
