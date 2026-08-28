import Image from 'next/image'
import Link from 'next/link'

export type MagCardItem = {
  href: string
  image: string
  category: string
  title: string
  excerpt?: string
  byline?: string
  authorName?: string
  avatar?: string
}

type MagCardProps = {
  item: MagCardItem
  size?: 'sm' | 'md' | 'lg'
  heading?: 'h2' | 'h3' | 'h4'
  chip?: 'overlay' | 'below'
}

export function MagCard({
  item,
  size = 'md',
  heading: Heading = 'h3',
  chip = 'overlay',
}: MagCardProps) {
  return (
    <Link href={item.href} className={`mag-card mag-card--${size} mag-card--chip-${chip}`}>
      <div className="mag-card__media">
        <Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" />
        {chip === 'overlay' ? <span className="mag-chip mag-card__chip">{item.category}</span> : null}
      </div>
      {chip === 'below' ? <span className="mag-chip mag-card__chip-below">{item.category}</span> : null}
      <Heading className="mag-title">{item.title}</Heading>
      {item.excerpt && size !== 'sm' ? <p className="mag-excerpt">{item.excerpt}</p> : null}
      {item.byline ? <p className="mag-meta">{item.byline}</p> : null}
    </Link>
  )
}
