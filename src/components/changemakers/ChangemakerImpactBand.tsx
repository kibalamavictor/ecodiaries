import { computeOrgImpactBandStats } from '@/lib/changemakers/org-impact-band-stats'
import type { AtlasProject } from '@/lib/solutions/types'

type ChangemakerImpactBandProps = {
  projects: AtlasProject[]
  /** Pass only when the org record has an existing headline-impact field with a value. */
  headlineImpact?: string | null
}

export function ChangemakerImpactBand({ projects, headlineImpact }: ChangemakerImpactBandProps) {
  const stats = computeOrgImpactBandStats(projects, headlineImpact)
  if (!stats?.length) return null

  const summary = stats.map((stat) => `${stat.value} ${stat.label}`).join(', ')
  const columnClass =
    stats.length === 3 ? 'org-impact-band--three' : 'org-impact-band--two'

  return (
    <div className="org-impact-band-wrap">
      <section
        className={`org-impact-band ${columnClass}`}
        aria-label={`Impact across projects: ${summary}`}
      >
        {stats.map((stat, index) => (
          <div key={stat.label} className="org-impact-band__cell">
            <p className="org-impact-band__value">{stat.value}</p>
            <p className="org-impact-band__label">{stat.label}</p>
            {index < stats.length - 1 ? (
              <div className="org-impact-band__divider" aria-hidden />
            ) : null}
          </div>
        ))}
      </section>
    </div>
  )
}
