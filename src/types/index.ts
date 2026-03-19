export type ThemeName = 'default' | 'dark' | 'sepia' | 'night' | 'custom'

export interface CustomColors {
  brightness: number  // 0–200, default 100
  contrast:   number  // 0–200, default 100
  sepia:      number  // 0–100, default 0
  hueRotate:  number  // 0–360, default 0
  invert:     number  // 0–100, default 0
  saturate:   number  // 0–200, default 100
  grayscale:  number  // 0–100, default 0
}

export interface Preset {
  name: string
  colors: CustomColors
}

export interface StoredSettings {
  theme: ThemeName
  customColors: CustomColors
  presets: Preset[]
  reinvertMedia: boolean
  smoothTransition: boolean
}

export const DEFAULT_SETTINGS: StoredSettings = {
  theme: 'default',
  customColors: {
    brightness: 100,
    contrast:   100,
    sepia:      0,
    hueRotate:  0,
    invert:     0,
    saturate:   100,
    grayscale:  0,
  },
  presets: [],
  reinvertMedia: false,
  smoothTransition: false,
}

/** Build a CSS filter string from a CustomColors record. */
export function buildFilter(c: CustomColors): string {
  return [
    `brightness(${c.brightness}%)`,
    `contrast(${c.contrast}%)`,
    `sepia(${c.sepia}%)`,
    `hue-rotate(${c.hueRotate}deg)`,
    `invert(${c.invert}%)`,
    `saturate(${c.saturate}%)`,
    `grayscale(${c.grayscale}%)`,
  ].join(' ')
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
