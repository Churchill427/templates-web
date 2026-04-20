/* ============================================
   DASHBOARD.JS — Admin & User Panel
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.dashboard')) return;
    initSidebar();
    initRoleSwitcher();
    initDashboardCharts();
    initOrderFilters();
    initProfileForm();
    initMessagePanel();
  });

  /* ================================================
     SIDEBAR NAVIGATION
     ================================================ */
  function initSidebar() {
    const dashboard = document.querySelector('.dashboard');
    const links = document.querySelectorAll('.sidebar__link');
    const panels = document.querySelectorAll('.dashboard__panel');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebarToggle && dashboard) {
      sidebarToggle.addEventListener('click', () => {
        dashboard.classList.toggle('sidebar-open');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        dashboard.classList.remove('sidebar-open');
      });
    }

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.dataset.panel;

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        panels.forEach(p => {
          p.classList.remove('active');
          if (p.id === target) p.classList.add('active');
        });

        // Close on link click (mobile focus)
        dashboard.classList.remove('sidebar-open');
      });
    });
  }

  /* ================================================
     ROLE SWITCHER (Admin ↔ User)
     ================================================ */
  function initRoleSwitcher() {
    const switcher = document.getElementById('role-switcher');

    // Check query param first
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    const saved = roleParam || localStorage.getItem('dashboardRole') || 'admin';
    applyRole(saved);
    if (switcher) switcher.value = saved;
    
    // Save it if it came from param
    if (roleParam) localStorage.setItem('dashboardRole', roleParam);

    if (switcher) {
      switcher.addEventListener('change', () => {
        const role = switcher.value;
        applyRole(role);
        localStorage.setItem('dashboardRole', role);
        // Clean up URL if we manually switch
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      });
    }
  }

  function applyRole(role) {
    document.querySelectorAll('[data-role]').forEach(el => {
      const roles = el.dataset.role.split(',').map(r => r.trim());
      el.style.display = roles.includes(role) || roles.includes('both') ? '' : 'none';
    });

    // Update sidebar visibility
    document.querySelectorAll('.sidebar__link[data-role]').forEach(link => {
      const roles = link.dataset.role.split(',').map(r => r.trim());
      link.style.display = roles.includes(role) || roles.includes('both') ? '' : 'none';
    });

    // Show first visible panel
    const firstLink = document.querySelector(`.sidebar__link[data-role*="${role}"]:not([style*="none"]), .sidebar__link[data-role="both"]`);
    if (firstLink) firstLink.click();
  }

  /* ================================================
     DASHBOARD CHARTS (Simple Canvas)
     ================================================ */
  function initDashboardCharts() {
    // Admin Charts
    drawRevenueChart(); // Bar
    drawOrdersChart();  // Line
    drawGrowthChart();  // Area
    drawCategoriesChart(); // Horizontal Bar
    
    // User Charts
    drawConsumptionChart(); // Line
    drawSpendingChart();    // Bar
    drawTasteChart();       // Dot Plot
    drawProgressChart();    // Circular Gauge
  }

  function drawRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;

    const data = [1200, 1900, 1500, 2800, 2200, 3100, 2700, 3400, 2900, 3800, 3200, 4100];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const max = Math.max(...data) * 1.15;
    const barW = (w - 80) / data.length;
    const offsetX = 50;
    const offsetY = 20;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#E0D5C180';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = offsetY + ((h - 50) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }

    // Bars
    data.forEach((val, i) => {
      const barH = ((h - 50) * val) / max;
      const x = offsetX + i * barW + barW * 0.15;
      const y = h - 30 - barH;
      const bw = barW * 0.7;

      const grad = ctx.createLinearGradient(x, y, x, h - 30);
      grad.addColorStop(0, '#6F4E37');
      grad.addColorStop(1, '#D4A574');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, barH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#7A7A7A';
      ctx.font = '10px Inter'; ctx.textAlign = 'center';
      if (i % 2 === 0) ctx.fillText(labels[i], x + bw / 2, h - 12);
    });

    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = Math.round((max / 4) * (4 - i));
      const y = offsetY + ((h - 50) / 4) * i + 4;
      ctx.fillText('$' + (val > 1000 ? (val/1000).toFixed(1)+'k' : val), offsetX - 6, y);
    }
  }

  function drawOrdersChart() {
    const canvas = document.getElementById('orders-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;

    const data = [45, 62, 58, 78, 71, 90, 85, 95, 88, 102, 96, 110];
    const max = Math.max(...data) * 1.15;
    const step = (w - 80) / (data.length - 1);
    const offsetX = 50;

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    const points = data.map((val, i) => ({
      x: offsetX + i * step,
      y: h - 30 - ((h - 50) * val) / max
    }));

    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#6F4E37';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    points.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6F4E37'; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
    });
  }

  function drawGrowthChart() {
    const canvas = document.getElementById('growth-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;
    const data = [200, 350, 600, 900, 1400, 2100, 3000, 4200, 5800, 7500];
    const max = 10000;
    const step = (w - 60) / (data.length - 1);
    const offset = 40;

    ctx.clearRect(0,0,w,h);
    const points = data.map((v, i) => ({ x: offset + i*step, y: h - 30 - (v/max)*(h-50) }));

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(232,93,4,.4)');
    grad.addColorStop(1, 'rgba(232,93,4,0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, h-30);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length-1].x, h-30);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#E85D04';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawCategoriesChart() {
    const canvas = document.getElementById('categories-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;
    const categories = ['Single Origin', 'Blends', 'Equipment', 'Merch', 'Courses'];
    const values = [85, 65, 45, 30, 15];

    ctx.clearRect(0,0,w,h);
    const bh = 24;
    const gap = 12;

    categories.forEach((cat, i) => {
      const y = 30 + i * (bh + gap);
      const bw = (values[i]/100) * (w - 120);

      ctx.fillStyle = '#F5F1E8';
      ctx.beginPath(); ctx.roundRect(100, y, w-120, bh, bh/2); ctx.fill();

      ctx.fillStyle = '#6F4E37';
      ctx.beginPath(); ctx.roundRect(100, y, bw, bh, bh/2); ctx.fill();

      ctx.fillStyle = '#7A7A7A'; ctx.font = '11px Inter'; ctx.textAlign = 'right';
      ctx.fillText(cat, 90, y + 16);
    });
  }

  function drawConsumptionChart() {
    const canvas = document.getElementById('consumption-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;
    const data = [2, 3, 2, 4, 3, 5, 4];
    const step = (w - 60) / (data.length - 1);

    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = 30 + i * step;
      const y = h - 30 - v * 20;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#D4A574'; ctx.lineWidth = 3; ctx.stroke();
  }

  function drawSpendingChart() {
    const canvas = document.getElementById('spending-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;
    const weeks = ['W1', 'W2', 'W3', 'W4'];
    const spend = [45, 82, 35, 64];

    ctx.clearRect(0,0,w,h);
    weeks.forEach((wk, i) => {
      const bw = 40; const x = 60 + i * ((w-100)/4);
      const bh = spend[i] * 1.5;
      ctx.fillStyle = '#6F4E37';
      ctx.beginPath(); ctx.roundRect(x, h-30-bh, bw, bh, 4); ctx.fill();
      ctx.fillStyle = '#7A7A7A'; ctx.textAlign = 'center';
      ctx.fillText(wk, x + bw/2, h - 10);
    });
  }

  function drawTasteChart() {
    const canvas = document.getElementById('taste-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;
    const labels = ['Acidity', 'Body', 'Sweet', 'Roast', 'Price'];
    const vals = [0.8, 0.6, 0.9, 0.4, 0.7];

    ctx.clearRect(0,0,w,h);
    const cx = w/2; const cy = h/2;
    const radius = 60;

    ctx.strokeStyle = '#E0D5C1';
    for(let r=1;r<=3;r++){ ctx.beginPath(); ctx.arc(cx,cy, (radius/3)*r, 0, Math.PI*2); ctx.stroke(); }

    ctx.beginPath();
    labels.forEach((l, i) => {
      const angle = (i / labels.length) * Math.PI * 2 - Math.PI/2;
      const x = cx + Math.cos(angle) * radius * vals[i];
      const y = cy + Math.sin(angle) * radius * vals[i];
      i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);

      ctx.fillStyle = '#7A7A7A'; ctx.font = '10px Inter';
      ctx.fillText(l, cx + Math.cos(angle)*(radius+15), cy + Math.sin(angle)*(radius+15));
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(212,165,116,0.3)'; ctx.fill();
    ctx.strokeStyle = '#D4A574'; ctx.stroke();
  }

  function drawProgressChart() {
    const canvas = document.getElementById('progress-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth;
    const h = canvas.height = 220;

    ctx.clearRect(0,0,w,h);
    const cx = w/2; const cy = h/2 + 20;
    const r = 70;

    // Background arc
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.strokeStyle = '#F5F1E8'; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.stroke();

    // Progress arc (75%)
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, Math.PI + (Math.PI * 0.75));
    ctx.strokeStyle = '#6F4E37'; ctx.stroke();

    ctx.fillStyle = '#1A1A1A'; ctx.font = 'bold 24px Playfair Display'; ctx.textAlign = 'center';
    ctx.fillText('75%', cx, cy - 10);
    ctx.font = '12px Inter'; ctx.fillStyle = '#7A7A7A';
    ctx.fillText('Next shipment in 4 days', cx, cy + 20);
  }

  /* ================================================
     ORDER STATUS FILTERS
     ================================================ */
  function initOrderFilters() {
    const btns = document.querySelectorAll('.order-filter__btn');
    const rows = document.querySelectorAll('.order-row');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        rows.forEach(row => {
          if (filter === 'all' || row.dataset.status === filter) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  /* ================================================
     PROFILE FORM
     ================================================ */
  function initProfileForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Profile updated successfully! ✓', 'success');
    });

    // Avatar upload preview
    const avatarInput = document.getElementById('avatar-upload');
    const avatarPreview = document.querySelector('.profile__avatar img');
    if (avatarInput && avatarPreview) {
      avatarInput.addEventListener('change', () => {
        const file = avatarInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => { avatarPreview.src = e.target.result; };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  /* ================================================
     MESSAGES PANEL
     ================================================ */
  function initMessagePanel() {
    const msgItems = document.querySelectorAll('.message-item');
    const msgContent = document.querySelector('.message-content');
    if (!msgItems.length || !msgContent) return;

    msgItems.forEach(item => {
      item.addEventListener('click', () => {
        msgItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
        item.classList.remove('unread');

        msgContent.innerHTML = `
          <div class="message-content__header">
            <h4>${item.dataset.from}</h4>
            <span class="text-muted">${item.dataset.date}</span>
          </div>
          <div class="message-content__body">
            <p>${item.dataset.message}</p>
          </div>
          <div class="message-content__reply" style="margin-top:24px">
            <textarea class="form-input" placeholder="Type your reply..." rows="3"></textarea>
            <button class="btn btn--primary" style="margin-top:12px" onclick="showToast('Reply sent! ✉️','success')">Send Reply</button>
          </div>
        `;
      });
    });
  }

})();
