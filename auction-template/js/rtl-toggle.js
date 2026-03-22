/* HAMMR — rtl-toggle.js  (runs before DOM ready) */
(function () {
  var saved = localStorage.getItem('hm-dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[id="rtlToggle"]').forEach(function (btn) {
      btn.title = saved === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('dir') || 'ltr';
        var nxt = cur === 'ltr' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', nxt);
        localStorage.setItem('hm-dir', nxt);
        document.querySelectorAll('[id="rtlToggle"]').forEach(function (b) {
          b.title = nxt === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
        });
      });
    });
  });
})();
