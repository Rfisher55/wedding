// ============================================================
//  src/lib/sheets.js
//  Google Apps Script integration.
//
//  After deploying your Apps Script web app:
//    Extensions → Apps Script → Deploy → New deployment
//    Type: Web app | Execute as: Me | Access: Anyone
//  Paste the resulting URL into ENDPOINT below.
// ============================================================

export const ENDPOINT = 'PASTE_WEB_APP_URL_HERE';

// Write (RSVP or Guestbook) — uses text/plain to skip CORS preflight
export async function submitToSheet(payload) {
  if (!ENDPOINT || ENDPOINT === 'PASTE_WEB_APP_URL_HERE') return;
  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch {
    // A network error here is usually a CORS no-op; the row still lands.
  }
}

// Read guestbook entries via JSONP (avoids CORS on GET)
export function fetchGuestbook() {
  return new Promise((resolve, reject) => {
    if (!ENDPOINT || ENDPOINT === 'PASTE_WEB_APP_URL_HERE') {
      resolve([]);
      return;
    }
    const cb = 'gb_' + Date.now();
    const s  = document.createElement('script');
    window[cb] = (data) => { resolve(data); delete window[cb]; s.remove(); };
    s.onerror  = () => { reject(new Error('JSONP failed')); s.remove(); };
    s.src = `${ENDPOINT}?callback=${cb}`;
    document.body.appendChild(s);
  });
}
