import Image from 'next/image'
import Link from 'next/link'
import type { MagCardItem } from '@/components/magazine/MagCard'

type ArticleCardProps = {
  item: MagCardItem
  layout?: 'carousel' | 'grid'
  heading?: 'h2' | 'h3' | 'h4'
  showExcerpt?: boolean
}

export function ArticleCard({
  item,
  layout = 'carousel',
  heading: Heading = 'h3',
  showExcerpt = layout === 'grid',
}: ArticleCardProps) {
  const image = item.image || '/logo.svg'
  const meta = item.byline || item.category

  return (
    <Link href={item.href} prefetch={false} className={`article-card article-card--${layout}`}>
      <span className="article-card__media">
        <Image
          src={image}
          alt=""
          fill
          quality={70}
          sizes={layout === 'grid' ? '(max-width: 639px) 45vw, 33vw' : '(max-width: 639px) 70vw, 33vw'}
        />
      </span>
      <span className="article-card__body">
        <Heading className="article-card__title">{item.title}</Heading>
        {meta ? <p className="article-card__meta">{meta}</p> : null}
        {showExcerpt && item.excerpt ? <p className="article-card__excerpt">{item.excerpt}</p> : null}
      </span>
    </Link>
  )
}
