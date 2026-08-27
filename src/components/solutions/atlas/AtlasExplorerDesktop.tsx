'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { AtlasFilterBarDesktop } from '@/components/solutions/atlas/AtlasFilterBarDesktop'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { StagePill } from '@/components/solutions/StagePill'
import { projectMatchesRegionFilter } from '@/lib/solutions/coordinates'
import { type AtlasProject, type Sector, type SolutionStatus } from '@/lib/solutions/types'

const AtlasMap = dynamic(() => import('@/components/solutions/atlas/AtlasMap').then((m) => m.AtlasMap), {
  ssr: false,
  loading: () => <div className="min-h-[360px] animate-pulse rounded-2xl bg-muted" />,
})

type ViewMode = 'atlas' | 'grid'

type AtlasExplorerDesktopProps = {
  projects: AtlasProject[]
}

function inBounds(
  project: AtlasProject,
  bounds: { west: number; south: number; east: number; north: number } | null,
) {
  if (!bounds) return true
  const { lat, lng } = project.coordinates
  return lng >= bounds.west && lng <= bounds.east && lat >= bounds.south && lat <= bounds.north
}

export function AtlasExplorerDesktop({ projects }: AtlasExplorerDesktopProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [view, setView] = useState<ViewMode>('atlas')
  const [sector, setSector] = useState<Sector | 'all'>('all')
  const [region, setRegion] = useState<string | 'all'>('all')
  const [status, setStatus] = useState<SolutionStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selected, setSelected] = useState<AtlasProject | null>(null)
  const [mapBounds, setMapBounds] = useState<{
    west: number
    south: number
    east: number
    north: number
  } | null>(null)

  useEffect(() => {
    setSector((searchParams.get('sector') as Sector) || 'all')
    setRegion(searchParams.get('region') || 'all')
    setStatus((searchParams.get('status') as SolutionStatus) || 'all')
    setQuery(searchParams.get('q') || '')
    setView(searchParams.get('view') === 'grid' ? 'grid' : 'atlas')
  }, [searchParams])

  useEffect(() => {
    setMapBounds(null)
    setSelected(null)
  }, [region, sector, status, query])

  const mapFocusKey = `${region}|${sector}|${status}|${query}`

  const baseFiltered = useMemo(() => {
    return projects.filter((p) => {
      if (sector !== 'all' && !p.sectors.includes(sector)) return false
      if (!projectMatchesRegionFilter(p, region)) return false
      if (status !== 'all' && p.status !== status) return false
      if (query) {
        const q = query.toLowerCase()
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.summary.toLowerCase().includes(q) &&
          !p.region.toLowerCase().includes(q) &&
          !(p.organization?.name.toLowerCase().includes(q) ?? false)
        ) {
          return false
        }
      }
      return true
    })
  }, [projects, sector, region, status, query])

  const filtered = useMemo(() => {
    if (view === 'atlas' && mapBounds) {
      return baseFiltered.filter((p) => inBounds(p, mapBounds))
    }
    return baseFiltered
  }, [baseFiltered, view, mapBounds])

  function syncView(mode: ViewMode) {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === 'atlas') params.delete('view')
    else params.set('view', mode)
    const qs = params.toString()
    router.replace(qs ? `/solutions?${qs}` : '/solutions', { scroll: false })
  }

  return (
    <section id="explore" className="atlas-section atlas-explorer-desktop py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="atlas-section-head">
          <h2>
            <span className="atlas-accent-mark" aria-hidden />
            Solutions Atlas
          </h2>
          <div className="atlas-view-toggle">
            {(['atlas', 'grid'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setView(mode)
                  syncView(mode)
                }}
                className={view === mode ? 'is-active' : undefined}
              >
                {mode === 'atlas' ? 'Map + list' : 'Grid only'}
              </button>
            ))}
          </div>
        </div>

        <Suspense fallback={null}>
          <AtlasFilterBarDesktop
            count={filtered.length}
            sector={sector}
            region={region}
            status={status}
            query={query}
          />
        </Suspense>

        {view === 'grid' ? (
          <ProjectGrid projects={filtered} hoveredId={hoveredId} onHover={setHoveredId} />
        ) : (
          <div className="atlas-explorer-desktop__split mt-10 grid gap-8">
            <AtlasMap
              projects={baseFiltered}
              focusKey={mapFocusKey}
              selectedId={selected?.id}
              hoveredId={hoveredId}
              onSelect={setSelected}
              onHover={setHoveredId}
              onBoundsChange={setMapBounds}
              className="h-[360px] md:h-[520px] w-full"
            />
            <div className="atlas-list-panel atlas-explorer-desktop__list md:h-[520px] md:max-h-[520px] md:overflow-y-auto">
              {selected ? <PeekCard project={selected} onClose={() => setSelected(null)} /> : null}
              <ProjectList
                projects={filtered}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onSelect={setSelected}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectList({
  projects,
  hoveredId,
  onHover,
  onSelect,
}: {
  projects: AtlasProject[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onSelect: (p: AtlasProject) => void
}) {
  if (!projects.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No projects match these filters.</p>
  }
  return (
    <ul className="space-y-3">
      {projects.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            className={`atlas-list-card ${hoveredId === p.id ? 'is-active' : ''}`}
            onMouseEnter={() => onHover(p.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(p)}
          >
            <div className="solution-card__media relative h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-[#E4E6DD]">
              <Image src={p.coverImageUrl} alt="" fill className="object-cover" sizes="88px" />
              <div className="solution-card__media-tint rounded-xl" aria-hidden />
            </div>
            <div className="atlas-list-card__copy min-w-0 flex-1">
              <div className="atlas-list-card__meta">
                <span className="atlas-org-label">{p.organization?.name || 'Field project'}</span>
                <StagePill status={p.status} />
              </div>
              <p className="atlas-list-card__title">{p.title}</p>
              <p className="atlas-list-card__summary">{p.summary}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}

function PeekCard({ project, onClose }: { project: AtlasProject; onClose: () => void }) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(7,13,2,0.1)]">
      <div className="relative aspect-[16/9] w-full">
        <Image src={project.coverImageUrl} alt="" fill className="object-cover" sizes="400px" />
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-[#0B3E1F]/80 px-3 py-1 text-xs font-semibold text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div className="p-4">
        <span className="atlas-org-label">{project.organization?.name || 'Field project'}</span>
        <h3 className="mt-2 font-display text-lg font-bold text-[#0B3E1F]">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-[#5C6457]">{project.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <StagePill status={project.status} />
          <Link
            href={`/solutions/${project.slug}`}
            className="text-sm font-bold text-[#00AB45] underline underline-offset-2"
          >
            View portfolio →
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProjectGrid({
  projects,
  hoveredId,
  onHover,
}: {
  projects: AtlasProject[]
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  if (!projects.length) {
    return <p className="mt-12 text-center text-neutral-600">No projects match these filters yet.</p>
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={projects.length}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="h-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onMouseEnter={() => onHover(project.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div className={`h-full ${hoveredId === project.id ? 'rounded-xl ring-2 ring-brand-lime' : ''}`}>
              <SolutionCard solution={project} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
