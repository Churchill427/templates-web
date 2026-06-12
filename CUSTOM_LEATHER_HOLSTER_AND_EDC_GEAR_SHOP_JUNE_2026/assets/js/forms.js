/* ============================================================
   HIDE LEATHER WORKS — Form Validation & File Upload
   ============================================================ */

'use strict';

const FormValidator = {
  rules: {
    required: (value) => value.trim() !== '',
    minLength: (value, min) => value.trim().length >= min,
    maxLength: (value, max) => value.trim().length <= max,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => value === '' || /^[\+]?[\d\s\-\(\)]{7,20}$/.test(value),
    match: (value, target) => value === target,
    password: (value) => value.length >= 8,
    fileSize: (file, maxMB) => file.size <= maxMB * 1024 * 1024,
    fileType: (file, types) => types.includes(file.type)
  },

  messages: {
    required: 'This field is required',
    minLength: (min) => `Must be at least ${min} characters`,
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    match: 'Passwords do not match',
    password: 'Password must be at least 8 characters',
    fileSize: (max) => `File must be smaller than ${max}MB`,
    fileType: 'File type not supported. Please upload images or PDF files'
  },

  init() {
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      this.setupContactForm(contactForm);
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      this.setupLoginForm(loginForm);
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      this.setupSignupForm(signupForm);
    }

    // Newsletter forms
    document.querySelectorAll('[id$="newsletter-form"]').forEach(form => {
      this.setupNewsletterForm(form);
    });

    // File upload zones
    this.setupFileUploads();

    // Password visibility toggles
    this.setupPasswordToggles();

    // Password strength indicators
    this.setupPasswordStrength();
  },

  // --- Validation Helpers ---
  showError(input, message) {
    input.classList.add('form-input--error');
    input.classList.remove('form-input--success');
    let errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      // Insert after the input (or after password wrapper)
      const parent = input.closest('.password-wrapper') || input;
      parent.insertAdjacentElement('afterend', errorEl);
    }
    errorEl.innerHTML = `<i class="ph ph-warning-circle" style="font-size:14px;"></i> ${message}`;
  },

  showSuccess(input) {
    input.classList.remove('form-input--error');
    input.classList.add('form-input--success');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.remove();
  },

  clearValidation(input) {
    input.classList.remove('form-input--error', 'form-input--success');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.remove();
  },

  validateField(input, validations) {
    for (const validation of validations) {
      const { rule, param, message } = validation;
      const value = input.value;

      let isValid;
      if (param !== undefined) {
        isValid = this.rules[rule](value, param);
      } else {
        isValid = this.rules[rule](value);
      }

      if (!isValid) {
        this.showError(input, message);
        return false;
      }
    }
    this.showSuccess(input);
    return true;
  },

  // --- Contact Form ---
  setupContactForm(form) {
    const fields = {
      'contact-name': [
        { rule: 'required', message: this.messages.required },
        { rule: 'minLength', param: 2, message: this.messages.minLength(2) }
      ],
      'contact-email': [
        { rule: 'required', message: this.messages.required },
        { rule: 'email', message: this.messages.email }
      ],
      'contact-phone': [
        { rule: 'phone', message: this.messages.phone }
      ],
      'contact-message': [
        { rule: 'required', message: this.messages.required },
        { rule: 'minLength', param: 10, message: this.messages.minLength(10) }
      ]
    };

    // Blur validation
    Object.keys(fields).forEach(id => {
      const input = form.querySelector(`#${id}`);
      if (input) {
        input.addEventListener('blur', () => {
          this.validateField(input, fields[id]);
        });
        input.addEventListener('input', () => {
          if (input.classList.contains('form-input--error')) {
            this.validateField(input, fields[id]);
          }
        });
      }
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Object.keys(fields).forEach(id => {
        const input = form.querySelector(`#${id}`);
        if (input && !this.validateField(input, fields[id])) {
          isValid = false;
        }
      });

      if (isValid) {
        const btn = form.querySelector('[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;display:inline-block;"></span> Sending...';
        btn.disabled = true;

        // Simulate submission
        setTimeout(() => {
          btn.innerHTML = '<i class="ph ph-check-circle"></i> Sent Successfully';
          btn.style.background = 'var(--color-success)';
          btn.style.borderColor = 'var(--color-success)';

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
            form.reset();
            form.querySelectorAll('.form-input').forEach(i => this.clearValidation(i));
          }, 3000);
        }, 1500);
      }
    });
  },

  // --- Login Form ---
  setupLoginForm(form) {
    const fields = {
      'login-email': [
        { rule: 'required', message: this.messages.required },
        { rule: 'email', message: this.messages.email }
      ],
      'login-password': [
        { rule: 'required', message: this.messages.required },
        { rule: 'password', message: this.messages.password }
      ]
    };

    Object.keys(fields).forEach(id => {
      const input = form.querySelector(`#${id}`);
      if (input) {
        input.addEventListener('blur', () => this.validateField(input, fields[id]));
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      Object.keys(fields).forEach(id => {
        const input = form.querySelector(`#${id}`);
        if (input && !this.validateField(input, fields[id])) isValid = false;
      });

      if (isValid) {
        const btn = form.querySelector('[type="submit"]');
        btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;display:inline-block;"></span> Logging in...';
        btn.disabled = true;
        setTimeout(() => {
          // Simulate redirect
          window.location.href = 'user-dashboard.html';
        }, 1500);
      }
    });
  },

  // --- Signup Form ---
  setupSignupForm(form) {
    const fields = {
      'signup-name': [
        { rule: 'required', message: this.messages.required },
        { rule: 'minLength', param: 2, message: this.messages.minLength(2) }
      ],
      'signup-email': [
        { rule: 'required', message: this.messages.required },
        { rule: 'email', message: this.messages.email }
      ],
      'signup-password': [
        { rule: 'required', message: this.messages.required },
        { rule: 'password', message: this.messages.password }
      ]
    };

    Object.keys(fields).forEach(id => {
      const input = form.querySelector(`#${id}`);
      if (input) {
        input.addEventListener('blur', () => this.validateField(input, fields[id]));
      }
    });

    // Confirm password
    const confirmPw = form.querySelector('#signup-confirm-password');
    const pw = form.querySelector('#signup-password');
    if (confirmPw && pw) {
      confirmPw.addEventListener('blur', () => {
        if (confirmPw.value !== pw.value) {
          this.showError(confirmPw, this.messages.match);
        } else if (confirmPw.value) {
          this.showSuccess(confirmPw);
        }
      });
    }

    // Terms
    const terms = form.querySelector('#signup-terms');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Object.keys(fields).forEach(id => {
        const input = form.querySelector(`#${id}`);
        if (input && !this.validateField(input, fields[id])) isValid = false;
      });

      if (confirmPw && pw && confirmPw.value !== pw.value) {
        this.showError(confirmPw, this.messages.match);
        isValid = false;
      }

      if (terms && !terms.checked) {
        const termsGroup = terms.closest('.form-group');
        if (termsGroup) {
          let errEl = termsGroup.querySelector('.form-error');
          if (!errEl) {
            errEl = document.createElement('p');
            errEl.className = 'form-error';
            termsGroup.appendChild(errEl);
          }
          errEl.innerHTML = '<i class="ph ph-warning-circle" style="font-size:14px;"></i> You must agree to the terms';
        }
        isValid = false;
      }

      if (isValid) {
        const btn = form.querySelector('[type="submit"]');
        btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;display:inline-block;"></span> Creating account...';
        btn.disabled = true;
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      }
    });
  },

  // --- Newsletter ---
  setupNewsletterForm(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !this.rules.email(emailInput.value)) {
        this.showError(emailInput, this.messages.email);
        return;
      }
      this.showSuccess(emailInput);
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.style.background = 'var(--color-success)';
      btn.style.borderColor = 'var(--color-success)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        emailInput.value = '';
        this.clearValidation(emailInput);
      }, 3000);
    });
  },

  // --- File Upload ---
  setupFileUploads() {
    document.querySelectorAll('.upload-zone').forEach(zone => {
      const fileInput = zone.querySelector('input[type="file"]');
      const maxMB = parseInt(zone.dataset.maxSize) || 5;
      const allowedTypes = (zone.dataset.allowedTypes || 'image/jpeg,image/png,image/webp,application/pdf').split(',');

      if (!fileInput) return;

      // Click to upload
      zone.addEventListener('click', () => fileInput.click());

      // Drag events
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          this.handleFileUpload(e.dataTransfer.files, zone, maxMB, allowedTypes);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
          this.handleFileUpload(fileInput.files, zone, maxMB, allowedTypes);
        }
      });
    });
  },

  handleFileUpload(files, zone, maxMB, allowedTypes) {
    const file = files[0];

    // Validate type
    if (!allowedTypes.includes(file.type)) {
      this.showUploadError(zone, this.messages.fileType);
      return;
    }

    // Validate size
    if (!this.rules.fileSize(file, maxMB)) {
      this.showUploadError(zone, this.messages.fileSize(maxMB));
      return;
    }

    // Show progress
    let previewArea = zone.querySelector('.upload-zone__preview');
    if (!previewArea) {
      previewArea = document.createElement('div');
      previewArea.className = 'upload-zone__preview';
      previewArea.style.cssText = 'margin-top:var(--space-4);';
      zone.appendChild(previewArea);
    }

    previewArea.innerHTML = `
      <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);background:var(--bg-secondary);border-radius:var(--radius-md);">
        <i class="ph ph-file" style="font-size:24px;color:var(--color-accent);"></i>
        <div style="flex:1;">
          <p style="font-size:var(--font-size-sm);font-weight:600;margin:0;">${file.name}</p>
          <p style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin:0;">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <div class="progress-bar" style="margin-top:var(--space-2);"><div class="progress-bar__fill" style="width:0%;"></div></div>
        </div>
        <button type="button" class="upload-remove" style="color:var(--color-error);cursor:pointer;background:none;border:none;"><i class="ph ph-x" style="font-size:18px;"></i></button>
      </div>
    `;

    // Animate progress
    const fill = previewArea.querySelector('.progress-bar__fill');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        fill.style.background = 'var(--color-success)';
      }
      fill.style.width = progress + '%';
    }, 300);

    // Remove button
    const removeBtn = previewArea.querySelector('.upload-remove');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      previewArea.remove();
    });

    // Clear errors
    const errEl = zone.querySelector('.upload-error');
    if (errEl) errEl.remove();
  },

  showUploadError(zone, message) {
    let errEl = zone.querySelector('.upload-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'upload-error form-error';
      errEl.style.cssText = 'margin-top:var(--space-3);justify-content:center;';
      zone.appendChild(errEl);
    }
    errEl.innerHTML = `<i class="ph ph-warning-circle" style="font-size:14px;"></i> ${message}`;
  },

  // --- Password Visibility Toggle ---
  setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.closest('.password-wrapper').querySelector('input');
        if (input.type === 'password') {
          input.type = 'text';
          toggle.innerHTML = '<i class="ph ph-eye-slash" style="font-size:18px;"></i>';
        } else {
          input.type = 'password';
          toggle.innerHTML = '<i class="ph ph-eye" style="font-size:18px;"></i>';
        }
      });
    });
  },

  // --- Password Strength ---
  setupPasswordStrength() {
    document.querySelectorAll('[data-password-strength]').forEach(input => {
      const strengthBars = input.closest('.form-group').querySelector('.password-strength');
      if (!strengthBars) return;

      const bars = strengthBars.querySelectorAll('.password-strength__bar');

      input.addEventListener('input', () => {
        const value = input.value;
        let strength = 0;

        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        bars.forEach((bar, index) => {
          bar.classList.remove('active', 'weak', 'medium', 'strong');
          if (index < strength) {
            bar.classList.add('active');
            if (strength <= 1) bar.classList.add('weak');
            else if (strength <= 2) bar.classList.add('medium');
            else bar.classList.add('strong');
          }
        });
      });
    });
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  FormValidator.init();
});
