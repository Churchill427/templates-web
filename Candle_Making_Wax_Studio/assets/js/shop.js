/* ============================================================
   LUME — Shop JS (Product Filtering, Quick View, Scent Quiz)
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initFilters();
    initQuiz();
  });

  // ════════════════════════════════════════════════════════════
  // PRODUCT FILTERING
  // ════════════════════════════════════════════════════════════
  var activeScent = 'all';
  var activeVessel = 'all';

  function initFilters() {
    var scentFilters = document.querySelectorAll('#scent-filters .filter-pill');
    var vesselFilters = document.querySelectorAll('#vessel-filters .filter-pill');

    scentFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        scentFilters.forEach(function (b) { b.classList.remove('filter-pill--active'); });
        btn.classList.add('filter-pill--active');
        activeScent = btn.getAttribute('data-filter');
        filterProducts();
      });
    });

    vesselFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        vesselFilters.forEach(function (b) { b.classList.remove('filter-pill--active'); });
        btn.classList.add('filter-pill--active');
        activeVessel = btn.getAttribute('data-vessel');
        filterProducts();
      });
    });
  }

  function filterProducts() {
    var cards = document.querySelectorAll('#product-grid .card');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var scent = card.getAttribute('data-scent');
      var vessel = card.getAttribute('data-vessel');
      var scentMatch = activeScent === 'all' || scent === activeScent;
      var vesselMatch = activeVessel === 'all' || vessel === activeVessel;

      if (scentMatch && vesselMatch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    var countEl = document.getElementById('product-count');
    if (countEl) {
      countEl.textContent = 'Showing ' + visibleCount + ' product' + (visibleCount !== 1 ? 's' : '');
    }
  }

  // ════════════════════════════════════════════════════════════
  // QUICK VIEW
  // ════════════════════════════════════════════════════════════
  var productData = {
    'Amber Noir': { notes: 'Top: Bergamot, Saffron | Heart: Amber, Vanilla | Base: Sandalwood, Musk', price: '$38.00' },
    'Botanical Garden': { notes: 'Top: Green Tea, Bergamot | Heart: Jasmine, Lily | Base: White Musk, Cedar', price: '$36.00' },
    'Coastal Drift': { notes: 'Top: Sea Salt, Lemon | Heart: Driftwood, Coconut | Base: Amber, Musk', price: '$34.00' },
    'Spiced Hearth': { notes: 'Top: Cinnamon, Clove | Heart: Orange Peel, Nutmeg | Base: Cedarwood, Vanilla', price: '$36.00' },
    'Midnight Orchid': { notes: 'Top: Plum, Black Currant | Heart: Orchid, Rose | Base: Oud, Patchouli', price: '$42.00' },
    'Cedarwood & Moss': { notes: 'Top: Eucalyptus, Pine | Heart: Cedar, Moss | Base: Vetiver, Earth', price: '$40.00' },
    'Honey & Fig': { notes: 'Top: Fig Leaf, Pear | Heart: Raw Honey, Almond | Base: Tonka, Sandalwood', price: '$36.00' },
    'Linen & Rain': { notes: 'Top: Ozone, Cucumber | Heart: Linen, Lily | Base: Musk, Driftwood', price: '$32.00' },
    'Fireside Ember': { notes: 'Top: Birch, Black Pepper | Heart: Smoke, Leather | Base: Amber, Musk', price: '$38.00' },
    'Rose Santal': { notes: 'Top: Rose Petals, Pink Pepper | Heart: Santal, Iris | Base: Cream, Musk', price: '$40.00' },
    'Vanilla & Tobacco': { notes: 'Top: Tobacco Leaf, Bergamot | Heart: Vanilla, Caramel | Base: Amber, Cedar', price: '$36.00' },
    'Eucalyptus & Mint': { notes: 'Top: Eucalyptus, Spearmint | Heart: Basil, Tea Tree | Base: Cedar, White Musk', price: '$34.00' }
  };

  window.openQuickView = function (name) {
    var overlay = document.getElementById('quick-view-overlay');
    var titleEl = document.getElementById('qv-title');
    var notesEl = document.getElementById('qv-notes');
    var data = productData[name];

    if (titleEl) titleEl.textContent = name + (data ? ' — ' + data.price : '');
    if (notesEl) notesEl.textContent = data ? data.notes : '';
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeQuickView = function () {
    var overlay = document.getElementById('quick-view-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close on overlay click
  var overlay = document.getElementById('quick-view-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) window.closeQuickView();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeQuickView();
  });

  // ════════════════════════════════════════════════════════════
  // SCENT QUIZ (Mini Interactive)
  // ════════════════════════════════════════════════════════════
  var quizQuestions = [
    { question: 'What mood are you setting?', options: ['Cozy evening in', 'Energize & focus', 'Romantic ambiance', 'Fresh & clean'] },
    { question: 'Pick your comfort zone:', options: ['Fireside warmth', 'Garden stroll', 'Ocean breeze', 'Bakery aroma'] },
    { question: 'Your ideal weekend:', options: ['Cabin retreat', 'Spa day', 'Beach sunset', 'Brunch with friends'] }
  ];

  var quizStep = 0;
  var quizAnswers = [];

  function initQuiz() {
    var optionsContainer = document.getElementById('quiz-options');
    if (!optionsContainer) return;

    document.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        quizAnswers.push(btn.getAttribute('data-answer') || btn.textContent);
        quizStep++;

        if (quizStep < quizQuestions.length) {
          renderQuizStep(quizStep);
        } else {
          showQuizResult();
        }
      });
    });
  }

  function renderQuizStep(step) {
    var q = quizQuestions[step];
    var questionEl = document.querySelector('.quiz-question');
    var optionsEl = document.getElementById('quiz-options');
    var dots = document.querySelectorAll('.quiz-dot');

    if (questionEl) questionEl.textContent = q.question;

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i <= step);
    });

    if (optionsEl) {
      optionsEl.innerHTML = '';
      q.options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', function () {
          quizAnswers.push(opt);
          quizStep++;
          if (quizStep < quizQuestions.length) {
            renderQuizStep(quizStep);
          } else {
            showQuizResult();
          }
        });
        optionsEl.appendChild(btn);
      });
    }
  }

  function showQuizResult() {
    var questionEl = document.querySelector('.quiz-question');
    var optionsEl = document.getElementById('quiz-options');
    var dots = document.querySelectorAll('.quiz-dot');

    var recommendations = ['Amber Noir', 'Fireside Ember', 'Rose Santal', 'Coastal Drift'];
    var pick = recommendations[Math.floor(Math.random() * recommendations.length)];

    dots.forEach(function (dot) { dot.classList.add('active'); });

    if (questionEl) questionEl.textContent = 'We recommend: ' + pick;
    if (optionsEl) {
      optionsEl.innerHTML = '<a href="product.html" class="btn btn--primary" style="margin-top:var(--space-md);">View ' + pick + '</a>';
    }
  }
})();
