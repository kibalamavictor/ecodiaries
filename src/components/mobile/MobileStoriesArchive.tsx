import { Suspense } from 'react'
import { FilterPills } from '@/components/ui/FilterPills'
import { MobileStoriesCategoryRow } from '@/components/mobile/MobileStoriesCategoryRow'
import type { StoryPreview } from '@/lib/types'

type StoryCategory = {
  name: string
  slug: string
}

type StorySection = {
  key: string
  title: string
  stories: StoryPreview[]
  layout?: 'single' | 'double'
}

type MobileStoriesArchiveProps = {
  filters: { label: string; slug: string }[]
  categories: StoryCategory[]
  stories: StoryPreview[]
  featuredStories?: StoryPreview[]
  latestStories?: StoryPreview[]
  searchQuery?: string
  activeCategory?: string
}

function groupStoriesByCategory(stories: StoryPreview[], categories: StoryCategory[]) {
  return categories
    .map((category) => ({
      ...category,
      stories: stories.filter(
        (story) =>
          story.categorySlug === category.slug ||
          story.category.toLowerCase() === category.name.toLowerCase(),
      ),
    }))
    .filter((group) => group.stories.length > 0)
}

function buildBrowseSections(
  featuredStories: StoryPreview[],
  latestStories: StoryPreview[],
  stories: StoryPreview[],
  categories: StoryCategory[],
): StorySection[] {
  const featuredSlugs = new Set(featuredStories.map((story) => story.slug))
  const latest = latestStories.filter((story) => !featuredSlugs.has(story.slug))
  const usedSlugs = new Set([...featuredSlugs, ...latest.map((story) => story.slug)])

  const sections: StorySection[] = []

  if (featuredStories.length > 0) {
    sections.push({ key: 'featured', title: 'Featured', stories: featuredStories, layout: 'single' })
  }

  if (latest.length > 0) {
    sections.push({ key: 'latest', title: 'Latest', stories: latest, layout: 'single' })
  }

  for (const group of groupStoriesByCategory(
    stories.filter((story) => !usedSlugs.has(story.slug)),
    categories,
  )) {
    sections.push({
      key: `category-${group.slug}`,
      title: group.name,
      stories: group.stories,
      layout: 'double',
    })
  }

  return sections
}

export function MobileStoriesArchive({
  filters,
  categories,
  stories,
  featuredStories = [],
  latestStories = [],
  searchQuery,
  activeCategory,
}: MobileStoriesArchiveProps) {
  const isSearch = Boolean(searchQuery?.trim())
  const isCategoryFilter = Boolean(activeCategory && activeCategory !== 'all')

  let sections: StorySection[]

  if (isSearch) {
    sections = [{ key: 'search', title: `Results for “${searchQuery}”`, stories }]
  } else if (isCategoryFilter) {
    const category = categories.find((item) => item.slug === activeCategory)
    sections = [{ key: `filter-${activeCategory}`, title: category?.name ?? 'Stories', stories }]
  } else {
    sections = buildBrowseSections(featuredStories, latestStories, stories, categories)
  }

  return (
    <div className="mobile-stories-page">
      <section className="mobile-stories-page__body">
        <Suspense fallback={null}>
          <div className="mobile-stories-page__filters">
            <FilterPills filters={filters} />
          </div>
        </Suspense>

        {sections.length === 0 ? (
          <p className="mobile-stories-page__empty">
            No stories found. Try a different search or category.
          </p>
        ) : (
          sections.map((section) => (
            <MobileStoriesCategoryRow
              key={section.key}
              title={section.title}
              stories={section.stories}
              layout={section.layout}
            />
          ))
        )}
      </section>
    </div>
  )
}
