import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { mapWatchVideo } from '@/lib/cms/map-watch-video'
import type { WatchVideoItem } from '@/lib/cms/video-types'

export type { WatchVideoItem } from '@/lib/cms/video-types'

async function fetchVideos(categoryTag?: string): Promise<WatchVideoItem[]> {
  try {
    const payload = await getPayloadClient()
    const where: Where =
      categoryTag && categoryTag !== 'all' ? { categoryTag: { equals: categoryTag } } : {}

    const result = await payload.find({
      collection: 'videos',
      where,
      sort: '-publishedAt',
      limit: 50,
      depth: 2,
    })

    return result.docs.map((v) => mapWatchVideo(v))
  } catch {
    return []
  }
}

async function fetchVideoSeries() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'series',
      where: { type: { equals: 'video' } },
      limit: 10,
    })
    const bgClasses = ['bg-magenta', 'bg-forest', 'bg-teal']
    return result.docs.map((s, i) => ({
      meta: s.name.toUpperCase(),
      title: s.name,
      bgClass: bgClasses[i % bgClasses.length],
    }))
  } catch {
    return []
  }
}

export function getVideos(categoryTag?: string) {
  return unstable_cache(
    () => fetchVideos(categoryTag),
    ['videos', categoryTag || 'all'],
    { tags: [CACHE_TAGS.videos], revalidate: 60 },
  )()
}

export function getVideoSeries() {
  return unstable_cache(fetchVideoSeries, ['video-series'], {
    tags: [CACHE_TAGS.videos],
    revalidate: 60,
  })()
}
