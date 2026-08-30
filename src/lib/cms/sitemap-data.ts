import { getPayloadClient } from '@/lib/payload'

export async function getSitemapEntries() {
  try {
    const payload = await getPayloadClient()
    const [stories, solutions, programmes] = await Promise.all([
      payload.find({
        collection: 'stories',
        where: { status: { equals: 'published' } },
        limit: 500,
        depth: 0,
      }),
      payload.find({ collection: 'solutions', limit: 500, depth: 0 }),
      payload.find({ collection: 'programmes', limit: 50, depth: 0 }),
    ])

    return {
      stories: stories.docs.map((s) => ({
        slug: s.slug as string,
        updatedAt: s.updatedAt,
      })),
      solutions: solutions.docs.map((s) => ({
        slug: s.slug as string,
        updatedAt: s.updatedAt,
      })),
      programmes: programmes.docs.map((p) => ({
        slug: p.slug as string,
        updatedAt: p.updatedAt,
      })),
    }
  } catch {
    return { stories: [], solutions: [], programmes: [] }
  }
}
