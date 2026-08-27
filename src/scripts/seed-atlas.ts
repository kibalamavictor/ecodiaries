/**
 * Seeds Solutions Atlas organisations + published projects with full atlas fields.
 * Run after: npm run db:up && npm run seed (categories)
 * Usage: npm run seed:atlas
 */
import { getPayloadClient } from '@/lib/payload'
import { bodyFromParagraphs, ensureMediaFromUrl, findBySlug, safeRun, type PayloadClient } from './seed-helpers'
import { paragraphsToLexical } from './launch-content'

const CATEGORY_SLUG: Record<string, string> = {
  Agriculture: 'agriculture',
  Energy: 'renewable-energy',
  Water: 'water',
  Biodiversity: 'biodiversity',
}

const ORG_IMAGES: Record<string, { cover: string; logo: string }> = {
  'solarworks-coop': {
    cover: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80',
  },
  'greenline-africa': {
    cover: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80',
  },
  'wetlands-trust': {
    cover: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
  },
  'kampala-climate-lab': {
    cover: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  },
  'youth4climate-ug': {
    cover: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
  },
  'world-agroforestry-centre': {
    cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  },
}

const ORGS = [
  {
    slug: 'solarworks-coop',
    name: 'SolarWorks Coop',
    type: 'cooperative' as const,
    tagline: 'Community-owned solar irrigation across East Africa',
    hqLocation: 'Nairobi, Kenya',
    regions: ['east-africa'],
    focusAreas: ['energy', 'water', 'agriculture'],
    verified: true,
    website: 'https://example.org/solarworks',
    donationUrl: 'https://example.org/solarworks/donate',
  },
  {
    slug: 'greenline-africa',
    name: 'Greenline Africa',
    type: 'ngo' as const,
    tagline: 'Indigenous seed sovereignty and biodiversity restoration',
    hqLocation: 'Addis Ababa, Ethiopia',
    regions: ['east-africa', 'horn-of-africa'],
    focusAreas: ['biodiversity', 'agriculture'],
    verified: true,
  },
  {
    slug: 'wetlands-trust',
    name: 'Wetlands Trust',
    type: 'ngo' as const,
    tagline: 'Biogas and wetland restoration programmes',
    hqLocation: 'Kigali, Rwanda',
    regions: ['east-africa'],
    focusAreas: ['energy', 'pollution'],
    verified: true,
  },
  {
    slug: 'kampala-climate-lab',
    name: 'Kampala Climate Lab',
    type: 'research' as const,
    tagline: 'Translating climate innovation into field pilots',
    hqLocation: 'Kampala, Uganda',
    regions: ['east-africa'],
    focusAreas: ['energy', 'water'],
    verified: false,
  },
  {
    slug: 'youth4climate-ug',
    name: 'Youth4Climate UG',
    type: 'community' as const,
    tagline: 'Urban food systems and youth-led climate action',
    hqLocation: 'Lagos, Nigeria',
    regions: ['west-africa'],
    focusAreas: ['agriculture', 'climate-justice'],
    verified: true,
  },
  {
    slug: 'world-agroforestry-centre',
    name: 'World Agroforestry Centre',
    type: 'research' as const,
    tagline: 'Farmer-managed natural regeneration at scale',
    hqLocation: 'Sahel corridor',
    regions: ['sahel', 'west-africa'],
    focusAreas: ['agriculture'],
    verified: true,
  },
]

const PROJECTS = [
  {
    slug: 'solar-powered-water-pumps-smallholders',
    title: 'Solar-Powered Water Pumps for Smallholders',
    orgSlug: 'solarworks-coop',
    category: 'Energy',
    region: 'East Africa',
    country: 'Kenya',
    locationName: 'Machakos County',
    lat: -0.02,
    lng: 37.9,
    status: 'scaling' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'seeking' as const,
    sectors: ['energy', 'water'] as const,
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80',
    thesis: 'Affordable solar irrigation for smallholder farmers',
    summary:
      'Replacing diesel irrigation pumps with solar-powered alternatives eliminates fuel costs, reduces emissions, and extends the growing season for smallholder farmers.',
    impact: [
      { label: 'Irrigation cost reduction', value: '40%' },
      { label: 'Growing seasons enabled', value: '2', unit: 'per year' },
    ],
    howItWorks:
      'Submersible solar pumps draw groundwater during daylight hours, filling storage tanks that release water through drip lines overnight. Cooperatives maintain shared systems, spreading capital costs across dozens of households.',
    documented: '2026-06-01',
    featured: true,
  },
  {
    slug: 'farmer-managed-natural-regeneration',
    title: 'Farmer-Managed Natural Regeneration (FMNR)',
    orgSlug: 'world-agroforestry-centre',
    category: 'Agriculture',
    region: 'Sahel',
    country: 'Niger',
    lat: 14,
    lng: 0,
    status: 'established' as const,
    verificationTier: 'independently_verified' as const,
    fundingStatus: 'partial' as const,
    sectors: ['agriculture'] as const,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    summary:
      'A low-cost technique where farmers systematically manage regrowth of native trees and shrubs on farmland, restoring soil fertility without expensive inputs.',
    impact: [{ label: 'Hectares restored', value: '6M', unit: 'across the Sahel since 2000' }],
    howItWorks:
      'Farmers identify living tree stumps and root systems in degraded fields, then prune and protect regrowth rather than clearing land.',
  },
  {
    slug: 'community-seed-banks',
    title: 'Community Seed Banks',
    orgSlug: 'greenline-africa',
    category: 'Biodiversity',
    region: 'Ethiopia',
    country: 'Ethiopia',
    lat: 9,
    lng: 38.7,
    status: 'established' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'funded' as const,
    sectors: ['biodiversity', 'agriculture'] as const,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80',
    summary:
      'Locally managed seed banks preserve drought-resistant indigenous crop varieties that commercial agriculture has discarded.',
    impact: [{ label: 'Varieties preserved', value: '2,000+', unit: 'indigenous varieties' }],
    howItWorks: 'Village committees catalogue, dry, and store seeds in ventilated containers with strict anti-contamination protocols.',
  },
  {
    slug: 'biogas-digesters-rural-households',
    title: 'Biogas Digesters for Rural Households',
    orgSlug: 'wetlands-trust',
    category: 'Energy',
    region: 'Rwanda',
    country: 'Rwanda',
    lat: -1.94,
    lng: 29.87,
    status: 'scaling' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'seeking' as const,
    sectors: ['energy', 'pollution'] as const,
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80',
    summary:
      'Small-scale biogas systems convert animal and kitchen waste into cooking gas and fertiliser, replacing charcoal and reducing indoor air pollution.',
    impact: [{ label: 'Households served', value: '500,000+', unit: 'Kenya, Rwanda, Ethiopia' }],
    howItWorks: 'Underground digesters break down manure anaerobically, piping methane to stoves while slurry fertilises kitchen gardens.',
  },
  {
    slug: 'floating-solar-african-reservoirs',
    title: 'Floating Solar on African Reservoirs',
    orgSlug: 'kampala-climate-lab',
    category: 'Energy',
    region: 'Ghana',
    country: 'Ghana',
    lat: 7.95,
    lng: -1.02,
    status: 'piloted' as const,
    verificationTier: 'self_reported' as const,
    fundingStatus: 'seeking' as const,
    sectors: ['energy', 'water'] as const,
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=1200&q=80',
    summary:
      'Installing solar panels on reservoirs generates electricity while reducing water evaporation.',
    impact: [{ label: 'Evaporation reduced', value: '70%', unit: 'during dry season' }],
    howItWorks: 'Floating platforms anchor to reservoir banks, feeding mini-grids while shading water surfaces.',
  },
  {
    slug: 'urban-rooftop-gardens-climate-resilience',
    title: 'Urban Rooftop Gardens for Climate Resilience',
    orgSlug: 'youth4climate-ug',
    category: 'Agriculture',
    region: 'Nigeria',
    country: 'Nigeria',
    lat: 9.08,
    lng: 8.68,
    status: 'piloted' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'partial' as const,
    sectors: ['agriculture', 'climate-justice'] as const,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    summary:
      'Rooftop gardens grow food, cool buildings, and build community resilience in African cities.',
    impact: [
      { label: 'Cooling cost reduction', value: '15%', unit: 'building level' },
      { label: 'Monthly food yield', value: '30kg', unit: 'per rooftop' },
    ],
    howItWorks: 'Lightweight soil mixes and drip irrigation on concrete roofs, maintained by resident cooperatives.',
  },
  {
    slug: 'solar-micro-grids',
    title: 'Solar Micro-Grids',
    orgSlug: 'solarworks-coop',
    category: 'Energy',
    region: 'Uganda',
    country: 'Uganda',
    lat: 1.37,
    lng: 32.29,
    status: 'scaling' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'seeking' as const,
    sectors: ['energy'] as const,
    image: 'https://picsum.photos/seed/solar-micro/1200/800',
    summary: 'Off-grid solar cooperatives power schools, clinics, and small businesses beyond the national grid.',
    impact: [{ label: 'Community sites', value: '8', unit: 'operational micro-grids' }],
    howItWorks: 'Household cooperatives pool savings, secure grants, and train local technicians for maintenance.',
  },
  {
    slug: 'drought-resistant-seed-banks',
    title: 'Drought-Resistant Seed Banks',
    orgSlug: 'greenline-africa',
    category: 'Agriculture',
    region: 'Kenya',
    country: 'Kenya',
    lat: -0.5,
    lng: 36.5,
    status: 'established' as const,
    verificationTier: 'independently_verified' as const,
    fundingStatus: 'not_seeking' as const,
    sectors: ['agriculture', 'biodiversity'] as const,
    image: 'https://picsum.photos/seed/seed-banks/1200/800',
    summary: 'Community seed banks preserve drought-resistant varieties for shifting rainfall patterns.',
    impact: [{ label: 'Farmer households', value: '12,000+', unit: 'with access' }],
    howItWorks: 'Seed guardians catalogue, dry, and lend varieties with strict return protocols each season.',
  },
  {
    slug: 'india-solar-irrigation-coops',
    title: 'Solar Irrigation Cooperatives',
    orgSlug: 'solarworks-coop',
    category: 'Energy',
    region: 'India',
    country: 'India',
    lat: 20.59,
    lng: 78.96,
    status: 'established' as const,
    verificationTier: 'independently_verified' as const,
    fundingStatus: 'not_seeking' as const,
    sectors: ['energy', 'agriculture'] as const,
    replicationScope: 'global' as const,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&q=80',
    summary:
      'Farmer-owned solar irrigation cooperatives cut diesel dependence and are being studied for replication across East African smallholder networks.',
    impact: [{ label: 'Pump systems deployed', value: '18,000+', unit: 'across Maharashtra' }],
    howItWorks: 'Village cooperatives finance shared solar pumps, with surplus power sold back to mini-grids.',
    featured: true,
  },
  {
    slug: 'brazil-agroforestry-corridors',
    title: 'Agroforestry Corridor Restoration',
    orgSlug: 'world-agroforestry-centre',
    category: 'Agriculture',
    region: 'Latin America',
    country: 'Brazil',
    lat: -14.24,
    lng: -51.93,
    status: 'scaling' as const,
    verificationTier: 'field_reported' as const,
    fundingStatus: 'seeking' as const,
    sectors: ['agriculture', 'biodiversity'] as const,
    replicationScope: 'global' as const,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    summary:
      'Mixed native tree corridors between farmland restore soil carbon and biodiversity — a model being adapted for Sahel restoration programmes.',
    impact: [{ label: 'Hectares under restoration', value: '240,000', unit: 'Cerrado corridor' }],
    howItWorks: 'Farmers plant native species strips along field edges, supported by carbon credit revenue and technical assistance.',
  },
]

export async function runAtlasSeed(existingPayload?: PayloadClient) {
  const payload = existingPayload ?? (await getPayloadClient())
  const orgIds: Record<string, number> = {}

  console.log('\n— Organizations —')
  for (const org of ORGS) {
    await safeRun(`org ${org.slug}`, async () => {
      const images = ORG_IMAGES[org.slug]
      const coverId = images ? await ensureMediaFromUrl(payload, images.cover, `Cover: ${org.slug}`) : null
      const logoId = images ? await ensureMediaFromUrl(payload, images.logo, `Logo: ${org.slug}`) : null
      const existing = await payload.find({
        collection: 'organizations',
        where: { slug: { equals: org.slug } },
        limit: 1,
      })
      const data = {
        ...org,
        bio: paragraphsToLexical(org.tagline, `${org.name} works with EcoDiaries field networks across ${org.regions.join(', ')}.`),
        ...(coverId ? { coverImage: coverId } : {}),
        ...(logoId ? { logo: logoId } : {}),
        isSeedContent: true,
      }
      if (existing.docs[0]) {
        await payload.update({ collection: 'organizations', id: existing.docs[0].id, data: data as never })
        orgIds[org.slug] = existing.docs[0].id as number
        console.log(`· Updated org: ${org.name}`)
      } else {
        const created = await payload.create({ collection: 'organizations', data: data as never })
        orgIds[org.slug] = created.id as number
        console.log(`✓ Created org: ${org.name}`)
      }
    })
  }

  const cats = await payload.find({ collection: 'categories', limit: 50 })
  const categoryIds: Record<string, number> = {}
  for (const c of cats.docs) categoryIds[c.slug] = c.id as number

  console.log('\n— Atlas projects —')
  for (const p of PROJECTS) {
    await safeRun(`project ${p.slug}`, async () => {
      const heroId = await ensureMediaFromUrl(payload, p.image, `Atlas: ${p.slug}`)
      const catSlug = CATEGORY_SLUG[p.category] || 'climate-solutions'
      const data = {
        title: p.title,
        slug: p.slug,
        organization: orgIds[p.orgSlug],
        thesis: 'thesis' in p ? p.thesis : undefined,
        category: categoryIds[catSlug],
        summary: p.summary,
        location: p.region,
        country: p.country,
        replicationScope: ('replicationScope' in p ? p.replicationScope : 'africa') as 'africa' | 'global',
        locationName: 'locationName' in p ? p.locationName : undefined,
        sectors: [...p.sectors],
        solutionStatus: p.status,
        verificationTier: p.verificationTier,
        verifiedBy: 'field-reporter' as const,
        coordinates: { lat: p.lat, lng: p.lng },
        keyImpact: p.impact,
        statHighlight: p.impact[0] ? `${p.impact[0].value} ${p.impact[0].label}` : undefined,
        fundingStatus: p.fundingStatus,
        fundingNeed:
          p.fundingStatus === 'seeking'
            ? { amount: '$120,000', currency: 'USD', timeline: '12 months', useOfFunds: 'Scale field implementation and monitoring.' }
            : undefined,
        published: true,
        featured: 'featured' in p ? p.featured : false,
        publishedAt: ('documented' in p ? p.documented : undefined) || new Date().toISOString(),
        verified: true,
        body: bodyFromParagraphs(p.summary, `**How it works**\n${p.howItWorks}`),
        ...(heroId ? { heroImage: heroId } : {}),
        isSeedContent: true,
      }

      const existing = await findBySlug(payload, 'solutions', p.slug)
      if (existing) {
        await payload.update({ collection: 'solutions', id: existing.id, data })
        console.log(`· Updated project: ${p.title}`)
      } else {
        await payload.create({ collection: 'solutions', data })
        console.log(`✓ Created project: ${p.title}`)
      }
    })
  }

  console.log('\nAtlas seed complete.')
}

const isAtlasCli = process.argv[1]?.includes('seed-atlas.ts')
if (isAtlasCli) {
  runAtlasSeed().catch((err) => {
    console.error(err)
    process.exit(1)
  }).then(() => process.exit(0))
}
