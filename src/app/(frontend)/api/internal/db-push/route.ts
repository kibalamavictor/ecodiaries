import { NextResponse } from 'next/server'
import { alignSchema } from '@/scripts/db-align-schema'
import { getPayloadClient } from '@/lib/payload'

export const maxDuration = 300

/**
 * One-time production schema sync. Remove after successful run.
 * POST /api/internal/db-push
 * Authorization: Bearer <PAYLOAD_SECRET>
 */
export async function POST(request: Request) {
  const secret = process.env.PAYLOAD_SECRET
  const auth = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!secret || auth !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  process.env.PAYLOAD_DB_PUSH = 'true'
  process.env.USE_NEON_DRIVER = 'true'

  try {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
    if (connectionString) await alignSchema(connectionString)

    const payload = await getPayloadClient()
    const [stories, solutions, programmes, videos, episodes] = await Promise.all([
      payload.count({ collection: 'stories' }),
      payload.count({ collection: 'solutions' }),
      payload.count({ collection: 'programmes' }),
      payload.count({ collection: 'videos' }),
      payload.count({ collection: 'podcast-episodes' }),
    ])

    return NextResponse.json({
      ok: true,
      counts: {
        stories: stories.totalDocs,
        solutions: solutions.totalDocs,
        programmes: programmes.totalDocs,
        videos: videos.totalDocs,
        episodes: episodes.totalDocs,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
