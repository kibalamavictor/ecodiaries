import Link from 'next/link'
import { ContributorCard } from '@/components/contributors/ContributorCard'
import type { Contributor } from '@/lib/contributors/types'

type CommunityMobileContributorsProps = {
  contributors: Contributor[]
}

export function CommunityMobileContributors({ contributors }: CommunityMobileContributorsProps) {
  if (!contributors.length) return null

  return (
    <section className="community-mobile-section">
      <div className="community-mobile-page__body">
        <h2 className="mobile-stories-category__title">Meet a few voices from the ground</h2>
        <div className="contributors-grid__cards">
          {contributors.map((contributor) => (
            <ContributorCard key={contributor.id} contributor={contributor} compact />
          ))}
        </div>
        <div className="community-mobile-section__cta">
          <Link href="/contributors" className="community-mobile-section__link">
            View all contributors
          </Link>
        </div>
      </div>
    </section>
  )
}
