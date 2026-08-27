import pg from 'pg'

import { fileURLToPath } from 'url'

/**
 * Drop legacy columns removed from Payload collections before Drizzle push.
 * Orphan DB columns make drizzle-kit ask interactively whether new columns are renames.
 */
const LEGACY_DROPS: { table: string; column: string }[] = [
  { table: 'categories', column: 'is_seed_content' },
  { table: 'community_projects', column: 'is_seed_content' },
  { table: 'contributors', column: 'is_seed_content' },
  { table: 'impact_updates', column: 'is_seed_content' },
  { table: 'organizations', column: 'is_seed_content' },
  { table: 'partner_organisations', column: 'is_seed_content' },
  { table: 'podcast_episodes', column: 'is_seed_content' },
  { table: 'programmes', column: 'is_seed_content' },
  { table: 'series', column: 'is_seed_content' },
  { table: 'solutions', column: 'is_seed_content' },
  { table: 'stories', column: 'is_seed_content' },
  { table: 'videos', column: 'is_seed_content' },
]

export async function alignSchema(connectionString: string): Promise<void> {
  const pool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    max: 1,
  })

  try {
    for (const { table, column } of LEGACY_DROPS) {
      await pool.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${column}"`)
    }
    console.log(`[db-align] dropped legacy columns from ${LEGACY_DROPS.length} tables`)
  } finally {
    await pool.end()
  }
}

async function main() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_URL is required.')
  }

  await alignSchema(connectionString)
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url)

if (isMain) {
  main().catch((err) => {
    console.error('[db-align] failed:', err)
    process.exit(1)
  })
}
