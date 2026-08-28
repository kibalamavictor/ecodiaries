'use client'

import { useMemo } from 'react'
import { SolutionCardGrid } from '@/components/solutions/SolutionCardGrid'
import { coordinatesForRegion, mostCommonRegion, nearestProjects } from '@/lib/solutions/coordinates'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsNearYouProps = {
  projects: AtlasProject[]
}

export function SolutionsNearYou({ projects }: SolutionsNearYouProps) {
  const fallbackRegion = mostCommonRegion(projects)
  const nearby = useMemo(() => {
    const point = coordinatesForRegion(fallbackRegion)
    return nearestProjects(projects, point, 3)
  }, [fallbackRegion, projects])

  if (!nearby.length) return null

  return (
    <section className="mag-section">
      <div className="mag-wrap">
        <div className="mag-section-head">
          <h2>Solutions near you</h2>
          <p className="mag-meta">A cluster of field projects around {fallbackRegion}</p>
        </div>
        <SolutionCardGrid projects={nearby} />
      </div>
    </section>
  )
}
