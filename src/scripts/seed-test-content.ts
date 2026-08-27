/**
 * Industry-grade realistic test content seed.
 * Run: npm run seed:test
 * Idempotent — safe to run multiple times.
 */
import { getPayloadClient } from '@/lib/payload'
import {
  bodyFromParagraphs,
  ensureMediaFromUrl,
  findBySlug,
  formatDurationLabel,
  monthsAgo,
  safeRun,
  type PayloadClient,
} from './seed-helpers'
import {
  CATEGORY_SLUG,
  CONTRIBUTOR_AVATARS,
  TEST_PODCAST_SERIES,
  EXTRA_PODCAST_EPISODES,
  TEST_CATEGORIES,
  TEST_CONTACT_SUBMISSIONS,
  TEST_CONTRIBUTORS,
  TEST_NEWSLETTER_SUBSCRIBERS,
  TEST_PARTNERS,
  TEST_PODCAST_EPISODES,
  TEST_PROGRAMMES,
  TEST_SOLUTIONS,
  TEST_VIDEOS,
  STORY_IMAGES,
  VIDEO_CATEGORY_TAG,
} from './test-content-data'
import { runQaExtensions } from './seed-qa-extensions'
import { TEST_STORIES } from './test-content-stories'

const TEST_CONTRIBUTOR_PASSWORD = 'TestContributorPass123!'

async function seedCategories(payload: PayloadClient, ids: Record<string, number>) {
  console.log('\n— Categories —')
  for (const cat of TEST_CATEGORIES) {
    await safeRun(`category ${cat.slug}`, async () => {
      const existing = await findBySlug(payload, 'categories', cat.slug)
      if (existing) {
        ids[cat.slug] = existing.id as number
        console.log(`· Skipped category (exists): ${cat.name}`)
        return
      }
      const created = await payload.create({ collection: 'categories', data: { ...cat, isSeedContent: true } })
      ids[cat.slug] = created.id as number
      console.log(`✓ Created category: ${cat.name}`)
    })
  }
}

async function seedContributors(payload: PayloadClient, ids: Record<string, number>) {
  console.log('\n— Contributors —')
  for (let i = 0; i < TEST_CONTRIBUTORS.length; i++) {
    const c = TEST_CONTRIBUTORS[i]
    await safeRun(`contributor ${c.slug}`, async () => {
      const existing = await findBySlug(payload, 'contributors', c.slug)
      if (existing) {
        ids[c.slug] = existing.id as number
        console.log(`· Skipped contributor (exists): ${c.name}`)
        return
      }
      const avatarId = await ensureMediaFromUrl(
        payload,
        CONTRIBUTOR_AVATARS[i],
        `Contributor avatar: ${c.name}`,
      )
      const created = await payload.create({
        collection: 'contributors',
        data: {
          name: c.name,
          slug: c.slug,
          email: `${c.slug}@ecodiaries.test`,
          role: c.role,
          bio: c.bio,
          expertise: [{ area: c.specialisation }],
          socialLinks: [...c.socialLinks],
          applicationStatus: 'approved',
          password: TEST_CONTRIBUTOR_PASSWORD,
          isSeedContent: true,
          ...(avatarId ? { profilePhoto: avatarId } : {}),
        },
      })
      ids[c.slug] = created.id as number
      console.log(`✓ Created contributor: ${c.name}`)
    })
  }
}

async function seedAllSeries(payload: PayloadClient): Promise<Record<string, number>> {
  console.log('\n— Series —')
  const ids: Record<string, number> = {}
  for (const series of TEST_PODCAST_SERIES) {
    await safeRun(`series ${series.slug}`, async () => {
      const existing = await payload.find({
        collection: 'series',
        where: { name: { equals: series.name } },
        limit: 1,
      })
      if (existing.docs[0]) {
        ids[series.slug] = existing.docs[0].id as number
        console.log(`· Skipped series (exists): ${series.name}`)
        return
      }
      const coverId = await ensureMediaFromUrl(payload, series.cover, `Series cover: ${series.slug}`)
      const created = await payload.create({
        collection: 'series',
        data: {
          name: series.name,
          description: series.description,
          type: series.type,
          coverArt: coverId || undefined,
          isSeedContent: true,
        },
      })
      ids[series.slug] = created.id as number
      console.log(`✓ Created series: ${series.name}`)
    })
  }
  return ids
}

async function seedStories(
  payload: PayloadClient,
  categoryIds: Record<string, number>,
  contributorIds: Record<string, number>,
) {
  console.log('\n— Stories —')
  for (const story of TEST_STORIES) {
    await safeRun(`story ${story.slug}`, async () => {
      const existing = await findBySlug(payload, 'stories', story.slug)
      if (existing) {
        console.log(`· Skipped story (exists): ${story.title}`)
        return
      }
      const catSlug = CATEGORY_SLUG[story.category]
      const imageUrl = STORY_IMAGES[story.imageIndex] || STORY_IMAGES[0]
      const heroImageId = await ensureMediaFromUrl(payload, imageUrl, `Story hero: ${story.slug}`)

      await payload.create({
        collection: 'stories',
        data: {
          title: story.title,
          slug: story.slug,
          excerpt: story.excerpt,
          body: bodyFromParagraphs(...story.paragraphs),
          category: categoryIds[catSlug],
          author: contributorIds[story.authorSlug],
          location: story.location,
          featured: story.featured,
          status: 'published',
          publishedAt: monthsAgo(story.monthsAgo),
          isSeedContent: true,
          ...(heroImageId ? { heroImage: heroImageId } : {}),
        },
      })
      console.log(`✓ Created story: ${story.title}`)
    })
  }
}

async function seedSolutions(payload: PayloadClient, categoryIds: Record<string, number>) {
  console.log('\n— Solutions —')
  for (const sol of TEST_SOLUTIONS) {
    await safeRun(`solution ${sol.slug}`, async () => {
      const existing = await findBySlug(payload, 'solutions', sol.slug)
      if (existing) {
        console.log(`· Skipped solution (exists): ${sol.title}`)
        return
      }
      const heroId = await ensureMediaFromUrl(payload, sol.image, `Solution hero: ${sol.slug}`)
      const catSlug = CATEGORY_SLUG[sol.category]
      await payload.create({
        collection: 'solutions',
        data: {
          title: sol.title,
          slug: sol.slug,
          category: categoryIds[catSlug],
          summary: sol.summary,
          statHighlight: sol.impact,
          location: sol.region,
          sectors: [...sol.sectors],
          solutionStatus: sol.status,
          coordinates: { lat: sol.lat, lng: sol.lng },
          partnerOrgs: ('partners' in sol && sol.partners ? sol.partners : []).map((name: string) => ({ name })),
          verifiedBy: 'field-reporter',
          publishedAt: new Date().toISOString(),
          verified: true,
          isSeedContent: true,
          body: bodyFromParagraphs(
            sol.summary,
            `**How it works**\n${sol.howItWorks}`,
            'Learn more: contact EcoDiaries for implementation guides and partner introductions.',
          ),
          ...(heroId ? { heroImage: heroId } : {}),
        },
      })
      console.log(`✓ Created solution: ${sol.title}`)
    })
  }
}

async function seedVideos(payload: PayloadClient) {
  console.log('\n— Videos —')
  for (const video of TEST_VIDEOS) {
    await safeRun(`video ${video.slug}`, async () => {
      const existing = await findBySlug(payload, 'videos', video.slug)
      if (existing) {
        console.log(`· Skipped video (exists): ${video.title}`)
        return
      }
      const thumbId = await ensureMediaFromUrl(payload, video.thumbnail, `Video thumb: ${video.slug}`)
      await payload.create({
        collection: 'videos',
        data: {
          title: video.title,
          slug: video.slug,
          embedUrl: `https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`,
          thumbnail: thumbId || undefined,
          categoryTag: VIDEO_CATEGORY_TAG[video.category] as
            | 'Documentary'
            | 'Field Report'
            | 'Interview'
            | 'Community Spotlight'
            | 'Educational'
            | 'Short',
          duration: formatDurationLabel(video.durationSeconds),
          durationSeconds: video.durationSeconds,
          description: video.description,
          featured: video.featured,
          publishedAt: monthsAgo(1),
          isSeedContent: true,
        },
      })
      console.log(`✓ Created video: ${video.title}`)
    })
  }
}

async function seedPodcasts(
  payload: PayloadClient,
  contributorIds: Record<string, number>,
  seriesIds: Record<string, number>,
) {
  console.log('\n— Podcast episodes —')
  const allEpisodes = [...TEST_PODCAST_EPISODES, ...EXTRA_PODCAST_EPISODES]
  for (const ep of allEpisodes) {
    await safeRun(`podcast ${ep.slug}`, async () => {
      const existing = await findBySlug(payload, 'podcast-episodes', ep.slug)
      if (existing) {
        console.log(`· Skipped episode (exists): ${ep.title}`)
        return
      }
      const seriesSlug = 'seriesSlug' in ep ? ep.seriesSlug : 'youth-climate-dispatch'
      const seriesId = seriesIds[seriesSlug] ?? null
      const thumbId = await ensureMediaFromUrl(payload, ep.thumbnail, `Podcast thumb: ${ep.slug}`)
      const audioId = await ensureMediaFromUrl(payload, ep.audioUrl, `Podcast audio: ${ep.slug}`)
      const hosts = ep.hosts.map((slug, idx) => ({
        contributor: contributorIds[slug],
        role: idx === 0 ? ('Host' as const) : ('Co-host' as const),
      }))
      await payload.create({
        collection: 'podcast-episodes',
        data: {
          title: ep.title,
          slug: ep.slug,
          series: seriesId || undefined,
          episodeNumber: ep.episodeNumber,
          seasonNumber: ep.seasonNumber,
          audioFile: audioId || undefined,
          duration: formatDurationLabel(ep.durationSeconds),
          durationSeconds: ep.durationSeconds,
          description: ep.description,
          thumbnail: thumbId || undefined,
          featured: ep.featured,
          publishedAt: monthsAgo(ep.episodeNumber),
          hosts,
          isSeedContent: true,
        },
      })
      console.log(`✓ Created podcast episode: ${ep.title}`)
    })
  }
}

async function seedProgrammes(payload: PayloadClient) {
  console.log('\n— Programmes —')
  for (const prog of TEST_PROGRAMMES) {
    await safeRun(`programme ${prog.slug}`, async () => {
      const existing = await findBySlug(payload, 'programmes', prog.slug)
      if (existing) {
        console.log(`· Skipped programme (exists): ${prog.name}`)
        return
      }
      await payload.create({
        collection: 'programmes',
        data: {
          name: prog.name,
          slug: prog.slug,
          description: `${prog.summary}\n\nEligibility: ${prog.eligibility}\n\nFormat: ${prog.locationType}. Applications close ${prog.applicationDeadline}. Starts ${prog.startDate}.`,
          cadence: `Applications close ${prog.applicationDeadline} · Starts ${prog.startDate}`,
          applicationInstructions: prog.eligibility,
          applicationOpenDate:
            'applicationOpenDate' in prog && prog.applicationOpenDate
              ? prog.applicationOpenDate
              : prog.startDate,
          applicationCloseDate: prog.applicationDeadline,
          opportunityType: (prog.category === 'Solutions'
            ? 'grant'
            : prog.category === 'Policy'
              ? 'fellowship'
              : 'programme') as 'programme' | 'grant' | 'fellowship' | 'event',
          accentColor: prog.accentColor,
          status: prog.status,
          isSeedContent: true,
        },
      })
      console.log(`✓ Created programme: ${prog.name}`)
    })
  }
}

async function seedPartners(payload: PayloadClient) {
  console.log('\n— Community partners —')
  for (const partner of TEST_PARTNERS) {
    await safeRun(`partner ${partner.name}`, async () => {
      const existing = await payload.find({
        collection: 'partner-organisations',
        where: { name: { equals: partner.name } },
        limit: 1,
      })
      if (existing.docs[0]) {
        console.log(`· Skipped partner (exists): ${partner.name}`)
        return
      }
      const logoId = await ensureMediaFromUrl(payload, partner.logo, `Partner logo: ${partner.name}`)
      await payload.create({
        collection: 'partner-organisations',
        data: {
          name: partner.name,
          link: partner.link,
          description: partner.description,
          logo: logoId || undefined,
          isSeedContent: true,
        },
      })
      console.log(`✓ Created partner: ${partner.name}`)
    })
  }
}

async function seedContactSubmissions(payload: PayloadClient) {
  console.log('\n— Contact submissions —')
  for (const sub of TEST_CONTACT_SUBMISSIONS) {
    await safeRun(`contact ${sub.email}`, async () => {
      const existing = await payload.find({
        collection: 'contact-submissions',
        where: { email: { equals: sub.email } },
        limit: 1,
      })
      if (existing.docs[0]) {
        console.log(`· Skipped contact (exists): ${sub.name}`)
        return
      }
      await payload.create({
        collection: 'contact-submissions',
        data: sub,
      })
      console.log(`✓ Created contact submission: ${sub.name}`)
    })
  }
}

async function seedNewsletterSubscribers(payload: PayloadClient) {
  console.log('\n— Newsletter subscribers —')
  for (const sub of TEST_NEWSLETTER_SUBSCRIBERS) {
    await safeRun(`subscriber ${sub.email}`, async () => {
      const existing = await payload.find({
        collection: 'newsletter-subscribers',
        where: { email: { equals: sub.email } },
        limit: 1,
      })
      if (existing.docs[0]) {
        console.log(`· Skipped subscriber (exists): ${sub.email}`)
        return
      }
      await payload.create({
        collection: 'newsletter-subscribers',
        data: {
          email: sub.email,
          status: sub.status,
          ...(sub.status === 'confirmed' ? { confirmedAt: monthsAgo(2) } : {}),
        },
      })
      console.log(`✓ Created subscriber: ${sub.email}`)
    })
  }
}

async function seedEdgeCases(
  payload: PayloadClient,
  categoryIds: Record<string, number>,
  contributorIds: Record<string, number>,
  seriesId: number | null,
) {
  console.log('\n— Edge cases —')

  await safeRun('long title story', async () => {
    const slug = 'test-edge-very-long-headline-truncation-on-story-cards-across-the-site'
    if (await findBySlug(payload, 'stories', slug)) {
      console.log('· Skipped edge story (exists): long title')
      return
    }
    await payload.create({
      collection: 'stories',
      data: {
        title:
          'When the Rains Fail for the Fourth Consecutive Season, Pastoral Communities Face Impossible Choices About Land, Livestock, and Leaving Home Behind',
        slug,
        excerpt: 'Edge case: tests title truncation on cards.',
        body: bodyFromParagraphs(
          'This published edge-case story exists solely to verify that very long headlines truncate gracefully on story cards without breaking grid layout.',
        ),
        category: categoryIds['climate-change'],
        author: contributorIds['amara-diallo'],
        status: 'published',
        publishedAt: monthsAgo(0),
        isSeedContent: true,
      },
    })
    console.log('✓ Created edge story: very long title')
  })

  await safeRun('no hero image story', async () => {
    const slug = 'test-edge-no-hero-image'
    if (await findBySlug(payload, 'stories', slug)) {
      console.log('· Skipped edge story (exists): no hero')
      return
    }
    await payload.create({
      collection: 'stories',
      data: {
        title: 'A Story Without a Hero Image for Placeholder Testing',
        slug,
        excerpt: 'Verifies fallback imagery when no hero is attached.',
        body: bodyFromParagraphs('No hero image attached — UI should show a sensible fallback.'),
        category: categoryIds.water,
        author: contributorIds['zoe-ndlovu'],
        status: 'published',
        publishedAt: monthsAgo(1),
        isSeedContent: true,
      },
    })
    console.log('✓ Created edge story: no hero image')
  })

  await safeRun('draft story', async () => {
    const slug = 'test-edge-draft-story'
    if (await findBySlug(payload, 'stories', slug)) {
      console.log('· Skipped edge story (exists): draft')
      return
    }
    await payload.create({
      collection: 'stories',
      data: {
        title: 'Draft Story — Should Not Appear on Public Site',
        slug,
        excerpt: 'Draft visibility test.',
        body: bodyFromParagraphs('This story is a draft.'),
        category: categoryIds.policy,
        author: contributorIds['nadia-hassan'],
        status: 'draft',
        isSeedContent: true,
      },
    })
    console.log('✓ Created edge story: draft')
  })

  await safeRun('in-review story', async () => {
    const slug = 'test-edge-in-review-story'
    if (await findBySlug(payload, 'stories', slug)) {
      console.log('· Skipped edge story (exists): in review')
      return
    }
    await payload.create({
      collection: 'stories',
      data: {
        title: 'In Review Story — Visible in Studio Queue Only',
        slug,
        excerpt: 'Review workflow test.',
        body: bodyFromParagraphs('This story awaits editor review.'),
        category: categoryIds.opinion,
        author: contributorIds['kwame-asante'],
        status: 'in-review',
        isSeedContent: true,
      },
    })
    console.log('✓ Created edge story: in review')
  })

  await safeRun('three-host podcast', async () => {
    const slug = 'test-edge-three-hosts-episode'
    if (await findBySlug(payload, 'podcast-episodes', slug)) {
      console.log('· Skipped edge episode (exists): three hosts')
      return
    }
    const thumbId = await ensureMediaFromUrl(
      payload,
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
      'Podcast thumb: three hosts edge case',
    )
    const audioId = await ensureMediaFromUrl(
      payload,
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      'Podcast audio: three hosts edge case',
    )
    await payload.create({
      collection: 'podcast-episodes',
      data: {
        title: 'Roundtable: Three Hosts on the Future of African Climate Media',
        slug,
        series: seriesId || undefined,
        episodeNumber: 99,
        seasonNumber: 1,
        audioFile: audioId || undefined,
        duration: '42 min',
        durationSeconds: 2520,
        description: 'Edge case episode with three stacked host avatars.',
        thumbnail: thumbId || undefined,
        featured: false,
        publishedAt: monthsAgo(0),
        hosts: [
          { contributor: contributorIds['david-osei'], role: 'Host' },
          { contributor: contributorIds['amara-diallo'], role: 'Co-host' },
          { contributor: contributorIds['kwame-asante'], role: 'Guest' },
        ],
        isSeedContent: true,
      },
    })
    console.log('✓ Created edge podcast: three hosts')
  })

  await safeRun('closed programme', async () => {
    const slug = 'test-edge-closed-programme-past-deadline'
    if (await findBySlug(payload, 'programmes', slug)) {
      console.log('· Skipped edge programme (exists): closed')
      return
    }
    await payload.create({
      collection: 'programmes',
      data: {
        name: 'Archived Watershed Restoration Fellowship (Closed)',
        slug,
        description:
          'Applications closed December 2024. This programme tests the closed-state UI for past deadlines.',
        cadence: 'Applications closed 2024-12-01',
        applicationInstructions: 'No longer accepting applications.',
        accentColor: 'bg-forest',
        opportunityType: 'fellowship',
        applicationOpenDate: '2024-06-01',
        applicationCloseDate: '2024-12-01',
        status: 'closed',
        isSeedContent: true,
      },
    })
    console.log('✓ Created edge programme: closed / past deadline')
  })

  await safeRun('contributor no social', async () => {
    const slug = 'test-edge-no-social-contributor'
    if (await findBySlug(payload, 'contributors', slug)) {
      console.log('· Skipped edge contributor (exists): no social')
      return
    }
    await payload.create({
      collection: 'contributors',
      data: {
        name: 'Lena Okoro',
        slug,
        email: 'lena-okoro@ecodiaries.test',
        role: 'Field Reporter',
        bio: 'Edge-case contributor with no social links — tests conditional icon rendering.',
        expertise: [{ area: 'Water' }],
        socialLinks: [],
        applicationStatus: 'approved',
        password: TEST_CONTRIBUTOR_PASSWORD,
        isSeedContent: true,
      },
    })
    console.log('✓ Created edge contributor: no social links')
  })

  await safeRun('long contact message', async () => {
    const email = 'test-edge-long-message@example.com'
    const existing = await payload.find({
      collection: 'contact-submissions',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.docs[0]) {
      console.log('· Skipped edge contact (exists): long message')
      return
    }
    const longMessage = Array.from({ length: 12 }, (_, i) =>
      `Paragraph ${i + 1}: This is an extended contact submission used to test message preview truncation in the studio inbox table. It repeats realistic concerns about climate reporting access, funding delays, and community consent processes so the total length exceeds five hundred words when combined with specific details about watershed monitoring programmes in the Rift Valley corridor and the need for transparent data sharing between ministries and local cooperatives.`,
    ).join('\n\n')
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: 'Edge Case Long Message',
        email,
        reason: 'other',
        message: longMessage,
        status: 'new',
      },
    })
    console.log('✓ Created edge contact: long message')
  })
}

export async function runTestSeed(existingPayload?: PayloadClient) {
  console.log('EcoDiaries test content seed starting…')
  const payload = existingPayload ?? (await getPayloadClient())
  const categoryIds: Record<string, number> = {}
  const contributorIds: Record<string, number> = {}

  await seedCategories(payload, categoryIds)
  await seedContributors(payload, contributorIds)
  const seriesIds = await seedAllSeries(payload)
  await seedStories(payload, categoryIds, contributorIds)
  await seedSolutions(payload, categoryIds)
  await seedVideos(payload)
  await seedPodcasts(payload, contributorIds, seriesIds)
  await seedProgrammes(payload)
  await seedPartners(payload)
  await seedContactSubmissions(payload)
  await seedNewsletterSubscribers(payload)
  await seedEdgeCases(payload, categoryIds, contributorIds, seriesIds['youth-climate-dispatch'] ?? null)
  await runQaExtensions(payload, { categoryIds, contributorIds, seriesIds })

  console.log('\n✅ Test content seed complete.')
}

const isTestCli = process.argv[1]?.includes('seed-test-content.ts')
if (isTestCli) {
  runTestSeed().catch((err) => {
    console.error(err)
    process.exit(1)
  }).then(() => process.exit(0))
}
