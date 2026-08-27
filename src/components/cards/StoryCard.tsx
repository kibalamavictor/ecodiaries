import Image from 'next/image'
import Link from 'next/link'
import { MobileCardText } from '@/components/mobile/MobileCardText'
import type { StoryPreview } from '@/lib/types'

type StoryCardProps = {
  story: Pick<StoryPreview, 'slug' | 'title' | 'image' | 'category' | 'author' | 'readTime' | 'excerpt'>
  compact?: boolean
  href?: string
  description?: string
  meta?: string
  metaSecondary?: string
  metaLayout?: 'inline' | 'stacked'
  topBadge?: string
}

export function StoryCard({
  story,
  compact = false,
  href,
  description,
  meta,
  metaSecondary,
  metaLayout,
  topBadge,
}: StoryCardProps) {
  const link = href ?? `/stories/${story.slug}`
  const authorName = story.author?.name
  const readTime = story.readTime?.toLowerCase()
  const cardDescription = compact ? undefined : (description ?? story.excerpt)

  let resolvedMeta = meta
  let resolvedMetaSecondary = metaSecondary
  let resolvedMetaLayout = metaLayout

  if (meta === undefined && metaSecondary === undefined) {
    if (authorName && readTime) {
      resolvedMetaSecondary = authorName
      resolvedMeta = readTime
      resolvedMetaLayout = 'inline'
    } else {
      resolvedMeta = authorName ?? readTime ?? story.category
      resolvedMetaLayout = 'stacked'
    }
  }

  return (
    <Link
      href={link}
      className={`story-card mobile-scroll-card${compact ? ' story-card--compact' : ''}`}
    >
      <div className="mobile-scroll-card__media story-thumb">
        <Image
          src={story.image}
          alt=""
          fill
          className="story-thumb__image"
          sizes="(max-width: 767px) 82vw, 25vw"
          quality={68}
          loading="lazy"
          decoding="async"
        />
        {topBadge ? (
          <span className="story-card__badge story-card__badge--top">{topBadge}</span>
        ) : (
          <span className="story-thumb__category">{story.category}</span>
        )}
      </div>
      <MobileCardText
        title={story.title}
        description={cardDescription}
        meta={resolvedMeta}
        metaSecondary={resolvedMetaSecondary}
        metaLayout={resolvedMetaLayout}
        metaAvatarUrl={story.author?.avatar}
      />
    </Link>
  )
}
