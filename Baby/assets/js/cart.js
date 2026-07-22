/* ==========================================================================
   TINY - E-commerce Local Storage Cart & Checkout System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  if (document.getElementById('cart-items-container')) {
    renderCart();
  }
  setupAddToCartButtons();
  setupPromoCode();
  setupCheckoutFlow();
});

// Mock Cart Database Helper
function getCart() {
  return JSON.parse(localStorage.getItem('tiny_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('tiny_cart', JSON.stringify(cart));
  updateCartBadge();
}

/* 1. Update Cart Badge Count */
function updateCartBadge() {
  const cart = getCart();
  const badges = document.querySelectorAll('.cart-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  badges.forEach(badge => {
    badge.textContent = totalItems;
    // Hide badge if empty
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
}

/* 2. Setup Shop Page "Add to Cart" Triggers */
function setupAddToCartButtons() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const btn = e.target;
      const id = btn.getAttribute('data-product-id') || 'prod_001';
      const name = btn.getAttribute('data-product-name') || 'TINY Play Outfit';
      const price = parseFloat(btn.getAttribute('data-product-price') || '29.99');
      const img = btn.getAttribute('data-product-img') || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80';
      
      // Look for select size/color within same card or page detail
      let size = 'M';
      let color = 'Default';
      let qty = 1;

      const sizeSelect = document.querySelector(`.size-selector[data-id="${id}"]`) || document.getElementById('product-size');
      if (sizeSelect) {
        size = sizeSelect.value || sizeSelect.querySelector('.active')?.textContent || 'M';
      }

      const colorSelect = document.querySelector(`.color-selector[data-id="${id}"]`) || document.getElementById('product-color');
      if (colorSelect) {
        color = colorSelect.value || colorSelect.querySelector('.active')?.getAttribute('data-color') || 'Default';
      }

      const qtyInput = document.getElementById('product-quantity');
      if (qtyInput) {
        qty = parseInt(qtyInput.value) || 1;
      }

      addToCart(id, name, price, img, size, color, qty);

      // Button feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      btn.style.backgroundColor = '#4ECDC4';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    }
  });
}

/* 3. Add Item to Cart Array */
function addToCart(id, name, price, img, size, color, quantity) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === id && item.size === size && item.color === color);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ id, name, price, img, size, color, quantity });
  }

  saveCart(cart);
}

/* 4. Render Cart Listing Page */
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const cart = getCart();
  
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px var(--space-3);">
        <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--text-muted); margin-bottom: var(--space-2);"></i>
        <h3 style="margin-bottom: var(--space-2);">Your cart is currently empty.</h3>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-3);">Browse our lovely collection and pick items for your little ones!</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    updateTotals(0);
    return;
  }

  let html = '';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item-row" data-index="${index}" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) 0; border-bottom: 1px solid var(--border-color); gap: var(--space-2);">
        <div style="display: flex; align-items: center; gap: var(--space-2); flex: 2;">
          <img src="${item.img}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);">
          <div>
            <h4 style="margin: 0; font-size: 1rem;">${item.name}</h4>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Size: ${item.size} | Color: ${item.color}</span>
          </div>
        </div>
        <div style="flex: 1; text-align: center; font-weight: 700; color: var(--primary-color);">
          $${item.price.toFixed(2)}
        </div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <button class="qty-btn dec-qty" data-index="${index}" style="background: none; border: 1px solid var(--border-color); width: 24px; height: 24px; cursor: pointer; border-radius: var(--radius-sm); font-weight: bold; color: var(--text-primary);">-</button>
          <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
          <button class="qty-btn inc-qty" data-index="${index}" style="background: none; border: 1px solid var(--border-color); width: 24px; height: 24px; cursor: pointer; border-radius: var(--radius-sm); font-weight: bold; color: var(--text-primary);">+</button>
        </div>
        <div style="flex: 1; text-align: right; font-weight: 700; color: var(--text-primary);">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
        <div>
          <button class="remove-item" data-index="${index}" style="background: none; border: none; color: #DB4437; cursor: pointer; font-size: 1.1rem;" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Bind Adjusters & Deletion
  container.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const cart = getCart();
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
        saveCart(cart);
        renderCart();
      }
    });
  });

  container.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const cart = getCart();
      cart[idx].quantity++;
      saveCart(cart);
      renderCart();
    });
  });

  container.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.closest('.remove-item').getAttribute('data-index'));
      const cart = getCart();
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    });
  });

  // Calculate prices
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  updateTotals(subtotal);
}

/* 5. Update Order Totals Panel */
let currentDiscountPercent = 0;

function updateTotals(subtotal) {
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountEl = document.getElementById('cart-discount');
  const taxEl = document.getElementById('cart-tax');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');

  if (!subtotalEl) return;

  const discount = subtotal * (currentDiscountPercent / 100);
  const taxedAmount = (subtotal - discount) * 0.05; // 5% Sales Tax
  const shipping = subtotal > 0 && (subtotal - discount) < 100 ? 10.00 : 0.00; // Free shipping over $100
  const grandTotal = subtotal - discount + taxedAmount + shipping;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  discountEl.textContent = `-$${discount.toFixed(2)}`;
  taxEl.textContent = `$${taxedAmount.toFixed(2)}`;
  shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
  totalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

/* 6. Coupon Verification Code */
function setupPromoCode() {
  const applyBtn = document.getElementById('apply-promo-btn');
  const promoInput = document.getElementById('promo-code-input');
  const feedbackEl = document.getElementById('promo-feedback');

  if (applyBtn && promoInput) {
    applyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'TINY10') {
        currentDiscountPercent = 10;
        feedbackEl.textContent = 'Promo code TINY10 (10% off) applied!';
        feedbackEl.style.color = '#4ECDC4';
      } else {
        currentDiscountPercent = 0;
        feedbackEl.textContent = 'Invalid promo code. Try TINY10.';
        feedbackEl.style.color = '#FF6B6B';
      }
      const cart = getCart();
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      updateTotals(subtotal);
    });
  }
}

/* 7. Multi-step Checkout Flow Logic */
function setupCheckoutFlow() {
  const checkoutBtn = document.getElementById('checkout-next-btn');
  const cartSection = document.getElementById('cart-section-main');
  const billingSection = document.getElementById('checkout-billing-section');
  const paymentSection = document.getElementById('checkout-payment-section');
  const confirmationSection = document.getElementById('checkout-confirmation-section');

  const step1 = document.getElementById('step-indicator-1');
  const step2 = document.getElementById('step-indicator-2');
  const step3 = document.getElementById('step-indicator-3');

  if (checkoutBtn && cartSection) {
    let currentStep = 1;

    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      if (currentStep === 1) {
        // Go to Billing Form
        cartSection.style.display = 'none';
        billingSection.style.display = 'block';
        step1.classList.remove('active');
        step1.classList.add('completed');
        step2.classList.add('active');
        checkoutBtn.textContent = 'Proceed to Payment';
        currentStep = 2;
      } else if (currentStep === 2) {
        // Basic billing input validation
        const nameInput = document.getElementById('billing-name');
        const emailInput = document.getElementById('billing-email');
        const addressInput = document.getElementById('billing-address');

        if (!nameInput.value || !emailInput.value || !addressInput.value) {
          alert('Please fill out all mandatory fields.');
          return;
        }

        // Go to Payment Section
        billingSection.style.display = 'none';
        paymentSection.style.display = 'block';
        step2.classList.remove('active');
        step2.classList.add('completed');
        step3.classList.add('active');
        checkoutBtn.textContent = 'Place Order';
        currentStep = 3;
      } else if (currentStep === 3) {
        // Basic card input validation
        const cardNo = document.getElementById('payment-card-no');
        const cardExpiry = document.getElementById('payment-card-expiry');
        const cardCvv = document.getElementById('payment-card-cvv');

        if (!cardNo.value || !cardExpiry.value || !cardCvv.value) {
          alert('Please fill out card details.');
          return;
        }

        // Place Order - Success!
        paymentSection.style.display = 'none';
        document.getElementById('checkout-summary-sidebar').style.display = 'none';
        checkoutBtn.style.display = 'none';
        confirmationSection.style.display = 'block';
        
        // Mark Step 3 completed
        step3.classList.remove('active');
        step3.classList.add('completed');

        // Clear Cart
        localStorage.removeItem('tiny_cart');
        updateCartBadge();
      }
    });
  }
}
