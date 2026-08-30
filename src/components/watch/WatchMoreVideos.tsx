'use client'

import { MobileVideoCard } from '@/components/mobile/MobileVideoCard'
import type { WatchVideoItem } from '@/lib/cms/video-types'

type WatchMoreVideosProps = {
  videos: WatchVideoItem[]
  activeSlug?: string
  onSelect: (slug: string) => void
}

export function WatchMoreVideos({ videos, activeSlug, onSelect }: WatchMoreVideosProps) {
  if (!videos.length) return null

  return (
    <div className="watch-more-scroll mobile-scroll-card-scope scroll-edge-fade scrollbar-hide">
      <div className="watch-more-grid">
        {videos.map((video) => (
          <div key={video.slug} className="watch-more-grid__item">
            <MobileVideoCard
              video={video}
              onSelect={() => onSelect(video.slug)}
              isActive={video.slug === activeSlug}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
