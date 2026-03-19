import type { StoredSettings, ThemeName, CustomColors } from '../types/index'
import { DEFAULT_SETTINGS, buildFilter } from '../types/index'

const ATTR = 'data-gdm-theme'

function setThemeAttr(theme: ThemeName): void {
  if (theme === 'default' || theme === 'custom') {
    document.documentElement.removeAttribute(ATTR)
  } else {
    document.documentElement.setAttribute(ATTR, theme)
  }
}

function applyCustomFilter(colors: CustomColors): void {
  document.documentElement.style.filter = buildFilter(colors)
}

function clearCustomFilter(): void {
  document.documentElement.style.filter = ''
}

function apply(stored: Partial<StoredSettings>): void {
  const settings: StoredSettings = {
    theme: stored.theme ?? DEFAULT_SETTINGS.theme,
    // Spread over defaults handles old { bg: string } format gracefully —
    // the unknown key is ignored, new keys get their default values.
    customColors: { ...DEFAULT_SETTINGS.customColors, ...(stored.customColors ?? {}) },
  }
  setThemeAttr(settings.theme)
  if (settings.theme === 'custom') {
    applyCustomFilter(settings.customColors)
  } else {
    clearCustomFilter()
  }
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  apply(stored as Partial<StoredSettings>)
})

chrome.storage.onChanged.addListener((_changes, area) => {
  if (area !== 'sync') return
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    apply(stored as Partial<StoredSettings>)
  })
})
