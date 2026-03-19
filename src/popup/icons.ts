/**
 * Minimal Lucide SVG helper — returns an inline SVG string for use in innerHTML.
 * We only import the icons we need to keep the bundle small.
 */
import { Sun, Moon, BookOpen, Monitor, Palette } from 'lucide'

type LucideIcon = (typeof Sun)

function toSvg(icon: LucideIcon, size = 20): string {
  const children = icon
    .map(([tag, attrs]: [string, Record<string, string>]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')
      return `<${tag} ${attrStr} />`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg"
    width="${size}" height="${size}" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${children}</svg>`
}

export const icons = {
  default: toSvg(Sun),
  dark: toSvg(Moon),
  sepia: toSvg(BookOpen),
  night: toSvg(Monitor),
  custom: toSvg(Palette),
} as const
