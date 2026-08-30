'use client'

import dynamic from 'next/dynamic'
import { AtlasErrorBoundary } from '@/components/solutions/atlas/AtlasErrorBoundary'
import { AtlasPeekCard } from '@/components/solutions/atlas/AtlasPeekCard'
import { SECTOR_COLORS, SECTOR_LABELS, type AtlasProject, type Sector } from '@/lib/solutions/types'
import { useState } from 'react'

const AtlasMap = dynamic(() => import('@/components/solutions/atlas/AtlasMap').then((mod) => mod.AtlasMap), {
  ssr: false,
  loading: () => <div className="atlas-map-shell atlas-map-shell--hero atlas-map-shell--pending" aria-hidden />,
})

function MapShell() {
  return <div className="atlas-map-shell atlas-map-shell--hero atlas-map-shell--pending" aria-hidden />
}

type SolutionsAtlasHeroProps = {
  projects: AtlasProject[]
}

export function SolutionsAtlasHero({ projects }: SolutionsAtlasHeroProps) {
  const [selected, setSelected] = useState<AtlasProject | null>(null)
  const [failed, setFailed] = useState(false)

  return (
    <div id="atlas" className="atlas-hero__stage">
      <AtlasErrorBoundary fallback={<MapShell />}>
        <div className="atlas-hero__map">
          {failed ? (
            <MapShell />
          ) : (
            <AtlasMap
              projects={projects}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
              onHover={() => undefined}
              onError={() => setFailed(true)}
              className="atlas-map-shell--hero"
              cluster
              autoFit={false}
              continentView
              showLegend={false}
              maxZoom={11}
            />
          )}
          {selected ? (
            <div className="atlas-hero__peek">
              <AtlasPeekCard project={selected} onClose={() => setSelected(null)} />
            </div>
          ) : (
            <p className="atlas-hero__hint">Drag to explore · click a pin for a field story</p>
          )}
        </div>
      </AtlasErrorBoundary>
      <ul className="atlas-map-legend" aria-label="Sectors">
        {(Object.keys(SECTOR_LABELS) as Sector[]).map((sector) => (
          <li key={sector}>
            <span style={{ background: SECTOR_COLORS[sector] }} />
            {SECTOR_LABELS[sector]}
          </li>
        ))}
      </ul>
    </div>
  )
}
