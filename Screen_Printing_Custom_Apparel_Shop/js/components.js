/* ═══════════════════════════════════════════════════════════════════
   PRNT — Component JavaScript
   Accordion, lightbox, count-up, form validation, horizontal scroll,
   tabs/filters, countdown, multi-step form, qty stepper
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Accordion ───────────────────────────────────────────────────── */
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.accordion__trigger');
    if (!trigger) return;

    const item = trigger.closest('.accordion__item');
    const content = item.querySelector('.accordion__content');
    const isOpen = item.classList.contains('is-open');

    // Close all siblings
    const accordion = item.closest('.accordion');
    if (accordion) {
      accordion.querySelectorAll('.accordion__item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.accordion__content').style.maxHeight = '0';
        }
      });
    }

    if (isOpen) {
      item.classList.remove('is-open');
      content.style.maxHeight = '0';
    } else {
      item.classList.add('is-open');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });

  /* ── Lightbox / Gallery Modal ────────────────────────────────────── */
  window.PRNT = window.PRNT || {};

  window.PRNT.openLightbox = function (src, alt) {
    let backdrop = document.querySelector('.lightbox-backdrop');
    let lightbox = document.querySelector('.lightbox-modal');

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop lightbox-backdrop';
      backdrop.addEventListener('click', window.PRNT.closeLightbox);
      document.body.appendChild(backdrop);

      lightbox = document.createElement('div');
      lightbox.className = 'modal lightbox lightbox-modal';
      lightbox.innerHTML = `
        <button class="modal__close" aria-label="Close lightbox"><i data-lucide="x"></i></button>
        <img src="" alt="" />
      `;
      lightbox.querySelector('.modal__close').addEventListener('click', window.PRNT.closeLightbox);
      document.body.appendChild(lightbox);
    }

    lightbox.querySelector('img').src = src;
    lightbox.querySelector('img').alt = alt || '';

    requestAnimationFrame(() => {
      backdrop.classList.add('is-open');
      lightbox.classList.add('is-open');
      document.body.classList.add('no-scroll');
    });

    // Re-init lucide icons if available
    if (window.lucide) window.lucide.createIcons();
  };

  window.PRNT.closeLightbox = function () {
    const backdrop = document.querySelector('.lightbox-backdrop');
    const lightbox = document.querySelector('.lightbox-modal');
    if (backdrop) backdrop.classList.remove('is-open');
    if (lightbox) lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.PRNT.closeLightbox();
  });

  // Gallery item clicks
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-lightbox]');
    if (!item) return;
    e.preventDefault();
    const src = item.getAttribute('data-lightbox') || item.querySelector('img')?.src;
    const alt = item.querySelector('img')?.alt || '';
    if (src) window.PRNT.openLightbox(src, alt);
  });

  /* ── Count-Up Animation ──────────────────────────────────────────── */
  function animateCountUp(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    el.classList.add('is-counting');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }
  initCountUp();

  /* ── Form Validation ─────────────────────────────────────────────── */
  window.PRNT.validateForm = function (form) {
    let isValid = true;
    const fields = form.querySelectorAll('[data-validate]');

    fields.forEach(field => {
      const rules = field.getAttribute('data-validate').split(',');
      const errorEl = field.closest('.form-group')?.querySelector('.form-error');
      let fieldValid = true;
      let errorMsg = '';

      rules.forEach(rule => {
        rule = rule.trim();
        const value = field.value.trim();

        if (rule === 'required' && !value) {
          fieldValid = false;
          errorMsg = 'This field is required';
        }
        if (rule === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldValid = false;
          errorMsg = 'Please enter a valid email address';
        }
        if (rule === 'phone' && value && !/^[\+]?[0-9\s\-\(\)]{7,15}$/.test(value)) {
          fieldValid = false;
          errorMsg = 'Please enter a valid phone number';
        }
        if (rule === 'min:6' && value && value.length < 6) {
          fieldValid = false;
          errorMsg = 'Must be at least 6 characters';
        }
        if (rule === 'match') {
          const matchField = form.querySelector(field.getAttribute('data-match'));
          if (matchField && value !== matchField.value) {
            fieldValid = false;
            errorMsg = 'Passwords do not match';
          }
        }
      });

      if (!fieldValid) {
        isValid = false;
        field.classList.add('form-input--error');
        if (errorEl) {
          errorEl.classList.add('is-visible');
          const textEl = errorEl.querySelector('span') || errorEl;
          textEl.textContent = errorMsg;
        }
      } else {
        field.classList.remove('form-input--error');
        if (errorEl) errorEl.classList.remove('is-visible');
      }
    });

    return isValid;
  };

  // Clear error on input
  document.addEventListener('input', e => {
    if (e.target.classList.contains('form-input--error')) {
      e.target.classList.remove('form-input--error');
      const errorEl = e.target.closest('.form-group')?.querySelector('.form-error');
      if (errorEl) errorEl.classList.remove('is-visible');
    }
  });

  /* ── Password Show/Hide Toggle ───────────────────────────────────── */
  document.addEventListener('click', e => {
    const toggle = e.target.closest('.form-password-toggle');
    if (!toggle) return;

    const input = toggle.parentElement.querySelector('input');
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    const icon = toggle.querySelector('i');
    if (icon) {
      if (isPassword) {
        icon.setAttribute('data-lucide', 'eye-off');
      } else {
        icon.setAttribute('data-lucide', 'eye');
      }
      if (window.lucide) window.lucide.createIcons();
    }
  });

  /* ── Horizontal Scroll Strip with Drag ───────────────────────────── */
  function initHorizontalScroll() {
    document.querySelectorAll('.scroll-strip').forEach(strip => {
      let isDown = false;
      let startX;
      let scrollLeft;

      strip.addEventListener('mousedown', e => {
        isDown = true;
        strip.classList.add('is-dragging');
        startX = e.pageX - strip.offsetLeft;
        scrollLeft = strip.scrollLeft;
      });

      strip.addEventListener('mouseleave', () => {
        isDown = false;
        strip.classList.remove('is-dragging');
      });

      strip.addEventListener('mouseup', () => {
        isDown = false;
        strip.classList.remove('is-dragging');
      });

      strip.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - strip.offsetLeft;
        const walk = (x - startX) * 2;
        strip.scrollLeft = scrollLeft - walk;
      });
    });
  }
  initHorizontalScroll();

  /* ── Tab / Filter Chip Switching ─────────────────────────────────── */
  document.addEventListener('click', e => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;

    const filterGroup = chip.closest('.filter-group');
    if (filterGroup) {
      filterGroup.querySelectorAll('[data-filter]').forEach(c => c.classList.remove('is-active'));
    }
    chip.classList.add('is-active');

    const filterValue = chip.getAttribute('data-filter');
    const targetGrid = document.querySelector(chip.getAttribute('data-target') || '.filter-grid');
    if (!targetGrid) return;

    const items = targetGrid.querySelectorAll('[data-category]');
    items.forEach(item => {
      if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
        item.style.display = '';
        item.classList.add('is-filtering');
        setTimeout(() => item.classList.remove('is-filtering'), 400);
      } else {
        item.style.display = 'none';
      }
    });
  });

  /* ── Countdown Timer ─────────────────────────────────────────────── */
  window.PRNT.initCountdown = function (targetDate, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    function update() {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        container.innerHTML = '<span class="countdown__expired">We\'re Live!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const units = container.querySelectorAll('.countdown__unit');
      if (units.length >= 4) {
        const vals = [days, hours, minutes, seconds];
        units.forEach((unit, i) => {
          const digitEl = unit.querySelector('.countdown__digit');
          const newVal = String(vals[i]).padStart(2, '0');
          if (digitEl && digitEl.textContent !== newVal) {
            digitEl.classList.add('is-flipping');
            setTimeout(() => {
              digitEl.textContent = newVal;
              digitEl.classList.remove('is-flipping');
            }, 250);
          }
        });
      }

      requestAnimationFrame(() => setTimeout(update, 1000));
    }

    update();
  };

  /* ── Multi-Step Form ─────────────────────────────────────────────── */
  window.PRNT.initMultiStepForm = function (formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const indicators = form.querySelectorAll('.progress-step');
    let currentStep = 0;

    function showStep(index) {
      steps.forEach((step, i) => {
        step.style.display = i === index ? 'block' : 'none';
      });
      indicators.forEach((ind, i) => {
        ind.classList.remove('is-active', 'is-completed');
        if (i < index) ind.classList.add('is-completed');
        if (i === index) ind.classList.add('is-active');
      });
      currentStep = index;
    }

    showStep(0);

    form.addEventListener('click', e => {
      if (e.target.closest('[data-step-next]')) {
        // Validate current step
        const currentStepEl = steps[currentStep];
        const fields = currentStepEl.querySelectorAll('[data-validate]');
        let valid = true;
        fields.forEach(field => {
          const val = field.value.trim();
          const errorEl = field.closest('.form-group')?.querySelector('.form-error');
          if (field.getAttribute('data-validate').includes('required') && !val) {
            valid = false;
            field.classList.add('form-input--error');
            if (errorEl) {
              errorEl.classList.add('is-visible');
              const textEl = errorEl.querySelector('span') || errorEl;
              textEl.textContent = 'This field is required';
            }
          }
        });

        if (valid && currentStep < steps.length - 1) {
          showStep(currentStep + 1);
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (e.target.closest('[data-step-prev]')) {
        if (currentStep > 0) {
          showStep(currentStep - 1);
        }
      }
    });
  };

  /* ── Qty Stepper ─────────────────────────────────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.qty-stepper__btn');
    if (!btn) return;

    const stepper = btn.closest('.qty-stepper');
    const input = stepper.querySelector('.qty-stepper__value');
    let value = parseInt(input.value, 10) || 1;
    const min = parseInt(input.getAttribute('min'), 10) || 1;
    const max = parseInt(input.getAttribute('max'), 10) || 9999;

    if (btn.classList.contains('qty-stepper__btn--minus')) {
      value = Math.max(min, value - 1);
    } else {
      value = Math.min(max, value + 1);
    }

    input.value = value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ── Process Step Connector Animation ────────────────────────────── */
  function initProcessConnectors() {
    const connectors = document.querySelectorAll('.process-connector');
    if (!connectors.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    connectors.forEach(c => observer.observe(c));
  }
  initProcessConnectors();

  /* ── Smooth Scroll for Anchor Links ──────────────────────────────── */
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ── Interactive Fabric & Quality Guide ─────────────────────────── */
  function initFabricGuide() {
    // 1. Category Tabs Filtering
    document.addEventListener('click', e => {
      const tab = e.target.closest('.fabric-tab');
      if (!tab) return;

      const cat = tab.getAttribute('data-fabric-cat');
      const tabsContainer = tab.closest('.fabric-tabs');
      if (!tabsContainer) return;
      tabsContainer.querySelectorAll('.fabric-tab').forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const cards = document.querySelectorAll('.fabric-card');
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (cat === 'all' || cardCat === cat) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });

    // 2. Grid vs Matrix View Toggle
    document.addEventListener('click', e => {
      const btn = e.target.closest('.view-btn');
      if (!btn) return;

      const view = btn.getAttribute('data-view');
      const toggleWrapper = btn.closest('.fabric-view-toggle');
      if (!toggleWrapper) return;
      toggleWrapper.querySelectorAll('.view-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const gridView = document.getElementById('fabricCardsGrid');
      const matrixView = document.getElementById('fabricMatrixWrapper');

      if (view === 'matrix') {
        if (gridView) gridView.style.display = 'none';
        if (matrixView) matrixView.classList.add('is-active');
      } else {
        if (gridView) gridView.style.display = '';
        if (matrixView) matrixView.classList.remove('is-active');
      }
    });

    // 3. Card Color Swatch Picker
    document.addEventListener('click', e => {
      const swatch = e.target.closest('.card-swatch-dot');
      if (!swatch) return;

      const colorName = swatch.getAttribute('data-color');
      const container = swatch.closest('.fabric-card__colors');
      if (container) {
        container.querySelectorAll('.card-swatch-dot').forEach(d => d.classList.remove('is-selected'));
        swatch.classList.add('is-selected');
        const readout = container.querySelector('.swatch-color-name');
        if (readout) readout.textContent = colorName;
      }
    });

    // 4. Global Swatch Click Feedback
    document.addEventListener('click', e => {
      const gSwatch = e.target.closest('.global-swatch-item');
      if (!gSwatch) return;
      const colorName = gSwatch.getAttribute('data-swatch-name');
      if (colorName) {
        alert(`Color preview: "${colorName}". Over 30+ custom shades available for bulk order production!`);
      }
    });

    // 5. Sample Pack Request CTA
    document.addEventListener('click', e => {
      const sampleBtn = e.target.closest('.fabric-sample-btn');
      if (!sampleBtn) return;
      const fabricName = sampleBtn.getAttribute('data-fabric') || 'Fabric';
      alert(`Sample Swatch Pack for "${fabricName}" added! Our team will send out your fabric tactile sample kit.`);
    });
  }
  initFabricGuide();

})();
