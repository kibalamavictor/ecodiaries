import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { resolveEditorialUrl, resolveMediaUrl } from '@/lib/cms/mappers'
import { uniquifyEditorialImages } from '@/lib/unsplash-environment'

async function fetchContributors() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'contributors',
      where: { applicationStatus: { equals: 'approved' } },
      sort: 'name',
      limit: 50,
      depth: 1,
    })

    return result.docs.map((c) => ({
      slug: c.slug || String(c.id),
      name: c.name,
      role: c.role || 'Contributor',
      bio: c.expertise?.map((e: { area?: string | null }) => e.area).filter(Boolean).join(', ') || c.bio || '',
      avatar: resolveMediaUrl(c.profilePhoto as never, `https://picsum.photos/seed/${c.name}/120/120`),
    }))
  } catch {
    return []
  }
}

async function fetchProgrammes() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'programmes', sort: 'name', limit: 20 })
    return result.docs.map((p) => ({
      slug: p.slug,
      eyebrow: p.cadence || '',
      title: p.name,
      description: p.description || '',
      bgClass: p.accentColor || 'bg-forest',
      status: (p.status as 'open' | 'closed') || 'open',
      createdAt: p.createdAt,
    }))
  } catch {
    return []
  }
}

async function fetchCommunityProjects() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'community-projects', limit: 20, depth: 1 })
    return uniquifyEditorialImages(
      result.docs.map((p) => ({
        title: p.title,
        excerpt: p.description || '',
        image: resolveEditorialUrl(p.image as never, `community:${p.title}`),
      })),
      (project) => project.title,
      (project) => project.image,
      (project, image) => ({ ...project, image }),
    )
  } catch {
    return []
  }
}

async function fetchPartners() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'partner-organisations', limit: 20 })
    return result.docs.map((p) => p.name)
  } catch {
    return []
  }
}

export function getContributors() {
  return unstable_cache(fetchContributors, ['contributors'], {
    tags: [CACHE_TAGS.contributors],
    revalidate: 60,
  })()
}

export function getProgrammes() {
  return unstable_cache(fetchProgrammes, ['programmes'], {
    tags: [CACHE_TAGS.programmes],
    revalidate: 60,
  })()
}

export function getCommunityProjects() {
  return unstable_cache(fetchCommunityProjects, ['community-projects', 'editorial-v2'], {
    tags: [CACHE_TAGS.community],
    revalidate: 60,
  })()
}

export function getPartners() {
  return unstable_cache(fetchPartners, ['partners'], {
    tags: [CACHE_TAGS.community],
    revalidate: 60,
  })()
}
