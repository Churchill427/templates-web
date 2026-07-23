// js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cartBtn');
    const cartPanel = document.getElementById('cartPanel');
    const closeCartBtn = document.getElementById('closeCart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartBadge = document.querySelector('.cart-badge');
    const cartItemsContainer = document.querySelector('.cart-items');
    
    let cartCount = 0;

    if(cartBtn && cartPanel) {
        cartBtn.addEventListener('click', () => {
            cartPanel.classList.add('open');
        });
        closeCartBtn.addEventListener('click', () => {
            cartPanel.classList.remove('open');
        });
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.innerHTML;
            
            // Animation state
            btn.classList.add('btn-added');
            btn.innerHTML = '<i class="ph ph-check"></i> Added';
            
            cartCount++;
            if(cartBadge) {
                cartBadge.textContent = cartCount;
            }

            // Create fake item in cart
            if(cartItemsContainer) {
                const itemHTML = `
                    <div class="cart-item">
                        <img src="https://images.unsplash.com/photo-1590488961726-2679c5c8325a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Tyre" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4>Pirelli P-Zero PZ4</h4>
                            <div class="cart-item-price">$249.99</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Qty: 1</div>
                        </div>
                        <button class="cart-remove"><i class="ph ph-trash"></i></button>
                    </div>
                `;
                // Remove empty message if exists
                if(cartItemsContainer.innerHTML.includes('Your cart is empty')) {
                    cartItemsContainer.innerHTML = '';
                }
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            }

            setTimeout(() => {
                btn.classList.remove('btn-added');
                btn.innerHTML = originalText;
            }, 2000);
        });
    });

    // Size Guide Interactivity
    const sizeParts = document.querySelectorAll('.size-string span');
    const sizeInfoTitle = document.getElementById('sizeInfoTitle');
    const sizeInfoDesc = document.getElementById('sizeInfoDesc');

    const sizeData = {
        'width': { title: 'Tyre Width (225)', desc: 'The width of the tyre measured in millimeters from sidewall to sidewall.' },
        'aspect': { title: 'Aspect Ratio (40)', desc: 'The height of the sidewall as a percentage of the tyre width (40% of 225mm).' },
        'construction': { title: 'Construction (R)', desc: 'R stands for Radial, the most common type of tyre construction.' },
        'diameter': { title: 'Wheel Diameter (18)', desc: 'The diameter of the wheel in inches that the tyre is designed to fit.' }
    };

    sizeParts.forEach(part => {
        part.addEventListener('click', () => {
            sizeParts.forEach(p => p.classList.remove('active'));
            part.classList.add('active');
            
            const type = part.getAttribute('data-type');
            if(sizeData[type]) {
                sizeInfoTitle.textContent = sizeData[type].title;
                sizeInfoDesc.textContent = sizeData[type].desc;
            }
        });
    });
});
