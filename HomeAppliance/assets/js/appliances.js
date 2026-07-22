/**
 * HOME - Home Appliance Store & Service Center
 * Appliances Product Page Script (assets/js/appliances.js)
 * Live Search, Category Filtering, Wishlist Toggles, Product Comparison
 */

document.addEventListener('DOMContentLoaded', () => {
  initApplianceFilters();
  initWishlist();
  initComparisonModal();
});

function initApplianceFilters() {
  const searchInput = document.getElementById('product-search');
  const categoryPills = document.querySelectorAll('.category-pill');
  const brandFilter = document.getElementById('brand-select');
  const priceFilter = document.getElementById('price-range');
  const priceDisplay = document.getElementById('price-display');
  const productCards = document.querySelectorAll('.appliance-product-card');

  if (!productCards.length) return;

  function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeCategory = document.querySelector('.category-pill.active')?.dataset.category || 'all';
    const selectedBrand = brandFilter ? brandFilter.value.toLowerCase() : 'all';
    const maxPrice = priceFilter ? parseFloat(priceFilter.value) : 5000;

    if (priceDisplay && priceFilter) {
      priceDisplay.textContent = `$${priceFilter.value}`;
    }

    productCards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category.toLowerCase();
      const brand = card.dataset.brand.toLowerCase();
      const price = parseFloat(card.dataset.price);

      const matchesSearch = title.includes(searchTerm);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesBrand = selectedBrand === 'all' || brand === selectedBrand;
      const matchesPrice = price <= maxPrice;

      if (matchesSearch && matchesCategory && matchesBrand && matchesPrice) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterProducts);
  if (brandFilter) brandFilter.addEventListener('change', filterProducts);
  if (priceFilter) priceFilter.addEventListener('input', filterProducts);

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterProducts();
    });
  });
}

function initWishlist() {
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const isWishlisted = btn.classList.contains('active');
      if (typeof showToast === 'function') {
        showToast(isWishlisted ? 'Added to Wishlist!' : 'Removed from Wishlist');
      }
    });
  });
}

function initComparisonModal() {
  const compareBtns = document.querySelectorAll('.compare-btn');
  compareBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pName = btn.dataset.name;
      if (typeof showToast === 'function') {
        showToast(`${pName} added to comparison matrix!`);
      }
    });
  });
}
