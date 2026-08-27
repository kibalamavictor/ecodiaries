import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { FilterPills } from '@/components/ui/FilterPills'
import { MagCard } from '@/components/magazine/MagCard'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { PageWrapper } from '@/components/motion/PageWrapper'
import { getCategories, getLatestStories } from '@/lib/cms/stories'
import { byline, formatMagDate } from '@/lib/magazine'

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Browse every EcoDiaries climate story — news, field reports, investigations, and opinion from across Africa.',
}

type Props = { searchParams: Promise<{ category?: string; q?: string }> }

export default async function StoriesPage({ searchParams }: Props) {
  const { category, q } = await searchParams

  const [categories, stories] = await Promise.all([
    getCategories(),
    getLatestStories(24, category, q),
  ])

  const filters = [
    { label: 'All', slug: 'all' },
    ...categories.map((c) => ({ label: c.name, slug: c.slug })),
  ]

  return (
    <PageWrapper>
      <SiteNav activeLink="/stories" />
      <main className="magazine">
        <div className="mag-section" style={{ paddingTop: 12 }}>
          <MagPageIntro
            eyebrow="Stories"
            title="Every dispatch, field report, and essay"
            lede="Climate journalism from farms, forests, coasts, and cities — the people and places responding across Africa."
          >
            <Suspense fallback={null}>
              <HeroSearch style={{ margin: '8px 0 24px', maxWidth: 520 }} defaultValue={q} />
            </Suspense>
            <Suspense fallback={null}>
              <FilterPills filters={filters} />
            </Suspense>
            {q ? (
              <p className="mag-meta" style={{ marginTop: 16 }}>
                {stories.length} result{stories.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
              </p>
            ) : null}
          </MagPageIntro>
          <div className="mag-wrap">
            <div className="mag-latest__grid" style={{ marginTop: 32 }}>
              {stories.map((story) => (
                <MagCard
                  key={story.slug}
                  item={{
                    href: `/stories/${story.slug}`,
                    image: story.image,
                    category: story.category,
                    title: story.title,
                    excerpt: story.excerpt,
                    byline: byline(story.author?.name, formatMagDate(story.publishedAt)),
                  }}
                />
              ))}
            </div>
            {stories.length === 0 ? (
              <p className="mag-excerpt" style={{ marginTop: 48 }}>
                No stories found. Try a different search or category.
              </p>
            ) : null}
          </div>
        </div>
      </main>
      <NewsletterBanner />
      <SiteFooter />
    </PageWrapper>
  )
}
