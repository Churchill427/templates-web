/* ============================================================
   LUME — Forms JS (Validation, File Upload, Password Strength)
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initFormValidation();
    initPasswordStrength();
  });

  // ════════════════════════════════════════════════════════════
  // FORM VALIDATION
  // ════════════════════════════════════════════════════════════
  function initFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(function (form) {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', function (e) {
        var isValid = true;
        form.querySelectorAll('[required]').forEach(function (input) {
          clearError(input);
          if (!validateField(input)) {
            isValid = false;
            showError(input, getErrorMessage(input));
          }
        });
        if (!isValid) {
          e.preventDefault();
          var firstError = form.querySelector('.form-group--error .form-input');
          if (firstError) firstError.focus();
        }
      });

      // Live validation on blur
      form.querySelectorAll('.form-input').forEach(function (input) {
        input.addEventListener('blur', function () {
          clearError(input);
          if (input.hasAttribute('required') && !validateField(input)) {
            showError(input, getErrorMessage(input));
          }
        });
        input.addEventListener('input', function () {
          if (input.closest('.form-group--error')) {
            clearError(input);
            if (!validateField(input)) {
              showError(input, getErrorMessage(input));
            }
          }
        });
      });
    });
  }

  function validateField(input) {
    var value = input.value.trim();
    if (input.hasAttribute('required') && !value) return false;
    if (input.type === 'email' && value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (input.getAttribute('data-min-length')) {
      return value.length >= parseInt(input.getAttribute('data-min-length'));
    }
    if (input.getAttribute('data-match')) {
      var matchEl = document.getElementById(input.getAttribute('data-match'));
      return matchEl && value === matchEl.value;
    }
    return true;
  }

  function getErrorMessage(input) {
    var value = input.value.trim();
    if (!value) return 'This field is required.';
    if (input.type === 'email') return 'Please enter a valid email address.';
    if (input.getAttribute('data-min-length')) return 'Must be at least ' + input.getAttribute('data-min-length') + ' characters.';
    if (input.getAttribute('data-match')) return 'Fields do not match.';
    return 'Invalid input.';
  }

  function showError(input, message) {
    var group = input.closest('.form-group');
    if (group) {
      group.classList.add('form-group--error');
      var errorEl = group.querySelector('.form-error');
      if (errorEl) errorEl.textContent = message;
    }
    input.classList.add('form-input--error');
  }

  function clearError(input) {
    var group = input.closest('.form-group');
    if (group) group.classList.remove('form-group--error');
    input.classList.remove('form-input--error');
  }

  // ════════════════════════════════════════════════════════════
  // PASSWORD STRENGTH METER
  // ════════════════════════════════════════════════════════════
  function initPasswordStrength() {
    document.querySelectorAll('[data-password-strength]').forEach(function (input) {
      var meter = document.querySelector('.password-strength');
      var textEl = document.querySelector('.password-strength__text');
      if (!meter) return;

      input.addEventListener('input', function () {
        var val = input.value;
        var score = 0;
        if (val.length >= 8) score++;
        if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
        if (/\d/.test(val)) score++;
        if (/[^a-zA-Z0-9]/.test(val)) score++;

        meter.className = 'password-strength';
        var labels = ['', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        var classes = ['', 'password-strength--weak', 'password-strength--medium', 'password-strength--strong', 'password-strength--very-strong'];
        if (score > 0) meter.classList.add(classes[score]);
        if (textEl) textEl.textContent = val.length > 0 ? labels[score] || '' : '';
      });
    });
  }
})();
