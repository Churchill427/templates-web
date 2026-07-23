// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Toggle Logic
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');

    if(toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            // For desktop, toggle collapsed state
            if(window.innerWidth >= 1024) {
                sidebar.classList.toggle('collapsed');
                toggleBtn.classList.toggle('email-shape');
            } else {
                // For mobile, toggle open state (slide in)
                sidebar.classList.toggle('open');
            }
        });
    }

    // Colors derived from variables if possible, but hardcoded here for Chart.js
    const amber = '#F59E0B';
    const silver = '#94A3B8';
    const slate = '#334155';
    const lightText = '#F8FAFC';

    // Helper for common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: silver }
            }
        },
        scales: {
            x: { 
                ticks: { color: silver },
                grid: { color: slate }
            },
            y: {
                ticks: { color: silver },
                grid: { color: slate }
            }
        }
    };

    // 2. Service Distribution (Doughnut Chart)
    const ctxDoughnut = document.getElementById('doughnutChart');
    if(ctxDoughnut) {
        new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: ['Alignment', 'Balancing', 'Tyre Sales', 'Other'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        amber,
                        '#10B981', // green
                        '#3B82F6', // blue
                        silver
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: silver }
                    }
                }
            }
        });
    }

    // 3. Monthly Bookings Trend (Line Chart)
    const ctxLine = document.getElementById('lineChart');
    if(ctxLine) {
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Bookings',
                    data: [65, 78, 90, 81, 105, 120],
                    borderColor: amber,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: commonOptions
        });
    }

    // 4. Tyre Brand Sales (Bar Chart)
    const ctxBar = document.getElementById('barChart');
    if(ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Michelin', 'Pirelli', 'Continental', 'Bridgestone', 'Hankook'],
                datasets: [{
                    label: 'Sales (Units)',
                    data: [350, 280, 250, 190, 120],
                    backgroundColor: [
                        amber,
                        '#10B981',
                        '#3B82F6',
                        '#8B5CF6', // purple
                        silver
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bar chart
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: commonOptions.scales
            }
        });
    }

    // 5. Customer Satisfaction (Radar Chart)
    const ctxRadar = document.getElementById('radarChart');
    if(ctxRadar) {
        new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['Quality', 'Speed', 'Price', 'Staff', 'Cleanliness'],
                datasets: [{
                    label: 'Score',
                    data: [4.8, 4.5, 4.2, 4.9, 4.7],
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderColor: amber,
                    pointBackgroundColor: amber,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: amber
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: slate },
                        grid: { color: slate },
                        pointLabels: { color: silver },
                        ticks: { display: false, min: 0, max: 5 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
});
