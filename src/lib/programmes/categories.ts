import type { OpportunityType } from '@/lib/programmes/types'
import { OPPORTUNITY_TYPE_PLURALS } from '@/lib/programmes/types'

export const OPPORTUNITY_CATEGORY_ORDER: OpportunityType[] = [
  'programme',
  'grant',
  'fellowship',
  'event',
]

export const OPPORTUNITY_TYPE_SLUGS: Record<OpportunityType, string> = {
  programme: 'programmes',
  grant: 'grants',
  fellowship: 'fellowships',
  event: 'events',
}

export function opportunityTypeFromSlug(slug: string): OpportunityType | null {
  const entry = Object.entries(OPPORTUNITY_TYPE_SLUGS).find(([, value]) => value === slug)
  return entry ? (entry[0] as OpportunityType) : null
}

export function categorySectionTitle(type: OpportunityType): string {
  return OPPORTUNITY_TYPE_PLURALS[type]
}

export const CATEGORY_CAROUSEL_VISIBLE = 4
