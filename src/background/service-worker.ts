import type { StoredSettings, ThemeName } from "../types/index";
import { DEFAULT_SETTINGS } from "../types/index";

const BADGE_COLORS: Record<ThemeName, string> = {
  default: "#ffffff",
  dark: "#1a1a1a",
  sepia: "#c8a96e",
  night: "#444444",
  custom: "#4285f4",
};

function updateBadge(theme: ThemeName): void {
  if (theme === "default") {
    chrome.action.setBadgeText({ text: "" });
  } else {
    chrome.action.setBadgeBackgroundColor({ color: BADGE_COLORS[theme] });
  }
}

/** On first install, write default settings so content scripts have something to read */
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (existing) => {
      const merged: StoredSettings = {
        theme: existing["theme"] ?? DEFAULT_SETTINGS.theme,
        customColors: existing["customColors"] ?? DEFAULT_SETTINGS.customColors,
      };
      chrome.storage.sync.set(merged);
      updateBadge(merged.theme);
    });
  }
});

/** Keep badge in sync whenever settings change */
chrome.storage.onChanged.addListener((_changes, area) => {
  if (area !== "sync") return;
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    updateBadge((stored as StoredSettings).theme);
  });
});

/** Restore badge on service-worker startup (e.g. after browser restart) */
chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  updateBadge((stored as StoredSettings).theme);
});
