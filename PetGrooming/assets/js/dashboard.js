/* ============================================
   PAWLY — Dashboard Core JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initDashboardActiveLink();
  initNotificationMock();
});

/* ── Sidebar Toggle Collapsing ── */
function initSidebar() {
  const sidebar = document.querySelector('.db-sidebar');
  const toggle = document.querySelector('.db-sidebar-toggle');
  
  if (!sidebar || !toggle) return;

  // Read state from localStorage
  const isCollapsed = localStorage.getItem('pawly-db-collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('pawly-db-collapsed', sidebar.classList.contains('collapsed'));
  });
}

/* ── Active Sidebar Link ── */
function initDashboardActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const menuItems = document.querySelectorAll('.db-menu-item');

  menuItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    
    const pageName = href.split('/').pop();
    if (pageName === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/* ── Simulated Toast Notifications ── */
function initNotificationMock() {
  const notifyBtn = document.querySelector('.db-notification-trigger');
  if (!notifyBtn) return;

  notifyBtn.addEventListener('click', () => {
    if (typeof showToast === 'function') {
      const msgs = [
        'New appointment booked by Sarah Jenkins.',
        'Groomer James Chen updated service logs.',
        'Invoice #INV-2049 paid via Apple Pay.',
        'Pet profile updated successfully.'
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      showToast(randomMsg, 'info');
    }
  });
}

/* ── Simulated Invoice Print ── */
function printInvoice() {
  window.print();
}
