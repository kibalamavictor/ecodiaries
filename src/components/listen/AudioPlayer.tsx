'use client'

import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@/lib/cms/format-time'
import { SoundWave } from '@/components/listen/SoundWave'
import { useAudioPlayer } from '@/components/listen/AudioPlayerContext'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const

type AudioPlayerProps = {
  src: string
  title: string
  episodeId: string
  episodeSlug: string
  durationSeconds?: number | null
  variant?: 'featured' | 'compact' | 'mobile-compact'
  autoPlay?: boolean
}

export function AudioPlayer({
  src,
  title,
  episodeId,
  episodeSlug,
  durationSeconds,
  variant = 'featured',
  autoPlay = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [localPlaying, setLocalPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(durationSeconds || 0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { currentEpisodeId, setPlaying, registerPlayer, unregisterPlayer } = useAudioPlayer()

  const isActive = currentEpisodeId === episodeId
  const isPlaying = isActive && localPlaying
  const showWave = isActive && (localPlaying || currentTime > 0)

  useEffect(() => {
    const pause = () => {
      audioRef.current?.pause()
      setLocalPlaying(false)
    }
    registerPlayer(episodeId, pause)
    return () => unregisterPlayer(episodeId)
  }, [episodeId, registerPlayer, unregisterPlayer])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }
    const onEnded = () => {
      setLocalPlaying(false)
      setPlaying(episodeId, false)
      setCurrentTime(0)
    }
    const onPlay = () => {
      setLocalPlaying(true)
      setPlaying(episodeId, true)
    }
    const onPause = () => {
      setLocalPlaying(false)
      setPlaying(episodeId, false)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [episodeId, setPlaying])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate
  }, [playbackRate])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (!autoPlay) return
    const audio = audioRef.current
    if (!audio) return
    void audio.play().catch(() => {})
  }, [autoPlay, episodeId])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (localPlaying) {
      audio.pause()
    } else {
      void audio.play()
    }
  }

  function seekTo(clientX: number) {
    const track = progressRef.current
    const audio = audioRef.current
    if (!track || !audio || !duration) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
    setCurrentTime(audio.currentTime)
  }

  function cycleSpeed() {
    const idx = SPEEDS.indexOf(playbackRate as (typeof SPEEDS)[number])
    const next = SPEEDS[(idx + 1) % SPEEDS.length]
    setPlaybackRate(next)
  }

  async function shareEpisode() {
    const url = `${window.location.origin}/listen#${episodeSlug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (!isDragging) return
    function onMove(e: MouseEvent) {
      seekTo(e.clientX)
    }
    function onUp() {
      setIsDragging(false)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, duration])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const progressBar = (
    <div
      className="audio-player__progress"
      ref={progressRef}
      role="slider"
      aria-label="Progress"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
      onMouseDown={(e) => {
        setIsDragging(true)
        seekTo(e.clientX)
      }}
      onTouchStart={(e) => seekTo(e.touches[0].clientX)}
      onClick={(e) => seekTo(e.clientX)}
    >
      <div className="audio-player__progress-fill" style={{ width: `${progress}%` }} />
    </div>
  )

  if (variant === 'mobile-compact') {
    return (
      <div className="audio-player audio-player--mobile-compact">
        <audio ref={audioRef} src={src} preload="metadata">
          <a href={src}>Download audio</a>
        </audio>

        {progressBar}

        <div className="audio-player__controls">
          <button
            type="button"
            className="audio-player__play"
            aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
            onClick={togglePlay}
          >
            {isPlaying ? <PauseIcon compact /> : <PlayIcon compact />}
          </button>

          <span className="audio-player__time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button type="button" className="audio-player__speed" onClick={cycleSpeed}>
            {playbackRate}×
          </button>

          <button type="button" className="audio-player__share" onClick={shareEpisode} title="Copy link">
            <ShareIcon compact />
            {copied ? <span className="audio-player__copied">Copied!</span> : null}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`audio-player audio-player--${variant}`}>
      <audio ref={audioRef} src={src} preload="metadata">
        <a href={src}>Download audio</a>
      </audio>

      <div className="audio-player__main">
        <button
          type="button"
          className="audio-player__play"
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          onClick={togglePlay}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {showWave ? (
          <div
            className="audio-player__wave"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            tabIndex={0}
            onClick={(e) => seekTo(e.clientX)}
            onKeyDown={(e) => {
              if (!audioRef.current) return
              if (e.key === 'ArrowRight') audioRef.current.currentTime += 5
              if (e.key === 'ArrowLeft') audioRef.current.currentTime -= 5
            }}
          >
            <SoundWave isPlaying={isPlaying} />
          </div>
        ) : (
          <div className="audio-player__wave audio-player__wave--empty" aria-hidden />
        )}

        <span className="audio-player__time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div
        className="audio-player__progress"
        ref={progressRef}
        role="slider"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
        onMouseDown={(e) => {
          setIsDragging(true)
          seekTo(e.clientX)
        }}
        onTouchStart={(e) => seekTo(e.touches[0].clientX)}
        onClick={(e) => seekTo(e.clientX)}
      >
        <div className="audio-player__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="audio-player__extras">
        <button type="button" className="audio-player__speed" onClick={cycleSpeed}>
          {playbackRate}×
        </button>
        <div className="audio-player__volume">
          <VolumeIcon />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
        <button type="button" className="audio-player__share" onClick={shareEpisode} title="Copy link">
          <ShareIcon />
          {copied ? <span className="audio-player__copied">Copied!</span> : null}
        </button>
      </div>
    </div>
  )
}

function PlayIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? 15 : 20
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? 15 : 20
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  )
}

function VolumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.05a4.48 4.48 0 0 0 2.5-4.02z" />
    </svg>
  )
}

function ShareIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? 16 : 18
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.13-4.11A2.99 2.99 0 1 0 14 4a3 3 0 0 0 .04.5L6.91 8.61a3 3 0 1 0 0 4.78l7.13 4.12A3 3 0 1 0 18 16.08z" />
    </svg>
  )
}
