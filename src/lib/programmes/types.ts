export type ProgrammeStatus = 'open' | 'closed'

export type ProgrammeAgeBucket = 'new' | 'recent' | 'old'

export type OpportunityType = 'programme' | 'grant' | 'fellowship' | 'event'

export type Programme = {
  slug: string
  eyebrow: string
  title: string
  description: string
  bgClass: string
  opportunityType: OpportunityType
  status: ProgrammeStatus
  applicationInstructions: string
  applicationUrl: string | null
  applicationOpenDate: string | null
  applicationCloseDate: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export type ProgrammeCardData = Pick<
  Programme,
  | 'slug'
  | 'eyebrow'
  | 'title'
  | 'description'
  | 'bgClass'
  | 'opportunityType'
  | 'status'
  | 'applicationUrl'
  | 'createdAt'
  | 'applicationCloseDate'
>

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  programme: 'Programme',
  grant: 'Grant',
  fellowship: 'Fellowship',
  event: 'Event',
}

export const OPPORTUNITY_TYPE_PLURALS: Record<OpportunityType, string> = {
  programme: 'Programmes',
  grant: 'Grants',
  fellowship: 'Fellowships',
  event: 'Events',
}
