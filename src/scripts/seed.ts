import { getPayloadClient } from '@/lib/payload'
import {
  E2E_ADMIN_EMAIL,
  E2E_ADMIN_PASSWORD,
  E2E_CONTRIBUTOR_EMAIL,
  E2E_CONTRIBUTOR_PASSWORD,
  launchContributors,
  launchPartners,
  launchProgrammes,
  launchSolutions,
  launchStories,
  launchVideos,
} from './launch-content'
import type { PayloadClient } from './seed-helpers'

const categories = [
  { name: 'Climate Change', slug: 'climate-change', color: '#0B3E1F' },
  { name: 'Water', slug: 'water', color: '#00AB45' },
  { name: 'Agriculture', slug: 'agriculture', color: '#6FA300' },
  { name: 'Biodiversity', slug: 'biodiversity', color: '#014104' },
  { name: 'Pollution', slug: 'pollution', color: '#58001E' },
  { name: 'Renewable Energy', slug: 'renewable-energy', color: '#FFE44D' },
  { name: 'Climate Justice', slug: 'climate-justice', color: '#C51353' },
  { name: 'Community Stories', slug: 'community-stories', color: '#00AB45' },
  { name: 'Youth Voices', slug: 'youth-voices', color: '#B6F101' },
  { name: 'Conservation', slug: 'conservation', color: '#014104' },
  { name: 'Sustainability', slug: 'sustainability', color: '#AAF668' },
  { name: 'Climate Solutions', slug: 'climate-solutions', color: '#00AB45' },
  { name: 'Research & Insights', slug: 'research-insights', color: '#5C6457' },
  { name: 'Opinion', slug: 'opinion', color: '#58001E' },
]

async function ensureCategory(payload: PayloadClient, slug: string): Promise<number> {
  const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs[0]) return existing.docs[0].id as number
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) throw new Error(`Unknown category slug: ${slug}`)
  const created = await payload.create({ collection: 'categories', data: { ...cat, isSeedContent: true } })
  console.log(`Created category: ${cat.name}`)
  return created.id as number
}

export async function runBaseSeed(existingPayload?: PayloadClient) {
  const payload = existingPayload ?? (await getPayloadClient())
  const categoryIds: Record<string, number> = {}

  for (const cat of categories) {
    categoryIds[cat.slug] = await ensureCategory(payload, cat.slug)
  }

  for (const prog of launchProgrammes) {
    const existing = await payload.find({ collection: 'programmes', where: { slug: { equals: prog.slug } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({ collection: 'programmes', data: { ...prog, isSeedContent: true } })
      console.log(`Created programme: ${prog.name}`)
    } else {
      await payload.update({ collection: 'programmes', id: existing.docs[0].id, data: { ...prog, isSeedContent: true } })
    }
  }

  for (const partner of launchPartners) {
    const existing = await payload.find({
      collection: 'partner-organisations',
      where: { name: { equals: partner.name } },
      limit: 1,
    })
    if (!existing.docs.length) {
      await payload.create({ collection: 'partner-organisations', data: { ...partner, isSeedContent: true } })
      console.log(`Created partner: ${partner.name}`)
    }
  }

  const contributorIds: Record<string, number> = {}
  for (const c of launchContributors) {
    const existing = await payload.find({ collection: 'contributors', where: { slug: { equals: c.slug } }, limit: 1 })
    if (!existing.docs.length) {
      const created = await payload.create({
        collection: 'contributors',
        data: {
          name: c.name,
          slug: c.slug,
          email: c.email,
          role: c.role,
          bio: c.bio,
          expertise: c.expertise.map((area) => ({ area })),
          applicationStatus: 'approved',
          password: 'LaunchContributorPass123!',
          isSeedContent: true,
        },
      })
      contributorIds[c.slug] = created.id as number
      console.log(`Created contributor: ${c.name}`)
    } else {
      contributorIds[c.slug] = existing.docs[0].id as number
    }
  }

  for (const s of launchSolutions) {
    const existing = await payload.find({ collection: 'solutions', where: { slug: { equals: s.slug } }, limit: 1 })
    const data = {
      title: s.title,
      slug: s.slug,
      category: categoryIds[s.categorySlug],
      summary: s.summary,
      body: s.body,
      statHighlight: s.statHighlight,
      verified: true,
      isSeedContent: true,
    }
    if (!existing.docs.length) {
      await payload.create({ collection: 'solutions', data })
      console.log(`Created solution: ${s.title}`)
    } else {
      await payload.update({ collection: 'solutions', id: existing.docs[0].id, data })
    }
  }

  for (const story of launchStories) {
    const existing = await payload.find({ collection: 'stories', where: { slug: { equals: story.slug } }, limit: 1 })
    const data = {
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      body: story.body,
      category: categoryIds[story.categorySlug],
      author: contributorIds[story.authorSlug],
      location: story.location,
      readingTime: story.readingTime,
      featured: story.featured,
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      isSeedContent: true,
    }
    if (!existing.docs.length) {
      await payload.create({ collection: 'stories', data })
      console.log(`Created story: ${story.title}`)
    } else {
      await payload.update({ collection: 'stories', id: existing.docs[0].id, data })
    }
  }

  for (const video of launchVideos) {
    const existing = await payload.find({ collection: 'videos', where: { slug: { equals: video.slug } }, limit: 1 })
    if (!existing.docs.length) {
      await payload.create({
        collection: 'videos',
        data: { ...video, publishedAt: new Date().toISOString(), isSeedContent: true },
      })
      console.log(`Created video: ${video.title}`)
    } else {
      await payload.update({
        collection: 'videos',
        id: existing.docs[0].id,
        data: { ...video, publishedAt: new Date().toISOString(), isSeedContent: true },
      })
    }
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      missionCopy:
        'To make climate knowledge accessible by documenting and amplifying stories of environmental action, resilience, and innovation that inspire communities to act for a sustainable future.',
      visionCopy:
        'A world where every community has access to climate knowledge, learns from the experience of others, and is empowered to become part of the solution.',
      impactStats: [
        { value: '50+', label: 'Young climate storytellers trained' },
        { value: '100+', label: 'Climate stories and articles published' },
      ],
    },
  })
  console.log('Updated site settings')

  const adminExisting = await payload.find({ collection: 'users', where: { email: { equals: E2E_ADMIN_EMAIL } }, limit: 1 })
  if (!adminExisting.docs.length) {
    await payload.create({
      collection: 'users',
      data: { email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD, role: 'admin' },
    })
    console.log('Created e2e admin user')
  }

  const e2eContributor = await payload.find({
    collection: 'contributors',
    where: { email: { equals: E2E_CONTRIBUTOR_EMAIL } },
    limit: 1,
  })
  if (!e2eContributor.docs.length) {
    await payload.create({
      collection: 'contributors',
      data: {
        name: 'E2E Test Contributor',
        slug: 'e2e-test-contributor',
        email: E2E_CONTRIBUTOR_EMAIL,
        bio: 'Automated test contributor account.',
        role: 'Field Journalist',
        applicationStatus: 'approved',
        password: E2E_CONTRIBUTOR_PASSWORD,
        isSeedContent: true,
      },
    })
    console.log('Created e2e contributor user')
  }

  console.log('Seed complete.')
}

const isSeedCli = process.argv[1]?.includes('seed.ts')
if (isSeedCli) {
  runBaseSeed().catch((err) => {
    console.error(err)
    process.exit(1)
  }).then(() => process.exit(0))
}
