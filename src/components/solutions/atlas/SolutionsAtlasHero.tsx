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
        <svg viewBox="0 0 800 860" preserveAspectRatio="xMidYMid meet">
          <rect width="800" height="860" fill="#1e4a3d" />
          <path
            fill="#d5ddcc"
            d="M208 108 L268 90 L348 84 L438 96 L498 122 L518 168 L528 228 L578 268 L628 304 L618 352 L568 392 L548 468 L532 548 L508 638 L468 728 L428 798 L388 808 L348 768 L328 698 L298 608 L268 528 L228 458 L168 398 L142 338 L148 278 L168 228 L188 178 L198 138 Z"
          />
          <path fill="#d5ddcc" d="M638 548 L668 572 L662 648 L632 662 L618 608 Z" />
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
