'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import { formatEpisodeMeta } from '@/lib/listen/episode-meta'
import { AudioPlayer } from '@/components/listen/AudioPlayer'
import { HostAvatars } from '@/components/listen/HostAvatars'
import { PodcasterCard } from '@/components/listen/PodcasterCard'
import { ListenExpandedEpisodeMobile } from '@/components/listen/ListenExpandedEpisodeMobile'
import { ListenCompactEpisodeRow } from '@/components/listen/ListenCompactEpisodeRow'
import { useAudioPlayer } from '@/components/listen/AudioPlayerContext'
import { useIsMdViewport } from '@/lib/hooks/use-is-md-viewport'

function FeaturedEpisodePlayer({
  episode,
  autoPlay = false,
}: {
  episode: PodcastEpisode
  autoPlay?: boolean
}) {
  if (episode.audioUrl) {
    return (
      <AudioPlayer
        src={episode.audioUrl}
        title={episode.title}
        episodeId={episode.id}
        episodeSlug={episode.slug}
        durationSeconds={episode.durationSeconds}
        variant="mobile-compact"
        autoPlay={autoPlay}
      />
    )
  }

  if (episode.embedUrl) {
    return (
      <div className="featured-episode-card__embed">
        <iframe src={episode.embedUrl} title={episode.title} allow="autoplay" />
      </div>
    )
  }

  return <p className="featured-episode-card__fallback">Audio coming soon.</p>
}

export function FeaturedEpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const isDesktop = useIsMdViewport()
  const { currentEpisodeId, isPlaying, setPlaying } = useAudioPlayer()
  const [autoPlay, setAutoPlay] = useState(false)

  const isExpanded = !currentEpisodeId || currentEpisodeId === episode.id
  const isActive = currentEpisodeId === episode.id
  const playing = isActive && isPlaying

  function handleCompactPlay() {
    setAutoPlay(true)
    setPlaying(episode.id, true)
  }

  return (
    <article
      className={`featured-episode-card${isExpanded ? ' featured-episode-card--expanded' : ''}`}
      id={episode.slug}
    >
      {isDesktop ? (
        <>
          <div className="featured-episode-card__thumb">
            <Image
              src={episode.thumbnail}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="featured-episode-card__image"
            />
            <div className="featured-episode-card__overlay">
              <h2 className="featured-episode-card__overlay-title">{episode.title}</h2>
              <p className="featured-episode-card__overlay-series">{episode.series}</p>
            </div>
          </div>

        <div className="featured-episode-card__body">
          <div className="featured-episode-card__hosts">
            <HostAvatars hosts={episode.hosts} size={36} />
          </div>
          <div className="featured-episode-card__info">
            <h2 className="featured-episode-card__title">{episode.title}</h2>
            <p className="featured-episode-card__series">{episode.series}</p>
            <p className="featured-episode-card__meta">{formatEpisodeMeta(episode)}</p>
          </div>
        </div>

        {episode.audioUrl ? (
          <AudioPlayer
            src={episode.audioUrl}
            title={episode.title}
            episodeId={episode.id}
            episodeSlug={episode.slug}
            durationSeconds={episode.durationSeconds}
          />
        ) : episode.embedUrl ? (
          <div className="featured-episode-card__embed">
            <iframe src={episode.embedUrl} title={episode.title} allow="autoplay" />
          </div>
        ) : (
          <p className="featured-episode-card__fallback">Audio coming soon.</p>
        )}

        {episode.hosts.length > 0 ? (
          <section className="featured-episode-card__profiles">
            <h3>Hosted by</h3>
            <div className="podcaster-grid">
              {episode.hosts.map((host) => (
                <PodcasterCard key={`${host.name}-${host.role}`} host={host} />
              ))}
            </div>
          </section>
        ) : null}
        </>
      ) : (
        <>
          {isExpanded ? (
            <ListenExpandedEpisodeMobile episode={episode}>
              <FeaturedEpisodePlayer episode={episode} autoPlay={autoPlay} />
            </ListenExpandedEpisodeMobile>
          ) : (
            <div className="listen-compact-episode">
              <ListenCompactEpisodeRow
                episode={episode}
                playing={playing}
                onPlay={handleCompactPlay}
              />
            </div>
          )}
        </>
      )}
    </article>
  )
}
