import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import type {
  ChartMonthPoint,
  ContentBreakdownSegment,
  DashboardActivityRow,
  DashboardStat,
  RecentContactRow,
  RecentStoryRow,
  TopContributorRow,
} from '@/lib/studio/types'
import type { ContentStatus } from '@/lib/studio/types'

async function countCollection(
  collection:
    | 'stories'
    | 'contributors'
    | 'solutions'
    | 'contact-submissions'
    | 'programmes'
    | 'videos'
    | 'podcast-episodes',
  where?: Where,
) {
  const payload = await getPayloadClient()
  const result = await payload.count({
    collection,
    ...(where ? { where } : {}),
  })
  return result.totalDocs
}

function mediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  if ('url' in value && typeof (value as { url?: string }).url === 'string') {
    return (value as { url: string }).url
  }
  return undefined
}

function mapStoryStatus(status?: string | null): ContentStatus {
  if (status === 'published' || status === 'draft' || status === 'in-review') return status
  return 'draft'
}

function monthKey(date: Date) {
  return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
}

function lastSixMonthLabels() {
  const labels: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(monthKey(d))
  }
  return labels
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const [publishedStories, draftStories, contributors, solutions, unreadMessages, programmes] =
    await Promise.all([
      countCollection('stories', { status: { equals: 'published' } }),
      countCollection('stories', { status: { equals: 'draft' } }),
      countCollection('contributors', { applicationStatus: { equals: 'approved' } }),
      countCollection('solutions'),
      countCollection('contact-submissions', { status: { equals: 'new' } }),
      countCollection('programmes'),
    ])

  return [
    { id: 'published-stories', label: 'Published Stories', value: publishedStories, tone: 'green' },
    { id: 'draft-stories', label: 'Draft Stories', value: draftStories, tone: 'yellow' },
    { id: 'contributors', label: 'Contributors', value: contributors, tone: 'blue' },
    { id: 'solutions', label: 'Solutions', value: solutions, tone: 'purple' },
    { id: 'unread-messages', label: 'Unread Messages', value: unreadMessages, tone: 'red' },
    { id: 'programmes', label: 'Programmes', value: programmes, tone: 'teal' },
  ]
}

export async function getContentPublishedChart(): Promise<{
  points: ChartMonthPoint[]
  storiesThisMonth: number
  solutionsThisMonth: number
}> {
  const payload = await getPayloadClient()
  const start = new Date()
  start.setMonth(start.getMonth() - 5)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)

  const [stories, solutions] = await Promise.all([
    payload.find({
      collection: 'stories',
      where: {
        and: [{ status: { equals: 'published' } }, { createdAt: { greater_than_equal: start.toISOString() } }],
      },
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'solutions',
      where: { createdAt: { greater_than_equal: start.toISOString() } },
      limit: 500,
      depth: 0,
    }),
  ])

  const labels = lastSixMonthLabels()
  const bucket = new Map(labels.map((l) => [l, { stories: 0, solutions: 0 }]))

  for (const doc of stories.docs) {
    const key = monthKey(new Date(doc.createdAt))
    const row = bucket.get(key)
    if (row) row.stories += 1
  }
  for (const doc of solutions.docs) {
    const key = monthKey(new Date(doc.createdAt))
    const row = bucket.get(key)
    if (row) row.solutions += 1
  }

  const nowKey = monthKey(new Date())
  const current = bucket.get(nowKey) ?? { stories: 0, solutions: 0 }

  return {
    points: labels.map((month) => ({ month, ...(bucket.get(month) ?? { stories: 0, solutions: 0 }) })),
    storiesThisMonth: current.stories,
    solutionsThisMonth: current.solutions,
  }
}

export async function getContentBreakdown(): Promise<ContentBreakdownSegment[]> {
  const [stories, solutions, videos, episodes, programmes] = await Promise.all([
    countCollection('stories'),
    countCollection('solutions'),
    countCollection('videos'),
    countCollection('podcast-episodes'),
    countCollection('programmes'),
  ])

  return [
    { label: 'Stories', value: stories, color: '#4caf50' },
    { label: 'Solutions', value: solutions, color: '#1a3a2a' },
    { label: 'Watch', value: videos, color: '#3b82f6' },
    { label: 'Listen', value: episodes, color: '#c51353' },
    { label: 'Programmes', value: programmes, color: '#14b8a6' },
  ]
}

export async function getRecentStories(): Promise<RecentStoryRow[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stories',
    sort: '-updatedAt',
    limit: 5,
    depth: 2,
  })

  return result.docs.map((s) => ({
    id: String(s.id),
    title: s.title,
    category:
      typeof s.category === 'object' && s.category && 'name' in s.category ? String(s.category.name) : '—',
    status: mapStoryStatus(s.status),
    updatedAt: s.updatedAt,
    imageUrl: mediaUrl(s.heroImage),
  }))
}

export async function getRecentContacts(): Promise<RecentContactRow[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'contact-submissions',
    sort: '-createdAt',
    limit: 5,
    depth: 0,
  })

  return result.docs.map((c) => ({
    id: String(c.id),
    name: c.name,
    subject: c.reason?.replace(/-/g, ' ') ?? 'Contact message',
    timestamp: c.createdAt,
    unread: c.status === 'new',
  }))
}

export async function getTopContributors(): Promise<TopContributorRow[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'contributors',
    where: { applicationStatus: { equals: 'approved' } },
    sort: '-updatedAt',
    limit: 5,
    depth: 0,
  })

  return result.docs.map((c) => ({
    id: String(c.id),
    name: c.name,
    role: c.role || 'Contributor',
    storiesCount: 0,
    avatar: undefined,
  }))
}

export async function getDashboardActivityTable(): Promise<DashboardActivityRow[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stories',
    sort: '-updatedAt',
    limit: 10,
    depth: 2,
  })

  return result.docs.map((s) => ({
    id: String(s.id),
    title: s.title,
    author:
      typeof s.author === 'object' && s.author && 'name' in s.author ? String(s.author.name) : '—',
    authorAvatar:
      typeof s.author === 'object' && s.author && 'avatar' in s.author
        ? mediaUrl((s.author as { avatar?: unknown }).avatar)
        : undefined,
    category:
      typeof s.category === 'object' && s.category && 'name' in s.category ? String(s.category.name) : '—',
    status: mapStoryStatus(s.status),
    updatedAt: s.updatedAt,
    imageUrl: mediaUrl(s.heroImage),
  }))
}

