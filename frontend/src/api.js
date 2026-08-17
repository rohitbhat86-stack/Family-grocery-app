// Where the backend lives.
//
// Dev:  REACT_APP_API_URL is unset, so requests stay relative ("/api/...") and
//       CRA's "proxy" field in package.json forwards them to the local backend.
// Prod: the built bundle is served from a static host that has no /api routes, so
//       REACT_APP_API_URL must be set at BUILD time to the backend's origin.
//       CRA inlines REACT_APP_* at build time — setting it only at runtime does nothing.
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export async function getJSON(path) {
  const response = await fetch(apiUrl(path)).catch(() => {
    throw new Error(unreachableMessage());
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || `Request failed (${response.status})`);
  }
  return payload;
}

export async function putJSON(path, body) {
  return sendJSON('PUT', path, body);
}

export async function postJSON(path, body) {
  return sendJSON('POST', path, body);
}

function unreachableMessage() {
  return API_BASE
    ? `Could not reach the backend at ${API_BASE}.`
    : 'Could not reach the backend. Is it running on port 5050?';
}

// The unlocked passcode lives in sessionStorage, so it survives tab switches and
// reloads but is gone once the browser tab closes.
const PASSCODE_KEY = 'adminPasscode';

export const getPasscode = () => sessionStorage.getItem(PASSCODE_KEY) || '';
export const setPasscode = (code) => sessionStorage.setItem(PASSCODE_KEY, code);
export const clearPasscode = () => sessionStorage.removeItem(PASSCODE_KEY);

async function sendJSON(method, path, body) {
  let response;
  try {
    const headers = { 'Content-Type': 'application/json' };
    const passcode = getPasscode();
    if (passcode) headers['X-Admin-Passcode'] = passcode;

    response = await fetch(apiUrl(path), {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new Error(unreachableMessage());
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Surface the server's own message; it explains a missing API key, a bad
    // model call, etc. far better than a generic failure string.
    throw new Error(payload.detail || payload.error || `Request failed (${response.status})`);
  }

  return payload;
}
