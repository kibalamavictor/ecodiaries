import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { CMS_REVALIDATE_SECONDS } from '@/lib/cms/cache-config'
import { mapStoryCard } from '@/lib/cms/mappers'
import { uniquifyEditorialImages } from '@/lib/unsplash-environment'
import { unstable_cache } from 'next/cache'

const publishedWhere: Where = { status: { equals: 'published' } }

async function fetchLatestStories(limit: number, categorySlug?: string, query?: string) {
  try {
  const payload = await getPayloadClient()
  const and: Where[] = [publishedWhere]

  if (categorySlug && categorySlug !== 'all') {
    const cat = await payload.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })
    if (cat.docs[0]) and.push({ category: { equals: cat.docs[0].id } })
  }

  if (query?.trim()) {
    const q = query.trim()
    and.push({
      or: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { searchText: { contains: q } },
        { location: { contains: q } },
      ],
    })
  }

  const result = await payload.find({
    collection: 'stories',
    where: { and },
    sort: '-publishedAt',
    limit,
    depth: 2,
  })

  return uniquifyEditorialImages(
    result.docs.map((doc) => mapStoryCard(doc)),
    (story) => story.slug,
    (story) => story.image,
    (story, image) => ({ ...story, image }),
  )
  } catch {
    return []
  }
}

async function fetchFeaturedStory() {
  const stories = await fetchFeaturedStories(1)
  return stories[0] ?? null
}

async function fetchFeaturedStories(limit: number, fillWithLatest = true) {
  try {
    const payload = await getPayloadClient()
    const featured = await payload.find({
      collection: 'stories',
      where: { and: [publishedWhere, { featured: { equals: true } }] },
      sort: '-publishedAt',
      limit,
      depth: 2,
    })

    const stories = uniquifyEditorialImages(
      featured.docs.map((doc) => mapStoryCard(doc)),
      (story) => story.slug,
      (story) => story.image,
      (story, image) => ({ ...story, image }),
    )
    if (!fillWithLatest || stories.length >= limit) return stories

    const latest = await payload.find({
      collection: 'stories',
      where: publishedWhere,
      sort: '-publishedAt',
      limit,
      depth: 2,
    })

    const seen = new Set(stories.map((s) => s.slug))
    for (const doc of latest.docs) {
      const card = mapStoryCard(doc)
      if (seen.has(card.slug)) continue
      stories.push(card)
      seen.add(card.slug)
      if (stories.length >= limit) break
    }

    return uniquifyEditorialImages(
      stories,
      (story) => story.slug,
      (story) => story.image,
      (story, image) => ({ ...story, image }),
    )
  } catch {
    return []
  }
}

async function fetchStoryBySlug(slug: string) {
  try {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stories',
    where: { and: [publishedWhere, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
  } catch {
    return null
  }
}

async function fetchCategories() {
  try {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'categories', sort: 'name', limit: 100 })).docs
  } catch {
    return []
  }
}

async function fetchFeaturedEpisodes(limit = 3) {
  try {
  const payload = await getPayloadClient()
  const bgClasses = ['bg-magenta', 'bg-forest', 'bg-teal']
  const result = await payload.find({
    collection: 'podcast-episodes',
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return result.docs.map((ep, i) => ({
    meta: `EP. ${ep.episodeNumber ?? '—'} · ${ep.duration ?? '—'}`,
    title: ep.title,
    bgClass: bgClasses[i % bgClasses.length],
    slug: ep.slug,
  }))
  } catch {
    return []
  }
}

export async function searchStories(query: string, limit = 50) {
  return fetchLatestStories(limit, undefined, query)
}

export function getFeaturedStory() {
  return unstable_cache(fetchFeaturedStory, ['featured-story'], {
    tags: [CACHE_TAGS.homepage, CACHE_TAGS.stories],
    revalidate: CMS_REVALIDATE_SECONDS,
  })()
}

export function getFeaturedStories(limit = 4, fillWithLatest = true) {
  return unstable_cache(
    () => fetchFeaturedStories(limit, fillWithLatest),
    ['featured-stories', 'editorial-v2', String(limit), String(fillWithLatest)],
    {
      tags: [CACHE_TAGS.homepage, CACHE_TAGS.stories],
      revalidate: CMS_REVALIDATE_SECONDS,
    },
  )()
}

export function getLatestStories(limit: number, categorySlug?: string, query?: string) {
  return unstable_cache(
    () => fetchLatestStories(limit, categorySlug, query),
    ['latest-stories', 'editorial-v2', String(limit), categorySlug || 'all', query || ''],
    { tags: [CACHE_TAGS.stories], revalidate: 60 },
  )()
}

export function getStoryBySlug(slug: string) {
  return unstable_cache(() => fetchStoryBySlug(slug), ['story', slug], {
    tags: [CACHE_TAGS.stories],
    revalidate: CMS_REVALIDATE_SECONDS,
  })()
}

export function getCategories() {
  return unstable_cache(fetchCategories, ['categories'], {
    tags: [CACHE_TAGS.stories],
    revalidate: 300,
  })()
}

export function getFeaturedEpisodes(limit = 3) {
  return unstable_cache(() => fetchFeaturedEpisodes(limit), ['featured-episodes', String(limit)], {
    tags: [CACHE_TAGS.podcasts, CACHE_TAGS.homepage],
    revalidate: CMS_REVALIDATE_SECONDS,
  })()
}
