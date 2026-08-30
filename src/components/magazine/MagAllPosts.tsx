import { MagArchiveMobile } from '@/components/magazine/MagArchiveMobile'
import { MagCard, type MagCardItem } from '@/components/magazine/MagCard'
import { MagTrending } from '@/components/magazine/MagTrending'

type MagAllPostsProps = {
  items: MagCardItem[]
  trending: MagCardItem[]
  empty?: string
  query?: string
}

export function MagAllPosts({ items, trending, empty, query }: MagAllPostsProps) {
  const useSpread = !query && items.length >= 3
  const feature = useSpread ? items[0] : null
  const left = useSpread ? items.slice(1, 3) : []
  const right = useSpread ? items.slice(3, 5) : []
  const rest = useSpread ? items.slice(5) : items

  return (
    <section className="mag-archive">
      <h1 className="sr-only">Stories</h1>
      <div className="mag-wrap magazine-desktop-archive">
        {query ? (
          <p className="mag-meta mag-archive__query">
            {items.length} result{items.length === 1 ? '' : 's'} for “{query}”
          </p>
        ) : null}

        {feature ? (
          <div className="mag-allpost">
            <div className="mag-allpost__col">
              {left.map((item) => (
                <MagCard key={item.href} item={item} size="sm" heading="h3" chip="below" />
              ))}
            </div>
            <article className="mag-allpost__feature">
              <MagCard item={feature} size="lg" heading="h2" chip="below" />
            </article>
            <div className="mag-allpost__col">
              {right.map((item) => (
                <MagCard key={item.href} item={item} size="sm" heading="h3" chip="below" />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mag-split">
          <div>
            {rest.length > 0 ? (
              <div className="mag-archive__grid">
                {rest.map((item) => (
                  <MagCard key={item.href} item={item} heading="h3" chip="below" />
                ))}
              </div>
            ) : null}
            {items.length === 0 ? (
              <p className="mag-excerpt" style={{ marginTop: 12 }}>
                {empty || 'No stories found. Try a different search or category.'}
              </p>
            ) : null}
          </div>
          {trending.length > 0 ? <MagTrending items={trending} /> : null}
        </div>
      </div>
      <MagArchiveMobile
        items={items}
        empty={empty || 'No stories found. Try a different search or category.'}
      />
    </section>
  )
}
