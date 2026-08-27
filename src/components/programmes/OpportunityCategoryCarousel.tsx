'use client'

import { ProgrammeCard } from '@/components/programmes/ProgrammeCard'
import { SeeMoreCard } from '@/components/mobile/SeeMoreCard'
import {
  CATEGORY_CAROUSEL_VISIBLE,
  OPPORTUNITY_TYPE_SLUGS,
  categorySectionTitle,
} from '@/lib/programmes/categories'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { opportunitiesListPath } from '@/lib/programmes/routes'
import type { OpportunityType, Programme } from '@/lib/programmes/types'

type OpportunityCategoryCarouselProps = {
  category: OpportunityType
  programmes: Programme[]
}

export function OpportunityCategoryCarousel({ category, programmes }: OpportunityCategoryCarouselProps) {
  if (!programmes.length) return null

  const visible = programmes.slice(0, CATEGORY_CAROUSEL_VISIBLE)
  const remaining = Math.max(programmes.length - CATEGORY_CAROUSEL_VISIBLE, 0)
  const typeSlug = OPPORTUNITY_TYPE_SLUGS[category]
  const collage = programmes
    .slice(CATEGORY_CAROUSEL_VISIBLE, CATEGORY_CAROUSEL_VISIBLE + 2)
    .map((programme) => getProgrammeImageUrl(programme.slug, 320, 200))

  return (
    <section className="opportunities-category" id={`opportunities-${typeSlug}`} aria-label={categorySectionTitle(category)}>
      <div className="opportunities-section-head opportunities-section-head--row">
        <div>
          <h2 className="opportunities-section-head__title">{categorySectionTitle(category)}</h2>
          <p className="opportunities-section-head__lede">
            {programmes.length} opportunit{programmes.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
      </div>

      <div className="opportunities-category__track scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
        {visible.map((programme) => (
          <div key={programme.slug} className="opportunities-carousel__card-shell" style={{ scrollSnapAlign: 'start' }}>
            <ProgrammeCard programme={programme} />
          </div>
        ))}
        {remaining > 0 ? (
          <div className="opportunities-carousel__card-shell opportunities-carousel__card-shell--see-more" style={{ scrollSnapAlign: 'start' }}>
            <SeeMoreCard
              label={categorySectionTitle(category)}
              countText={`See ${remaining} more`}
              href={opportunitiesListPath(`type=${typeSlug}&view=all`)}
              images={collage}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
