import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { resolveCategoryName, resolveEditorialUrl } from '@/lib/cms/mappers'
import { uniquifyEditorialImages } from '@/lib/unsplash-environment'

async function fetchSolutions(categorySlug?: string, query?: string) {
  try {
    const payload = await getPayloadClient()
    const and: Where[] = []

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
        or: [{ title: { contains: q } }, { summary: { contains: q } }, { statHighlight: { contains: q } }],
      })
    }

    const result = await payload.find({
      collection: 'solutions',
      where: and.length ? { and } : {},
      sort: 'title',
      limit: 50,
      depth: 2,
    })

    return uniquifyEditorialImages(
      result.docs.map((s) => ({
        slug: s.slug,
        category: resolveCategoryName(s.category as never),
        title: s.title,
        description: s.summary || '',
        stat: s.statHighlight || '',
        image: resolveEditorialUrl(s.heroImage as never, `solution:${s.slug}`),
        verified: s.verified ?? true,
      })),
      (solution) => solution.slug,
      (solution) => solution.image,
      (solution, image) => ({ ...solution, image }),
    )
  } catch {
    return []
  }
}

async function fetchSolutionBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export function getSolutions(categorySlug?: string, query?: string) {
  return unstable_cache(
    () => fetchSolutions(categorySlug, query),
    ['solutions', 'editorial-v2', categorySlug || 'all', query || ''],
    { tags: [CACHE_TAGS.solutions], revalidate: 60 },
  )()
}

export function getSolutionBySlug(slug: string) {
  return unstable_cache(() => fetchSolutionBySlug(slug), ['solution', slug], {
    tags: [CACHE_TAGS.solutions],
    revalidate: 60,
  })()
}
