'use client'

import { Suspense, useEffect, useState } from 'react'
import { FilterPills } from '@/components/ui/FilterPills'
import { ChangemakerCard } from '@/components/changemakers/ChangemakerCard'
import type { ChangemakerProfile } from '@/lib/cms/organizations'
import { ORG_TYPE_FILTER_OPTIONS } from '@/lib/changemakers/filters'

const PAGE_SIZE = 10

function ChangemakerFilters() {
  return (
    <Suspense fallback={null}>
      <FilterPills
        filters={[...ORG_TYPE_FILTER_OPTIONS]}
        paramKey="type"
        basePath="/changemakers"
        modalTitle="Filter by organisation type"
      />
    </Suspense>
  )
}

export function ChangemakersGrid({ changemakers }: { changemakers: ChangemakerProfile[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [changemakers])

  const shown = changemakers.slice(0, visibleCount)
  const hasMore = visibleCount < changemakers.length

  return (
    <>
      <ChangemakerFilters />
      <p className="changemakers-grid__count">
        Showing {shown.length} of {changemakers.length} organisation{changemakers.length === 1 ? '' : 's'}
      </p>
      {changemakers.length === 0 ? (
        <p className="changemakers-grid__empty">No organisations in this category yet.</p>
      ) : (
        <>
          <div className="changemakers-grid__cards">
            {shown.map((org) => (
              <ChangemakerCard key={org.id} org={org} compact />
            ))}
          </div>
          {hasMore ? (
            <div className="changemakers-grid__more-wrap">
              <button
                type="button"
                className="changemakers-grid__more-btn"
                onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, changemakers.length))}
              >
                See more
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  )
}
