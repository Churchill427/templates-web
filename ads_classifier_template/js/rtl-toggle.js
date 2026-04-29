/* Listify RTL Toggle */
(function(){
  var d=localStorage.getItem('lf-dir')||'ltr';
  document.documentElement.setAttribute('dir',d);
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('#rtlToggle').forEach(function(b){
      b.title=d==='rtl'?'Switch to LTR':'Switch to RTL';
      b.addEventListener('click',function(){
        var cur=document.documentElement.getAttribute('dir')||'ltr';
        var nxt=cur==='ltr'?'rtl':'ltr';
        document.documentElement.setAttribute('dir',nxt);
        localStorage.setItem('lf-dir',nxt);
        document.querySelectorAll('#rtlToggle').forEach(function(x){x.title=nxt==='rtl'?'Switch to LTR':'Switch to RTL'});
      });
    });
  });
})();
