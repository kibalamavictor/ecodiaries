import { execSync } from 'child_process'

export default async function globalSetup() {
  if (process.env.SKIP_E2E_SEED === 'true') return

  execSync('npm run seed', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/ecodiaries',
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'e2e-test-secret-min-32-characters-long',
    },
  })
}
