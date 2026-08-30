import { Suspense } from 'react'
import { FilterPills } from '@/components/ui/FilterPills'
import { SECTOR_FILTER_OPTIONS } from '@/lib/solutions/types'

const sectorFilters = SECTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value,
}))

export function SolutionsToolbar() {
  return (
    <div className="solutions-toolbar">
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
