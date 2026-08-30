import { resolveCategoryName, resolveEditorialUrl, resolveMediaUrl } from '@/lib/cms/mappers'
import { coordinatesForRegion } from '@/lib/solutions/coordinates'
import type {
  AtlasOrganization,
  AtlasProject,
  FundingStatus,
  ImpactTile,
  Sector,
  SolutionStatus,
  VerificationTier,
  VerifiedBy,
} from '@/lib/solutions/types'

const CATEGORY_SECTOR_RULES: { pattern: RegExp; sector: Sector }[] = [
  { pattern: /agri|farm|food|crop/i, sector: 'agriculture' },
  { pattern: /energy|solar|wind|biogas|grid|power/i, sector: 'energy' },
  { pattern: /water|well|irrigation|reservoir/i, sector: 'water' },
  { pattern: /bio|forest|conserv|wild|seed/i, sector: 'biodiversity' },
  { pattern: /pollut|plastic|waste|brick/i, sector: 'pollution' },
  { pattern: /justice|climate|sustain|youth|community/i, sector: 'climate-justice' },
]

const VALID_SECTORS = new Set<Sector>([
  'agriculture',
  'energy',
  'water',
  'biodiversity',
  'pollution',
  'climate-justice',
])

const VALID_STATUS = new Set<SolutionStatus>(['piloted', 'scaling', 'established'])
const VALID_FUNDING = new Set<FundingStatus>(['seeking', 'partial', 'funded', 'not_seeking'])
const VALID_VERIFICATION = new Set<VerificationTier>([
  'self_reported',
  'field_reported',
  'independently_verified',
])

function inferSectors(categoryName: string, explicit?: string[] | null): Sector[] {
  const fromExplicit = explicit?.filter((s): s is Sector => VALID_SECTORS.has(s as Sector)) ?? []
  if (fromExplicit.length) return [...new Set(fromExplicit)]

  const found = new Set<Sector>()
  for (const rule of CATEGORY_SECTOR_RULES) {
    if (rule.pattern.test(categoryName)) found.add(rule.sector)
  }
  if (!found.size) found.add('climate-justice')
  return [...found]
}

function inferStatus(slug: string, explicit?: string | null): SolutionStatus {
  if (explicit && VALID_STATUS.has(explicit as SolutionStatus)) return explicit as SolutionStatus
  if (/micro|floating|rooftop|pilot/i.test(slug)) return 'piloted'
  if (/million|national|established|regeneration/i.test(slug)) return 'established'
  return 'scaling'
}

function inferVerification(
  explicit?: string | null,
  legacy?: string | null,
): VerificationTier {
  if (explicit && VALID_VERIFICATION.has(explicit as VerificationTier)) return explicit as VerificationTier
  if (legacy === 'partner-confirmed') return 'independently_verified'
  if (legacy === 'community-validated' || legacy === 'field-reporter') return 'field_reported'
  return 'field_reported'
}

function jitterCoordinates(base: { lat: number; lng: number }, id: string | number) {
  const n = Number(String(id).replace(/\D/g, '')) || 1
  const offset = ((n % 7) - 3) * 0.35
  return { lat: base.lat + offset * 0.15, lng: base.lng + offset * 0.2 }
}

function mapOrganization(org: unknown): AtlasOrganization | undefined {
  if (!org || typeof org === 'number') return undefined
  const o = org as Record<string, unknown>
  return {
    id: String(o.id),
    slug: String(o.slug || o.id),
    name: String(o.name || 'Organization'),
    type: String(o.type || 'ngo'),
    tagline: (o.tagline as string) || undefined,
    logoUrl: resolveMediaUrl(o.logo as never, ''),
    coverUrl: resolveMediaUrl(o.coverImage as never, ''),
    website: (o.website as string) || undefined,
    donationUrl: (o.donationUrl as string) || undefined,
    hqLocation: (o.hqLocation as string) || undefined,
    regions: (o.regions as string[]) || [],
    focusAreas: (o.focusAreas as string[]) || [],
    verified: Boolean(o.verified),
  }
}

export function mapSolutionFromCms(doc: {
  id: string | number
  slug: string
  title: string
  thesis?: string | null
  summary?: string | null
  body?: unknown
  location?: string | null
  country?: string | null
  replicationScope?: string | null
  locationName?: string | null
  statHighlight?: string | null
  keyImpact?: { label?: string | null; value?: string | null; unit?: string | null }[] | null
  heroImage?: unknown
  category?: unknown
  organization?: unknown
  sectors?: string[] | null
  solutionStatus?: string | null
  verificationTier?: string | null
  coordinates?: { lat?: number | null; lng?: number | null } | null
  partnerOrgs?: { name?: string | null }[] | null
  verifiedBy?: string | null
  fundingStatus?: string | null
  fundingNeed?: {
    amount?: string | null
    currency?: string | null
    timeline?: string | null
    useOfFunds?: string | null
  } | null
  gallery?: { image?: unknown; caption?: string | null }[] | null
  relatedStories?: unknown
  relatedStory?: unknown
  sdgTags?: string[] | null
  onePagerUrl?: string | null
  featured?: boolean | null
  publishedAt?: string | null
  verified?: boolean | null
}): AtlasProject {
  const categoryName = resolveCategoryName(doc.category as never)
  const region = doc.location?.trim() || 'East Africa'
  const baseCoords =
    doc.coordinates?.lat != null && doc.coordinates?.lng != null
      ? { lat: doc.coordinates.lat, lng: doc.coordinates.lng }
      : coordinatesForRegion(region)

  const verifiedBy: VerifiedBy | undefined =
    doc.verifiedBy === 'community-validated' || doc.verifiedBy === 'partner-confirmed'
      ? doc.verifiedBy
      : doc.verified === false
        ? undefined
        : 'field-reporter'

  const keyImpact: ImpactTile[] =
    doc.keyImpact
      ?.filter((t) => t.label && t.value)
      .map((t) => ({ label: t.label!, value: t.value!, unit: t.unit || undefined })) ?? []

  const relatedStorySlugs: string[] = []
  const pushStory = (s: unknown) => {
    if (s && typeof s === 'object' && 'slug' in s && s.slug) relatedStorySlugs.push(String(s.slug))
  }
  if (Array.isArray(doc.relatedStories)) doc.relatedStories.forEach(pushStory)
  pushStory(doc.relatedStory)

  const keyMetric =
    keyImpact[0]?.value ||
    doc.statHighlight ||
    (keyImpact.length ? `${keyImpact[0].value} ${keyImpact[0].label}` : 'Impact documented in the field')

  return {
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    thesis: doc.thesis || undefined,
    summary: doc.summary || '',
    body: doc.body,
    coverImageUrl: resolveEditorialUrl(doc.heroImage as never, `solution:${doc.slug}`),
    sectors: inferSectors(categoryName, doc.sectors),
    status: inferStatus(doc.slug, doc.solutionStatus),
    verificationTier: inferVerification(doc.verificationTier, doc.verifiedBy),
    verifiedBy,
    region,
    country: doc.country || undefined,
    locationName: doc.locationName || undefined,
    replicationScope: doc.replicationScope === 'global' ? 'global' : 'africa',
    coordinates: jitterCoordinates(baseCoords, doc.id),
    keyImpact,
    keyMetric,
    partnerOrgs: doc.partnerOrgs?.map((p) => p.name).filter((n): n is string => Boolean(n)),
    fundingStatus:
      doc.fundingStatus && VALID_FUNDING.has(doc.fundingStatus as FundingStatus)
        ? (doc.fundingStatus as FundingStatus)
        : 'seeking',
    fundingNeed: doc.fundingNeed
      ? {
          amount: doc.fundingNeed.amount || undefined,
          currency: doc.fundingNeed.currency || undefined,
          timeline: doc.fundingNeed.timeline || undefined,
          useOfFunds: doc.fundingNeed.useOfFunds || undefined,
        }
      : undefined,
    gallery:
      doc.gallery
        ?.map((g) => ({
          url: resolveMediaUrl(g.image as never, ''),
          caption: g.caption || undefined,
        }))
        .filter((g) => g.url) ?? [],
    organization: mapOrganization(doc.organization),
    relatedStorySlugs,
    sdgTags: doc.sdgTags || [],
    onePagerUrl: doc.onePagerUrl || undefined,
    featured: Boolean(doc.featured),
    publishedAt: doc.publishedAt || new Date().toISOString(),
  }
}
