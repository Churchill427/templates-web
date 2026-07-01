document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Toggle Logic
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
      }
      
      // Trigger resize to fix canvas charts layout
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    });
  }

  // --- Custom Canvas Charts ---
  const colors = {
    primary: '#2D5016',
    secondary: '#D4A574',
    tertiary: '#8b9a7c',
    quaternary: '#e6c8ab',
    bg: '#F5F0E8',
    text: '#2C2416',
    grid: 'rgba(44, 36, 22, 0.1)'
  };

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function getThemeColors() {
    const dark = isDarkTheme();
    return {
      text: dark ? '#E8E0D5' : '#2C2416',
      grid: dark ? 'rgba(232, 224, 213, 0.1)' : 'rgba(44, 36, 22, 0.1)',
      cardBg: dark ? '#262626' : '#fff',
      primary: dark ? '#8EAA7E' : '#2D5016',
      secondary: dark ? '#E2B98E' : '#D4A574',
      tertiary: dark ? '#5C7A4E' : '#8b9a7c',
      quaternary: dark ? '#4A4A4A' : '#e6c8ab',
      areaGradientStart: dark ? 'rgba(142, 170, 126, 0.5)' : 'rgba(45, 80, 22, 0.5)',
      areaGradientEnd: dark ? 'rgba(142, 170, 126, 0.0)' : 'rgba(45, 80, 22, 0.0)'
    };
  }

  function drawLineChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function draw() {
      const theme = getThemeColors();
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);

      const padding = 40;
      const chartW = w - padding * 2;
      const chartH = h - padding * 2;

      const maxVal = Math.max(...data) * 1.2;

      // Draw Grid
      ctx.beginPath();
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartH / 5) * i;
        ctx.moveTo(padding, y);
        ctx.lineTo(w - padding, y);
      }
      ctx.stroke();

      // Draw Labels
      ctx.fillStyle = theme.text;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      
      const stepX = chartW / (data.length - 1);
      
      // Draw Line
      ctx.beginPath();
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3;
      
      data.forEach((val, i) => {
        const x = padding + i * stepX;
        const y = padding + chartH - (val / maxVal) * chartH;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Draw X Label
        if (i % 2 === 0) {
          ctx.fillText(labels[i], x, h - padding / 2);
        }
      });
      ctx.stroke();

      // Draw Points
      data.forEach((val, i) => {
        const x = padding + i * stepX;
        const y = padding + chartH - (val / maxVal) * chartH;
        ctx.beginPath();
        ctx.fillStyle = theme.cardBg;
        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 2;
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    draw();
    window.addEventListener('resize', draw);
    // Observe theme changes
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function drawBarChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function draw() {
      const theme = getThemeColors();
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const padding = 40;
      const chartW = w - padding * 2;
      const chartH = h - padding * 2;
      const maxVal = Math.max(...data) * 1.2;

      const barW = (chartW / data.length) * 0.6;
      const stepX = chartW / data.length;

      // Grid
      ctx.beginPath();
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartH / 4) * i;
        ctx.moveTo(padding, y);
        ctx.lineTo(w - padding, y);
      }
      ctx.stroke();

      // Bars
      data.forEach((val, i) => {
        const x = padding + i * stepX + (stepX - barW) / 2;
        const barH = (val / maxVal) * chartH;
        const y = padding + chartH - barH;

        ctx.fillStyle = theme.secondary;
        // Draw-in animation simulation by just drawing it normally for now
        ctx.fillRect(x, y, barW, barH);

        // Labels
        ctx.fillStyle = theme.text;
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barW / 2, h - padding / 2 + 5);
      });
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function drawDonutChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function draw() {
      const theme = getThemeColors();
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2 - 40; // Shift left to leave room for legend
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 20;

      const total = data.reduce((sum, val) => sum + val, 0);
      let startAngle = -0.5 * Math.PI;

      const chartColors = [theme.primary, theme.secondary, theme.tertiary, theme.quaternary];

      data.forEach((val, i) => {
        const sliceAngle = (val / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.fillStyle = chartColors[i % chartColors.length];
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.fill();
        
        startAngle += sliceAngle;
      });

      // Inner circle for donut
      ctx.beginPath();
      ctx.fillStyle = theme.cardBg; // card bg
      ctx.arc(cx, cy, radius * 0.6, 0, 2 * Math.PI);
      ctx.fill();

      // Legend
      const legendX = cx + radius + 20;
      let legendY = cy - (data.length * 20) / 2;

      data.forEach((val, i) => {
        ctx.fillStyle = chartColors[i % chartColors.length];
        ctx.fillRect(legendX, legendY, 12, 12);
        
        ctx.fillStyle = theme.text;
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(labels[i], legendX + 20, legendY);
        
        legendY += 24;
      });
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function drawAreaChart(canvasId, data, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function draw() {
      const theme = getThemeColors();
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      const padding = 40;
      const chartW = w - padding * 2;
      const chartH = h - padding * 2;
      const maxVal = Math.max(...data) * 1.2;

      const stepX = chartW / (data.length - 1);

      // Area
      ctx.beginPath();
      ctx.moveTo(padding, padding + chartH);
      
      data.forEach((val, i) => {
        const x = padding + i * stepX;
        const y = padding + chartH - (val / maxVal) * chartH;
        ctx.lineTo(x, y);
      });
      
      ctx.lineTo(padding + chartW, padding + chartH);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartH);
      gradient.addColorStop(0, theme.areaGradientStart); // Dynamic start
      gradient.addColorStop(1, theme.areaGradientEnd); // Dynamic end

      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      data.forEach((val, i) => {
        const x = padding + i * stepX;
        const y = padding + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        
        // Labels (skip some for readability)
        if (i % 5 === 0 || i === data.length - 1) {
          ctx.fillStyle = theme.text;
          ctx.font = '10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(labels[i], x, h - padding / 2);
        }
      });
      ctx.stroke();
    }

    draw();
    window.addEventListener('resize', draw);
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // Initialize Charts with Dummy Data
  if (document.getElementById('revenueChart')) {
    const revData = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];
    const revLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    drawLineChart('revenueChart', revData, revLabels);
  }

  if (document.getElementById('productsChart')) {
    const prodData = [150, 120, 90, 70, 50, 30];
    const prodLabels = ['Pampas', 'Eucalyp', 'Lavend', 'Cotton', 'Statice', 'Bunny'];
    drawBarChart('productsChart', prodData, prodLabels);
  }

  if (document.getElementById('categoryChart')) {
    const catData = [45, 25, 20, 10];
    const catLabels = ['Bouquets', 'Weddings', 'Single Stems', 'Gifts'];
    drawDonutChart('categoryChart', catData, catLabels);
  }

  if (document.getElementById('trafficChart')) {
    // 30 days data
    const trafficData = Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 50);
    const trafficLabels = Array.from({length: 30}, (_, i) => i + 1);
    drawAreaChart('trafficChart', trafficData, trafficLabels);
  }
});
