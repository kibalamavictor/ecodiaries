'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { OpportunitiesFeaturedCarousel } from '@/components/programmes/OpportunitiesFeaturedCarousel'
import { OpportunityCategoryCarousel } from '@/components/programmes/OpportunityCategoryCarousel'
import { ProgrammeCard } from '@/components/programmes/ProgrammeCard'
import { ProgrammeFilters } from '@/components/programmes/ProgrammeFilters'
import {
  OPPORTUNITY_CATEGORY_ORDER,
  opportunityTypeFromSlug,
} from '@/lib/programmes/categories'
import { programmeFilterSummary } from '@/lib/programmes/filters'
import {
  featuredProgrammes,
  prepareProgrammesList,
  programmesForCategory,
} from '@/lib/programmes/list'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'
import type { OpportunityType, Programme } from '@/lib/programmes/types'

function categoriesToShow(type: string): OpportunityType[] {
  const match = opportunityTypeFromSlug(type)
  if (match) return [match]
  return [...OPPORTUNITY_CATEGORY_ORDER]
}

export function ProgrammesGrid({ programmes }: { programmes: Programme[] }) {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'all'
  const age = searchParams.get('age') || 'all'
  const query = searchParams.get('q') || ''
  const viewAll = searchParams.get('view') === 'all'
  const isSearchActive = Boolean(query.trim())

  const filteredProgrammes = useMemo(
    () => prepareProgrammesList(programmes, type, age, query),
    [programmes, type, age, query],
  )

  const featured = useMemo(() => {
    const pool =
      type === 'all'
        ? filteredProgrammes
        : filteredProgrammes.filter((programme) => {
            const match = opportunityTypeFromSlug(type)
            return match ? programme.opportunityType === match : true
          })
    return featuredProgrammes(pool)
  }, [filteredProgrammes, type])

  const activeLabel = programmeFilterSummary(type, age, query)
  const sections = categoriesToShow(type)
  const expandedCategory = viewAll ? opportunityTypeFromSlug(type) : null
  const showResultsGrid = Boolean(expandedCategory || isSearchActive)

  return (
    <section className="programmes-grid-section" id="opportunities">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
        <ProgrammeFilters />

        {showResultsGrid ? (
          <div className="opportunities-expanded">
            <div className="opportunities-section-head">
              <h2 className="opportunities-section-head__title">
                {isSearchActive ? 'Search results' : `All ${activeLabel.toLowerCase()}`}
              </h2>
              <p className="opportunities-section-head__lede">
                Showing {filteredProgrammes.length} opportunit{filteredProgrammes.length === 1 ? 'y' : 'ies'}
                <span className="programmes-grid__count-filter"> · {activeLabel}</span>
              </p>
            </div>
            {filteredProgrammes.length === 0 ? (
              <p className="programmes-grid__empty">
                {isSearchActive
                  ? 'No opportunities match your search yet.'
                  : 'No opportunities match these filters yet.'}
              </p>
            ) : (
              <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProgrammes.map((programme) => (
                  <div key={programme.slug} className="h-full">
                    <ProgrammeCard programme={programme} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="opportunities-browse">
            {type === 'all' ? <OpportunitiesFeaturedCarousel programmes={featured} /> : null}

            {sections.map((category) => (
              <OpportunityCategoryCarousel
                key={category}
                category={category}
                programmes={programmesForCategory(filteredProgrammes, category)}
              />
            ))}

            {filteredProgrammes.length === 0 ? (
              <p className="programmes-grid__empty">No opportunities match these filters yet.</p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
