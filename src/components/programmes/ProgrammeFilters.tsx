'use client'

import { Suspense } from 'react'
import { FilterPills } from '@/components/ui/FilterPills'
import { PROGRAMME_AGE_FILTERS, PROGRAMME_TYPE_FILTERS } from '@/lib/programmes/filters'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'

export function ProgrammeFilters() {
  return (
    <div className="programmes-filters">
      <Suspense fallback={null}>
        <FilterPills
          filters={[...PROGRAMME_TYPE_FILTERS]}
          paramKey="type"
          basePath={OPPORTUNITIES_PATH}
          modalTitle="Filter by opportunity type"
        />
      </Suspense>
      <Suspense fallback={null}>
        <FilterPills
          filters={[...PROGRAMME_AGE_FILTERS]}
          paramKey="age"
          basePath={OPPORTUNITIES_PATH}
          modalTitle="Filter by posting age"
        />
      </Suspense>
    </div>
  )
}
