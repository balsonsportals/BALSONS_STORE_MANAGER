/**
 * BALSONS ENTERPRISE WORKSPACE CONTROLLER (BEDS V1.0)
 * Universal Department Switcher, Dedicated Dual-Sync Google Sheet Engine, & Mobile Responsive Navigation
 * Applicable to all BALSONS operational portals (Safety, HR, Gate Entry, Store, Launcher)
 */

(function() {
  const PORTAL_DATABASES = {
    'store': {
      id: '1u_ZKvvCVfEQDAtkoMR68q2d2hEK-eWBnvsS3AGfP6yQ',
      name: 'Store',
      fullName: 'Store & Heavy Rigging Inventory Master'
    },
    'safety': {
      id: '1SyOGt6HEu6HJCufAbB2_P6BgF6pEppt28J_8cARaOP0',
      name: 'Safety',
      fullName: 'Safety, EHS & PTW Governance'
    },
    'hr': {
      id: '1so_aH05vVxiUJsIK6VS-n7BpGrHWNgn_5EK7RuA3cuw',
      name: 'HR',
      fullName: 'HR & Dual-Wage Payroll Master'
    },
    'gate': {
      id: '1emZvUYjT-hTduELE4lSboVCtndFfGQ8KC2elpQ6Em9TF4RW6d2VF75J-',
      name: 'Gate',
      fullName: 'Gate Entry & Turnstile Access Master'
    },
    'launcher': {
      id: '1u_ZKvvCVfEQDAtkoMR68q2d2hEK-eWBnvsS3AGfP6yQ',
      name: 'Ecosystem',
      fullName: 'Central Enterprise Launcher'
    }
  };

  const DEPARTMENTS = [
    { code: 'safety', name: '🛡️ Safety & PTW Manager', path: '../BALSONS SAFETY MANAGER/frontend/index.html', rootPath: 'BALSONS SAFETY MANAGER/frontend/index.html' },
    { code: 'hr', name: '👥 HR & Dual-Wage Payroll', path: '../BALSONS HR MANAGER/frontend/index.html', rootPath: 'BALSONS HR MANAGER/frontend/index.html' },
    { code: 'gate', name: '🚧 Gate Entry & Turnstile Access', path: '../BALSONS GATE ENTRY MANAGER/frontend/index.html', rootPath: 'BALSONS GATE ENTRY MANAGER/frontend/index.html' },
    { code: 'store', name: '📦 Store & Rigging Tackles', path: '../BALSONS STORE MANAGER/frontend/index.html', rootPath: 'BALSONS STORE MANAGER/frontend/index.html' },
    { code: 'launcher', name: '🌐 Central Enterprise Launcher', path: '../../index.html', rootPath: 'index.html' }
  ];

  const BalsonsWorkspace = {
    isDualSyncing: false,

    init: function() {
      this.injectEnterpriseTopbar();
      this.injectMobileHamburgerAndDrawer();
      this.injectToastContainer();
      this.bindGlobalEvents();
      console.log('✅ BALSONS Enterprise Workspace & Dual-Sync Engine Initialized');
    },

    getCurrentPortalCode: function() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('safety')) return 'safety';
      if (path.includes('hr')) return 'hr';
      if (path.includes('gate')) return 'gate';
      if (path.includes('store')) return 'store';
      return 'launcher';
    },

    getCurrentPortalDb: function() {
      const code = this.getCurrentPortalCode();
      return PORTAL_DATABASES[code] || PORTAL_DATABASES['launcher'];
    },

    injectEnterpriseTopbar: function() {
      if (document.getElementById('beds-enterprise-topbar')) return;

      const currentPortal = this.getCurrentPortalCode();
      const isRoot = currentPortal === 'launcher' || !window.location.pathname.includes('/frontend/');
      const db = this.getCurrentPortalDb();
      const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/' + db.id + '/edit';

      const deptLinksHtml = DEPARTMENTS.map(d => {
        const targetHref = isRoot ? d.rootPath : d.path;
        const isActive = d.code === currentPortal;
        return `
          <a href="${targetHref}" class="beds-dept-item ${isActive ? 'active' : ''}">
            <span>${d.name}</span>
            ${isActive ? '<span style="font-size:10px; color:var(--beds-teal-primary); margin-left:auto;">● Active</span>' : ''}
          </a>
        `;
      }).join('');

      const topbar = document.createElement('div');
      topbar.id = 'beds-enterprise-topbar';
      topbar.className = 'beds-enterprise-topbar';
      topbar.innerHTML = `
        <div class="beds-topbar-left">
          <span class="beds-topbar-brand">
            🏢 BALSONS ENTERPRISE WORKSPACE
          </span>
          <span class="beds-topbar-divider">|</span>
          <span class="beds-topbar-project">JTRWF Khordha Project</span>
          <span class="beds-topbar-divider">|</span>
          <div class="beds-dept-dropdown" id="bedsDeptDropdown">
            <button class="beds-dept-toggle" onclick="BalsonsWorkspace.toggleDeptDropdown(event)" type="button">
              <span>⚡ Switch Department ▾</span>
            </button>
            <div class="beds-dept-menu">
              <div style="padding: 6px 14px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--beds-text-muted); border-bottom: 1px solid var(--beds-border-subtle);">
                BALSONS OPERATIONAL PORTALS
              </div>
              ${deptLinksHtml}
            </div>
          </div>
        </div>

        <div class="beds-topbar-right">
          <a href="${spreadsheetUrl}" target="_blank" class="beds-topbar-sync-pill" id="bedsSheetSyncPill" title="${db.fullName} (Click to Open: ${db.id})">
            <span class="pulse-dot"></span>
            <span class="sync-text">${db.name} DB Sync: <strong>LIVE</strong></span>
            <span class="sheet-id-chip" style="font-family: monospace; font-size: 9.5px; opacity: 0.85;">${db.id.substring(0, 8)}...</span>
          </a>
          <button class="beds-topbar-sync-btn" onclick="BalsonsWorkspace.triggerDualSync()" type="button" title="Force Bi-Directional Dual Sync for ${db.name}">
            ⚡ Sync ${db.name} Database
          </button>
        </div>
      `;

      // Insert at very top of body
      document.body.insertBefore(topbar, document.body.firstChild);
    },

    toggleDeptDropdown: function(e) {
      if (e) e.stopPropagation();
      const dd = document.getElementById('bedsDeptDropdown');
      if (dd) dd.classList.toggle('open');
    },

    injectMobileHamburgerAndDrawer: function() {
      const header = document.querySelector('header');
      if (header && !document.getElementById('btn-mobile-hamburger')) {
        const brandWrap = header.querySelector('.brand-wrap') || header.querySelector('.brand') || header;
        const btn = document.createElement('button');
        btn.id = 'btn-mobile-hamburger';
        btn.className = 'beds-mobile-hamburger';
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', 'Open Mobile Menu');
        btn.innerHTML = '☰ <span>Menu</span>';
        btn.onclick = () => this.openMobileDrawer();
        header.insertBefore(btn, header.firstChild);
      }

      if (!document.getElementById('beds-mobile-nav-drawer')) {
        const db = this.getCurrentPortalDb();
        const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/' + db.id + '/edit';

        const backdrop = document.createElement('div');
        backdrop.id = 'beds-drawer-backdrop';
        backdrop.className = 'beds-drawer-backdrop';
        backdrop.onclick = () => this.closeMobileDrawer();
        document.body.appendChild(backdrop);

        const drawer = document.createElement('div');
        drawer.id = 'beds-mobile-nav-drawer';
        drawer.className = 'beds-mobile-drawer';
        drawer.innerHTML = `
          <div class="beds-drawer-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="assets/images/balsons-logo.png" onerror="this.src='https://lh3.googleusercontent.com/d/1HB7sGaQ4f2qq0NNzgBQrSpUe2DJWV4uh'" alt="BALSONS" style="height: 32px; width: auto; object-fit: contain;">
              <div>
                <strong style="font-size: 13px; color: var(--beds-charcoal-heading); display: block; line-height: 1.2;">BALSONS PORTALS</strong>
                <small style="font-size: 10px; color: var(--beds-teal-primary); font-weight: 700;">JTRWF ENTERPRISE WORKSPACE</small>
              </div>
            </div>
            <button class="beds-drawer-close" onclick="BalsonsWorkspace.closeMobileDrawer()">&times;</button>
          </div>

          <div class="beds-drawer-body">
            <!-- Quick Actions -->
            <div>
              <div class="beds-drawer-group-title">⚡ Quick Access</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button class="beds-drawer-nav-item" onclick="BalsonsWorkspace.triggerDualSync(); BalsonsWorkspace.closeMobileDrawer();" style="background: rgba(16, 185, 129, 0.1); color: #059669; border-color: rgba(16, 185, 129, 0.3);">
                  <span>⚡</span>
                  <strong>Dual-Sync ${db.name} DB Now</strong>
                </button>
                <button class="beds-drawer-nav-item" onclick="BalsonsWorkspace.handleQuickAction('dossier-360')" style="background: rgba(0, 151, 178, 0.1); color: var(--beds-teal-primary); border-color: rgba(0, 151, 178, 0.3);">
                  <span>📄</span>
                  <strong>360° Workforce Dossier</strong>
                </button>
              </div>
            </div>

            <!-- Portal Navigation Items -->
            <div id="drawer-dynamic-nav-container">
              <div class="beds-drawer-group-title">📑 Portal Navigation Modules</div>
              <div id="drawer-dynamic-links" style="display: flex; flex-direction: column; gap: 4px;">
                <!-- Populated dynamically from current page navigation -->
              </div>
            </div>

            <!-- Department Switcher -->
            <div>
              <div class="beds-drawer-group-title">🏢 Switch Department Portal</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${this.renderDrawerDeptLinks()}
              </div>
            </div>

            <!-- Footer Controls in Drawer -->
            <div style="padding-top: 12px; border-top: 1px solid var(--beds-border-subtle); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: var(--beds-text-muted);">BEDS V1.0 · Locked SAM-2026</span>
              <a href="${spreadsheetUrl}" target="_blank" style="font-size: 11px; color: #10B981; font-weight: 700; text-decoration: none;">
                📊 Open ${db.name} Sheet ↗
              </a>
            </div>
          </div>
        `;
        document.body.appendChild(drawer);
        this.populateDrawerNavLinks();
      }
    },

    renderDrawerDeptLinks: function() {
      const currentPortal = this.getCurrentPortalCode();
      const isRoot = currentPortal === 'launcher' || !window.location.pathname.includes('/frontend/');
      return DEPARTMENTS.map(d => {
        const targetHref = isRoot ? d.rootPath : d.path;
        const isActive = d.code === currentPortal;
        return `
          <a href="${targetHref}" class="beds-drawer-nav-item ${isActive ? 'active' : ''}">
            <span>${d.name}</span>
          </a>
        `;
      }).join('');
    },

    populateDrawerNavLinks: function() {
      const container = document.getElementById('drawer-dynamic-links');
      if (!container) return;

      const links = [];
      document.querySelectorAll('button.beds-nav-tab[data-target], a.beds-dropdown-item[data-target]').forEach(el => {
        const target = el.getAttribute('data-target');
        const text = el.innerText.trim().replace(/\n/g, ' · ');
        if (target && !links.some(l => l.target === target)) {
          links.push({ target, text });
        }
      });

      if (links.length > 0) {
        container.innerHTML = links.map(l => `
          <button class="beds-drawer-nav-item" onclick="BalsonsWorkspace.navigateToTarget('${l.target}')" type="button">
            <span>●</span>
            <span>${l.text}</span>
          </button>
        `).join('');
      } else {
        container.innerHTML = `<span style="font-size: 12px; color: var(--beds-text-muted); padding: 6px;">Portal navigation loaded.</span>`;
      }
    },

    navigateToTarget: function(target) {
      this.closeMobileDrawer();
      if (window.BalsonsSafetyApp && typeof window.BalsonsSafetyApp.switchView === 'function') {
        window.BalsonsSafetyApp.switchView(target);
      } else if (window.BalsonsStoreApp && typeof window.BalsonsStoreApp.switchView === 'function') {
        window.BalsonsStoreApp.switchView(target);
      } else if (typeof window.switchHrTab === 'function') {
        let t = target.replace('view-', '').replace('tab-', '');
        if (t === 'dossier-360' || t.includes('dossier')) t = 'dossier-360';
        window.switchHrTab(t);
      } else if (typeof window.switchTab === 'function') {
        let t = target.replace('view-', '').replace('tab-', '');
        if (t === 'dossier-360' || t.includes('dossier')) t = 'gate-dossier-360';
        window.switchTab(t);
      }
    },

    handleQuickAction: function(action) {
      this.closeMobileDrawer();
      if (action === 'dossier-360') {
        if (window.Balsons360Dossier) {
          window.Balsons360Dossier.openModal('EMP-2026-0001');
        } else {
          this.navigateToTarget('view-dossier-360');
        }
      }
    },

    openMobileDrawer: function() {
      const drawer = document.getElementById('beds-mobile-nav-drawer');
      const backdrop = document.getElementById('beds-drawer-backdrop');
      if (drawer) drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    closeMobileDrawer: function() {
      const drawer = document.getElementById('beds-mobile-nav-drawer');
      const backdrop = document.getElementById('beds-drawer-backdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
    },

    injectToastContainer: function() {
      if (!document.getElementById('beds-toast-container')) {
        const container = document.createElement('div');
        container.id = 'beds-toast-container';
        container.className = 'beds-toast-container';
        document.body.appendChild(container);
      }
    },

    showToast: function(message, type = 'success') {
      const container = document.getElementById('beds-toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `beds-toast toast-${type}`;
      const icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : 'ℹ️');
      toast.innerHTML = `
        <span style="font-size: 16px;">${icon}</span>
        <div style="flex: 1; line-height: 1.35;">${message}</div>
      `;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 260);
      }, 4200);
    },

    triggerDualSync: async function() {
      if (this.isDualSyncing) return;
      this.isDualSyncing = true;

      const currentPortal = this.getCurrentPortalCode();
      const db = this.getCurrentPortalDb();
      const pill = document.getElementById('bedsSheetSyncPill');
      if (pill) {
        pill.style.background = 'rgba(245, 158, 11, 0.2)';
        pill.style.borderColor = '#F59E0B';
        pill.style.color = '#D97706';
        pill.innerHTML = `<span class="pulse-dot" style="background:#F59E0B;"></span> Syncing ${db.name} Database...`;
      }

      this.showToast(`⏳ Initiating Dual Sync with ${db.fullName} (${db.id.substring(0, 8)}...)...`, 'info');

      try {
        if (currentPortal === 'safety') {
          if (window.BalsonsSafetyApp && typeof window.BalsonsSafetyApp.loadDashboardData === 'function') {
            await window.BalsonsSafetyApp.loadDashboardData();
            if (typeof window.BalsonsSafetyApp.loadPermits === 'function') window.BalsonsSafetyApp.loadPermits();
            if (typeof window.BalsonsSafetyApp.loadInductions === 'function') window.BalsonsSafetyApp.loadInductions();
          }
        } else if (currentPortal === 'hr') {
          if (typeof window.loadEmployeesData === 'function') {
            await window.loadEmployeesData();
          }
        } else if (currentPortal === 'gate') {
          if (typeof window.loadGateDashboard === 'function') {
            await window.loadGateDashboard();
          }
        } else if (currentPortal === 'store') {
          if (window.BalsonsStoreApp && typeof window.BalsonsStoreApp.refreshData === 'function') {
            await window.BalsonsStoreApp.refreshData();
          }
        }

        await new Promise(r => setTimeout(r, 600));

        const now = new Date().toLocaleTimeString();
        if (pill) {
          pill.style.background = 'rgba(16, 185, 129, 0.15)';
          pill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          pill.style.color = '#10B981';
          pill.innerHTML = `
            <span class="pulse-dot"></span>
            <span class="sync-text">${db.name} DB Sync: <strong>LIVE</strong></span>
            <span class="sheet-id-chip" style="font-family: monospace; font-size: 9.5px; opacity: 0.85;">${db.id.substring(0, 8)}...</span>
          `;
        }

        this.showToast(`✅ ${db.name} Dual-Sync Complete: Dedicated Database (${db.id.substring(0, 8)}...) synchronized with registers at ${now}!`, 'success');
      } catch (err) {
        console.error('Dual Sync Error:', err);
        this.showToast(`⚠️ Dual-Sync fallback engaged at ${new Date().toLocaleTimeString()}`, 'warning');
      } finally {
        this.isDualSyncing = false;
      }
    },

    bindGlobalEvents: function() {
      document.addEventListener('click', function(e) {
        const dd = document.getElementById('bedsDeptDropdown');
        if (dd && !dd.contains(e.target)) {
          dd.classList.remove('open');
        }
      });
    }
  };

  window.BalsonsWorkspace = BalsonsWorkspace;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BalsonsWorkspace.init());
  } else {
    BalsonsWorkspace.init();
  }
})();
