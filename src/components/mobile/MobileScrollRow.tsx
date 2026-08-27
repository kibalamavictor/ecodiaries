import type { ReactNode } from 'react'
import { Children } from 'react'
import { SeeMoreCard, type SeeMoreCardProps } from '@/components/mobile/SeeMoreCard'

export type MobileScrollRowSeeMore = Pick<
  SeeMoreCardProps,
  'label' | 'countText' | 'href' | 'images'
>

export interface MobileScrollRowProps {
  children: ReactNode
  seeMore: MobileScrollRowSeeMore
}

export function MobileScrollRow({ children, seeMore }: MobileScrollRowProps) {
  return (
    <div
      className="mobile-scroll-row scroll-edge-fade scrollbar-hide -mx-4 flex items-start gap-2 overflow-x-auto px-4 pb-1 md:hidden"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {Children.map(children, (child, index) => (
        <div key={index} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
          {child}
        </div>
      ))}
      <div className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
        <SeeMoreCard
          label={seeMore.label}
          countText={seeMore.countText}
          href={seeMore.href}
          images={seeMore.images}
        />
      </div>
    </div>
  )
}
