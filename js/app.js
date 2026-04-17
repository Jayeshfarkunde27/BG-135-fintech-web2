// Global Utilities and Shell Logic

// 1. Toast Notification System
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Icon based on type
  let icon = '';
  switch(type) {
    case 'success': icon = '✓'; break;
    case 'error': icon = '✕'; break;
    case 'warning': icon = '⚠'; break;
    case 'info': icon = 'ℹ'; break;
  }

  toast.innerHTML = `
    <div style="font-weight:bold; font-size: 1.2rem;">${icon}</div>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

// 2. Sidebar toggle (Mobile)
function initShell() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  initShell();
  initTheme();
});

function initTheme() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

// Ensure theme applies instantly to avoid flash
(function() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

// Format Date Utility
window.formatDate = function(dateStr) {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
};
