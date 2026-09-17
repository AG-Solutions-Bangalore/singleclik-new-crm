import { TOKEN_KEY } from "@/lib/constants";

const REMEMBER_USER_KEY = "remembered_username";
const REMEMBER_FLAG_KEY = "remember_me";

/**
 * Single source of truth for the auth token.
 * - "Remember me" ON  -> token lives in localStorage (survives browser restart)
 * - "Remember me" OFF -> token lives in sessionStorage (cleared when tab/browser closes)
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string, remember: boolean): void {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getRememberedUsername(): string {
  return localStorage.getItem(REMEMBER_USER_KEY) ?? "";
}

export function setRememberedUsername(username: string, remember: boolean): void {
  if (remember && username) {
    localStorage.setItem(REMEMBER_USER_KEY, username);
    localStorage.setItem(REMEMBER_FLAG_KEY, "1");
  } else {
    localStorage.removeItem(REMEMBER_USER_KEY);
    localStorage.removeItem(REMEMBER_FLAG_KEY);
  }
}

export function wasRememberMeChecked(): boolean {
  return localStorage.getItem(REMEMBER_FLAG_KEY) === "1";
}
