'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
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

  return (
    <section id="atlas" className="atlas-hero mag-section">
      <div className="mag-wrap">
        <p className="mag-news__eyebrow">Interactive atlas</p>
        <h2 className="mag-title atlas-hero__title">A living map of climate solutions</h2>
        <p className="mag-excerpt atlas-hero__lede">
          Move across Africa, open a point, and read the field story behind it.
        </p>
        <div className="atlas-hero__stage">
          <AtlasMap
            projects={projects}
            selectedId={selected?.id}
            hoveredId={hoveredId}
            onSelect={setSelected}
            onHover={setHoveredId}
            className="atlas-map-shell--hero"
          />
          {selected ? (
            <div className="atlas-hero__peek">
              <AtlasPeekCard project={selected} onClose={() => setSelected(null)} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
