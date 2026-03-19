import type { StoredSettings, ThemeName, CustomColors } from '../types/index'
import { DEFAULT_SETTINGS } from '../types/index'
import { icons } from './icons'

// ---- Inject Lucide icons ----

const headerIcon = document.getElementById('headerIcon')!
headerIcon.innerHTML = icons.custom

for (const [theme, svg] of Object.entries(icons)) {
  const el = document.getElementById(`icon-${theme}`)
  if (el) el.innerHTML = svg
}

// ---- DOM refs ----

const themeBtns = document.querySelectorAll<HTMLButtonElement>('.theme-btn')
const customPanel = document.getElementById('customPanel') as HTMLElement
const colorBg = document.getElementById('colorBg') as HTMLInputElement
const previewPage = document.getElementById('previewPage') as HTMLElement

// ---- State ----

let currentSettings: StoredSettings = { ...DEFAULT_SETTINGS }

// ---- Helpers ----

function setActive(theme: ThemeName): void {
  themeBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset['theme'] === theme)
  })
  customPanel.hidden = theme !== 'custom'
}

function updatePreview(colors: CustomColors): void {
  previewPage.style.background = colors.bg
  previewPage.style.mixBlendMode = 'multiply'
}

function save(settings: Partial<StoredSettings>): void {
  currentSettings = { ...currentSettings, ...settings }
  chrome.storage.sync.set(currentSettings)
}

// Debounced version for high-frequency inputs (e.g. colour picker dragging).
// Merges pending settings so rapid calls collapse into a single write.
let saveTimer: ReturnType<typeof setTimeout> | null = null
let pendingSave: Partial<StoredSettings> = {}

function saveDebounced(settings: Partial<StoredSettings>, delay = 400): void {
  pendingSave = { ...pendingSave, ...settings }
  if (saveTimer !== null) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    save(pendingSave)
    pendingSave = {}
    saveTimer = null
  }, delay)
}

// ---- Init ----

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  currentSettings = stored as StoredSettings
  setActive(currentSettings.theme)
  colorBg.value = currentSettings.customColors.bg
  updatePreview(currentSettings.customColors)
})

// ---- Events ----

themeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset['theme'] as ThemeName
    setActive(theme)
    save({ theme })
  })
})

colorBg.addEventListener('input', () => {
  const colors: CustomColors = { bg: colorBg.value }
  updatePreview(colors)          // instant visual feedback
  saveDebounced({ customColors: colors })  // throttled storage write
})
