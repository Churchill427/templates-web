/* ============================================================
   LUME — Checkout JS (Multi-step, Confirmation)
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initCheckout();
  });

  function initCheckout() {
    var form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) {
          input.classList.add('form-input--error');
          valid = false;
        } else {
          input.classList.remove('form-input--error');
        }
      });

      if (!valid) return;

      // Show confirmation
      var formSection = document.getElementById('checkout-form-section');
      var confirmation = document.getElementById('checkout-confirmation');
      var orderNum = 'LUME-' + Math.floor(Math.random() * 90000 + 10000);

      if (formSection) formSection.style.display = 'none';
      if (confirmation) {
        confirmation.style.display = 'block';
        var numEl = document.getElementById('order-number');
        if (numEl) numEl.textContent = orderNum;
      }

      // Clear cart
      localStorage.removeItem('lume-cart');
    });
  }
})();
