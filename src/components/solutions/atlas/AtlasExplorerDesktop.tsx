'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { AtlasFilterBarDesktop } from '@/components/solutions/atlas/AtlasFilterBarDesktop'
import { AtlasPeekCard } from '@/components/solutions/atlas/AtlasPeekCard'
import { AtlasProjectGrid } from '@/components/solutions/atlas/AtlasProjectGrid'
import { AtlasProjectList } from '@/components/solutions/atlas/AtlasProjectList'
import { projectMatchesRegionFilter } from '@/lib/solutions/coordinates'
import { type AtlasProject, type Sector, type SolutionStatus } from '@/lib/solutions/types'

const AtlasMap = dynamic(() => import('@/components/solutions/atlas/AtlasMap').then((m) => m.AtlasMap), {
  ssr: false,
  loading: () => <div className="atlas-map-shell atlas-map-shell--pending" />,
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
    <section id="explore" className="mag-section atlas-explorer-desktop">
      <div className="mag-wrap">
        <div className="mag-section-head">
          <h2>Solutions atlas</h2>
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
          <AtlasProjectGrid projects={filtered} hoveredId={hoveredId} onHover={setHoveredId} />
        ) : (
          <div className="atlas-explorer-desktop__split">
            <AtlasMap
              projects={baseFiltered}
              focusKey={mapFocusKey}
              selectedId={selected?.id}
              hoveredId={hoveredId}
              onSelect={setSelected}
              onHover={setHoveredId}
              onBoundsChange={setMapBounds}
              className="atlas-map-shell--desktop"
            />
            <div className="atlas-list-panel atlas-explorer-desktop__list">
              {selected ? <AtlasPeekCard project={selected} onClose={() => setSelected(null)} /> : null}
              <AtlasProjectList
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
