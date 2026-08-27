/**
 * Remove all placeholder / seed CMS content so the platform can be filled with real data.
 *
 * Keeps Payload admin users (`users` collection) and site-settings mission/vision copy.
 *
 * Run locally:  npm run purge:seed -- --confirm
 * Run on Neon:  npm run purge:prod -- --confirm
 * Dry run:      npm run purge:seed
 */
import { purgePlaceholderContent } from '@/lib/studio/purge-content'

async function main() {
  const confirm = process.argv.includes('--confirm')
  const dryRun = !confirm

  if (dryRun) {
    console.log('Dry run — pass --confirm to delete. Counting records…\n')
  } else {
    console.log('Purging all seed / placeholder CMS content…\n')
  }

  const summary = await purgePlaceholderContent(dryRun)

  for (const [collection, count] of Object.entries(summary)) {
    const verb = dryRun ? 'Would delete' : 'Deleted'
    console.log(`${dryRun ? '·' : '✓'} ${verb} ${count} from ${collection}`)
  }

  if (dryRun) {
    console.log('· Would reset site-settings impactStats to []')
    console.log('\nRe-run with --confirm to apply deletions.')
  } else {
    console.log('✓ Cleared site-settings impact stats')
    console.log('\n✅ CMS content purge complete. Admin users were kept.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
