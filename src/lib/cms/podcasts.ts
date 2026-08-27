import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { resolveMediaUrl } from '@/lib/cms/mappers'
import { parseDurationLabel } from '@/lib/cms/format-time'
import { resolveSeriesSlug } from '@/lib/cms/video-series'
import type { PodcastEpisode, PodcastHost } from '@/lib/cms/podcast-types'

export type { PodcastEpisode, PodcastHost } from '@/lib/cms/podcast-types'

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

async function fetchEpisodes(limit = 20): Promise<PodcastEpisode[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'podcast-episodes',
      sort: '-publishedAt',
      limit,
      depth: 2,
    })

    return result.docs.map((ep) => {
      const thumbnail =
        resolveMediaUrl(ep.thumbnail as never) ||
        resolveMediaUrl(ep.coverArt as never) ||
        `https://picsum.photos/seed/${ep.slug}/800/450`
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
        slug: ep.slug,
        num: ep.episodeNumber || 0,
        seasonNumber: ep.seasonNumber || undefined,
        title: ep.title,
        series: seriesName,
        seriesSlug,
        duration: ep.duration || '',
        durationSeconds:
          typeof ep.durationSeconds === 'number'
            ? ep.durationSeconds
            : parseDurationLabel(ep.duration),
        description: ep.description || '',
        featured: ep.featured || false,
        embedUrl: ep.embedUrl,
        audioUrl:
          typeof ep.audioFile === 'object' && ep.audioFile && 'url' in ep.audioFile
            ? (ep.audioFile.url as string)
            : undefined,
        thumbnail,
        publishedAt: ep.publishedAt || undefined,
        hosts: hosts as PodcastHost[],
      }
    })
  } catch {
    return []
  }
}

async function fetchPodcastSeries() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'series',
      where: { type: { equals: 'podcast' } },
      limit: 10,
    })
    const bgClasses = ['bg-magenta', 'bg-forest', 'bg-teal']
    return result.docs.map((s, i) => ({
      meta: s.name.toUpperCase(),
      title: s.name,
      description: s.description || '',
      bgClass: bgClasses[i % bgClasses.length],
    }))
  } catch {
    return []
  }
}

export function getEpisodes(limit = 20) {
  return unstable_cache(() => fetchEpisodes(limit), ['episodes', String(limit)], {
    tags: [CACHE_TAGS.podcasts],
    revalidate: 60,
  })()
}

export function getPodcastSeries() {
  return unstable_cache(fetchPodcastSeries, ['podcast-series'], {
    tags: [CACHE_TAGS.podcasts],
    revalidate: 60,
  })()
}
