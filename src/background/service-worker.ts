import type { StoredSettings } from '../types/index'
import { DEFAULT_SETTINGS } from '../types/index'

/** On first install, write default settings so content scripts have something to read */
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (existing) => {
      const merged: StoredSettings = {
        theme: existing['theme'] ?? DEFAULT_SETTINGS.theme,
        customColors: existing['customColors'] ?? DEFAULT_SETTINGS.customColors,
      }
      chrome.storage.sync.set(merged)
    })
  }
})
