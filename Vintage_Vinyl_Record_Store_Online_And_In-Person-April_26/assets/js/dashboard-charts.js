/**
 * Dashboard Charts for Vintage Vinyl
 * Uses Chart.js for interactive visualizations
 */

const DashboardCharts = (() => {
  let charts = {};

  // Theme-aware colors
  const getThemeColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#94a3b8' : '#64748b',
      grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      accent: '#ffd700',
      accentTransparent: 'rgba(255, 215, 0, 0.2)',
      success: '#2ecc71',
      error: '#ff4d4d',
      info: '#4d79ff',
      warning: '#f1c40f'
    };
  };

  const chartOptions = (title, showLegend = false) => {
    const colors = getThemeColors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          labels: { color: colors.text, font: { family: 'Inter, sans-serif', size: 11 } }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { family: 'Outfit, sans-serif' },
          bodyFont: { family: 'Inter, sans-serif' },
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.text, font: { size: 10 } }
        },
        y: {
          grid: { color: colors.grid },
          ticks: { color: colors.text, font: { size: 10 } }
        }
      }
    };
  };

  const initAdminCharts = () => {
    const colors = getThemeColors();

    // 1. Sales Overview (Bar Chart)
    const salesCtx = document.getElementById('salesOverviewChart');
    if (salesCtx) {
      charts.sales = new Chart(salesCtx, {
        type: 'bar',
        data: {
          labels: ['1', '5', '10', '15', '20', '25', '30'],
          datasets: [{
            label: 'Sales ($)',
            data: [420, 580, 490, 820, 750, 610, 940],
            backgroundColor: colors.accent,
            borderRadius: 4,
            hoverBackgroundColor: '#e6c200'
          }]
        },
        options: chartOptions('Sales Overview')
      });
    }

    // 2. Genre Distribution (Doughnut)
    const genreCtx = document.getElementById('genreDistributionChart');
    if (genreCtx) {
      charts.genre = new Chart(genreCtx, {
        type: 'doughnut',
        data: {
          labels: ['Jazz', 'Rock', 'Electronic', 'Classical'],
          datasets: [{
            data: [40, 30, 20, 10],
            backgroundColor: [colors.accent, colors.error, colors.info, colors.success],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          ...chartOptions('Genre Distribution', true),
          cutout: '70%'
        }
      });
    }

    // 3. User Growth (Line)
    const userCtx = document.getElementById('userGrowthChart');
    if (userCtx) {
      charts.userGrowth = new Chart(userCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Active Users',
            data: [120, 150, 140, 190, 230, 210, 280],
            borderColor: colors.accent,
            backgroundColor: colors.accentTransparent,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: chartOptions('User Growth')
      });
    }

    // 4. Inventory Health (Polar Area)
    const invCtx = document.getElementById('inventoryHealthChart');
    if (invCtx) {
      charts.inventory = new Chart(invCtx, {
        type: 'polarArea',
        data: {
          labels: ['In Stock', 'Low Stock', 'Out'],
          datasets: [{
            data: [80, 30, 10],
            backgroundColor: [
              'rgba(46, 204, 113, 0.5)',
              'rgba(241, 196, 15, 0.5)',
              'rgba(231, 76, 60, 0.5)'
            ],
            borderColor: [colors.success, colors.warning, colors.error],
            borderWidth: 1
          }]
        },
        options: {
          ...chartOptions('Inventory Health', true),
          scales: {
            r: {
              grid: { color: colors.grid },
              ticks: { display: false }
            }
          }
        }
      });
    }
  };

  const initCustomerCharts = () => {
    const colors = getThemeColors();

    // 1. Listening Activity (Line)
    const listenCtx = document.getElementById('listeningActivityChart');
    if (listenCtx) {
      charts.listening = new Chart(listenCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Sessions',
            data: [12, 5, 18, 10, 25, 10, 22, 4, 14, 30, 20, 12],
            borderColor: colors.accent,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: colors.accent
          }]
        },
        options: chartOptions('Listening Activity')
      });
    }

    // 2. Genre Breakdown (Doughnut)
    const custGenreCtx = document.getElementById('customerGenreChart');
    if (custGenreCtx) {
      charts.custGenre = new Chart(custGenreCtx, {
        type: 'doughnut',
        data: {
          labels: ['Jazz & Soul', 'Rock', 'Other'],
          datasets: [{
            data: [75, 15, 10],
            backgroundColor: [colors.accent, colors.error, colors.info],
            borderWidth: 0
          }]
        },
        options: {
          ...chartOptions('Genre Breakdown', true),
          cutout: '70%'
        }
      });
    }

    // 3. Collection Value (Bar)
    const collCtx = document.getElementById('collectionValueChart');
    if (collCtx) {
      charts.collection = new Chart(collCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Value ($)',
            data: [420, 600, 520, 890, 740, 1240],
            backgroundColor: colors.accent,
            borderRadius: 4
          }]
        },
        options: chartOptions('Collection Value')
      });
    }

    // 4. Spending History (Line Area)
    const spendCtx = document.getElementById('customerSpendingChart');
    if (spendCtx) {
      charts.spending = new Chart(spendCtx, {
        type: 'line',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4'],
          datasets: [{
            label: 'Spending',
            data: [45, 82, 35, 120],
            borderColor: colors.success,
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: chartOptions('Spending History')
      });
    }
  };

  const updateChartColors = () => {
    const colors = getThemeColors();
    Object.values(charts).forEach(chart => {
      chart.options.scales.x.ticks.color = colors.text;
      chart.options.scales.y.ticks.color = colors.text;
      chart.options.scales.y.grid.color = colors.grid;
      if (chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = colors.text;
      }
      if (chart.options.scales.r) {
        chart.options.scales.r.grid.color = colors.grid;
      }
      chart.update();
    });
  };

  const init = () => {
    initAdminCharts();
    initCustomerCharts();

    // Listen for theme changes from ThemeSwitcher
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateChartColors();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', DashboardCharts.init);
