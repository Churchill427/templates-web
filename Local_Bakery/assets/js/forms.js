/* ============================================
   CRUM BAKERY — FORMS JS
   Validation, Multi-step, Float Labels
   ============================================ */

'use strict';

/* ============================================
   FORM VALIDATOR
   ============================================ */
const FormValidator = {
  rules: {
    required: {
      test: (value) => value.trim().length > 0,
      message: 'This field is required'
    },
    email: {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    },
    phone: {
      test: (value) => /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,}$/.test(value),
      message: 'Please enter a valid phone number'
    },
    minLength: {
      test: (value, param) => value.length >= parseInt(param),
      message: (param) => `Must be at least ${param} characters`
    },
    maxLength: {
      test: (value, param) => value.length <= parseInt(param),
      message: (param) => `Must be no more than ${param} characters`
    },
    password: {
      test: (value) => value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value),
      message: 'Password must be 8+ characters with an uppercase letter and number'
    }
  },

  init() {
    // Auto-validate forms with data-validate attribute
    document.querySelectorAll('form[data-validate]').forEach(form => {
      this.setupForm(form);
    });
  },

  setupForm(form) {
    const inputs = form.querySelectorAll('[data-rules]');

    // Real-time validation on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      // Clear error on input
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          this.clearError(input);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        this.handleSubmit(form);
      } else {
        // Shake the first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.classList.add('shake');
          firstInvalid.focus();
          setTimeout(() => firstInvalid.classList.remove('shake'), 500);
        }
      }
    });
  },

  validateField(input) {
    const rules = input.dataset.rules.split('|');
    const value = input.value;

    for (const rule of rules) {
      const [name, param] = rule.split(':');
      const ruleObj = this.rules[name];
      
      if (!ruleObj) continue;

      // Skip empty non-required fields
      if (name !== 'required' && !value.trim()) continue;

      if (!ruleObj.test(value, param)) {
        const message = typeof ruleObj.message === 'function' 
          ? ruleObj.message(param) 
          : ruleObj.message;
        this.showError(input, message);
        return false;
      }
    }

    this.showSuccess(input);
    return true;
  },

  showError(input, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    
    const group = input.closest('.form-group');
    if (group) {
      let errorEl = group.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.innerHTML = `<i class="ph ph-warning-circle"></i><span></span>`;
        group.appendChild(errorEl);
      }
      errorEl.querySelector('span').textContent = message;
      errorEl.classList.add('visible');
    }
  },

  showSuccess(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    this.clearError(input);
  },

  clearError(input) {
    input.classList.remove('is-invalid');
    const group = input.closest('.form-group');
    if (group) {
      const errorEl = group.querySelector('.form-error');
      if (errorEl) errorEl.classList.remove('visible');
    }
  },

  handleSubmit(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn?.innerHTML;

    // Show loading state
    if (submitBtn) {
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
    }

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate submission
    setTimeout(() => {
      // Reset loading
      if (submitBtn) {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      // Show success toast
      if (window.CrumApp?.Toast) {
        window.CrumApp.Toast.success('Form submitted successfully!');
      }

      // Reset form
      form.reset();
      form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
      });

      // Trigger custom event
      form.dispatchEvent(new CustomEvent('form-success', { detail: data }));

      console.log('Form submitted:', data);
    }, 1500);
  }
};


/* ============================================
   MULTI-STEP FORM
   ============================================ */
const MultiStepForm = {
  init() {
    document.querySelectorAll('[data-multistep]').forEach(form => {
      this.setup(form);
    });
  },

  setup(form) {
    const steps = [...form.querySelectorAll('.form-step')];
    const stepIndicators = [...form.querySelectorAll('.step-item')];
    const prevBtns = form.querySelectorAll('[data-step-prev]');
    const nextBtns = form.querySelectorAll('[data-step-next]');
    let currentStep = 0;

    function showStep(index) {
      steps.forEach((step, i) => {
        step.style.display = i === index ? 'block' : 'none';
        step.classList.toggle('active', i === index);
      });

      // Update step indicators
      stepIndicators.forEach((indicator, i) => {
        indicator.classList.remove('active', 'completed');
        if (i < index) indicator.classList.add('completed');
        if (i === index) indicator.classList.add('active');
      });

      // Update step lines
      const lines = form.querySelectorAll('.step-line');
      lines.forEach((line, i) => {
        line.style.background = i < index ? '#22C55E' : 'var(--border-color)';
      });

      // Update prev/next button visibility
      prevBtns.forEach(btn => {
        btn.style.display = index === 0 ? 'none' : '';
      });

      nextBtns.forEach(btn => {
        const isLast = index === steps.length - 1;
        btn.textContent = isLast ? 'Submit' : 'Next';
        if (isLast) {
          btn.setAttribute('type', 'submit');
        } else {
          btn.setAttribute('type', 'button');
        }
      });

      currentStep = index;

      // Smooth scroll to top of form
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Next buttons
    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Validate current step
        const currentStepEl = steps[currentStep];
        const inputs = currentStepEl.querySelectorAll('[data-rules]');
        let valid = true;

        inputs.forEach(input => {
          if (!FormValidator.validateField(input)) {
            valid = false;
          }
        });

        if (valid && currentStep < steps.length - 1) {
          showStep(currentStep + 1);
        }
      });
    });

    // Prev buttons
    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 0) {
          showStep(currentStep - 1);
        }
      });
    });

    // Initialize
    showStep(0);
  }
};


/* ============================================
   FLOAT LABEL (auto-setup)
   ============================================ */
const FloatLabel = {
  init() {
    // Float labels are handled via CSS :placeholder-shown pseudo-class
    // This adds/removes a 'has-value' class for additional JS control
    document.querySelectorAll('.form-float .form-input, .form-float .form-textarea').forEach(input => {
      const updateState = () => {
        input.classList.toggle('has-value', input.value.length > 0);
      };

      input.addEventListener('input', updateState);
      input.addEventListener('change', updateState);
      updateState();
    });
  }
};


/* ============================================
   DATE PICKER ENHANCEMENT
   ============================================ */
const DatePicker = {
  init() {
    document.querySelectorAll('input[type="date"]').forEach(input => {
      // Set min date to today
      if (input.dataset.minToday === 'true') {
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
      }

      // Style enhancement
      input.addEventListener('change', () => {
        input.classList.toggle('has-value', !!input.value);
      });
    });
  }
};


/* ============================================
   NEWSLETTER FORM
   ============================================ */
const NewsletterForm = {
  init() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const input = form.querySelector('input[type="email"]');
        if (!input || !input.value.trim()) return;

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          if (window.CrumApp?.Toast) {
            window.CrumApp.Toast.error('Please enter a valid email address');
          }
          return;
        }

        const btn = form.querySelector('button');
        if (btn) {
          btn.classList.add('btn-loading');
          btn.disabled = true;
        }

        // Simulate subscription
        setTimeout(() => {
          if (btn) {
            btn.classList.remove('btn-loading');
            btn.disabled = false;
          }

          input.value = '';
          
          if (window.CrumApp?.Toast) {
            window.CrumApp.Toast.success('Successfully subscribed! Welcome to CRUM.');
          }
        }, 1200);
      });
    });
  }
};


/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  FormValidator.init();
  MultiStepForm.init();
  FloatLabel.init();
  DatePicker.init();
  NewsletterForm.init();
});

// Export
window.CrumForms = {
  FormValidator,
  MultiStepForm,
  FloatLabel,
  DatePicker,
  NewsletterForm
};
