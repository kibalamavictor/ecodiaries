import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { MagCard } from '@/components/magazine/MagCard'
import { SolutionCardGrid } from '@/components/solutions/SolutionCardGrid'
import { SolutionsNearYou } from '@/components/solutions/SolutionsNearYou'
import { FilterPills } from '@/components/ui/FilterPills'
import { atlasProjectToMagCard } from '@/lib/magazine'
import { pickSpotlightSolutions } from '@/lib/solutions/spotlight'
import { SECTOR_FILTER_OPTIONS, type AtlasProject, type Sector } from '@/lib/solutions/types'

const sectorFilters = SECTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value,
}))

type SolutionsCollectionsProps = {
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

export function SolutionsCollections({ projects, query, sector }: SolutionsCollectionsProps) {
  const searching = Boolean(query)
  const scoped = projects.filter((project) => matchesSector(project, sector))
  const pool = scoped.length ? scoped : projects
  const featured = pickSpotlightSolutions(pool, 4)
  const lead = featured[0]
  const featuredRest = featured.slice(1)
  const scaling = pool.filter((project) => project.status === 'scaling').slice(0, 3)
  const filtered = pool.filter((project) => matchesQuery(project, query))

  return (
    <div className="solutions-collections">
      {!searching && lead ? (
        <section className="mag-section">
          <div className="mag-wrap">
            <div className="mag-section-head">
              <h2>Featured</h2>
              <p className="mag-meta">Field stories we are watching closely</p>
            </div>
            <article className="mag-feature">
              <div>
                <span className="mag-chip">{atlasProjectToMagCard(lead).category}</span>
                <h3 className="mag-title">
                  <Link href={`/solutions/${lead.slug}`}>{lead.title}</Link>
                </h3>
                <p className="mag-meta">{atlasProjectToMagCard(lead).byline}</p>
                <p className="mag-excerpt mag-excerpt--full">{lead.summary}</p>
                <p style={{ marginTop: 18 }}>
                  <Link href={`/solutions/${lead.slug}`} className="mag-link">
                    View solution →
                  </Link>
                </p>
              </div>
              <Link href={`/solutions/${lead.slug}`} className="mag-card__media mag-card--feature">
                <Image src={lead.coverImageUrl || '/logo.svg'} alt="" fill sizes="(max-width: 980px) 100vw, 40vw" />
              </Link>
            </article>
            {featuredRest.length ? (
              <div className="mag-grid-3">
                {featuredRest.map((project) => (
                  <MagCard
                    key={project.id}
                    item={atlasProjectToMagCard(project)}
                    heading="h3"
                    chip="below"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {!searching ? <SolutionsNearYou projects={pool} /> : null}

      {!searching && scaling.length ? (
        <section className="mag-section">
          <div className="mag-wrap">
            <div className="mag-section-head">
              <h2>Scaling now</h2>
              <p className="mag-meta">Work already moving beyond a first site</p>
            </div>
            <SolutionCardGrid projects={scaling} layout={scaling.length >= 3 ? 'inspire' : 'three'} />
          </div>
        </section>
      ) : null}

      <section id="explore" className="mag-section">
        <div className="mag-wrap">
          <div className="mag-section-head">
            <h2>{searching ? 'Search results' : 'All solutions'}</h2>
            <p className="mag-meta">
              {filtered.length} project{filtered.length === 1 ? '' : 's'}
              {query ? ` · “${query}”` : ''}
            </p>
          </div>
          <Suspense fallback={null}>
            <div className="solutions-browse__filters">
              <FilterPills
                filters={sectorFilters}
                paramKey="sector"
                basePath="/solutions"
                modalTitle="Filter by sector"
              />
            </div>
          </Suspense>
          {filtered.length ? (
            <SolutionCardGrid projects={filtered} />
          ) : (
            <p className="mag-excerpt" style={{ marginTop: 12 }}>
              No solutions match these filters yet.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
