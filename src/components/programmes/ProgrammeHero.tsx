import Link from 'next/link'
import { Suspense } from 'react'
import { HeroSearch } from '@/components/forms/HeroSearch'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'

const HERO_LEAD = 'Programmes, grants, fellowships, and climate events from across the storytelling ecosystem — open opportunities rise to the top.'
const SEARCH_PLACEHOLDER = 'Search programmes, grants, fellowships…'

type ProgrammeHeroProps = {
  defaultQuery?: string
}

export function ProgrammeHero({ defaultQuery }: ProgrammeHeroProps) {
  return (
    <div className="mag-section" style={{ paddingTop: 12, paddingBottom: 8 }}>
      <MagPageIntro eyebrow="Opportunities" title="Ways to learn, publish, and grow" lede={HERO_LEAD}>
        <Suspense fallback={null}>
          <HeroSearch
            style={{ maxWidth: 520 }}
            action={OPPORTUNITIES_PATH}
            defaultValue={defaultQuery}
            placeholder={SEARCH_PLACEHOLDER}
            preserveParams
          />
        </Suspense>
        <div className="mag-actions">
          <Link href="#opportunities" className="mag-btn">
            Browse opportunities
          </Link>
          <Link href="#how-it-works" className="mag-tag">
            How it works
          </Link>
        </div>
      </MagPageIntro>
    </div>
  )
}
