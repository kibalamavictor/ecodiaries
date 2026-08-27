import type { Programme } from '@/lib/programmes/types'

export function isProgrammeClosed(
  programme: Pick<Programme, 'status' | 'applicationCloseDate'>,
  now = Date.now(),
): boolean {
  if (programme.status === 'closed') return true

  if (!programme.applicationCloseDate) return false

  const closeTime = new Date(programme.applicationCloseDate).getTime()
  if (Number.isNaN(closeTime)) return false

  return closeTime < now
}
