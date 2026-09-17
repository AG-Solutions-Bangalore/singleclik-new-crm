export const THEME_STORAGE_KEY = "theme";

/**
 * Clear app storage (logout / maintenance redirect) while preserving the
 * user's explicit theme choice. next-themes persists under THEME_STORAGE_KEY;
 * wiping it would drop back to the OS theme on the next load.
 */
export function clearAppStorage(): void {
  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  const rememberedUsername = localStorage.getItem("remembered_username");
  const rememberMe = localStorage.getItem("remember_me");
  localStorage.clear();
  sessionStorage.clear();
  if (theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  // Keep the remembered username so the login form can prefill it.
  if (rememberedUsername) {
    localStorage.setItem("remembered_username", rememberedUsername);
  }
  if (rememberMe) {
    localStorage.setItem("remember_me", rememberMe);
  }
}
