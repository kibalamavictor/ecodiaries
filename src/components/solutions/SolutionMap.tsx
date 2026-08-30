'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { SECTOR_COLORS, SECTOR_LABELS, STATUS_LABELS, type Solution } from '@/lib/solutions/types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type SolutionMapProps = {
  solutions: Solution[]
}

export function SolutionMap({ solutions }: SolutionMapProps) {
  const [active, setActive] = useState<Solution | null>(null)

  const markers = useMemo(() => solutions, [solutions])

  if (!markers.length) {
    return <p className="py-16 text-center text-muted-foreground">No solutions match these filters on the map yet.</p>
  }

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 420, center: [20, 2] }}
        className="h-[420px] w-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(210 20% 96%)"
                stroke="hsl(214 20% 88%)"
                strokeWidth={0.4}
              />
            ))
          }
        </Geographies>
        {markers.map((solution) => {
          const color = SECTOR_COLORS[solution.sectors[0]]
          return (
            <Marker
              key={solution.id}
              coordinates={[solution.coordinates.lng, solution.coordinates.lat]}
              onClick={() => setActive(solution)}
            >
              <circle
                r={6}
                fill={color}
                stroke="#0C1400"
                strokeWidth={1}
                className="cursor-pointer"
                role="button"
                aria-label={solution.title}
              />
            </Marker>
          )
        })}
      </ComposableMap>

      {active ? (
        <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-xl border border-border bg-white p-4 shadow-lg sm:left-auto">
          <button
            type="button"
            className="absolute right-3 top-3 text-xs text-muted-foreground"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">{STATUS_LABELS[active.status]}</p>
          <h3 className="mt-1 font-semibold text-brand-forest">{active.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{active.summary}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {active.sectors.map((sector) => (
              <span
                key={sector}
                className="rounded-full px-2 py-0.5 text-xs text-brand-forest"
                style={{ backgroundColor: `${SECTOR_COLORS[sector]}22` }}
              >
                {SECTOR_LABELS[sector]}
              </span>
            ))}
          </div>
          <Link href={`/solutions/${active.slug}`} className="mt-3 inline-block text-sm font-medium text-brand-green underline">
            View full story
          </Link>
        </div>
      ) : null}
    </div>
  )
}
