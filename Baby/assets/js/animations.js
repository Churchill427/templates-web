/* ==========================================================================
   TINY - Scroll Reveals, Accordions, Countdown Clocks & Form Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initFaqs();
  initComingSoonCountdown();
  initPromoCountdown();
  initContactFormValidation();
  initEnquiryFormValidation();
});

/* 1. Scroll-triggered Reveal Animations */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const triggerBottom = (window.innerHeight / 5) * 4;

    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('revealed');
      } else {
        el.classList.remove('revealed'); // Option to re-animate on scroll up
      }
    });
  };

  // Add standard reveal styles to stylesheet programmatically or via HTML
  const style = document.createElement('style');
  style.innerHTML = `
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial run
}

/* 2. Accordions for Contact & FAQ Pages */
function initFaqs() {
  const faqHeaders = document.querySelectorAll('.accordion-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const icon = header.querySelector('.accordion-icon i');

      // Close all other items (optional, makes it accordion style)
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
          otherItem.querySelector('.accordion-icon i').className = 'fa-solid fa-plus';
        }
      });

      // Toggle current item
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.className = 'fa-solid fa-minus';
      } else {
        content.style.maxHeight = '0px';
        if (icon) icon.className = 'fa-solid fa-plus';
      }
    });
  });

  // Accordion CSS variables
  const style = document.createElement('style');
  style.innerHTML = `
    .accordion-item {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-2);
      overflow: hidden;
      background-color: var(--card-bg);
      transition: var(--transition);
    }
    .accordion-header {
      padding: var(--space-2) var(--space-3);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }
    .accordion-header h4 {
      margin: 0;
    }
    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
      padding: 0 var(--space-3);
    }
    .accordion-item.active .accordion-content {
      padding-bottom: var(--space-3);
    }
    .accordion-icon {
      color: var(--primary-color);
      font-size: 1.1rem;
    }
  `;
  document.head.appendChild(style);
}

/* 3. Coming Soon Countdown Timer */
function initComingSoonCountdown() {
  const countdownContainer = document.getElementById('coming-soon-timer');
  if (!countdownContainer) return;

  // Set target date to 30 days from today
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownContainer.innerHTML = '<h3>We are officially open!</h3>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days-val').textContent = String(days).padStart(2, '0');
    document.getElementById('hours-val').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes-val').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds-val').textContent = String(seconds).padStart(2, '0');
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 4. Promo Banners Countdown Timer (Shop Page) */
function initPromoCountdown() {
  const promoContainer = document.getElementById('shop-promo-countdown');
  if (!promoContainer) return;

  // Set target date to midnight tonight
  const targetDate = new Date();
  targetDate.setHours(24, 0, 0, 0);

  const updatePromoTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      promoContainer.textContent = 'Offers updated!';
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    promoContainer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  updatePromoTimer();
  setInterval(updatePromoTimer, 1000);
}

/* 5. Contact Form Client-side Validation */
function initContactFormValidation() {
  const form = document.getElementById('contact-form-element');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const subject = document.getElementById('contact-subject');
    const message = document.getElementById('contact-message');
    let valid = true;

    // Reset styles
    [name, email, subject, message].forEach(el => {
      el.style.borderColor = '';
      const tooltip = el.parentNode.querySelector('.error-tooltip');
      if (tooltip) tooltip.remove();
    });

    // Check Name
    if (!name.value.trim()) {
      showError(name, 'Name is required');
      valid = false;
    }

    // Check Email
    if (!validateEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      valid = false;
    }

    // Check Subject
    if (!subject.value) {
      showError(subject, 'Please select a inquiry subject');
      valid = false;
    }

    // Check Message
    if (message.value.trim().length < 10) {
      showError(message, 'Message must be at least 10 characters');
      valid = false;
    }

    if (valid) {
      const container = form.parentNode;
      container.innerHTML = `
        <div class="form-success-animation" style="text-align: center; padding: var(--space-4) 0; color: var(--text-primary);">
          <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: var(--secondary-color); margin-bottom: var(--space-2);"></i>
          <h3>Thank you, ${name.value.trim()}!</h3>
          <p style="color: var(--text-secondary); margin-top: var(--space-1);">Your message was sent successfully. We will get back to you within 24 hours.</p>
        </div>
      `;
    }
  });
}

/* 6. Wholesale Enquiry Form Validation */
function initEnquiryFormValidation() {
  const form = document.getElementById('wholesale-enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('enquiry-name');
    const email = document.getElementById('enquiry-email');
    const org = document.getElementById('enquiry-org');
    const type = document.getElementById('enquiry-type');
    const msg = document.getElementById('enquiry-message');
    let valid = true;

    [name, email, org, type, msg].forEach(el => {
      el.style.borderColor = '';
      const tooltip = el.parentNode.querySelector('.error-tooltip');
      if (tooltip) tooltip.remove();
    });

    if (!name.value.trim()) {
      showError(name, 'Contact name is required');
      valid = false;
    }

    if (!validateEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      valid = false;
    }

    if (!org.value.trim()) {
      showError(org, 'School or Organization name is required');
      valid = false;
    }

    if (!type.value) {
      showError(type, 'Please pick an order type');
      valid = false;
    }

    if (msg.value.trim().length < 10) {
      showError(msg, 'Please supply details about your order requirement');
      valid = false;
    }

    if (valid) {
      const container = form.parentNode;
      container.innerHTML = `
        <div class="form-success-animation" style="text-align: center; padding: var(--space-4) 0; color: var(--text-primary);">
          <i class="fa-solid fa-envelope-circle-check" style="font-size: 4rem; color: var(--secondary-color); margin-bottom: var(--space-2);"></i>
          <h3>Enquiry Received!</h3>
          <p style="color: var(--text-secondary); margin-top: var(--space-1);">Our wholesale team will review your application for ${org.value.trim()} and respond shortly.</p>
        </div>
      `;
    }
  });
}

// Helpers
function showError(input, message) {
  input.style.borderColor = 'var(--primary-color)';
  const tooltip = document.createElement('div');
  tooltip.className = 'error-tooltip';
  tooltip.textContent = message;
  tooltip.style.color = 'var(--primary-color)';
  tooltip.style.fontSize = '0.8rem';
  tooltip.style.fontWeight = '600';
  tooltip.style.marginTop = '4px';
  input.parentNode.appendChild(tooltip);
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
