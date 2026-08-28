import type { Metadata } from 'next'
import { MagAllPosts } from '@/components/magazine/MagAllPosts'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { PageWrapper } from '@/components/motion/PageWrapper'
import { getLatestStories } from '@/lib/cms/stories'
import { byline, formatMagDate, uniquifyMagCards } from '@/lib/magazine'
import { environmentImageForKey } from '@/lib/unsplash-environment'

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Browse every EcoDiaries climate story — news, field reports, investigations, and opinion from across Africa.',
}

type Props = { searchParams: Promise<{ category?: string; q?: string }> }

export default async function StoriesPage({ searchParams }: Props) {
  const { category, q } = await searchParams
  const stories = await getLatestStories(24, category, q)
  const cards = uniquifyMagCards(
    stories.map((story) => ({
      href: `/stories/${story.slug}`,
      image: story.image,
      category: story.category,
      title: story.title,
      excerpt: story.excerpt,
      byline: byline(story.author?.name, formatMagDate(story.publishedAt)),
      authorName: story.author?.name,
      avatar: story.author?.avatar,
    })),
  )

  return (
    <PageWrapper>
      <MagPageShell>
        <MagAllPosts
          items={cards}
          trending={cards.slice(0, 4)}
          query={q}
        />
        <MagNewsletter image={stories[0]?.image || environmentImageForKey('stories-newsletter')} />
      </MagPageShell>
    </PageWrapper>
  )
}
