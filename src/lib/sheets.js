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

// Write (RSVP or Guestbook) — uses text/plain to skip CORS preflight.
// Returns true on send (or when not yet configured), false on a real network failure.
export async function submitToSheet(payload) {
  // Endpoint not configured yet: treat as a no-op success so the form works in
  // preview. NOTE: nothing is actually recorded until ENDPOINT is set.
  if (!ENDPOINT || ENDPOINT === 'PASTE_WEB_APP_URL_HERE') return true;
  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch {
    // The opaque-CORS success case resolves rather than throwing, so reaching
    // here means the request genuinely failed to send (offline / blocked).
    return false;
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
