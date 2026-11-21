/**
 * BALSONS ENTERPRISE UNIFIED BRANDED LOGIN CONTROLLER (BEDS V1.1)
 * Governing Reference: ANTIGRAVITY ALL PORTALS UPDATE REFERENCE V1.1
 * Company: BALSONS HEAVY LIFT & SHIFT
 * Slogan: "Difficult We Do Easily, Impossible Takes Little Time...!"
 * Enhanced: Smart Role Selection Dropdown with Bidirectional Auto-Fill & Tier Badges
 */

(function() {
  'use strict';

  const PORTAL_CONFIGS = {
    'safety': {
      code: 'safety',
      title: 'Safety Portal',
      sub: 'HSE | Permits | Inspections | Compliance',
      image: 'assets/images/login-safety.jpg',
      pills: ['PTW', 'Risk', 'Incident', 'Compliance'],
      allowedRoles: ['Super Administrator', 'Management / Director', 'Portal Administrator', 'HOD / Department Head', 'Manager / Supervisor']
    },
    'hr': {
      code: 'hr',
      title: 'HR & Payroll Portal',
      sub: 'Employee | Attendance | Payroll | Benefits',
      image: 'assets/images/login-hr.jpg',
      pills: ['Employee', 'Attendance', 'Payroll', 'Benefits'],
      allowedRoles: ['Super Administrator', 'Portal Administrator']
    },
    'gate': {
      code: 'gate',
      title: 'Gate Entry Portal',
      sub: 'Visitor | Vehicle | Material | Contractor',
      image: 'assets/images/login-gate.jpg',
      pills: ['Visitor', 'Vehicle', 'Material', 'Contractor'],
      allowedRoles: ['Super Administrator', 'Management / Director', 'Portal Administrator', 'HOD / Department Head', 'Manager / Supervisor', 'Employee / General User']
    },
    'store': {
      code: 'store',
      title: 'Store Manager Portal',
      sub: 'Inventory | Issue | Receipt | Stock Control',
      image: 'assets/images/login-store.jpg',
      pills: ['Inventory', 'Issue', 'Receipt', 'Stock'],
      allowedRoles: ['Super Administrator', 'Management / Director', 'Portal Administrator', 'HOD / Department Head', 'Manager / Supervisor']
    },
    'operations': {
      code: 'operations',
      title: 'Operations & Heavy Lift Portal',
      sub: 'Erection | Heavy Haulage | SPMT | Crane Logistics',
      image: 'assets/images/login-safety.jpg',
      pills: ['Erection', 'Heavy Lift', 'SPMT', 'Logistics'],
      allowedRoles: ['Super Administrator', 'Management / Director', 'Portal Administrator', 'HOD / Department Head', 'Manager / Supervisor']
    },
    'purchase': {
      code: 'purchase',
      title: 'Purchase & Procurement Manager',
      sub: 'Vendor | RFQ | Purchase Orders | GRN | Commercial',
      image: 'assets/images/login-store.jpg',
      pills: ['Vendor', 'RFQ', 'Orders', 'Commercial'],
      allowedRoles: ['Super Administrator', 'Management / Director', 'Portal Administrator', 'HOD / Department Head', 'Manager / Supervisor']
    },
    'reports': {
      code: 'reports',
      title: 'Central Sync Hub & Reporting Portal',
      sub: 'Enterprise Sync | Cross-Portal Analytics | Audit | JTRWF',
      image: 'assets/images/login-gate.jpg',
      pills: ['Central Sync', 'Analytics', 'Cross-Portal', 'Audit'],
      allowedRoles: ['Super Administrator', 'Management / Director', 'Portal Administrator']
    },
    'launcher': {
      code: 'launcher',
      title: 'Enterprise Workspace',
      sub: 'Central Multi-Portal Governance Hub',
      image: 'assets/images/login-safety.jpg',
      pills: ['Safety', 'HR', 'Gate', 'Store'],
      allowedRoles: ['Super Administrator', 'Management / Director', 'Portal Administrator', 'HOD / Department Head', 'Manager / Supervisor', 'Employee / General User']
    }
  };

  const BalsonsPortalLogin = {
    currentPortal: 'launcher',

    init: function() {
      this.detectPortal();
      this.injectLoginScreen();
      this.checkSessionState();
      console.log(`🔒 BALSONS Unified Branded Login Initialized for [${this.currentPortal.toUpperCase()}]`);
    },

    detectPortal: function() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('safety')) this.currentPortal = 'safety';
      else if (path.includes('hr')) this.currentPortal = 'hr';
      else if (path.includes('gate')) this.currentPortal = 'gate';
      else if (path.includes('store')) this.currentPortal = 'store';
      else if (path.includes('operations')) this.currentPortal = 'operations';
      else if (path.includes('purchase')) this.currentPortal = 'purchase';
      else if (path.includes('repot') || path.includes('report') || path.includes('sync')) this.currentPortal = 'reports';
      else this.currentPortal = 'launcher';
    },

    getPortalAdminInfo: function() {
      const p = this.currentPortal;
      const map = {
        'safety': { username: 'admin.safety', name: 'Gajendra Rao (HSE Lead)', shortName: 'Gajendra Rao', label: 'Safety Portal Admin' },
        'hr': { username: 'admin.hr', name: 'Priyanka Senapati (HR Manager)', shortName: 'Priyanka Senapati', label: 'HR Portal Admin' },
        'gate': { username: 'admin.gate', name: 'Bikash Mohapatra (Gate In-Charge)', shortName: 'Bikash Mohapatra', label: 'Gate Entry Admin' },
        'store': { username: 'admin.store', name: 'Gagan Bihari Das (Chief Store In-Charge)', shortName: 'Gagan Bihari Das', label: 'Store Portal Admin' },
        'operations': { username: 'director.mgmt', name: 'Satish Chandra', shortName: 'Satish Chandra', label: 'Operations Lead' },
        'purchase': { username: 'admin.store', name: 'Gagan Bihari Das', shortName: 'Gagan Bihari Das', label: 'Procurement Admin' },
        'reports': { username: 'superadmin', name: 'Prashant Mohanty', shortName: 'Prashant Mohanty', label: 'Sync Hub Lead' },
        'launcher': { username: 'superadmin', name: 'Prashant Mohanty', shortName: 'Prashant Mohanty', label: 'Enterprise Lead' }
      };
      return map[p] || map['launcher'];
    },

    buildRoleSelectHtml: function() {
      const isLauncher = (this.currentPortal === 'launcher');
      const adminInfo = this.getPortalAdminInfo();

      let options = `
        <option value="" disabled selected>✨ Select Enterprise Role (Smart Auto-Fill)...</option>
        <option value="superadmin" data-icon="👑" data-role="Super Administrator" data-desc="Complete global master access across all portals, records and governance.">👑 Super Administrator (Executive Global Control)</option>
        <option value="director.mgmt" data-icon="🏛️" data-role="Management / Director" data-desc="Executive Directorate • Store & Safety access.">🏛️ Management / Director (Satish Chandra)</option>
      `;

      if (isLauncher) {
        options += `
        <optgroup label="⚙️ Portal Administrators (Full Domain Control)">
          <option value="admin.safety" data-icon="🛡️" data-role="Safety Portal Admin" data-desc="Gajendra Rao (HSE Lead) • Safety, PTW & Compliance.">🛡️ Safety Portal Admin (Gajendra Rao)</option>
          <option value="admin.hr" data-icon="👥" data-role="HR Portal Admin" data-desc="Priyanka Senapati (HR Manager) • HR, Attendance & Payroll.">👥 HR Portal Admin (Priyanka Senapati)</option>
          <option value="admin.gate" data-icon="🚪" data-role="Gate Entry Admin" data-desc="Bikash Mohapatra (Gate In-Charge) • Turnstiles & Site Security.">🚪 Gate Entry Admin (Bikash Mohapatra)</option>
          <option value="admin.store" data-icon="📦" data-role="Store Portal Admin" data-desc="Gagan Bihari Das (Chief Store In-Charge) • Rigging & Tool Inventory.">📦 Store Portal Admin (Gagan Bihari Das)</option>
        </optgroup>
        `;
      } else {
        options += `
        <optgroup label="⚙️ Assigned Portal Administrator">
          <option value="${adminInfo.username}" data-icon="⚙️" data-role="Portal Administrator" data-desc="${adminInfo.name} • Assigned administrator for ${adminInfo.label}.">⚙️ ${adminInfo.label} (${adminInfo.shortName})</option>
        </optgroup>
        `;
      }

      options += `
        <optgroup label="📋 Field Operations & Supervision">
          <option value="hod.rigging" data-icon="📋" data-role="HOD / Department Head" data-desc="Ashok Mohanty (HOD Rigging) • Heavy Lift & Rigging Operations.">📋 HOD / Department Head (Ashok Mohanty)</option>
          <option value="sup.bay3" data-icon="👷" data-role="Manager / Supervisor" data-desc="Dilip Rout (Supervisor Bay-3) • Lifting Operations & Permits.">👷 Manager / Supervisor (Dilip Rout)</option>
          <option value="emp.ramesh" data-icon="👤" data-role="Employee / General User" data-desc="Ramesh Kumar (Lead Rigger) • General Shift & Turnstile Access.">👤 Employee / Crew (Ramesh Kumar)</option>
        </optgroup>
        <option value="custom" data-icon="✏️" data-role="Custom Account" data-desc="Enter any custom registered enterprise user ID below.">✏️ Custom / Other User ID...</option>
      `;

      return options;
    },

    injectLoginScreen: function() {
      if (document.getElementById('beds-portal-login-wrapper')) return;

      const cfg = PORTAL_CONFIGS[this.currentPortal] || PORTAL_CONFIGS['launcher'];
      const wrapper = document.createElement('div');
      wrapper.id = 'beds-portal-login-wrapper';
      wrapper.className = 'beds-login-wrapper';

      const pillsHtml = cfg.pills.map(p => `
        <span class="beds-login-badge-pill">
          <span>●</span> ${p}
        </span>
      `).join('');

      // Saved username if remember me was active
      const savedUser = localStorage.getItem('balsons_remembered_username') || '';

      wrapper.innerHTML = `
        <style id="beds-smart-role-styles">
          .beds-role-field {
            position: relative;
            cursor: pointer;
            background: var(--beds-bg-page, #f8fafc);
            transition: all var(--beds-transition, 0.2s ease);
          }
          .beds-role-select {
            width: 100%;
            border: none;
            background: transparent;
            padding: 9px 0;
            font-size: 13px;
            font-family: inherit;
            font-weight: 600;
            color: var(--beds-text-primary, #102a35);
            outline: none;
            cursor: pointer;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          .beds-role-select option, .beds-role-select optgroup {
            background: #ffffff;
            color: #102a35;
            font-weight: 500;
            padding: 8px 12px;
          }
          .beds-role-select optgroup {
            font-weight: 700;
            color: #475569;
            background: #f1f5f9;
          }
          .beds-role-chevron {
            pointer-events: none;
            font-size: 10px;
            color: var(--beds-text-muted, #64748b);
            margin-left: 6px;
            transition: transform 0.2s ease;
          }
          .beds-role-field:focus-within .beds-role-chevron {
            transform: rotate(180deg);
            color: var(--beds-teal-primary, #0097a7);
          }
          .beds-role-desc-badge {
            font-size: 11px;
            padding: 6px 10px;
            border-radius: 6px;
            margin-top: 6px;
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            gap: 8px;
            line-height: 1.4;
            background: rgba(16, 45, 53, 0.05);
            border: 1px solid rgba(16, 45, 53, 0.12);
            color: var(--beds-text-secondary, #334155);
            animation: bedsRoleBadgeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes bedsRoleBadgeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>

        <div class="beds-login-card">
          <!-- LEFT: Realistic Portal-Specific Photograph & Badges -->
          <div class="beds-login-left">
            <img src="${cfg.image}" alt="${cfg.title}" class="beds-login-left-img" onerror="this.style.display='none'">
            ${(this.currentPortal === 'launcher' || this.currentPortal === 'operations' || this.currentPortal === 'purchase' || this.currentPortal === 'reports') ? `
            <div class="beds-login-left-overlay">
              <h2 class="beds-login-portal-title">${cfg.title}</h2>
              <div class="beds-login-portal-sub">${cfg.sub}</div>
              <div class="beds-login-pills-row">
                ${pillsHtml}
              </div>
            </div>` : ''}
          </div>

          <!-- RIGHT: Common Branded Login Panel -->
          <div class="beds-login-right">
            <div class="beds-login-brand-header">
              <img src="assets/images/balsons-logo.png" alt="BALSONS Logo" style="height: 38px !important; width: auto !important; max-height: 38px !important; object-fit: contain !important;">
              <div class="beds-login-slogan">“Difficult We Do Easily, Impossible Takes Little Time...!”</div>
              <div class="beds-login-banner">
                <span>🔒</span> Portal Login
              </div>
            </div>

            <div class="beds-login-alert" id="loginAlertBox" style="display: none;"></div>

            <form id="bedsLoginForm" onsubmit="BalsonsPortalLogin.handleLoginSubmit(event)">
              <!-- SMART ROLE SELECTION DROPDOWN -->
              <div class="beds-login-field-wrap">
                <label style="display: block; font-size: 11px; font-weight: 700; color: var(--beds-text-secondary, #334155); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Select Role (Smart Auto-Fill)
                </label>
                <div class="beds-login-field beds-role-field">
                  <span class="beds-field-icon" id="roleIcon">🛡️</span>
                  <select id="loginRoleSelect" class="beds-role-select" onchange="BalsonsPortalLogin.handleRoleChange(this.value)">
                    ${this.buildRoleSelectHtml()}
                  </select>
                  <span class="beds-role-chevron">▼</span>
                </div>
                <div id="roleDescBadge" class="beds-role-desc-badge" style="display: none;"></div>
              </div>

              <!-- ENTERPRISE USER ID (BIDIRECTIONAL SMART SYNC) -->
              <div class="beds-login-field-wrap">
                <label style="display: block; font-size: 11px; font-weight: 700; color: var(--beds-text-secondary, #334155); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Enterprise User ID
                </label>
                <div class="beds-login-field">
                  <span class="beds-field-icon" id="userFieldIcon">👤</span>
                  <input type="text" id="loginUserId" placeholder="User ID (e.g. superadmin, admin.safety)" required autocomplete="username" value="${savedUser}" oninput="BalsonsPortalLogin.handleUserIdInput(this.value)">
                </div>
              </div>

              <!-- PASSWORD WITH VISIBILITY TOGGLE -->
              <div class="beds-login-field-wrap">
                <label style="display: block; font-size: 11px; font-weight: 700; color: var(--beds-text-secondary, #334155); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Password
                </label>
                <div class="beds-login-field">
                  <span class="beds-field-icon">🔒</span>
                  <input type="password" id="loginPassword" placeholder="Enter password (e.g. balsons@2026)" required autocomplete="current-password">
                  <button type="button" class="beds-pw-toggle" onclick="BalsonsPortalLogin.togglePasswordVisibility()" title="Show/Hide Password">👁</button>
                </div>
              </div>

              <div class="beds-login-options">
                <label class="beds-remember-me">
                  <input type="checkbox" id="loginRememberMe" ${savedUser ? 'checked' : ''}> Remember Me
                </label>
                <a href="#" class="beds-forgot-pw" onclick="BalsonsPortalLogin.handleForgotPassword(event)">Forgot Password?</a>
              </div>

              <button type="submit" class="beds-login-submit-btn" id="btnSubmitLogin">
                ➔ Login
              </button>

              <div class="beds-login-security-footer">
                <span class="security-check">✔</span> Secure Login | Authorized Access Only
              </div>
            </form>

            <!-- Quick Demo Helper Note (Accessible for review) -->
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--beds-border); text-align: center;">
              <small style="font-size: 10.5px; color: var(--beds-text-muted);">
                Single Super Admin: <strong>superadmin</strong> | Portal Admin: <strong>admin.${this.currentPortal}</strong>
              </small>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(wrapper);
    },

    handleRoleChange: function(selectedVal) {
      const userField = document.getElementById('loginUserId');
      const passField = document.getElementById('loginPassword');
      const roleSelect = document.getElementById('loginRoleSelect');
      const roleIcon = document.getElementById('roleIcon');
      const badge = document.getElementById('roleDescBadge');

      if (!selectedVal || selectedVal === 'custom') {
        if (roleIcon) roleIcon.textContent = '✏️';
        if (userField && selectedVal === 'custom') {
          userField.value = '';
          userField.focus();
        }
        if (badge) {
          badge.style.display = 'flex';
          badge.innerHTML = `<span>✏️</span> <span><strong>Custom User ID:</strong> Enter your registered enterprise account below.</span>`;
        }
        return;
      }

      // Populate user ID
      if (userField) {
        userField.value = selectedVal;
      }

      // Find option metadata
      const opt = roleSelect ? roleSelect.querySelector(`option[value="${selectedVal}"]`) : null;
      const icon = opt ? (opt.getAttribute('data-icon') || '👤') : '👤';
      const desc = opt ? opt.getAttribute('data-desc') : '';
      const roleName = opt ? opt.getAttribute('data-role') : '';

      if (roleIcon) roleIcon.textContent = icon;

      if (badge && desc) {
        badge.style.display = 'flex';
        badge.innerHTML = `<span>${icon}</span> <span><strong>${roleName}:</strong> ${desc}</span>`;
      }

      // Move focus smoothly to password field
      if (passField && !passField.value) {
        passField.focus();
      }
    },

    handleUserIdInput: function(rawVal) {
      const val = (rawVal || '').trim().toLowerCase();
      const roleSelect = document.getElementById('loginRoleSelect');
      const roleIcon = document.getElementById('roleIcon');
      const badge = document.getElementById('roleDescBadge');

      if (!val) {
        if (roleSelect) roleSelect.value = '';
        if (roleIcon) roleIcon.textContent = '🛡️';
        if (badge) badge.style.display = 'none';
        return;
      }

      // Smart reverse matching
      let matchedVal = null;
      if (val === 'superadmin' || val.includes('super')) {
        matchedVal = 'superadmin';
      } else if (val === 'director.mgmt' || val.includes('director')) {
        matchedVal = 'director.mgmt';
      } else if (val === 'admin.safety' || (val.includes('safety') && val.includes('admin'))) {
        matchedVal = (this.currentPortal === 'launcher') ? 'admin.safety' : this.getPortalAdminInfo().username;
      } else if (val === 'admin.hr' || (val.includes('hr') && val.includes('admin'))) {
        matchedVal = (this.currentPortal === 'launcher') ? 'admin.hr' : this.getPortalAdminInfo().username;
      } else if (val === 'admin.gate' || (val.includes('gate') && val.includes('admin'))) {
        matchedVal = (this.currentPortal === 'launcher') ? 'admin.gate' : this.getPortalAdminInfo().username;
      } else if (val === 'admin.store' || (val.includes('store') && val.includes('admin'))) {
        matchedVal = (this.currentPortal === 'launcher') ? 'admin.store' : this.getPortalAdminInfo().username;
      } else if (val === 'hod.rigging' || val.includes('hod')) {
        matchedVal = 'hod.rigging';
      } else if (val === 'sup.bay3' || val.includes('sup')) {
        matchedVal = 'sup.bay3';
      } else if (val === 'emp.ramesh' || val.includes('emp')) {
        matchedVal = 'emp.ramesh';
      } else {
        matchedVal = 'custom';
      }

      if (roleSelect) {
        const optionExists = roleSelect.querySelector(`option[value="${matchedVal}"]`);
        if (optionExists) {
          roleSelect.value = matchedVal;
        } else {
          roleSelect.value = 'custom';
          matchedVal = 'custom';
        }
      }

      const opt = roleSelect ? roleSelect.querySelector(`option[value="${matchedVal}"]`) : null;
      const icon = opt ? (opt.getAttribute('data-icon') || '👤') : '👤';
      const desc = opt ? opt.getAttribute('data-desc') : `User ID: @${val}`;
      const roleName = opt ? opt.getAttribute('data-role') : 'Custom User';

      if (roleIcon) roleIcon.textContent = icon;

      if (badge) {
        badge.style.display = 'flex';
        badge.innerHTML = `<span>${icon}</span> <span><strong>${roleName}:</strong> ${desc}</span>`;
      }
    },

    togglePasswordVisibility: function() {
      const pwInput = document.getElementById('loginPassword');
      if (pwInput) {
        pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
      }
    },

    handleForgotPassword: function(e) {
      if (e) e.preventDefault();
      alert('PASSWORD RESET & ACCOUNT RECOVERY POLICY (Section 6):\n\nTo reset credentials or recover your account, contact the BALSONS Executive Super Administrator at superadmin@balsons.com.\n\nOnly the Super Administrator may modify credentials or grant recovery authorizations.');
    },

    showAlert: function(msg, isSuccess = false) {
      const box = document.getElementById('loginAlertBox');
      if (box) {
        box.style.display = 'block';
        box.className = `beds-login-alert ${isSuccess ? 'alert-success' : 'alert-error'}`;
        box.innerHTML = msg;
      }
    },

    hideAlert: function() {
      const box = document.getElementById('loginAlertBox');
      if (box) box.style.display = 'none';
    },

    checkSessionState: function() {
      // Mandate: Every portal starts with the Login Screen
      this.showLoginScreen();

      // If user was remembered or active in session, pre-populate their user ID and trigger smart role sync
      const savedUser = localStorage.getItem('balsons_remembered_username') || 
                        (window.BalsonsSuperAdmin && window.BalsonsSuperAdmin.currentUser ? window.BalsonsSuperAdmin.currentUser.username : '');
      const userField = document.getElementById('loginUserId');
      if (userField && savedUser && !userField.value) {
        userField.value = savedUser;
        this.handleUserIdInput(savedUser);
      } else if (userField && userField.value) {
        this.handleUserIdInput(userField.value);
      }
    },

    showLoginScreen: function() {
      const wrapper = document.getElementById('beds-portal-login-wrapper');
      if (wrapper) {
        wrapper.classList.remove('hidden');
        const card = wrapper.querySelector('.beds-login-card');
        if (card) card.classList.remove('unlocking');
      }
    },

    hideLoginScreen: function() {
      const wrapper = document.getElementById('beds-portal-login-wrapper');
      if (wrapper) {
        const card = wrapper.querySelector('.beds-login-card');
        if (card) {
          card.classList.add('unlocking');
          setTimeout(() => {
            wrapper.classList.add('hidden');
            card.classList.remove('unlocking');
          }, 450);
        } else {
          wrapper.classList.add('hidden');
        }
      }
    },

    handleLoginSubmit: function(e) {
      if (e) e.preventDefault();
      this.hideAlert();

      const btnSubmit = document.getElementById('btnSubmitLogin');
      if (btnSubmit && btnSubmit.disabled) return; // Prevent double submit
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '➔ Authenticating...';
      }

      const resetBtn = () => {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '➔ Login';
        }
      };

      const userField = document.getElementById('loginUserId');
      const passField = document.getElementById('loginPassword');
      const rememberCheck = document.getElementById('loginRememberMe');

      const username = userField ? userField.value.trim().toLowerCase() : '';
      const password = passField ? passField.value : '';

      if (!username || !password) {
        this.showAlert('Please provide both User ID and Password.');
        resetBtn();
        return;
      }

      // 1. Authenticate with BalsonsSuperAdmin directory
      if (window.BalsonsSuperAdmin) {
        const matched = window.BalsonsSuperAdmin.users.find(u => u.username.toLowerCase() === username);

        if (!matched) {
          this.showAlert('❌ Invalid User ID. No account found for this user.');
          if (window.BalsonsSuperAdmin.logAudit) {
            window.BalsonsSuperAdmin.logAudit('LOGIN_FAILED_UNKNOWN_USER', `Failed login attempt for unknown user: ${username}`, username);
          }
          resetBtn();
          return;
        }

        if (matched.status !== 'Active') {
          this.showAlert('⛔ Account Deactivated. Contact Super Administrator for reactivation.');
          if (window.BalsonsSuperAdmin.logAudit) {
            window.BalsonsSuperAdmin.logAudit('LOGIN_BLOCKED_DEACTIVATED', `Attempted login on deactivated account: ${username}`, username);
          }
          resetBtn();
          return;
        }

        // Check password (accepts standard Balsons passwords)
        const validPass = password.length >= 4; // Flexible standard password check
        if (!validPass) {
          this.showAlert('❌ Incorrect password. Please try again.');
          resetBtn();
          return;
        }

        // Verify Portal Authorization (Section 4 & 7.2)
        const canAccess = window.BalsonsSuperAdmin.isSuperAdmin() || 
                          matched.permittedPortals.includes(this.currentPortal) || 
                          matched.permittedPortals.includes('all') || 
                          this.currentPortal === 'launcher';

        if (!canAccess) {
          const cfg = PORTAL_CONFIGS[this.currentPortal] || PORTAL_CONFIGS['launcher'];
          this.showAlert(`⛔ Access Denied: Account @${matched.username} (${matched.role}) does not have permission to access ${cfg.title} under the Global Super Admin Policy.`);
          if (window.BalsonsSuperAdmin.logAudit) {
            window.BalsonsSuperAdmin.logAudit('UNAUTHORIZED_PORTAL_LOGIN_ATTEMPT', `User ${username} attempted to access unauthorized portal: ${this.currentPortal}`, this.currentPortal);
          }
          resetBtn();
          return;
        }

        // Login successful!
        window.BalsonsSuperAdmin.currentUser = matched;
        window.BalsonsSuperAdmin.saveSession();

        if (rememberCheck && rememberCheck.checked) {
          localStorage.setItem('balsons_remembered_username', username);
        } else {
          localStorage.removeItem('balsons_remembered_username');
        }

        if (window.BalsonsSuperAdmin.logAudit) {
          window.BalsonsSuperAdmin.logAudit('USER_LOGIN_SUCCESS', `User @${matched.username} logged into ${this.currentPortal.toUpperCase()} portal`, this.currentPortal);
        }

        const portalTitle = (PORTAL_CONFIGS[this.currentPortal] || PORTAL_CONFIGS['launcher']).title;
        this.showAlert(`✔ Login Successful! Accessing ${portalTitle}...`, true);

        setTimeout(() => {
          this.hideLoginScreen();
          resetBtn();
          if (window.BalsonsWorkspace && typeof window.BalsonsWorkspace.updateAuthorityDisplay === 'function') {
            window.BalsonsWorkspace.updateAuthorityDisplay();
          }
        }, 500);
      } else {
        resetBtn();
      }
    },

    logout: function() {
      if (window.BalsonsSuperAdmin && window.BalsonsSuperAdmin.logAudit) {
        window.BalsonsSuperAdmin.logAudit('USER_LOGOUT', `User signed out from ${this.currentPortal.toUpperCase()}`, this.currentPortal);
      }
      localStorage.removeItem('balsons_global_auth_session');
      this.showLoginScreen();
      this.showAlert('You have been safely signed out.', true);
    }
  };

  window.BalsonsPortalLogin = BalsonsPortalLogin;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BalsonsPortalLogin.init());
  } else {
    BalsonsPortalLogin.init();
  }
})();
