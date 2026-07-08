/* ============================================================
   BRAKE — Booking Page JavaScript
   booking.js
   Multi-step form, pricing calculator, form validation
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1. VEHICLE DATA (Mock)
     -------------------------------------------------------- */
  const vehicleData = {
    makes: ['Ford', 'Chevrolet', 'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Subaru', 'Jeep', 'Ram', 'GMC', 'Dodge'],
    models: {
      'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Bronco', 'Edge', 'Fusion'],
      'Chevrolet': ['Silverado', 'Camaro', 'Equinox', 'Malibu', 'Tahoe', 'Traverse', 'Colorado'],
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Tacoma', 'Highlander', '4Runner', 'Tundra'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M3', 'M5', '7 Series'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'CLA'],
      'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Maxima', 'Kicks'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'Venue'],
      'Kia': ['Forte', 'K5', 'Sportage', 'Telluride', 'Sorento', 'Soul', 'Seltos'],
      'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'ID.4', 'Taos'],
      'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'WRX', 'Legacy', 'Ascent'],
      'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Gladiator', 'Renegade'],
      'Ram': ['1500', '2500', '3500', 'ProMaster'],
      'GMC': ['Sierra', 'Yukon', 'Terrain', 'Acadia', 'Canyon'],
      'Dodge': ['Charger', 'Challenger', 'Durango', 'Hornet']
    },
    years: Array.from({ length: 30 }, (_, i) => (2026 - i).toString())
  };

  /* --------------------------------------------------------
     2. SERVICE PRICING
     -------------------------------------------------------- */
  const servicePricing = {
    'rotor-resurfacing': { name: 'Rotor Resurfacing', price: 89 },
    'brake-pad-replacement': { name: 'Brake Pad Replacement', price: 149 },
    'drum-machining': { name: 'Drum Machining', price: 79 },
    'caliper-service': { name: 'Caliper Service', price: 119 },
    'brake-fluid-flush': { name: 'Brake Fluid Flush', price: 69 },
    'mobile-inspection': { name: 'Mobile Inspection', price: 49 }
  };

  /* --------------------------------------------------------
     3. MULTI-STEP FORM
     -------------------------------------------------------- */
  const BookingForm = {
    currentStep: 1,
    totalSteps: 5,

    init() {
      this.form = document.getElementById('booking-form');
      if (!this.form) return;

      this.steps = this.form.querySelectorAll('.form-step');
      this.progressSteps = document.querySelectorAll('.form-progress-step');
      this.progressLine = document.querySelector('.form-progress-line');
      this.nextBtns = this.form.querySelectorAll('.btn-next');
      this.prevBtns = this.form.querySelectorAll('.btn-prev');
      this.submitBtn = this.form.querySelector('.btn-submit');

      // Cascading dropdowns
      this.initVehicleDropdowns();

      // Navigation
      this.nextBtns.forEach(btn => {
        btn.addEventListener('click', () => this.nextStep());
      });

      this.prevBtns.forEach(btn => {
        btn.addEventListener('click', () => this.prevStep());
      });

      // Form submit
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });

      // Service checkboxes → pricing
      this.form.querySelectorAll('.service-checkbox').forEach(cb => {
        cb.addEventListener('change', () => this.updatePricing());
      });

      this.updateProgress();
      this.updatePricing();
    },

    initVehicleDropdowns() {
      const makeSelect = document.getElementById('vehicle-make');
      const modelSelect = document.getElementById('vehicle-model');
      const yearSelect = document.getElementById('vehicle-year');

      if (!makeSelect) return;

      // Populate makes
      vehicleData.makes.forEach(make => {
        const opt = document.createElement('option');
        opt.value = make;
        opt.textContent = make;
        makeSelect.appendChild(opt);
      });

      // Populate years
      if (yearSelect) {
        vehicleData.years.forEach(year => {
          const opt = document.createElement('option');
          opt.value = year;
          opt.textContent = year;
          yearSelect.appendChild(opt);
        });
      }

      // On make change → populate models
      makeSelect.addEventListener('change', () => {
        if (!modelSelect) return;
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        const models = vehicleData.models[makeSelect.value] || [];
        models.forEach(model => {
          const opt = document.createElement('option');
          opt.value = model;
          opt.textContent = model;
          modelSelect.appendChild(opt);
        });
      });
    },

    nextStep() {
      if (!this.validateStep(this.currentStep)) return;

      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.showStep(this.currentStep);
        this.updateProgress();
        this.updateSummary();
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.showStep(this.currentStep);
        this.updateProgress();
      }
    },

    showStep(step) {
      this.steps.forEach((s, i) => {
        s.classList.toggle('active', i === step - 1);
      });
    },

    updateProgress() {
      this.progressSteps.forEach((ps, i) => {
        ps.classList.remove('active', 'completed');
        if (i + 1 === this.currentStep) {
          ps.classList.add('active');
        } else if (i + 1 < this.currentStep) {
          ps.classList.add('completed');
        }
      });

      // Progress line width
      if (this.progressLine) {
        const pct = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        this.progressLine.style.width = pct + '%';
      }
    },

    validateStep(step) {
      const stepEl = this.steps[step - 1];
      if (!stepEl) return true;

      const required = stepEl.querySelectorAll('[required]');
      let valid = true;

      required.forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          valid = false;
          if (group) {
            group.classList.add('error');
            const errorEl = group.querySelector('.form-error');
            if (errorEl) errorEl.textContent = 'This field is required';
          }
        } else {
          if (group) group.classList.remove('error');
        }
      });

      // Step 2 specific: at least one service selected
      if (step === 2) {
        const checked = stepEl.querySelectorAll('.service-checkbox:checked');
        if (checked.length === 0) {
          valid = false;
          const note = stepEl.querySelector('.service-error');
          if (note) note.style.display = 'block';
        } else {
          const note = stepEl.querySelector('.service-error');
          if (note) note.style.display = 'none';
        }
      }

      // Email validation
      const emailInput = stepEl.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          valid = false;
          const group = emailInput.closest('.form-group');
          if (group) {
            group.classList.add('error');
            const errorEl = group.querySelector('.form-error');
            if (errorEl) errorEl.textContent = 'Please enter a valid email';
          }
        }
      }

      return valid;
    },

    updatePricing() {
      let total = 0;
      const selected = [];

      this.form?.querySelectorAll('.service-checkbox:checked').forEach(cb => {
        const service = servicePricing[cb.value];
        if (service) {
          total += service.price;
          selected.push(service);
        }
      });

      // Update calculator display
      const totalEl = document.getElementById('price-total');
      const listEl = document.getElementById('price-list');

      if (totalEl) totalEl.textContent = `$${total}`;

      if (listEl) {
        listEl.innerHTML = selected.length
          ? selected.map(s => `<li><span>${s.name}</span><span>$${s.price}</span></li>`).join('')
          : '<li><span>No services selected</span><span>$0</span></li>';
      }
    },

    updateSummary() {
      // Only update on step 5 (review)
      if (this.currentStep !== 5) return;

      const make = document.getElementById('vehicle-make')?.value || '-';
      const model = document.getElementById('vehicle-model')?.value || '-';
      const year = document.getElementById('vehicle-year')?.value || '-';
      const name = document.getElementById('contact-name')?.value || '-';
      const email = document.getElementById('contact-email')?.value || '-';
      const phone = document.getElementById('contact-phone')?.value || '-';
      const address = document.getElementById('contact-address')?.value || '-';

      const summaryVehicle = document.getElementById('summary-vehicle');
      const summaryContact = document.getElementById('summary-contact');
      const summaryServices = document.getElementById('summary-services');

      if (summaryVehicle) summaryVehicle.textContent = `${year} ${make} ${model}`;
      if (summaryContact) summaryContact.innerHTML = `${name}<br>${email}<br>${phone}<br>${address}`;

      if (summaryServices) {
        const selected = [];
        this.form.querySelectorAll('.service-checkbox:checked').forEach(cb => {
          const service = servicePricing[cb.value];
          if (service) selected.push(service.name);
        });
        summaryServices.textContent = selected.join(', ') || 'None';
      }
    },

    handleSubmit() {
      // Show success message
      const successEl = document.getElementById('booking-success');
      if (successEl) {
        this.form.style.display = 'none';
        successEl.style.display = 'block';
      }
    }
  };

  /* --------------------------------------------------------
     4. STANDALONE PRICING CALCULATOR
     -------------------------------------------------------- */
  const PricingCalculator = {
    init() {
      const calcForm = document.getElementById('pricing-calculator');
      if (!calcForm) return;

      calcForm.querySelectorAll('.calc-checkbox').forEach(cb => {
        cb.addEventListener('change', () => this.calculate(calcForm));
      });

      this.calculate(calcForm);
    },

    calculate(form) {
      let total = 0;
      form.querySelectorAll('.calc-checkbox:checked').forEach(cb => {
        total += parseInt(cb.dataset.price) || 0;
      });

      const totalEl = form.querySelector('.calc-total');
      if (totalEl) totalEl.textContent = `$${total}`;
    }
  };


  /* --------------------------------------------------------
     5. INTERACTIVE CALENDAR WIDGET
     -------------------------------------------------------- */
  const CalendarWidget = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    slots: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
    
    init() {
      this.monthYearEl = document.getElementById('calendar-month-year');
      this.daysGridEl = document.getElementById('calendar-days-grid');
      this.prevBtn = document.getElementById('calendar-prev-btn');
      this.nextBtn = document.getElementById('calendar-next-btn');
      
      this.slotsContainer = document.getElementById('calendar-slots-container');
      this.selectedDateStr = document.getElementById('selected-date-str');
      this.slotsGrid = document.getElementById('calendar-slots-grid');
      
      if (!this.daysGridEl) return;
      
      const today = new Date();
      this.currentMonth = today.getMonth();
      this.currentYear = today.getFullYear();
      this.selectedDate = null;
      
      this.prevBtn.addEventListener('click', () => this.changeMonth(-1));
      this.nextBtn.addEventListener('click', () => this.changeMonth(1));
      
      this.render();
      
      // Also sync when the user manually changes the form's Date input
      const bookingDateInput = document.getElementById('booking-date');
      if (bookingDateInput) {
        bookingDateInput.addEventListener('change', () => {
          if (bookingDateInput.value) {
            const dateParts = bookingDateInput.value.split('-');
            const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            this.selectedDate = date;
            this.currentMonth = date.getMonth();
            this.currentYear = date.getFullYear();
            this.render();
            
            this.selectedDateStr.textContent = `${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            this.slotsContainer.style.display = 'block';
            this.renderSlots(date);
          }
        });
      }
    },
    
    changeMonth(direction) {
      this.currentMonth += direction;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.render();
    },
    
    render() {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ignore time
      
      // Update header text
      this.monthYearEl.textContent = `${this.months[this.currentMonth]} ${this.currentYear}`;
      
      // Clear grid
      this.daysGridEl.innerHTML = '';
      
      const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      
      // Render empty slots for padding
      for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'empty');
        this.daysGridEl.appendChild(emptyCell);
      }
      
      // Render days
      for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = day;
        
        const cellDate = new Date(this.currentYear, this.currentMonth, day);
        
        // If it is today
        if (cellDate.getTime() === today.getTime()) {
          dayCell.classList.add('today');
        }
        
        // If it is selected
        if (this.selectedDate && cellDate.getTime() === this.selectedDate.getTime()) {
          dayCell.classList.add('active');
        }
        
        // If it is in the past, disable it
        if (cellDate < today) {
          dayCell.classList.add('disabled');
        } else {
          dayCell.addEventListener('click', () => this.selectDate(cellDate, dayCell));
        }
        
        this.daysGridEl.appendChild(dayCell);
      }
    },
    
    selectDate(date, cellElement) {
      // Remove active class from previous active day
      this.daysGridEl.querySelectorAll('.calendar-day.active').forEach(el => el.classList.remove('active'));
      
      // Set new active day
      cellElement.classList.add('active');
      this.selectedDate = date;
      
      // Sync date with the booking form Date input!
      const bookingDateInput = document.getElementById('booking-date');
      if (bookingDateInput) {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset*60*1000));
        const dateStr = adjustedDate.toISOString().split('T')[0];
        bookingDateInput.value = dateStr;
        
        // Trigger change event to validate
        bookingDateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      // Display available slots
      this.selectedDateStr.textContent = `${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      this.slotsContainer.style.display = 'block';
      this.renderSlots(date);
    },
    
    renderSlots(date) {
      this.slotsGrid.innerHTML = '';
      
      const dayOfWeek = date.getDay();
      
      // Sundays closed
      if (dayOfWeek === 0) {
        this.slotsGrid.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-tertiary); text-align: center; width: 100%;">No slots available on Sundays. Please select another date.</p>';
        return;
      }
      
      // Generate some available slots
      const daySlots = dayOfWeek % 2 === 0 
        ? ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM']
        : ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];
        
      daySlots.forEach(time => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('slot-btn');
        btn.textContent = time;
        
        // Check if this slot matches current selected form time
        const bookingTimeSelect = document.getElementById('booking-time');
        if (bookingTimeSelect && bookingTimeSelect.value === time) {
          btn.classList.add('selected');
        }
        
        btn.addEventListener('click', () => {
          this.slotsGrid.querySelectorAll('.slot-btn.selected').forEach(el => el.classList.remove('selected'));
          btn.classList.add('selected');
          
          // Sync with form time select
          if (bookingTimeSelect) {
            bookingTimeSelect.value = time;
            bookingTimeSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        
        this.slotsGrid.appendChild(btn);
      });
    }
  };

  /* --------------------------------------------------------
     6. INITIALIZATION
     -------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    BookingForm.init();
    PricingCalculator.init();
    CalendarWidget.init();
  });

})();
