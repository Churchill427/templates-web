document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('[data-menu-filter]');
  const categories = document.querySelectorAll('.menu-category-section');
  const items = document.querySelectorAll('.menu-list-item');
  
  const spotlightImg = document.getElementById('spotlight-img');
  const spotlightTitle = document.getElementById('spotlight-title');
  const spotlightDesc = document.getElementById('spotlight-desc');
  const spotlightPrice = document.getElementById('spotlight-price');
  const spotlightStatus = document.getElementById('spotlight-status');
  
  // Transition speed matches CSS styles
  function updateSpotlight(item) {
    if (!item) return;
    
    // Toggle active item
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    const img = item.getAttribute('data-image');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');
    const price = item.getAttribute('data-price');
    const status = item.getAttribute('data-status');
    
    if (spotlightImg) {
      spotlightImg.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
      spotlightImg.style.opacity = '0.4';
      spotlightImg.style.transform = 'scale(0.97)';
      
      setTimeout(() => {
        spotlightImg.src = img;
        spotlightImg.alt = title;
        spotlightImg.style.opacity = '1';
        spotlightImg.style.transform = 'scale(1)';
      }, 150);
    }
    
    if (spotlightTitle) spotlightTitle.textContent = title;
    if (spotlightDesc) spotlightDesc.textContent = desc;
    if (spotlightPrice) spotlightPrice.textContent = price;
    
    if (spotlightStatus) {
      spotlightStatus.textContent = status;
      if (status === 'Sold Out') {
        spotlightStatus.className = 'spotlight-badge status-soldout';
      } else {
        spotlightStatus.className = 'spotlight-badge';
      }
    }
  }
  
  // Filtering functionality
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-menu-filter');
      
      categories.forEach(cat => {
        const catValue = cat.getAttribute('data-menu-category');
        if (filterValue === 'all' || catValue === filterValue) {
          cat.classList.remove('hidden');
        } else {
          cat.classList.add('hidden');
        }
      });
      
      // Spotlight first visible item of filtered category
      const firstVisibleItem = Array.from(items).find(item => {
        const parentCat = item.closest('.menu-category-section');
        return !parentCat.classList.contains('hidden');
      });
      
      if (firstVisibleItem) {
        updateSpotlight(firstVisibleItem);
      }
    });
  });
  
  // Event listeners for hover and click on menu items
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      updateSpotlight(item);
    });
    item.addEventListener('click', () => {
      updateSpotlight(item);
    });
  });
  
  // Initialize spotlight with the active item
  const initialActive = document.querySelector('.menu-list-item.active');
  if (initialActive) {
    updateSpotlight(initialActive);
  }
});
