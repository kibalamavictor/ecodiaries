/**
 * Seed realistic launch content via Payload REST API (no local DB required).
 * Usage: npm run seed:realistic:api
 */
import {
  REALISTIC_CATEGORIES,
  REALISTIC_CONTRIBUTORS,
  REALISTIC_ORGANIZATIONS,
  REALISTIC_PODCAST_SERIES,
  REALISTIC_PODCASTS,
  REALISTIC_PROGRAMMES,
  REALISTIC_SITE_STATS,
  REALISTIC_SOLUTIONS,
  REALISTIC_STORIES,
  REALISTIC_VIDEO_SERIES,
  REALISTIC_VIDEOS,
} from './realistic-content-data'
import { paragraphsToLexical } from './launch-content'

const BASE = process.env.SEED_API_BASE || 'https://ecodiaries-platform.vercel.app'
const EMAIL = process.env.SEED_ADMIN_EMAIL || 'e2e-admin@ecodiaries.test'
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'E2eAdminPass123!'
const CONTRIBUTOR_PASSWORD = 'RealisticContributorPass123!'

let cookie = ''

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  const setCookie = res.headers.getSetCookie?.() ?? []
  const tokenCookie = setCookie.find((c) => c.startsWith('payload-token='))
  if (!tokenCookie) throw new Error('No payload-token cookie')
  cookie = tokenCookie.split(';')[0]
  console.log('✓ Logged in')
}

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      Cookie: cookie,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data: Record<string, unknown> = {}
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : {}
  } catch {
    data = { raw: text }
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`)
  }
  return data
}

async function findBySlug(collection: string, slug: string): Promise<number | null> {
  const data = await api('GET', `/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`)
  const docs = (data.docs as { id: number }[]) || []
  return docs[0]?.id ?? null
}

async function upsert(
  collection: string,
  slug: string,
  data: Record<string, unknown>,
  label: string,
) {
  const existingId = await findBySlug(collection, slug)
  if (existingId) {
    await api('PATCH', `/${collection}/${existingId}`, data)
    console.log(`· Updated ${collection}: ${label}`)
    return existingId
  }
  const created = await api('POST', `/${collection}`, data)
  const id = (created.doc as { id: number } | undefined)?.id ?? (created.id as number)
  console.log(`✓ Created ${collection}: ${label}`)
  return id
}

async function main() {
  console.log(`Seeding realistic content via ${BASE}\n`)
  await login()

  const categoryIds: Record<string, number> = {}
  for (const cat of REALISTIC_CATEGORIES) {
    categoryIds[cat.slug] = await upsert('categories', cat.slug, { ...cat }, cat.name)
  }

  const orgIds: Record<string, number> = {}
  for (const org of REALISTIC_ORGANIZATIONS) {
    orgIds[org.slug] = await upsert(
      'organizations',
      org.slug,
      {
        name: org.name,
        slug: org.slug,
        type: org.type,
        tagline: org.tagline,
        bio: paragraphsToLexical(org.tagline),
        hqLocation: org.hqLocation,
        regions: [...org.regions],
        focusAreas: [...org.focusAreas],
        team: org.team,
        verified: true,
      },
      org.name,
    )
  }

  const contributorIds: Record<string, number> = {}
  for (const c of REALISTIC_CONTRIBUTORS) {
    const existingId = await findBySlug('contributors', c.slug)
    const base = {
      name: c.name,
      slug: c.slug,
      role: c.role,
      region: c.country,
      bio: `${c.bio} (${c.pieces} published pieces with EcoDiaries.)`,
      expertise: [{ area: c.role }, { area: c.country }],
      applicationStatus: 'approved',
    }
    if (existingId) {
      await api('PATCH', `/contributors/${existingId}`, base)
      contributorIds[c.slug] = existingId
      console.log(`· Updated contributors: ${c.name}`)
    } else {
      const created = await api('POST', '/contributors', {
        ...base,
        email: c.email,
        password: CONTRIBUTOR_PASSWORD,
      })
      contributorIds[c.slug] =
        (created.doc as { id: number } | undefined)?.id ?? (created.id as number)
      console.log(`✓ Created contributors: ${c.name}`)
    }
  }

  for (const sol of REALISTIC_SOLUTIONS) {
    const solutionId = await upsert(
      'solutions',
      sol.slug,
      {
        title: sol.title,
        slug: sol.slug,
        organization: orgIds[sol.orgSlug],
        category: categoryIds[sol.categorySlug],
        country: sol.country,
        location: sol.location,
        locationName: sol.locationName,
        sectors: [...sol.sectors],
        solutionStatus: sol.solutionStatus,
        thesis: sol.thesis,
        summary: sol.summary,
        body: sol.body,
        keyImpact: sol.keyImpact,
        statHighlight: sol.statHighlight,
        partnerOrgs: sol.partnerOrgs,
        coordinates: sol.coordinates,
        verificationTier: 'field_reported',
        verifiedBy: 'community-validated',
        verified: true,
        published: true,
        featured: true,
        publishedAt: new Date().toISOString(),
        replicationScope: 'africa',
      },
      sol.title,
    )

    for (const m of sol.milestones) {
      const existing = await api(
        'GET',
        `/impact-updates?where[and][0][project][equals]=${solutionId}&where[and][1][title][equals]=${encodeURIComponent(m.title)}&limit=1&depth=0`,
      )
      const docs = (existing.docs as unknown[]) || []
      if (docs.length) continue
      await api('POST', '/impact-updates', {
        project: solutionId,
        date: m.date,
        title: m.title,
        body: paragraphsToLexical(m.title),
        metrics: [m.metric],
      })
      console.log(`  ✓ Milestone: ${m.title}`)
    }
  }

  for (const story of REALISTIC_STORIES) {
    await upsert(
      'stories',
      story.slug,
      {
        title: story.title,
        slug: story.slug,
        excerpt: story.excerpt,
        body: paragraphsToLexical(story.excerpt, story.excerpt),
        category: categoryIds[story.categorySlug],
        author: contributorIds[story.authorSlug],
        location: story.location,
        status: 'published',
        featured: story.featured,
        publishedAt: story.publishedAt,
      },
      story.title,
    )
  }

  const podcastSeriesId = await upsert(
    'series',
    REALISTIC_PODCAST_SERIES.slug,
    { ...REALISTIC_PODCAST_SERIES },
    REALISTIC_PODCAST_SERIES.name,
  )
  const videoSeriesId = await upsert(
    'series',
    REALISTIC_VIDEO_SERIES.slug,
    { ...REALISTIC_VIDEO_SERIES },
    REALISTIC_VIDEO_SERIES.name,
  )

  for (const ep of REALISTIC_PODCASTS) {
    await upsert(
      'podcast-episodes',
      ep.slug,
      {
        title: ep.title,
        slug: ep.slug,
        series: podcastSeriesId,
        episodeNumber: ep.episodeNumber,
        duration: ep.duration,
        durationSeconds: ep.durationSeconds,
        description: ep.description,
        publishedAt: ep.publishedAt,
        featured: ep.episodeNumber === 1,
        hosts: [
          {
            isExternal: true,
            role: ep.guestRole,
            externalName: ep.guestName,
            externalBio: ep.guestBio,
          },
        ],
      },
      ep.title,
    )
  }

  for (const video of REALISTIC_VIDEOS) {
    await upsert(
      'videos',
      video.slug,
      {
        title: video.title,
        slug: video.slug,
        series: videoSeriesId,
        duration: video.duration,
        durationSeconds: video.durationSeconds,
        categoryTag: video.categoryTag,
        description: `${video.description} Featured community: ${video.community}.`,
        embedUrl: video.embedUrl,
        publishedAt: video.publishedAt,
        featured: video.featured,
      },
      video.title,
    )
  }

  for (const prog of REALISTIC_PROGRAMMES) {
    await upsert('programmes', prog.slug, { ...prog }, prog.name)
  }

  await api('POST', '/globals/site-settings', {
    missionCopy:
      'To make climate knowledge accessible by documenting and amplifying stories of environmental action, resilience, and innovation that inspire communities to act for a sustainable future.',
    visionCopy:
      'A world where every community has access to climate knowledge, learns from the experience of others, and is empowered to become part of the solution.',
    impactStats: REALISTIC_SITE_STATS,
  })
  console.log('✓ Updated site-settings')

  console.log('\n✅ Realistic content seeded via API.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
