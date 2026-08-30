import { getMediaCount } from '@/lib/solutions/gallery'
import { getPrimaryMetric } from '@/lib/solutions/metric-callout'
import type { AtlasProject } from '@/lib/solutions/types'

export type SolutionDataGap = {
  slug: string
  title: string
  missingGallery: boolean
  missingMetric: boolean
  missingStage: boolean
}

export function auditSolutionsForMobileGrid(projects: AtlasProject[]): SolutionDataGap[] {
  return projects
    .map((project) => {
      const metric = getPrimaryMetric(project)
      const missingMetric = !metric.value || metric.value === '—' || metric.value.toLowerCase() === 'impact documented in the field'
      const missingGallery = getMediaCount(project) <= 1
      const missingStage = !project.status

      if (!missingGallery && !missingMetric && !missingStage) return null

      return {
        slug: project.slug,
        title: project.title,
        missingGallery,
        missingMetric,
        missingStage,
      }
    })
    .filter((row): row is SolutionDataGap => row != null)
}
