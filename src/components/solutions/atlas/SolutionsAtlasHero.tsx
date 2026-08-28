'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AtlasErrorBoundary } from '@/components/solutions/atlas/AtlasErrorBoundary'
import { AtlasPeekCard } from '@/components/solutions/atlas/AtlasPeekCard'
import type { AtlasProject } from '@/lib/solutions/types'

const AtlasMap = dynamic(() => import('@/components/solutions/atlas/AtlasMap').then((m) => m.AtlasMap), {
  ssr: false,
  loading: () => <div className="atlas-map-shell atlas-map-shell--hero atlas-map-shell--pending" />,
})

type SolutionsAtlasHeroProps = {
  projects: AtlasProject[]
}

export function SolutionsAtlasHero({ projects }: SolutionsAtlasHeroProps) {
  const [selected, setSelected] = useState<AtlasProject | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const boot = () => setMapReady(true)
    if (typeof window.requestIdleCallback === 'function') {
      const idle = window.requestIdleCallback(boot, { timeout: 1200 })
      return () => window.cancelIdleCallback(idle)
    }
    const timer = window.setTimeout(boot, 200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section id="atlas" className="atlas-hero mag-section">
      <div className="mag-wrap">
        <p className="mag-news__eyebrow">Interactive atlas</p>
        <h2 className="mag-title atlas-hero__title">A living map of climate solutions</h2>
        <p className="mag-excerpt atlas-hero__lede">
          Move across Africa, open a point, and read the field story behind it.
        </p>
        <div className="atlas-hero__stage">
          {mapReady ? (
            <AtlasErrorBoundary
              fallback={
                <div className="atlas-map-shell atlas-map-shell--hero atlas-map-shell--pending">
                  <p className="mag-meta" style={{ padding: 24 }}>
                    The map could not load in this browser. Browse the collections below.
                  </p>
                </div>
              }
            >
              <AtlasMap
                projects={projects}
                selectedId={selected?.id}
                hoveredId={hoveredId}
                onSelect={setSelected}
                onHover={setHoveredId}
                className="atlas-map-shell--hero"
                cluster={false}
                autoFit={false}
              />
            </AtlasErrorBoundary>
          ) : (
            <div className="atlas-map-shell atlas-map-shell--hero atlas-map-shell--pending" />
          )}
        </div>
        {selected ? (
          <div className="atlas-hero__peek">
            <AtlasPeekCard project={selected} onClose={() => setSelected(null)} />
          </div>
        ) : (
          <p className="mag-meta atlas-hero__hint">Click a point on the map to open a field story.</p>
        )}
      </div>
    </section>
  )
}
