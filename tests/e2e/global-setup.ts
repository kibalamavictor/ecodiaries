import { execSync } from 'child_process'

function e2eEnv(extra: Record<string, string> = {}) {
  return {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/ecodiaries',
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'e2e-test-secret-min-32-characters-long',
    ...extra,
  }
}

export default async function globalSetup() {
  if (process.env.SKIP_E2E_SEED === 'true') return

  // Fresh CI Postgres has no tables; Payload only pushes schema when this flag is set.
  execSync('npm run db:push', {
    stdio: 'inherit',
    env: e2eEnv({ PAYLOAD_DB_PUSH: 'true' }),
  })

  execSync('npm run seed', {
    stdio: 'inherit',
    env: e2eEnv(),
  })
}
