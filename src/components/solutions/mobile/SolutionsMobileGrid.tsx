'use client'

import { Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FilterPills } from '@/components/ui/FilterPills'
import { AtlasViewToggle } from '@/components/solutions/atlas/AtlasViewToggle'
import { SolutionsGridFundingTile } from '@/components/solutions/mobile/SolutionsGridFundingTile'
import { SolutionsGridMobileCard } from '@/components/solutions/mobile/SolutionsGridMobileCard'
import { SolutionsMobileStatStrip } from '@/components/solutions/mobile/SolutionsMobileStatStrip'
import { SolutionsSpotlightCarousel } from '@/components/solutions/mobile/SolutionsSpotlightCarousel'
import { projectMatchesRegionFilter } from '@/lib/solutions/coordinates'
import { pickSpotlightSolutions } from '@/lib/solutions/spotlight'
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

function buildGridItems(projects: AtlasProject[], excludeIds: Set<string>): GridItem[] {
  const list = excludeIds.size ? projects.filter((p) => !excludeIds.has(p.id)) : projects
  const items: GridItem[] = []

  list.forEach((project, index) => {
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

  const spotlightProjects = useMemo(() => pickSpotlightSolutions(filtered), [filtered])
  const spotlightIds = useMemo(() => new Set(spotlightProjects.map((p) => p.id)), [spotlightProjects])
  const gridItems = useMemo(() => buildGridItems(filtered, spotlightIds), [filtered, spotlightIds])

  function syncView(mode: 'atlas' | 'grid') {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === 'grid') params.delete('view')
    else params.set('view', 'atlas')
    const qs = params.toString()
    router.replace(qs ? `/solutions?${qs}` : '/solutions', { scroll: false })
  }

  return (
    <section id="explore" className="solutions-mobile-grid">
      <div className="solutions-mobile-grid__inner">
        <header className="solutions-mobile-grid__head">
          <p className="solutions-mobile-grid__eyebrow">Solutions Atlas</p>
          <h2 className="solutions-mobile-grid__title">What&apos;s actually working, mapped</h2>
        </header>

        <SolutionsMobileStatStrip projects={projects} />

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

        <div className="solutions-mobile-grid__toolbar">
          <p className="solutions-mobile-grid__count">
            {filtered.length} project{filtered.length === 1 ? '' : 's'}
          </p>
          <AtlasViewToggle view="grid" onChange={syncView} />
        </div>

        {spotlightProjects.length ? <SolutionsSpotlightCarousel projects={spotlightProjects} /> : null}

        {!gridItems.length ? (
          <p className="solutions-mobile-grid__empty">No projects match these filters yet.</p>
        ) : (
          <div className="solutions-mobile-grid__cards">
            {gridItems.map((item, index) =>
              item.type === 'funding' ? (
                <SolutionsGridFundingTile key={`funding-${index}`} projectCount={projects.length} projects={projects} />
              ) : (
                <SolutionsGridMobileCard key={item.project.id} solution={item.project} />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  )
}
