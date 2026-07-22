/**
 * HOME - Home Appliance Store & Service Center
 * Services Booking Script (assets/js/services.js)
 * Interactive 4-step wizard form for repair booking
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

function initBookingWizard() {
  const wizardForm = document.getElementById('booking-wizard-form');
  if (!wizardForm) return;

  const stepItems = document.querySelectorAll('.wizard-step-item');
  const stepPanes = document.querySelectorAll('.wizard-step-pane');
  const nextBtns = document.querySelectorAll('.wizard-next-btn');
  const prevBtns = document.querySelectorAll('.wizard-prev-btn');

  let currentStep = 1;

  function updateWizardUI() {
    stepItems.forEach(item => {
      const stepNum = parseInt(item.dataset.step);
      if (stepNum === currentStep) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    stepPanes.forEach(pane => {
      const stepNum = parseInt(pane.dataset.step);
      if (stepNum === currentStep) {
        pane.style.display = 'block';
      } else {
        pane.style.display = 'none';
      }
    });

    // Populate summary if step 4
    if (currentStep === 4) {
      const name = document.getElementById('cust-name')?.value || 'N/A';
      const phone = document.getElementById('cust-phone')?.value || 'N/A';
      const appliance = document.getElementById('appliance-type')?.value || 'N/A';
      const date = document.getElementById('service-date')?.value || 'N/A';
      const time = document.getElementById('service-time')?.value || 'N/A';

      const summaryBox = document.getElementById('booking-summary-box');
      if (summaryBox) {
        summaryBox.innerHTML = `
          <div style="background: var(--bg-main); padding: 1.5rem; border-radius: 10px; border: 1px solid var(--border-color); text-align: left;">
            <p><strong>Customer Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Appliance:</strong> ${appliance}</p>
            <p><strong>Scheduled Slot:</strong> ${date} at ${time}</p>
          </div>
        `;
      }
    }
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Simple client side validation
      const currentPane = document.querySelector(`.wizard-step-pane[data-step="${currentStep}"]`);
      const inputs = currentPane.querySelectorAll('input[required], select[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#EF4444';
        } else {
          input.style.borderColor = 'var(--border-color)';
        }
      });

      if (!valid) {
        if (typeof showToast === 'function') showToast('Please fill out all required fields.');
        return;
      }

      if (currentStep < 4) {
        currentStep++;
        updateWizardUI();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  });

  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof showToast === 'function') {
      showToast('Booking submitted successfully! A technician will call you shortly.');
    }
    currentStep = 1;
    wizardForm.reset();
    updateWizardUI();
  });
}
