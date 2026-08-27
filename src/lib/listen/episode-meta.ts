import type { PodcastEpisode } from '@/lib/cms/podcast-types'

export function formatNumericDate(publishedAt?: string) {
  if (!publishedAt) return ''
  return new Date(publishedAt).toLocaleDateString('en-GB')
}

export function formatEpisodeMeta(
  ep: Pick<PodcastEpisode, 'duration' | 'publishedAt' | 'seasonNumber' | 'num'>,
  options?: { numericDate?: boolean },
) {
  const parts: string[] = []
  if (ep.duration) parts.push(ep.duration)
  if (ep.publishedAt) {
    parts.push(
      options?.numericDate
        ? formatNumericDate(ep.publishedAt)
        : new Date(ep.publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
    )
  }
  if (ep.seasonNumber) parts.push(`S${ep.seasonNumber}`)
  if (ep.num) parts.push(`Ep ${ep.num}`)
  return parts.join(' · ')
}
