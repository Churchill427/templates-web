/**
 * SUDZ - Interactive Premium Sections JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. About: Interactive Process ── */
    const processBtns = document.querySelectorAll('.process-btn');
    const processShapes = document.querySelectorAll('.process-shape');
    const processTexts = document.querySelectorAll('.process-text');
    
    if (processBtns.length > 0) {
        processBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const step = btn.getAttribute('data-step');
                
                // Reset all
                processBtns.forEach(b => b.classList.remove('active'));
                processShapes.forEach(s => s.classList.remove('active'));
                processTexts.forEach(t => t.classList.remove('active'));
                
                // Activate clicked
                btn.classList.add('active');
                document.getElementById(`shape-${step}`).classList.add('active');
                document.getElementById(`text-${step}`).classList.add('active');
            });
        });
    }

    /* ── 3. Products: Scent Visualizer ── */
    const scentTabs = document.querySelectorAll('.scent-tab');
    const topBar = document.getElementById('scent-top');
    const midBar = document.getElementById('scent-mid');
    const baseBar = document.getElementById('scent-base');

    const scentData = {
        floral: { top: '80%', mid: '60%', base: '30%' },
        woody:  { top: '30%', mid: '50%', base: '90%' },
        citrus: { top: '90%', mid: '40%', base: '20%' },
        earthy: { top: '40%', mid: '70%', base: '80%' }
    };

    if (scentTabs.length > 0 && topBar) {
        scentTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                scentTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const type = tab.getAttribute('data-scent');
                topBar.style.width = scentData[type].top;
                midBar.style.width = scentData[type].mid;
                baseBar.style.width = scentData[type].base;
            });
        });
        // Init first
        scentTabs[0].click();
    }

    /* ── 4. Products: Match Quiz ── */
    const quizBtns = document.querySelectorAll('.quiz-btn');
    if (quizBtns.length > 0) {
        quizBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.quiz-step');
                const nextId = btn.getAttribute('data-next');
                currentStep.classList.remove('active');
                
                if (nextId === 'result') {
                    const resultType = btn.getAttribute('data-result');
                    const resultText = document.getElementById('quiz-result-text');
                    const results = {
                        dry: "We recommend: The Shea & Oatmeal Soothing Bar",
                        oily: "We recommend: The Activated Charcoal Detox Bar",
                        normal: "We recommend: The Lavender Botanical Bar"
                    };
                    resultText.textContent = results[resultType] || "We recommend: The Classic Olive Oil Bar";
                    document.getElementById('quiz-step-result').classList.add('active');
                } else {
                    document.getElementById(nextId).classList.add('active');
                }
            });
        });
    }

    /* ── 5. Ingredients: Periodic Table ── */
    const tiles = document.querySelectorAll('.periodic-tile');
    const displayTitle = document.getElementById('pt-title');
    const displayDesc = document.getElementById('pt-desc');

    if (tiles.length > 0) {
        tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                tiles.forEach(t => t.classList.remove('active'));
                tile.classList.add('active');
                displayTitle.textContent = tile.getAttribute('data-name');
                displayDesc.textContent = tile.getAttribute('data-desc');
            });
        });
    }

    /* ── 6. Ingredients: Purity Toggle ── */
    const purityToggle = document.getElementById('purityToggle');
    const purityList = document.getElementById('purityList');
    if (purityToggle && purityList) {
        purityToggle.addEventListener('click', () => {
            purityToggle.classList.toggle('active');
            purityList.classList.toggle('purity-mode-sudz');
        });
    }

    /* ── 7. Gifting: Live Message ── */
    const giftInput = document.getElementById('giftMessageInput');
    const giftPreview = document.getElementById('giftMessagePreview');
    if (giftInput && giftPreview) {
        giftInput.addEventListener('input', (e) => {
            giftPreview.textContent = e.target.value || 'Your message will appear here...';
        });
    }

    /* ── 8. Gifting: Unboxing ── */
    const unboxBtn = document.getElementById('unboxBtn');
    const unboxStage = document.getElementById('unboxStage');
    const unboxText = document.getElementById('unboxText');
    let unboxStep = 0;
    const unboxMessages = [
        "A premium tactile experience.",
        "Breaking the signature wax seal...",
        "Unwrapping the recycled kraft paper...",
        "Discovering your botanical soap."
    ];

    if (unboxBtn && unboxStage) {
        unboxBtn.addEventListener('click', () => {
            unboxStep++;
            if(unboxStep > 3) {
                // Reset
                unboxStep = 0;
                unboxStage.className = 'unboxing-stage';
                unboxText.textContent = unboxMessages[0];
                unboxBtn.textContent = "Start Unboxing";
            } else {
                unboxStage.className = `unboxing-stage unboxing-step-${unboxStep}`;
                unboxText.textContent = unboxMessages[unboxStep];
                if (unboxStep === 3) unboxBtn.textContent = "Reset";
                else unboxBtn.textContent = "Next Layer";
            }
        });
    }

    /* ── 9. Contact: Premium FAQ ── */
    const faqs = document.querySelectorAll('.faq-q');
    if (faqs.length > 0) {
        faqs.forEach(q => {
            q.addEventListener('click', () => {
                const item = q.parentElement;
                const isOpen = item.classList.contains('open');
                // Close all
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                // Toggle clicked
                if (!isOpen) item.classList.add('open');
            });
        });
    }

});
