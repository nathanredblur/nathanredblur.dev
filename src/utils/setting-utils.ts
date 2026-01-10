import {
  AUTO_MODE,
  DARK_MODE,
  DEFAULT_THEME,
  LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig, siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
  const fallback = "250";
  const configCarrier = document.getElementById("config-carrier");
  return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
  const stored = localStorage.getItem("hue");
  return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
  localStorage.setItem("hue", String(hue));
  const r = document.querySelector(":root") as HTMLElement;
  if (!r) {
    return;
  }
  r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
  switch (theme) {
    case LIGHT_MODE:
      document.documentElement.classList.remove("dark");
      break;
    case DARK_MODE:
      document.documentElement.classList.add("dark");
      break;
    case AUTO_MODE:
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      break;
  }

  // Set the theme for Expressive Code
  document.documentElement.setAttribute(
    "data-theme",
    expressiveCodeConfig.theme
  );
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
  localStorage.setItem("theme", theme);
  applyThemeToDocument(theme);
}

/**
 * Returns true if the light/dark mode is fixed in the config
 */
export function isLightDarkFixed(): boolean {
  return siteConfig.themeColor.lightDark !== undefined;
}

/**
 * Gets the fixed light/dark mode from config, or undefined if not fixed
 */
export function getFixedLightDark(): LIGHT_DARK_MODE | undefined {
  return siteConfig.themeColor.lightDark;
}

export function getStoredTheme(): LIGHT_DARK_MODE {
  // If light/dark mode is fixed in config, always return the fixed value
  const fixedTheme = getFixedLightDark();
  if (fixedTheme !== undefined) {
    return fixedTheme;
  }
  // Otherwise, read from localStorage
  return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
