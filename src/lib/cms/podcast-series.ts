import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { resolveMediaUrl } from '@/lib/cms/mappers'
import { parseDurationLabel } from '@/lib/cms/format-time'
import { resolveSeriesSlug } from '@/lib/cms/video-series'
import type { PodcastEpisode, PodcastHost } from '@/lib/cms/podcast-types'
import type { PodcastSeriesDetail, PodcastSeriesListItem } from '@/lib/cms/podcast-series-types'

type SeriesDoc = {
  id: number
  name: string
  slug?: string | null
  description?: string | null
  coverArt?: unknown
  type?: string | null
}

function mapHost(entry: Record<string, unknown>): PodcastHost | null {
  const role = (entry.role as string) || 'Host'
  if (entry.isExternal) {
    const name = entry.externalName as string | undefined
    if (!name) return null
    return {
      name,
      role,
      bio: (entry.externalBio as string) || undefined,
      avatar: resolveMediaUrl(entry.externalAvatar as never),
      socialLinks: entry.externalSocialUrl
        ? [{ platform: 'Link', url: entry.externalSocialUrl as string }]
        : [],
    }
  }
  const contributor = entry.contributor
  if (!contributor || typeof contributor !== 'object') return null
  const c = contributor as Record<string, unknown>
  const socialLinks = Array.isArray(c.socialLinks)
    ? (c.socialLinks as { platform?: string; url?: string }[])
        .filter((l) => l.url)
        .map((l) => ({ platform: l.platform || 'Link', url: l.url! }))
    : []
  return {
    name: (c.name as string) || 'Contributor',
    role,
    bio: (c.bio as string) || undefined,
    avatar: resolveMediaUrl(c.profilePhoto as never),
    socialLinks,
  }
}

function mapPodcastEpisode(ep: Record<string, unknown>): PodcastEpisode {
  const slug = ep.slug as string
  const thumbnail =
    resolveMediaUrl(ep.thumbnail as never) ||
    resolveMediaUrl(ep.coverArt as never) ||
    `https://picsum.photos/seed/${slug}/800/450`
  const hosts = Array.isArray(ep.hosts)
    ? ep.hosts.map((h) => mapHost(h as Record<string, unknown>)).filter(Boolean)
    : []

  const seriesRel = ep.series
  const seriesName =
    typeof seriesRel === 'object' && seriesRel && 'name' in seriesRel
      ? (seriesRel.name as string)
      : 'Podcast'
  const seriesSlug =
    typeof seriesRel === 'object' && seriesRel && 'name' in seriesRel
      ? resolveSeriesSlug(seriesRel as { slug?: string | null; name: string })
      : undefined

  return {
    id: String(ep.id),
    slug,
    num: (ep.episodeNumber as number) || 0,
    seasonNumber: (ep.seasonNumber as number) || undefined,
    title: ep.title as string,
    series: seriesName,
    seriesSlug,
    duration: (ep.duration as string) || '',
    durationSeconds:
      typeof ep.durationSeconds === 'number'
        ? ep.durationSeconds
        : parseDurationLabel(ep.duration as string),
    description: (ep.description as string) || '',
    featured: Boolean(ep.featured),
    embedUrl: (ep.embedUrl as string) || null,
    audioUrl:
      typeof ep.audioFile === 'object' && ep.audioFile && 'url' in ep.audioFile
        ? (ep.audioFile.url as string)
        : undefined,
    thumbnail,
    publishedAt: (ep.publishedAt as string) || undefined,
    hosts: hosts as PodcastHost[],
  }
}

function resolveSeriesCover(series: SeriesDoc, firstEpisodeImageUrl?: string): string {
  const cover = resolveMediaUrl(series.coverArt as never, '')
  if (cover) return cover
  if (firstEpisodeImageUrl) return firstEpisodeImageUrl
  return `https://picsum.photos/seed/${resolveSeriesSlug(series)}/800/450`
}

function resolveSeriesHook(seriesDescription: string, firstEpisode: PodcastEpisode): string {
  const fromSeries = seriesDescription.trim()
  if (fromSeries) return fromSeries
  return firstEpisode.description.trim()
}

function collectSeriesHosts(episodes: PodcastEpisode[], limit = 2): PodcastHost[] {
  const seen = new Set<string>()
  const hosts: PodcastHost[] = []

  for (const episode of episodes) {
    for (const host of episode.hosts) {
      if (seen.has(host.name)) continue
      seen.add(host.name)
      hosts.push(host)
      if (hosts.length >= limit) return hosts
    }
  }

  return hosts
}

function buildSeriesListItem(series: SeriesDoc, episodes: PodcastEpisode[]): PodcastSeriesListItem {
  const slug = resolveSeriesSlug(series)
  const firstEpisode = episodes[0]

  return {
    slug,
    title: series.name,
    description: series.description || '',
    hook: resolveSeriesHook(series.description || '', firstEpisode),
    coverImage: resolveSeriesCover(series, firstEpisode?.thumbnail),
    episodeCount: episodes.length,
    hosts: collectSeriesHosts(episodes),
  }
}

async function fetchEpisodesForSeries(seriesId: number): Promise<PodcastEpisode[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'podcast-episodes',
    where: { series: { equals: seriesId } },
    sort: '-publishedAt',
    limit: 100,
    depth: 2,
  })
  return result.docs.map((doc) => mapPodcastEpisode(doc as unknown as Record<string, unknown>))
}

async function fetchPodcastSeriesList(): Promise<PodcastSeriesListItem[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'series',
      where: { type: { equals: 'podcast' } },
      sort: 'name',
      limit: 20,
      depth: 1,
    })

    const list = await Promise.all(
      result.docs.map(async (series) => {
        const episodes = await fetchEpisodesForSeries(series.id as number)
        if (!episodes.length) return null

        return buildSeriesListItem(series as SeriesDoc, episodes)
      }),
    )

    return list.filter((item): item is PodcastSeriesListItem => item !== null)
  } catch {
    return []
  }
}

async function fetchPodcastSeriesBySlug(slug: string): Promise<PodcastSeriesDetail | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'series',
      where: { type: { equals: 'podcast' } },
      limit: 50,
      depth: 1,
    })

    const series = result.docs.find((doc) => resolveSeriesSlug(doc as SeriesDoc) === slug)
    if (!series) return null

    const episodes = await fetchEpisodesForSeries(series.id as number)
    if (!episodes.length) return null

    return {
      ...buildSeriesListItem(series as SeriesDoc, episodes),
      episodes,
    }
  } catch {
    return null
  }
}

async function fetchPodcastSeriesSlugs(): Promise<string[]> {
  const list = await fetchPodcastSeriesList()
  return list.map((series) => series.slug)
}

export function getPodcastSeriesList() {
  return unstable_cache(fetchPodcastSeriesList, ['podcast-series-list'], {
    tags: [CACHE_TAGS.podcasts],
    revalidate: 60,
  })()
}

export function getPodcastSeriesBySlug(slug: string) {
  return unstable_cache(() => fetchPodcastSeriesBySlug(slug), ['podcast-series', slug], {
    tags: [CACHE_TAGS.podcasts, `podcast-series:${slug}`],
    revalidate: 60,
  })()
}

export function getPodcastSeriesSlugs() {
  return unstable_cache(fetchPodcastSeriesSlugs, ['podcast-series-slugs'], {
    tags: [CACHE_TAGS.podcasts],
    revalidate: 60,
  })()
}
