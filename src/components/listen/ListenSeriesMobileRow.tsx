'use client'

import { MobilePodcastSeriesCard } from '@/components/mobile/MobilePodcastSeriesCard'
import { SeeMoreCard } from '@/components/mobile/SeeMoreCard'
import type { PodcastSeriesListItem } from '@/lib/cms/podcast-series-types'

type ListenSeriesMobileRowProps = {
  series: PodcastSeriesListItem[]
}

export function ListenSeriesMobileRow({ series }: ListenSeriesMobileRowProps) {
  if (!series.length) return null

  const collage = series.slice(0, 2).map((item) => item.coverImage)

  return (
    <section className="listen-series-mobile md:hidden" id="listen-series" aria-label="Podcast series">
      <div className="listen-series-mobile__inner mobile-scroll-card-scope">
        <h2 className="listen-series-mobile__title">Series Collections</h2>
        <div className="listen-series-mobile__track scroll-edge-fade scrollbar-hide">
          {series.map((item) => (
            <div key={item.slug} className="listen-series-mobile__item">
              <MobilePodcastSeriesCard series={item} />
            </div>
          ))}
          <div className="listen-series-mobile__item">
            <SeeMoreCard
              label="Series"
              countText={`All ${series.length} series`}
              href="/listen#listen-series"
              images={collage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
