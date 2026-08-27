'use client'

import { MobileScrollRow } from '@/components/mobile/MobileScrollRow'
import { MobileVideoSeriesCard } from '@/components/mobile/MobileVideoSeriesCard'
import type { VideoSeriesListItem } from '@/lib/cms/video-series-types'

type WatchSeriesMobileRowProps = {
  series: VideoSeriesListItem[]
}

export function WatchSeriesMobileRow({ series }: WatchSeriesMobileRowProps) {
  if (!series.length) return null

  const collage = series.slice(0, 2).map((item) => item.coverImage)

  return (
    <section className="watch-series-mobile md:hidden" id="watch-series" aria-label="Video series">
      <div className="watch-series-mobile__head">
        <h2>Series</h2>
      </div>
      <MobileScrollRow
        seeMore={{
          label: 'Series',
          countText: `All ${series.length} series`,
          href: '/watch#watch-series',
          images: collage,
        }}
      >
        {series.map((item) => (
          <MobileVideoSeriesCard key={item.slug} series={item} />
        ))}
      </MobileScrollRow>
    </section>
  )
}
