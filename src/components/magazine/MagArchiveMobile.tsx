import { Suspense } from 'react'
import { MagMobileGrid } from '@/components/magazine/MagMobileGrid'
import { MobileBrowseBar, type MobileBrowseBarProps } from '@/components/magazine/MobileBrowseBar'
import type { MagCardItem } from '@/components/magazine/MagCard'

type MagArchiveMobileProps = {
  items: MagCardItem[]
  empty?: string
  browse?: MobileBrowseBarProps
}

export function MagArchiveMobile({ items, empty, browse }: MagArchiveMobileProps) {
  return (
    <div className="magazine-mobile-archive">
      <div className="site-container">
        <Suspense fallback={null}>
          <MobileBrowseBar {...browse} />
        </Suspense>
        <MagMobileGrid items={items} empty={empty} />
      </div>
    </div>
  )
}
