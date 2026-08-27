export type ContentStatus = 'draft' | 'published' | 'archived' | 'in-review'

export type CategoryAccent = 'maroon' | 'magenta' | 'gold' | 'lime' | 'teal' | 'forest'

export type AdminStory = {
  id: string
  title: string
  slug: string
  category: string
  categoryAccent: CategoryAccent
  status: ContentStatus
  author: string
  authorAvatar?: string
  excerpt: string
  updatedAt: string
  publishedAt?: string
  reads: number
  imageUrl?: string
  heroImageId?: number | null
}

export type DashboardStat = {
  id: string
  label: string
  value: number
  tone: 'green' | 'yellow' | 'blue' | 'red' | 'purple' | 'teal'
}

export type ChartMonthPoint = {
  month: string
  stories: number
  solutions: number
}

export type ContentBreakdownSegment = {
  label: string
  value: number
  color: string
}

export type RecentStoryRow = {
  id: string
  title: string
  category: string
  status: ContentStatus
  updatedAt: string
  imageUrl?: string
}

export type RecentContactRow = {
  id: string
  name: string
  subject: string
  timestamp: string
  unread: boolean
}

export type TopContributorRow = {
  id: string
  name: string
  role: string
  storiesCount: number
  avatar?: string
}

export type DashboardActivityRow = {
  id: string
  title: string
  author: string
  authorAvatar?: string
  category: string
  status: ContentStatus
  updatedAt: string
  imageUrl?: string
}

export type StudioSearchResult = {
  id: string
  type: 'story' | 'contributor' | 'contact'
  title: string
  subtitle: string
  href: string
}
