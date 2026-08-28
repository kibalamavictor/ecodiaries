'use client'

import { AtlasPeekCard } from '@/components/solutions/atlas/AtlasPeekCard'
import { SECTOR_COLORS, SECTOR_LABELS, type AtlasProject, type Sector } from '@/lib/solutions/types'
import { useState } from 'react'

const GEO = { west: -20, east: 54, north: 38, south: -35 }

function geoToSvg(lat: number, lng: number) {
  const x = ((lng - GEO.west) / (GEO.east - GEO.west)) * 800
  const y = ((GEO.north - lat) / (GEO.north - GEO.south)) * 860
  return {
    x: Math.min(780, Math.max(20, x)),
    y: Math.min(840, Math.max(20, y)),
  }
}

type SolutionsAtlasHeroProps = {
  projects: AtlasProject[]
}

export function SolutionsAtlasHero({ projects }: SolutionsAtlasHeroProps) {
  const [selected, setSelected] = useState<AtlasProject | null>(null)

  return (
    <div id="atlas" className="atlas-hero__stage">
      <div className="atlas-lite" role="img" aria-label="Climate solutions across Africa">
        <svg viewBox="80 40 640 800" preserveAspectRatio="xMidYMid slice">
          <rect x="80" y="40" width="640" height="800" fill="#1e4a3d" />
          <path
            fill="#efece3"
            d="M286 86c48-28 118-38 176-18 42 14 78 42 96 78 18 38 22 86 8 128-8 26-4 54 14 74 28 32 64 58 72 102 8 46-18 88-8 132 8 36 6 76-16 106-28 40-62 78-74 128-10 42-8 88 18 122 8 12-6 22-20 18-48-12-86-48-108-90-24-46-54-86-96-112-40-24-86-28-128-12-36 14-74 14-106-4-28-16-36-50-22-78 16-32 18-70 2-102-14-28-12-64 8-88 22-28 64-36 86-64 20-26 22-64 8-94-12-26 8-54 42-74z"
          />
          <path
            fill="#efece3"
            d="M612 612c18-8 38 2 46 18 10 20 8 46-8 62-18 18-46 20-64 6-16-12-20-38-8-56 8-12 20-22 34-30z"
          />
          {projects.map((project, index) => {
            const base = geoToSvg(project.coordinates.lat, project.coordinates.lng)
            const angle = (index / Math.max(projects.length, 1)) * Math.PI * 2
            const spread = projects.length > 1 ? 36 : 0
            const x = base.x + Math.cos(angle) * spread
            const y = base.y + Math.sin(angle) * spread
            const active = selected?.id === project.id
            const sector = (project.sectors[0] || 'climate-justice') as Sector
            return (
              <g key={project.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={22}
                  fill="transparent"
                  className="atlas-lite__hit"
                  onClick={() => setSelected(project)}
                >
                  <title>{project.title}</title>
                </circle>
                <circle
                  cx={x}
                  cy={y}
                  r={active ? 11 : 8}
                  fill={SECTOR_COLORS[sector]}
                  stroke="#ffffff"
                  strokeWidth={active ? 3 : 2}
                  className="atlas-lite__pin"
                  pointerEvents="none"
                />
              </g>
            )
          })}
        </svg>
        {selected ? (
          <div className="atlas-hero__peek">
            <AtlasPeekCard project={selected} onClose={() => setSelected(null)} />
          </div>
        ) : (
          <p className="atlas-hero__hint">Click a point to open a field story</p>
        )}
      </div>
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
