(function () {
  "use strict";

  var THEMES = {
    light: "light",
    dark: "dark"
  };
  var STORAGE_KEY = "theme-preference";
  var TOGGLE_ID = "theme-toggle";
  var ICONS = {
    light: "🌙",
    dark: "☀️"
  };
  var baseUrl = window.__SITE_BASEURL || "";
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function isValidTheme(value) {
    return value === THEMES.light || value === THEMES.dark;
  }

  function readStoredTheme() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return isValidTheme(value) ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_error) {}
  }

  function resolveTheme() {
    var storedTheme = readStoredTheme();
    if (storedTheme) return storedTheme;
    return THEMES.dark;
  }

  function nextTheme(theme) {
    return theme === THEMES.dark ? THEMES.light : THEMES.dark;
  }

  function findThemeStylesheet() {
    return (
      document.querySelector('link[data-theme-stylesheet="true"]') ||
      document.querySelector('link[href*="/assets/css/main.css"]') ||
      document.querySelector('link[href*="/assets/css/main-dark.css"]')
    );
  }

  function updateThemeStylesheet(theme) {
    var link = findThemeStylesheet();
    if (!link) return;

    var fileName = theme === THEMES.dark ? "main-dark.css" : "main.css";
    var href = baseUrl + "/assets/css/" + fileName;
    if (link.getAttribute("href") !== href) {
      link.setAttribute("href", href);
    }
    link.setAttribute("data-theme-stylesheet", "true");
  }

  function updateToggleUI(theme) {
    var button = document.getElementById(TOGGLE_ID);
    if (!button) return;

    var isDark = theme === THEMES.dark;
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    button.textContent = isDark ? ICONS.dark : ICONS.light;
  }

  function setTheme(theme) {
    if (!isValidTheme(theme)) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark-mode", theme === THEMES.dark);
    updateThemeStylesheet(theme);
    updateToggleUI(theme);
  }

  function handleToggleClick() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var activeTheme = isValidTheme(currentTheme) ? currentTheme : resolveTheme();
    var updatedTheme = nextTheme(activeTheme);
    writeStoredTheme(updatedTheme);
    setTheme(updatedTheme);
  }

  function ensureToggleButton() {
    if (document.getElementById(TOGGLE_ID)) return;

    var navList = document.querySelector(".greedy-nav .visible-links");
    if (!navList) return;

    var listItem = document.createElement("li");
    listItem.className = "masthead__menu-item masthead__menu-item--theme-toggle";

    var button = document.createElement("button");
    button.id = TOGGLE_ID;
    button.className = "theme-toggle";
    button.type = "button";
    button.addEventListener("click", handleToggleClick);

    listItem.appendChild(button);
    navList.appendChild(listItem);
    updateToggleUI(resolveTheme());
  }

  function handleSystemThemeChange(event) {
    if (readStoredTheme()) return;
    setTheme(event.matches ? THEMES.dark : THEMES.light);
  }

  function init() {
    setTheme(resolveTheme());

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ensureToggleButton, { once: true });
    } else {
      ensureToggleButton();
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
  }

  init();
})();
