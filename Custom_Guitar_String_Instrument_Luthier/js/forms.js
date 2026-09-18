/**
 * FRET — Client-side Form Validation
 * Handles inline errors, password strength, and HTML5 validation overrides.
 */

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    // Disable native HTML5 validation UI to use custom styles
    form.setAttribute('novalidate', 'true');

    form.addEventListener('submit', (e) => {
      let isValid = true;
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault(); // Stop submission if invalid
      }
    });

    // Validate on blur/input for immediate feedback
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => {
        // Clear error as soon as user types
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl) {
          input.classList.remove('form-input--error');
          errorEl.classList.remove('visible');
        }
        
        // Password strength checker specifically for signup
        if (input.type === 'password' && input.hasAttribute('data-strength')) {
          checkPasswordStrength(input);
        }
      });
    });
  });

  function validateInput(input) {
    if (input.type === 'submit' || input.type === 'button') return true;
    if (!input.hasAttribute('required') && !input.value) return true;

    let isValid = true;
    let errorMessage = '';

    // Required check
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMessage = 'This field is required.';
    } 
    // Email check
    else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }
    // Min length check
    else if (input.hasAttribute('minlength') && input.value) {
      const min = parseInt(input.getAttribute('minlength'));
      if (input.value.length < min) {
        isValid = false;
        errorMessage = `Must be at least ${min} characters.`;
      }
    }

    // Toggle error visuals
    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      if (!isValid) {
        input.classList.add('form-input--error');
        errorEl.textContent = errorMessage;
        // Insert warning SVG icon before text
        errorEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${errorMessage}`;
        errorEl.classList.add('visible');
      } else {
        input.classList.remove('form-input--error');
        errorEl.classList.remove('visible');
      }
    }

    return isValid;
  }

  function checkPasswordStrength(input) {
    const bar = document.querySelector('.password-strength__bar');
    if (!bar) return;

    const val = input.value;
    let strength = '';

    if (val.length === 0) {
      bar.style.width = '0';
    } else if (val.length < 6) {
      strength = 'weak';
    } else if (val.length < 10 || !/\d/.test(val)) {
      strength = 'medium';
    } else {
      strength = 'strong';
    }

    if (strength) {
      bar.setAttribute('data-strength', strength);
    }
  }

  // Password Visibility Toggle (for Login/Signup)
  const passwordToggles = document.querySelectorAll('.password-toggle');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = toggle.getAttribute('aria-controls');
      const input = document.getElementById(targetId);
      
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          toggle.classList.add('show');
        } else {
          input.type = 'password';
          toggle.classList.remove('show');
        }
      }
    });
  });
});
