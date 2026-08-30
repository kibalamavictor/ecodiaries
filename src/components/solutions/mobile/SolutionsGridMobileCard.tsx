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

type SolutionsGridMobileCardProps = {
  solution: AtlasProject
}

export function SolutionsGridMobileCard({ solution }: SolutionsGridMobileCardProps) {
  const metric = getPrimaryMetric(solution)
  const primarySector = solution.sectors[0]

  return (
    <Link href={`/solutions/${solution.slug}`} className="solutions-grid-mobile-card">
      <div className="solutions-grid-mobile-card__media">
        <SolutionMediaStack project={solution} variant="grid" />
        <SolutionCoverTransition
          slug={solution.slug}
          src={solution.coverImageUrl}
          sizes="(max-width: 767px) 50vw, 320px"
        />
        <div className="solutions-grid-mobile-card__badges">
          <SolutionCardStatusBadge status={solution.status} />
          <SolutionMediaCountBadge project={solution} />
        </div>
        <SolutionCardSectorOverlay sector={primarySector} />
      </div>

      <SolutionMobileCardBody title={solution.title} metric={metric} variant="grid" />
    </Link>
  )
}
