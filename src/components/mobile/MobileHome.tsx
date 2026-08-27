import { Suspense } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { FilterPills } from '@/components/ui/FilterPills'
import { MobilePageHero } from '@/components/mobile/MobilePageHero'
import { MobileFeaturedStory } from '@/components/mobile/MobileFeaturedStory'
import { MobileVoicesBand } from '@/components/mobile/MobileVoicesBand'
import { MobileHomeSection } from '@/components/mobile/MobileHomeSection'
import { MobileScrollRow } from '@/components/mobile/MobileScrollRow'
import { MobileProgrammeCard } from '@/components/mobile/MobileProgrammeCard'
import { MobileStoryCard } from '@/components/mobile/MobileStoryCard'
import { MobileSolutionCard } from '@/components/mobile/MobileSolutionCard'
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav'
import { MobileSolutionsAtlasSubmitCta } from '@/components/mobile/MobileSolutionsAtlasSubmitCta'
import {
  MOBILE_COLLAGE_END,
  MOBILE_COLLAGE_START,
  MOBILE_VISIBLE_CARDS,
} from '@/components/mobile/mobile-dimensions'
import { collageImages, type HomepageMobileData } from '@/lib/cms/homepage'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import type { SolutionStatus } from '@/lib/solutions/types'
import '@/app/(frontend)/mobile-home.css'

const homeFilters = [
  { label: 'All', slug: 'all' },
  { label: 'Climate', slug: 'climate-change' },
  { label: 'Water', slug: 'water' },
  { label: 'Biodiversity', slug: 'biodiversity' },
  { label: 'Pollution', slug: 'pollution' },
  { label: 'Agriculture', slug: 'agriculture' },
  { label: 'Energy', slug: 'renewable-energy' },
  { label: 'Opinion', slug: 'opinion' },
]

function formatSolutionStatus(status: SolutionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

type MobileHomeProps = {
  data: HomepageMobileData
}

export function MobileHome({ data }: MobileHomeProps) {
  const {
    featuredStories,
    latestStories,
    programmes,
    solutions,
    counts,
  } = data

  const storyCollage = collageImages(
    latestStories.slice(MOBILE_COLLAGE_START, MOBILE_COLLAGE_END).map((s) => s.image),
  )
  const programmeCollage = collageImages(
    programmes
      .slice(MOBILE_COLLAGE_START, MOBILE_COLLAGE_END)
      .map((p) => getProgrammeImageUrl(p.slug, 272, 192)),
  )
  const solutionCollage = collageImages(
    solutions.slice(MOBILE_COLLAGE_START, MOBILE_COLLAGE_END).map((s) => s.coverImageUrl),
  )

  return (
    <div className="mobile-home-tailwind bg-paper pb-24 md:hidden">
      <MobilePageHero title="Climate Stories, Ideas, and Solutions" />

      {featuredStories.length > 0 ? <MobileFeaturedStory stories={featuredStories} /> : null}

      <MobileHomeSection title="Solutions atlas" href="/solutions">
        {solutions.length > 0 ? (
          <MobileScrollRow
            seeMore={{
              label: 'Solutions atlas',
              countText: `${counts.solutionsCount}+ climate solutions mapped`,
              href: '/solutions',
              images: solutionCollage,
            }}
          >
            {solutions.slice(0, MOBILE_VISIBLE_CARDS).map((solution) => (
              <MobileSolutionCard
                key={solution.slug}
                solution={solution}
                statusLabel={formatSolutionStatus(solution.status)}
              />
            ))}
          </MobileScrollRow>
        ) : null}
      </MobileHomeSection>

      <MobileSolutionsAtlasSubmitCta
        projectCount={counts.solutionsCount}
        thumbnails={solutions.map((s) => s.coverImageUrl)}
        regions={solutions}
      />

      <MobileHomeSection title="Latest stories & insights" href="/stories">
        <Suspense fallback={null}>
          <div className="mb-3 -mx-1">
            <FilterPills filters={homeFilters} basePath="/stories" />
          </div>
        </Suspense>
        {latestStories.length > 0 ? (
          <MobileScrollRow
            seeMore={{
              label: 'Latest stories',
              countText: `See all ${counts.storiesCount}+ climate stories`,
              href: '/stories',
              images: storyCollage,
            }}
          >
            {latestStories.slice(0, MOBILE_VISIBLE_CARDS).map((story) => (
              <MobileStoryCard key={story.slug} story={story} />
            ))}
          </MobileScrollRow>
        ) : null}
      </MobileHomeSection>

      <MobileVoicesBand />

      <MobileHomeSection title="Opportunities" href="/opportunities">
        {programmes.length > 0 ? (
          <MobileScrollRow
            seeMore={{
              label: 'Opportunities',
              countText: `All ${counts.programmesCount} opportunities`,
              href: '/opportunities',
              images: programmeCollage,
            }}
          >
            {programmes.slice(0, MOBILE_VISIBLE_CARDS).map((programme) => (
              <MobileProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </MobileScrollRow>
        ) : null}
      </MobileHomeSection>

      <NewsletterBanner />
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
