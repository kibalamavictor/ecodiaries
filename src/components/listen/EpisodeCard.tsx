'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import { HostAvatars } from '@/components/listen/HostAvatars'
import { SoundWaveMini } from '@/components/listen/SoundWave'
import { AudioPlayer } from '@/components/listen/AudioPlayer'
import { ListenExpandedEpisodeMobile } from '@/components/listen/ListenExpandedEpisodeMobile'
import { ListenCompactEpisodeRow } from '@/components/listen/ListenCompactEpisodeRow'
import { useAudioPlayer } from '@/components/listen/AudioPlayerContext'
import { useIsMdViewport } from '@/lib/hooks/use-is-md-viewport'

function formatDate(publishedAt?: string) {
  if (!publishedAt) return ''
  return new Date(publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function DesktopEpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { currentEpisodeId, isPlaying, setPlaying, registerPlayer, unregisterPlayer } = useAudioPlayer()

  const isActive = currentEpisodeId === episode.id
  const playing = isActive && isPlaying

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !episode.audioUrl) return

    const pause = () => audio.pause()
    registerPlayer(episode.id, pause)

    const onPlay = () => setPlaying(episode.id, true)
    const onPause = () => setPlaying(episode.id, false)
    const onEnded = () => setPlaying(episode.id, false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    return () => {
      unregisterPlayer(episode.id)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [episode.id, episode.audioUrl, registerPlayer, unregisterPlayer, setPlaying])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !episode.audioUrl) return
    if (playing) {
      audio.pause()
    } else {
      void audio.play()
    }
  }

  return (
    <article className={`episode-card${playing ? ' episode-card--playing' : ''}`}>
      {episode.audioUrl ? (
        <audio ref={audioRef} src={episode.audioUrl} preload="none" className="sr-only">
          <a href={episode.audioUrl}>Listen to {episode.title}</a>
        </audio>
      ) : null}

      <div className="episode-card__thumb">
        <Image
          src={episode.thumbnail}
          alt=""
          width={80}
          height={80}
          sizes="80px"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="episode-card__content">
        <div className="episode-card__title-row">
          {playing ? <SoundWaveMini isPlaying /> : null}
          <h3 className="episode-card__title">{episode.title}</h3>
        </div>
        <p className="episode-card__series">
          {episode.series}
          {episode.num ? ` · Ep ${episode.num}` : ''}
        </p>
        <div className="episode-card__footer">
          <HostAvatars hosts={episode.hosts} size={24} max={3} />
          {episode.duration ? <span className="episode-card__duration">{episode.duration}</span> : null}
          {episode.publishedAt ? (
            <span className="episode-card__date">{formatDate(episode.publishedAt)}</span>
          ) : null}
        </div>
      </div>

      {episode.audioUrl ? (
        <button
          type="button"
          className="episode-card__play"
          aria-label={playing ? `Pause ${episode.title}` : `Play ${episode.title}`}
          onClick={togglePlay}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      ) : null}
    </article>
  )
}

function MobileEpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const { currentEpisodeId, isPlaying, setPlaying } = useAudioPlayer()
  const [autoPlay, setAutoPlay] = useState(false)

  const isActive = currentEpisodeId === episode.id
  const playing = isActive && isPlaying

  function handleCompactPlay() {
    setAutoPlay(true)
    setPlaying(episode.id, true)
  }

  if (isActive) {
    return (
      <article className="episode-card episode-card--expanded-mobile episode-card--playing">
        <ListenExpandedEpisodeMobile episode={episode} headingLevel="h3">
          {episode.audioUrl ? (
            <AudioPlayer
              src={episode.audioUrl}
              title={episode.title}
              episodeId={episode.id}
              episodeSlug={episode.slug}
              durationSeconds={episode.durationSeconds}
              variant="mobile-compact"
              autoPlay={autoPlay}
            />
          ) : null}
        </ListenExpandedEpisodeMobile>
      </article>
    )
  }

  return (
    <article className="episode-card episode-card--compact-mobile">
      <div className="listen-compact-episode">
        <ListenCompactEpisodeRow
          episode={episode}
          playing={playing}
          onPlay={episode.audioUrl ? handleCompactPlay : undefined}
        />
      </div>
    </article>
  )
}

export function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const isDesktop = useIsMdViewport()

  return (
    <div id={episode.slug} className="episode-card-wrap">
      {isDesktop ? <DesktopEpisodeCard episode={episode} /> : <MobileEpisodeCard episode={episode} />}
    </div>
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
