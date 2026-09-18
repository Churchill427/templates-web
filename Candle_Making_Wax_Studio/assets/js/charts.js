// Canvas-based charting engine (Vanilla JS, no libraries)
// Custom built for LUME Admin Dashboard

window.initAdminCharts = function() {
  const revCanvas = document.getElementById('revenueChart');
  const scentCanvas = document.getElementById('scentChart');
  
  if (revCanvas) drawLineChart(revCanvas);
  if (scentCanvas) drawBarChart(scentCanvas);
};

function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#E5E1DC' : '#2B2622',
    textMuted: isDark ? '#9A8D80' : '#736B63',
    grid: isDark ? '#3D362F' : '#E8E1D7',
    primary: '#C97B3D',
    primaryBg: isDark ? 'rgba(201, 123, 61, 0.2)' : 'rgba(201, 123, 61, 0.1)'
  };
}

function drawLineChart(canvas) {
  const ctx = canvas.getContext('2d');
  const colors = getThemeColors();
  
  // Responsive sizing
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  
  const w = canvas.width;
  const h = canvas.height;
  const padding = 40;
  
  // Mock Data (30 days)
  const data = Array.from({length: 30}, (_, i) => Math.floor(Math.random() * 500) + 200 + (i * 10));
  const max = Math.max(...data) * 1.2;
  
  // Draw Grid
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for(let i = 0; i <= 4; i++) {
    const y = padding + (h - padding*2) * (i/4);
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    
    // Labels
    ctx.fillStyle = colors.textMuted;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const val = Math.round(max * (1 - i/4));
    ctx.fillText('$' + val, padding - 10, y);
  }
  ctx.stroke();
  
  // Draw Line
  ctx.beginPath();
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  
  const step = (w - padding*2) / (data.length - 1);
  
  data.forEach((val, i) => {
    const x = padding + (i * step);
    const y = h - padding - ((val / max) * (h - padding*2));
    if(i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  
  ctx.stroke();
  
  // Fill under line
  ctx.lineTo(w - padding, h - padding);
  ctx.lineTo(padding, h - padding);
  ctx.closePath();
  
  const grad = ctx.createLinearGradient(0, padding, 0, h - padding);
  grad.addColorStop(0, colors.primaryBg);
  grad.addColorStop(1, 'rgba(201, 123, 61, 0)');
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawBarChart(canvas) {
  const ctx = canvas.getContext('2d');
  const colors = getThemeColors();
  
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  
  const w = canvas.width;
  const h = canvas.height;
  const padding = 40;
  
  // Mock Data
  const labels = ['Amber', 'Matcha', 'Rose', 'Earl', 'Coastal'];
  const data = [142, 110, 95, 84, 60];
  const max = Math.max(...data) * 1.2;
  
  const barW = Math.min(40, ((w - padding*2) / data.length) - 10);
  const step = (w - padding*2) / data.length;
  
  data.forEach((val, i) => {
    const x = padding + (i * step) + (step/2) - (barW/2);
    const barH = (val / max) * (h - padding*2);
    const y = h - padding - barH;
    
    // Bar
    ctx.fillStyle = colors.primary;
    // draw rounded rect top
    ctx.beginPath();
    ctx.moveTo(x, h - padding);
    ctx.lineTo(x, y + 4);
    ctx.quadraticCurveTo(x, y, x + 4, y);
    ctx.lineTo(x + barW - 4, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + 4);
    ctx.lineTo(x + barW, h - padding);
    ctx.fill();
    
    // Label
    ctx.fillStyle = colors.textMuted;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(labels[i], x + barW/2, h - padding + 10);
  });
}

// Redraw on resize and theme change
window.addEventListener('resize', () => {
  if (typeof window.initAdminCharts === 'function') window.initAdminCharts();
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-theme') {
      if (typeof window.initAdminCharts === 'function') window.initAdminCharts();
    }
  });
});

observer.observe(document.documentElement, { attributes: true });
