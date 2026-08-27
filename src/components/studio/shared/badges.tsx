import type { ContentStatus } from '@/lib/studio/types'
import { statusConfig } from '@/lib/studio/status'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: ContentStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium', config.className)}>
      <StatusDot status={status} />
      {config.label}
    </span>
  )
}

export function CategoryTag({ category }: { category: string }) {
  return (
    <span className="inline-flex h-6 max-w-full items-center whitespace-nowrap rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
      {category}
    </span>
  )
}

export function StatusDot({ status }: { status: ContentStatus }) {
  const config = statusConfig[status]
  return <span className={cn('h-2 w-2 shrink-0 rounded-sm', config.dotClassName)} aria-hidden />
}
