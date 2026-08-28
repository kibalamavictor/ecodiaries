'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { AtlasFilterBar } from '@/components/solutions/atlas/AtlasFilterBar'
import { AtlasMapProjectPopup } from '@/components/solutions/atlas/AtlasMapProjectPopup'
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

type AtlasExplorerProps = {
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

export function AtlasExplorer({ projects }: AtlasExplorerProps) {
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
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mapPopup, setMapPopup] = useState<AtlasProject | null>(null)

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
    setMapPopup(null)
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
    <section id="explore" className="mag-section atlas-explorer-mobile">
      <div className="mag-wrap">
        <div className="mag-section-head">
          <h2>Solutions atlas</h2>
        </div>

        <Suspense fallback={null}>
          <AtlasFilterBar
            count={filtered.length}
            sector={sector}
            region={region}
            status={status}
            query={query}
            view={view}
            onViewChange={(mode) => {
              setView(mode)
              syncView(mode)
            }}
          />
        </Suspense>

        {view === 'grid' ? (
          <AtlasProjectGrid projects={filtered} hoveredId={hoveredId} onHover={setHoveredId} compact />
        ) : (
          <div className="atlas-explorer-mobile__map">
            <AtlasMap
              projects={baseFiltered}
              focusKey={mapFocusKey}
              selectedId={selected?.id}
              hoveredId={hoveredId}
              onSelect={(project) => {
                setSelected(project)
                setMapPopup(project)
              }}
              onHover={setHoveredId}
              onBoundsChange={setMapBounds}
              className="atlas-map-shell--mobile"
            />
            <div className="atlas-sheet">
              <button
                type="button"
                className="atlas-sheet__handle"
                onClick={() => setSheetOpen((open) => !open)}
                aria-expanded={sheetOpen}
              >
                <span />
                {sheetOpen ? 'Hide list' : 'Show list'}
              </button>
              {sheetOpen ? (
                <div className="atlas-sheet__body">
                  {selected ? <AtlasPeekCard project={selected} onClose={() => setSelected(null)} /> : null}
                  <AtlasProjectList
                    projects={filtered}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
                    onSelect={setSelected}
                  />
                </div>
              ) : null}
            </div>
            <AtlasMapProjectPopup
              project={mapPopup}
              onClose={() => {
                setMapPopup(null)
                setSelected(null)
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
