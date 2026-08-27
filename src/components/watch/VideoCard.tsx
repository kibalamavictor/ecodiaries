import Image from 'next/image'
import type { WatchVideoItem } from '@/lib/cms/video-types'

function formatDate(publishedAt?: string) {
  if (!publishedAt) return ''
  return new Date(publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function VideoCard({
  video,
  isActive,
  onSelect,
}: {
  video: WatchVideoItem
  isActive?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={`video-card-item${isActive ? ' is-now-playing' : ''}`}
      onClick={onSelect}
    >
      <div className="video-card-item__thumb">
        <Image
          src={video.image}
          alt=""
          fill
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 65vw, 25vw"
        />
        <span className="video-card-item__play" aria-hidden>
          <PlayIcon />
        </span>
        {video.duration ? <span className="video-card-item__duration">{video.duration}</span> : null}
        {isActive ? <span className="video-card-item__now-playing">Now Playing</span> : null}
      </div>
      <div className="video-card-item__body">
        <span className="tag">{video.type}</span>
        <h3>{video.title}</h3>
        <p className="video-card-item__meta">
          {video.channel}
          {video.publishedAt ? ` · ${formatDate(video.publishedAt)}` : ''}
        </p>
      </div>
    </button>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
