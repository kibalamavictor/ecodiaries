import type { PodcastEpisode, PodcastHost } from '@/lib/cms/podcast-types'

export type PodcastSeriesListItem = {
  slug: string
  title: string
  description: string
  hook: string
  coverImage: string
  episodeCount: number
  hosts: PodcastHost[]
}

export type PodcastSeriesDetail = PodcastSeriesListItem & {
  episodes: PodcastEpisode[]
}
