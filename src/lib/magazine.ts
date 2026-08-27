import { uniquifyEditorialImages } from '@/lib/unsplash-environment'
import type { MagCardItem } from '@/components/magazine/MagCard'
import { SECTOR_FILTER_OPTIONS, type Sector } from '@/lib/solutions/types'

export function uniquifyMagCards(items: MagCardItem[]): MagCardItem[] {
  return uniquifyEditorialImages(
    items,
    (item) => item.href,
    (item) => item.image,
    (item, image) => ({ ...item, image }),
  )
}

export function formatMagDate(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function sectorLabel(sector?: Sector | string): string {
  if (!sector) return 'Solutions'
  const match = SECTOR_FILTER_OPTIONS.find((option) => option.value === sector)
  return match?.label || String(sector).replace(/-/g, ' ')
}

export function byline(name?: string, date?: string): string {
  const who = name || ''
  if (who && date) return `${who} · ${date}`
  return who || date || ''
}
