/**
 * AromaLux - Dashboard JavaScript
 * Handles charts, data visualization, and admin functionality
 */

// ===== Initialize Charts =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSalesChart();
    initializeRevenueChart();
    initializeCategoryChart();
    
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
        if (instance.options.scales) {
            if (instance.options.scales.x) {
                instance.options.scales.x.ticks.color = textColor;
                instance.options.scales.x.grid.color = gridColor;
            }
            if (instance.options.scales.y) {
                instance.options.scales.y.ticks.color = textColor;
                instance.options.scales.y.grid.color = gridColor;
            }
        }
        if (instance.options.plugins && instance.options.plugins.legend) {
            instance.options.plugins.legend.labels.color = textColor;
        }
        instance.update();
    });
}


// ===== Sales Growth Chart =====
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Fragrance Sales 2026',
                data: [65, 78, 90, 115, 145, 168, 195, 210, 235, 268, 295, 320],
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#D4AF37',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }, {
                label: 'Fragrance Sales 2025',
                data: [45, 58, 70, 85, 105, 128, 145, 160, 185, 208, 235, 260],
                borderColor: '#B76E79',
                backgroundColor: 'rgba(183, 110, 121, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
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
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: {
                        family: 'Playfair Display',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Poppins',
                        size: 12
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 11
                        },
                        callback: function(value) {
                            return value + 'K';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// ===== Revenue Analytics Chart =====
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [4500, 5200, 4800, 6100, 5800, 7200, 6800],
                backgroundColor: [
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(212, 175, 55, 1)',
                    'rgba(212, 175, 55, 1)'
                ],
                borderColor: '#D4AF37',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: {
                        family: 'Playfair Display',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Poppins',
                        size: 12
                    },
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
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 11
                        },
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// ===== Product Category Distribution =====
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Men's Perfumes", "Women's Perfumes", 'Unisex', 'Luxury Collection'],
            datasets: [{
                data: [35, 40, 15, 10],
                backgroundColor: [
                    '#D4AF37',
                    '#B76E79',
                    '#FFD700',
                    '#C0C0C0'
                ],
                borderColor: '#fff',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: {
                        family: 'Playfair Display',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Poppins',
                        size: 12
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===== Dashboard Sidebar Toggle (Desktop Collapse / Mobile Drawer) =====
function toggleDashboardSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    const overlay = document.getElementById('dashboardOverlay');
    
    if (window.innerWidth >= 1024) {
        // Desktop: Toggle collapsed state
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
            
            // Re-render charts if needed (optional but good for layout shifts)
            if (window.myCharts) {
                setTimeout(() => {
                    Object.values(window.myCharts).forEach(chart => chart.resize());
                }, 300);
            }
        }
    } else {
        // Mobile: Toggle active drawer
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        }
    }
}

// Close sidebar on overlay click
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

// ===== Update Stats Cards Animation =====
function animateStatsCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

// Call on page load
document.addEventListener('DOMContentLoaded', animateStatsCards);

// ===== Order Status Update =====
function updateOrderStatus(orderId, status) {
    // Simulate API call
    console.log(`Updating order ${orderId} to status: ${status}`);
    
    // Show success message
    showToast(`Order #${orderId} status updated to ${status}`, 'success');
    
    // Update UI
    const statusBadge = document.querySelector(`[data-order-id="${orderId}"] .order-status`);
    if (statusBadge) {
        statusBadge.textContent = status;
        statusBadge.className = `order-status badge-${status.toLowerCase().replace(' ', '-')}`;
    }
}

// ===== Product Management Functions =====
function addNewProduct() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function editProduct(productId) {
    console.log('Editing product:', productId);
    // Open edit modal with product data
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        console.log('Deleting product:', productId);
        showToast('Product deleted successfully', 'success');
    }
}

// ===== Customer Management =====
function viewCustomerDetails(customerId) {
    console.log('Viewing customer:', customerId);
    // Open customer details modal
}

function blockCustomer(customerId) {
    if (confirm('Are you sure you want to block this customer?')) {
        console.log('Blocking customer:', customerId);
        showToast('Customer has been blocked', 'success');
    }
}

// ===== Message Management =====
function markMessageAsRead(messageId) {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
        messageElement.classList.remove('unread');
        messageElement.classList.add('read');
    }
}

function replyToMessage(messageId) {
    console.log('Replying to message:', messageId);
    // Open reply modal
}

// ===== Notification System =====
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.getElementById('notificationContainer').appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===== Search in Dashboard =====
function searchDashboard(query) {
    console.log('Searching dashboard for:', query);
    // Implement search functionality
}

// ===== Export Data =====
function exportData(format) {
    console.log('Exporting data as:', format);
    showToast(`Data exported as ${format.toUpperCase()}`, 'success');
}

// ===== Date Range Filter =====
function filterByDateRange(startDate, endDate) {
    console.log('Filtering from', startDate, 'to', endDate);
    // Implement date filtering
    showToast('Date range applied', 'success');
}

// ===== Activity Feed Updates =====
function addActivityFeedItem(activity) {
    const feedContainer = document.getElementById('activityFeed');
    if (!feedContainer) return;
    
    const item = document.createElement('div');
    item.className = 'activity-item animate-fadeInUp';
    item.innerHTML = `
        <div class="activity-icon">
            <i class="fas fa-${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <p>${activity.message}</p>
            <span class="activity-time">${activity.time}</span>
        </div>
    `;
    
    feedContainer.insertBefore(item, feedContainer.firstChild);
}

// ===== Real-time Updates Simulation =====
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate new orders
        if (Math.random() > 0.7) {
            const activities = [
                { icon: 'shopping-cart', message: 'New order received', time: 'Just now' },
                { icon: 'user-plus', message: 'New customer registered', time: 'Just now' },
                { icon: 'star', message: 'New review submitted', time: 'Just now' }
            ];
            
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            addActivityFeedItem(randomActivity);
            
            // Show notification
            showNotification('New Activity', randomActivity.message, 'info');
        }
    }, 30000); // Every 30 seconds
}

// Start real-time updates
if (window.location.pathname.includes('dashboard.html')) {
    simulateRealTimeUpdates();
}

console.log('📊 AromaLux Dashboard JavaScript Loaded Successfully');
