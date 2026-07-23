// js/booking.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Service Selection Logic
    const serviceCards = document.querySelectorAll('.service-select-card');
    const summaryService = document.getElementById('summary-service');
    const summaryPrice = document.getElementById('summary-price');
    const summaryTotal = document.getElementById('summary-total');

    let selectedService = { name: 'None Selected', price: 0 };

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            selectedService.name = card.getAttribute('data-name');
            selectedService.price = parseFloat(card.getAttribute('data-price'));
            
            updateSummary();
        });
    });

    // 2. Custom Calendar Logic
    const monthYear = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const summaryDate = document.getElementById('summary-date');

    let currentDate = new Date(); // Start at current month
    let selectedDate = null;

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthYear.textContent = `${monthNames[month]} ${year}`;

        // Blank days
        for(let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            calendarDays.appendChild(emptyDiv);
        }

        // Days
        const today = new Date();
        today.setHours(0,0,0,0);

        for(let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-date');
            dayDiv.textContent = i;

            const iterDate = new Date(year, month, i);

            // Disable past days
            if(iterDate < today) {
                dayDiv.classList.add('disabled');
            } else {
                dayDiv.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-date').forEach(d => d.classList.remove('selected'));
                    dayDiv.classList.add('selected');
                    selectedDate = iterDate;
                    
                    const dateString = iterDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    summaryDate.textContent = dateString;
                });
            }

            calendarDays.appendChild(dayDiv);
        }
    }

    if(calendarDays) {
        renderCalendar();
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    // 3. Time Selection Logic
    const timeSlots = document.querySelectorAll('.time-slot');
    const summaryTime = document.getElementById('summary-time');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            summaryTime.textContent = slot.textContent;
        });
    });

    // 4. Update Summary Function
    function updateSummary() {
        if(summaryService && summaryPrice && summaryTotal) {
            summaryService.textContent = selectedService.name;
            summaryPrice.textContent = `$${selectedService.price.toFixed(2)}`;
            summaryTotal.textContent = `$${selectedService.price.toFixed(2)}`;
        }
    }
});
