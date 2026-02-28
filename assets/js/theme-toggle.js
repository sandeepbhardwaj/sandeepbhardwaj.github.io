(function () {
  var STORAGE_KEY = "theme-preference";
  var LIGHT_THEME = "light";
  var DARK_THEME = "dark";
  var baseUrl = window.__SITE_BASEURL || "";
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var MOON_ICON = "🌙";
  var SUN_ICON = "☀️";

  function getStoredTheme() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      if (value === LIGHT_THEME || value === DARK_THEME) return value;
    } catch (_error) {}
    return null;
  }

  function getPreferredTheme() {
    var stored = getStoredTheme();
    if (stored) return stored;
    return mediaQuery.matches ? DARK_THEME : LIGHT_THEME;
  }

  function getStylesheetLink() {
    return (
      document.querySelector('link[data-theme-stylesheet="true"]') ||
      document.querySelector('link[href*="/assets/css/main.css"]') ||
      document.querySelector('link[href*="/assets/css/main-dark.css"]')
    );
  }

  function applyStylesheet(theme) {
    var link = getStylesheetLink();
    if (!link) return;
    var fileName = theme === DARK_THEME ? "main-dark.css" : "main.css";
    var targetHref = baseUrl + "/assets/css/" + fileName;
    if (link.getAttribute("href") !== targetHref) {
      link.setAttribute("href", targetHref);
    }
    link.setAttribute("data-theme-stylesheet", "true");
  }

  function updateToggleButton(theme) {
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    var isDark = theme === DARK_THEME;
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    button.textContent = isDark ? SUN_ICON : MOON_ICON;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark-mode", theme === DARK_THEME);
    applyStylesheet(theme);
    updateToggleButton(theme);
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_error) {}
  }

  function handleToggleClick() {
    var current = document.documentElement.getAttribute("data-theme") || getPreferredTheme();
    var next = current === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    saveTheme(next);
    applyTheme(next);
  }

  function createToggleButton() {
    if (document.getElementById("theme-toggle")) return;
    var nav = document.querySelector(".greedy-nav .visible-links");
    if (!nav) return;
    var item = document.createElement("li");
    item.className = "masthead__menu-item masthead__menu-item--theme-toggle";
    var button = document.createElement("button");
    button.id = "theme-toggle";
    button.className = "theme-toggle";
    button.type = "button";
    button.addEventListener("click", handleToggleClick);
    item.appendChild(button);
    nav.appendChild(item);
    updateToggleButton(document.documentElement.getAttribute("data-theme") || getPreferredTheme());
  }

  function handleSystemThemeChange(event) {
    if (getStoredTheme()) return;
    applyTheme(event.matches ? DARK_THEME : LIGHT_THEME);
  }

  applyTheme(getPreferredTheme());
  document.addEventListener("DOMContentLoaded", createToggleButton);
  mediaQuery.addEventListener("change", handleSystemThemeChange);
})();
