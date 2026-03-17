/* BidMaster — main.js */
document.addEventListener('DOMContentLoaded', function () {

  /* ── NAVBAR SCROLL ── */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
  /* ── HOME DROPDOWN (click for mobile) ── */
  document.querySelectorAll('.nav-item-dropdown').forEach(function (item) {
    var trigger = item.querySelector(':scope > a');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          document.querySelectorAll('.nav-item-dropdown').forEach(function (o) {
            if (o !== item) o.classList.remove('open');
          });
          item.classList.toggle('open');
        }
      });
      item.querySelectorAll('.nav-dd-item').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.stopPropagation();
          item.classList.remove('open');
        });
      });
    }
    document.addEventListener('click', function (e) {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
  });

  /* ── SIDEBAR TOGGLE (dashboards) ── */
  var sidebarToggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    var close = function () {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    };
    sidebarToggle.addEventListener('click', function () {
      var isOpen = sidebar.classList.toggle('open');
      overlay.classList.toggle('visible', isOpen);
    });
    overlay.addEventListener('click', close);
  }

  /* ── TABS ── */
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('[data-tabs]') || btn.parentElement;
      group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var target = btn.dataset.tab;
      if (target) {
        var panels = document.querySelectorAll('[data-panel]');
        panels.forEach(function (p) {
          p.style.display = p.dataset.panel === target ? '' : 'none';
        });
      }
    });
  });

  /* ── COUNTER ANIMATION ── */
  var counters = document.querySelectorAll('[data-count]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var prefix = el.dataset.prefix || '';
        var step = target / 60;
        var current = 0;
        var update = function () {
          current = Math.min(current + step, target);
          el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
          if (current < target) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { observer.observe(c); });

  /* ── COUNTDOWN TIMER ── */
  var countEl = document.getElementById('countdown');
  if (countEl) {
    var target = new Date(countEl.dataset.target || Date.now() + 30 * 24 * 3600000);
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) return;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var fmt = function (n) { return String(n).padStart(2, '0'); };
      ['cd-d','cd-h','cd-m','cd-s'].forEach(function (id, i) {
        var el2 = document.getElementById(id);
        if (el2) el2.textContent = fmt([d,h,m,s][i]);
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── AUCTION TIMERS ── */
  document.querySelectorAll('[data-end]').forEach(function (el) {
    var end = new Date(el.dataset.end);
    var tick = function () {
      var diff = end - Date.now();
      if (diff <= 0) { el.textContent = 'Ended'; return; }
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      el.textContent = h + 'h ' + m + 'm ' + s + 's';
    };
    tick();
    setInterval(tick, 1000);
  });

  /* ── PRICING TOGGLE ── */
  var pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', function () {
      var monthly = document.querySelectorAll('[data-monthly]');
      var yearly = document.querySelectorAll('[data-yearly]');
      if (pricingToggle.checked) {
        monthly.forEach(function (el) { el.style.display = 'none'; });
        yearly.forEach(function (el) { el.style.display = ''; });
      } else {
        monthly.forEach(function (el) { el.style.display = ''; });
        yearly.forEach(function (el) { el.style.display = 'none'; });
      }
    });
  }

  /* ── FORM VALIDATION ── */
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      if (btn) { btn.textContent = '✓ Sent!'; btn.disabled = true; }
    });
  });

  /* ── TOAST ── */
  window.showToast = function (msg, type) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:100px;right:24px;z-index:9999;background:' + (type === 'success' ? '#10B981' : '#1E3A8A') + ';color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,0.2);animation:fadeUp 0.3s ease';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3000);
  };
  /* ── ACTIVE NAV LINK ── */
  var cur2 = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === cur2 || href.endsWith('/' + cur2)) a.classList.add('active');
  });

});
