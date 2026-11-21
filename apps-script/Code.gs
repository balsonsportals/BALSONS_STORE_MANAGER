/**
 * BALSONS STORE MANAGER - MASTER API CONTROLLER
 * Google Apps Script Web App Gateway
 * Architecture: BALSONS-SAM-2026 (Locked Baseline)
 * Dedicated Project Spreadsheet: 1u_ZKvvCVfEQDAtkoMR68q2d2hEK-eWBnvsS3AGfP6yQ
 * Project: Jupiter Tatravagonka Railwheel Factory (JTRWF), Khordha, Odisha
 */

var STORE_CONFIG = {
  PROJECT_ID: 'PRJ-JTRWF-SCHULER',
  PORTAL_NAME: 'BALSONS Store & Heavy Rigging Inventory Manager',
  VERSION: '1.0.0-store-sam2026',
  ENV: 'production',
  DEFAULT_SPREADSHEET_ID: '1u_ZKvvCVfEQDAtkoMR68q2d2hEK-eWBnvsS3AGfP6yQ',

  getSpreadsheetId: function() {
    return PropertiesService.getScriptProperties().getProperty('STORE_SPREADSHEET_ID') || this.DEFAULT_SPREADSHEET_ID;
  }
};

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'health';
  var section = (e && e.parameter && e.parameter.section) ? e.parameter.section : 'ALL';

  var responseData = {};

  try {
    switch (action) {
      case 'health':
        responseData = {
          success: true,
          status: 200,
          system: STORE_CONFIG.PORTAL_NAME,
          version: STORE_CONFIG.VERSION,
          project: STORE_CONFIG.PROJECT_ID,
          spreadsheetId: STORE_CONFIG.getSpreadsheetId(),
          timestamp: new Date().toISOString(),
          statusMessage: 'BALSONS Store Manager Dedicated API Gateway Operational'
        };
        break;

      case 'initDb':
        responseData = { success: false, error: 'ROUTE_DISABLED', message: 'Legacy database initialization via GET is disabled for security.' };
        break;

      case 'inventory':
        responseData = { success: true, count: 0, items: StoreService.getInventory(section) };
        responseData.count = responseData.items.length;
        break;

      case 'form11':
        responseData = { success: true, count: 0, items: StoreService.getForm11Register() };
        responseData.count = responseData.items.length;
        break;

      case 'loans':
        responseData = { success: true, count: 0, items: StoreService.getLoans() };
        responseData.count = responseData.items.length;
        break;

      case 'quarantine':
        responseData = { success: true, count: 0, items: StoreService.getQuarantine() };
        responseData.count = responseData.items.length;
        break;

      case 'receipts':
        responseData = { success: true, count: 0, items: StoreService.getReceipts() };
        responseData.count = responseData.items.length;
        break;

      case 'radar':
      case 'stats':
        var allTools = StoreService.getInventory('ALL');
        var avail = 0, issued = 0, quar = 0;
        allTools.forEach(function(t) {
          if (t.status === 'AVAILABLE') avail++;
          else if (t.status === 'ISSUED') issued++;
          else if (t.status === 'QUARANTINED') quar++;
        });
        responseData = {
          success: true,
          stats: {
            totalTools: allTools.length,
            available: avail,
            issued: issued,
            quarantined: quar,
            form11Items: 53
          }
        };
        break;

      default:
        responseData = {
          success: false,
          error: 'UNKNOWN_ACTION',
          message: 'Action ' + action + ' is not recognized.'
        };
    }
  } catch (err) {
    responseData = {
      success: false,
      error: 'SERVER_ERROR',
      message: err.message
    };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var request = {};
  try {
    if (e && e.postData && e.postData.contents) {
      request = JSON.parse(e.postData.contents);
    }
  } catch (parseErr) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'INVALID_JSON_BODY',
      message: parseErr.message
    })).setMimeType(ContentService.MimeType.JSON);
  }

  var action = request.action || 'ping';
  var payload = request.payload || {};
  var responseData = {};

  try {
    switch (action) {
      case 'ping':
        responseData = { success: true, message: 'BALSONS Store Gateway Active' };
        break;

      case 'db.init':
      case 'loans.issue':
      case 'loans.return':
      case 'quarantine.tag':
        responseData = {
          success: false,
          error: 'ENDPOINT_DECOMMISSIONED',
          message: 'Store Manager operates under an offline-first, zero-server IndexedDB architecture (Sections 4 & 16). Public Apps Script mutation endpoints are decommissioned.'
        };
        break;

      default:
        responseData = { success: false, error: 'UNKNOWN_POST_ACTION', message: 'Action ' + action + ' not supported' };
    }
  } catch (err) {
    responseData = { success: false, error: 'EXECUTION_ERROR', message: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}
