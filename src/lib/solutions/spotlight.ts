import type { AtlasProject } from '@/lib/solutions/types'

const SPOTLIGHT_STATUSES = new Set<AtlasProject['status']>(['scaling', 'established'])

/** Featured flag first, then newest scaling/established, then any project. */
export function pickSpotlightSolution(projects: AtlasProject[]): AtlasProject | null {
  return pickSpotlightSolutions(projects, 1)[0] ?? null
}

/** Spotlight carousel candidates — featured first, then scaling/established fallbacks. */
export function pickSpotlightSolutions(projects: AtlasProject[], limit = 8): AtlasProject[] {
  if (!projects.length) return []

  const byDate = (a: AtlasProject, b: AtlasProject) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

  const featured = projects.filter((p) => p.featured).sort(byDate)
  if (featured.length) return featured.slice(0, limit)

  const eligible = projects.filter((p) => SPOTLIGHT_STATUSES.has(p.status)).sort(byDate)
  if (eligible.length) return eligible.slice(0, limit)

  return [...projects].sort(byDate).slice(0, limit)
}
