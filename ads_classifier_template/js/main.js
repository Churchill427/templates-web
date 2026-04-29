/* Listify main.js v3 — Enhanced Interactive */

/* GLOBAL hamburger */
function lf_nav(btn){
  var nav=document.querySelector('.mob-nav');
  if(!nav)return;
  var open=nav.classList.toggle('open');
  var s=btn.querySelectorAll('span');
  s[0].style.transform=open?'rotate(45deg) translate(5px,5px)':'';
  s[1].style.opacity=open?'0':'';
  s[2].style.transform=open?'rotate(-45deg) translate(5px,-5px)':'';
}
function lf_sb(){var sb=document.querySelector('.sidebar'),ov=document.getElementById('sb-ov');var op=sb.classList.toggle('open');if(ov)ov.style.display=op?'block':'none'}
function lf_sb_close(){var sb=document.querySelector('.sidebar'),ov=document.getElementById('sb-ov');if(sb)sb.classList.remove('open');if(ov)ov.style.display='none'}

document.addEventListener('DOMContentLoaded',function(){

  /* ── NAVBAR SCROLL ── */
  var nb=document.querySelector('.navbar');
  if(nb)window.addEventListener('scroll',function(){nb.classList.toggle('scrolled',window.scrollY>20)},{passive:true});

  /* ── DROPDOWN ── */
  document.querySelectorAll('.nav-dd').forEach(function(w){
    var t=w.querySelector(':scope>a');
    if(!t)return;
    t.addEventListener('click',function(e){
      if(window.innerWidth<=900){e.preventDefault();document.querySelectorAll('.nav-dd').forEach(function(o){if(o!==w)o.classList.remove('open')});w.classList.toggle('open')}
    });
    w.querySelectorAll('.ddi').forEach(function(l){l.addEventListener('click',function(e){e.stopPropagation();w.classList.remove('open')})});
    document.addEventListener('click',function(e){if(!w.contains(e.target))w.classList.remove('open')});
  });

  /* ── CLOSE MOB NAV ── */
  var mn=document.querySelector('.mob-nav');
  if(mn)mn.addEventListener('click',function(e){if(e.target.tagName==='A'&&e.target.href)mn.classList.remove('open')});

  /* ── SCROLL REVEAL ── */
  var ro=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target)}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(function(el){ro.observe(el)});

  /* ── COUNTER ANIMATION ── */
  var co=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var el=e.target,end=parseInt(el.dataset.count),suf=el.dataset.suffix||'',pre=el.dataset.prefix||'',cur=0,step=end/60;
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
    var tick=function(){var diff=tgt-Date.now();if(diff<=0)return;var d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);['lf-d','lf-h','lf-m','lf-s'].forEach(function(id,i){var el=document.getElementById(id);if(el)el.textContent=fmt([d,h,m,s][i])})};
    tick();setInterval(tick,1000);
  }

  /* ── PRICING TOGGLE ── */
  var pt=document.getElementById('priceToggle');
  if(pt){pt.addEventListener('change',function(){document.querySelectorAll('[data-monthly]').forEach(function(e){e.style.display=pt.checked?'none':''});document.querySelectorAll('[data-yearly]').forEach(function(e){e.style.display=pt.checked?'':'none'})})}

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
  document.querySelectorAll('.nav-links a,.mob-nav a').forEach(function(a){if((a.getAttribute('href')||'')===cur)a.classList.add('active')});

  /* ── WISHLIST / FAV TOGGLE ── */
  document.querySelectorAll('.ac-fav').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var isSaved=btn.classList.contains('saved');
      btn.classList.toggle('saved');
      btn.textContent=isSaved?'♡':'♥';
      btn.style.color=isSaved?'':'#ef4444';
      // Show toast
      showToast(isSaved?'Removed from wishlist':'❤️ Added to wishlist','success');
    });
  });

  /* ── CATEGORY HOVER ── */
  document.querySelectorAll('.cat-card').forEach(function(c){
    c.addEventListener('click',function(){
      var name=c.querySelector('.cat-name');
      if(name)showToast('🔍 Browsing '+name.textContent,'info');
    });
  });

  /* ── FILTER TAGS ── */
  document.querySelectorAll('.filter-tag').forEach(function(t){
    t.addEventListener('click',function(){
      document.querySelectorAll('.filter-tag').forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');
    });
  });

  /* ── CITY CHIPS ── */
  document.querySelectorAll('.city-chip').forEach(function(c){
    c.addEventListener('click',function(){
      document.querySelectorAll('.city-chip').forEach(function(x){x.classList.remove('active')});
      c.classList.add('active');
      showToast('📍 Showing listings in '+c.textContent,'info');
    });
  });

  /* ── SEARCH SUGGESTIONS ── */
  var searchInput=document.querySelector('.sbar input');
  var suggestions=document.getElementById('searchSuggestions');
  if(searchInput && suggestions){
    var allSuggestions=[
      {icon:'💻',main:'MacBook Pro M3',sub:'Electronics · Bangalore',price:'₹1,20,000'},
      {icon:'🚗',main:'Honda City 2022',sub:'Vehicles · Mumbai',price:'₹8,50,000'},
      {icon:'📱',main:'iPhone 15 Pro Max',sub:'Mobiles · Chennai',price:'₹1,30,000'},
      {icon:'🏠',main:'2BHK Flat Koramangala',sub:'Real Estate · Bangalore',price:'₹32,000/mo'},
      {icon:'🏍️',main:'Royal Enfield Classic 350',sub:'Bikes · Pune',price:'₹1,85,000'},
      {icon:'🛋️',main:'Wooden Dining Table',sub:'Furniture · Delhi',price:'₹15,000'},
      {icon:'📸',main:'Canon EOS R50',sub:'Electronics · Kolkata',price:'₹38,000'},
      {icon:'💼',main:'Software Engineer Job',sub:'Jobs · Hyderabad',price:'₹8-15 LPA'},
    ];
    searchInput.addEventListener('input',function(){
      var val=searchInput.value.trim().toLowerCase();
      if(!val){suggestions.classList.remove('open');return}
      var filtered=allSuggestions.filter(function(s){return s.main.toLowerCase().includes(val)||s.sub.toLowerCase().includes(val)});
      if(!filtered.length){suggestions.classList.remove('open');return}
      suggestions.innerHTML='<div class="ss-header">Suggestions</div>'+filtered.slice(0,5).map(function(s){
        return '<div class="ss-item" onclick="selectSuggestion(\''+s.main+'\')">'
          +'<div class="ss-icon">'+s.icon+'</div>'
          +'<div class="ss-text"><div class="ss-main">'+s.main+'</div><div class="ss-sub">'+s.sub+'</div></div>'
          +'<div class="ss-price">'+s.price+'</div>'
          +'</div>';
      }).join('');
      suggestions.classList.add('open');
    });
    searchInput.addEventListener('focus',function(){if(searchInput.value.trim()){suggestions.classList.add('open')}});
    document.addEventListener('click',function(e){if(!e.target.closest('.hero-search'))suggestions.classList.remove('open')});
  }

  /* ── FLOATING NOTIFICATIONS ── */
  var notifs=[
    {name:'Ravi Kumar',msg:'Sold MacBook for ₹45,000',time:'2m ago',img:'https://i.pravatar.cc/150?img=11'},
    {name:'Priya Sharma',msg:'Listed Honda City at ₹8.5L',time:'5m ago',img:'https://i.pravatar.cc/150?img=47'},
    {name:'Amit Singh',msg:'Bought iPhone 14 Pro',time:'8m ago',img:'https://i.pravatar.cc/150?img=33'},
    {name:'Sara Nair',msg:'Rented 2BHK in Pune ₹22k/mo',time:'12m ago',img:'https://i.pravatar.cc/150?img=20'},
    {name:'Raj Kapoor',msg:'Got 10 offers on his ad!',time:'15m ago',img:'https://i.pravatar.cc/150?img=52'},
  ];
  var notifEl=document.getElementById('floatNotif');
  if(notifEl){
    var ni=0;
    function showNextNotif(){
      var n=notifs[ni%notifs.length];ni++;
      notifEl.querySelector('.fn-avatar').src=n.img;
      notifEl.querySelector('.fn-name').textContent=n.name;
      notifEl.querySelector('.fn-msg').textContent=n.msg;
      notifEl.querySelector('.fn-time').textContent=n.time;
      notifEl.classList.add('show');
      setTimeout(function(){notifEl.classList.remove('show')},4200);
    }
    setTimeout(showNextNotif,3000);
    setInterval(showNextNotif,7000);
    notifEl.querySelector('.fn-close').addEventListener('click',function(e){e.stopPropagation();notifEl.classList.remove('show')});
  }

  /* ── PARALLAX HERO ── */
  var hero=document.querySelector('.hero-parallax');
  if(hero)window.addEventListener('scroll',function(){hero.style.transform='translateY('+(window.scrollY*.3)+'px)'},{passive:true});

  /* ── SCROLL PROGRESS BAR ── */
  var prog=document.getElementById('scrollProgress');
  if(prog){
    window.addEventListener('scroll',function(){
      var h=document.documentElement.scrollHeight-window.innerHeight;
      prog.style.width=(h>0?window.scrollY/h*100:0)+'%';
    },{passive:true});
  }

  /* ── SECTION HOVER TILT ── */
  document.querySelectorAll('.cat-card,.card,.ac').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5;
      var y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='translateY(-7px) rotateX('+(y*-4)+'deg) rotateY('+(x*4)+'deg)';
    });
    el.addEventListener('mouseleave',function(){
      el.style.transform='';
    });
  });

  /* ── CURSOR GLOW ── */
  var cursor=document.getElementById('cursorGlow');
  if(cursor){
    document.addEventListener('mousemove',function(e){
      cursor.style.left=e.clientX+'px';
      cursor.style.top=e.clientY+'px';
    });
    document.querySelectorAll('.btn,.ac,.cat-card,.filter-tag').forEach(function(el){
      el.addEventListener('mouseenter',function(){cursor.classList.add('big')});
      el.addEventListener('mouseleave',function(){cursor.classList.remove('big')});
    });
  }

});

/* ── SEARCH SELECT ── */
function selectSuggestion(val){
  var inp=document.querySelector('.sbar input');
  if(inp)inp.value=val;
  var s=document.getElementById('searchSuggestions');
  if(s)s.classList.remove('open');
}

/* ── TOAST SYSTEM ── */
function showToast(msg,type){
  var container=document.getElementById('toastContainer');
  if(!container)return;
  var t=document.createElement('div');
  t.className='toast toast-'+(type||'info');
  t.innerHTML='<span style="font-size:16px">'+(type==='success'?'✅':type==='error'?'❌':'ℹ️')+'</span> '+msg;
  container.appendChild(t);
  setTimeout(function(){t.classList.add('exit');setTimeout(function(){t.remove()},300)},2800);
}

/* ── NEURAL NETWORK ANIMATION ── */
(function(){
  var C,X,W,H,nodes=[],RAF,CONN_DIST=140,NODE_COUNT=80;
  function Node(){
    this.x=Math.random()*W;this.y=Math.random()*H;
    this.vx=(Math.random()-.5)*.45;this.vy=(Math.random()-.5)*.45;
    this.r=Math.random()*2.2+.8;
    this.pulse=Math.random()*Math.PI*2;this.ps=.018+Math.random()*.022;
    var palettes=[[255,107,53],[11,61,145],[0,200,150],[255,200,80]];
    this.rgb=palettes[Math.floor(Math.random()*palettes.length)];
  }
  Node.prototype.update=function(){
    this.x+=this.vx;this.y+=this.vy;this.pulse+=this.ps;
    if(this.x<-10)this.x=W+10;if(this.x>W+10)this.x=-10;
    if(this.y<-10)this.y=H+10;if(this.y>H+10)this.y=-10;
  };
  Node.prototype.alpha=function(){return 0.5+0.5*Math.sin(this.pulse)};
  function init(){
    C=document.getElementById('nn-canvas');if(!C)return;
    X=C.getContext('2d');resize();nodes=[];
    for(var i=0;i<NODE_COUNT;i++)nodes.push(new Node());
    if(RAF)cancelAnimationFrame(RAF);
    frame();
    window.addEventListener('resize',resize,{passive:true});
    // Mouse interaction
    document.addEventListener('mousemove',function(e){
      var rect=C.getBoundingClientRect();
      var mx=e.clientX-rect.left,my=e.clientY-rect.top;
      nodes.forEach(function(n){
        var dx=n.x-mx,dy=n.y-my,d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){n.vx+=(dx/d)*.3;n.vy+=(dy/d)*.3}
      });
    },{passive:true});
  }
  function resize(){if(!C)return;W=C.width=C.offsetWidth;H=C.height=C.offsetHeight}
  function frame(){
    RAF=requestAnimationFrame(frame);
    X.clearRect(0,0,W,H);
    for(var i=0;i<nodes.length;i++)nodes[i].update();
    for(var i=0;i<nodes.length;i++){
      for(var j=i+1;j<nodes.length;j++){
        var dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
        var dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<CONN_DIST){
          var t=1-dist/CONN_DIST;
          var ai=nodes[i].alpha(),aj=nodes[j].alpha();
          var lineA=t*t*Math.min(ai,aj)*.55;
          var r=(nodes[i].rgb[0]+nodes[j].rgb[0])>>1;
          var g=(nodes[i].rgb[1]+nodes[j].rgb[1])>>1;
          var b=(nodes[i].rgb[2]+nodes[j].rgb[2])>>1;
          X.beginPath();X.moveTo(nodes[i].x,nodes[i].y);X.lineTo(nodes[j].x,nodes[j].y);
          X.strokeStyle='rgba('+r+','+g+','+b+','+lineA+')';X.lineWidth=t*1.2;X.stroke();
        }
      }
    }
    for(var i=0;i<nodes.length;i++){
      var n=nodes[i],a=n.alpha();var r=n.rgb[0],g=n.rgb[1],b=n.rgb[2];
      var grd=X.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*4);
      grd.addColorStop(0,'rgba('+r+','+g+','+b+','+(a*.5)+')');
      grd.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
      X.beginPath();X.arc(n.x,n.y,n.r*4,0,Math.PI*2);X.fillStyle=grd;X.fill();
      X.beginPath();X.arc(n.x,n.y,n.r,0,Math.PI*2);X.fillStyle='rgba('+r+','+g+','+b+','+a+')';X.fill();
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
