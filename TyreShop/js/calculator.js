// js/calculator.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. PSI Calculator
    const vehicleSelect = document.getElementById('calcVehicle');
    const loadSelect = document.getElementById('calcLoad');
    const frontPsiVal = document.getElementById('frontPsiVal');
    const rearPsiVal = document.getElementById('rearPsiVal');

    function calculatePsi() {
        if (!vehicleSelect || !loadSelect) return;
        const vehicle = vehicleSelect.value;
        const load = loadSelect.value;
        
        let baseFront = 32;
        let baseRear = 32;

        if (vehicle === 'suv') {
            baseFront = 35;
            baseRear = 35;
        } else if (vehicle === 'sports') {
            baseFront = 30;
            baseRear = 32;
        } else if (vehicle === 'truck') {
            baseFront = 40;
            baseRear = 45;
        }

        if (load === 'heavy') {
            baseFront += 2;
            baseRear += 4;
        }

        if (frontPsiVal && rearPsiVal) {
            frontPsiVal.textContent = baseFront;
            rearPsiVal.textContent = baseRear;
        }
    }

    if (vehicleSelect) {
        vehicleSelect.addEventListener('change', calculatePsi);
        loadSelect.addEventListener('change', calculatePsi);
        calculatePsi();
    }

    // 2. Treadwear Estimator
    const mileageSlider = document.getElementById('mileageSlider');
    const alignmentSelect = document.getElementById('alignmentSelect');
    const lifespanVal = document.getElementById('lifespanVal');
    const sliderLabel = document.getElementById('sliderLabel');

    function calculateLifespan() {
        if (!mileageSlider || !alignmentSelect) return;
        const mileage = parseInt(mileageSlider.value);
        const alignment = alignmentSelect.value;
        
        sliderLabel.textContent = mileage.toLocaleString() + ' km';

        // Base lifespan in km
        let baseLifespan = 50000;
        
        if (alignment === 'bad') {
            baseLifespan = 25000;
        } else if (alignment === 'critical') {
            baseLifespan = 12000;
        }

        // Calculate remaining years
        const remainingKm = Math.max(0, baseLifespan);
        const years = (remainingKm / mileage).toFixed(1);

        if (lifespanVal) {
            lifespanVal.textContent = years;
        }
    }

    if (mileageSlider) {
        mileageSlider.addEventListener('input', calculateLifespan);
        alignmentSelect.addEventListener('change', calculateLifespan);
        calculateLifespan();
    }

    // 3. Size Comparison Tool
    const widthSelect = document.getElementById('widthSelect');
    const aspectSelect = document.getElementById('aspectSelect');
    const diameterSelect = document.getElementById('diameterSelect');
    const tireB = document.getElementById('tireB');
    const sizeBText = document.getElementById('sizeBText');

    function updateTireB() {
        if (!widthSelect || !aspectSelect || !diameterSelect || !tireB) return;
        
        const width = parseInt(widthSelect.value);
        const aspect = parseInt(aspectSelect.value);
        const diameter = parseInt(diameterSelect.value);

        // Update display text
        sizeBText.textContent = `${width}/${aspect} R${diameter}`;

        // Calculate total tire diameter roughly: diameter * 25.4 + (2 * width * aspect / 100)
        const totalDiameter = (diameter * 25.4) + (2 * width * aspect / 100);
        
        // Scale factor: baseline tire is 225/40 R18 (approx 637mm) -> represented as 160px width/height
        const baselineDiameter = (18 * 25.4) + (2 * 225 * 40 / 100); // 637.2
        const ratio = totalDiameter / baselineDiameter;
        
        const sizePx = Math.round(160 * ratio);
        tireB.style.width = sizePx + 'px';
        tireB.style.height = sizePx + 'px';
    }

    if (widthSelect) {
        widthSelect.addEventListener('change', updateTireB);
        aspectSelect.addEventListener('change', updateTireB);
        diameterSelect.addEventListener('change', updateTireB);
        updateTireB();
    }

    // 4. Care Guide Tabs switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});
