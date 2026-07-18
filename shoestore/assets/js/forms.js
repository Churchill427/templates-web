/* ========================================
   SOLE — Form Validation & Handling
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initNewsletterForms();
  initPasswordStrength();
  initPasswordToggle();
  initSignupForm();
});

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showFormSuccess(form, 'Thank you! Your message has been sent successfully.');
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

/* ---------- Newsletter Forms ---------- */
function initNewsletterForms() {
  const forms = document.querySelectorAll('.newsletter-form, .footer-newsletter-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && validateEmail(emailInput.value)) {
        emailInput.value = '';
        showToast('Successfully subscribed! Check your inbox for a welcome email.');
      } else if (emailInput) {
        emailInput.style.borderColor = '#ef4444';
        setTimeout(() => { emailInput.style.borderColor = ''; }, 2000);
      }
    });
  });
}

/* ---------- Signup Form ---------- */
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateSignupForm(form)) {
      showFormSuccess(form, 'Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  });

  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

function validateSignupForm(form) {
  let isValid = true;
  const password = form.querySelector('#password');
  const confirmPassword = form.querySelector('#confirmPassword');
  const agreeTerms = form.querySelector('#agreeTerms');

  // Validate all required fields
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) isValid = false;
  });

  // Password match
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    showFieldError(confirmPassword, 'Passwords do not match');
    isValid = false;
  }

  // Terms agreement
  if (agreeTerms && !agreeTerms.checked) {
    const errorEl = agreeTerms.closest('.checkbox-group')?.querySelector('.form-error') ||
                    agreeTerms.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = 'You must agree to the terms';
      errorEl.classList.add('visible');
    }
    isValid = false;
  }

  return isValid;
}

/* ---------- Password Strength ---------- */
function initPasswordStrength() {
  const passwordInputs = document.querySelectorAll('[data-password-strength]');

  passwordInputs.forEach(input => {
    input.addEventListener('input', () => {
      const strength = calculatePasswordStrength(input.value);
      updatePasswordStrengthUI(input, strength);
    });
  });
}

function calculatePasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}

function updatePasswordStrengthUI(input, strength) {
  const container = input.closest('.form-group');
  if (!container) return;

  const bar = container.querySelector('.password-strength-bar');
  const text = container.querySelector('.password-strength-text');

  if (bar) {
    bar.className = 'password-strength-bar ' + strength;
  }

  if (text) {
    const messages = {
      weak: 'Weak — Add uppercase, numbers, or symbols',
      medium: 'Medium — Getting better, try adding more variety',
      strong: 'Strong — Great password!'
    };
    text.textContent = messages[strength];
    text.style.color = strength === 'weak' ? '#ef4444' : strength === 'medium' ? '#f59e0b' : '#22c55e';
  }
}

/* ---------- Password Visibility Toggle ---------- */
function initPasswordToggle() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });
  });
}

/* ---------- Field Validation ---------- */
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let message = '';

  // Required check
  if (field.hasAttribute('required') && !value) {
    message = 'This field is required';
    isValid = false;
  }
  // Email check
  else if (field.type === 'email' && value && !validateEmail(value)) {
    message = 'Please enter a valid email address';
    isValid = false;
  }
  // Phone check
  else if (field.type === 'tel' && value && !/^[\d\s\-\+\(\)]{7,15}$/.test(value)) {
    message = 'Please enter a valid phone number';
    isValid = false;
  }
  // Min length
  else if (field.minLength > 0 && value.length < field.minLength) {
    message = `Minimum ${field.minLength} characters required`;
    isValid = false;
  }

  if (!isValid) {
    showFieldError(field, message);
  } else {
    clearFieldError(field);
  }

  return isValid;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(field, message) {
  field.classList.add('error');
  field.classList.remove('success');

  const errorEl = field.closest('.form-group')?.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearFieldError(field) {
  field.classList.remove('error');
  if (field.value.trim()) {
    field.classList.add('success');
  }

  const errorEl = field.closest('.form-group')?.querySelector('.form-error');
  if (errorEl) {
    errorEl.classList.remove('visible');
  }
}

function validateForm(form) {
  let isValid = true;

  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) isValid = false;
  });

  return isValid;
}

/* ---------- Form Success ---------- */
function showFormSuccess(form, message) {
  const submitBtn = form.querySelector('button[type="submit"], .btn-primary');
  if (submitBtn) {
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sent!';
    submitBtn.style.background = '#22c55e';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      form.reset();
      form.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('success', 'error');
      });
      form.querySelectorAll('.form-error').forEach(el => {
        el.classList.remove('visible');
      });
    }, 3000);
  }

  showToast(message);
}

/* ---------- Toast Notification ---------- */
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
    <span>${message}</span>
  `;

  // Styles
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: type === 'success' ? '#22c55e' : '#ef4444',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: '10000',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    opacity: '0',
    transition: 'all 0.3s ease'
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Remove after 4s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
