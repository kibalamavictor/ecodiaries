export type ContributorCategory =
  | 'writer'
  | 'photographer'
  | 'filmmaker'
  | 'researcher'
  | 'poet'
  | 'other'

export interface Contributor {
  id: string
  name: string
  avatarUrl: string | null
  categories: ContributorCategory[]
  primaryRole: string
  bio: string
  region?: string
  links?: {
    instagram?: string
    twitter?: string
    website?: string
    email?: string
  }
  featured?: boolean
}

export const CONTRIBUTOR_FILTER_OPTIONS: { label: string; value: ContributorCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Writers', value: 'writer' },
  { label: 'Photographers', value: 'photographer' },
  { label: 'Filmmakers', value: 'filmmaker' },
  { label: 'Researchers', value: 'researcher' },
  { label: 'Poets', value: 'poet' },
  { label: 'Others', value: 'other' },
]

export const CATEGORY_QUERY_MAP: Record<string, ContributorCategory | 'all'> = {
  all: 'all',
  writers: 'writer',
  writer: 'writer',
  photographers: 'photographer',
  photographer: 'photographer',
  filmmakers: 'filmmaker',
  filmmaker: 'filmmaker',
  researchers: 'researcher',
  researcher: 'researcher',
  poets: 'poet',
  poet: 'poet',
  others: 'other',
  other: 'other',
}

export const QUERY_FROM_CATEGORY: Record<ContributorCategory | 'all', string> = {
  all: 'all',
  writer: 'writers',
  photographer: 'photographers',
  filmmaker: 'filmmakers',
  researcher: 'researchers',
  poet: 'poets',
  other: 'others',
}

export type ContributionDetails =
  | { type: 'writer'; writingSamples: string[]; preferredTopics: string[] }
  | { type: 'photographer'; portfolioUrl: string; equipment?: string }
  | { type: 'filmmaker'; showreelUrl: string; pastWork?: string }
  | { type: 'researcher'; fieldOfExpertise: string; institution?: string; publications?: string[] }
  | { type: 'poet'; poetrySamples: string[]; themes?: string }
  | { type: 'other'; description: string }

export interface ContributorApplication {
  basicInfo: {
    name: string
    email: string
    region: string
    bio: string
  }
  contributionTypes: ContributorCategory[]
  details: ContributionDetails[]
  photo: {
    file: File | null
    croppedPreviewUrl: string | null
  }
}

export type ContributorApplicationPhoto = ContributorApplication['photo']
