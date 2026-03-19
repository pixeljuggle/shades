export type ThemeName = 'default' | 'dark' | 'sepia' | 'night' | 'custom'

export interface CustomColors {
  /** Tint colour used as the multiply-blend overlay for the custom theme */
  bg: string
}

export interface StoredSettings {
  theme: ThemeName
  customColors: CustomColors
}

export const DEFAULT_SETTINGS: StoredSettings = {
  theme: 'default',
  customColors: {
    bg: '#f5e6c8', // warm cream default
  },
}

export interface ThemeConfig {
  name: ThemeName
  label: string
  swatch: { bg: string; icon: string }
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  default: {
    name: 'default',
    label: 'Default',
    swatch: { bg: '#ffffff', icon: '#555' },
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    swatch: { bg: '#1a1a1a', icon: '#e0e0e0' },
  },
  sepia: {
    name: 'sepia',
    label: 'Sepia',
    swatch: { bg: '#f5e6c8', icon: '#5f4b32' },
  },
  night: {
    name: 'night',
    label: 'Night',
    swatch: { bg: '#000000', icon: '#cccccc' },
  },
  custom: {
    name: 'custom',
    label: 'Custom',
    swatch: { bg: '#ddeeff', icon: '#336' },
  },
}
