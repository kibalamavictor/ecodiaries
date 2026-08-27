export type PodcastHost = {
  name: string
  role: string
  bio?: string
  avatar?: string
  socialLinks: { platform: string; url: string }[]
}

export type PodcastEpisode = {
  id: string
  slug: string
  num: number
  seasonNumber?: number
  title: string
  series: string
  seriesSlug?: string
  duration: string
  durationSeconds: number | null
  description: string
  featured: boolean
  embedUrl?: string | null
  audioUrl?: string
  thumbnail: string
  publishedAt?: string
  hosts: PodcastHost[]
}
