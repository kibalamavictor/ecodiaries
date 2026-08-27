'use client'

import Image from 'next/image'
import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import { formatNumericDate } from '@/lib/listen/episode-meta'
import { HostAvatars } from '@/components/listen/HostAvatars'

type ListenCompactEpisodeRowProps = {
  episode: PodcastEpisode
  playing?: boolean
  onPlay?: () => void
  playLabel?: string
}

export function ListenCompactEpisodeRow({
  episode,
  playing = false,
  onPlay,
  playLabel,
}: ListenCompactEpisodeRowProps) {
  const metaParts: string[] = []
  if (episode.duration) metaParts.push(episode.duration)
  if (episode.publishedAt) metaParts.push(formatNumericDate(episode.publishedAt))

  return (
    <>
      <div className="listen-compact-episode__thumb">
        <Image src={episode.thumbnail} alt="" width={80} height={80} sizes="80px" />
      </div>

      <div className="listen-compact-episode__content">
        <h3 className="listen-compact-episode__title">{episode.title}</h3>
        <p className="listen-compact-episode__series">
          {episode.series}
          {episode.num ? ` · Ep ${episode.num}` : ''}
        </p>
        <div className="listen-compact-episode__footer">
          <HostAvatars hosts={episode.hosts} size={24} max={3} />
          {metaParts.length ? (
            <span className="listen-compact-episode__meta">{metaParts.join(' · ')}</span>
          ) : null}
        </div>
      </div>

      {onPlay ? (
        <button
          type="button"
          className="listen-compact-episode__play"
          aria-label={playLabel || (playing ? `Pause ${episode.title}` : `Play ${episode.title}`)}
          onClick={onPlay}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      ) : null}
    </>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  )
}
