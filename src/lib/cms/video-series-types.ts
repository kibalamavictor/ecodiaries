import type { WatchVideoItem } from '@/lib/cms/video-types'

export type VideoSeriesListItem = {
  slug: string
  title: string
  description: string
  coverImage: string
  episodeCount: number
}

export type VideoSeriesDetail = VideoSeriesListItem & {
  episodes: WatchVideoItem[]
}
