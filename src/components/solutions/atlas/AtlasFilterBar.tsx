'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RegionCombobox } from '@/components/solutions/RegionCombobox'
import { AtlasViewToggle } from '@/components/solutions/atlas/AtlasViewToggle'
import { FilterPills } from '@/components/ui/FilterPills'
import { ATLAS_REGION_FILTER_OPTIONS } from '@/lib/solutions/coordinates'
import {
  SECTOR_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  SECTOR_LABELS,
  type Sector,
  type SolutionStatus,
} from '@/lib/solutions/types'

const sectorFilters = SECTOR_FILTER_OPTIONS.map((o) => ({ label: o.label, slug: o.value }))
const stageFilters = STATUS_FILTER_OPTIONS.map((o) => ({ label: o.label, slug: o.value }))

type ViewMode = 'atlas' | 'grid'

type AtlasFilterBarProps = {
  count: number
  sector: Sector | 'all'
  region: string | 'all'
  status: SolutionStatus | 'all'
  query?: string
  view: ViewMode
  onViewChange: (mode: ViewMode) => void
}

export function AtlasFilterBar({ count, sector, region, status, query, view, onViewChange }: AtlasFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="atlas-filter-bar">
      <div className="atlas-filter-toolbar">
        <div className="atlas-filter-toolbar__controls">
          <RegionCombobox
            variant="atlas"
            sections={[
              { label: 'Africa', regions: ATLAS_REGION_FILTER_OPTIONS.africa },
              { label: 'Global — ready to replicate in Africa', regions: ATLAS_REGION_FILTER_OPTIONS.global },
            ]}
            value={region}
            onChange={(value) => {
              const params = new URLSearchParams(searchParams.toString())
              if (value === 'all') params.delete('region')
              else params.set('region', value)
              const qs = params.toString()
              router.replace(qs ? `/solutions?${qs}` : '/solutions', { scroll: false })
            }}
          />
          <AtlasViewToggle view={view} onChange={onViewChange} />
        </div>
        <p className="atlas-filter-toolbar__count">
          {count} project{count === 1 ? '' : 's'}
          {sector !== 'all' ? ` · ${SECTOR_LABELS[sector]}` : ''}
          {status !== 'all' ? ` · ${stageFilters.find((s) => s.slug === status)?.label}` : ''}
          {query ? ` · “${query}”` : ''}
        </p>
      </div>

      <div className="atlas-filter-groups">
        <div className="atlas-filter-group">
          <p className="atlas-filter-group__label">Stage</p>
          <Suspense fallback={null}>
            <FilterPills
              filters={stageFilters}
              paramKey="status"
              basePath="/solutions"
              modalTitle="Filter by stage"
            />
          </Suspense>
        </div>

        <div className="atlas-filter-group">
          <p className="atlas-filter-group__label">Sector</p>
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
    </div>
  )
}
