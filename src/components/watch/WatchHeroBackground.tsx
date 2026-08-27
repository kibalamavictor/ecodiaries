'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

type WatchHeroBackgroundProps = {
  poster: string
  videoSrc?: string | null
}

export function WatchHeroBackground({ poster, videoSrc }: WatchHeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoSrc) return

    const video = videoRef.current
    if (!video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    video.muted = true
    void video.play().catch(() => {})
  }, [videoSrc])

  return (
    <div className="watch-hero-media" aria-hidden>
      <Image src={poster} alt="" fill priority className="watch-hero-media__poster" sizes="100vw" />
      {videoSrc ? (
        <video
          ref={videoRef}
          className="watch-hero-media__video"
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      ) : null}
      <div className="watch-hero-scrim" />
    </div>
  )
}
