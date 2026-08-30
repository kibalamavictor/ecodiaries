import { getProgrammeAgeBucket } from '@/lib/programmes/age'
import { isProgrammeClosed } from '@/lib/programmes/status'
import type { Programme } from '@/lib/programmes/types'

export function sortProgrammes(programmes: Programme[], now = Date.now()): Programme[] {
  return [...programmes].sort((a, b) => {
    const aClosed = isProgrammeClosed(a, now)
    const bClosed = isProgrammeClosed(b, now)

    if (aClosed !== bClosed) return aClosed ? 1 : -1

    if (!aClosed) {
      const aNew = getProgrammeAgeBucket(a.createdAt, now) === 'new'
      const bNew = getProgrammeAgeBucket(b.createdAt, now) === 'new'
      if (aNew !== bNew) return aNew ? -1 : 1

      const aClose = a.applicationCloseDate ? new Date(a.applicationCloseDate).getTime() : Number.POSITIVE_INFINITY
      const bClose = b.applicationCloseDate ? new Date(b.applicationCloseDate).getTime() : Number.POSITIVE_INFINITY
      if (aClose !== bClose) return aClose - bClose
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
