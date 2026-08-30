import type { Sector } from '@/lib/solutions/types'

/** Muted secondary pills for sector tags — quieter than stage badges. */
export const SECTOR_PILL_CLASSES: Record<Sector, string> = {
  agriculture: 'bg-[#E7E9DF] text-[#0B3E1F]',
  energy: 'bg-[#E7E9DF] text-[#0B3E1F]',
  water: 'bg-[#E7E9DF] text-[#0B3E1F]',
  biodiversity: 'bg-[#E7E9DF] text-[#0B3E1F]',
  pollution: 'bg-[#E7E9DF] text-[#0B3E1F]',
  'climate-justice': 'bg-[#E7E9DF] text-[#0B3E1F]',
}

export const SECTOR_PILL_DEFAULT = 'bg-[#E7E9DF] text-[#5C6457]'
