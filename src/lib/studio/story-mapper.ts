import type { Story } from '@/payload-types'
import type { AdminStory, CategoryAccent, ContentStatus } from '@/lib/studio/types'
import { categoryAccentMap } from '@/lib/studio/status'

function mediaMeta(value: unknown): { url?: string; id?: number } {
  if (!value || typeof value !== 'object') return {}
  const doc = value as { url?: string; id?: number }
  return { url: doc.url, id: doc.id }
}

export function mapStoryToAdmin(story: Story): AdminStory {
  const category =
    typeof story.category === 'object' && story.category && 'name' in story.category
      ? story.category.name
      : 'Uncategorized'
  const author =
    typeof story.author === 'object' && story.author && 'name' in story.author
      ? story.author.name
      : '—'

  const statusMap: Record<string, ContentStatus> = {
    draft: 'draft',
    'in-review': 'in-review',
    published: 'published',
  }

  return {
    id: String(story.id),
    title: story.title,
    slug: story.slug,
    category,
    categoryAccent: (categoryAccentMap[category] || 'forest') as CategoryAccent,
    status: statusMap[story.status || 'draft'] || 'draft',
    author,
    excerpt: story.excerpt || '',
    updatedAt: story.updatedAt,
    publishedAt: story.publishedAt || undefined,
    reads: 0,
    imageUrl: mediaMeta(story.heroImage).url,
    heroImageId: mediaMeta(story.heroImage).id ?? null,
  }
}
