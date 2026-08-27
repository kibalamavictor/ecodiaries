/**
 * Purge placeholder CMS content via Payload REST API (no local DB credentials needed).
 *
 * Usage: npx tsx src/scripts/purge-via-api.ts --confirm
 */
const BASE = process.env.PURGE_API_BASE || 'https://ecodiaries-platform.vercel.app'
const EMAIL = process.env.PURGE_ADMIN_EMAIL || 'e2e-admin@ecodiaries.test'
const PASSWORD = process.env.PURGE_ADMIN_PASSWORD || 'E2eAdminPass123!'

const COLLECTIONS = [
  'interest-leads',
  'impact-updates',
  'stories',
  'solutions',
  'videos',
  'podcast-episodes',
  'series',
  'programmes',
  'community-projects',
  'partner-organisations',
  'contact-submissions',
  'newsletter-subscribers',
  'contributors',
  'organizations',
  'categories',
  'media',
] as const

type Collection = (typeof COLLECTIONS)[number]

async function login(): Promise<string> {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) {
    throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  }

  const setCookie = res.headers.getSetCookie?.() ?? []
  const tokenCookie = setCookie.find((c) => c.startsWith('payload-token='))
  if (!tokenCookie) {
    throw new Error('Login succeeded but no payload-token cookie returned')
  }
  return tokenCookie.split(';')[0]
}

async function listIds(collection: Collection, cookie: string): Promise<number[]> {
  const ids: number[] = []
  let page = 1

  while (true) {
    const res = await fetch(`${BASE}/api/${collection}?limit=100&page=${page}&depth=0`, {
      headers: { Cookie: cookie },
    })
    if (!res.ok) {
      throw new Error(`List ${collection} failed (${res.status}): ${await res.text()}`)
    }
    const data = (await res.json()) as { docs: { id: number }[]; hasNextPage?: boolean }
    ids.push(...data.docs.map((d) => d.id))
    if (!data.hasNextPage || !data.docs.length) break
    page += 1
  }

  return ids
}

async function deleteDoc(collection: Collection, id: number, cookie: string) {
  const res = await fetch(`${BASE}/api/${collection}/${id}`, {
    method: 'DELETE',
    headers: { Cookie: cookie },
  })
  if (!res.ok) {
    throw new Error(`Delete ${collection}/${id} failed (${res.status}): ${await res.text()}`)
  }
}

async function deleteCollection(collection: Collection, cookie: string, dryRun: boolean) {
  const ids = await listIds(collection, cookie)
  if (dryRun) {
    console.log(`· Would delete ${ids.length} from ${collection}`)
    return ids.length
  }

  let deleted = 0
  for (const id of ids) {
    await deleteDoc(collection, id, cookie)
    deleted += 1
    if (deleted % 10 === 0) process.stdout.write(`  …${collection}: ${deleted}/${ids.length}\r`)
  }
  if (deleted > 0) process.stdout.write('\n')
  console.log(`✓ Deleted ${deleted} from ${collection}`)
  return deleted
}

async function main() {
  const confirm = process.argv.includes('--confirm')
  const dryRun = !confirm

  console.log(`${dryRun ? 'Dry run' : 'Purging'} via ${BASE}\n`)
  const cookie = await login()
  console.log('✓ Logged in as admin\n')

  let total = 0
  for (const collection of COLLECTIONS) {
    total += await deleteCollection(collection, cookie, dryRun)
  }

  console.log(`\n${dryRun ? 'Would remove' : 'Removed'} ${total} records total.`)
  if (dryRun) console.log('Re-run with --confirm to apply.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
