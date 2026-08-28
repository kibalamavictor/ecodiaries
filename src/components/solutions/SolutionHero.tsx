import Link from 'next/link'
import { Suspense } from 'react'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { uniqueCountriesCount } from '@/lib/solutions/coordinates'
import type { Solution } from '@/lib/solutions/types'

type SolutionHeroProps = {
  solutions: Solution[]
  defaultQuery?: string
}

export function SolutionHero({ solutions, defaultQuery }: SolutionHeroProps) {
  const count = solutions.length
  const countries = uniqueCountriesCount(solutions)

  return (
    <div className="mag-section" style={{ paddingTop: 12, paddingBottom: 8 }}>
      <MagPageIntro
        eyebrow="Solutions atlas"
        title="Climate solutions across Africa"
        lede="A growing record of what is working, where, and who’s behind it — field-documented innovations you can learn from, fund, and scale."
      >
        {count > 0 ? (
          <p className="mag-meta" style={{ marginBottom: 8 }}>
            {count} solution{count === 1 ? '' : 's'} tracked across {countries}{' '}
            {countries === 1 ? 'country' : 'countries'}
          </p>
        ) : null}
        <Suspense fallback={null}>
          <HeroSearch
            style={{ maxWidth: 520 }}
            action="/solutions"
            defaultValue={defaultQuery}
            placeholder="Search solutions, sectors, or places…"
            preserveParams
          />
        </Suspense>
        <div className="mag-actions">
          <Link href="#atlas" className="mag-btn">
            Explore the atlas
          </Link>
          <Link href="/changemakers" className="mag-tag">
            Meet the changemakers
          </Link>
        </div>
      </MagPageIntro>
    </div>
  )
}
