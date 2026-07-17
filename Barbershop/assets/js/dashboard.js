/**
 * SHARP — Dashboard Charts (Chart.js v4)
 * Revenue line chart, service doughnut, and weekly bookings bar chart
 */

(function () {
  'use strict';

  // ── Color Helpers ──
  function getThemeColors() {
    var style = getComputedStyle(document.documentElement);
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      accent: style.getPropertyValue('--accent-primary').trim() || '#C9A227',
      text: isDark ? '#F5F0E8' : '#1C1C1E',
      textSub: isDark ? 'rgba(245,240,232,0.6)' : 'rgba(28,28,30,0.5)',
      gridColor: isDark ? 'rgba(245,240,232,0.08)' : 'rgba(28,28,30,0.08)',
      cardBg: isDark ? '#2A2A2C' : '#FFFFFF',
      green: '#22c55e',
      blue: '#3b82f6',
      rose: '#f43f5e',
      orange: '#f97316',
      purple: '#a855f7',
    };
  }

  // ── Default Font ──
  Chart.defaults.font.family = "'Inter', 'Roboto', sans-serif";
  Chart.defaults.font.size = 12;

  // ── Revenue Line Chart ──
  var revenueCtx = document.getElementById('revenue-chart');
  if (revenueCtx) {
    var colors = getThemeColors();
    var revenueChart = new Chart(revenueCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue ($)',
          data: [18200, 19400, 20100, 19800, 21500, 22800, 24580, 23900, 25200, 26100, 27300, 28400],
          borderColor: colors.accent,
          backgroundColor: function (context) {
            var chart = context.chart;
            var ctx2 = chart.ctx;
            var gradient = ctx2.createLinearGradient(0, 0, 0, chart.chartArea ? chart.chartArea.bottom : 300);
            gradient.addColorStop(0, 'rgba(201,162,39,0.3)');
            gradient.addColorStop(1, 'rgba(201,162,39,0.02)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.accent,
          pointBorderColor: colors.cardBg,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.text,
            titleColor: colors.cardBg,
            bodyColor: colors.cardBg,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (ctx) { return '$' + ctx.parsed.y.toLocaleString(); }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.textSub }
          },
          y: {
            grid: { color: colors.gridColor },
            ticks: {
              color: colors.textSub,
              callback: function (val) { return '$' + (val / 1000) + 'k'; }
            }
          }
        }
      }
    });
  }

  // ── Service Breakdown Doughnut ──
  var serviceCtx = document.getElementById('service-chart');
  if (serviceCtx) {
    var colors2 = getThemeColors();
    var serviceChart = new Chart(serviceCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Haircuts', 'Beard Trim', 'Hot Towel Shave', 'Hair Coloring', 'Packages'],
        datasets: [{
          data: [42, 22, 15, 10, 11],
          backgroundColor: [colors2.accent, colors2.green, colors2.blue, colors2.rose, colors2.purple],
          borderColor: colors2.cardBg,
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors2.text,
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: colors2.text,
            titleColor: colors2.cardBg,
            bodyColor: colors2.cardBg,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (ctx) { return ' ' + ctx.label + ': ' + ctx.parsed + '%'; }
            }
          }
        }
      }
    });
  }

  // ── Weekly Bookings Bar Chart ──
  var weeklyCtx = document.getElementById('weekly-chart');
  if (weeklyCtx) {
    var colors3 = getThemeColors();
    var weeklyChart = new Chart(weeklyCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Bookings',
          data: [28, 32, 24, 36, 42, 48, 0],
          backgroundColor: function (context) {
            var val = context.raw;
            return val === 0 ? 'rgba(128,128,128,0.2)' : colors3.accent;
          },
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors3.text,
            titleColor: colors3.cardBg,
            bodyColor: colors3.cardBg,
            padding: 12,
            displayColors: false,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors3.textSub }
          },
          y: {
            grid: { color: colors3.gridColor },
            ticks: { color: colors3.textSub },
            beginAtZero: true,
          }
        }
      }
    });
  }

})();
