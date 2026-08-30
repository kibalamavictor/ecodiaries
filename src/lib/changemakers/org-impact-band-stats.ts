import type { AtlasProject } from '@/lib/solutions/types'

export type OrgImpactBandStat = {
  value: string
  label: string
}

function distinctCountryKeys(projects: AtlasProject[]): number {
  const keys = new Set<string>()
  for (const project of projects) {
    const key = project.country?.trim() || project.region?.trim()
    if (key) keys.add(key.toLowerCase())
  }
  return keys.size
}

function formatStatNumber(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return `${millions >= 10 ? Math.round(millions) : millions.toFixed(1).replace(/\.0$/, '')}M+`
  }
  if (value >= 1_000) {
    const thousands = value / 1_000
    return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, '')}K+`
  }
  return String(value)
}

/**
 * Read-only stats for the org profile impact band.
 * `headlineImpact` — only pass if the organization record exposes an existing headline metric field.
 */
export function computeOrgImpactBandStats(
  projects: AtlasProject[],
  headlineImpact?: string | null,
): OrgImpactBandStat[] | null {
  if (!projects.length) return null

  const stats: OrgImpactBandStat[] = [
    { value: formatStatNumber(projects.length), label: 'Solutions' },
    { value: formatStatNumber(distinctCountryKeys(projects)), label: 'Countries' },
  ]

  const headline = headlineImpact?.trim()
  if (headline) {
    stats.push({ value: headline, label: 'People reached' })
  }

  return stats
}
