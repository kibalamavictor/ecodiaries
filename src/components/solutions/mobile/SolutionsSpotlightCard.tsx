'use client'

import Link from 'next/link'
import { SolutionCoverTransition } from '@/components/solutions/mobile/SolutionCoverTransition'
import { SolutionMediaStack } from '@/components/solutions/mobile/SolutionMediaStack'
import {
  SolutionCardSectorOverlay,
  SolutionCardStatusBadge,
  SolutionMediaCountBadge,
  SolutionMobileCardBody,
} from '@/components/solutions/mobile/SolutionMobileCardParts'
import { getPrimaryMetric } from '@/lib/solutions/metric-callout'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsSpotlightCardProps = {
  project: AtlasProject
}

export function SolutionsSpotlightCard({ project }: SolutionsSpotlightCardProps) {
  const metric = getPrimaryMetric(project)
  const primarySector = project.sectors[0]

  return (
    <Link href={`/solutions/${project.slug}`} className="solutions-spotlight-card">
      <div className="solutions-spotlight-card__media">
        <SolutionMediaStack project={project} variant="spotlight" />
        <SolutionCoverTransition
          slug={project.slug}
          src={project.coverImageUrl}
          sizes="(max-width: 767px) 100vw, 720px"
          priority
        />
        <div className="solutions-spotlight-card__badges">
          <SolutionCardStatusBadge status={project.status} />
          <SolutionMediaCountBadge project={project} />
        </div>
        <SolutionCardSectorOverlay sector={primarySector} />
      </div>

      <SolutionMobileCardBody title={project.title} metric={metric} variant="spotlight" />
    </Link>
  )
}
