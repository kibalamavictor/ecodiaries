'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RegionCombobox } from '@/components/solutions/RegionCombobox'
import { FilterPills } from '@/components/ui/FilterPills'
import { GLOBAL_REGION_OPTIONS } from '@/lib/solutions/coordinates'
import {
  SECTOR_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  SECTOR_LABELS,
  type Sector,
  type SolutionStatus,
} from '@/lib/solutions/types'

const sectorFilters = SECTOR_FILTER_OPTIONS.map((o) => ({ label: o.label, slug: o.value }))
const stageFilters = STATUS_FILTER_OPTIONS.map((o) => ({ label: o.label, slug: o.value }))

type AtlasFilterBarDesktopProps = {
  count: number
  sector: Sector | 'all'
  region: string | 'all'
  status: SolutionStatus | 'all'
  query?: string
}

export function AtlasFilterBarDesktop({
  count,
  sector,
  region,
  status,
  query,
}: AtlasFilterBarDesktopProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="mt-10 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <RegionCombobox
          variant="atlas"
          regions={GLOBAL_REGION_OPTIONS}
          value={region}
          onChange={(value) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value === 'all') params.delete('region')
            else params.set('region', value)
            const qs = params.toString()
            router.replace(qs ? `/solutions?${qs}` : '/solutions', { scroll: false })
          }}
        />
        <p className="text-sm font-semibold text-[#5C6457]">
          {count} project{count === 1 ? '' : 's'}
          {sector !== 'all' ? ` · ${SECTOR_LABELS[sector]}` : ''}
          {status !== 'all' ? ` · ${stageFilters.find((s) => s.slug === status)?.label}` : ''}
          {query ? ` · “${query}”` : ''}
        </p>
      </div>

      <div className="space-y-3 atlas-filter-group">
        <p className="text-xs font-bold uppercase tracking-widest text-[#8A9182]">Stage</p>
        <Suspense fallback={null}>
          <FilterPills
            filters={stageFilters}
            paramKey="status"
            basePath="/solutions"
            modalTitle="Filter by stage"
          />
        </Suspense>
      </div>

      <div className="space-y-3 atlas-filter-group">
        <p className="text-xs font-bold uppercase tracking-widest text-[#8A9182]">Sector</p>
        <Suspense fallback={null}>
          <FilterPills
            filters={sectorFilters}
            paramKey="sector"
            basePath="/solutions"
            modalTitle="Filter by sector"
          />
        </Suspense>
      </div>
    </div>
  )
}
