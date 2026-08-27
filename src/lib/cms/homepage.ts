import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { CMS_REVALIDATE_SECONDS } from '@/lib/cms/cache-config'
import { getProgrammes } from '@/lib/cms/community'
import { getAtlasProjects } from '@/lib/cms/solutions-page'
import { getFeaturedStories, getLatestStories } from '@/lib/cms/stories'
import type { StoryPreview } from '@/lib/types'
import type { ProgrammePreview } from '@/lib/types'
import type { AtlasProject } from '@/lib/solutions/types'

export type HomepageCounts = {
  storiesCount: number
  programmesCount: number
  solutionsCount: number
}

export type HomepageMobileData = {
  featuredStories: StoryPreview[]
  latestStories: StoryPreview[]
  programmes: ProgrammePreview[]
  solutions: AtlasProject[]
  counts: HomepageCounts
}

const countFloors: HomepageCounts = {
  storiesCount: 100,
  programmesCount: 6,
  solutionsCount: 50,
}

async function fetchCounts(): Promise<HomepageCounts> {
  try {
    const payload = await getPayloadClient()
    const [stories, programmes, solutions] = await Promise.all([
      payload.count({
        collection: 'stories',
        where: { status: { equals: 'published' } },
      }),
      payload.count({ collection: 'programmes' }),
      payload.count({
        collection: 'solutions',
        where: { published: { equals: true } },
      }),
    ])
    return {
      storiesCount: Math.max(stories.totalDocs, countFloors.storiesCount),
      programmesCount: Math.max(programmes.totalDocs, countFloors.programmesCount),
      solutionsCount: Math.max(solutions.totalDocs, countFloors.solutionsCount),
    }
  } catch {
    return countFloors
  }
}

async function fetchHomepageMobileData(): Promise<HomepageMobileData> {
  const [featuredStories, latestStories, allProgrammes, allSolutions, counts] = await Promise.all([
    getFeaturedStories(4),
    getLatestStories(8),
    getProgrammes(),
    getAtlasProjects(),
    fetchCounts(),
  ])

  const programmes = [...allProgrammes]
    .sort((a, b) => {
      const aOpen = a.status === 'open' ? 0 : 1
      const bOpen = b.status === 'open' ? 0 : 1
      return aOpen - bOpen
    })
    .slice(0, 8)

  return {
    featuredStories,
    latestStories,
    programmes,
    solutions: allSolutions.slice(0, 8),
    counts,
  }
}

export type HomepagePageData = HomepageMobileData & {
  featured: StoryPreview | null
  latestDesktop: StoryPreview[]
  moreNews: StoryPreview[]
}

async function fetchHomepagePageData(): Promise<HomepagePageData> {
  const mobile = await fetchHomepageMobileData()
  const featured = mobile.featuredStories[0] ?? mobile.latestStories[0] ?? null
  return {
    ...mobile,
    featured,
    latestDesktop: mobile.latestStories.slice(0, 3),
    moreNews: mobile.latestStories.slice(0, 8),
  }
}

export function getHomepagePageData() {
  return unstable_cache(fetchHomepagePageData, ['homepage-page'], {
    tags: [
      CACHE_TAGS.homepage,
      CACHE_TAGS.stories,
      CACHE_TAGS.programmes,
      CACHE_TAGS.solutions,
    ],
    revalidate: CMS_REVALIDATE_SECONDS,
  })()
}

export function getHomepageMobileData() {
  return unstable_cache(fetchHomepageMobileData, ['homepage-mobile'], {
    tags: [CACHE_TAGS.homepage, CACHE_TAGS.stories, CACHE_TAGS.programmes, CACHE_TAGS.solutions],
    revalidate: CMS_REVALIDATE_SECONDS,
  })()
}

export function collageImages(urls: (string | undefined)[], min = 4): string[] {
  const valid = urls.filter((u): u is string => Boolean(u))
  if (!valid.length) return []
  const out: string[] = []
  for (let i = 0; i < min; i++) {
    out.push(valid[i % valid.length])
  }
  return out
}
