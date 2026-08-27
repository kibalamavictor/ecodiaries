import type { OpportunityType } from '@/lib/programmes/types'

export function opportunityApplyLabel(type: OpportunityType): string {
  switch (type) {
    case 'grant':
      return 'Apply for grant'
    case 'fellowship':
      return 'Apply for fellowship'
    case 'event':
      return 'Register'
    default:
      return 'Apply now'
  }
}
