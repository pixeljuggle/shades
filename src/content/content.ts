import type { StoredSettings, ThemeName, CustomColors } from '../types/index'
import { DEFAULT_SETTINGS } from '../types/index'

const OVERLAY_ID = 'gdm-overlay'
const ATTR = 'data-gdm-theme'

function setThemeAttr(theme: ThemeName): void {
  if (theme === 'default' || theme === 'custom') {
    document.documentElement.removeAttribute(ATTR)
  } else {
    document.documentElement.setAttribute(ATTR, theme)
  }
}

function applyCustomColors(colors: CustomColors): void {
  let overlay = document.getElementById(OVERLAY_ID) as HTMLDivElement | null
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = OVERLAY_ID
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      transition: 'background 0.2s',
    })
    document.documentElement.appendChild(overlay)
  }
  overlay.style.background = colors.bg
}

function removeOverlay(): void {
  document.getElementById(OVERLAY_ID)?.remove()
}

function apply(settings: StoredSettings): void {
  setThemeAttr(settings.theme)
  if (settings.theme === 'custom') {
    applyCustomColors(settings.customColors)
  } else {
    removeOverlay()
  }
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  apply(stored as StoredSettings)
})

chrome.storage.onChanged.addListener((_changes, area) => {
  if (area !== 'sync') return
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    apply(stored as StoredSettings)
  })
})
