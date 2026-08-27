import Link from 'next/link'
import { Suspense } from 'react'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { SiteNav } from '@/components/layout/SiteNav'
import { MobilePageHero } from '@/components/mobile/MobilePageHero'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'

const HERO_LEAD = 'Programmes, grants, fellowships, and climate events'
const SEARCH_PLACEHOLDER = 'Search programmes, grants, fellowships…'

type ProgrammeHeroProps = {
  defaultQuery?: string
}

export function ProgrammeHero({ defaultQuery }: ProgrammeHeroProps) {
  return (
    <>
      <header className="hidden bg-brand-forest text-white md:block">
        <SiteNav variant="light" activeLink="/community" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Opportunities</h1>
          <p className="programmes-hero-subline mt-2 max-w-2xl text-base text-white/80 sm:text-lg">{HERO_LEAD}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            EcoDiaries programmes sit alongside grants, fellowships, and events from across the climate storytelling
            ecosystem — open opportunities rise to the top, closed listings sink to the bottom.
          </p>
          <Suspense fallback={null}>
            <HeroSearch
              className="hero-search hero-search--on-dark"
              style={{ margin: '28px 0 0', maxWidth: 520 }}
              action={OPPORTUNITIES_PATH}
              defaultValue={defaultQuery}
              placeholder={SEARCH_PLACEHOLDER}
              preserveParams
              submitButtonClassName="btn btn-outline btn-sm hero-search__submit--muted"
            />
          </Suspense>
          <Link
            href="#how-it-works"
            className="mt-6 inline-flex items-center rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            How it works
          </Link>
          <Link
            href="#opportunities"
            className="mt-8 inline-flex items-center rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-forest transition hover:brightness-95"
          >
            Browse opportunities
          </Link>
        </div>
      </header>

      <MobilePageHero
        className="md:hidden programmes-mobile-hero"
        title="Opportunities"
        lead={HERO_LEAD}
        activeLink="/community"
        searchDefaultValue={defaultQuery}
        searchAction={OPPORTUNITIES_PATH}
        searchPlaceholder={SEARCH_PLACEHOLDER}
        searchSubmitButtonClassName="btn btn-outline btn-sm mobile-hero-search__submit mobile-hero-search__submit--muted"
        preserveSearchParams
      />
    </>
  )
}
