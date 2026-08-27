import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { resolveMediaUrl } from '@/lib/cms/mappers'
import { mapWatchVideo } from '@/lib/cms/map-watch-video'
import type { VideoSeriesDetail, VideoSeriesListItem } from '@/lib/cms/video-series-types'

type SeriesDoc = {
  id: number
  name: string
  slug?: string | null
  description?: string | null
  coverArt?: unknown
  type?: string | null
}

export function resolveSeriesSlug(doc: Pick<SeriesDoc, 'slug' | 'name'>): string {
  const explicit = doc.slug?.trim()
  if (explicit) return explicit
  return doc.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolveSeriesCover(series: SeriesDoc, firstEpisodeImageUrl?: string): string {
  const cover = resolveMediaUrl(series.coverArt as never, '')
  if (cover) return cover
  if (firstEpisodeImageUrl) return firstEpisodeImageUrl
  return `https://picsum.photos/seed/${resolveSeriesSlug(series)}/800/450`
}

async function fetchEpisodesForSeries(seriesId: number) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'videos',
    where: { series: { equals: seriesId } },
    sort: 'publishedAt',
    limit: 100,
    depth: 2,
  })
  return result.docs.map((doc) => mapWatchVideo(doc))
}

async function fetchVideoSeriesList(): Promise<VideoSeriesListItem[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'series',
      where: { type: { equals: 'video' } },
      sort: 'name',
      limit: 20,
      depth: 1,
    })

    const list = await Promise.all(
      result.docs.map(async (series) => {
        const episodes = await fetchEpisodesForSeries(series.id as number)
        if (!episodes.length) return null

        const slug = resolveSeriesSlug(series as SeriesDoc)
        return {
          slug,
          title: series.name,
          description: series.description || '',
          coverImage: resolveSeriesCover(series as SeriesDoc, episodes[0]?.image),
          episodeCount: episodes.length,
        } satisfies VideoSeriesListItem
      }),
    )

    return list.filter((item): item is VideoSeriesListItem => item !== null)
  } catch {
    return []
  }
}

async function fetchVideoSeriesBySlug(slug: string): Promise<VideoSeriesDetail | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'series',
      where: { type: { equals: 'video' } },
      limit: 50,
      depth: 1,
    })

    const series = result.docs.find((doc) => resolveSeriesSlug(doc as SeriesDoc) === slug)
    if (!series) return null

    const episodes = await fetchEpisodesForSeries(series.id as number)
    if (!episodes.length) return null

    return {
      slug: resolveSeriesSlug(series as SeriesDoc),
      title: series.name,
      description: series.description || '',
      coverImage: resolveSeriesCover(series as SeriesDoc, episodes[0]?.image),
      episodeCount: episodes.length,
      episodes,
    }
  } catch {
    return null
  }
}

async function fetchVideoSeriesSlugs(): Promise<string[]> {
  const list = await fetchVideoSeriesList()
  return list.map((series) => series.slug)
}

export function getVideoSeriesList() {
  return unstable_cache(fetchVideoSeriesList, ['video-series-list'], {
    tags: [CACHE_TAGS.videos],
    revalidate: 60,
  })()
}

export function getVideoSeriesBySlug(slug: string) {
  return unstable_cache(() => fetchVideoSeriesBySlug(slug), ['video-series', slug], {
    tags: [CACHE_TAGS.videos, `video-series:${slug}`],
    revalidate: 60,
  })()
}

export function getVideoSeriesSlugs() {
  return unstable_cache(fetchVideoSeriesSlugs, ['video-series-slugs'], {
    tags: [CACHE_TAGS.videos],
    revalidate: 60,
  })()
}
