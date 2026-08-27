import { SECTOR_LABELS, type Sector } from '@/lib/solutions/types'
import { SECTOR_PILL_CLASSES, SECTOR_PILL_DEFAULT } from '@/lib/solutions/sector-styles'
import { cn } from '@/lib/utils'

type SectorPillGroupProps = {
  sectors: Sector[]
  className?: string
}

export function SectorPillGroup({ sectors, className }: SectorPillGroupProps) {
  if (!sectors.length) return null

  return (
    <div className={cn('flex min-h-[1.625rem] flex-wrap gap-1.5', className)} role="list" aria-label="Sectors">
      {sectors.map((sector) => (
        <span
          key={sector}
          role="listitem"
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide',
            SECTOR_PILL_CLASSES[sector] ?? SECTOR_PILL_DEFAULT,
          )}
        >
          {SECTOR_LABELS[sector]}
        </span>
      ))}
    </div>
  )
}
