'use client'

import { AtlasPeekCard } from '@/components/solutions/atlas/AtlasPeekCard'
import { SECTOR_COLORS, SECTOR_LABELS, type AtlasProject, type Sector } from '@/lib/solutions/types'
import { useMemo, useState } from 'react'

const GEO = { west: -20, east: 54, north: 38, south: -35 }

function geoToSvg(lat: number, lng: number) {
  const x = ((lng - GEO.west) / (GEO.east - GEO.west)) * 800
  const y = ((GEO.north - lat) / (GEO.north - GEO.south)) * 860
  return {
    x: Math.min(780, Math.max(20, x)),
    y: Math.min(840, Math.max(20, y)),
  }
}

function placePins(projects: AtlasProject[]) {
  const placed = projects.map((project) => ({
    project,
    ...geoToSvg(project.coordinates.lat, project.coordinates.lng),
  }))

  for (let i = 0; i < placed.length; i++) {
    for (let j = 0; j < i; j++) {
      const dx = placed[i].x - placed[j].x
      const dy = placed[i].y - placed[j].y
      const distance = Math.hypot(dx, dy)
      if (distance < 22) {
        const angle = i * 2.399
        placed[i].x = Math.min(780, Math.max(20, placed[i].x + Math.cos(angle) * 22))
        placed[i].y = Math.min(840, Math.max(20, placed[i].y + Math.sin(angle) * 22))
      }
    }
  }

  return placed
}

type SolutionsAtlasHeroProps = {
  projects: AtlasProject[]
}

export function SolutionsAtlasHero({ projects }: SolutionsAtlasHeroProps) {
  const [selected, setSelected] = useState<AtlasProject | null>(null)
  const pins = useMemo(() => placePins(projects), [projects])

  return (
    <div id="atlas" className="atlas-hero__stage">
      <div className="atlas-lite" role="img" aria-label="Climate solutions across Africa">
        <svg viewBox="0 0 800 860" preserveAspectRatio="xMidYMid meet">
          <rect width="800" height="860" fill="#1e4a3d" />
          <path
            fill="#c9d4bc"
            stroke="#8a9a78"
            strokeWidth="1.25"
            strokeLinejoin="round"
            d="M154 26 L249 14 L327 9 L359 60 L432 70 L540 80 L565 79 L568 95 L582 127 L618 217 L643 264 L682 311 L771 309 L757 353 L706 424 L676 452 L658 475 L645 496 L641 528 L654 619 L592 681 L569 754 L551 800 L432 858 L415 853 L394 785 L373 717 L346 650 L359 551 L349 518 L319 456 L321 401 L253 372 L214 382 L173 386 L100 373 L74 348 L68 336 L48 307 L28 274 L38 259 L43 234 L44 200 L60 140 L112 90 L134 52 Z"
          />
          <path
            fill="#c9d4bc"
            stroke="#8a9a78"
            strokeWidth="1.25"
            strokeLinejoin="round"
            d="M749 593 L750 662 L723 742 L689 723 L717 633 Z"
          />
          <ellipse cx="573" cy="459" rx="14" ry="10" fill="#1e4a3d" />
          {pins.map(({ project, x, y }) => {
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
