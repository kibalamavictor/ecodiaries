import Link from 'next/link'
import { Suspense } from 'react'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { SiteNav } from '@/components/layout/SiteNav'
import { MobilePageHero } from '@/components/mobile/MobilePageHero'
import { uniqueCountriesCount } from '@/lib/solutions/coordinates'
import type { Solution } from '@/lib/solutions/types'

type SolutionHeroProps = {
  solutions: Solution[]
  defaultQuery?: string
}

const HERO_LEAD = 'Discover Climate Solutions'

export function SolutionHero({ solutions, defaultQuery }: SolutionHeroProps) {
  const count = solutions.length
  const countries = uniqueCountriesCount(solutions)

  return (
    <>
      <header className="hidden bg-brand-forest text-white md:block">
        <SiteNav variant="light" activeLink="/solutions" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">Solutions Atlas</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Climate Solutions Across Africa
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            A growing record of what is working, where, and who&apos;s behind it — field-documented innovations you can
            learn from, fund, and scale.
          </p>
          {count > 0 ? (
            <p className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
              {count} solution{count === 1 ? '' : 's'} tracked across {countries}{' '}
              {countries === 1 ? 'country' : 'countries'}
            </p>
          ) : null}
          <Suspense fallback={null}>
            <HeroSearch
              className="hero-search hero-search--on-dark"
              style={{ margin: '28px 0 0', maxWidth: 520 }}
              action="/solutions"
              defaultValue={defaultQuery}
              placeholder="Search solutions, sectors, or places…"
              preserveParams
            />
          </Suspense>
          <Link
            href="/changemakers"
            className="mt-6 inline-flex items-center rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Meet the changemakers
          </Link>
          <Link
            href="#explore"
            className="mag-btn mt-8"
          >
            Explore the atlas
          </Link>
        </div>
      </header>

      <MobilePageHero
        className="md:hidden solutions-mobile-hero"
        title="Solutions Atlas"
        lead={HERO_LEAD}
        activeLink="/solutions"
        searchDefaultValue={defaultQuery}
        searchAction="/solutions"
        searchPlaceholder="Search solutions, sectors, or places…"
        searchSubmitButtonClassName="btn btn-outline btn-sm mobile-hero-search__submit mobile-hero-search__submit--muted"
        preserveSearchParams
      />
    </>
  )
}
