'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { PlayIcon } from '@/components/icons'

export type WatchVideoItem = {
  slug: string
  title: string
  type: string
  duration: string
  featured?: boolean
  image: string
  description?: string
  playback: { kind: 'file' | 'embed'; src: string } | null
}

export function VideoPlayer({
  video,
  aspectRatio = '16/8',
  showMeta = true,
  autoPlay = false,
}: {
  video: WatchVideoItem
  aspectRatio?: string
  showMeta?: boolean
  autoPlay?: boolean
}) {
  const [started, setStarted] = useState(autoPlay && Boolean(video.playback))

  const canPlay = Boolean(video.playback)

  const player = useMemo(() => {
    if (!started || !video.playback) return null
    if (video.playback.kind === 'embed') {
      return (
        <iframe
          src={video.playback.src}
          title={video.title}
          className="watch-player-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )
    }
    return (
      <video
        className="watch-player-video"
        controls
        playsInline
        preload="metadata"
        poster={video.image}
        autoPlay={autoPlay}
      >
        <source src={video.playback.src} />
        Your browser does not support embedded video.
      </video>
    )
  }, [autoPlay, started, video])

  return (
    <div className="watch-player-wrap">
      <div className="watch-player-media" style={{ aspectRatio }}>
        {started && player ? (
          player
        ) : (
          <>
            <Image src={video.image} alt={video.title} fill sizes="100vw" className="watch-player-poster" priority />
            {canPlay ? (
              <button
                type="button"
                className="play-btn"
                aria-label={`Play ${video.title}`}
                onClick={() => setStarted(true)}
              >
                <PlayIcon />
              </button>
            ) : (
              <div className="watch-player-empty">
                <p>Video coming soon — add a YouTube/Vimeo link or upload a file in Studio → Watch.</p>
              </div>
            )}
          </>
        )}
      </div>
      {showMeta ? (
        <div className="watch-player-meta">
          <span className="meta-strip">
            {video.type}
            {video.duration ? ` · ${video.duration}` : ''}
          </span>
          <h2>{video.title}</h2>
          {video.description ? <p className="watch-player-description">{video.description}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
