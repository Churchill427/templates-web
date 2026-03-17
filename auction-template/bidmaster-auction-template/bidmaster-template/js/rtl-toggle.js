/* RTL Toggle — rtl-toggle.js */
(function () {
  var saved = localStorage.getItem('bm-dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);

  document.addEventListener('DOMContentLoaded', function () {
    var btns = document.querySelectorAll('#rtlToggle');
    function update() {
      var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      btns.forEach(function (b) {
        b.title = isRTL ? 'Switch to LTR' : 'Switch to RTL';
      });
    }
    update();
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('dir') || 'ltr';
        var next = cur === 'ltr' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', next);
        localStorage.setItem('bm-dir', next);
        update();
      });
    });
  });
})();
