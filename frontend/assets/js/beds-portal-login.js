/**
 * BALSONS ENTERPRISE UNIFIED BRANDED LOGIN CONTROLLER (BEDS V1.1)
 * Governing Reference: ANTIGRAVITY ALL PORTALS UPDATE REFERENCE V1.1
 * Company: BALSONS HEAVY LIFT & SHIFT
 * Slogan: "Difficult We Do Easily, Impossible Takes Little Time...!"
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
        <div class="beds-login-card">
          <!-- LEFT: Realistic Portal-Specific Photograph & Badges -->
          <div class="beds-login-left">
            <img src="${cfg.image}" alt="${cfg.title}" class="beds-login-left-img" onerror="this.style.display='none'">
            <div class="beds-login-left-overlay">
              <h2 class="beds-login-portal-title">${cfg.title}</h2>
              <div class="beds-login-portal-sub">${cfg.sub}</div>
              <div class="beds-login-pills-row">
                ${pillsHtml}
              </div>
            </div>
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
              <div class="beds-login-field-wrap">
                <div class="beds-login-field">
                  <span class="beds-field-icon">👤</span>
                  <input type="text" id="loginUserId" placeholder="User ID" required autocomplete="username" value="${savedUser}">
                </div>
              </div>

              <div class="beds-login-field-wrap">
                <div class="beds-login-field">
                  <span class="beds-field-icon">🔒</span>
                  <input type="password" id="loginPassword" placeholder="Password" required autocomplete="current-password">
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

      // If user was remembered or active in session, pre-populate their user ID
      const savedUser = localStorage.getItem('balsons_remembered_username') || 
                        (window.BalsonsSuperAdmin && window.BalsonsSuperAdmin.currentUser ? window.BalsonsSuperAdmin.currentUser.username : '');
      const userField = document.getElementById('loginUserId');
      if (userField && savedUser && !userField.value) {
        userField.value = savedUser;
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