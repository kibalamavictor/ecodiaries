import { MagCarouselRow } from '@/components/magazine/MagCarouselRow'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import type { MagCardItem } from '@/components/magazine/MagCard'

type MagMobileFeedProps = {
  latest: MagCardItem[]
  solutions: MagCardItem[]
  more: MagCardItem[]
  newsletterImage: string
}

export function MagMobileFeed({
  latest,
  solutions,
  more,
  newsletterImage,
}: MagMobileFeedProps) {
  return (
    <div className="magazine-mobile">
      <MagCarouselRow
        title="Latest stories"
        href="/stories"
        items={latest}
        seeMoreLabel="See all stories"
        seeMoreSubtitle="Browse the archive"
      />
      <MagCarouselRow
        title="On the ground"
        href="/solutions"
        items={solutions}
        seeMoreLabel="See all solutions"
        seeMoreSubtitle="Open the atlas"
      />
      <MagCarouselRow
        title="More from EcoDiaries"
        href="/stories"
        items={more}
        seeMoreLabel="Browse archive"
        seeMoreSubtitle="More in stories"
      />
      <MagNewsletter image={newsletterImage} anchor={false} />
    </div>
  )
}
