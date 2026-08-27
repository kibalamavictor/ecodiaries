import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import type { PodcastSeriesDetail } from '@/lib/cms/podcast-series-types'

type ListenSeriesDetailProps = {
  series: PodcastSeriesDetail
}

export function ListenSeriesDetail({ series }: ListenSeriesDetailProps) {
  const firstEpisode = series.episodes[0]

  return (
    <div className="listen-series-detail md:hidden">
      <div className="listen-series-detail__banner">
        <Image
          src={series.coverImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="listen-series-detail__banner-scrim" aria-hidden />
        <Link href="/listen#listen-series" className="listen-series-detail__back" aria-label="Back to Listen">
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <div className="listen-series-detail__banner-copy">
          <p className="listen-series-detail__eyebrow">Series</p>
          <h1 className="listen-series-detail__title">{series.title}</h1>
          <p className="listen-series-detail__count">
            {series.episodeCount} episode{series.episodeCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="listen-series-detail__body">
        {series.description ? <p className="listen-series-detail__description">{series.description}</p> : null}

        {firstEpisode ? (
          <Link href={`/listen#${firstEpisode.slug}`} className="listen-series-detail__play-btn">
            Play first episode
          </Link>
        ) : null}

        <div className="listen-series-detail__episodes">
          <h2 className="listen-series-detail__episodes-title">Episodes</h2>
          <ul className="listen-series-detail__episode-list">
            {series.episodes.map((episode) => (
              <li key={episode.slug}>
                <Link href={`/listen#${episode.slug}`} className="listen-series-episode-row">
                  <div className="listen-series-episode-row__thumb">
                    <Image
                      src={episode.thumbnail}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="120px"
                    />
                  </div>
                  <div className="listen-series-episode-row__copy">
                    <p className="listen-series-episode-row__title">{episode.title}</p>
                    {episode.duration ? (
                      <p className="listen-series-episode-row__duration">{episode.duration}</p>
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
