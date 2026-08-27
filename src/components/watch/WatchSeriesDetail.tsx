import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import type { VideoSeriesDetail } from '@/lib/cms/video-series-types'

type WatchSeriesDetailProps = {
  series: VideoSeriesDetail
}

export function WatchSeriesDetail({ series }: WatchSeriesDetailProps) {
  const firstEpisode = series.episodes[0]

  return (
    <div className="watch-series-detail md:hidden">
      <div className="watch-series-detail__banner">
        <Image
          src={series.coverImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="watch-series-detail__banner-scrim" aria-hidden />
        <Link href="/watch#watch-series" className="watch-series-detail__back" aria-label="Back to Watch">
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <div className="watch-series-detail__banner-copy">
          <p className="watch-series-detail__eyebrow">Series</p>
          <h1 className="watch-series-detail__title">{series.title}</h1>
          <p className="watch-series-detail__count">
            {series.episodeCount} episode{series.episodeCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="watch-series-detail__body">
        {series.description ? <p className="watch-series-detail__description">{series.description}</p> : null}

        {firstEpisode ? (
          <Link href={`/watch#${firstEpisode.slug}`} className="watch-series-detail__play-btn">
            Play first episode
          </Link>
        ) : null}

        <div className="watch-series-detail__episodes">
          <h2 className="watch-series-detail__episodes-title">Episodes</h2>
          <ul className="watch-series-detail__episode-list">
            {series.episodes.map((episode) => (
              <li key={episode.slug}>
                <Link href={`/watch#${episode.slug}`} className="watch-series-episode-row">
                  <div className="watch-series-episode-row__thumb">
                    <Image
                      src={episode.image}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="120px"
                    />
                  </div>
                  <div className="watch-series-episode-row__copy">
                    <p className="watch-series-episode-row__title">{episode.title}</p>
                    {episode.duration ? (
                      <p className="watch-series-episode-row__duration">{episode.duration}</p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
