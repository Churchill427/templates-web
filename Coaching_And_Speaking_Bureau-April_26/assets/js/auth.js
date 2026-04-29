/* ============================================
   AUTH MODULE - Login/Register functionality
   ============================================ */
'use strict';

const Auth = (() => {
  /**
   * Initialize password visibility toggle
   */
  function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('[data-password-toggle]');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const inputId = btn.getAttribute('data-password-toggle');
        const input = document.getElementById(inputId);
        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          btn.querySelector('i').className = 'ri-eye-off-line';
        } else {
          input.type = 'password';
          btn.querySelector('i').className = 'ri-eye-line';
        }
      });
    });
  }

  /**
   * Initialize auth form validation
   */
  function initAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('#loginEmail');
        const password = loginForm.querySelector('#loginPassword');
        let valid = true;

        clearErrors(loginForm);

        if (!email.value.trim()) {
          showFieldError(email, 'Email is required');
          valid = false;
        } else if (!isValidEmail(email.value)) {
          showFieldError(email, 'Enter a valid email');
          valid = false;
        }

        if (!password.value.trim()) {
          showFieldError(password, 'Password is required');
          valid = false;
        }

        if (valid) {
          // Simulate login
          showAuthToast('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = 'user-dashboard.html';
          }, 1500);
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        clearErrors(registerForm);

        const fullName = registerForm.querySelector('#regName');
        const email = registerForm.querySelector('#regEmail');
        const password = registerForm.querySelector('#regPassword');
        const confirmPassword = registerForm.querySelector('#regConfirmPassword');
        const terms = registerForm.querySelector('#regTerms');

        if (!fullName.value.trim()) {
          showFieldError(fullName, 'Full name is required');
          valid = false;
        }

        if (!email.value.trim()) {
          showFieldError(email, 'Email is required');
          valid = false;
        } else if (!isValidEmail(email.value)) {
          showFieldError(email, 'Enter a valid email');
          valid = false;
        }

        if (!password.value.trim()) {
          showFieldError(password, 'Password is required');
          valid = false;
        } else if (password.value.length < 8) {
          showFieldError(password, 'Password must be at least 8 characters');
          valid = false;
        }

        if (confirmPassword && password.value !== confirmPassword.value) {
          showFieldError(confirmPassword, 'Passwords do not match');
          valid = false;
        }

        if (terms && !terms.checked) {
          showFieldError(terms, 'You must agree to the terms');
          valid = false;
        }

        if (valid) {
          showAuthToast('Account created! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1500);
        }
      });
    }
  }

  function showFieldError(input, message) {
    input.classList.add('form-input--error');
    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    input.closest('.form-group').appendChild(error);
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-error').forEach(e => e.remove());
    form.querySelectorAll('.form-input--error').forEach(e => e.classList.remove('form-input--error'));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showAuthToast(message, type) {
    let toast = document.querySelector('.auth-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast auth-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.borderLeftColor = type === 'success' ? 'var(--color-accent)' : 'var(--color-error)';
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function init() {
    initPasswordToggle();
    initAuthForm();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Auth.init);
