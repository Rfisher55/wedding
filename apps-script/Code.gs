// Google Apps Script — paste this into Extensions → Apps Script
// Set SHEET_ID to the ID from your Google Sheet URL, then deploy as a Web App.
// Execute as: Me | Access: Anyone
const SHEET_ID = 'PASTE_YOUR_SHEET_ID';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (data.type === 'rsvp') {
    ss.getSheetByName('RSVP').appendRow([
      new Date(), data.name, data.email, data.attending,
      data.guests, data.meal, data.notes,
    ]);
  } else if (data.type === 'guestbook') {
    ss.getSheetByName('Guestbook').appendRow([
      new Date(), data.name, data.message,
    ]);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const rows = ss.getSheetByName('Guestbook').getDataRange().getValues().slice(1);
  const notes = rows.map(r => ({ date: r[0], name: r[1], message: r[2] })).reverse();
  const json = JSON.stringify(notes);
  const cb = e.parameter.callback;
  return cb
    ? ContentService.createTextOutput(cb + '(' + json + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT)
    : ContentService.createTextOutput(json)
        .setMimeType(ContentService.MimeType.JSON);
}
