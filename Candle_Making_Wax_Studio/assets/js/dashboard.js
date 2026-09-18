// Dashboard specific JS

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Toggle
  const sidebar = document.getElementById('dash-sidebar');
  const sidebarToggle = document.getElementById('dash-sidebar-toggle');
  const sidebarClose = document.getElementById('dash-sidebar-close');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.add('is-open');
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
    });
  }

  // Close sidebar on outside click on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 1024 && sidebar && sidebar.classList.contains('is-open')) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('is-open');
      }
    }
  });

  // Table Sorting
  const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1.replace(/[^0-9.-]+/g,"")) && !isNaN(v2.replace(/[^0-9.-]+/g,"")) ? 
    v1.replace(/[^0-9.-]+/g,"") - v2.replace(/[^0-9.-]+/g,"") : 
    v1.toString().localeCompare(v2)
  )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

  document.querySelectorAll('th[data-sort]').forEach(th => th.addEventListener('click', (() => {
    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
      .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
      .forEach(tr => tbody.appendChild(tr));
      
    // Update icons
    table.querySelectorAll('th svg').forEach(svg => svg.style.transform = '');
    const svg = th.querySelector('svg');
    if (svg) {
      svg.style.transform = this.asc ? 'rotate(180deg)' : '';
    }
  })));
});
