export type Sector =
  | 'agriculture'
  | 'energy'
  | 'water'
  | 'biodiversity'
  | 'pollution'
  | 'climate-justice'

export type SolutionStatus = 'piloted' | 'scaling' | 'established'

export type VerificationTier = 'self_reported' | 'field_reported' | 'independently_verified'

export type FundingStatus = 'seeking' | 'partial' | 'funded' | 'not_seeking'

export type VerifiedBy = 'field-reporter' | 'community-validated' | 'partner-confirmed'

export type ImpactTile = { label: string; value: string; unit?: string }

export type AtlasOrganization = {
  id: string
  slug: string
  name: string
  type: string
  tagline?: string
  logoUrl?: string
  coverUrl?: string
  website?: string
  donationUrl?: string
  hqLocation?: string
  regions: string[]
  focusAreas: string[]
  verified: boolean
}

export interface AtlasProject {
  id: string
  slug: string
  title: string
  thesis?: string
  summary: string
  body: unknown
  coverImageUrl: string
  sectors: Sector[]
  status: SolutionStatus
  verificationTier: VerificationTier
  verifiedBy?: VerifiedBy
  region: string
  country?: string
  locationName?: string
  replicationScope?: 'africa' | 'global'
  coordinates: { lat: number; lng: number }
  keyImpact: ImpactTile[]
  keyMetric: string
  partnerOrgs?: string[]
  fundingStatus: FundingStatus
  fundingNeed?: {
    amount?: string
    currency?: string
    timeline?: string
    useOfFunds?: string
  }
  gallery: { url: string; caption?: string }[]
  organization?: AtlasOrganization
  relatedStorySlugs: string[]
  sdgTags: string[]
  onePagerUrl?: string
  featured: boolean
  publishedAt: string
}

/** @deprecated Use AtlasProject */
export type Solution = AtlasProject

export const SECTOR_FILTER_OPTIONS: { label: string; value: Sector | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Energy', value: 'energy' },
  { label: 'Water', value: 'water' },
  { label: 'Biodiversity', value: 'biodiversity' },
  { label: 'Pollution', value: 'pollution' },
  { label: 'Climate Justice', value: 'climate-justice' },
]

export const STATUS_FILTER_OPTIONS: { label: string; value: SolutionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Piloted', value: 'piloted' },
  { label: 'Scaling', value: 'scaling' },
  { label: 'Established', value: 'established' },
]

export const VERIFICATION_FILTER_OPTIONS: { label: string; value: VerificationTier | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Field reported', value: 'field_reported' },
  { label: 'Independently verified', value: 'independently_verified' },
  { label: 'Self reported', value: 'self_reported' },
]

export const FUNDING_FILTER_OPTIONS: { label: string; value: FundingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Seeking funding', value: 'seeking' },
  { label: 'Partially funded', value: 'partial' },
  { label: 'Fully funded', value: 'funded' },
]

export const SECTOR_COLORS: Record<Sector, string> = {
  agriculture: '#4A7C3F',
  energy: '#0B3E1F',
  water: '#2C6A62',
  biodiversity: '#1F5C32',
  pollution: '#5C6457',
  'climate-justice': '#143D2A',
}

export const SECTOR_LABELS: Record<Sector, string> = {
  agriculture: 'Agriculture',
  energy: 'Energy',
  water: 'Water',
  biodiversity: 'Biodiversity',
  pollution: 'Pollution',
  'climate-justice': 'Climate Justice',
}

export const STATUS_LABELS: Record<SolutionStatus, string> = {
  piloted: 'Piloted',
  scaling: 'Scaling',
  established: 'Established',
}

export const VERIFICATION_LABELS: Record<VerificationTier, string> = {
  self_reported: 'Self reported',
  field_reported: 'Field reported',
  independently_verified: 'Independently verified',
}

export const FUNDING_LABELS: Record<FundingStatus, string> = {
  seeking: 'Seeking funding',
  partial: 'Partially funded',
  funded: 'Fully funded',
  not_seeking: 'Not seeking',
}

export function projectsToGeoJSON(projects: AtlasProject[]) {
  return {
    type: 'FeatureCollection' as const,
    features: projects.map((p) => ({
      type: 'Feature' as const,
      id: p.id,
      properties: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        sector: p.sectors[0] || 'climate-justice',
        status: p.status,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [p.coordinates.lng, p.coordinates.lat],
      },
    })),
  }
}
