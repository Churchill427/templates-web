/**
 * AromaLux - Main JavaScript
 * Handles navbar, dark mode, RTL, and global functionality
 */

// ===== Dark Mode Toggle =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Update all dark mode toggle icons
    document.querySelectorAll('.dark-mode-toggle i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.dark-mode-toggle i').forEach(icon => {
            icon.className = 'fas fa-sun';
        });
    });
}


// ===== RTL Toggle =====
function toggleRTL() {
    document.body.classList.toggle('rtl');
    const isRTL = document.body.classList.contains('rtl');
    localStorage.setItem('rtl', isRTL);
}

// Check for saved RTL preference
if (localStorage.getItem('rtl') === 'true') {
    document.body.classList.add('rtl');
}

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenu && overlay) {
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
}

// Close mobile menu when clicking overlay
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('mobileMenuOverlay');
    if (e.target === overlay) {
        toggleMobileMenu();
    }
});

// ===== Sticky Navbar on Scroll =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-luxury');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-sticky');
        } else {
            navbar.classList.remove('navbar-sticky');
        }
    }
});

// ===== Active Navigation Link =====
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-luxury a[href], .mobile-menu a[href]');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const targetPath = href ? href.split('/').pop() : '';
        const isActive = targetPath === currentPath;

        link.classList.toggle('active', isActive);
    });

    const homeMenu = document.querySelector('.navbar-luxury .relative.group');
    if (homeMenu) {
        const homeButton = homeMenu.querySelector('button');
        const hasActiveHomeLink = homeMenu.querySelector(`a[href="${currentPath}"]`);

        if (homeButton) {
            homeButton.classList.toggle('active', Boolean(hasActiveHomeLink));
        }
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Animated Counters =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// Trigger counters when in viewport
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// ===== Product Quick View Modal =====
function openQuickView(productId) {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Here you would typically fetch product data
        console.log('Opening quick view for product:', productId);
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('quickViewModal');
    if (e.target === modal) {
        closeQuickView();
    }
});

// ===== Wishlist Functionality =====
function toggleWishlist(productId) {
    const btn = window.event.currentTarget || event.currentTarget;
    const icon = btn.querySelector('i');
    
    // Toggle heart icon
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#B76E79';
        showToast('Added to wishlist!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        showToast('Removed from wishlist', 'success');
    }
    
    // Save to localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// ===== Add to Cart =====
function addToCart(productId, productName, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast(`${productName} added to cart!`, 'success');
    
    // Update cart count
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ===== Search Functionality =====
function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
    }
}

// ===== Form Validation =====
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#f44336';
            isValid = false;
        } else {
            input.style.borderColor = '#E5E5E5';
        }
    });
    
    return isValid;
}

// ===== Image Gallery for Product Details =====
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}

// ===== Countdown Timer =====
function startCountdown(endDate) {
    const countdownElements = document.querySelectorAll('.countdown-item');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            countdownElements.forEach(el => el.textContent = '00');
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (countdownElements.length >= 4) {
            countdownElements[0].querySelector('.countdown-number').textContent = String(days).padStart(2, '0');
            countdownElements[1].querySelector('.countdown-number').textContent = String(hours).padStart(2, '0');
            countdownElements[2].querySelector('.countdown-number').textContent = String(minutes).padStart(2, '0');
            countdownElements[3].querySelector('.countdown-number').textContent = String(seconds).padStart(2, '0');
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Filter Products =====
function filterProducts(category, minPrice, maxPrice) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const productPrice = parseFloat(product.getAttribute('data-price'));
        
        let showProduct = true;
        
        if (category && category !== 'all' && productCategory !== category) {
            showProduct = false;
        }
        
        if (minPrice && productPrice < minPrice) {
            showProduct = false;
        }
        
        if (maxPrice && productPrice > maxPrice) {
            showProduct = false;
        }
        
        product.style.display = showProduct ? 'block' : 'none';
    });
}

// ===== Sort Products =====
function sortProducts(sortBy) {
    const container = document.querySelector('.products-grid');
    if (!container) return;
    
    const products = Array.from(container.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        const nameA = a.getAttribute('data-name').toLowerCase();
        const nameB = b.getAttribute('data-name').toLowerCase();
        
        switch(sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name-asc':
                return nameA.localeCompare(nameB);
            case 'name-desc':
                return nameB.localeCompare(nameA);
            default:
                return 0;
        }
    });
    
    products.forEach(product => container.appendChild(product));
}

// ===== Newsletter Subscription =====
function subscribeNewsletter(email) {
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    // Simulate API call
    setTimeout(() => {
        showToast('Thank you for subscribing!', 'success');
    }, 500);
    
    return true;
}

// ===== Lazy Loading Images =====
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===== Perfume Finder Quiz UI =====
function startPerfumeQuiz() {
    const quizModal = document.getElementById('perfumeQuizModal');
    if (quizModal) {
        quizModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePerfumeQuiz() {
    const quizModal = document.getElementById('perfumeQuizModal');
    if (quizModal) {
        quizModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth transitions to all buttons
    const buttons = document.querySelectorAll('button, .btn-luxury, .btn-outline-luxury');
    buttons.forEach(btn => {
        btn.style.transition = 'all 0.3s ease';
    });
    
    // Initialize tooltips (if needed)
    initializeTooltips();
});

// ===== Tooltips =====
function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #1A1A1A;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
            
            this._tooltip = tooltip;
        });
        
        trigger.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                this._tooltip = null;
            }
        });
    });
}

console.log('🌸 AromaLux JavaScript Loaded Successfully');
