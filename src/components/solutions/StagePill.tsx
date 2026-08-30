import { STATUS_LABELS, type SolutionStatus } from '@/lib/solutions/types'
import { stageColorMap } from '@/lib/solutions/stage-styles'
import { cn } from '@/lib/utils'

type StagePillProps = {
  status: SolutionStatus
  className?: string
  /** Overlay on photos — adds shadow and inset from edge */
  variant?: 'default' | 'overlay'
}

export function StagePill({ status, className, variant = 'default' }: StagePillProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        stageColorMap[status],
        variant === 'overlay' && 'shadow-[0_2px_8px_rgba(7,13,2,0.2)] ring-2 ring-white/30',
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
