import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { WatchVideoItem } from '@/lib/cms/video-types'
import { MobileCardText } from '@/components/mobile/MobileCardText'
import { cn } from '@/lib/utils'

type MobileVideoCardProps = {
  video: Pick<WatchVideoItem, 'slug' | 'title' | 'duration' | 'image' | 'type' | 'channel' | 'description'>
  onSelect?: () => void
  isActive?: boolean
}

export function MobileVideoCard({ video, onSelect, isActive = false }: MobileVideoCardProps) {
  const className = cn(
    'mobile-scroll-card flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5',
    isActive && 'ring-2 ring-brand-lime',
    onSelect && 'cursor-pointer border-0 p-0 text-left',
  )

  const content = (
    <>
      <div className="mobile-scroll-card__media relative">
        <Image
          src={video.image}
          alt={video.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 767px) 82vw, 320px"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-lime/90">
            <Play className="ml-0.5 h-4 w-4 text-brand-forest" fill="#0C1400" />
          </div>
        </div>
        {video.duration ? (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
            {video.duration}
          </span>
        ) : null}
      </div>
      <MobileCardText
        title={video.title}
        description={video.description}
        metaSecondary={video.channel}
        meta={video.type}
        metaLayout="inline"
      />
    </>
  )

  if (onSelect) {
    return (
      <button type="button" className={className} onClick={onSelect} aria-label={`Play ${video.title}`}>
        {content}
      </button>
    )
  }

  return (
    <Link href={`/watch#${video.slug}`} className={className}>
      {content}
    </Link>
  )
}
