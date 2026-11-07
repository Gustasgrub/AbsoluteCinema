/*
 * Vienintelė vieta, kur frontend kalbasi su API.
 *
 *  - access žetonas laikomas TIK atmintyje (kintamajame), ne localStorage → XSS negali jo pavogti iš saugyklos;
 *  - refresh žetonas yra HttpOnly slapuke – JavaScript jo nemato, naršyklė jį siunčia pati;
 *  - gavus 401 (access žetonas pasibaigė) – automatiškai kviečiame /auth/refresh ir pakartojame užklausą.
 */

export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

let accessToken = null;
let refreshing = null; // kad vienu metu vyktų tik viena refresh užklausa
let onSessionChange = () => {};

// Žymė (ne žetonas!), kad šioje naršyklėje buvo prisijungta – tik tada verta kviesti /auth/refresh
const SESSION_HINT = 'ac_has_session';

function rememberSession(active) {
  try {
    if (active) localStorage.setItem(SESSION_HINT, '1');
    else localStorage.removeItem(SESSION_HINT);
  } catch {
    // privatus režimas ar išjungta saugykla – tiesiog nieko nedarome
  }
}

export function mightHaveSession() {
  try {
    return localStorage.getItem(SESSION_HINT) === '1';
  } catch {
    return true;
  }
}

// API klaida su HTTP statusu ir laukų klaidomis (422)
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.detail || body?.message || `Request failed (${status})`);
    this.status = status;
    this.errors = body?.errors || {};
  }
}

// AuthContext užsiregistruoja, kad sužinotų apie prisijungimą / atsijungimą
export function setSessionListener(listener) {
  onSessionChange = listener;
}

export function startSession(tokenResponse) {
  accessToken = tokenResponse.access_token;
  rememberSession(true);
  onSessionChange(tokenResponse);
}

export function endSession() {
  accessToken = null;
  rememberSession(false);
  onSessionChange(null);
}

// Iššifruojame JWT vidurinę dalį (payload). Parašo čia netikriname – tai daro serveris.
export function tokenClaims() {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// Naujas access žetonas pagal refresh slapuką
export function refreshSession() {
  refreshing ??= fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      if (!response.ok) {
        endSession();
        return null;
      }
      const data = await response.json();
      startSession(data);
      return data;
    })
    .catch(() => null)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

/**
 * Užklausa į API. Pvz.:
 *   await api('/studios?page=2')
 *   await api('/studios', { method: 'POST', body: { name: '...' } })
 */
export async function api(path, { method = 'GET', body } = {}, isRetry = false) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response;
  try {
    response = await fetch(API_URL + path, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, { detail: 'Cannot reach the server. Is the API running?' });
  }

  // Access žetonas nebegalioja → atnaujiname jį ir pakartojame tą pačią užklausą vieną kartą
  if (response.status === 401 && accessToken && !isRetry) {
    await refreshSession();
    return api(path, { method, body }, true);
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);

  return data;
}
