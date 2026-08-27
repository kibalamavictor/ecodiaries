import { getProgrammeAgeBucket } from '@/lib/programmes/age'
import { OPPORTUNITY_TYPE_LABELS, type OpportunityType, type Programme } from '@/lib/programmes/types'

export const PROGRAMME_TYPE_FILTERS = [
  { label: 'All', slug: 'all' },
  { label: 'Programmes', slug: 'programmes' },
  { label: 'Grants', slug: 'grants' },
  { label: 'Fellowships', slug: 'fellowships' },
  { label: 'Events', slug: 'events' },
] as const

export const PROGRAMME_AGE_FILTERS = [
  { label: 'All', slug: 'all' },
  { label: 'New', slug: 'new' },
  { label: 'Recent', slug: 'recent' },
  { label: 'Old', slug: 'old' },
] as const

const TYPE_SLUG_TO_VALUE: Record<string, OpportunityType | 'all'> = {
  all: 'all',
  programmes: 'programme',
  programme: 'programme',
  grants: 'grant',
  grant: 'grant',
  fellowships: 'fellowship',
  fellowship: 'fellowship',
  events: 'event',
  event: 'event',
}

export function programmeMatchesQuery(programme: Programme, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return (
    programme.title.toLowerCase().includes(q) ||
    programme.description.toLowerCase().includes(q) ||
    programme.eyebrow.toLowerCase().includes(q) ||
    OPPORTUNITY_TYPE_LABELS[programme.opportunityType].toLowerCase().includes(q)
  )
}

export function filterProgrammes(
  programmes: Programme[],
  type: string,
  age: string,
  query = '',
  now = Date.now(),
): Programme[] {
  const typeValue = TYPE_SLUG_TO_VALUE[type] ?? 'all'

  return programmes.filter((programme) => {
    if (typeValue !== 'all' && programme.opportunityType !== typeValue) return false

    if (age === 'new' || age === 'recent' || age === 'old') {
      if (getProgrammeAgeBucket(programme.createdAt, now) !== age) return false
    }

    if (!programmeMatchesQuery(programme, query)) return false

    return true
  })
}

export function programmeFilterSummary(type: string, age: string, query = ''): string {
  const parts: string[] = []

  if (type !== 'all') {
    parts.push(PROGRAMME_TYPE_FILTERS.find((filter) => filter.slug === type)?.label ?? type)
  }

  if (age !== 'all') {
    parts.push(PROGRAMME_AGE_FILTERS.find((filter) => filter.slug === age)?.label ?? age)
  }

  const trimmedQuery = query.trim()
  if (trimmedQuery) {
    parts.push(`“${trimmedQuery}”`)
  }

  return parts.length ? parts.join(' · ') : 'All'
}
