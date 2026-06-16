/**
 * KILN Studio - Dashboard JavaScript
 * Requires Chart.js to be loaded on the page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Only run if we are on a dashboard page with canvases
  const canvases = document.querySelectorAll('canvas');
  if (canvases.length === 0 || typeof Chart === 'undefined') return;

  // Global Chart Defaults for Theme
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  Chart.defaults.color = isDark ? '#D4CFC8' : '#6E675F';
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Shared colors based on CSS variables
  const colors = {
    primary: '#C65D3B',
    primaryLight: 'rgba(198, 93, 59, 0.2)',
    secondary: '#5A8A6A',
    accent: '#D4C4A8',
    mixed: '#93BEA2'
  };

  /* ==========================================================================
     Admin Dashboard Charts
     ========================================================================== */
  
  // 1. Class Enrollment Trends (Line)
  const enrollmentCtx = document.getElementById('enrollmentChart');
  if (enrollmentCtx) {
    new Chart(enrollmentCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Enrollments',
          data: [65, 78, 90, 81, 112, 135, 120, 140, 155, 148, 160, 185],
          borderColor: colors.primary,
          backgroundColor: colors.primaryLight,
          tension: 0.4,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 2. Revenue by Service Type (Bar)
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: ['Wheel Throwing', 'Hand Building', 'Open Studio', 'Firing Services', 'Events'],
        datasets: [{
          label: 'Revenue ($)',
          data: [12500, 8400, 5200, 3100, 6800],
          backgroundColor: colors.secondary,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 3. Student Skill Level Distribution (Doughnut)
  const skillCtx = document.getElementById('skillChart');
  if (skillCtx) {
    new Chart(skillCtx, {
      type: 'doughnut',
      data: {
        labels: ['Beginner', 'Intermediate', 'Advanced'],
        datasets: [{
          data: [55, 30, 15],
          backgroundColor: [colors.accent, colors.secondary, colors.primary],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 4. Kiln Utilization (Bar/Stacked)
  const kilnCtx = document.getElementById('kilnChart');
  if (kilnCtx) {
    new Chart(kilnCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Bisque',
            data: [4, 2, 5, 3, 6, 8, 4],
            backgroundColor: colors.primary
          },
          {
            label: 'Glaze',
            data: [2, 5, 2, 6, 4, 3, 5],
            backgroundColor: colors.mixed
          }
        ]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    });
  }

  /* ==========================================================================
     User Dashboard Charts
     ========================================================================== */
  
  // 1. My Class Progress (Line)
  const progressCtx = document.getElementById('progressChart');
  if (progressCtx) {
    new Chart(progressCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [{
          label: 'Completed Pieces',
          data: [1, 2, 2, 4, 5],
          borderColor: colors.primary,
          backgroundColor: colors.primaryLight,
          tension: 0.3,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 2. Project Status (Bar)
  const statusCtx = document.getElementById('statusChart');
  if (statusCtx) {
    new Chart(statusCtx, {
      type: 'bar',
      data: {
        labels: ['WIP', 'Bisque Fired', 'Glazed', 'Completed'],
        datasets: [{
          label: 'Projects',
          data: [3, 5, 2, 8],
          backgroundColor: colors.secondary,
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 3. Studio Time Usage (Area)
  const usageCtx = document.getElementById('usageChart');
  if (usageCtx) {
    new Chart(usageCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Hours in Studio',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: colors.accent,
          backgroundColor: 'rgba(212, 196, 168, 0.5)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 4. Glaze Firing History (Doughnut)
  const historyCtx = document.getElementById('historyChart');
  if (historyCtx) {
    new Chart(historyCtx, {
      type: 'doughnut',
      data: {
        labels: ['Success', 'Crack', 'Color Issue', 'Perfect'],
        datasets: [{
          data: [60, 10, 15, 15],
          backgroundColor: [colors.secondary, colors.primary, colors.accent, colors.mixed],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

});
