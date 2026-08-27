import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { resolveMediaUrl } from '@/lib/cms/mappers'
import { CACHE_TAGS } from '@/lib/cache-tags'
import type { AtlasOrganization, AtlasProject } from '@/lib/solutions/types'
import { getAtlasProjects } from '@/lib/cms/solutions-page'

export type ChangemakerProfile = AtlasOrganization & {
  bio: unknown
  team: { name: string; role?: string; photoUrl?: string }[]
  socials?: { twitter?: string; linkedin?: string; instagram?: string }
  projects: AtlasProject[]
  aggregateImpact: { label: string; value: string }[]
}

async function fetchChangemakers(): Promise<ChangemakerProfile[]> {
  try {
    const payload = await getPayloadClient()
    const orgs = await payload.find({ collection: 'organizations', limit: 100, depth: 1 })
    const projects = await getAtlasProjects()

    return orgs.docs.map((org) => {
      const orgProjects = projects.filter((p) => p.organization?.id === String(org.id))
      const aggregateImpact = orgProjects.flatMap((p) => p.keyImpact).slice(0, 4)

      return {
        id: String(org.id),
        slug: String(org.slug),
        name: String(org.name),
        type: String(org.type || 'ngo'),
        tagline: org.tagline || undefined,
        logoUrl: resolveMediaUrl(org.logo as never, ''),
        coverUrl: resolveMediaUrl(org.coverImage as never, ''),
        website: org.website || undefined,
        donationUrl: org.donationUrl || undefined,
        hqLocation: org.hqLocation || undefined,
        regions: (org.regions as string[]) || [],
        focusAreas: (org.focusAreas as string[]) || [],
        verified: Boolean(org.verified),
        bio: org.bio,
        team:
          org.team?.map((m) => ({
            name: m.name,
            role: m.role || undefined,
            photoUrl: resolveMediaUrl(m.photo as never, ''),
          })) ?? [],
        socials: org.socials
          ? {
              twitter: org.socials.twitter || undefined,
              linkedin: org.socials.linkedin || undefined,
              instagram: org.socials.instagram || undefined,
            }
          : undefined,
        projects: orgProjects,
        aggregateImpact,
      }
    })
  } catch {
    return []
  }
}

export function getChangemakers() {
  return unstable_cache(fetchChangemakers, ['changemakers'], {
    tags: [CACHE_TAGS.solutions],
    revalidate: 60,
  })()
}

export async function getChangemakerBySlug(slug: string): Promise<ChangemakerProfile | null> {
  const all = await getChangemakers()
  return all.find((c) => c.slug === slug) ?? null
}
