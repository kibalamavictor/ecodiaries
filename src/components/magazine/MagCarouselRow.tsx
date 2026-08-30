import Link from 'next/link'
import { ArticleCard } from '@/components/magazine/ArticleCard'
import { MagSeeMoreCard } from '@/components/magazine/MagSeeMoreCard'
import type { MagCardItem } from '@/components/magazine/MagCard'
import { magCardKey } from '@/lib/magazine'

const MOBILE_ROW_LIMIT = 4

type MagCarouselRowProps = {
  title: string
  href: string
  items: MagCardItem[]
  seeMoreLabel: string
  seeMoreSubtitle: string
}

export function MagCarouselRow({
  title,
  href,
  items,
  seeMoreLabel,
  seeMoreSubtitle,
}: MagCarouselRowProps) {
  if (!items.length) return null

  const visible = items.slice(0, MOBILE_ROW_LIMIT)
  const collage = visible.map((item) => item.image).filter(Boolean)

  return (
    <section className="mag-carousel magazine-mobile" aria-label={title}>
      <div className="site-container mag-carousel__head">
        <Link href={href} prefetch={false} className="mag-carousel__title">
          {title}
          <span className="mag-carousel__title-cue" aria-hidden>
            ›
          </span>
        </Link>
      </div>
      <div className="carousel-track-shell">
        <div className="carousel-track">
          {visible.map((item) => (
            <div key={magCardKey(item)} className="carousel-track__item">
              <ArticleCard item={item} layout="carousel" />
            </div>
          ))}
          <div className="carousel-track__item">
            <MagSeeMoreCard
              href={href}
              label={seeMoreLabel}
              subtitle={seeMoreSubtitle}
              images={collage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
