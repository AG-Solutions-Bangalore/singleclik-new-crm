export const THEME_STORAGE_KEY = "theme";

/**
 * Clear app storage (logout / maintenance redirect) while preserving the
 * user's explicit theme choice. next-themes persists under THEME_STORAGE_KEY;
 * wiping it would drop back to the OS theme on the next load.
 */
export function clearAppStorage(): void {
  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  localStorage.clear();
  if (theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
