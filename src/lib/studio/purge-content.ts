import type { CollectionSlug } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import {
  revalidateCommunity,
  revalidateContributors,
  revalidatePodcasts,
  revalidateProgrammes,
  revalidateSolutions,
  revalidateStories,
  revalidateVideos,
} from '@/lib/revalidate'
import type { PayloadClient } from '@/scripts/seed-helpers'

/** Delete dependents before parents (FK-safe order). */
export const PURGE_COLLECTIONS: CollectionSlug[] = [
  'interest-leads',
  'impact-updates',
  'stories',
  'solutions',
  'videos',
  'podcast-episodes',
  'series',
  'programmes',
  'community-projects',
  'partner-organisations',
  'contact-submissions',
  'newsletter-subscribers',
  'contributors',
  'organizations',
  'categories',
  'media',
]

const BATCH_SIZE = 100
const DELETE_CONCURRENCY = 8

export type PurgeSummary = Record<string, number>

async function deleteBatch(
  payload: PayloadClient,
  collection: CollectionSlug,
  ids: (number | string)[],
) {
  for (let i = 0; i < ids.length; i += DELETE_CONCURRENCY) {
    const slice = ids.slice(i, i + DELETE_CONCURRENCY)
    await Promise.all(
      slice.map((id) =>
        payload.delete({
          collection,
          id,
          overrideAccess: true,
        }),
      ),
    )
  }
}

async function deleteAllInCollection(
  payload: PayloadClient,
  collection: CollectionSlug,
  dryRun: boolean,
): Promise<number> {
  let total = 0

  while (true) {
    const result = await payload.find({
      collection,
      limit: BATCH_SIZE,
      page: dryRun ? Math.floor(total / BATCH_SIZE) + 1 : 1,
      depth: 0,
      overrideAccess: true,
    })

    if (!result.docs.length) break

    total += result.docs.length
    if (!dryRun) {
      await deleteBatch(
        payload,
        collection,
        result.docs.map((doc) => doc.id),
      )
    }

    if (dryRun && !result.hasNextPage) break
    if (!dryRun && !result.hasNextPage) break
  }

  return total
}

async function resetSiteSettings(payload: PayloadClient, dryRun: boolean) {
  if (dryRun) return

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      impactStats: [],
    },
    overrideAccess: true,
  })
}

function revalidateAllContent() {
  revalidateStories()
  revalidateSolutions()
  revalidateVideos()
  revalidatePodcasts()
  revalidateContributors()
  revalidateProgrammes()
  revalidateCommunity()
}

export async function purgePlaceholderContent(dryRun = false): Promise<PurgeSummary> {
  const payload = await getPayloadClient()
  const summary: PurgeSummary = {}

  for (const collection of PURGE_COLLECTIONS) {
    summary[collection] = await deleteAllInCollection(payload, collection, dryRun)
  }

  await resetSiteSettings(payload, dryRun)

  if (!dryRun) {
    revalidateAllContent()
  }

  return summary
}
