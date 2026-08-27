import { computeSolutionsAtlasStats } from '@/lib/solutions/stats'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsMobileStatStripProps = {
  projects: AtlasProject[]
}

export function SolutionsMobileStatStrip({ projects }: SolutionsMobileStatStripProps) {
  const stats = computeSolutionsAtlasStats(projects)

  return (
    <div className="solutions-mobile-stat-strip" aria-label="Atlas highlights">
      <div className="solutions-mobile-stat-strip__cell">
        <p className="solutions-mobile-stat-strip__value">{stats.solutionCount}</p>
        <p className="solutions-mobile-stat-strip__label">Solutions</p>
      </div>
      <div className="solutions-mobile-stat-strip__divider" aria-hidden />
      <div className="solutions-mobile-stat-strip__cell">
        <p className="solutions-mobile-stat-strip__value">{stats.countryCount}</p>
        <p className="solutions-mobile-stat-strip__label">Countries</p>
      </div>
      <div className="solutions-mobile-stat-strip__divider" aria-hidden />
      <div className="solutions-mobile-stat-strip__cell">
        <p className="solutions-mobile-stat-strip__value">{stats.peopleReached}</p>
        <p className="solutions-mobile-stat-strip__label">People reached</p>
      </div>
    </div>
  )
}
