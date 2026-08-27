import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { StoryCard } from '@/components/cards/StoryCard'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { FilterPills } from '@/components/ui/FilterPills'
import { AnimatedCard } from '@/components/motion/AnimatedCard'
import { PageWrapper } from '@/components/motion/PageWrapper'
import { MobileStoriesArchive } from '@/components/mobile/MobileStoriesArchive'
import { MobilePageHero } from '@/components/mobile/MobilePageHero'
import { getCategories, getFeaturedStories, getLatestStories } from '@/lib/cms/stories'

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Browse every EcoDiaries climate story — news, field reports, investigations, and opinion from across Africa.',
}

type Props = { searchParams: Promise<{ category?: string; q?: string }> }

export default async function StoriesPage({ searchParams }: Props) {
  const { category, q } = await searchParams
  const isFiltered = Boolean(q?.trim() || (category && category !== 'all'))

  const [categories, desktopStories, mobileStories, featuredStories, latestStories] =
    await Promise.all([
      getCategories(),
      getLatestStories(24, category, q),
      getLatestStories(isFiltered ? 48 : 100, isFiltered ? category : undefined, isFiltered ? q : undefined),
      isFiltered ? Promise.resolve([]) : getFeaturedStories(12, false),
      isFiltered ? Promise.resolve([]) : getLatestStories(16),
    ])

  const filters = [
    { label: 'All', slug: 'all' },
    ...categories.map((c) => ({ label: c.name, slug: c.slug })),
  ]

  const categoryList = categories.map((c) => ({ name: c.name, slug: c.slug }))

  return (
    <PageWrapper>
      <div className="hidden md:block">
        <div className="page-head">
          <SiteNav variant="dark" activeLink="/stories" />
          <div className="wrap mt-32">
            <span className="eyebrow">All Stories</span>
            <div className="page-head-row mt-16">
              <h1>Every dispatch, field report, and essay — in one archive</h1>
            </div>
            <Suspense fallback={null}>
              <HeroSearch style={{ margin: '28px 0 0', maxWidth: 520 }} defaultValue={q} />
            </Suspense>
          </div>
        </div>

        <section className="section">
          <div className="wrap">
            <Suspense fallback={null}>
              <FilterPills filters={filters} />
            </Suspense>
            {q && (
              <p className="mt-16" style={{ color: 'var(--ink-soft)' }}>
                {desktopStories.length} result{desktopStories.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
              </p>
            )}
            <div className="card-grid post-grid">
              {desktopStories.map((story, index) => (
                <AnimatedCard key={story.slug} index={index}>
                  <StoryCard story={story} />
                </AnimatedCard>
              ))}
            </div>
            {desktopStories.length === 0 && (
              <p className="center mt-48" style={{ color: 'var(--ink-soft)' }}>
                No stories found. Try a different search or category.
              </p>
            )}
            {desktopStories.length >= 24 && (
              <div className="center mt-48">
                <button type="button" className="btn btn-outline">
                  Load more stories
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="md:hidden bg-paper">
        <MobilePageHero
          title="Every dispatch, field report, and essay — in one archive"
          activeLink="/stories"
          searchDefaultValue={q}
          searchAction="/stories"
          searchPlaceholder="Search stories, topics, or places…"
          searchSubmitButtonClassName="btn btn-outline btn-sm mobile-hero-search__submit"
          preserveSearchParams
        />
        <MobileStoriesArchive
          filters={filters}
          categories={categoryList}
          stories={mobileStories}
          featuredStories={featuredStories}
          latestStories={latestStories}
          searchQuery={q}
          activeCategory={category}
        />
      </div>

      <NewsletterBanner />
      <SiteFooter />
    </PageWrapper>
  )
}
