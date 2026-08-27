import { uniqueCountriesCount } from '@/lib/solutions/coordinates'
import type { AtlasProject } from '@/lib/solutions/types'

const PEOPLE_LABEL_PATTERN =
  /people|person|household|beneficiar|farmer|community|resident|user|reached|served|member/i

function parseMetricNumber(raw: string): number | null {
  const cleaned = raw.replace(/,/g, '').trim()
  const match = cleaned.match(/^([\d.]+)\s*([kKmMbB])?\+?/)
  if (!match) return null

  let value = Number(match[1])
  if (Number.isNaN(value)) return null

  const suffix = match[2]?.toLowerCase()
  if (suffix === 'k') value *= 1_000
  if (suffix === 'm' || suffix === 'b') value *= 1_000_000

  return value
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return millions >= 10 ? `${Math.round(millions)}M` : `${millions.toFixed(1).replace(/\.0$/, '')}M`
  }
  if (value >= 1_000) {
    const thousands = value / 1_000
    return thousands >= 10 ? `${Math.round(thousands)}K` : `${thousands.toFixed(1).replace(/\.0$/, '')}K`
  }
  return value.toLocaleString('en-US')
}

export function aggregatePeopleReached(projects: AtlasProject[]): string {
  let total = 0
  let found = false

  for (const project of projects) {
    for (const tile of project.keyImpact) {
      if (!tile.value || !PEOPLE_LABEL_PATTERN.test(tile.label)) continue
      const parsed = parseMetricNumber(tile.value)
      if (parsed != null) {
        total += parsed
        found = true
      }
    }
  }

  if (!found) return '—'
  return `${formatCompact(total)}+`
}

export type SolutionsAtlasStats = {
  solutionCount: number
  countryCount: number
  peopleReached: string
}

export function computeSolutionsAtlasStats(projects: AtlasProject[]): SolutionsAtlasStats {
  return {
    solutionCount: projects.length,
    countryCount: uniqueCountriesCount(projects),
    peopleReached: aggregatePeopleReached(projects),
  }
}
