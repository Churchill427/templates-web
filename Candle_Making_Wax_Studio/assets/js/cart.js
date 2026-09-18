/* ============================================================
   LUME — Cart JS (State, Add/Remove, Quantity, Promo)
   ============================================================ */
(function () {
  'use strict';

  var CART_KEY = 'lume-cart';

  document.addEventListener('DOMContentLoaded', function () {
    initCartPage();
    initQuantitySteppers();
  });

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    var cart = getCart();
    var total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = total;
    });
  }

  // ════════════════════════════════════════════════════════════
  // CART PAGE
  // ════════════════════════════════════════════════════════════
  function initCartPage() {
    var cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    renderCart();

    // Remove item buttons
    cartContainer.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) {
        var idx = parseInt(removeBtn.getAttribute('data-remove'));
        var cart = getCart();
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      }
    });

    // Promo code
    var promoBtn = document.getElementById('apply-promo');
    if (promoBtn) {
      promoBtn.addEventListener('click', function () {
        var input = document.getElementById('promo-input');
        var msg = document.getElementById('promo-message');
        if (input && msg) {
          if (input.value.trim().toUpperCase() === 'GLOW10') {
            msg.textContent = 'Promo code applied: 10% off!';
            msg.style.color = 'var(--color-success)';
          } else {
            msg.textContent = 'Invalid promo code.';
            msg.style.color = 'var(--color-error)';
          }
        }
      });
    }
  }

  function renderCart() {
    var cart = getCart();
    var container = document.getElementById('cart-items');
    var emptyState = document.getElementById('cart-empty');
    var filledState = document.getElementById('cart-filled');
    var subtotalEl = document.getElementById('cart-subtotal');

    if (!container) return;

    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (filledState) filledState.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (filledState) filledState.style.display = 'block';

    var html = '';
    var subtotal = 0;
    cart.forEach(function (item, i) {
      subtotal += item.price * item.qty;
      html += '<div class="cart-item">' +
        '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item__img">' +
        '<div class="cart-item__info"><h4 class="cart-item__name">' + item.name + '</h4>' +
        '<p class="cart-item__notes">' + item.notes + '</p></div>' +
        '<div class="qty-stepper"><button class="qty-stepper__btn" data-qty-change="' + i + '" data-dir="-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>' +
        '<input class="qty-stepper__value" type="number" value="' + item.qty + '" min="1" max="10" readonly>' +
        '<button class="qty-stepper__btn" data-qty-change="' + i + '" data-dir="1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div>' +
        '<div class="cart-item__price">$' + (item.price * item.qty).toFixed(2) + '</div>' +
        '<button class="cart-item__remove" data-remove="' + i + '" aria-label="Remove ' + item.name + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
        '</div>';
    });

    container.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);

    // Quantity change handlers
    container.querySelectorAll('[data-qty-change]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-qty-change'));
        var dir = parseInt(btn.getAttribute('data-dir'));
        var c = getCart();
        c[idx].qty = Math.max(1, Math.min(10, c[idx].qty + dir));
        saveCart(c);
        renderCart();
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // QUANTITY STEPPERS (generic)
  // ════════════════════════════════════════════════════════════
  function initQuantitySteppers() {
    document.querySelectorAll('.qty-stepper').forEach(function (stepper) {
      var input = stepper.querySelector('.qty-stepper__value');
      var btns = stepper.querySelectorAll('.qty-stepper__btn');
      if (!input || btns.length < 2) return;

      btns[0].addEventListener('click', function () {
        var val = parseInt(input.value) || 1;
        input.value = Math.max(1, val - 1);
      });

      btns[1].addEventListener('click', function () {
        var val = parseInt(input.value) || 1;
        input.value = Math.min(10, val + 1);
      });
    });
  }

  // Add to cart function (used from product pages)
  window.addToCart = function (name, price, image, notes) {
    var cart = getCart();
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.qty = Math.min(10, existing.qty + 1);
    } else {
      cart.push({ name: name, price: price, image: image, notes: notes || '', qty: 1 });
    }
    saveCart(cart);
  };

  updateCartCount();
})();
