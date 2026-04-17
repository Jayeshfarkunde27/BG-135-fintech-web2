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

// 3. Simple Global Balance Management
window.BalanceManager = {
  key: 'neoBankBalance',
  init() {
    if (!localStorage.getItem(this.key)) {
      // Default Starting Balance
      localStorage.setItem(this.key, "14502.50");
    }
  },
  getBalance() {
    return parseFloat(localStorage.getItem(this.key));
  },
  deduct(amount) {
    const current = this.getBalance();
    const parsed = parseFloat(amount);
    if (!isNaN(parsed) && parsed > 0) {
      localStorage.setItem(this.key, (current - parsed).toFixed(2));
      return true;
    }
    return false;
  },
  format(val) {
    return "₹" + parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },
  syncUI() {
    const balIds = ['db-balance', 'acc-balance', 'header-balance'];
    balIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = this.format(this.getBalance());
      }
    });
  }
};

// 4. Transaction Manager
window.TransactionManager = {
  key: 'neoBankTransactions',
  init() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  },
  getTransactions() {
    return JSON.parse(localStorage.getItem(this.key));
  },
  addTransaction(title, amount) {
    const txns = this.getTransactions();
    const txnId = "TXN" + Math.floor(Math.random() * 1000000000);
    txns.unshift({
      id: txnId,
      title: title || 'Quick Payment',
      amount: parseFloat(amount),
      date: new Date().toISOString()
    });
    localStorage.setItem(this.key, JSON.stringify(txns));
    return txnId;
  },
  renderTransactions() {
    const txns = this.getTransactions();
    if (!txns || txns.length === 0) return;

    const createHTML = (txn, useFull = true) => `
      <div class="txn-item">
          <div class="txn-info">
              <div class="txn-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);"><i data-lucide="send"></i></div>
              <div class="txn-details">
                  <h4>${(txn.title === 'Quick Payment' || !txn.title) && txn.id ? 'Transfer ' + txn.id : txn.title}</h4>
                  <p>${window.formatDate(txn.date)} ${txn.id ? '• ID: ' + txn.id : ''}</p>
              </div>
          </div>
          <div class="txn-amount" style="color: var(--danger); font-weight: 600;">-₹${parseFloat(txn.amount).toFixed(2)}</div>
      </div>
    `;

    const accContainer = document.getElementById('acc-txns');
    const dbContainer = document.getElementById('db-txns');

    if (accContainer) {
      let injected = '';
      txns.forEach(t => injected += createHTML(t, true));
      accContainer.innerHTML = injected + accContainer.innerHTML;
    }
    
    if (dbContainer) {
      let injected = '';
      txns.slice(0, 5).forEach(t => injected += createHTML(t, false));
      dbContainer.innerHTML = injected + dbContainer.innerHTML;
    }
  }
};

// 5. Profile Manager
window.ProfileManager = {
  key: 'neoBankProfile',
  init() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify({ 
        name: 'John Doe', 
        email: 'user@demo.com', 
        phone: '+1 555-0198',
        accounts: [
          { bank: 'SBI', last4: '1234' },
          { bank: 'HDFC', last4: '9876' }
        ]
      }));
    }
  },
  getProfile() {
    return JSON.parse(localStorage.getItem(this.key));
  },
  updateName(newName) {
    if(!newName || newName.trim() === '') return false;
    const p = this.getProfile();
    p.name = newName.trim();
    localStorage.setItem(this.key, JSON.stringify(p));
    this.syncUI();
    return true;
  },
  addAccount(bankName, last4) {
    if(!bankName || !last4) return false;
    const p = this.getProfile();
    if (!p.accounts) p.accounts = [];
    p.accounts.push({ bank: bankName.trim(), last4: last4.trim() });
    localStorage.setItem(this.key, JSON.stringify(p));
    this.renderAccounts();
    return true;
  },
  renderAccounts() {
    const p = this.getProfile();
    const container = document.getElementById('linked-accounts-container');
    if (!container || !p.accounts) return;
    
    let html = '';
    p.accounts.forEach(acc => {
      html += `
        <div class="linked-account">
            <div style="width:40px; height:40px; border-radius:8px; background:white; color:black; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                <i data-lucide="landmark"></i>
            </div>
            <div style="font-weight: 500;">${acc.bank} - ****${acc.last4}</div>
        </div>
      `;
    });
    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  },
  syncUI() {
    const p = this.getProfile();
    const nameEls = document.querySelectorAll('#prof-name, #card-holder-name');
    nameEls.forEach(el => {
      if(el.tagName === 'INPUT') el.value = p.name;
      else el.textContent = p.name;
    });

    const emailEls = document.querySelectorAll('#prof-email');
    emailEls.forEach(el => el.textContent = p.email);

    const phoneEls = document.querySelectorAll('#prof-phone');
    phoneEls.forEach(el => el.textContent = p.phone);

    // Update avatar initials
    const avatars = document.querySelectorAll('#prof-avatar, #header-avatar');
    if(p.name) {
      const initials = p.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
      avatars.forEach(el => el.textContent = initials);
      
      const welcome = document.getElementById('header-welcome');
      if (welcome) welcome.textContent = 'Hello, ' + p.name.split(' ')[0];
    }
    
    this.renderAccounts();
  }
};

// Run on load wrapper
document.addEventListener('DOMContentLoaded', () => {
  window.BalanceManager.init();
  window.BalanceManager.syncUI();
  window.TransactionManager.init();
  window.TransactionManager.renderTransactions();
  if(window.ProfileManager) {
    window.ProfileManager.init();
    window.ProfileManager.syncUI();
  }
  if (window.lucide) window.lucide.createIcons();
});
