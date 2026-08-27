import Image from 'next/image'
import Link from 'next/link'
import type { PodcastSeriesListItem } from '@/lib/cms/podcast-series-types'
import { HostAvatars } from '@/components/listen/HostAvatars'

type MobilePodcastSeriesCardProps = {
  series: PodcastSeriesListItem
}

export function MobilePodcastSeriesCard({ series }: MobilePodcastSeriesCardProps) {
  const episodeLabel = `${series.episodeCount} episode${series.episodeCount === 1 ? '' : 's'}`

  return (
    <Link
      href={`/listen/series/${series.slug}`}
      className="listen-series-card mobile-scroll-card"
    >
      <div className="listen-series-card__media">
        <Image
          src={series.coverImage}
          alt={series.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 767px) 82vw, 320px"
        />
        <div className="listen-series-card__scrim" aria-hidden />

        <div className="listen-series-card__top">
          <span className="listen-series-card__eyebrow">Series</span>
          <span className="listen-series-card__count">{episodeLabel}</span>
        </div>

        <div className="listen-series-card__bottom">
          <div className="listen-series-card__copy">
            {series.hosts.length > 0 ? (
              <div className="listen-series-card__hosts">
                <HostAvatars hosts={series.hosts} size={18} max={2} />
              </div>
            ) : null}
            <h3 className="listen-series-card__title">{series.title}</h3>
            {series.hook ? <p className="listen-series-card__hook">{series.hook}</p> : null}
          </div>
          <span className="listen-series-card__play-pill">Play series</span>
        </div>
      </div>
    </Link>
  )
}
