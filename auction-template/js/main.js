/* HAMMR — main.js */

/* ── Hamburger (called via inline onclick) ── */
function hm_nav(btn) {
  var nav = document.querySelector('.mob-nav');
  if (!nav) return;
  var open = nav.classList.toggle('open');
  btn.classList.toggle('open', open);
}

/* ── Sidebar toggle ── */
function hm_sb() {
  var sb = document.querySelector('.sidebar');
  var ov = document.querySelector('.sb-overlay');
  var open = sb.classList.toggle('open');
  if (ov) ov.classList.toggle('visible', open);
}
function hm_sb_close() {
  var sb = document.querySelector('.sidebar');
  var ov = document.querySelector('.sb-overlay');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('visible');
}

/* ── Neural-net canvas animation ── */
function hm_nn(canvasId, n, dist) {
  var C = document.getElementById(canvasId); if (!C) return;
  var X = C.getContext('2d'), W, H, pts = [];
  var PAL = [[232,160,32],[192,57,43],[13,27,42],[255,215,100]];
  function Pt() {
    this.x  = Math.random()*W; this.y  = Math.random()*H;
    this.vx = (Math.random()-.5)*.4; this.vy = (Math.random()-.5)*.4;
    this.r  = Math.random()*2+.4; this.ph = Math.random()*Math.PI*2;
    this.ps = .014+Math.random()*.02;
    this.c  = PAL[Math.floor(Math.random()*PAL.length)];
  }
  function init() {
    W = C.width  = C.offsetWidth  || window.innerWidth;
    H = C.height = C.offsetHeight || 500;
    pts = []; for (var i=0;i<(n||80);i++) pts.push(new Pt());
  }
  function draw() {
    requestAnimationFrame(draw);
    X.clearRect(0,0,W,H);
    for (var i=0;i<pts.length;i++) {
      var p=pts[i]; p.x+=p.vx; p.y+=p.vy; p.ph+=p.ps;
      if(p.x<-6)p.x=W+6; if(p.x>W+6)p.x=-6;
      if(p.y<-6)p.y=H+6; if(p.y>H+6)p.y=-6;
    }
    var D = dist||120;
    for (var i=0;i<pts.length;i++) for (var j=i+1;j<pts.length;j++) {
      var a=pts[i],b=pts[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy);
      if (d<D) {
        var t=1-d/D, ai=.4+.55*Math.sin(a.ph), bi=.4+.55*Math.sin(b.ph);
        var la=t*t*Math.min(ai,bi)*.48;
        var r=(a.c[0]+b.c[0])>>1,g=(a.c[1]+b.c[1])>>1,bb=(a.c[2]+b.c[2])>>1;
        X.beginPath(); X.moveTo(a.x,a.y); X.lineTo(b.x,b.y);
        X.strokeStyle='rgba('+r+','+g+','+bb+','+la+')'; X.lineWidth=t*.9; X.stroke();
      }
    }
    for (var i=0;i<pts.length;i++) {
      var p=pts[i],a=.45+.55*Math.sin(p.ph),r=p.c[0],g=p.c[1],b=p.c[2];
      var grd=X.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
      grd.addColorStop(0,'rgba('+r+','+g+','+b+','+(a*.5)+')');
      grd.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
      X.beginPath();X.arc(p.x,p.y,p.r*4,0,Math.PI*2);X.fillStyle=grd;X.fill();
      X.beginPath();X.arc(p.x,p.y,p.r,0,Math.PI*2);
      X.fillStyle='rgba('+r+','+g+','+b+','+a+')';X.fill();
    }
  }
  window.addEventListener('resize', init, {passive:true});
  init(); draw();
}

document.addEventListener('DOMContentLoaded', function() {

  /* ── Navbar scroll shadow ── */
  var nb = document.querySelector('.navbar');
  if (nb) window.addEventListener('scroll', function() {
    nb.classList.toggle('scrolled', window.scrollY > 20);
  }, {passive:true});

  /* ── Home dropdown: click on mobile, hover on desktop ── */
  document.querySelectorAll('.nav-dd').forEach(function(dd) {
    var link = dd.querySelector(':scope > a');
    if (!link) return;
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        document.querySelectorAll('.nav-dd').forEach(function(o) { if(o!==dd) o.classList.remove('open'); });
        dd.classList.toggle('open');
      }
    });
    document.addEventListener('click', function(e) {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });

  /* ── Close mob-nav on link click ── */
  var mn = document.querySelector('.mob-nav');
  if (mn) mn.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href) {
      mn.classList.remove('open');
      var hbtn = document.querySelector('.hamburger');
      if (hbtn) hbtn.classList.remove('open');
    }
  });

  /* ── Scroll Reveal ── */
  var ro = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(function(el) { ro.observe(el); });

  /* ── Counter animation ── */
  var co = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var el = e.target, end = parseInt(el.dataset.count)||0;
        var suf = el.dataset.suffix||'', pre = el.dataset.prefix||'';
        var cur = 0, step = end/60;
        var go = function() { cur=Math.min(cur+step,end); el.textContent=pre+Math.floor(cur).toLocaleString()+suf; if(cur<end) requestAnimationFrame(go); };
        requestAnimationFrame(go); co.unobserve(el);
      }
    });
  }, {threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(c) { co.observe(c); });

  /* ── Live countdowns ── */
  document.querySelectorAll('[data-ms]').forEach(function(el) {
    var end = Date.now() + parseInt(el.dataset.ms||3600000);
    var fmt = function(n) { return String(n).padStart(2,'0'); };
    var tick = function() {
      var d = end - Date.now(); if (d<=0) { el.textContent='Ended'; return; }
      var h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);
      el.textContent = fmt(h)+':'+fmt(m)+':'+fmt(s);
    };
    tick(); setInterval(tick, 1000);
  });

  /* ── Pricing toggle ── */
  var pt = document.getElementById('price-toggle');
  if (pt) pt.addEventListener('change', function() {
    document.querySelectorAll('[data-mo]').forEach(function(e) { e.style.display=pt.checked?'none':''; });
    document.querySelectorAll('[data-yr]').forEach(function(e) { e.style.display=pt.checked?'':'none'; });
  });

  /* ── Tab panels ── */
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var grp = btn.closest('[data-tabs]') || btn.parentElement;
      grp.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var t = btn.dataset.tab;
      if (t) document.querySelectorAll('[data-panel]').forEach(function(p) {
        p.style.display = p.dataset.panel === t ? '' : 'none';
      });
    });
  });

  /* ── Watchlist / fav toggle ── */
  document.querySelectorAll('.lot-fav').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var s = btn.textContent === '♥';
      btn.textContent = s ? '♡' : '♥';
      btn.style.color = s ? '' : '#c0392b';
    });
  });

  /* ── Bid button click ── */
  document.querySelectorAll('.bid-now').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = btn.closest('.lot-card');
      var pe = card && card.querySelector('.lot-price');
      if (pe) {
        var v = parseInt(pe.textContent.replace(/[^\d]/g,''))||1000;
        pe.textContent = '₹' + Math.floor(v * 1.05).toLocaleString();
        var orig = btn.textContent;
        btn.textContent = '✓ Bid Placed!';
        btn.disabled = true;
        setTimeout(function() { btn.textContent=orig; btn.disabled=false; }, 1800);
      }
    });
  });

  /* ── Active nav highlight ── */
  var cur = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-nav a').forEach(function(a) {
    if ((a.getAttribute('href')||'') === cur) a.classList.add('active');
  });

  /* ── Coming soon countdown ── */
  var cs = document.getElementById('cs-launch');
  if (cs) {
    var launch = Date.now() + 30*24*3600000;
    var fmt2 = function(n) { return String(n).padStart(2,'0'); };
    setInterval(function() {
      var d = launch - Date.now(); if (d<=0) return;
      document.getElementById('cs-d').textContent = fmt2(Math.floor(d/86400000));
      document.getElementById('cs-h').textContent = fmt2(Math.floor((d%86400000)/3600000));
      document.getElementById('cs-m').textContent = fmt2(Math.floor((d%3600000)/60000));
      document.getElementById('cs-s').textContent = fmt2(Math.floor((d%60000)/1000));
    }, 1000);
  }

  /* ── Form prevent default ── */
  document.querySelectorAll('form').forEach(function(f) {
    f.addEventListener('submit', function(e) {
      e.preventDefault();
      var b = f.querySelector('[type=submit]');
      if (b) { var o=b.textContent; b.textContent='✓ Done!'; b.disabled=true;
        setTimeout(function() { b.textContent=o; b.disabled=false; }, 2500); }
    });
  });

});
