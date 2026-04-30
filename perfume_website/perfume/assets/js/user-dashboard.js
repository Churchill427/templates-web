/**
 * AromaLux - User Dashboard JavaScript
 * Handles user-specific charts and data visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    initUserSpendingChart();
    initUserScentProfile();
    initUserCollectionChart();
    initUserPurchaseChart();
    initUserLoyaltyChart();
    initUserSeasonalChart();

    // Update charts if dark mode is active
    if (document.body.classList.contains('dark-mode')) {
        updateChartsForDarkMode();
    }
});

// Watch for dark mode changes to update charts
const darkModeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            updateChartsForDarkMode();
        }
    });
});
darkModeObserver.observe(document.body, { attributes: true });

function updateChartsForDarkMode() {
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#c4b4a4' : '#666';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    Chart.helpers.each(Chart.instances, function(instance) {
        // Handle standard scales
        if (instance.options.scales) {
            // XY Scales
            ['x', 'y'].forEach(axis => {
                if (instance.options.scales[axis]) {
                    if (!instance.options.scales[axis].ticks) instance.options.scales[axis].ticks = {};
                    if (!instance.options.scales[axis].grid) instance.options.scales[axis].grid = {};
                    instance.options.scales[axis].ticks.color = textColor;
                    instance.options.scales[axis].grid.color = gridColor;
                }
            });
            // Radial Scale (for Radar/Polar charts)
            if (instance.options.scales.r) {
                if (!instance.options.scales.r.grid) instance.options.scales.r.grid = {};
                if (!instance.options.scales.r.angleLines) instance.options.scales.r.angleLines = {};
                if (!instance.options.scales.r.pointLabels) instance.options.scales.r.pointLabels = {};
                instance.options.scales.r.grid.color = gridColor;
                instance.options.scales.r.angleLines.color = gridColor;
                instance.options.scales.r.pointLabels.color = textColor;
            }
        }
        // Legend labels
        if (instance.options.plugins && instance.options.plugins.legend) {
            if (!instance.options.plugins.legend.labels) instance.options.plugins.legend.labels = {};
            instance.options.plugins.legend.labels.color = textColor;
        }
        instance.update();
    });
}


// ===== User Spending Trend (Area Chart) =====
function initUserSpendingChart() {
    const ctx = document.getElementById('userSpendingChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'My Spending ($)',
                data: [85, 0, 199, 45, 140, 0, 320, 89, 0, 109, 199, 250],
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#D4AF37',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                    ticks: {
                        callback: function(value) { return '$' + value; }
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ===== Scent Profile Radar Chart =====
function initUserScentProfile() {
    const ctx = document.getElementById('userScentProfile');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Woody', 'Floral', 'Oriental', 'Fresh', 'Citrus', 'Spicy'],
            datasets: [{
                label: 'My Preferences',
                data: [90, 65, 80, 40, 55, 75],
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                borderColor: '#D4AF37',
                borderWidth: 2,
                pointBackgroundColor: '#D4AF37',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }, {
                label: 'Community Average',
                data: [60, 70, 55, 65, 60, 50],
                backgroundColor: 'rgba(183, 110, 121, 0.15)',
                borderColor: '#B76E79',
                borderWidth: 2,
                pointBackgroundColor: '#B76E79',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        display: false
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.08)'
                    },
                    pointLabels: {
                        font: { size: 12, weight: 'bold' },
                        color: '#374151'
                    },
                    angleLines: {
                        color: 'rgba(0,0,0,0.08)'
                    }
                }
            }
        }
    });
}

// ===== Collection Breakdown (Polar Area Chart) =====
function initUserCollectionChart() {
    const ctx = document.getElementById('userCollectionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Eau de Parfum', 'Eau de Toilette', 'Extrait', 'Discovery Sets', 'Gift Sets'],
            datasets: [{
                data: [6, 4, 2, 3, 3],
                backgroundColor: [
                    'rgba(212, 175, 55, 0.7)',
                    'rgba(183, 110, 121, 0.7)',
                    'rgba(75, 0, 130, 0.5)',
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(16, 185, 129, 0.5)'
                ],
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.r + ' bottles';
                        }
                    }
                }
            },
            scales: {
                r: {
                    ticks: { display: false },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        }
    });
}

// ===== Monthly Purchase Amounts (Horizontal Bar Chart) =====
function initUserPurchaseChart() {
    const ctx = document.getElementById('userPurchaseChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Royal Oud', 'Velvet Rose', 'Heritage Set', 'Midnight Musk', 'Ocean Breeze', 'Amber Noir'],
            datasets: [{
                label: 'Amount Spent ($)',
                data: [89, 109, 185, 129, 99, 199],
                backgroundColor: [
                    'rgba(212, 175, 55, 0.85)',
                    'rgba(183, 110, 121, 0.85)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(75, 0, 130, 0.6)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)'
                ],
                borderColor: [
                    '#D4AF37',
                    '#B76E79',
                    '#3B82F6',
                    '#4B0082',
                    '#10B981',
                    '#F59E0B'
                ],
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.x.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                    ticks: {
                        callback: function(value) { return '$' + value; }
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 11, weight: 'bold' }
                    }
                }
            }
        }
    });
}

// ===== Loyalty Points History (Line Chart) =====
function initUserLoyaltyChart() {
    const ctx = document.getElementById('userLoyaltyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Points Earned',
                data: [120, 200, 150, 320, 280, 450],
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#D4AF37',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }, {
                label: 'Points Redeemed',
                data: [0, 50, 0, 100, 0, 200],
                borderColor: '#B76E79',
                backgroundColor: 'rgba(183, 110, 121, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#B76E79',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 15 } },
                tooltip: { backgroundColor: 'rgba(26,26,26,0.9)', padding: 12, cornerRadius: 8 }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false } },
                x: { grid: { display: false } }
            }
        }
    });
}

// ===== Seasonal Fragrance Preferences (Stacked Bar) =====
function initUserSeasonalChart() {
    const ctx = document.getElementById('userSeasonalChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Spring', 'Summer', 'Autumn', 'Winter'],
            datasets: [{
                label: 'Floral',
                data: [4, 2, 1, 1],
                backgroundColor: 'rgba(236, 72, 153, 0.7)',
                borderRadius: 4
            }, {
                label: 'Woody',
                data: [1, 1, 3, 4],
                backgroundColor: 'rgba(161, 98, 7, 0.7)',
                borderRadius: 4
            }, {
                label: 'Citrus',
                data: [2, 5, 1, 0],
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderRadius: 4
            }, {
                label: 'Oriental',
                data: [1, 0, 3, 3],
                backgroundColor: 'rgba(75, 0, 130, 0.6)',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: { backgroundColor: 'rgba(26,26,26,0.9)', padding: 12, cornerRadius: 8 }
            },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                    ticks: { stepSize: 2, callback: function(v) { return v + ' uses'; } }
                }
            }
        }
    });
}

// Reuse sidebar toggle from dashboard.js
function toggleDashboardSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    const overlay = document.getElementById('dashboardOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}

document.addEventListener('click', function(e) {
    const overlay = document.getElementById('dashboardOverlay');
    if (e.target === overlay) {
        toggleDashboardSidebar();
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024) {
        const sidebar = document.getElementById('dashboardSidebar');
        const overlay = document.getElementById('dashboardOverlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

console.log('👤 AromaLux User Dashboard Loaded Successfully');
