import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { mapContributorFromCms } from '@/lib/contributors/map-from-cms'
import type { Contributor } from '@/lib/contributors/types'

async function fetchContributorsForPage(): Promise<Contributor[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'contributors',
      where: { applicationStatus: { equals: 'approved' } },
      sort: 'name',
      limit: 100,
      depth: 1,
    })

    return result.docs.map((doc) =>
      mapContributorFromCms({
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        role: doc.role,
        bio: doc.bio,
        profilePhoto: doc.profilePhoto,
        expertise: doc.expertise,
        socialLinks: doc.socialLinks,
        email: doc.email,
        region: doc.region,
      }),
    )
  } catch {
    return []
  }
}

export function getContributorsForPage() {
  return unstable_cache(fetchContributorsForPage, ['contributors-page'], {
    tags: [CACHE_TAGS.contributors],
    revalidate: 60,
  })()
}
