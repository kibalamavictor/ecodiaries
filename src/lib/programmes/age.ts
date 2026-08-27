export type ProgrammeAgeBucket = 'new' | 'recent' | 'old'

const NEW_DAYS = 90
const RECENT_DAYS = 365

export function getProgrammeAgeBucket(createdAt: string, now = Date.now()): ProgrammeAgeBucket {
  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) return 'old'

  const ageDays = (now - created) / (1000 * 60 * 60 * 24)
  if (ageDays <= NEW_DAYS) return 'new'
  if (ageDays <= RECENT_DAYS) return 'recent'
  return 'old'
}
