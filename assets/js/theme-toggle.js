(function () {
  "use strict";

  var STORAGE_KEY = "theme-preference";
  var VALID_THEMES = { light: true, dark: true };
  var mediaQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function readStoredTheme() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return VALID_THEMES[value] ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_error) {}
  }

  function defaultTheme() {
    var configured = document.documentElement.getAttribute("data-theme-default");
    return configured === "light" || configured === "dark" || configured === "system" ? configured : "dark";
  }

  function resolvedTheme() {
    var storedTheme = readStoredTheme();
    var configured = defaultTheme();

    if (storedTheme) return storedTheme;
    if (configured === "system" && mediaQuery) return mediaQuery.matches ? "dark" : "light";
    return configured === "light" ? "light" : "dark";
  }

  function updateButtons(theme) {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    Array.prototype.forEach.call(buttons, function (button) {
      var nextTheme = theme === "dark" ? "light" : "dark";
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.setAttribute("aria-label", "Switch to " + nextTheme + " theme");
      button.setAttribute("data-active-theme", theme);

      var label = button.querySelector("[data-theme-label]");
      if (label) {
        label.textContent = "Switch to " + nextTheme + " theme";
      } else {
        button.textContent = "Theme: " + nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1);
      }
    });
  }

  function setTheme(theme, persist) {
    if (!VALID_THEMES[theme]) return;

    document.documentElement.setAttribute("data-theme", theme);
    updateButtons(theme);

    if (persist) {
      writeStoredTheme(theme);
    }

    window.dispatchEvent(new CustomEvent("site-theme-change", {
      detail: { theme: theme }
    }));
  }

  function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    setTheme(currentTheme === "dark" ? "light" : "dark", true);
  }

  function bindButtons() {
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    Array.prototype.forEach.call(buttons, function (button) {
      if (button.dataset.themeBound === "true") return;
      button.dataset.themeBound = "true";
      button.addEventListener("click", toggleTheme);
    });
  }

  function handleSystemThemeChange(event) {
    if (readStoredTheme()) return;
    setTheme(event.matches ? "dark" : "light", false);
  }

  function init() {
    bindButtons();
    setTheme(resolvedTheme(), false);

    if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
