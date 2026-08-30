import type { AtlasProject } from '@/lib/solutions/types'

export type MetricCallout = {
  value: string
  label: string
}

/** Primary proof metric for cards — prefers structured keyImpact, falls back to keyMetric string. */
export function getPrimaryMetric(solution: Pick<AtlasProject, 'keyImpact' | 'keyMetric'>): MetricCallout {
  const tile = solution.keyImpact[0]
  if (tile?.value) {
    return { value: tile.value, label: tile.label || 'Impact' }
  }

  const raw = solution.keyMetric.trim()
  const match = raw.match(/^([\d,.]+%?)\s+(.+)$/i)
  if (match) {
    return { value: match[1], label: match[2] }
  }

  return { value: raw, label: 'Impact' }
}
