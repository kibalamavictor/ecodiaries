/**
 * Full QA content seed orchestrator.
 * Run: npm run seed:qa  (local)  |  npm run seed:prod  (Neon — sets USE_NEON_DRIVER)
 */
import { runAtlasSeed } from './seed-atlas'
import { runBaseSeed } from './seed'
import { runTestSeed } from './seed-test-content'

const steps = [
  { label: 'base seed', run: runBaseSeed },
  { label: 'atlas', run: runAtlasSeed },
  { label: 'test content + QA extensions', run: runTestSeed },
] as const

async function runStep(label: string, run: () => Promise<void>) {
  console.log(`\n▶ Running ${label}…`)
  await run()
}

async function main() {
  console.log('EcoDiaries full QA seed starting…')
  for (const step of steps) {
    await runStep(step.label, step.run)
  }
  console.log('\n✅ Full QA seed complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
