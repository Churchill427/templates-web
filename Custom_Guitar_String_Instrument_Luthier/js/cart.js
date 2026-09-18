/**
 * FRET — Cart Drawer System
 * Handles cart state, slide-out drawer, and badge counter logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('.cart-btn');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-drawer__overlay');
  const cartCloseBtn = document.querySelector('.cart-drawer__close');
  const cartBadge = document.querySelector('.header__cart-badge');
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  
  // Basic state (in a real app this would sync with localStorage/backend)
  let cartItemCount = 0;

  // Toggle Cart Drawer
  const toggleCart = (open) => {
    if (!cartDrawer || !cartOverlay) return;
    
    if (open) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent background scroll
      cartDrawer.setAttribute('aria-expanded', 'true');
    } else {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
      cartDrawer.setAttribute('aria-expanded', 'false');
    }
  };

  // Bind Open Buttons
  cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCart(true);
    });
  });

  // Bind Close Actions
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => toggleCart(false));
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => toggleCart(false));
  }

  // Handle Add to Cart clicks (Demo functionality)
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update badge
      cartItemCount++;
      if (cartBadge) {
        cartBadge.textContent = cartItemCount;
        cartBadge.setAttribute('data-count', cartItemCount);
        
        // Add a small animation to badge
        cartBadge.style.transform = 'scale(1.2)';
        setTimeout(() => {
          cartBadge.style.transform = 'scale(1)';
        }, 200);
      }
      
      // Open drawer to show the user
      toggleCart(true);
      
      // In a real app, we would render the cart items here based on data attributes
    });
  });
});
