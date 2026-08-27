export type AuthorPreview = {
  name: string
  role: string
  avatar: string
}

export type StoryPreview = {
  slug: string
  title: string
  excerpt?: string
  category: string
  categorySlug?: string
  image: string
  author?: AuthorPreview
  readTime?: string
  featured?: boolean
}

export type SolutionPreview = {
  slug: string
  category: string
  title: string
  description: string
  stat: string
  image?: string
  verified?: boolean
}

export type VideoPreview = {
  slug: string
  type: string
  title: string
  duration: string
  image?: string
  featured?: boolean
}

export type EpisodePreview = {
  slug: string
  num: number
  title: string
  series: string
  duration: string
}

export type ProgrammePreview = {
  slug: string
  eyebrow: string
  title: string
  description: string
  bgClass: string
  status?: 'open' | 'closed'
}

export type ContributorPreview = {
  slug: string
  name: string
  role: string
  bio: string
  avatar: string
}

export type AudioTilePreview = {
  meta: string
  title: string
  bgClass: string
}
