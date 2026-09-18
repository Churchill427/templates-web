/**
 * SUDZ Dashboard specific functionality
 * Hand-written Canvas chart renderers without external libraries.
 */

class DashboardCharts {
  constructor() {
    this.charts = [];
    this.init();
    
    // Redraw on resize
    window.addEventListener('resize', this.debounce(() => this.redrawAll(), 250));
    
    // Redraw on theme change to update colors
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          this.redrawAll();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  init() {
    // Find all canvas elements with data-chart
    const canvasElements = document.querySelectorAll('canvas[data-chart]');
    
    canvasElements.forEach(canvas => {
      const type = canvas.dataset.chart;
      let data = [];
      
      try {
        if (canvas.dataset.data) {
          data = JSON.parse(canvas.dataset.data);
        }
      } catch (e) {
        console.error('Invalid chart data:', e);
      }
      
      this.charts.push({
        canvas: canvas,
        type: type,
        data: data
      });
    });
    
    this.redrawAll();
  }

  getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#E8E2D6' : '#232B27',
      textSecondary: isDark ? 'rgba(232, 226, 214, 0.6)' : 'rgba(35, 43, 39, 0.6)',
      grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      primary: isDark ? '#8FBCA6' : '#3E5C50',
      secondary: isDark ? '#D4915F' : '#C2764A',
      tertiary: isDark ? '#C4A090' : '#8B6B58'
    };
  }

  redrawAll() {
    this.charts.forEach(chart => {
      this.drawChart(chart);
    });
  }

  drawChart(chart) {
    const ctx = chart.canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Get actual size from CSS
    const rect = chart.canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Set actual size in memory (scaled to account for extra pixel density)
    chart.canvas.width = width * dpr;
    chart.canvas.height = height * dpr;
    
    // Normalize coordinate system to use css pixels
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const colors = this.getThemeColors();
    
    if (chart.type === 'line') {
      this.drawLineChart(ctx, width, height, chart.data, colors);
    } else if (chart.type === 'bar') {
      this.drawBarChart(ctx, width, height, chart.data, colors);
    } else if (chart.type === 'doughnut') {
      this.drawDoughnutChart(ctx, width, height, chart.data, colors);
    }
  }

  drawLineChart(ctx, width, height, data, colors) {
    if (!data || data.length === 0) return;
    
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find min and max
    const values = data.map(d => d.value);
    const maxVal = Math.max(...values, 10); // Minimum scale of 10
    
    // Draw Grid and Y-axis labels
    const gridLines = 5;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '10px Outfit, sans-serif';
    ctx.fillStyle = colors.textSecondary;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + chartHeight - (i / gridLines) * chartHeight;
      const val = Math.round((i / gridLines) * maxVal);
      
      // Label
      ctx.fillText(val, padding.left - 10, y);
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
    
    // X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    data.forEach((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      ctx.fillText(d.label, x, height - padding.bottom + 10);
    });
    
    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    data.forEach((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - (d.value / maxVal) * chartHeight;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw Area under line
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    // Convert hex to rgb for rgba
    let rgb = colors.primary === '#8FBCA6' ? '143, 188, 166' : '62, 92, 80';
    gradient.addColorStop(0, \`rgba(\${rgb}, 0.3)\`);
    gradient.addColorStop(1, \`rgba(\${rgb}, 0)\`);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw Points
    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = '#fff';
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      ctx.strokeStyle = '#232B27';
    }
    ctx.lineWidth = 2;
    
    data.forEach((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - (d.value / maxVal) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  drawBarChart(ctx, width, height, data, colors) {
    if (!data || data.length === 0) return;
    
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find max
    const values = data.map(d => d.value);
    const maxVal = Math.max(...values, 10);
    
    // Grid and Y-axis
    const gridLines = 4;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '10px Outfit, sans-serif';
    ctx.fillStyle = colors.textSecondary;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + chartHeight - (i / gridLines) * chartHeight;
      const val = Math.round((i / gridLines) * maxVal);
      ctx.fillText(val, padding.left - 10, y);
      
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
    
    // Bars
    const barWidth = Math.min(40, (chartWidth / data.length) * 0.6);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    data.forEach((d, i) => {
      const xCenter = padding.left + (i + 0.5) * (chartWidth / data.length);
      const x = xCenter - barWidth / 2;
      const barHeight = (d.value / maxVal) * chartHeight;
      const y = padding.top + chartHeight - barHeight;
      
      // Label
      ctx.fillStyle = colors.textSecondary;
      ctx.fillText(d.label, xCenter, height - padding.bottom + 10);
      
      // Bar
      ctx.fillStyle = colors.secondary;
      // Round top corners
      const radius = Math.min(4, barHeight / 2);
      ctx.beginPath();
      ctx.moveTo(x, y + barHeight);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, y + barHeight);
      ctx.closePath();
      ctx.fill();
    });
  }

  drawDoughnutChart(ctx, width, height, data, colors) {
    if (!data || data.length === 0) return;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 * 0.8;
    const innerRadius = radius * 0.6;
    
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let startAngle = -Math.PI / 2; // Start at top
    
    const palette = [colors.primary, colors.secondary, colors.tertiary, '#A8C4B8'];
    
    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      
      // Small gap between slices
      ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#232B27' : '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      startAngle = endAngle;
    });
    
    // Draw total in center
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.fillText(total, centerX, centerY - 5);
    
    ctx.fillStyle = colors.textSecondary;
    ctx.font = '12px Outfit, sans-serif';
    ctx.fillText('Total', centerX, centerY + 15);
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.dashboardCharts = new DashboardCharts();
});
