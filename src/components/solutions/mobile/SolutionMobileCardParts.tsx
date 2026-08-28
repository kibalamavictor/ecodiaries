import { Camera } from 'lucide-react'
import { getMediaCount } from '@/lib/solutions/gallery'
import { STATUS_LABELS, SECTOR_LABELS, type AtlasProject, type Sector } from '@/lib/solutions/types'
import type { MetricCallout } from '@/lib/solutions/metric-callout'

type SolutionCardStatusBadgeProps = {
  status: AtlasProject['status']
  className?: string
}

export function SolutionCardStatusBadge({ status, className }: SolutionCardStatusBadgeProps) {
  return (
    <span className={className ?? 'solution-card-image-badge solution-card-image-badge--status'}>
      {STATUS_LABELS[status]}
    </span>
  )
}

type SolutionMediaCountBadgeProps = {
  project: Pick<AtlasProject, 'coverImageUrl' | 'gallery'>
  className?: string
}

export function SolutionMediaCountBadge({ project, className }: SolutionMediaCountBadgeProps) {
  const count = getMediaCount(project)
  if (count <= 1) return null

  return (
    <span className={className ?? 'solution-card-image-badge solution-card-image-badge--count'}>
      <Camera className="solution-card-image-badge__icon" strokeWidth={2.25} aria-hidden />
      {count}
    </span>
  )
}

type SolutionCardSectorOverlayProps = {
  sector?: Sector
}

export function SolutionCardSectorOverlay({ sector }: SolutionCardSectorOverlayProps) {
  if (!sector) return null

  return <span className="solution-card-sector-overlay">{SECTOR_LABELS[sector]}</span>
}

type SolutionMobileCardBodyProps = {
  title: string
  metric: MetricCallout
  variant?: 'grid' | 'spotlight'
}

export function SolutionMobileCardBody({ title, metric, variant = 'grid' }: SolutionMobileCardBodyProps) {
  return (
    <div className={`solution-mobile-card__body solution-mobile-card__body--${variant}`}>
      <h3 className="solution-mobile-card__title">{title}</h3>
      <div className="solution-mobile-card__footer">
        <div className="solution-mobile-card__metric">
          <span className="solution-mobile-card__metric-value">{metric.value}</span>
          <span className="solution-mobile-card__metric-label">{metric.label}</span>
        </div>
        <span className="solution-mobile-card__action">View solution →</span>
      </div>
    </div>
  )
}
