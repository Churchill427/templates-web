/**
 * FRET — Accordion System
 * Handles expand/collapse logic with smooth max-height animation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const content = item.querySelector('.accordion__content');
      const inner = content.querySelector('.accordion__content-inner');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Toggle current item
      if (isExpanded) {
        // Collapse
        content.style.maxHeight = 0;
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
      } else {
        // Expand
        content.style.maxHeight = inner.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        
        // Optional: Auto-collapse siblings (uncomment if accordion should only have one open item at a time)
        /*
        const siblings = item.parentElement.querySelectorAll('.accordion__item');
        siblings.forEach(sibling => {
          if (sibling !== item) {
            const siblingTrigger = sibling.querySelector('.accordion__trigger');
            const siblingContent = sibling.querySelector('.accordion__content');
            siblingContent.style.maxHeight = 0;
            siblingTrigger.setAttribute('aria-expanded', 'false');
            sibling.classList.remove('active');
          }
        });
        */
      }
    });
  });

  // Handle window resize for expanded items (update max-height)
  window.addEventListener('resize', () => {
    const activeItems = document.querySelectorAll('.accordion__item.active');
    activeItems.forEach(item => {
      const content = item.querySelector('.accordion__content');
      const inner = item.querySelector('.accordion__content-inner');
      content.style.maxHeight = inner.scrollHeight + 'px';
    });
  });
});
