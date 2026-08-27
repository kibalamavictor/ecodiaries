'use client'

import Link from 'next/link'
import { OpportunitiesFeaturedCarousel } from '@/components/programmes/OpportunitiesFeaturedCarousel'
import { ArrowRightIcon } from '@/components/icons'
import type { Programme } from '@/lib/programmes/types'

type CommunityMobileOpportunitiesProps = {
  programmes: Programme[]
}

export function CommunityMobileOpportunities({ programmes }: CommunityMobileOpportunitiesProps) {
  if (!programmes.length) return null

  return (
    <section className="community-mobile-section">
      <div className="community-mobile-page__body">
        <div className="community-mobile-opportunities__intro">
          <span className="community-mobile-opportunities__eyebrow">Opportunities</span>
          <h2 className="community-mobile-opportunities__title">
            Structured ways to build skills and get published
          </h2>
          <p className="community-mobile-opportunities__lede">
            From the Storytelling Academy to Young Guardians, our programmes train the next generation of
            climate communicators.
          </p>
        </div>
        <OpportunitiesFeaturedCarousel programmes={programmes} showHead={false} autoAdvance={false} />
        <Link href="/opportunities" className="btn btn-lime community-mobile-opportunities__cta">
          Explore opportunities <ArrowRightIcon />
        </Link>
      </div>
    </section>
  )
}
