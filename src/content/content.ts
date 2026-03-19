import type { StoredSettings, ThemeName, CustomColors } from '../types/index'
import { DEFAULT_SETTINGS, buildFilter } from '../types/index'

const ATTR          = 'data-gdm-theme'
const REINVERT_ID   = 'gdm-reinvert'
const TRANSITION_ID = 'gdm-transition'

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

/** Inject/remove a style that counter-inverts images, videos, iframes and canvas
 *  so they look natural when the page is inverted in custom mode. */
function setMediaReinvert(enabled: boolean): void {
  let el = document.getElementById(REINVERT_ID)
  if (enabled) {
    if (!el) {
      el = document.createElement('style')
      el.id = REINVERT_ID
      el.textContent =
        'img, video, iframe, canvas { filter: invert(100%) hue-rotate(180deg) !important; }'
      document.head?.appendChild(el)
    }
  } else {
    el?.remove()
  }
}

/** Inject/remove a style that adds a smooth transition when the page filter changes. */
function setSmoothTransition(enabled: boolean): void {
  let el = document.getElementById(TRANSITION_ID)
  if (enabled) {
    if (!el) {
      el = document.createElement('style')
      el.id = TRANSITION_ID
      el.textContent = 'html { transition: filter 0.4s ease !important; }'
      document.head?.appendChild(el)
    }
  } else {
    el?.remove()
  }
}

function apply(stored: Partial<StoredSettings>): void {
  const settings: StoredSettings = {
    theme:            stored.theme            ?? DEFAULT_SETTINGS.theme,
    customColors:     { ...DEFAULT_SETTINGS.customColors, ...(stored.customColors ?? {}) },
    presets:          stored.presets          ?? DEFAULT_SETTINGS.presets,
    reinvertMedia:    stored.reinvertMedia    ?? DEFAULT_SETTINGS.reinvertMedia,
    smoothTransition: stored.smoothTransition ?? DEFAULT_SETTINGS.smoothTransition,
  }

  setSmoothTransition(settings.smoothTransition)
  setThemeAttr(settings.theme)

  if (settings.theme === 'custom') {
    applyCustomFilter(settings.customColors)
    // Re-invert media only in custom mode — preset dark/night handle it via styles.css
    setMediaReinvert(settings.reinvertMedia)
  } else {
    clearCustomFilter()
    setMediaReinvert(false)
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
