import Link from 'next/link'
import { MobilePageHero } from '@/components/mobile/MobilePageHero'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'

const NAV_ITEMS = [
  { href: '/contributors', label: 'Contributors' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export function CommunityMobileHero() {
  return (
    <>
      <MobilePageHero
        className="community-mobile-hero"
        eyebrow="Community"
        title="The people and projects behind every story"
        activeLink="/community"
        showSearch={false}
      />
      <div className="community-mobile-page__nav-wrap">
        <nav className="filter-row community-mobile-nav" aria-label="Explore community">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link key={href} href={href} className="filter-pill">
              {label}
            </Link>
          ))}
          <ContributorsApplyLink className="filter-pill">Apply</ContributorsApplyLink>
        </nav>
      </div>
    </>
  )
}
