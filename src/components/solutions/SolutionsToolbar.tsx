import { Suspense } from 'react'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { FilterPills } from '@/components/ui/FilterPills'
import { SECTOR_FILTER_OPTIONS } from '@/lib/solutions/types'

const sectorFilters = SECTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value,
}))

type SolutionsToolbarProps = {
  defaultQuery?: string
}

export function SolutionsToolbar({ defaultQuery }: SolutionsToolbarProps) {
  return (
    <div className="solutions-toolbar">
      <Suspense fallback={null}>
        <HeroSearch
          className="hero-search solutions-toolbar__search"
          action="/solutions"
          defaultValue={defaultQuery}
          placeholder="Search solutions, sectors, or places…"
          preserveParams
        />
      </Suspense>
      <Suspense fallback={null}>
        <div className="solutions-toolbar__filters">
          <FilterPills
            filters={sectorFilters}
            paramKey="sector"
            basePath="/solutions"
            modalTitle="Filter by sector"
          />
        </div>
      </Suspense>
    </div>
  )
}
