import { getPrimaryMetric } from '@/lib/solutions/metric-callout'
import type { AtlasProject } from '@/lib/solutions/types'
import { cn } from '@/lib/utils'

type SolutionMetricCalloutProps = {
  solution: Pick<AtlasProject, 'keyImpact' | 'keyMetric'>
  className?: string
}

export function SolutionMetricCallout({ solution, className }: SolutionMetricCalloutProps) {
  const { value, label } = getPrimaryMetric(solution)

  return (
    <div className={cn('solution-metric-callout', className)}>
      <p className="solution-metric-callout__value">{value}</p>
      <p className="solution-metric-callout__label">{label}</p>
    </div>
  )
}
