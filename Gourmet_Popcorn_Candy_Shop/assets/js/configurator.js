/* ============================================================
   POPZ Gift Tin Configurator
   Multi-step builder: Tin Size → Flavors → Ribbon/Tag
   ============================================================ */

(function () {
  'use strict';

  var currentStep = 1;
  var totalSteps = 3;
  var config = {
    size: null,
    sizeName: '',
    sizePrice: 0,
    flavors: [],
    maxFlavors: 3,
    ribbon: '',
    total: 0
  };

  var prices = {
    small: 19.99,
    medium: 29.99,
    large: 44.99
  };

  var maxFlavorsMap = {
    small: 2,
    medium: 3,
    large: 5
  };

  function init() {
    var configurator = document.getElementById('configurator');
    if (!configurator) return;

    bindSizeSelection();
    bindFlavorChips();
    bindRibbonSelection();
    bindNavButtons();
    updateUI();
  }

  /* Step 1: Tin Size */
  function bindSizeSelection() {
    var sizeCards = document.querySelectorAll('.js-tin-size');
    sizeCards.forEach(function (card) {
      card.addEventListener('click', function () {
        sizeCards.forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        config.size = card.getAttribute('data-size');
        config.sizeName = card.getAttribute('data-name');
        config.sizePrice = prices[config.size] || 0;
        config.maxFlavors = maxFlavorsMap[config.size] || 3;
        config.flavors = [];
        resetFlavorChips();
        updatePreview();
      });
    });
  }

  /* Step 2: Flavors */
  function bindFlavorChips() {
    var chips = document.querySelectorAll('.js-flavor-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var flavor = chip.getAttribute('data-flavor');
        var idx = config.flavors.indexOf(flavor);

        if (idx !== -1) {
          config.flavors.splice(idx, 1);
          chip.classList.remove('selected');
        } else if (config.flavors.length < config.maxFlavors) {
          config.flavors.push(flavor);
          chip.classList.add('selected');
        }
        updatePreview();
      });
    });
  }

  function resetFlavorChips() {
    document.querySelectorAll('.js-flavor-chip').forEach(function (c) {
      c.classList.remove('selected');
    });
  }

  /* Step 3: Ribbon */
  function bindRibbonSelection() {
    var ribbons = document.querySelectorAll('.js-ribbon');
    ribbons.forEach(function (ribbon) {
      ribbon.addEventListener('click', function () {
        ribbons.forEach(function (r) { r.classList.remove('selected'); });
        ribbon.classList.add('selected');
        config.ribbon = ribbon.getAttribute('data-color');
        updatePreview();
      });
    });
  }

  /* Navigation */
  function bindNavButtons() {
    var nextBtns = document.querySelectorAll('.js-config-next');
    var prevBtns = document.querySelectorAll('.js-config-prev');
    var addBtn = document.querySelector('.js-config-add');

    nextBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
          currentStep = Math.min(currentStep + 1, totalSteps);
          updateUI();
        }
      });
    });

    prevBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentStep = Math.max(currentStep - 1, 1);
        updateUI();
      });
    });

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
          var name = config.sizeName + ' Tin (' + config.flavors.join(', ') + ')';
          window.addToCart('custom-tin-' + Date.now(), name, config.sizePrice, '');
          showSuccess();
        }
      });
    }
  }

  function validateStep(step) {
    if (step === 1 && !config.size) {
      alert('Please select a tin size.');
      return false;
    }
    if (step === 2 && config.flavors.length === 0) {
      alert('Please select at least one flavor.');
      return false;
    }
    return true;
  }

  function updateUI() {
    /* Update progress */
    var steps = document.querySelectorAll('.configurator__progress-step');
    steps.forEach(function (step, i) {
      step.classList.remove('active', 'completed');
      if (i + 1 < currentStep) step.classList.add('completed');
      if (i + 1 === currentStep) step.classList.add('active');
    });

    /* Show/hide panels */
    var panels = document.querySelectorAll('.configurator__panel');
    panels.forEach(function (panel, i) {
      panel.classList.toggle('active', i + 1 === currentStep);
    });

    /* Update flavor limit text */
    var limitEl = document.getElementById('flavorLimit');
    if (limitEl) {
      limitEl.textContent = 'Select up to ' + config.maxFlavors + ' flavors (' + config.flavors.length + '/' + config.maxFlavors + ')';
    }

    updatePreview();
  }

  function updatePreview() {
    var previewSize = document.getElementById('previewSize');
    var previewFlavors = document.getElementById('previewFlavors');
    var previewRibbon = document.getElementById('previewRibbon');
    var previewTotal = document.getElementById('previewTotal');

    if (previewSize) previewSize.textContent = config.sizeName || 'Not selected';
    if (previewFlavors) previewFlavors.textContent = config.flavors.length > 0 ? config.flavors.join(', ') : 'None selected';
    if (previewRibbon) previewRibbon.textContent = config.ribbon || 'Not selected';
    if (previewTotal) previewTotal.textContent = '$' + config.sizePrice.toFixed(2);
  }

  function showSuccess() {
    var configurator = document.getElementById('configurator');
    if (configurator) {
      configurator.innerHTML = '<div class="text-center" style="padding:3rem"><svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round"><circle cx="32" cy="32" r="28"/><path d="M20 32l8 8 16-16"/></svg><h3 style="margin:1.5rem 0 0.5rem">Tin Added to Cart!</h3><p style="color:var(--text-muted)">Your custom gift tin has been added. <a href="cart.html">View Cart</a></p></div>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
