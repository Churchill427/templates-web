/**
 * HOME - Home Appliance Store & Service Center
 * FAQ Accordion Script (assets/js/faq.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordion();
});

function initFAQAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close other accordion items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const c = i.querySelector('.accordion-content');
        if (c) c.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}
