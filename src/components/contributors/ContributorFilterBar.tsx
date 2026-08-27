import type { ContributorCategory } from '@/lib/contributors/types'
import { CONTRIBUTOR_FILTER_OPTIONS } from '@/lib/contributors/types'

type ContributorFilterBarProps = {
  activeFilter: ContributorCategory | 'all'
  onChange: (value: ContributorCategory | 'all') => void
  count: number
}

export function ContributorFilterBar({ activeFilter, onChange, count }: ContributorFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="contributor-filter-scroll flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CONTRIBUTOR_FILTER_OPTIONS.map((option) => {
          const isActive = activeFilter === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
              className={
                isActive
                  ? 'shrink-0 rounded-full bg-brand-forest px-4 py-2 text-sm font-semibold text-white'
                  : 'shrink-0 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-neutral-200'
              }
            >
              {option.label}
            </button>
          )
        })}
      </div>
      <p className="shrink-0 text-sm text-muted-foreground">
        Showing {count} contributor{count === 1 ? '' : 's'}
      </p>
    </div>
  )
}
