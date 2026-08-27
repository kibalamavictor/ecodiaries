import { StoryCard } from '@/components/cards/StoryCard'
import type { StoryPreview } from '@/lib/types'

type MobileStoriesCategoryRowProps = {
  title: string
  stories: StoryPreview[]
  layout?: 'single' | 'double'
}

function storiesInPairs(stories: StoryPreview[]): StoryPreview[][] {
  const pairs: StoryPreview[][] = []
  for (let i = 0; i < stories.length; i += 2) {
    pairs.push(stories.slice(i, i + 2))
  }
  return pairs
}

export function MobileStoriesCategoryRow({
  title,
  stories,
  layout = 'double',
}: MobileStoriesCategoryRowProps) {
  if (!stories.length) return null

  if (layout === 'single') {
    return (
      <section className="mobile-stories-category">
        <h2 className="mobile-stories-category__title">{title}</h2>
        <div className="mobile-stories-single-scroll scroll-edge-fade scrollbar-hide">
          {stories.map((story) => (
            <div key={story.slug} className="mobile-stories-single-scroll__item">
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </section>
    )
  }

  const columns = storiesInPairs(stories)

  return (
    <section className="mobile-stories-category">
      <h2 className="mobile-stories-category__title">{title}</h2>
      <div className="mobile-stories-2row-scroll scroll-edge-fade scrollbar-hide">
        {columns.map((column, index) => (
          <div key={`${title}-${index}`} className="mobile-stories-2row-column">
            {column.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
