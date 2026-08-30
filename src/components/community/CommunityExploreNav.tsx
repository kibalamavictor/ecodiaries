import Link from 'next/link'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'

export const COMMUNITY_NAV_ITEMS = [
  { href: '/about', label: 'About' },
  { href: '/contributors', label: 'Contributors' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/contributors#apply', label: 'Join Us', apply: true },
  { href: '/contact', label: 'Contact' },
] as const

type CommunityExploreNavProps = {
  className?: string
  linkClassName?: string
}

export function CommunityExploreNav({
  className = 'mag-tag-row',
  linkClassName = 'mag-tag',
}: CommunityExploreNavProps) {
  return (
    <nav className={className} aria-label="Explore community">
      {COMMUNITY_NAV_ITEMS.map((item) =>
        'apply' in item && item.apply ? (
          <ContributorsApplyLink key={item.href} className={linkClassName}>
            {item.label}
          </ContributorsApplyLink>
        ) : (
          <Link key={item.href} href={item.href} className={linkClassName}>
            {item.label}
          </Link>
        ),
      )}
    </nav>
  )
}
