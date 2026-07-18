/* ========================================
   SOLE — Products, Filtering, Cart, Wishlist
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProductFilters();
  initProductSort();
  initQuickAdd();
  initWishlist();
  initRecentlyViewed();
  initTabs();
  initAccordions();
  initQuantitySelector();
  initColorSwatches();
  initSizeSelector();
  initImageGallery();
  initCountdown();
  initSearchBar();
});

/* ---------- Product Data ---------- */
const PRODUCTS = [
  { id: 1, name: 'Urban Walker Pro', price: 149, category: 'casual', brand: 'SOLE', image: 'assets/images/products/urban-walker.jpg', rating: 4.5, reviews: 128 },
  { id: 2, name: 'Classic Oxford Elite', price: 189, category: 'formal', brand: 'SOLE', image: 'assets/images/products/oxford-elite.jpg', rating: 4.8, reviews: 95 },
  { id: 3, name: 'Flex Fit Trainer', price: 99, category: 'sports', brand: 'SOLE', image: 'assets/images/products/flex-trainer.jpg', rating: 4.3, reviews: 210 },
  { id: 4, name: "Kids' Zoom Sprint", price: 79, category: 'kids', brand: 'SOLE', image: 'assets/images/products/kids-zoom.jpg', rating: 4.6, reviews: 76 },
  { id: 5, name: 'Trail Blazer Hike', price: 159, category: 'sports', brand: 'SOLE', image: 'assets/images/products/trail-blazer.jpg', rating: 4.7, reviews: 154 },
  { id: 6, name: 'Comfort Slip-On', price: 89, category: 'casual', brand: 'SOLE', image: 'assets/images/products/comfort-slipon.jpg', rating: 4.4, reviews: 182 },
  { id: 7, name: 'Court Master Tennis', price: 119, category: 'sports', brand: 'SOLE', image: 'assets/images/products/court-master.jpg', rating: 4.5, reviews: 67 },
  { id: 8, name: 'Beach Breeze Sandal', price: 59, category: 'casual', brand: 'SOLE', image: 'assets/images/products/beach-breeze.jpg', rating: 4.2, reviews: 93 },
  { id: 9, name: 'Winter Shield Boot', price: 199, category: 'casual', brand: 'SOLE', image: 'assets/images/products/winter-shield.jpg', rating: 4.9, reviews: 201 },
  { id: 10, name: 'Dance Flow Ballet', price: 89, category: 'formal', brand: 'SOLE', image: 'assets/images/products/dance-flow.jpg', rating: 4.3, reviews: 44 },
  { id: 11, name: 'Skate Pro Deck', price: 109, category: 'sports', brand: 'SOLE', image: 'assets/images/products/skate-pro.jpg', rating: 4.6, reviews: 118 },
  { id: 12, name: 'Golf Elite Spike', price: 179, category: 'sports', brand: 'SOLE', image: 'assets/images/products/golf-elite.jpg', rating: 4.7, reviews: 56 }
];

/* ---------- Product Filtering ---------- */
function initProductFilters() {
  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  const productGrid = document.getElementById('productGrid');

  if (!filterPills.length || !productGrid) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      const cards = productGrid.querySelectorAll('.product-card');

      cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = '';
          card.style.animation = `fadeUp 0.4s ease-out ${index * 0.05}s both`;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------- Brand Filtering ---------- */
function initBrandFilter() {
  const brandCards = document.querySelectorAll('.brand-filter-btn');
  if (!brandCards.length) return;

  brandCards.forEach(card => {
    card.addEventListener('click', () => {
      brandCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      // In a real app, this would filter products by brand
    });
  });
}

/* ---------- Product Sort ---------- */
function initProductSort() {
  const sortSelect = document.getElementById('productSort');
  const productGrid = document.getElementById('productGrid');

  if (!sortSelect || !productGrid) return;

  sortSelect.addEventListener('change', () => {
    const cards = Array.from(productGrid.querySelectorAll('.product-card'));
    const sortBy = sortSelect.value;

    cards.sort((a, b) => {
      const priceA = parseFloat(a.getAttribute('data-price'));
      const priceB = parseFloat(b.getAttribute('data-price'));
      const nameA = a.getAttribute('data-name') || '';
      const nameB = b.getAttribute('data-name') || '';

      switch (sortBy) {
        case 'price-low': return priceA - priceB;
        case 'price-high': return priceB - priceA;
        case 'name-az': return nameA.localeCompare(nameB);
        case 'name-za': return nameB.localeCompare(nameA);
        default: return 0;
      }
    });

    cards.forEach(card => productGrid.appendChild(card));
  });
}

/* ---------- Quick Add to Cart ---------- */
function initQuickAdd() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-add-btn');
    if (!btn) return;

    const productId = parseInt(btn.getAttribute('data-product-id'));
    addToCart(productId);

    // Visual feedback
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#22c55e';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 1500);
  });
}

/* ---------- Cart (localStorage) ---------- */
function getCart() {
  return JSON.parse(localStorage.getItem('sole-cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('sole-cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }

  saveCart(cart);

  if (typeof showToast === 'function') {
    showToast('Product added to cart!');
  }
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

/* ---------- Wishlist ---------- */
function initWishlist() {
  // Load saved wishlist
  const wishlist = getWishlist();

  document.querySelectorAll('.product-card-wishlist').forEach(btn => {
    const productId = btn.getAttribute('data-product-id');
    if (wishlist.includes(parseInt(productId))) {
      btn.classList.add('active');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-heart';
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-card-wishlist');
    if (!btn) return;

    e.preventDefault();
    const productId = parseInt(btn.getAttribute('data-product-id'));
    toggleWishlist(productId, btn);
  });
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('sole-wishlist') || '[]');
}

function toggleWishlist(productId, btn) {
  let wishlist = getWishlist();
  const icon = btn.querySelector('i');

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    btn.classList.remove('active');
    if (icon) icon.className = 'fa-regular fa-heart';
    if (typeof showToast === 'function') showToast('Removed from wishlist');
  } else {
    wishlist.push(productId);
    btn.classList.add('active');
    if (icon) icon.className = 'fa-solid fa-heart';
    if (typeof showToast === 'function') showToast('Added to wishlist!');
  }

  localStorage.setItem('sole-wishlist', JSON.stringify(wishlist));
}

/* ---------- Recently Viewed ---------- */
function initRecentlyViewed() {
  const container = document.getElementById('recentlyViewed');
  if (!container) return;

  const viewed = getRecentlyViewed();
  if (viewed.length === 0) {
    container.closest('.section')?.style.setProperty('display', 'none');
    return;
  }

  // Render recently viewed items
  const html = viewed.slice(0, 4).map(item => `
    <div class="product-card" style="min-width: 260px;">
      <div class="product-card-img">
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#f0f0f0,#e0e0e0);display:flex;align-items:center;justify-content:center;color:#999;font-size:14px;">Product Image</div>
      </div>
      <div class="product-card-body">
        <h4>${item.name}</h4>
        <p class="product-price">$${item.price}</p>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

function getRecentlyViewed() {
  return JSON.parse(localStorage.getItem('sole-recent') || '[]');
}

function addToRecentlyViewed(product) {
  let recent = getRecentlyViewed();
  recent = recent.filter(p => p.id !== product.id);
  recent.unshift(product);
  recent = recent.slice(0, 8);
  localStorage.setItem('sole-recent', JSON.stringify(recent));
}

/* ---------- Tabs ---------- */
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs-container');

  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetContent = container.querySelector(`#${target}`);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  });
}

/* ---------- Accordions ---------- */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close all accordions in same group
      const group = item.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion-body').style.maxHeight = '0';
          }
        });
      }

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Quantity Selector ---------- */
function initQuantitySelector() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;

    const container = btn.closest('.qty-selector');
    const input = container.querySelector('.qty-input');
    let value = parseInt(input.value) || 1;

    if (btn.classList.contains('qty-minus')) {
      value = Math.max(1, value - 1);
    } else if (btn.classList.contains('qty-plus')) {
      value = Math.min(99, value + 1);
    }

    input.value = value;
  });
}

/* ---------- Color Swatches ---------- */
function initColorSwatches() {
  const swatchGroups = document.querySelectorAll('.color-swatches');

  swatchGroups.forEach(group => {
    group.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        // Update main image if data-image is set
        const newImage = swatch.getAttribute('data-image');
        if (newImage) {
          const mainImg = document.querySelector('.product-gallery-main img');
          if (mainImg) {
            mainImg.style.opacity = '0';
            setTimeout(() => {
              mainImg.src = newImage;
              mainImg.style.opacity = '1';
            }, 200);
          }
        }
      });
    });
  });
}

/* ---------- Size Selector ---------- */
function initSizeSelector() {
  const sizeGroups = document.querySelectorAll('.size-buttons');

  sizeGroups.forEach(group => {
    group.querySelectorAll('.size-btn').forEach(btn => {
      if (btn.classList.contains('out-of-stock')) return;

      btn.addEventListener('click', () => {
        group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

/* ---------- Image Gallery ---------- */
function initImageGallery() {
  const mainImage = document.querySelector('.product-gallery-main img');
  const thumbs = document.querySelectorAll('.product-gallery-thumb');

  if (!mainImage || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.querySelector('img')?.src;
      if (newSrc) {
        mainImage.style.opacity = '0';
        mainImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
          mainImage.src = newSrc;
          mainImage.style.opacity = '1';
          mainImage.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

/* ---------- Countdown Timer ---------- */
function initCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  // Set target date to 30 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownEl.innerHTML = '<p style="color:var(--accent);font-size:24px;">We\'re Live!</p>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = countdownEl.querySelector('[data-days]');
    const hoursEl = countdownEl.querySelector('[data-hours]');
    const minsEl = countdownEl.querySelector('[data-minutes]');
    const secsEl = countdownEl.querySelector('[data-seconds]');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ---------- Search Bar ---------- */
function initSearchBar() {
  const searchInputs = document.querySelectorAll('.search-input');

  searchInputs.forEach(input => {
    input.addEventListener('input', debounce(() => {
      const query = input.value.trim().toLowerCase();
      const productGrid = document.getElementById('productGrid');

      if (!productGrid || !query) {
        // Show all products
        productGrid?.querySelectorAll('.product-card').forEach(card => {
          card.style.display = '';
        });
        return;
      }

      productGrid.querySelectorAll('.product-card').forEach(card => {
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const category = (card.getAttribute('data-category') || '').toLowerCase();

        if (name.includes(query) || category.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }, 300));
  });
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
