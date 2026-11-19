/**
 * BALSONS STORE MANAGER - MAIN APPLICATION CONTROLLER
 * Baseline: SAM-2026 & BEDS V1.0
 * Project: Jupiter Tatravagonka Railwheel Factory (JTRWF), Khordha, Odisha
 */

document.addEventListener('DOMContentLoaded', function() {
  BalsonsStoreApp.init();
});

const BalsonsStoreApp = {
  currentView: 'view-radar',
  tools: [],
  transactions: [],
  receipts: [],
  quarantine: [],
  procurement: [],
  vendors: [],

  init: function() {
    this.initTheme();
    this.initAuth();
    this.initLanguage();
    this.loadData();
    this.initNavigation();
    this.renderRadarDashboard();
    this.renderToolMasterTable();
    this.renderForm11Table();
    this.renderTransactionsTable();
    this.renderReceiptsTable();
    this.renderQuarantineTable();
    this.renderProcurementTable();
    this.renderVendorsTable();
    this.renderQrTagStudio();
  },

  // -------------------------------------------------------------
  // THEME (BEDS V1.0 STANDARD)
  // -------------------------------------------------------------
  initTheme: function() {
    const saved = localStorage.getItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateThemeBtn(saved);

    const btn = document.getElementById('btn-toggle-theme');
    if (btn) {
      btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.THEME, next);
        this.updateThemeBtn(next);
      });
    }
  },

  updateThemeBtn: function(theme) {
    const btn = document.getElementById('btn-toggle-theme');
    if (btn) btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  },

  // -------------------------------------------------------------
  // AUTH & USER ROLES
  // -------------------------------------------------------------
  initAuth: function() {
    BalsonsStoreAuth.init();
    const user = BalsonsStoreAuth.getUser();
    const nameEl = document.getElementById('header-user-display');
    const badgeEl = document.getElementById('header-role-badge');
    if (nameEl) nameEl.textContent = user.fullName;
    if (badgeEl) {
      badgeEl.textContent = user.roleLabel || user.role;
      badgeEl.className = `role-badge role-${user.role}`;
    }

    const switchBtn = document.getElementById('btn-switch-user');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        const nextRole = user.role === 'StoreManager' ? 'Owner' : (user.role === 'Owner' ? 'MaintenanceEngineer' : 'StoreManager');
        BalsonsStoreAuth.switchUserByRole(nextRole);
        this.initAuth();
        if (window.BalsonsWorkspace) {
          window.BalsonsWorkspace.showToast(`Switched active profile to: ${BalsonsStoreAuth.getUser().fullName} (${BalsonsStoreAuth.getUser().role})`, 'info');
        }
      });
    }
  },

  initLanguage: function() {
    BalsonsStoreI18n.applyTranslations();
    document.querySelectorAll('.lang-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        BalsonsStoreI18n.setLang(lang);
      });
    });
  },

  // -------------------------------------------------------------
  // DATA PERSISTENCE & DUAL-SYNC
  // -------------------------------------------------------------
  loadData: function() {
    const savedTools = localStorage.getItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.TOOLS);
    if (savedTools) {
      try { this.tools = JSON.parse(savedTools); } catch(e) { this.tools = BALSONS_STORE_DATA.tools; }
    } else {
      this.tools = [...BALSONS_STORE_DATA.tools];
      this.saveTools();
    }

    const savedTx = localStorage.getItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.TRANSACTIONS);
    this.transactions = savedTx ? JSON.parse(savedTx) : [...BALSONS_STORE_DATA.transactions];

    const savedRc = localStorage.getItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.RECEIPTS);
    this.receipts = savedRc ? JSON.parse(savedRc) : [...BALSONS_STORE_DATA.receipts];

    const savedQ = localStorage.getItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.QUARANTINE);
    this.quarantine = savedQ ? JSON.parse(savedQ) : [...BALSONS_STORE_DATA.quarantine];

    const savedPr = localStorage.getItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.PROCUREMENT);
    this.procurement = savedPr ? JSON.parse(savedPr) : [...BALSONS_STORE_DATA.procurement];

    this.vendors = [...BALSONS_STORE_DATA.vendors];
  },

  refreshData: async function() {
    this.loadData();
    this.renderRadarKPIs();
    this.renderInventoryTable();
    this.renderForm11Table();
    this.renderLoansTable();
    this.renderQuarantineTable();
    this.renderReceiptsTable();
    this.renderProcurementTable();
    console.log('🔄 BalsonsStoreApp data refreshed from dedicated store registers');
  },

  saveTools: function() {
    localStorage.setItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.TOOLS, JSON.stringify(this.tools));
  },

  saveTransactions: function() {
    localStorage.setItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
  },

  saveQuarantine: function() {
    localStorage.setItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.QUARANTINE, JSON.stringify(this.quarantine));
  },

  saveReceipts: function() {
    localStorage.setItem(BALSONS_STORE_CONFIG.STORAGE_KEYS.RECEIPTS, JSON.stringify(this.receipts));
  },

  // -------------------------------------------------------------
  // NAVIGATION ROUTING
  // -------------------------------------------------------------
  initNavigation: function() {
    document.querySelectorAll('button.beds-nav-tab[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.switchView(target);
      });
    });

    document.querySelectorAll('.beds-dropdown-item[data-target]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        document.querySelectorAll('.beds-nav-dropdown').forEach(d => d.classList.remove('open'));
        this.switchView(target);
      });
    });

    // Dropdown toggles
    document.querySelectorAll('.beds-dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = btn.closest('.beds-nav-dropdown');
        document.querySelectorAll('.beds-nav-dropdown').forEach(d => { if (d !== parent) d.classList.remove('open'); });
        if (parent) parent.classList.toggle('open');
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.beds-nav-dropdown').forEach(d => d.classList.remove('open'));
    });
  },

  switchView: function(viewId) {
    this.currentView = viewId;
    document.querySelectorAll('button.beds-nav-tab[data-target]').forEach(b => {
      if (b.getAttribute('data-target') === viewId) b.classList.add('active');
      else b.classList.remove('active');
    });

    document.querySelectorAll('.beds-dropdown-item').forEach(item => {
      if (item.getAttribute('data-target') === viewId) {
        item.classList.add('active');
        const parentToggle = item.closest('.beds-nav-dropdown')?.querySelector('.beds-dropdown-toggle');
        if (parentToggle) parentToggle.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.beds-view-panel').forEach(v => {
      if (v.id === viewId) v.classList.add('active');
      else v.classList.remove('active');
    });

    if (viewId === 'view-dossier-360') {
      this.render360DossierPage();
    }

    BalsonsStoreI18n.applyTranslations();
  },

  // -------------------------------------------------------------
  // MODULE 01: COMMAND RADAR & KPIS
  // -------------------------------------------------------------
  renderRadarDashboard: function() {
    const total = this.tools.length;
    const available = this.tools.filter(t => t.status === 'AVAILABLE').length;
    const issued = this.tools.filter(t => t.status === 'ISSUED').length;
    const quarantined = this.tools.filter(t => t.status === 'QUARANTINED').length;
    const underRepair = this.tools.filter(t => t.status === 'UNDER_REPAIR').length;

    // Statutory Form 11 due in 30 days
    const now = new Date();
    const in30Days = new Date(Date.now() + 30 * 86400000);
    const form11Due = this.tools.filter(t => {
      if (!t.isLifting || !t.nextInspection) return false;
      const d = new Date(t.nextInspection);
      return d <= in30Days;
    }).length;

    const elTotal = document.getElementById('kpi-total-tools'); if (elTotal) elTotal.textContent = total;
    const elAvail = document.getElementById('kpi-avail-tools'); if (elAvail) elAvail.textContent = available;
    const elIssued = document.getElementById('kpi-issued-tools'); if (elIssued) elIssued.textContent = issued;
    const elQuar = document.getElementById('kpi-quar-tools'); if (elQuar) elQuar.textContent = quarantined;
    const elForm11 = document.getElementById('kpi-form11-due'); if (elForm11) elForm11.textContent = form11Due;
    const elRepair = document.getElementById('kpi-repair-tools'); if (elRepair) elRepair.textContent = underRepair;
  },

  // -------------------------------------------------------------
  // MODULE 02: 264 TOOL INVENTORY MASTER TABLE
  // -------------------------------------------------------------
  renderToolMasterTable: function(filterSec = 'ALL', query = '') {
    const tbody = document.getElementById('tools-table-body');
    if (!tbody) return;

    let filtered = this.tools;
    if (filterSec !== 'ALL') {
      filtered = filtered.filter(t => t.section === filterSec);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(q) || 
        t.desc.toLowerCase().includes(q) || 
        t.make.toLowerCase().includes(q) ||
        t.capacity.toLowerCase().includes(q)
      );
    }

    const countEl = document.getElementById('tool-count-badge');
    if (countEl) countEl.textContent = `Showing ${filtered.length} of ${this.tools.length} Tools`;

    tbody.innerHTML = filtered.map(t => {
      let statusClass = 'status-success';
      if (t.status === 'ISSUED') statusClass = 'status-info';
      else if (t.status === 'QUARANTINED') statusClass = 'status-critical';
      else if (t.status === 'UNDER_REPAIR') statusClass = 'status-warning';
      else if (t.status === 'RETIRED') statusClass = 'status-neutral';

      return `
        <tr>
          <td><strong style="font-family: monospace; color: var(--beds-teal-primary);">${t.id}</strong></td>
          <td>
            <strong>${t.desc}</strong><br>
            <small style="color: var(--beds-text-muted);">${t.make} · ${t.model}</small>
          </td>
          <td><span class="meta-tag">${t.section}</span></td>
          <td><strong>${t.capacity || t.spec}</strong></td>
          <td>${t.binLocation || 'STORE-01'}</td>
          <td><span class="status-pill ${statusClass}">● ${t.status}</span></td>
          <td>
            <small>${t.issuedTo || 'In Store'}</small>
          </td>
          <td style="text-align: right;">
            ${t.status === 'AVAILABLE' ? `
              <button class="beds-btn beds-btn-sm beds-btn-primary" onclick="BalsonsStoreApp.openIssueModal('${t.id}')">Issue →</button>
            ` : (t.status === 'ISSUED' ? `
              <button class="beds-btn beds-btn-sm beds-btn-secondary" onclick="BalsonsStoreApp.openReturnModal('${t.id}')">Return ↵</button>
            ` : `
              <button class="beds-btn beds-btn-sm beds-btn-secondary" onclick="BalsonsStoreApp.openQuarantineView('${t.id}')">Inspect</button>
            `)}
          </td>
        </tr>
      `;
    }).join('');
  },

  filterToolsByCategory: function(secCode, btn) {
    document.querySelectorAll('.tool-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const q = document.getElementById('tool-search-input')?.value || '';
    this.renderToolMasterTable(secCode, q);
  },

  searchTools: function(query) {
    const activeBtn = document.querySelector('.tool-filter-btn.active');
    const sec = activeBtn ? activeBtn.getAttribute('data-sec') : 'ALL';
    this.renderToolMasterTable(sec, query);
  },

  // -------------------------------------------------------------
  // MODULE 03: STATUTORY FORM 11 REGISTER (ODISHA FACTORIES ACT)
  // -------------------------------------------------------------
  renderForm11Table: function() {
    const tbody = document.getElementById('form11-table-body');
    if (!tbody) return;

    const liftingTackles = this.tools.filter(t => t.isLifting);
    const now = new Date();
    const in30Days = new Date(Date.now() + 30 * 86400000);

    tbody.innerHTML = liftingTackles.map(t => {
      let comp = 'VALID';
      let compClass = 'status-success';
      if (!t.nextInspection) {
        comp = 'DATE_NOT_SET';
        compClass = 'status-neutral';
      } else {
        const d = new Date(t.nextInspection);
        if (d < now) {
          comp = 'OVERDUE';
          compClass = 'status-critical';
        } else if (d <= in30Days) {
          comp = 'DUE_SOON';
          compClass = 'status-warning';
        }
      }

      return `
        <tr>
          <td><strong style="font-family: monospace; color: var(--beds-teal-primary);">${t.id}</strong></td>
          <td><strong>${t.desc}</strong></td>
          <td><strong style="color: #059669;">${t.capacity}</strong></td>
          <td><span style="font-family: monospace; font-size: 11px;">${t.form11Cert || 'F11-PENDING'}</span></td>
          <td>${t.lastInspection || 'N/A'}</td>
          <td><strong>${t.nextInspection || 'N/A'}</strong></td>
          <td><span class="status-pill ${compClass}">● ${comp}</span></td>
          <td style="text-align: right;">
            <button class="beds-btn beds-btn-sm beds-btn-secondary" onclick="alert('Form 11 Certificate for ${t.id} verified clean and uploaded under Factories Act.')">📜 View Cert</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  // -------------------------------------------------------------
  // MODULE 04: TOOL LOANS & ISSUE DESK
  // -------------------------------------------------------------
  renderTransactionsTable: function() {
    const tbody = document.getElementById('transactions-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.transactions.map(tx => `
      <tr>
        <td><strong style="font-family: monospace;">${tx.txId}</strong></td>
        <td><strong style="color: var(--beds-teal-primary);">${tx.toolId}</strong> - ${tx.toolDesc}</td>
        <td>
          <strong>${tx.empName}</strong> (${tx.empTrade})<br>
          <small style="color: var(--beds-text-muted);">${tx.empId} · ${tx.dept}</small>
        </td>
        <td>${tx.area}</td>
        <td>${tx.issueDate}</td>
        <td>${tx.expectedReturn || 'Open'}</td>
        <td><span class="status-pill ${tx.status === 'ACTIVE_LOAN' ? 'status-info' : 'status-success'}">● ${tx.status}</span></td>
        <td style="text-align: right;">
          ${tx.status === 'ACTIVE_LOAN' ? `
            <button class="beds-btn beds-btn-sm beds-btn-primary" onclick="BalsonsStoreApp.returnActiveLoan('${tx.txId}')">Return & Inspect</button>
          ` : `
            <span style="font-size: 11px; color: var(--beds-text-muted);">${tx.conditionReturned || 'Returned OK'}</span>
          `}
        </td>
      </tr>
    `).join('');
  },

  openIssueModal: function(toolId) {
    const tool = this.tools.find(t => t.id === toolId);
    if (!tool) return;

    const modal = document.getElementById('modal-issue-tool');
    if (modal) {
      document.getElementById('issue-tool-id').value = tool.id;
      document.getElementById('issue-tool-desc').value = `${tool.desc} (${tool.capacity || tool.spec})`;
      modal.classList.add('active');
    }
  },

  submitToolIssue: function(e) {
    e.preventDefault();
    const toolId = document.getElementById('issue-tool-id').value;
    const empSelect = document.getElementById('issue-emp-select');
    const empId = empSelect.value;
    const empName = empSelect.options[empSelect.selectedIndex].text;
    const area = document.getElementById('issue-work-area').value;
    const purpose = document.getElementById('issue-purpose').value;
    const expectedReturn = document.getElementById('issue-return-date').value;

    const tool = this.tools.find(t => t.id === toolId);
    if (tool) {
      tool.status = 'ISSUED';
      tool.issuedTo = `${empId} (${empName.split('-')[0].trim()})`;
      tool.issuedDate = new Date().toISOString().split('T')[0];
      this.saveTools();
    }

    const rnd = Math.floor(100 + Math.random() * 900);
    const newTx = {
      txId: `TX-JTRWF-2026-${rnd}`,
      toolId: toolId,
      toolDesc: tool ? tool.desc : 'Tool',
      empId: empId,
      empName: empName.split('-')[0].trim(),
      empTrade: 'Site Specialist',
      dept: 'Heavy Lift & Shift',
      area: area,
      issueDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0,5),
      expectedReturn: expectedReturn || '2026-11-22 18:00',
      actualReturn: None = null,
      status: 'ACTIVE_LOAN',
      purpose: purpose || 'Heavy Plant Erection',
      conditionIssued: 'GOOD',
      conditionReturned: null,
      issuedBy: BalsonsStoreAuth.getUser().fullName
    };

    this.transactions.unshift(newTx);
    this.saveTransactions();

    this.renderRadarDashboard();
    this.renderToolMasterTable();
    this.renderTransactionsTable();

    document.getElementById('modal-issue-tool').classList.remove('active');
    if (window.BalsonsWorkspace) {
      window.BalsonsWorkspace.showToast(`✅ Tool ${toolId} successfully issued to ${empId} (${empName})!`, 'success');
    }
  },

  returnActiveLoan: function(txId) {
    const tx = this.transactions.find(t => t.txId === txId);
    if (!tx) return;

    const condition = prompt(`Inspect condition of ${tx.toolId} on return:\nEnter 'OK' for Good condition or 'DAMAGED' to Quarantine:`, 'OK');
    if (!condition) return;

    tx.actualReturn = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0,5);
    tx.status = condition.toUpperCase().includes('DAM') ? 'RETURNED_DAMAGED' : 'RETURNED_OK';
    tx.conditionReturned = condition.toUpperCase().includes('DAM') ? 'DAMAGED (Quarantined)' : 'GOOD CONDITION';

    const tool = this.tools.find(t => t.id === tx.toolId);
    if (tool) {
      if (condition.toUpperCase().includes('DAM')) {
        tool.status = 'QUARANTINED';
        tool.condition = 'DEFECTIVE (Awaiting Repair / Condemnation)';
        // add to quarantine
        const qRnd = Math.floor(10 + Math.random() * 90);
        this.quarantine.unshift({
          redTagId: `RED-TAG-2026-${qRnd}`,
          toolId: tool.id,
          toolDesc: tool.desc,
          quarantinedDate: new Date().toISOString().split('T')[0],
          quarantinedBy: BalsonsStoreAuth.getUser().fullName,
          defectCategory: 'SITE_DAMAGE',
          defectDetail: 'Returned damaged from site work. Quarantined in cage.',
          actionTaken: 'RED TAG APPLIED · MOVED TO QUARANTINE CAGE',
          resolution: 'Awaiting inspection by Rigging Engineer.',
          status: 'HOLD_DEFECTIVE'
        });
        this.saveQuarantine();
        this.renderQuarantineTable();
      } else {
        tool.status = 'AVAILABLE';
        tool.issuedTo = null;
        tool.issuedDate = null;
      }
      this.saveTools();
    }

    this.saveTransactions();
    this.renderRadarDashboard();
    this.renderToolMasterTable();
    this.renderTransactionsTable();

    if (window.BalsonsWorkspace) {
      window.BalsonsWorkspace.showToast(`↵ Tool ${tx.toolId} returned and checked into store inventory.`, 'success');
    }
  },

  openReturnModal: function(toolId) {
    const tx = this.transactions.find(t => t.toolId === toolId && t.status === 'ACTIVE_LOAN');
    if (tx) {
      this.returnActiveLoan(tx.txId);
    } else {
      const tool = this.tools.find(t => t.id === toolId);
      if (tool) {
        tool.status = 'AVAILABLE';
        tool.issuedTo = null;
        this.saveTools();
        this.renderRadarDashboard();
        this.renderToolMasterTable();
        alert(`Tool ${toolId} returned to store.`);
      }
    }
  },

  // -------------------------------------------------------------
  // MODULE 05: MATERIAL RECEIPTS & GRN REGISTER
  // -------------------------------------------------------------
  renderReceiptsTable: function() {
    const tbody = document.getElementById('receipts-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.receipts.map(r => `
      <tr>
        <td><strong style="font-family: monospace; color: var(--beds-teal-primary);">${r.grnNo}</strong></td>
        <td><strong>${r.vendorName}</strong></td>
        <td>${r.poNo}<br><small>${r.challanNo}</small></td>
        <td>${r.itemDesc}</td>
        <td>${r.receivedQty} ${r.unit}</td>
        <td><strong style="color: #059669;">${r.acceptedQty}</strong> / <span style="color: #DC2626;">${r.rejectedQty}</span></td>
        <td><span class="status-pill ${r.inspectionStatus === 'ACCEPTED' ? 'status-success' : 'status-warning'}">● ${r.inspectionStatus}</span></td>
        <td><small>${r.inspectedBy}</small></td>
      </tr>
    `).join('');
  },

  // -------------------------------------------------------------
  // MODULE 06: DAMAGED EQUIPMENT & QUARANTINE DESK
  // -------------------------------------------------------------
  renderQuarantineTable: function() {
    const tbody = document.getElementById('quarantine-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.quarantine.map(q => `
      <tr>
        <td><strong style="font-family: monospace; color: #DC2626;">${q.redTagId}</strong></td>
        <td><strong style="color: var(--beds-teal-primary);">${q.toolId}</strong> - ${q.toolDesc}</td>
        <td>${q.quarantinedDate}</td>
        <td><span class="meta-tag" style="background: rgba(220, 38, 38, 0.1); color: #DC2626;">${q.defectCategory}</span></td>
        <td>${q.defectDetail}</td>
        <td><strong>${q.actionTaken}</strong></td>
        <td><span class="status-pill ${q.status === 'SCRAPPED' ? 'status-neutral' : 'status-critical'}">● ${q.status}</span></td>
      </tr>
    `).join('');
  },

  // -------------------------------------------------------------
  // MODULE 07: RGP / NRGP GATE PASS STUDIO
  // -------------------------------------------------------------
  generateRgpChallan: function() {
    const passType = document.getElementById('rgp-type')?.value || 'RGP';
    const vehicle = document.getElementById('rgp-vehicle')?.value || 'OD-02-AK-4412';
    const vendor = document.getElementById('rgp-dest')?.value || 'Enerpac Service Center, Bhubaneswar';
    const purpose = document.getElementById('rgp-purpose')?.value || 'Periodic Calibrated Proof Load Testing & Recertification';
    const items = document.getElementById('rgp-items')?.value || '1. BAL-LF-HYJ-004 (Hydraulic Jack 500T)\n2. BAL-LF-SHK-010 (Bow Shackle 85T)';
    const returnDate = document.getElementById('rgp-return-date')?.value || '2026-11-28';

    const rnd = Math.floor(1000 + Math.random() * 9000);
    const passId = `GP-${passType}-2026-${rnd}`;

    const sheetContainer = document.getElementById('rgp-printable-sheet');
    if (!sheetContainer) return;

    sheetContainer.innerHTML = `
      <div style="border: 2px solid #102D35; padding: 24px; background: #FFFFFF; color: #102D35; font-family: Inter, sans-serif; max-width: 840px; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0097B2; padding-bottom: 12px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="assets/images/balsons-logo.png" alt="BALSONS" style="height: 48px; object-fit: contain;">
            <div>
              <div style="font-size: 16px; font-weight: 800; color: #0097B2;">BALSONS HEAVY LIFT & SHIFT</div>
              <div style="font-size: 11px; font-weight: 700; color: #52636B;">Project: JTRWF Railwheel Factory, Khordha, Odisha</div>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 14px; font-weight: 900; background: ${passType === 'RGP' ? '#0097B2' : '#E64646'}; color: #FFFFFF; padding: 4px 12px; border-radius: 4px;">
              ${passType === 'RGP' ? 'RETURNABLE GATE PASS (RGP)' : 'NON-RETURNABLE GATE PASS (NRGP)'}
            </span>
            <div style="font-family: monospace; font-size: 12px; font-weight: 800; margin-top: 4px;">Pass No: ${passId}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 14px;">
          <tr>
            <td style="padding: 6px; border: 1px solid #CBD5E1; background: #F8FAFC; width: 25%; font-weight: 700;">Date of Dispatch:</td>
            <td style="padding: 6px; border: 1px solid #CBD5E1; width: 25%; font-weight: 600;">${new Date().toLocaleDateString()}</td>
            <td style="padding: 6px; border: 1px solid #CBD5E1; background: #F8FAFC; width: 25%; font-weight: 700;">Vehicle / Driver:</td>
            <td style="padding: 6px; border: 1px solid #CBD5E1; width: 25%; font-weight: 600;">${vehicle}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #CBD5E1; background: #F8FAFC; font-weight: 700;">Destination / Vendor:</td>
            <td style="padding: 6px; border: 1px solid #CBD5E1; font-weight: 600;">${vendor}</td>
            <td style="padding: 6px; border: 1px solid #CBD5E1; background: #F8FAFC; font-weight: 700;">Expected Return Date:</td>
            <td style="padding: 6px; border: 1px solid #CBD5E1; font-weight: 600; color: #0097B2;">${passType === 'RGP' ? returnDate : 'N/A (Non-Returnable)'}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #CBD5E1; background: #F8FAFC; font-weight: 700;">Reason / Purpose:</td>
            <td colspan="3" style="padding: 6px; border: 1px solid #CBD5E1; font-weight: 600;">${purpose}</td>
          </tr>
        </table>

        <div style="font-size: 12px; font-weight: 800; margin-bottom: 6px; color: #102D35;">Material & Tool Details:</div>
        <div style="border: 1px solid #CBD5E1; background: #F8FAFC; padding: 12px; font-family: monospace; font-size: 12px; white-space: pre-wrap; line-height: 1.6; margin-bottom: 24px;">
${items}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 24px; border-top: 1px dashed #CBD5E1; font-size: 11px;">
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #102D35; width: 160px; padding-bottom: 4px; font-weight: 700;">${BalsonsStoreAuth.getUser().fullName}</div>
            <div style="margin-top: 4px; color: #52636B;">Store In-Charge (Issued By)</div>
          </div>
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #102D35; width: 160px; padding-bottom: 4px; font-weight: 700;">Ashok Mohanty</div>
            <div style="margin-top: 4px; color: #52636B;">Project Manager / Approver</div>
          </div>
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #102D35; width: 160px; padding-bottom: 4px; font-weight: 700;">Security Main Gate</div>
            <div style="margin-top: 4px; color: #52636B;">Gate Entry Outward Stamp</div>
          </div>
        </div>
      </div>
    `;

    if (window.BalsonsWorkspace) {
      window.BalsonsWorkspace.showToast(`✅ Gate Pass ${passId} generated and ready for A4 printing!`, 'success');
    }
  },

  // -------------------------------------------------------------
  // MODULE 08: PROCUREMENT REQUISITIONS (PR)
  // -------------------------------------------------------------
  renderProcurementTable: function() {
    const tbody = document.getElementById('procurement-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.procurement.map(pr => `
      <tr>
        <td><strong style="font-family: monospace; color: var(--beds-teal-primary);">${pr.prId}</strong></td>
        <td><strong>${pr.itemDesc}</strong></td>
        <td>${pr.category}</td>
        <td><strong>${pr.qty} ${pr.unit}</strong></td>
        <td>${pr.requestedBy}</td>
        <td>${pr.requiredByDate}</td>
        <td><strong>${pr.estimatedCost}</strong></td>
        <td><span class="status-pill status-info">● ${pr.status}</span></td>
      </tr>
    `).join('');
  },

  // -------------------------------------------------------------
  // MODULE 09: VENDOR DIRECTORY
  // -------------------------------------------------------------
  renderVendorsTable: function() {
    const tbody = document.getElementById('vendors-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.vendors.map(v => `
      <tr>
        <td><strong style="font-family: monospace;">${v.id}</strong></td>
        <td><strong>${v.name}</strong></td>
        <td>${v.contact}<br><small>${v.phone} · ${v.email}</small></td>
        <td><span style="font-family: monospace; font-size: 11px;">${v.gst}</span></td>
        <td><span class="meta-tag">${v.category}</span></td>
        <td><span class="status-pill status-success">● ${v.rating}</span></td>
      </tr>
    `).join('');
  },

  // -------------------------------------------------------------
  // MODULE 10: QR TAG SHEET STUDIO
  // -------------------------------------------------------------
  renderQrTagStudio: function(secCode = 'LF') {
    const container = document.getElementById('qr-sheet-container');
    if (!container) return;

    const subset = this.tools.filter(t => t.section === secCode).slice(0, 8);
    container.innerHTML = BalsonsQrGenerator.renderA4Sheet(subset);
  },

  printQrTagSheet: function() {
    window.print();
  },

  // -------------------------------------------------------------
  // 360° WORKFORCE DOSSIER INTEGRATION
  // -------------------------------------------------------------
  render360DossierPage: function(empId) {
    const id = empId || 'EMP-2026-0001';
    if (window.Balsons360Dossier) {
      window.Balsons360Dossier.populateSelect('store-dossier-page-select', id);
      const container = document.getElementById('store-dossier-page-container');
      if (container) {
        container.innerHTML = window.Balsons360Dossier.renderCard(id);
      }
    }
  }
};

window.BalsonsStoreApp = BalsonsStoreApp;
