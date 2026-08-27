'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { formatTime } from '@/lib/cms/format-time'
import type { WatchVideoItem } from '@/lib/cms/video-types'

export function FeaturedVideoPlayer({
  video,
  playerRef,
}: {
  video: WatchVideoItem
  playerRef?: React.RefObject<HTMLDivElement | null>
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileReady, setMobileReady] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(video.durationSeconds || 0)
  const [volume, setVolume] = useState(1)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [embedStarted, setEmbedStarted] = useState(false)

  const isFile = video.playback?.kind === 'file'
  const canPlay = Boolean(video.playback)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    setMobileReady(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setHasStarted(false)
    setEmbedStarted(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setIsMuted(true)
    setDuration(video.durationSeconds || 0)
  }, [video.slug, video.durationSeconds])

  useEffect(() => {
    if (!mobileReady || !isFile || isMobile) return
    const el = videoRef.current
    if (!el) return
    el.muted = true
    void el.play().then(() => {
      setHasStarted(true)
      setIsPlaying(true)
    }).catch(() => {})
  }, [video.slug, isFile, isMobile, mobileReady])

  useEffect(() => {
    if (!isFile || !isMobile || !hasStarted) return
    const el = videoRef.current
    if (!el) return
    el.muted = false
    setIsMuted(false)
    void el.play().catch(() => {})
  }, [isFile, isMobile, hasStarted, video.slug])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !isFile) return
    const shouldWire = isMobile ? hasStarted : true
    if (!shouldWire) return

    const onTime = () => setCurrentTime(el.currentTime)
    const onMeta = () => {
      if (el.duration && Number.isFinite(el.duration)) setDuration(el.duration)
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [isFile, video.slug, hasStarted, isMobile])

  const showControls = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000)
  }, [])

  function seekTo(clientX: number) {
    const track = trackRef.current
    const el = videoRef.current
    if (!track || !el || !duration) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    el.currentTime = ratio * duration
    setCurrentTime(el.currentTime)
  }

  function togglePlay() {
    const el = videoRef.current
    if (!el) return
    if (isPlaying) el.pause()
    else void el.play()
    showControls()
  }

  function unmute() {
    const el = videoRef.current
    if (!el) return
    el.muted = false
    setIsMuted(false)
    if (!isPlaying) void el.play()
    showControls()
  }

  function toggleFullscreen() {
    const container = playerRef?.current
    if (!container) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void container.requestFullscreen()
    showControls()
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const showPoster = isFile && (!mobileReady || (isMobile && !hasStarted))
  const showFilePlayer = isFile && mobileReady && (hasStarted || !isMobile)

  return (
    <div className="featured-video-wrap" ref={playerRef} id="watch-player">
      <header className="watch-featured-header">
        <span className="watch-featured-header__meta">
          {video.type}
          {video.duration ? ` · ${video.duration}` : ''}
        </span>
        <h2 className="watch-featured-header__title">{video.title}</h2>
        {video.description ? (
          <p className="watch-featured-header__description">{video.description}</p>
        ) : null}
      </header>

      <div
        className={`featured-video-media${controlsVisible ? ' is-controls-visible' : ''}`}
        style={{ aspectRatio: '16/7.5' }}
        onMouseMove={showControls}
        onTouchStart={showControls}
      >
        {!canPlay ? (
          <>
            <Image src={video.image} alt={video.title} fill sizes="100vw" className="watch-player-poster" />
            <div className="watch-player-empty">
              <p>Video coming soon — add a YouTube/Vimeo link or upload a file in Studio → Watch.</p>
            </div>
          </>
        ) : video.playback?.kind === 'embed' ? (
          embedStarted ? (
            <iframe
              src={video.playback.src}
              title={video.title}
              className="watch-player-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="featured-video-mobile-thumb"
              style={{ display: 'block', width: '100%', height: '100%', border: 'none', padding: 0, cursor: 'pointer' }}
              onClick={() => setEmbedStarted(true)}
            >
              <Image src={video.image} alt={video.title} fill sizes="100vw" />
              <span className="featured-video-play-large" aria-hidden>
                <PlayIcon />
              </span>
            </button>
          )
        ) : showPoster ? (
          <div className="featured-video-mobile-thumb">
            <Image src={video.image} alt={video.title} fill sizes="100vw" priority />
            <button
              type="button"
              className="featured-video-play-large"
              onClick={() => setHasStarted(true)}
              aria-label={`Play ${video.title}`}
            >
              <PlayIcon />
            </button>
          </div>
        ) : showFilePlayer ? (
          <>
            <video
              ref={videoRef}
              className="featured-video-element"
              src={video.playback?.src}
              poster={video.image}
              playsInline
              loop
              muted={isMuted}
              preload="metadata"
            >
              <a href={video.playback?.src}>Watch {video.title}</a>
            </video>

            {isMuted && isPlaying ? (
              <button type="button" className="featured-video-unmute" onClick={unmute}>
                <MuteIcon /> Tap to unmute &amp; watch
              </button>
            ) : null}

            <div
              className="video-progress-track"
              ref={trackRef}
              role="slider"
              aria-label="Video progress"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              tabIndex={0}
              onClick={(e) => seekTo(e.clientX)}
            >
              <div className="video-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="video-controls-overlay">
              <div className="video-controls-row">
                <button type="button" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <span className="video-controls-time">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div className="video-controls-volume">
                  <VolumeIcon />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setVolume(v)
                      if (videoRef.current) videoRef.current.volume = v
                    }}
                    aria-label="Volume"
                  />
                </div>
                <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen">
                  <FullscreenIcon />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  )
}

function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.05A4.48 4.48 0 0 0 16.5 12zM3 10v4h4l5 5V5L7 10H3z" />
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

function FullscreenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  )
}
