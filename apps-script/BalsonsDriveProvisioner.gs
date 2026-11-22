/**
 * ============================================================================
 * BALSONS ENTERPRISE ECOSYSTEM - GOOGLE DRIVE STORAGE PROVISIONER
 * Company: BALSONS Heavy Lift & Shift | Project: JTRWF, Khordha, Odisha
 * Architecture: SAM-2026 (Tier 4 Restricted Evidence & Document Store)
 * Root Folder ID: 1p56Z_7_yHC5St8jsoadJnW7DJqJTIjde
 * ============================================================================
 */

const BALSONS_DRIVE_CONFIG = {
  ROOT_FOLDER_ID: '1p56Z_7_yHC5St8jsoadJnW7DJqJTIjde',
  ROOT_NAME: 'BALSONS ENTERPRISE MASTER STORAGE (JTRWF)',
  
  // Master Folder Structure Specification
  STRUCTURE: {
    '01_GATE_ENTRY_MANAGER': {
      '01_GATE_PASSES': [
        'RETURNABLE_GATE_PASSES_RGP',
        'NON_RETURNABLE_GATE_PASSES_NRGP',
        'VISITOR_AND_CONTRACTOR_PASSES'
      ],
      '02_MATERIAL_CHALLANS': [
        'INWARD_DELIVERY_CHALLANS',
        'OUTWARD_DISPATCH_CHALLANS'
      ],
      '03_VEHICLES_AND_DRIVERS': [
        'DRIVER_LICENSES_AND_KYC',
        'VEHICLE_FITNESS_AND_INSURANCE'
      ],
      '04_SECURITY_LOGS_AND_REPORTS': [
        'DAILY_MUSTER_REPORTS',
        'SECURITY_AUDIT_LOGS'
      ]
    },
    '02_HR_AND_PAYROLL_MANAGER': {
      '01_EMPLOYEE_KYC_DOSSIERS': [
        'AADHAAR_AND_PAN_CARDS',
        'BANK_AND_EPFO_ESIC_RECORDS'
      ],
      '02_STATUTORY_FITNESS_FORM31': [
        'MEDICAL_FITNESS_CERTIFICATES',
        'VERTIGO_AND_SPECIAL_CLEARANCES'
      ],
      '03_POLICE_VERIFICATION_PVC': [],
      '04_PAYROLL_AND_SALARY_SLIPS': [
        'MONTHLY_SALARY_SLIPS',
        'DAILY_WAGE_PAYOUT_VOUCHERS'
      ],
      '05_HR_LETTERS_AND_EXPENSES': [
        'APPOINTMENT_AND_INDUCTION',
        'STAFF_EXPENSE_VOUCHERS'
      ]
    },
    '03_OPERATIONS_AND_RIGGING_MANAGER': {
      '01_WORK_PACKAGE_DOSSIERS': [
        '360_COMPLETION_DOSSIERS',
        'RIGGING_PLANS_AND_LIFT_STUDIES'
      ],
      '02_DAILY_SHIFT_LOGS_DPR': [],
      '03_HOLDS_AND_DISCREPANCIES': [
        'HOLD_NOTICES_AND_RCAS',
        'ENGINEERING_DEVIATIONS'
      ],
      '04_CRANE_AND_SPMT_INSPECTIONS': [
        'CRANE_PRE_LIFT_CHECKLISTS',
        'SPMT_AXLE_LOAD_CALCULATIONS'
      ]
    },
    '04_PURCHASE_AND_COMMERCIAL_MANAGER': {
      '01_PURCHASE_REQUISITIONS_PR': [
        'TECHNICAL_REQUISITION_NOTES',
        'BOQ_AND_TECHNICAL_SPECS'
      ],
      '02_VENDOR_RFQS_AND_QUOTATIONS': [
        'TENDER_ENQUIRIES_AND_RFQS',
        'SUPPLIER_RATE_QUOTATIONS'
      ],
      '03_COMPARATIVE_STATEMENTS_CS': [],
      '04_PURCHASE_ORDERS_PO': [
        'FORMAL_SIGNED_POS',
        'WORK_ORDERS_AND_AMENDMENTS'
      ],
      '05_ADVANCE_SHIPPING_AND_GRN': [
        'ASN_DISPATCH_NOTICES',
        '3_WAY_MATCH_INSPECTION_CERTS'
      ],
      '06_COMMERCIAL_VOUCHERS_AND_INVOICES': [
        'ADVANCE_PAYMENT_VOUCHERS',
        'VENDOR_TAX_INVOICES'
      ]
    },
    '05_SAFETY_AND_RISK_MANAGER': {
      '01_PERMIT_TO_WORK_PTW': [
        'HOT_WORK_PERMITS',
        'HEIGHT_WORK_PERMITS',
        'CONFINED_SPACE_PERMITS',
        'HEAVY_TANDEM_LIFT_PTWS'
      ],
      '02_TOOLBOX_TALKS_TBT': [],
      '03_HIRA_JSA_RISK_ASSESSMENTS': [],
      '04_INCIDENT_AND_CAPA_REPORTS': [
        'NEAR_MISS_AND_INCIDENT_REPORTS',
        'CAPA_COMPLIANCE_EVIDENCES'
      ],
      '05_STATUTORY_HSE_AUDITS': []
    },
    '06_STORE_AND_TACKLE_MANAGER': {
      '01_FORM11_STATUTORY_CERTIFICATES': [
        'CRANE_TACKLE_FORM11_REPORTS',
        'WIRE_ROPE_AND_SLING_CERTIFICATES',
        'SHACKLE_AND_SPREADER_TEST_CERTS'
      ],
      '02_TOOL_AND_TACKLE_ISSUE_SLIPS': [],
      '03_TOOL_RETURN_AND_CUSTODY_VOUCHERS': [],
      '04_QUARANTINE_AND_REJECTIONS': [
        'QUARANTINE_TAGS_AND_RECORDS',
        'SCRAP_AND_DECOMMISSIONING'
      ],
      '05_CALIBRATION_NABL_RECORDS': [
        'TORQUE_AND_PRESSURE_CALIBRATIONS'
      ]
    },
    '07_EXECUTIVE_GOVERNANCE_AND_SYNC_HUB': {
      '01_EXECUTIVE_ECOSYSTEM_REPORTS': [],
      '02_CLIENT_AUDIT_PACKS': [],
      '03_CLOUD_DATABASE_BACKUPS': [
        'DAILY_SHEET_SNAPSHOTS',
        'DISASTER_RECOVERY_ARCHIVES'
      ],
      '04_GOVERNANCE_AUDIT_LOGS': []
    }
  }
};

/**
 * Main Provisioner Function: Run this function in Google Apps Script
 * Safe and idempotent: Skips folders that already exist, creates missing ones.
 */
function provisionBalsonsDrive() {
  const rootId = BALSONS_DRIVE_CONFIG.ROOT_FOLDER_ID;
  let rootFolder;
  
  try {
    rootFolder = DriveApp.getFolderById(rootId);
  } catch (e) {
    throw new Error('❌ Unable to access Root Google Drive Folder with ID [' + rootId + ']. Ensure permissions are granted. Error: ' + e.message);
  }
  
  Logger.log('🚀 Starting BALSONS Master Drive Provisioning under: ' + rootFolder.getName() + ' (' + rootId + ')');
  
  const folderMap = {
    _ROOT: { id: rootId, name: rootFolder.getName(), url: rootFolder.getUrl() }
  };
  
  const structure = BALSONS_DRIVE_CONFIG.STRUCTURE;
  let totalCreated = 0;
  let totalExisting = 0;
  
  for (const portalKey in structure) {
    const portalFolder = getOrCreateFolder(rootFolder, portalKey);
    if (portalFolder.wasCreated) totalCreated++; else totalExisting++;
    
    folderMap[portalKey] = {
      id: portalFolder.folder.getId(),
      name: portalKey,
      url: portalFolder.folder.getUrl(),
      subfolders: {}
    };
    
    const categories = structure[portalKey];
    for (const catKey in categories) {
      const catFolder = getOrCreateFolder(portalFolder.folder, catKey);
      if (catFolder.wasCreated) totalCreated++; else totalExisting++;
      
      folderMap[portalKey].subfolders[catKey] = {
        id: catFolder.folder.getId(),
        name: catKey,
        url: catFolder.folder.getUrl(),
        subfolders: {}
      };
      
      const subCats = categories[catKey];
      if (Array.isArray(subCats) && subCats.length > 0) {
        for (let i = 0; i < subCats.length; i++) {
          const subCatName = subCats[i];
          const subCatFolder = getOrCreateFolder(catFolder.folder, subCatName);
          if (subCatFolder.wasCreated) totalCreated++; else totalExisting++;
          
          folderMap[portalKey].subfolders[catKey].subfolders[subCatName] = {
            id: subCatFolder.folder.getId(),
            name: subCatName,
            url: subCatFolder.folder.getUrl()
          };
        }
      }
    }
  }
  
  Logger.log('================================================================');
  Logger.log('✔ BALSONS Drive Provisioning Complete!');
  Logger.log('📊 Summary: ' + totalCreated + ' folders created, ' + totalExisting + ' folders already existed.');
  Logger.log('================================================================');
  
  // Store the folder map in ScriptProperties for high-speed lookup across all portal scripts
  PropertiesService.getScriptProperties().setProperty('BALSONS_DRIVE_FOLDER_MAP', JSON.stringify(folderMap));
  
  return {
    success: true,
    rootFolderId: rootId,
    totalCreated: totalCreated,
    totalExisting: totalExisting,
    folderMap: folderMap
  };
}

/**
 * Helper: Find existing folder or create new folder
 */
function getOrCreateFolder(parentFolder, name) {
  const existing = parentFolder.getFoldersByName(name);
  if (existing.hasNext()) {
    return { folder: existing.next(), wasCreated: false };
  } else {
    const newFolder = parentFolder.createFolder(name);
    return { folder: newFolder, wasCreated: true };
  }
}

/**
 * Universal Document Uploader Helper
 * Called by portal services to save a document and return the direct Google Drive URL.
 * 
 * @param {string} portalCode - '01_GATE_ENTRY_MANAGER', '02_HR_AND_PAYROLL_MANAGER', etc.
 * @param {string} categoryCode - '01_GATE_PASSES', '04_PURCHASE_ORDERS_PO', etc.
 * @param {string} subCategory - 'RETURNABLE_GATE_PASSES_RGP', 'FORMAL_SIGNED_POS', etc.
 * @param {Blob} fileBlob - Google Apps Script Blob
 * @param {string} customFileName - Standardized name (e.g. PURCH_PO_PO-2026-0042_20261122.pdf)
 * @returns {Object} { success: true, fileId: string, url: string, downloadUrl: string }
 */
function savePortalDocument(portalCode, categoryCode, subCategory, fileBlob, customFileName) {
  const rootId = BALSONS_DRIVE_CONFIG.ROOT_FOLDER_ID;
  const rootFolder = DriveApp.getFolderById(rootId);
  
  const portal = getOrCreateFolder(rootFolder, portalCode).folder;
  const category = getOrCreateFolder(portal, categoryCode).folder;
  
  let targetFolder = category;
  if (subCategory) {
    targetFolder = getOrCreateFolder(category, subCategory).folder;
  }
  
  if (customFileName) {
    fileBlob.setName(customFileName);
  }
  
  const file = targetFolder.createFile(fileBlob);
  // Set view permissions
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return {
    success: true,
    fileId: file.getId(),
    fileName: file.getName(),
    folderId: targetFolder.getId(),
    url: file.getUrl(),
    downloadUrl: file.getDownloadUrl()
  };
}
