import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { mapSolutionFromCms } from '@/lib/solutions/map-from-cms'
import type { AtlasProject } from '@/lib/solutions/types'

async function fetchPublishedProjects(): Promise<AtlasProject[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'solutions',
      where: { published: { equals: true } },
      sort: '-publishedAt',
      limit: 200,
      depth: 2,
    })
    return result.docs.map((doc) => mapSolutionFromCms(doc as never))
  } catch {
    return []
  }
}

export function getAtlasProjects() {
  return unstable_cache(fetchPublishedProjects, ['atlas-projects'], {
    tags: [CACHE_TAGS.solutions],
    revalidate: 60,
  })()
}

/** @deprecated */
export const getSolutionsForPage = getAtlasProjects

export async function getAtlasProjectBySlug(slug: string): Promise<AtlasProject | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'solutions',
      where: {
        and: [{ slug: { equals: slug } }, { published: { equals: true } }],
      },
      limit: 1,
      depth: 2,
    })
    const doc = result.docs[0]
    return doc ? mapSolutionFromCms(doc as never) : null
  } catch {
    return null
  }
}

/** @deprecated */
export const getSolutionAtlasBySlug = getAtlasProjectBySlug

export async function getRelatedAtlasProjects(
  currentSlug: string,
  sectors: string[],
  limit = 3,
): Promise<AtlasProject[]> {
  const all = await getAtlasProjects()
  return all
    .filter((p) => p.slug !== currentSlug && p.sectors.some((s) => sectors.includes(s)))
    .slice(0, limit)
}
