/* ============================================
   PAWLY — Form Validation & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initPasswordToggles();
  initPhoneFormatting();
  initCharCounters();
});

/* ── Form Validation ── */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('.form-input[required], .form-input[data-validate]');

    // Real-time validation on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      // Clear error on input
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          clearFieldError(input);
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      // Check checkboxes (like terms agreement)
      form.querySelectorAll('input[type="checkbox"][required]').forEach(cb => {
        if (!cb.checked) {
          isValid = false;
          const group = cb.closest('.form-group') || cb.parentElement;
          showFieldError(group, cb, 'You must agree to continue.');
        }
      });

      if (isValid) {
        handleFormSubmit(form);
      }
    });
  });
}

/* ── Validate a Single Field ── */
function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const name = input.name || input.id;
  const group = input.closest('.form-group') || input.parentElement;

  // Required check
  if (input.required && !value) {
    showFieldError(group, input, getRequiredMessage(name));
    return false;
  }

  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      showFieldError(group, input, 'Please enter a valid email address.');
      return false;
    }
  }

  // Phone validation
  if ((type === 'tel' || name === 'phone') && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    if (!phoneRegex.test(value)) {
      showFieldError(group, input, 'Please enter a valid phone number.');
      return false;
    }
  }

  // Password validation
  if (type === 'password' && name !== 'confirm-password' && value) {
    if (value.length < 8) {
      showFieldError(group, input, 'Password must be at least 8 characters.');
      return false;
    }
  }

  // Confirm password
  if (name === 'confirm-password' && value) {
    const passwordInput = input.form.querySelector('input[name="password"], input[type="password"]:not([name="confirm-password"])');
    if (passwordInput && value !== passwordInput.value) {
      showFieldError(group, input, 'Passwords do not match.');
      return false;
    }
  }

  // Min length
  if (input.minLength && input.minLength > 0 && value.length < input.minLength) {
    showFieldError(group, input, `Must be at least ${input.minLength} characters.`);
    return false;
  }

  // Custom pattern
  if (input.pattern && value) {
    const regex = new RegExp(input.pattern);
    if (!regex.test(value)) {
      showFieldError(group, input, input.title || 'Invalid format.');
      return false;
    }
  }

  // All good
  clearFieldError(input);
  input.classList.add('success');
  return true;
}

/* ── Show/Clear Field Error ── */
function showFieldError(group, input, message) {
  input.classList.remove('success');
  input.classList.add('error');

  let errorEl = group.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    group.appendChild(errorEl);
  }

  errorEl.innerHTML = `<i class="ph ph-warning-circle"></i> ${message}`;
  errorEl.classList.add('visible');
}

function clearFieldError(input) {
  input.classList.remove('error');

  const group = input.closest('.form-group') || input.parentElement;
  const errorEl = group.querySelector('.form-error');
  if (errorEl) {
    errorEl.classList.remove('visible');
  }
}

/* ── Required Field Messages ── */
function getRequiredMessage(name) {
  const messages = {
    'name': 'Please enter your name.',
    'full-name': 'Please enter your full name.',
    'email': 'Please enter your email address.',
    'phone': 'Please enter your phone number.',
    'password': 'Please enter a password.',
    'confirm-password': 'Please confirm your password.',
    'message': 'Please enter your message.',
    'subject': 'Please enter a subject.',
    'pet-type': 'Please select your pet type.'
  };

  return messages[name] || 'This field is required.';
}

/* ── Password Show/Hide Toggle ── */
function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.form-input-icon').querySelector('input');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Update icon
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'ph ph-eye-slash' : 'ph ph-eye';
      }

      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });
}

/* ── Phone Number Formatting ── */
function initPhoneFormatting() {
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
      // Allow only digits, spaces, hyphens, plus, parens
      let value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
      e.target.value = value;
    });
  });
}

/* ── Character Counters ── */
function initCharCounters() {
  document.querySelectorAll('[data-char-count]').forEach(input => {
    const max = parseInt(input.dataset.charCount, 10);
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
      font-size: 12px;
      color: var(--color-text-muted);
      text-align: right;
      margin-top: 4px;
    `;

    input.parentElement.appendChild(counter);

    function updateCounter() {
      const remaining = max - input.value.length;
      counter.textContent = `${input.value.length}/${max}`;

      if (remaining < 0) {
        counter.style.color = 'var(--color-error)';
      } else if (remaining < 20) {
        counter.style.color = 'var(--color-warning)';
      } else {
        counter.style.color = 'var(--color-text-muted)';
      }
    }

    input.addEventListener('input', updateCounter);
    updateCounter();
  });
}

/* ── Form Submit Handler ── */
function handleFormSubmit(form) {
  const submitBtn = form.querySelector('button[type="submit"], .btn-submit');
  const originalText = submitBtn ? submitBtn.textContent : '';

  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;margin-right:8px;display:inline-block;vertical-align:middle;"></span> Processing...';
  }

  // Simulate submission delay
  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }

    // Show success state
    showFormSuccess(form);

    // Show toast
    if (typeof showToast === 'function') {
      showToast('Submitted successfully!', 'success');
    }

    // Reset form after delay
    setTimeout(() => {
      form.reset();
      form.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('success', 'error');
      });
      form.querySelectorAll('.form-error').forEach(err => {
        err.classList.remove('visible');
      });
      hideFormSuccess(form);
    }, 3000);
  }, 1500);
}

/* ── Form Success State ── */
function showFormSuccess(form) {
  let successEl = form.querySelector('.form-success');

  if (!successEl) {
    successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.style.cssText = `
      text-align: center;
      padding: var(--space-lg);
      background: rgba(82, 183, 136, 0.08);
      border-radius: var(--radius-lg);
      margin-top: var(--space-md);
    `;
    successEl.innerHTML = `
      <svg class="success-checkmark" viewBox="0 0 64 64" style="width:48px;height:48px;margin:0 auto var(--space-sm);">
        <circle cx="32" cy="32" r="30" fill="var(--color-success)"/>
        <path d="M20 33 L28 41 L44 25" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h4 style="color:var(--color-success);margin-bottom:4px;">Success!</h4>
      <p style="color:var(--color-text-secondary);margin:0;">Your submission has been received.</p>
    `;
    form.appendChild(successEl);
  }

  successEl.style.display = 'block';
  successEl.style.animation = 'fadeInUp 400ms ease-out';
}

function hideFormSuccess(form) {
  const successEl = form.querySelector('.form-success');
  if (successEl) {
    successEl.style.display = 'none';
  }
}

/* ── Star Rating Input ── */
function initStarRating() {
  document.querySelectorAll('.star-rating-input').forEach(container => {
    const stars = container.querySelectorAll('.star');
    const input = container.querySelector('input[type="hidden"]');

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        const value = index + 1;
        if (input) input.value = value;

        stars.forEach((s, i) => {
          s.classList.toggle('active', i < value);
          s.classList.toggle('empty', i >= value);
        });
      });

      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => {
          s.style.color = i <= index ? 'var(--color-secondary)' : '';
        });
      });

      star.addEventListener('mouseleave', () => {
        stars.forEach(s => {
          s.style.color = '';
        });
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initStarRating);
