/* ============================================================
   POPZ Cart Logic — localStorage-based cart management
   ============================================================ */

(function () {
  'use strict';

  function init() {
    renderCart();
    bindPromoCode();
  }

  /**
   * Render the cart items and summary from localStorage.
   */
  function renderCart() {
    var cart = getCart();
    var listEl = document.getElementById('cartItems');
    var emptyEl = document.getElementById('cartEmpty');
    var summaryEl = document.getElementById('cartSummary');
    var countEl = document.getElementById('cartPageCount');

    if (!listEl) return;

    if (cart.length === 0) {
      listEl.style.display = 'none';
      if (summaryEl) summaryEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      if (countEl) countEl.textContent = '0 items';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    listEl.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'block';
    if (countEl) countEl.textContent = cart.length + ' item' + (cart.length !== 1 ? 's' : '');

    listEl.innerHTML = '';
    cart.forEach(function (item, index) {
      var row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML =
        '<img class="cart-item__img" src="' + (item.image || 'assets/images/category-popcorn.png') + '" alt="' + item.name + '" width="80" height="80">' +
        '<div class="cart-item__info"><h4>' + item.name + '</h4><span class="cart-item__price">$' + item.price.toFixed(2) + '</span></div>' +
        '<div class="qty-stepper"><button class="qty-stepper__btn" data-action="dec" data-index="' + index + '" aria-label="Decrease quantity">-</button><span class="qty-stepper__value">' + item.qty + '</span><button class="qty-stepper__btn" data-action="inc" data-index="' + index + '" aria-label="Increase quantity">+</button></div>' +
        '<button class="cart-item__remove" data-index="' + index + '" aria-label="Remove item"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l12 12M15 3L3 15"/></svg></button>';
      listEl.appendChild(row);
    });

    /* Bind qty steppers and remove buttons */
    listEl.querySelectorAll('.qty-stepper__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var action = btn.getAttribute('data-action');
        if (action === 'inc') {
          cart[idx].qty++;
        } else {
          cart[idx].qty--;
          if (cart[idx].qty <= 0) cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCart();
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
      });
    });

    listEl.querySelectorAll('.cart-item__remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
        /* Update badge in navbar */
        var badges = document.querySelectorAll('.navbar__cart-badge');
        var totalItems = cart.reduce(function (s, i) { return s + i.qty; }, 0);
        badges.forEach(function (b) { b.textContent = totalItems; b.setAttribute('data-count', totalItems); });
      });
    });

    updateSummary(cart);
  }

  /**
   * Update order summary with totals.
   */
  function updateSummary(cart) {
    var subtotalEl = document.getElementById('cartSubtotal');
    var shippingEl = document.getElementById('cartShipping');
    var totalEl = document.getElementById('cartTotal');

    if (!subtotalEl) return;

    var subtotal = cart.reduce(function (sum, item) {
      return sum + (item.price * item.qty);
    }, 0);

    var shipping = subtotal > 35 ? 0 : 5.99;

    subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + (subtotal + shipping).toFixed(2);
  }

  /**
   * Handle promo code (demo only).
   */
  function bindPromoCode() {
    var form = document.getElementById('promoForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      var msg = document.getElementById('promoMsg');
      if (input && input.value.toUpperCase() === 'POPZ10') {
        if (msg) {
          msg.textContent = 'Code applied: 10% off!';
          msg.style.color = 'var(--success)';
          msg.style.display = 'block';
        }
      } else {
        if (msg) {
          msg.textContent = 'Invalid code. Try POPZ10.';
          msg.style.color = 'var(--error)';
          msg.style.display = 'block';
        }
      }
    });
  }

  function getCart() {
    return JSON.parse(localStorage.getItem('popz-cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('popz-cart', JSON.stringify(cart));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
