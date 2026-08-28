'use client'

import { useEffect, useMemo, useState } from 'react'
import { SolutionCardGrid } from '@/components/solutions/SolutionCardGrid'
import {
  coordinatesForRegion,
  mostCommonRegion,
  nearestProjects,
} from '@/lib/solutions/coordinates'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsNearYouProps = {
  projects: AtlasProject[]
}

type Origin =
  | { kind: 'locating' }
  | { kind: 'here'; lat: number; lng: number }
  | { kind: 'region'; region: string }

export function SolutionsNearYou({ projects }: SolutionsNearYouProps) {
  const fallbackRegion = mostCommonRegion(projects)
  const [origin, setOrigin] = useState<Origin>({ kind: 'locating' })

  useEffect(() => {
    if (!projects.length) return
    if (!navigator.geolocation) {
      setOrigin({ kind: 'region', region: fallbackRegion })
      return
    }

    const timer = window.setTimeout(() => {
      setOrigin((current) => (current.kind === 'locating' ? { kind: 'region', region: fallbackRegion } : current))
    }, 3500)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timer)
        setOrigin({
          kind: 'here',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        window.clearTimeout(timer)
        setOrigin({ kind: 'region', region: fallbackRegion })
      },
      { enableHighAccuracy: false, maximumAge: 600000, timeout: 3000 },
    )

    return () => window.clearTimeout(timer)
  }, [fallbackRegion, projects.length])

  const nearby = useMemo(() => {
    const point =
      origin.kind === 'here'
        ? { lat: origin.lat, lng: origin.lng }
        : coordinatesForRegion(origin.kind === 'region' ? origin.region : fallbackRegion)
    return nearestProjects(projects, point, 3)
  }, [fallbackRegion, origin, projects])

  if (!nearby.length) return null

  const lede =
    origin.kind === 'here'
      ? 'Closest field-documented work to where you are'
      : origin.kind === 'locating'
        ? 'Finding work closest to you'
        : `A cluster of field projects around ${fallbackRegion}`

  return (
    <section className="mag-section">
      <div className="mag-wrap">
        <div className="mag-section-head">
          <h2>Solutions near you</h2>
          <p className="mag-meta">{lede}</p>
        </div>
        <SolutionCardGrid projects={nearby} />
      </div>
    </section>
  )
}
