/* Listify main.js v2 */

/* GLOBAL hamburger toggle - called via inline onclick */
function lf_nav(btn){
  var nav=document.querySelector('.mob-nav');
  if(!nav)return;
  var open=nav.classList.toggle('open');
  var s=btn.querySelectorAll('span');
  s[0].style.transform=open?'rotate(45deg) translate(5px,5px)':'';
  s[1].style.opacity=open?'0':'';
  s[2].style.transform=open?'rotate(-45deg) translate(5px,-5px)':'';
}
/* Sidebar toggle for dashboards */
function lf_sb(){
  var sb=document.querySelector('.sidebar'),ov=document.getElementById('sb-ov');
  var op=sb.classList.toggle('open');
  if(ov)ov.style.display=op?'block':'none';
}
function lf_sb_close(){
  var sb=document.querySelector('.sidebar'),ov=document.getElementById('sb-ov');
  if(sb)sb.classList.remove('open');
  if(ov)ov.style.display='none';
}

document.addEventListener('DOMContentLoaded',function(){

  /* ── NAVBAR SCROLL ── */
  var nb=document.querySelector('.navbar');
  if(nb){
    window.addEventListener('scroll',function(){
      nb.classList.toggle('scrolled',window.scrollY>20);
    },{passive:true});
  }

  /* ── HOME DROPDOWN for mobile ── */
  document.querySelectorAll('.nav-dd').forEach(function(w){
    var t=w.querySelector(':scope>a');
    if(!t)return;
    t.addEventListener('click',function(e){
      if(window.innerWidth<=900){
        e.preventDefault();
        document.querySelectorAll('.nav-dd').forEach(function(o){if(o!==w)o.classList.remove('open')});
        w.classList.toggle('open');
      }
    });
    w.querySelectorAll('.ddi').forEach(function(l){
      l.addEventListener('click',function(e){e.stopPropagation();w.classList.remove('open')});
    });
    document.addEventListener('click',function(e){if(!w.contains(e.target))w.classList.remove('open')});
  });

  /* ── CLOSE MOB NAV ON LINK CLICK ── */
  var mn=document.querySelector('.mob-nav');
  if(mn)mn.addEventListener('click',function(e){
    if(e.target.tagName==='A'&&e.target.href)mn.classList.remove('open');
  });

  /* ── SCROLL REVEAL ── */
  var ro=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target)}
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(function(el){ro.observe(el)});

  /* ── COUNTER ANIMATION ── */
  var co=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var el=e.target,end=parseInt(el.dataset.count),suf=el.dataset.suffix||'',pre=el.dataset.prefix||'',cur=0,step=end/55;
        var go=function(){cur=Math.min(cur+step,end);el.textContent=pre+Math.floor(cur).toLocaleString()+suf;if(cur<end)requestAnimationFrame(go)};
        requestAnimationFrame(go);co.unobserve(el);
      }
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(c){co.observe(c)});

  /* ── COUNTDOWN TIMER ── */
  var cd=document.getElementById('lf-cd');
  if(cd){
    var tgt=new Date(Date.now()+30*24*3600000);
    var fmt=function(n){return String(n).padStart(2,'0')};
    var tick=function(){
      var diff=tgt-Date.now();if(diff<=0)return;
      var d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
      ['lf-d','lf-h','lf-m','lf-s'].forEach(function(id,i){var el=document.getElementById(id);if(el)el.textContent=fmt([d,h,m,s][i])});
    };tick();setInterval(tick,1000);
  }

  /* ── PRICING TOGGLE ── */
  var pt=document.getElementById('priceToggle');
  if(pt){
    pt.addEventListener('change',function(){
      document.querySelectorAll('[data-monthly]').forEach(function(e){e.style.display=pt.checked?'none':''});
      document.querySelectorAll('[data-yearly]').forEach(function(e){e.style.display=pt.checked?'':'none'});
    });
  }

  /* ── TABS ── */
  document.querySelectorAll('.tb').forEach(function(b){
    b.addEventListener('click',function(){
      var grp=b.closest('[data-tabs]')||b.parentElement;
      grp.querySelectorAll('.tb').forEach(function(x){x.classList.remove('active')});
      b.classList.add('active');
      var tgt=b.dataset.tab;
      if(tgt)document.querySelectorAll('[data-panel]').forEach(function(p){p.style.display=p.dataset.panel===tgt?'':'none'});
    });
  });

  /* ── FORM SUBMIT ── */
  document.querySelectorAll('form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=f.querySelector('[type=submit]');
      if(btn){var orig=btn.textContent;btn.textContent='✓ Sent!';btn.disabled=true;setTimeout(function(){btn.textContent=orig;btn.disabled=false},2500)}
    });
  });

  /* ── ACTIVE NAV ── */
  var cur=(window.location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('.nav-links a,.mob-nav a').forEach(function(a){
    if((a.getAttribute('href')||'')===cur)a.classList.add('active');
  });

  /* ── WISHLIST / FAV TOGGLE ── */
  document.querySelectorAll('.ac-fav').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var isSaved=btn.textContent==='♥';
      btn.textContent=isSaved?'♡':'♥';
      btn.style.color=isSaved?'':'#ef4444';
    });
  });

  /* ── PARALLAX HERO ── */
  var hero=document.querySelector('.hero-parallax');
  if(hero){
    window.addEventListener('scroll',function(){
      hero.style.transform='translateY('+(window.scrollY*.3)+'px)';
    },{passive:true});
  }

  /* ── CATEGORY HOVER RIPPLE ── */
  document.querySelectorAll('.cat-card').forEach(function(c){
    c.addEventListener('mouseenter',function(){c.querySelector('.cat-icon-wrap')&&(c.querySelector('.cat-icon-wrap').style.transform='scale(1.12) rotate(-3deg)')});
    c.addEventListener('mouseleave',function(){c.querySelector('.cat-icon-wrap')&&(c.querySelector('.cat-icon-wrap').style.transform='')});
  });

});
