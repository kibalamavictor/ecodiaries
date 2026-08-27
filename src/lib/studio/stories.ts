import { getPayloadClient } from '@/lib/payload'
import type { Story } from '@/payload-types'
import type { AdminStory } from '@/lib/studio/types'
import { mapStoryToAdmin } from '@/lib/studio/story-mapper'

export { mapStoryToAdmin }

export async function fetchAdminStories(): Promise<AdminStory[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stories',
    limit: 200,
    depth: 2,
    sort: '-updatedAt',
  })
  return result.docs.map((s) => mapStoryToAdmin(s as Story))
}

export async function fetchStoryCategories(): Promise<{ id: number; name: string }[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'categories', limit: 100, sort: 'name' })
  return result.docs.map((c) => ({ id: c.id as number, name: c.name }))
}
