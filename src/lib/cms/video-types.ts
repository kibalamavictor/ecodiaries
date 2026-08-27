export type WatchVideoItem = {
  slug: string
  type: string
  title: string
  duration: string
  durationSeconds: number | null
  featured?: boolean
  image: string
  description?: string
  channel: string
  publishedAt?: string
  playback: { kind: 'file' | 'embed'; src: string } | null
}

export const WATCH_CATEGORIES = [
  { label: 'All', slug: 'all' },
  { label: 'Documentaries', slug: 'Documentary' },
  { label: 'Field Reports', slug: 'Field Report' },
  { label: 'Interviews', slug: 'Interview' },
  { label: 'Community Spotlights', slug: 'Community Spotlight' },
  { label: 'Educational', slug: 'Educational' },
] as const
