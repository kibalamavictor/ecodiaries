import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { VideoSeriesListItem } from '@/lib/cms/video-series-types'

type MobileVideoSeriesCardProps = {
  series: VideoSeriesListItem
}

export function MobileVideoSeriesCard({ series }: MobileVideoSeriesCardProps) {
  const episodeLabel = `${series.episodeCount} episode${series.episodeCount === 1 ? '' : 's'}`

  return (
    <Link
      href={`/watch/series/${series.slug}`}
      className="mobile-scroll-card flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
    >
      <div className="mobile-scroll-card__media relative">
        <Image
          src={series.coverImage}
          alt={series.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 767px) 82vw, 320px"
        />
        <div className="absolute left-2 top-2 z-[1] flex flex-col items-start gap-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-brand-lime">Series</span>
          <span className="rounded-full bg-brand-forest/92 px-2 py-0.5 text-[10px] font-semibold leading-none text-white">
            {episodeLabel}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 z-[1]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-lime/95 shadow-sm">
            <Play className="ml-0.5 h-3.5 w-3.5 text-brand-forest" fill="#0C1400" />
          </div>
        </div>
      </div>
      <div className="mobile-scroll-card__text watch-series-card__text">
        <h3 className="mobile-scroll-card__title">{series.title}</h3>
      </div>
    </Link>
  )
}
