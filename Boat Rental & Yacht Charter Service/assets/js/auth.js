/* ============================================
   AquaLux — Auth JavaScript
   Social login handlers, password visibility
   ============================================ */

'use strict';

const Auth = (() => {
  function init() {
    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (input && input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else if (input) {
          input.type = 'password';
          btn.innerHTML = '<i class="fas fa-eye"></i>';
        }
      });
    });

    // Social login buttons (demo)
    document.querySelectorAll('.btn--google, .btn--facebook, .btn--apple').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = btn.classList.contains('btn--google') ? 'Google' :
                         btn.classList.contains('btn--facebook') ? 'Facebook' : 'Apple';
        if (typeof AquaLux !== 'undefined') {
          AquaLux.showToast(`${provider} authentication would redirect to ${provider} OAuth`, 'info');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
