import type { CategoryAccent, ContentStatus } from '@/lib/studio/types'

export const categoryAccentMap: Record<string, CategoryAccent> = {
  'Climate Change': 'forest',
  Water: 'teal',
  Agriculture: 'gold',
  Biodiversity: 'teal',
  Pollution: 'magenta',
  'Renewable Energy': 'gold',
  'Climate Justice': 'maroon',
  'Youth Voices': 'lime',
  Conservation: 'forest',
  Sustainability: 'lime',
  Opinion: 'maroon',
  'Community Stories': 'teal',
}

export const statusConfig: Record<ContentStatus, { label: string; className: string; dotClassName: string }> = {
  published: {
    label: 'Published',
    className: 'bg-green-100 text-green-700',
    dotClassName: 'bg-green-600',
  },
  draft: {
    label: 'Draft',
    className: 'bg-yellow-100 text-yellow-700',
    dotClassName: 'bg-yellow-500',
  },
  'in-review': {
    label: 'In Review',
    className: 'bg-blue-100 text-blue-700',
    dotClassName: 'bg-blue-500',
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-600',
    dotClassName: 'bg-gray-400',
  },
}

export const storyStatuses: ContentStatus[] = ['draft', 'in-review', 'published', 'archived']
