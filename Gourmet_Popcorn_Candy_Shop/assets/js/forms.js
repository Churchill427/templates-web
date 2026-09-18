/* ============================================================
   POPZ Form Validation
   Handles: Contact, Newsletter, Bulk Enquiry, Auth forms
   ============================================================ */

(function () {
  'use strict';

  function init() {
    initContactForm();
    initBulkForm();
  }

  /**
   * Contact form validation and success state.
   */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var fields = [
        { el: form.querySelector('#contactName'), min: 2, msg: 'Name is required (min 2 characters)' },
        { el: form.querySelector('#contactEmail'), type: 'email', msg: 'Valid email is required' },
        { el: form.querySelector('#contactMessage'), min: 10, msg: 'Message must be at least 10 characters' }
      ];

      fields.forEach(function (f) {
        if (!f.el) return;
        clearError(f.el);
        var val = f.el.value.trim();

        if (f.type === 'email') {
          if (!isValidEmail(val)) {
            showError(f.el, f.msg);
            valid = false;
          }
        } else if (f.min && val.length < f.min) {
          showError(f.el, f.msg);
          valid = false;
        }
      });

      if (valid) {
        var successEl = document.getElementById('contactSuccess');
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      }
    });
  }

  /**
   * Bulk enquiry form validation.
   */
  function initBulkForm() {
    var form = document.getElementById('bulkForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var fields = [
        { el: form.querySelector('#bulkName'), min: 2, msg: 'Name is required' },
        { el: form.querySelector('#bulkEmail'), type: 'email', msg: 'Valid email is required' },
        { el: form.querySelector('#bulkGuests'), min: 1, msg: 'Estimated guest count is required' }
      ];

      fields.forEach(function (f) {
        if (!f.el) return;
        clearError(f.el);
        var val = f.el.value.trim();

        if (f.type === 'email') {
          if (!isValidEmail(val)) { showError(f.el, f.msg); valid = false; }
        } else if (val.length < f.min) {
          showError(f.el, f.msg); valid = false;
        }
      });

      if (valid) {
        var successEl = document.getElementById('bulkSuccess');
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      }
    });
  }

  /* ── Helpers ───────────────────────────────────────────── */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(el, msg) {
    el.classList.add('error');
    var errEl = el.parentNode.querySelector('.form-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  }

  function clearError(el) {
    el.classList.remove('error');
    var errEl = el.parentNode.querySelector('.form-error');
    if (errEl) errEl.classList.remove('show');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
