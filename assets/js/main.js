/**
 * Theming.
 *
 * Supports the preferred color scheme of the operation system as well as
 * the theme choice of the user.
 *
 */
const themeToggle = document.querySelector(".theme-toggle");
const chosenTheme = window.localStorage && window.localStorage.getItem("theme");

// Detect the color scheme the operating system prefers.
function detectOSColorTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (theme === "auto" || !theme) {
    // Auto mode or no preference - follow system
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }

  updateThemeIcon();
}

// Update the theme toggle icon based on current mode
function updateThemeIcon() {
  const theme = localStorage.getItem("theme") || "auto";
  const icon = document.querySelector(".theme-toggler");
  const toggle = document.querySelector(".theme-toggle");

  if (!icon) return;

  // Clear existing icon
  while (icon.firstChild) {
    icon.removeChild(icon.firstChild);
  }

  if (theme === "auto") {
    // Auto mode icon (half-moon, half-sun or system icon)
    icon.innerHTML = `
      <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36V8c8.84 0 16 7.16 16 16s-7.16 16-16 16z" fill="currentColor"/>
      <circle cx="15" cy="24" r="1.5" fill="currentColor"/>
      <circle cx="33" cy="24" r="1.5" fill="currentColor"/>
    `;
    icon.setAttribute("viewBox", "0 0 48 48");
    icon.setAttribute("title", "Auto (System)");
    if (toggle) toggle.setAttribute("data-tooltip", "跟随系统");
  } else if (theme === "light") {
    // Sun icon for light mode
    icon.innerHTML = `
      <circle cx="24" cy="24" r="10" fill="currentColor"/>
      <path d="M24 2v6M24 40v6M42 24h6M2 24h6M36.5 11.5l4.24-4.24M7.26 40.74l4.24-4.24M36.5 36.5l4.24 4.24M7.26 7.26l4.24 4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    `;
    icon.setAttribute("viewBox", "0 0 48 48");
    icon.setAttribute("title", "Light Mode");
    if (toggle) toggle.setAttribute("data-tooltip", "浅色模式");
  } else if (theme === "dark") {
    // Moon icon for dark mode
    icon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
    `;
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("title", "Dark Mode");
    if (toggle) toggle.setAttribute("data-tooltip", "深色模式");
  }
}

// Switch the theme in cycle: auto -> light -> dark -> auto
function switchTheme(e) {
  const currentTheme = localStorage.getItem("theme") || "auto";
  let newTheme;

  if (currentTheme === "auto") {
    newTheme = "light";
  } else if (currentTheme === "light") {
    newTheme = "dark";
  } else {
    newTheme = "auto";
  }

  localStorage.setItem("theme", newTheme);
  detectOSColorTheme();

  // Add a smooth transition effect
  document.documentElement.style.transition = "background-color 0.3s ease, color 0.3s ease";
  setTimeout(() => {
    document.documentElement.style.transition = "";
  }, 300);
}

// Listen for system theme changes
function handleSystemThemeChange() {
  const theme = localStorage.getItem("theme");
  if (theme === "auto" || !theme) {
    detectOSColorTheme();
  }
}

// Initialize theme on page load
if (themeToggle) {
  // Set up event listeners
  themeToggle.addEventListener("click", switchTheme, false);

  // Listen for system theme changes
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const lightModeMediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);
  lightModeMediaQuery.addEventListener("change", handleSystemThemeChange);

  // Initialize theme
  detectOSColorTheme();

  // If no theme is set, default to auto
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "auto");
  }
} else {
  // If theme toggle is disabled, clear theme preference
  localStorage.removeItem("theme");
}