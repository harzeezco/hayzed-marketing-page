// Deploy this as a Google Apps Script web app that runs as you.
// Set Script Properties HAYZED_SPREADSHEET_ID and HAYZED_SHARED_SECRET first.
// The Sheet must stay private; only the Hayzed server calls this receiver.

const TAB_NAME = 'Early access';
const HEADERS = [
  'Submitted at (UTC)', 'Name', 'Email', 'WhatsApp number',
  'Area in Lagos', 'Looking to buy', 'Shopping difficulty',
  'Consent', 'Consent version', 'Source'
];

function reply_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function text_(value, max) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= max ? trimmed : null;
}

function safeCell_(value) {
  const plain = String(value).replace(/[\r\n\t]+/g, ' ').trim();
  // appendRow treats leading = as a formula; keep customer input as text.
  return /^[=+\-@]/.test(plain) ? "'" + plain : plain;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    const secret = props.getProperty('HAYZED_SHARED_SECRET');
    const spreadsheetId = props.getProperty('HAYZED_SPREADSHEET_ID');
    if (!secret || !spreadsheetId || data.secret !== secret) return reply_({ ok: false });
    const name = text_(data.name, 180);
    const email = text_(data.email, 180);
    const phone = text_(data.phone, 24);
    const location = text_(data.location, 180);
    const product = text_(data.product, 180);
    const challenge = data.challenge ? text_(data.challenge, 2000) : '';
    if (
      data.kind !== 'buyer' || data.consent !== true ||
      data.consentVersion !== '2026-10-v1' ||
      !name || !email || !phone || !location || !product || challenge === null
    ) return reply_({ ok: false });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = spreadsheet.getSheetByName(TAB_NAME) || spreadsheet.insertSheet(TAB_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      }
      sheet.appendRow([
        safeCell_(data.submittedAt || new Date().toISOString()),
        safeCell_(name), safeCell_(email), safeCell_(phone),
        safeCell_(location), safeCell_(product), safeCell_(challenge),
        'Yes', safeCell_(data.consentVersion), 'hayzed-landing'
      ]);
      SpreadsheetApp.flush();
      return reply_({ ok: true });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error('Hayzed submission failed', error);
    return reply_({ ok: false });
  }
}
