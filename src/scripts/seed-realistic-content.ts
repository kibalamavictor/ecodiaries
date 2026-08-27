/**
 * Seed curated realistic launch content (Africa-specific).
 * Run: npm run seed:realistic
 * Neon: npm run seed:realistic:prod
 * Idempotent by slug.
 */
import { getPayloadClient } from '@/lib/payload'
import { bodyFromParagraphs, findBySlug, safeRun, type PayloadClient } from './seed-helpers'
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

const CONTRIBUTOR_PASSWORD = 'RealisticContributorPass123!'

async function ensureCategories(payload: PayloadClient) {
  const ids: Record<string, number> = {}
  console.log('\n— Categories —')
  for (const cat of REALISTIC_CATEGORIES) {
    await safeRun(`category ${cat.slug}`, async () => {
      const existing = await findBySlug(payload, 'categories', cat.slug)
      if (existing) {
        ids[cat.slug] = existing.id as number
        console.log(`· Exists: ${cat.name}`)
        return
      }
      const created = await payload.create({
        collection: 'categories',
        data: { ...cat, isSeedContent: true },
      })
      ids[cat.slug] = created.id as number
      console.log(`✓ Created: ${cat.name}`)
    })
  }
  return ids
}

async function ensureOrganizations(payload: PayloadClient) {
  const ids: Record<string, number> = {}
  console.log('\n— Organizations —')
  for (const org of REALISTIC_ORGANIZATIONS) {
    await safeRun(`org ${org.slug}`, async () => {
      const existing = await findBySlug(payload, 'organizations', org.slug)
      const data = {
        name: org.name,
        slug: org.slug,
        type: org.type,
        tagline: org.tagline,
        bio: bodyFromParagraphs(org.tagline),
        hqLocation: org.hqLocation,
        regions: [...org.regions],
        focusAreas: [...org.focusAreas],
        team: org.team.map((t) => ({ name: t.name, role: t.role })),
        verified: true,
        isSeedContent: true,
      }
      if (existing) {
        await payload.update({ collection: 'organizations', id: existing.id, data: data as never })
        ids[org.slug] = existing.id as number
        console.log(`· Updated: ${org.name}`)
      } else {
        const created = await payload.create({ collection: 'organizations', data: data as never })
        ids[org.slug] = created.id as number
        console.log(`✓ Created: ${org.name}`)
      }
    })
  }
  return ids
}

async function ensureContributors(payload: PayloadClient) {
  const ids: Record<string, number> = {}
  console.log('\n— Contributors —')
  for (const c of REALISTIC_CONTRIBUTORS) {
    await safeRun(`contributor ${c.slug}`, async () => {
      const existing = await findBySlug(payload, 'contributors', c.slug)
      const data = {
        name: c.name,
        slug: c.slug,
        email: c.email,
        role: c.role,
        region: c.country,
        bio: `${c.bio} (${c.pieces} published pieces with EcoDiaries.)`,
        expertise: [{ area: c.role }, { area: c.country }],
        applicationStatus: 'approved' as const,
        password: CONTRIBUTOR_PASSWORD,
        isSeedContent: true,
      }
      if (existing) {
        await payload.update({
          collection: 'contributors',
          id: existing.id,
          data: {
            name: data.name,
            role: data.role,
            region: data.region,
            bio: data.bio,
            expertise: data.expertise,
            applicationStatus: data.applicationStatus,
            isSeedContent: true,
          },
        })
        ids[c.slug] = existing.id as number
        console.log(`· Updated: ${c.name}`)
      } else {
        const created = await payload.create({ collection: 'contributors', data })
        ids[c.slug] = created.id as number
        console.log(`✓ Created: ${c.name}`)
      }
    })
  }
  return ids
}

async function ensureSolutions(
  payload: PayloadClient,
  orgIds: Record<string, number>,
  categoryIds: Record<string, number>,
) {
  const ids: Record<string, number> = {}
  console.log('\n— Solutions Atlas —')
  for (const sol of REALISTIC_SOLUTIONS) {
    await safeRun(`solution ${sol.slug}`, async () => {
      const existing = await findBySlug(payload, 'solutions', sol.slug)
      const data = {
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
        verificationTier: 'field_reported' as const,
        verifiedBy: 'community-validated' as const,
        verified: true,
        published: true,
        featured: true,
        publishedAt: new Date().toISOString(),
        replicationScope: 'africa' as const,
        isSeedContent: true,
      }
      if (existing) {
        await payload.update({ collection: 'solutions', id: existing.id, data: data as never })
        ids[sol.slug] = existing.id as number
        console.log(`· Updated: ${sol.title}`)
      } else {
        const created = await payload.create({ collection: 'solutions', data: data as never })
        ids[sol.slug] = created.id as number
        console.log(`✓ Created: ${sol.title}`)
      }

      for (const m of sol.milestones) {
        const title = m.title
        const existingUpdate = await payload.find({
          collection: 'impact-updates',
          where: {
            and: [
              { project: { equals: ids[sol.slug] } },
              { title: { equals: title } },
            ],
          },
          limit: 1,
        })
        if (existingUpdate.docs[0]) continue
        await payload.create({
          collection: 'impact-updates',
          data: {
            project: ids[sol.slug],
            date: m.date,
            title,
            body: bodyFromParagraphs(title),
            metrics: [m.metric],
            isSeedContent: true,
          } as never,
        })
      }
    })
  }
  return ids
}

async function ensureStories(
  payload: PayloadClient,
  contributorIds: Record<string, number>,
  categoryIds: Record<string, number>,
) {
  console.log('\n— Editorial stories —')
  for (const story of REALISTIC_STORIES) {
    await safeRun(`story ${story.slug}`, async () => {
      const existing = await findBySlug(payload, 'stories', story.slug)
      const data = {
        title: story.title,
        slug: story.slug,
        excerpt: story.excerpt,
        body: bodyFromParagraphs(story.excerpt, story.excerpt),
        category: categoryIds[story.categorySlug],
        author: contributorIds[story.authorSlug],
        location: story.location,
        status: 'published' as const,
        featured: story.featured,
        publishedAt: story.publishedAt,
        isSeedContent: true,
      }
      if (existing) {
        await payload.update({ collection: 'stories', id: existing.id, data })
        console.log(`· Updated: ${story.title}`)
      } else {
        await payload.create({ collection: 'stories', data })
        console.log(`✓ Created: ${story.title}`)
      }
    })
  }
}

async function ensureSeries(payload: PayloadClient) {
  console.log('\n— Series —')
  const ids: Record<string, number> = {}
  for (const series of [REALISTIC_PODCAST_SERIES, REALISTIC_VIDEO_SERIES]) {
    await safeRun(`series ${series.slug}`, async () => {
      const existing = await payload.find({
        collection: 'series',
        where: { slug: { equals: series.slug } },
        limit: 1,
      })
      const data = {
        name: series.name,
        slug: series.slug,
        description: series.description,
        type: series.type,
        isSeedContent: true,
      }
      if (existing.docs[0]) {
        await payload.update({ collection: 'series', id: existing.docs[0].id, data })
        ids[series.slug] = existing.docs[0].id as number
        console.log(`· Updated: ${series.name}`)
      } else {
        const created = await payload.create({ collection: 'series', data })
        ids[series.slug] = created.id as number
        console.log(`✓ Created: ${series.name}`)
      }
    })
  }
  return ids
}

async function ensurePodcasts(payload: PayloadClient, seriesIds: Record<string, number>) {
  console.log('\n— Podcast episodes —')
  const seriesId = seriesIds[REALISTIC_PODCAST_SERIES.slug]
  for (const ep of REALISTIC_PODCASTS) {
    await safeRun(`podcast ${ep.slug}`, async () => {
      const existing = await findBySlug(payload, 'podcast-episodes', ep.slug)
      const data = {
        title: ep.title,
        slug: ep.slug,
        series: seriesId,
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
        isSeedContent: true,
      }
      if (existing) {
        await payload.update({ collection: 'podcast-episodes', id: existing.id, data: data as never })
        console.log(`· Updated: ${ep.title}`)
      } else {
        await payload.create({ collection: 'podcast-episodes', data: data as never })
        console.log(`✓ Created: ${ep.title}`)
      }
    })
  }
}

async function ensureVideos(payload: PayloadClient, seriesIds: Record<string, number>) {
  console.log('\n— Documentary films —')
  const seriesId = seriesIds[REALISTIC_VIDEO_SERIES.slug]
  for (const video of REALISTIC_VIDEOS) {
    await safeRun(`video ${video.slug}`, async () => {
      const existing = await findBySlug(payload, 'videos', video.slug)
      const data = {
        title: video.title,
        slug: video.slug,
        series: seriesId,
        duration: video.duration,
        durationSeconds: video.durationSeconds,
        categoryTag: video.categoryTag,
        description: `${video.description} Featured community: ${video.community}.`,
        embedUrl: video.embedUrl,
        publishedAt: video.publishedAt,
        featured: video.featured,
        isSeedContent: true,
      }
      if (existing) {
        await payload.update({ collection: 'videos', id: existing.id, data: data as never })
        console.log(`· Updated: ${video.title}`)
      } else {
        await payload.create({ collection: 'videos', data: data as never })
        console.log(`✓ Created: ${video.title}`)
      }
    })
  }
}

async function ensureProgrammes(payload: PayloadClient) {
  console.log('\n— Programmes —')
  for (const prog of REALISTIC_PROGRAMMES) {
    await safeRun(`programme ${prog.slug}`, async () => {
      const existing = await findBySlug(payload, 'programmes', prog.slug)
      const data = { ...prog, isSeedContent: true }
      if (existing) {
        await payload.update({ collection: 'programmes', id: existing.id, data })
        console.log(`· Updated: ${prog.name}`)
      } else {
        await payload.create({ collection: 'programmes', data })
        console.log(`✓ Created: ${prog.name}`)
      }
    })
  }
}

async function updateSiteSettings(payload: PayloadClient) {
  console.log('\n— Site settings —')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      missionCopy:
        'To make climate knowledge accessible by documenting and amplifying stories of environmental action, resilience, and innovation that inspire communities to act for a sustainable future.',
      visionCopy:
        'A world where every community has access to climate knowledge, learns from the experience of others, and is empowered to become part of the solution.',
      impactStats: REALISTIC_SITE_STATS,
    },
  })
  console.log('✓ Updated impact stats and mission/vision')
}

export async function runRealisticSeed(existingPayload?: PayloadClient) {
  console.log('EcoDiaries realistic launch content seed starting…')
  const payload = existingPayload ?? (await getPayloadClient())

  const categoryIds = await ensureCategories(payload)
  const orgIds = await ensureOrganizations(payload)
  const contributorIds = await ensureContributors(payload)
  await ensureSolutions(payload, orgIds, categoryIds)
  await ensureStories(payload, contributorIds, categoryIds)
  const seriesIds = await ensureSeries(payload)
  await ensurePodcasts(payload, seriesIds)
  await ensureVideos(payload, seriesIds)
  await ensureProgrammes(payload)
  await updateSiteSettings(payload)

  console.log('\n✅ Realistic launch content seed complete.')
}

const isCli = process.argv[1]?.includes('seed-realistic-content.ts')
if (isCli) {
  runRealisticSeed()
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
    .then(() => process.exit(0))
}
