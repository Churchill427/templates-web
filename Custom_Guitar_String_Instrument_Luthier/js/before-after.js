/**
 * FRET — Before/After Drag Slider
 * Handles the interactive drag comparison image slider (Home 2, Repair).
 */

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.ba-slider');

  sliders.forEach(slider => {
    const beforeImg = slider.querySelector('.before-img');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;
    let isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    // Update isRTL state if toggled dynamically (listening to dir attribute change)
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'dir') {
          isRTL = document.documentElement.getAttribute('dir') === 'rtl';
          // Reset slider position on direction change
          updateSlider(0.5);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    const getXPosition = (e) => {
      let clientX;
      if (e.type.includes('mouse')) {
        clientX = e.clientX;
      } else if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
      }
      
      const rect = slider.getBoundingClientRect();
      let x = clientX - rect.left;
      
      // Calculate percentage
      let percent = x / rect.width;
      
      // Clamp between 0 and 1
      percent = Math.max(0, Math.min(1, percent));
      return percent;
    };

    const updateSlider = (percent) => {
      const percentage = percent * 100;
      
      // Update handle position
      handle.style.left = `${percentage}%`;
      
      // Update clip-path for before image
      if (isRTL) {
        // In RTL, we drag from right to left visually, 
        // but clip-path coordinates are still left-to-right (0 0 0 [right-inset])
        beforeImg.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      } else {
        beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      }
    };

    // Initialize at 50%
    updateSlider(0.5);

    // Mouse Events
    const onMouseDown = (e) => {
      isDragging = true;
      slider.style.cursor = 'ew-resize';
      updateSlider(getXPosition(e));
      e.preventDefault(); // Prevent text selection/drag ghosting
    };

    const onMouseUp = () => {
      isDragging = false;
      slider.style.cursor = 'ew-resize';
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      updateSlider(getXPosition(e));
    };

    // Touch Events
    const onTouchStart = (e) => {
      isDragging = true;
      updateSlider(getXPosition(e));
    };
    
    const onTouchEnd = () => {
      isDragging = false;
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      updateSlider(getXPosition(e));
      // Prevent scrolling while dragging slider
      e.preventDefault(); 
    };

    // Bind events
    handle.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mousedown', onMouseDown); // Allow clicking anywhere on slider to jump
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    handle.addEventListener('touchstart', onTouchStart, { passive: false });
    slider.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
  });
});
