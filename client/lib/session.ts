const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser<T = unknown>() {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: unknown) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
}
