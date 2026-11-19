/**
 * BALSONS STORE MANAGER - AUTHENTICATION & ROLE MANAGEMENT
 * Baseline: SAM-2026 & BEDS V1.0
 */

const BalsonsStoreAuth = {
  USERS: [
    { username: 'store.head', fullName: 'Gagan Bihari Das', role: 'StoreManager', roleLabel: 'Chief Store In-Charge', pass: 'Store@2026!', dept: 'Store & Logistics' },
    { username: 'admin', fullName: 'Gajendra Rao', role: 'Owner', roleLabel: 'Project Director', pass: 'Admin@2026!', dept: 'Management' },
    { username: 'purchase.lead', fullName: 'Ashok Mohanty', role: 'PurchaseManager', roleLabel: 'Commercial Purchase Lead', pass: 'Purchase@2026!', dept: 'Procurement' },
    { username: 'maint.eng', fullName: 'Pradeep Rout', role: 'MaintenanceEngineer', roleLabel: 'Rigging Maintenance Eng.', pass: 'Maint@2026!', dept: 'Tooling & Maintenance' },
    { username: 'site.viewer', fullName: 'JTRWF Client Auditor', role: 'Viewer', roleLabel: 'Client Store Auditor', pass: 'Viewer@2026!', dept: 'JTRWF Audit Team' }
  ],

  currentUser: null,

  init: function() {
    const saved = localStorage.getItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.SESSION);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch(e) {
        this.currentUser = this.USERS[0];
      }
    } else {
      this.currentUser = this.USERS[0]; // Default to StoreManager
      this.saveSession();
    }
  },

  getUser: function() {
    if (!this.currentUser) this.init();
    return this.currentUser;
  },

  login: function(username, pass) {
    const user = this.USERS.find(u => u.username === username && u.pass === pass);
    if (user) {
      this.currentUser = user;
      this.saveSession();
      return { success: true, user: user };
    }
    return { success: false, message: 'Invalid username or password' };
  },

  switchUserByRole: function(role) {
    const user = this.USERS.find(u => u.role === role) || this.USERS[0];
    this.currentUser = user;
    this.saveSession();
    return user;
  },

  saveSession: function() {
    localStorage.setItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
  },

  canEdit: function() {
    const role = this.currentUser?.role;
    return role === 'Owner' || role === 'StoreManager' || role === 'PurchaseManager' || role === 'MaintenanceEngineer';
  },

  canApprovePO: function() {
    const role = this.currentUser?.role;
    return role === 'Owner' || role === 'PurchaseManager';
  },

  canQuarantine: function() {
    const role = this.currentUser?.role;
    return role === 'Owner' || role === 'StoreManager' || role === 'MaintenanceEngineer';
  }
};

window.BalsonsStoreAuth = BalsonsStoreAuth;
