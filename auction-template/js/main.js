/* BidMaster — main.js */
document.addEventListener('DOMContentLoaded', function () {

  /* ── NAVBAR SCROLL ── */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ── MOBILE NAV TOGGLE ── */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = mobileNav.classList.toggle('open');
      var spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        var spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
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

  /* ── PAGE NAVIGATOR ── */
  (function () {
    var PAGES = [
      ['index.html', 'Home Classic'],
      ['index-v2.html', 'Home V2'],
      ['about.html', 'About'],
      ['pricing.html', 'Pricing'],
      ['portfolio.html', 'Auctions'],
      ['blog.html', 'Blog'],
      ['contact.html', 'Contact'],
      ['login.html', 'Login'],
      ['register.html', 'Register'],
      ['user-dashboard.html', 'Dashboard'],
      ['admin-dashboard.html', 'Admin'],
      ['coming-soon.html', 'Coming Soon'],
      ['404.html', '404']
    ];
    var cur = (window.location.pathname.split('/').pop() || 'index.html');
    if (!cur) cur = 'index.html';
    var idx = 0;
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i][0] === cur) { idx = i; break; }
    }
    var prev = idx > 0 ? PAGES[idx - 1] : null;
    var next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
    var label = PAGES[idx][1];
    var aL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="10 4 6 8 10 12"/></svg>';
    var aR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 4 10 8 6 12"/></svg>';
    var dots = PAGES.map(function (p, i) {
      return '<button class="pnav-dot' + (i === idx ? ' active' : '') + '" onclick="location.href=\'' + p[0] + '\'" title="' + p[1] + '"></button>';
    }).join('');
    var prevBtn = prev ? '<a href="' + prev[0] + '" class="pnav-btn">' + aL + '<span class="pnav-lbl">' + prev[1] + '</span></a>' : '<span class="pnav-btn disabled">' + aL + '</span>';
    var nextBtn = next ? '<a href="' + next[0] + '" class="pnav-btn"><span class="pnav-lbl">' + next[1] + '</span>' + aR + '</a>' : '<span class="pnav-btn disabled">' + aR + '</span>';
    var nav = '<div class="page-nav">' + prevBtn + '<div class="pnav-divider"></div><div class="pnav-center"><div class="pnav-dots">' + dots + '</div><span class="pnav-label">' + label + '</span></div><div class="pnav-divider"></div>' + nextBtn + '</div>';
    document.body.insertAdjacentHTML('beforeend', nav);
  })();

  /* ── ACTIVE NAV LINK ── */
  var cur2 = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === cur2 || href.endsWith('/' + cur2)) a.classList.add('active');
  });

});
