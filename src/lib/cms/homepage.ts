import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { CMS_REVALIDATE_SECONDS } from '@/lib/cms/cache-config'
import { getProgrammes } from '@/lib/cms/community'
import { getEpisodes } from '@/lib/cms/podcasts'
import { getAtlasProjects } from '@/lib/cms/solutions-page'
import { getFeaturedStories, getLatestStories } from '@/lib/cms/stories'
import { getVideos } from '@/lib/cms/videos'
import type { StoryPreview } from '@/lib/types'
import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import type { WatchVideoItem } from '@/lib/cms/video-types'
import type { ProgrammePreview } from '@/lib/types'
import type { AtlasProject } from '@/lib/solutions/types'

export type HomepageCounts = {
  storiesCount: number
  episodesCount: number
  videosCount: number
  programmesCount: number
  solutionsCount: number
}

export type HomepageMobileData = {
  featuredStories: StoryPreview[]
  latestStories: StoryPreview[]
  latestEpisodes: PodcastEpisode[]
  latestVideos: WatchVideoItem[]
  programmes: ProgrammePreview[]
  solutions: AtlasProject[]
  counts: HomepageCounts
}

const countFloors: HomepageCounts = {
  storiesCount: 100,
  episodesCount: 50,
  videosCount: 50,
  programmesCount: 6,
  solutionsCount: 50,
}

async function fetchCounts(): Promise<HomepageCounts> {
  try {
    const payload = await getPayloadClient()
    const [stories, episodes, videos, programmes, solutions] = await Promise.all([
      payload.count({
        collection: 'stories',
        where: { status: { equals: 'published' } },
      }),
      payload.count({ collection: 'podcast-episodes' }),
      payload.count({ collection: 'videos' }),
      payload.count({ collection: 'programmes' }),
      payload.count({
        collection: 'solutions',
        where: { published: { equals: true } },
      }),
    ])
    return {
      storiesCount: Math.max(stories.totalDocs, countFloors.storiesCount),
      episodesCount: Math.max(episodes.totalDocs, countFloors.episodesCount),
      videosCount: Math.max(videos.totalDocs, countFloors.videosCount),
      programmesCount: Math.max(programmes.totalDocs, countFloors.programmesCount),
      solutionsCount: Math.max(solutions.totalDocs, countFloors.solutionsCount),
    }
  } catch {
    return countFloors
  }
}

async function fetchHomepageMobileData(): Promise<HomepageMobileData> {
  const [
    featuredStories,
    latestStories,
    latestEpisodes,
    allVideos,
    allProgrammes,
    allSolutions,
    counts,
  ] = await Promise.all([
    getFeaturedStories(4),
    getLatestStories(8),
    getEpisodes(8),
    getVideos(),
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
    latestEpisodes,
    latestVideos: allVideos.slice(0, 8),
    programmes,
    solutions: allSolutions.slice(0, 8),
    counts,
  }
}

export type HomepageEpisodeTile = {
  slug: string
  title: string
  meta: string
  bgClass: string
}

export type HomepagePageData = HomepageMobileData & {
  featured: StoryPreview | null
  latestDesktop: StoryPreview[]
  episodesDesktop: HomepageEpisodeTile[]
  moreNews: StoryPreview[]
}

const episodeBgClasses = ['bg-magenta', 'bg-forest', 'bg-teal'] as const

async function fetchHomepagePageData(): Promise<HomepagePageData> {
  const mobile = await fetchHomepageMobileData()
  const featured = mobile.featuredStories[0] ?? mobile.latestStories[0] ?? null
  return {
    ...mobile,
    featured,
    latestDesktop: mobile.latestStories.slice(0, 3),
    episodesDesktop: mobile.latestEpisodes.slice(0, 3).map((ep, i) => ({
      slug: ep.slug,
      title: ep.title,
      meta: `EP. ${ep.num} · ${ep.duration}`,
      bgClass: episodeBgClasses[i % episodeBgClasses.length],
    })),
    moreNews: mobile.latestStories.slice(0, 8),
  }
}

export function getHomepagePageData() {
  return unstable_cache(fetchHomepagePageData, ['homepage-page'], {
    tags: [
      CACHE_TAGS.homepage,
      CACHE_TAGS.stories,
      CACHE_TAGS.podcasts,
      CACHE_TAGS.videos,
      CACHE_TAGS.programmes,
      CACHE_TAGS.solutions,
    ],
    revalidate: CMS_REVALIDATE_SECONDS,
  })()
}

export function getHomepageMobileData() {
  return unstable_cache(fetchHomepageMobileData, ['homepage-mobile'], {
    tags: [CACHE_TAGS.homepage, CACHE_TAGS.stories, CACHE_TAGS.podcasts, CACHE_TAGS.videos, CACHE_TAGS.programmes, CACHE_TAGS.solutions],
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
