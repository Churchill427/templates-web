/**
 * FRET — Gallery Filter System
 * Handles category filtering with smooth reflow animation for Home 2 & Instruments.
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid = document.getElementById('gallery-grid');

  if (!filterBtns.length || !galleryItems.length || !galleryGrid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Add a brief opacity fade-out to the grid container
      galleryGrid.style.opacity = '0';
      galleryGrid.style.transition = 'opacity 0.2s ease';

      setTimeout(() => {
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });

        // Fade grid container back in
        galleryGrid.style.opacity = '1';
      }, 200);
    });
  });
});
