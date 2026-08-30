import { resolveMediaUrl } from '@/lib/cms/mappers'
import { resolvePlaybackSource } from '@/lib/cms/video-playback'
import { parseDurationLabel } from '@/lib/cms/format-time'
import type { WatchVideoItem } from '@/lib/cms/video-types'

type VideoDoc = {
  slug: string
  title: string
  categoryTag?: string | null
  duration?: string | null
  durationSeconds?: number | null
  featured?: boolean | null
  description?: string | null
  thumbnail?: unknown
  publishedAt?: string | null
  videoFile?: unknown
  embedUrl?: string | null
  series?: { name?: string | null } | number | null
}

export function mapWatchVideo(doc: VideoDoc): WatchVideoItem {
  return {
    slug: doc.slug,
    type: doc.categoryTag || 'Documentary',
    title: doc.title,
    duration: doc.duration || '',
    durationSeconds:
      typeof doc.durationSeconds === 'number' ? doc.durationSeconds : parseDurationLabel(doc.duration),
    featured: doc.featured || false,
    description: doc.description || undefined,
    image: resolveMediaUrl(doc.thumbnail as never, `https://picsum.photos/seed/${doc.slug}/600/400`),
    channel:
      typeof doc.series === 'object' && doc.series && 'name' in doc.series
        ? (doc.series.name as string)
        : 'EcoDiaries',
    publishedAt: doc.publishedAt || undefined,
    playback: resolvePlaybackSource({
      videoFile: doc.videoFile as never,
      embedUrl: doc.embedUrl,
    }),
  }
}
