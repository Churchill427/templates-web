// js/emergency.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Incident Card Selector
    const incidentCards = document.querySelectorAll('.incident-card');
    const selectedTypeInput = document.getElementById('selectedIncidentType');

    incidentCards.forEach(card => {
        card.addEventListener('click', () => {
            incidentCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const type = card.getAttribute('data-type');
            if (selectedTypeInput) {
                selectedTypeInput.value = type;
            }
            updateEmergencyEstimate();
        });
    });

    // 2. Price Estimator
    const distanceInput = document.getElementById('emergDistance');
    const distanceVal = document.getElementById('distanceVal');
    const tyreTypeSelect = document.getElementById('emergTyreType');
    const estimatePrice = document.getElementById('estimatePrice');

    function updateEmergencyEstimate() {
        if (!distanceInput || !tyreTypeSelect || !estimatePrice) return;
        const distance = parseInt(distanceInput.value);
        distanceVal.textContent = distance + ' km';

        const selectedCard = document.querySelector('.incident-card.selected');
        let basePrice = 75; // Base roadside callout fee

        if (selectedCard) {
            const type = selectedCard.getAttribute('data-type');
            if (type === 'blowout') basePrice = 110;
            if (type === 'alloy') basePrice = 90;
            if (type === 'locknut') basePrice = 85;
        }

        const distancePrice = distance * 2.50; // $2.50 per km
        const tyreCost = tyreTypeSelect.value === 'need-tyre' ? 149 : 0; // $149 replacement cost

        const total = basePrice + distancePrice + tyreCost;
        estimatePrice.textContent = `$${total.toFixed(2)}`;
    }

    if (distanceInput) {
        distanceInput.addEventListener('input', updateEmergencyEstimate);
        tyreTypeSelect.addEventListener('change', updateEmergencyEstimate);
        updateEmergencyEstimate();
    }

    // 3. Safe Stop Checklist
    const checkBoxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkBoxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const item = cb.closest('.checklist-item');
            if (cb.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
        });
    });

    // 4. Quick Request & Dispatch Simulation
    const emergencyForm = document.getElementById('emergencyForm');
    const steps = document.querySelectorAll('.tracker-step');

    if (emergencyForm) {
        emergencyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Emergency request received! Dispatching our team immediately. Please check the Dispatch Tracker below for live updates.");

            // Start step simulation
            if (steps.length > 0) {
                // Step 1: Request verified
                steps[0].classList.remove('active');
                steps[0].classList.add('completed');
                steps[1].classList.add('active');

                // Simulate Step 2: Van En Route after 4 seconds
                setTimeout(() => {
                    steps[1].classList.remove('active');
                    steps[1].classList.add('completed');
                    steps[2].classList.add('active');
                }, 4000);

                // Simulate Step 3: Arrived after 8 seconds
                setTimeout(() => {
                    steps[2].classList.remove('active');
                    steps[2].classList.add('completed');
                }, 8000);
            }
        });
    }
});
