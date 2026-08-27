'use client'

import { useRef } from 'react'
import type { WatchVideoItem } from '@/lib/cms/video-types'
import { VideoCard } from '@/components/watch/VideoCard'

export function VideoCarousel({
  videos,
  activeSlug,
  onSelect,
}: {
  videos: WatchVideoItem[]
  activeSlug?: string
  onSelect: (slug: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scrollBy(direction: -1 | 1) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.video-card-item') as HTMLElement | null
    const step = card ? card.offsetWidth + 16 : 280
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  if (!videos.length) return null

  return (
    <div className="video-carousel-outer">
      <button type="button" className="carousel-btn carousel-btn--prev" onClick={() => scrollBy(-1)} aria-label="Previous videos">
        ‹
      </button>
      <div className="video-carousel-track" ref={trackRef}>
        {videos.map((video) => (
          <VideoCard
            key={video.slug}
            video={video}
            isActive={video.slug === activeSlug}
            onSelect={() => onSelect(video.slug)}
          />
        ))}
      </div>
      <button type="button" className="carousel-btn carousel-btn--next" onClick={() => scrollBy(1)} aria-label="Next videos">
        ›
      </button>
    </div>
  )
}
