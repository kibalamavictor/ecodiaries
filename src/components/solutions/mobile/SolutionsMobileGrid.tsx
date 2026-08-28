'use client'

import { Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FilterPills } from '@/components/ui/FilterPills'
import { AtlasViewToggle } from '@/components/solutions/atlas/AtlasViewToggle'
import { AtlasProjectGrid } from '@/components/solutions/atlas/AtlasProjectGrid'
import { SolutionsGridFundingTile } from '@/components/solutions/mobile/SolutionsGridFundingTile'
import { MagCard } from '@/components/magazine/MagCard'
import { atlasProjectToMagCard } from '@/lib/magazine'
import { projectMatchesRegionFilter } from '@/lib/solutions/coordinates'
import {
  SECTOR_FILTER_OPTIONS,
  type AtlasProject,
  type Sector,
  type SolutionStatus,
} from '@/lib/solutions/types'

const FUNDING_TILE_INTERVAL = 7

const sectorFilters = SECTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value,
}))

type SolutionsMobileGridProps = {
  projects: AtlasProject[]
}

function filterProjects(
  projects: AtlasProject[],
  sector: Sector | 'all',
  region: string | 'all',
  status: SolutionStatus | 'all',
  query: string,
): AtlasProject[] {
  return projects.filter((project) => {
    if (sector !== 'all' && !project.sectors.includes(sector)) return false
    if (!projectMatchesRegionFilter(project, region)) return false
    if (status !== 'all' && project.status !== status) return false
    if (query) {
      const q = query.toLowerCase()
      if (
        !project.title.toLowerCase().includes(q) &&
        !project.summary.toLowerCase().includes(q) &&
        !project.region.toLowerCase().includes(q) &&
        !(project.organization?.name.toLowerCase().includes(q) ?? false)
      ) {
        return false
      }
    }
    return true
  })
}

type GridItem =
  | { type: 'solution'; project: AtlasProject }
  | { type: 'funding' }

function buildGridItems(projects: AtlasProject[]): GridItem[] {
  const items: GridItem[] = []

  projects.forEach((project, index) => {
    items.push({ type: 'solution', project })
    if ((index + 1) % FUNDING_TILE_INTERVAL === 0) {
      items.push({ type: 'funding' })
    }
  })

  return items
}

export function SolutionsMobileGrid({ projects }: SolutionsMobileGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const sector = (searchParams.get('sector') as Sector | null) || 'all'
  const region = searchParams.get('region') || 'all'
  const status = (searchParams.get('status') as SolutionStatus | null) || 'all'
  const query = searchParams.get('q') || ''

  const filtered = useMemo(
    () => filterProjects(projects, sector, region, status, query),
    [projects, sector, region, status, query],
  )
  const gridItems = useMemo(() => buildGridItems(filtered), [filtered])

  function syncView(mode: 'atlas' | 'grid') {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === 'grid') params.delete('view')
    else params.set('view', 'atlas')
    const qs = params.toString()
    router.replace(qs ? `/solutions?${qs}` : '/solutions', { scroll: false })
  }

  return (
    <section id="explore" className="mag-section solutions-mobile-grid">
      <div className="mag-wrap">
        <div className="mag-section-head">
          <h2>Solutions atlas</h2>
          <AtlasViewToggle view="grid" onChange={syncView} />
        </div>

        <Suspense fallback={null}>
          <div className="solutions-mobile-grid__filters">
            <FilterPills
              filters={sectorFilters}
              paramKey="sector"
              basePath="/solutions"
              modalTitle="Filter by sector"
            />
          </div>
        </Suspense>

        <p className="atlas-filter-toolbar__count">
          {filtered.length} project{filtered.length === 1 ? '' : 's'}
        </p>

        {!gridItems.length ? (
          <p className="atlas-grid-empty">No projects match these filters yet.</p>
        ) : gridItems.some((item) => item.type === 'funding') ? (
          <div className="atlas-grid atlas-grid--compact">
            {gridItems.map((item, index) =>
              item.type === 'funding' ? (
                <SolutionsGridFundingTile
                  key={`funding-${index}`}
                  projectCount={projects.length}
                  projects={projects}
                />
              ) : (
                <MagCard
                  key={item.project.id}
                  item={atlasProjectToMagCard(item.project)}
                  size="sm"
                  heading="h3"
                  chip="below"
                />
              ),
            )}
          </div>
        ) : (
          <AtlasProjectGrid projects={filtered} hoveredId={null} onHover={() => undefined} compact />
        )}
      </div>
    </section>
  )
}
