// src/utils/auth.ts

export const TOKEN_KEY = 'session_token';

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  // Add token validation logic if needed
  return !!token;
}

// Get user role from sessionStorage (assumes 'user_role' is set at login)
export function getUserRole(): string | null {
  return sessionStorage.getItem('user_role');
}
