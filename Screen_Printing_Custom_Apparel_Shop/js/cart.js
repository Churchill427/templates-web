/* ═══════════════════════════════════════════════════════════════════
   PRNT — Cart System
   localStorage-based cart state, add/remove/update, live totals
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  window.PRNT = window.PRNT || {};

  const CART_KEY = 'prnt-cart';
  const TAX_RATE = 0.08; // 8% tax

  /* ── Get Cart ────────────────────────────────────────────────────── */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  }

  /* ── Save Cart ───────────────────────────────────────────────────── */
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (window.PRNT.updateCartBadge) window.PRNT.updateCartBadge();
  }

  /* ── Add to Cart ─────────────────────────────────────────────────── */
  window.PRNT.addToCart = function (product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.qty += (product.qty || 1);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        spec: product.spec || '',
        qty: product.qty || 1,
        artworkNote: ''
      });
    }

    saveCart(cart);
    window.PRNT.showCartNotification(product.name);
    return cart;
  };

  /* ── Remove from Cart ────────────────────────────────────────────── */
  window.PRNT.removeFromCart = function (productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
  };

  /* ── Update Qty ──────────────────────────────────────────────────── */
  window.PRNT.updateCartQty = function (productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
    }
    saveCart(cart);
    return cart;
  };

  /* ── Update Artwork Note ─────────────────────────────────────────── */
  window.PRNT.updateArtworkNote = function (productId, note) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.artworkNote = note;
    }
    saveCart(cart);
  };

  /* ── Calculate Totals ────────────────────────────────────────────── */
  window.PRNT.getCartTotals = function () {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return {
      items: cart,
      count: cart.reduce((sum, item) => sum + item.qty, 0),
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  };

  /* ── Clear Cart ──────────────────────────────────────────────────── */
  window.PRNT.clearCart = function () {
    saveCart([]);
  };

  /* ── Cart Notification ───────────────────────────────────────────── */
  window.PRNT.showCartNotification = function (productName) {
    // Remove existing notification
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <i data-lucide="check-circle"></i>
      <span><strong>${productName}</strong> added to cart</span>
    `;
    notification.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--color-success);
      color: #FFF;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      box-shadow: var(--shadow-lg);
      z-index: 999;
      animation: fadeInUp 0.3s ease;
    `;

    document.body.appendChild(notification);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(10px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  };

  /* ── Render Cart Page ────────────────────────────────────────────── */
  window.PRNT.renderCartPage = function () {
    const container = document.getElementById('cart-items');
    const emptyState = document.getElementById('cart-empty');
    const summarySection = document.getElementById('cart-summary-section');
    if (!container) return;

    const totals = window.PRNT.getCartTotals();

    if (totals.items.length === 0) {
      container.style.display = 'none';
      if (summarySection) summarySection.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (summarySection) summarySection.style.display = 'block';
    container.style.display = 'block';

    container.innerHTML = totals.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__image">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item__info">
          <h4 class="cart-item__name">${item.name}</h4>
          <p class="cart-item__spec">${item.spec}</p>
          <div class="cart-item__artwork">
            <label class="form-label">Artwork Note</label>
            <textarea class="form-input cart-artwork-note" rows="2" placeholder="Special instructions for this item...">${item.artworkNote || ''}</textarea>
          </div>
        </div>
        <div class="cart-item__controls">
          <div class="qty-stepper">
            <button class="qty-stepper__btn qty-stepper__btn--minus" aria-label="Decrease quantity"><i data-lucide="minus"></i></button>
            <input type="number" class="qty-stepper__value" value="${item.qty}" min="1" max="9999" aria-label="Quantity" />
            <button class="qty-stepper__btn qty-stepper__btn--plus" aria-label="Increase quantity"><i data-lucide="plus"></i></button>
          </div>
          <div class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</div>
          <button class="cart-item__remove btn btn--sm btn--ghost" aria-label="Remove item">
            <i data-lucide="trash-2"></i> Remove
          </button>
        </div>
      </div>
    `).join('');

    // Update summary
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = '$' + totals.subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + totals.tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + totals.total.toFixed(2);

    if (window.lucide) window.lucide.createIcons();

    // Bind events
    container.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.cart-item').getAttribute('data-id');
        window.PRNT.removeFromCart(id);
        window.PRNT.renderCartPage();
      });
    });

    container.querySelectorAll('.qty-stepper__value').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.closest('.cart-item').getAttribute('data-id');
        window.PRNT.updateCartQty(id, parseInt(input.value, 10) || 1);
        window.PRNT.renderCartPage();
      });
    });

    container.querySelectorAll('.cart-artwork-note').forEach(textarea => {
      textarea.addEventListener('input', () => {
        const id = textarea.closest('.cart-item').getAttribute('data-id');
        window.PRNT.updateArtworkNote(id, textarea.value);
      });
    });
  };

  /* ── Add to Cart Button Handler (Product Pages) ──────────────────── */
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (!addBtn) return;
    e.preventDefault();

    const product = {
      id: addBtn.getAttribute('data-product-id'),
      name: addBtn.getAttribute('data-product-name'),
      price: parseFloat(addBtn.getAttribute('data-product-price')),
      image: addBtn.getAttribute('data-product-image') || '',
      spec: addBtn.getAttribute('data-product-spec') || ''
    };

    window.PRNT.addToCart(product);
  });

})();
