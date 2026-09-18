/* ============================================================
   LUME — Workshops JS (Interactive Calendar)
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initCalendar();
  });

  // ════════════════════════════════════════════════════════════
  // INTERACTIVE AVAILABILITY CALENDAR
  // ════════════════════════════════════════════════════════════
  var currentMonth, currentYear;
  var classData = {
    // Format: 'YYYY-MM-DD': { title, time, spots }
  };

  function initCalendar() {
    var calendarEl = document.getElementById('workshop-calendar');
    if (!calendarEl) return;

    var now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();

    // Generate mock class dates
    generateClassDates();

    renderCalendar();

    var prevBtn = document.getElementById('cal-prev');
    var nextBtn = document.getElementById('cal-next');

    if (prevBtn) prevBtn.addEventListener('click', function () {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar();
    });

    if (nextBtn) nextBtn.addEventListener('click', function () {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar();
    });
  }

  function generateClassDates() {
    var now = new Date();
    var classes = ['Beginner Pour', 'Advanced Blending', 'Private Group'];
    var times = ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM', '6:00 PM - 8:00 PM'];

    for (var i = 3; i < 45; i += 3) {
      var d = new Date(now);
      d.setDate(d.getDate() + i);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      classData[key] = {
        title: classes[i % 3],
        time: times[i % 3],
        spots: Math.floor(Math.random() * 5) + 1
      };
    }
  }

  function renderCalendar() {
    var calGrid = document.getElementById('cal-grid');
    var calTitle = document.getElementById('cal-title');
    if (!calGrid || !calTitle) return;

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    calTitle.textContent = months[currentMonth] + ' ' + currentYear;

    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var today = new Date();

    var html = '';
    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (day) {
      html += '<div class="cal-header">' + day + '</div>';
    });

    // Empty cells before first day
    for (var i = 0; i < firstDay; i++) {
      html += '<div class="cal-cell cal-cell--empty"></div>';
    }

    // Days
    for (var d = 1; d <= daysInMonth; d++) {
      var dateKey = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var hasClass = classData[dateKey];
      var isToday = today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
      var isPast = new Date(currentYear, currentMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      var classes = 'cal-cell';
      if (hasClass && !isPast) classes += ' cal-cell--available';
      if (isToday) classes += ' cal-cell--today';
      if (isPast) classes += ' cal-cell--past';

      html += '<div class="' + classes + '" ' + (hasClass && !isPast ? 'data-date="' + dateKey + '"' : '') + '>' +
        '<span class="cal-day">' + d + '</span>' +
        (hasClass && !isPast ? '<span class="cal-dot"></span>' : '') +
        '</div>';
    }

    calGrid.innerHTML = html;

    // Click handlers
    calGrid.querySelectorAll('[data-date]').forEach(function (cell) {
      cell.addEventListener('click', function () {
        calGrid.querySelectorAll('.cal-cell--selected').forEach(function (c) {
          c.classList.remove('cal-cell--selected');
        });
        cell.classList.add('cal-cell--selected');
        var dateKey = cell.getAttribute('data-date');
        showDatePanel(dateKey);
      });
    });
  }

  function showDatePanel(dateKey) {
    var panel = document.getElementById('cal-panel');
    if (!panel) return;
    var data = classData[dateKey];
    if (!data) { panel.innerHTML = ''; return; }

    var parts = dateKey.split('-');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dateStr = months[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]) + ', ' + parts[0];

    panel.innerHTML =
      '<h4>' + data.title + '</h4>' +
      '<p style="color:var(--color-text-secondary);font-size:var(--small-size);margin-bottom:var(--space-xs);">' + dateStr + '</p>' +
      '<p style="color:var(--color-text-secondary);font-size:var(--small-size);margin-bottom:var(--space-xs);">' + data.time + '</p>' +
      '<p style="color:var(--color-primary);font-size:var(--small-size);font-weight:600;margin-bottom:var(--space-md);">' + data.spots + ' spots left</p>' +
      '<a href="#" class="btn btn--primary btn--sm btn--full">Reserve Seat</a>';
  }
})();
