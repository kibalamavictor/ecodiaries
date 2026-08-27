/**
 * QA seed extensions — community projects, extra contributors, atlas enrichments,
 * launch video fixes, impact updates, and video series linking.
 */
import {
  bodyFromParagraphs,
  ensureMediaFromUrl,
  findBySlug,
  formatDurationLabel,
  safeRun,
  type PayloadClient,
} from './seed-helpers'
import {
  EXTRA_CONTRIBUTOR_AVATARS,
  EXTRA_CONTRIBUTORS,
  LAUNCH_VIDEO_FIXTURES,
  TEST_COMMUNITY_PROJECTS,
  TEST_VIDEO_SERIES,
} from './test-content-data'

const TEST_CONTRIBUTOR_PASSWORD = 'TestContributorPass123!'

const EXTRA_ATLAS_PROJECTS = [
  {
    slug: 'seed-qa-mangrove-restoration-senegal',
    title: 'Community Mangrove Restoration — Senegal Delta',
    orgSlug: 'wetlands-trust',
    category: 'Biodiversity',
    region: 'West Africa',
    country: 'Senegal',
    lat: 14.2,
    lng: -16.9,
    status: 'established' as const,
    verificationTier: 'independently_verified' as const,
    fundingStatus: 'funded' as const,
    sectors: ['biodiversity', 'water'] as const,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
    ],
    summary:
      'Village committees replant mangrove belts that buffer storm surge, filter runoff, and restore fish nursery habitat along the Saloum delta.',
    impact: [{ label: 'Hectares restored', value: '1,200', unit: 'since 2018' }],
    howItWorks:
      'Nurseries grow Avicennia seedlings; youth crews plant at low tide; women\'s cooperatives monitor illegal cutting and maintain boardwalks for ecotourism income.',
  },
  {
    slug: 'seed-qa-plastic-circular-coops-kenya',
    title: 'Plastic Waste Circular Cooperatives',
    orgSlug: 'kampala-climate-lab',
    category: 'Pollution',
    region: 'East Africa',
    country: 'Kenya',
    lat: -1.29,
    lng: 36.82,
    status: 'piloted' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'seeking' as const,
    sectors: ['pollution', 'climate-justice'] as const,
    image: 'https://images.unsplash.com/photo-1618477466955-0f316a7bba70?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80',
      'https://images.unsplash.com/photo-1605600659908-0fef5f7b8c1d?w=1200&q=80',
    ],
    summary:
      'Waste-picker cooperatives sort PET and HDPE for local processors, cutting open dumping while creating stable daily wages.',
    impact: [{ label: 'Tonnes diverted monthly', value: '45', unit: 'from rivers and dumps' }],
    howItWorks:
      'Collection hubs pay fair gate prices; balers compress material for recyclers; revenue shares fund health insurance and school fees.',
  },
  {
    slug: 'seed-qa-rainwater-schools-tanzania',
    title: 'Rainwater Harvesting for Rural Schools',
    orgSlug: 'greenline-africa',
    category: 'Water',
    region: 'East Africa',
    country: 'Tanzania',
    lat: -6.79,
    lng: 39.28,
    status: 'scaling' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'partial' as const,
    sectors: ['water', 'climate-justice'] as const,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80',
    ],
    summary:
      'Roof catchment systems and ferro-cement tanks supply drinking water and hand-washing stations at schools beyond piped networks.',
    impact: [{ label: 'Schools served', value: '86', unit: 'with year-round water' }],
    howItWorks:
      'Parent committees maintain gutters and first-flush diverters; teachers integrate hygiene lessons; overflow feeds kitchen gardens.',
  },
  {
    slug: 'seed-qa-community-forest-patrols-drc',
    title: 'Community Forest Patrols — Eastern DRC',
    orgSlug: 'world-agroforestry-centre',
    category: 'Biodiversity',
    region: 'Central Africa',
    country: 'DR Congo',
    lat: -1.5,
    lng: 29.2,
    status: 'scaling' as const,
    verificationTier: 'self_reported' as const,
    fundingStatus: 'partial' as const,
    sectors: ['biodiversity', 'climate-justice'] as const,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
    ],
    summary:
      'Trained community rangers monitor illegal logging routes and document carbon-rich forest blocks for local land-use planning.',
    impact: [{ label: 'Patrol kilometres', value: '12,000+', unit: 'logged annually' }],
    howItWorks:
      'GPS tracks and radio networks coordinate patrols; women\'s groups manage nurseries for buffer-zone agroforestry; disputes escalate through customary courts before enforcement.',
  },
] as const

const ATLAS_CATEGORY_SLUG: Record<string, string> = {
  Agriculture: 'agriculture',
  Energy: 'renewable-energy',
  Water: 'water',
  Biodiversity: 'biodiversity',
  Pollution: 'pollution',
}

const IMPACT_UPDATE_TEMPLATES = [
  {
    title: 'Q1 monitoring report published',
    monthsAgo: 2,
    metric: { label: 'Households reached', value: '340' },
    body: 'Field teams completed baseline surveys and shared results with community assemblies. Two implementation gaps were flagged and addressed within six weeks.',
  },
  {
    title: 'Partnership MOU signed',
    monthsAgo: 5,
    metric: { label: 'New local partners', value: '3' },
    body: 'A district cooperative and two women\'s savings groups joined the programme, expanding maintenance capacity and local ownership of monitoring data.',
  },
] as const

export type QaExtensionContext = {
  categoryIds: Record<string, number>
  contributorIds: Record<string, number>
  seriesIds: Record<string, number>
}

async function seedExtraContributors(
  payload: PayloadClient,
  contributorIds: Record<string, number>,
) {
  console.log('\n— QA extra contributors —')
  let avatarIdx = 0
  for (const c of EXTRA_CONTRIBUTORS) {
    await safeRun(`extra contributor ${c.slug}`, async () => {
      const existing = await findBySlug(payload, 'contributors', c.slug)
      if (existing) {
        contributorIds[c.slug] = existing.id as number
        console.log(`· Skipped extra contributor (exists): ${c.name}`)
        return
      }
      let avatarId: number | null = null
      if (!c.skipPhoto) {
        const url = EXTRA_CONTRIBUTOR_AVATARS[avatarIdx % EXTRA_CONTRIBUTOR_AVATARS.length]
        avatarIdx += 1
        avatarId = await ensureMediaFromUrl(payload, url, `Contributor avatar: ${c.slug}`)
      }
      const created = await payload.create({
        collection: 'contributors',
        data: {
          name: c.name,
          slug: c.slug,
          email: `${c.slug}@ecodiaries.test`,
          role: c.role,
          region: c.region,
          bio: c.bio,
          expertise: [{ area: c.specialisation }],
          socialLinks: [...c.socialLinks],
          applicationStatus: 'approved',
          password: TEST_CONTRIBUTOR_PASSWORD,
          isSeedContent: true,
          ...(avatarId ? { profilePhoto: avatarId } : {}),
        },
      })
      contributorIds[c.slug] = created.id as number
      console.log(`✓ Created extra contributor: ${c.name}`)
    })
  }
}

async function seedCommunityProjects(payload: PayloadClient) {
  console.log('\n— QA community projects —')
  for (const project of TEST_COMMUNITY_PROJECTS) {
    await safeRun(`community project ${project.title}`, async () => {
      const existing = await payload.find({
        collection: 'community-projects',
        where: { title: { equals: project.title } },
        limit: 1,
      })
      if (existing.docs[0]) {
        console.log(`· Skipped community project (exists): ${project.title}`)
        return
      }
      const imageId = await ensureMediaFromUrl(
        payload,
        project.image,
        `Community project: ${project.title}`,
      )
      const story = await findBySlug(payload, 'stories', project.relatedStorySlug)
      await payload.create({
        collection: 'community-projects',
        data: {
          title: project.title,
          description: project.description,
          image: imageId || undefined,
          relatedStory: story?.id,
          isSeedContent: true,
        },
      })
      console.log(`✓ Created community project: ${project.title}`)
    })
  }
}

async function fixLaunchVideos(payload: PayloadClient) {
  console.log('\n— QA launch video embeds —')
  for (const fixture of LAUNCH_VIDEO_FIXTURES) {
    await safeRun(`launch video ${fixture.slug}`, async () => {
      const existing = await findBySlug(payload, 'videos', fixture.slug)
      if (!existing) {
        console.log(`· Skipped launch video (not found): ${fixture.slug}`)
        return
      }
      const thumbId = await ensureMediaFromUrl(
        payload,
        fixture.thumbnail,
        `Video thumb: ${fixture.slug}`,
      )
      await payload.update({
        collection: 'videos',
        id: existing.id,
        data: {
          embedUrl: `https://www.youtube.com/embed/${fixture.youtubeId}?autoplay=0&rel=0`,
          thumbnail: thumbId || undefined,
          duration: formatDurationLabel(fixture.durationSeconds),
          durationSeconds: fixture.durationSeconds,
          isSeedContent: true,
        },
      })
      console.log(`✓ Updated launch video embed: ${fixture.slug}`)
    })
  }
}

async function seedVideoSeries(payload: PayloadClient, seriesIds: Record<string, number>) {
  console.log('\n— QA video series —')
  const series = TEST_VIDEO_SERIES
  await safeRun(`video series ${series.slug}`, async () => {
    const existing = await payload.find({
      collection: 'series',
      where: { name: { equals: series.name } },
      limit: 1,
    })
    let seriesId: number
    if (existing.docs[0]) {
      seriesId = existing.docs[0].id as number
      await payload.update({
        collection: 'series',
        id: seriesId,
        data: {
          slug: series.slug,
          description: series.description,
          type: series.type,
        },
      })
      console.log(`· Updated video series: ${series.name}`)
    } else {
      const coverId = await ensureMediaFromUrl(payload, series.cover, `Series cover: ${series.slug}`)
      const created = await payload.create({
        collection: 'series',
        data: {
          name: series.name,
          slug: series.slug,
          description: series.description,
          type: series.type,
          coverArt: coverId || undefined,
          isSeedContent: true,
        },
      })
      seriesId = created.id as number
      console.log(`✓ Created video series: ${series.name}`)
    }
    seriesIds[series.slug] = seriesId

    const videos = await payload.find({ collection: 'videos', limit: 20, sort: '-publishedAt' })
    let linked = 0
    for (const video of videos.docs) {
      if (video.series) continue
      await payload.update({
        collection: 'videos',
        id: video.id,
        data: { series: seriesId },
      })
      linked += 1
      if (linked >= 6) break
    }
    if (linked) console.log(`✓ Linked ${linked} videos to series: ${series.name}`)
  })
}

async function seedExtraAtlasProjects(
  payload: PayloadClient,
  categoryIds: Record<string, number>,
) {
  console.log('\n— QA extra atlas projects —')
  const orgIds: Record<string, number> = {}
  const orgs = await payload.find({ collection: 'organizations', limit: 20 })
  for (const org of orgs.docs) {
    if (org.slug) orgIds[org.slug] = org.id as number
  }

  for (const p of EXTRA_ATLAS_PROJECTS) {
    await safeRun(`atlas project ${p.slug}`, async () => {
      const heroId = await ensureMediaFromUrl(payload, p.image, `Atlas: ${p.slug}`)
      const galleryIds = await Promise.all(
        p.gallery.map((url, i) => ensureMediaFromUrl(payload, url, `Atlas gallery ${p.slug}-${i + 1}`)),
      )
      const catSlug = ATLAS_CATEGORY_SLUG[p.category] || 'climate-solutions'
      const data = {
        title: p.title,
        slug: p.slug,
        organization: orgIds[p.orgSlug],
        category: categoryIds[catSlug],
        summary: p.summary,
        location: p.region,
        country: p.country,
        sectors: [...p.sectors],
        solutionStatus: p.status,
        verificationTier: p.verificationTier,
        verifiedBy: 'field-reporter' as const,
        coordinates: { lat: p.lat, lng: p.lng },
        keyImpact: [...p.impact],
        statHighlight: p.impact[0] ? `${p.impact[0].value} ${p.impact[0].label}` : undefined,
        fundingStatus: p.fundingStatus,
        published: true,
        publishedAt: new Date().toISOString(),
        verified: true,
        isSeedContent: true,
        body: bodyFromParagraphs(p.summary, `**How it works**\n${p.howItWorks}`),
        ...(heroId ? { heroImage: heroId } : {}),
        gallery: galleryIds
          .filter((id): id is number => Boolean(id))
          .map((image, i) => ({ image, caption: `Field documentation ${i + 1}` })),
      }

      const existing = await findBySlug(payload, 'solutions', p.slug)
      if (existing) {
        await payload.update({ collection: 'solutions', id: existing.id, data: data as never })
        console.log(`· Updated atlas project: ${p.title}`)
      } else {
        await payload.create({ collection: 'solutions', data: data as never })
        console.log(`✓ Created atlas project: ${p.title}`)
      }
    })
  }
}

async function enrichAtlasGalleries(payload: PayloadClient) {
  console.log('\n— QA atlas gallery enrichment —')
  const galleryPool = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=1200&q=80',
  ]
  const projects = await payload.find({
    collection: 'solutions',
    where: { published: { equals: true } },
    limit: 20,
  })
  for (const project of projects.docs) {
    if (project.gallery && project.gallery.length >= 2) continue
    await safeRun(`gallery ${project.slug}`, async () => {
      const ids = await Promise.all(
        galleryPool.map((url, i) =>
          ensureMediaFromUrl(payload, url, `Atlas gallery ${project.slug}-${i + 1}`),
        ),
      )
      await payload.update({
        collection: 'solutions',
        id: project.id,
        data: {
          gallery: ids
            .filter((id): id is number => Boolean(id))
            .map((image, i) => ({ image, caption: `Community site photo ${i + 1}` })),
        },
      })
      console.log(`✓ Enriched gallery: ${project.title}`)
    })
  }
}

async function seedImpactUpdates(payload: PayloadClient) {
  console.log('\n— QA impact updates —')
  const projects = await payload.find({
    collection: 'solutions',
    where: { published: { equals: true } },
    limit: 12,
  })

  for (const project of projects.docs) {
    for (const template of IMPACT_UPDATE_TEMPLATES) {
      const title = `[SEED-QA] ${template.title} — ${project.title}`
      await safeRun(`impact update ${project.slug}`, async () => {
        const existing = await payload.find({
          collection: 'impact-updates',
          where: { title: { equals: title } },
          limit: 1,
        })
        if (existing.docs[0]) {
          console.log(`· Skipped impact update (exists): ${title}`)
          return
        }
        const date = new Date()
        date.setMonth(date.getMonth() - template.monthsAgo)
        await payload.create({
          collection: 'impact-updates',
          data: {
            project: project.id,
            date: date.toISOString(),
            title,
            body: bodyFromParagraphs(template.body),
            metrics: [template.metric],
            isSeedContent: true,
          },
        })
        console.log(`✓ Created impact update for: ${project.title}`)
      })
    }
  }
}

export async function runQaExtensions(payload: PayloadClient, ctx: QaExtensionContext) {
  console.log('\n=== QA seed extensions ===')
  await seedExtraContributors(payload, ctx.contributorIds)
  await seedCommunityProjects(payload)
  await fixLaunchVideos(payload)
  await seedVideoSeries(payload, ctx.seriesIds)
  await seedExtraAtlasProjects(payload, ctx.categoryIds)
  await enrichAtlasGalleries(payload)
  await seedImpactUpdates(payload)
  console.log('\n=== QA extensions complete ===')
}
