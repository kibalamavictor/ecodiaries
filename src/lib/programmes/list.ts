import { filterProgrammes } from '@/lib/programmes/filters'
import { sortProgrammes } from '@/lib/programmes/sort'
import type { OpportunityType, Programme } from '@/lib/programmes/types'

export function prepareProgrammesList(
  programmes: Programme[],
  type: string,
  age: string,
  query = '',
): Programme[] {
  return sortProgrammes(filterProgrammes(programmes, type, age, query))
}

export function programmesForCategory(programmes: Programme[], category: OpportunityType): Programme[] {
  return programmes.filter((programme) => programme.opportunityType === category)
}

export function featuredProgrammes(programmes: Programme[]): Programme[] {
  const flagged = programmes.filter((programme) => programme.featured)
  if (flagged.length) return sortProgrammes(flagged)
  return sortProgrammes(programmes).slice(0, 6)
}
