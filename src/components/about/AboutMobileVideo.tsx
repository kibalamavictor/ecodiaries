import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { AboutVideoMedia } from '@/lib/about/about-page-media'

type AboutMobileVideoProps = {
  media: AboutVideoMedia
  priority?: boolean
  caption?: string
}

export function AboutMobileVideo({ media, priority = false, caption }: AboutMobileVideoProps) {
  if (media.kind === 'missing') {
    return (
      <div className="about-mobile__video-wrap">
        <div className="about-mobile__video about-mobile__video--pending" role="status">
          <p className="about-mobile__video-flag">{media.flag}</p>
          <p className="about-mobile__video-flag-detail">{media.detail}</p>
        </div>
        {caption ? <p className="about-mobile__video-caption">{caption}</p> : null}
      </div>
    )
  }

  const image = (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      className="object-cover object-center"
      sizes="100vw"
      priority={priority}
    />
  )

  return (
    <div className="about-mobile__video-wrap">
      <div className="about-mobile__video">
        <Link href={media.href} className="about-mobile__video-link" aria-label={`Watch ${media.alt}`}>
          {image}
          <span className="about-mobile__video-scrim" aria-hidden />
          <span className="about-mobile__play" aria-hidden>
            <Play className="about-mobile__play-icon" fill="currentColor" strokeWidth={0} />
          </span>
        </Link>
      </div>
      {caption ? <p className="about-mobile__video-caption">{caption}</p> : null}
    </div>
  )
}
