import { Suspense } from 'react'
import { MagCarouselRow } from '@/components/magazine/MagCarouselRow'
import { MagMobileGrid } from '@/components/magazine/MagMobileGrid'
import { MobileBrowseBar } from '@/components/magazine/MobileBrowseBar'
import { atlasProjectToMagCard } from '@/lib/magazine'
import { coordinatesForRegion, mostCommonRegion, nearestProjects } from '@/lib/solutions/coordinates'
import { pickSpotlightSolutions } from '@/lib/solutions/spotlight'
import { SECTOR_FILTER_OPTIONS, type AtlasProject, type Sector } from '@/lib/solutions/types'

const SECTOR_TOPICS = SECTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value,
}))

type MagSolutionsMobileFeedProps = {
  projects: AtlasProject[]
  query?: string
  sector?: string
}

function matchesQuery(project: AtlasProject, query?: string) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    project.title.toLowerCase().includes(q) ||
    project.summary.toLowerCase().includes(q) ||
    project.region.toLowerCase().includes(q) ||
    (project.organization?.name.toLowerCase().includes(q) ?? false)
  )
}

function matchesSector(project: AtlasProject, sector?: string) {
  if (!sector || sector === 'all') return true
  return project.sectors.includes(sector as Sector)
}

export function MagSolutionsMobileFeed({ projects, query, sector }: MagSolutionsMobileFeedProps) {
  const searching = Boolean(query)
  const scoped = projects.filter((project) => matchesSector(project, sector))
  const pool = scoped.length ? scoped : projects
  const featured = pickSpotlightSolutions(pool, 4).map(atlasProjectToMagCard)
  const nearby = nearestProjects(pool, coordinatesForRegion(mostCommonRegion(pool)), 4).map(
    atlasProjectToMagCard,
  )
  const scaling = pool.filter((project) => project.status === 'scaling').slice(0, 4).map(atlasProjectToMagCard)
  const filtered = pool.filter((project) => matchesQuery(project, query)).map(atlasProjectToMagCard)

  return (
    <div className="magazine-mobile">
      <div className="site-container" style={{ paddingTop: 20 }}>
        <Suspense fallback={null}>
          <MobileBrowseBar
            basePath="/solutions"
            paramKey="sector"
            aliasParams={['category']}
            topics={SECTOR_TOPICS}
            placeholder="Search solutions, sectors, or places…"
            emptyLabel="Filter by sector"
            dialogLabel="Filter solutions by sector"
            showSearch={false}
          />
        </Suspense>
      </div>
      {!searching ? (
        <>
          <MagCarouselRow
            title="Featured"
            href="/solutions"
            items={featured}
            seeMoreLabel="See all solutions"
            seeMoreSubtitle="Open the atlas"
          />
          <MagCarouselRow
            title="Near you"
            href="/solutions"
            items={nearby}
            seeMoreLabel="See all solutions"
            seeMoreSubtitle="More nearby work"
          />
          <MagCarouselRow
            title="Scaling now"
            href="/solutions"
            items={scaling}
            seeMoreLabel="See all solutions"
            seeMoreSubtitle="Work moving beyond a first site"
          />
        </>
      ) : null}
      <section className="magazine-mobile-archive" style={{ paddingTop: 12 }} aria-label="All solutions">
        <div className="site-container">
          <h2 className="mag-carousel__title" style={{ marginBottom: 14 }}>
            {searching ? 'Search results' : 'All solutions'}
          </h2>
          <MagMobileGrid items={filtered} empty="No solutions match these filters yet." />
        </div>
      </section>
    </div>
  )
}
