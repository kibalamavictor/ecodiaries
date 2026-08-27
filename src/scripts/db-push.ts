import { fileURLToPath } from 'url'
import { getPayloadClient } from '@/lib/payload'

/**
 * One-time / maintenance: push Payload Drizzle schema to the target database.
 * Usage: PAYLOAD_DB_PUSH=true npm run db:push
 */
export async function runDbPush(): Promise<{ storiesCount: number }> {
  const connectionString =
    process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL is required.')
  }

  process.env.PAYLOAD_DB_PUSH = 'true'

  const payload = await getPayloadClient()
  const count = await payload.count({ collection: 'stories' })
  return { storiesCount: count.totalDocs }
}

async function main() {
  if (process.env.PAYLOAD_DB_PUSH !== 'true') {
    console.error('Set PAYLOAD_DB_PUSH=true to run schema push.')
    process.exit(1)
  }

  if ((process.env.POSTGRES_URL || process.env.DATABASE_URL || '').includes('neon.tech')) {
    process.env.USE_NEON_DRIVER = 'true'
  }

  const host = (process.env.POSTGRES_URL || process.env.DATABASE_URL || '').replace(
    /:[^:@]+@/,
    ':***@',
  )
  console.log(`[db:push] target: ${host}`)
  console.log('[db:push] initializing Payload (schema push may take a few minutes)…')

  const { storiesCount } = await runDbPush()
  console.log(`[db:push] done. stories count: ${storiesCount}`)
  process.exit(0)
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url)

if (isMain) {
  console.log('[db:push] starting…')
  main().catch((err) => {
    console.error('[db:push] failed:', err)
    process.exit(1)
  })
}
