import { ArticleCard } from '@/components/magazine/ArticleCard'
import type { MagCardItem } from '@/components/magazine/MagCard'
import { magCardKey } from '@/lib/magazine'

type MagMobileGridProps = {
  items: MagCardItem[]
  empty?: string
}

export function MagMobileGrid({ items, empty }: MagMobileGridProps) {
  if (!items.length) {
    return <p className="mag-excerpt">{empty || 'Nothing matches these filters yet.'}</p>
  }

  return (
    <div className="article-card-grid">
      {items.map((item) => (
        <ArticleCard key={magCardKey(item)} item={item} layout="grid" />
      ))}
    </div>
  )
}
