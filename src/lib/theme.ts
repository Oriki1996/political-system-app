const KEY = "psi-theme";

export function initTheme() {
  const stored = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = stored ? stored === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", dark);
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(KEY, isDark ? "dark" : "light");
  return isDark;
}

export function isDark(): boolean {
  return document.documentElement.classList.contains("dark");
}
