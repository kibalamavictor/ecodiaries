import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * On Vercel production builds, sync Payload/Drizzle schema to Neon before `next build`.
 * 1. Drop legacy orphan columns (avoids interactive rename prompts in CI).
 * 2. Run db-push in a child process with piped stdin for any remaining prompts.
 */
function main() {
  if (process.env.VERCEL !== '1') {
    console.log('[vercel-prebuild] skip (not on Vercel)')
    return
  }

  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
  if (!connectionString.includes('neon.tech')) {
    console.log('[vercel-prebuild] skip (no Neon connection string)')
    return
  }

  const childEnv: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: 'development',
    PAYLOAD_DB_PUSH: 'true',
    USE_NEON_DRIVER: 'true',
  }

  console.log('[vercel-prebuild] dropping legacy orphan columns…')
  const align = spawnSync(
    process.execPath,
    ['--import', 'tsx', path.join(dirname, 'db-align-schema.ts')],
    { env: childEnv, stdio: 'inherit' },
  )
  if (align.status !== 0) {
    console.error('[vercel-prebuild] legacy column cleanup failed')
    process.exit(align.status ?? 1)
  }

  console.log('[vercel-prebuild] syncing Payload schema to Neon…')
  // y = accept data-loss warnings; newlines = default "create column" on rename prompts
  const stdinAnswers = Buffer.from(`y\n${'\n'.repeat(400)}`)

  const push = spawnSync(
    process.execPath,
    ['--import', 'tsx', path.join(dirname, 'db-push.ts')],
    {
      env: childEnv,
      stdio: ['pipe', 'inherit', 'inherit'],
      input: stdinAnswers,
    },
  )

  if (push.status !== 0) {
    console.error('[vercel-prebuild] schema sync failed')
    process.exit(push.status ?? 1)
  }

  console.log('[vercel-prebuild] schema sync complete')
}

main()
