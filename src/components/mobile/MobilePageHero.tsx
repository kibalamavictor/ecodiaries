import { Suspense } from 'react'
import { SiteNav } from '@/components/layout/SiteNav'
import { HeroSearch } from '@/components/forms/HeroSearch'

type MobilePageHeroProps = {
  title?: string
  eyebrow?: string
  eyebrowBold?: boolean
  lead?: string
  className?: string
  activeLink?: string
  searchDefaultValue?: string
  searchAction?: string
  searchPlaceholder?: string
  preserveSearchParams?: boolean
  searchSubmitButtonClassName?: string
  showSearch?: boolean
}

export function MobilePageHero({
  title,
  eyebrow,
  eyebrowBold = false,
  lead,
  className,
  activeLink,
  searchDefaultValue,
  searchAction = '/stories',
  searchPlaceholder,
  preserveSearchParams = false,
  searchSubmitButtonClassName,
  showSearch = true,
}: MobilePageHeroProps) {
  return (
    <div className={['hero-horizon mobile-page-hero', className].filter(Boolean).join(' ')}>
      <SiteNav variant="light" activeLink={activeLink} />
      <div className="mobile-hero-inner wrap">
        {eyebrow ? (
          <p className={`mobile-hero-eyebrow${eyebrowBold ? ' mobile-hero-eyebrow--bold' : ''}`}>{eyebrow}</p>
        ) : null}
        {title ? <h1>{title}</h1> : null}
        {lead ? <p className="mobile-hero-lead">{lead}</p> : null}
        {showSearch ? (
          <Suspense fallback={null}>
            <HeroSearch
              className="hero-search mobile-hero-search"
              defaultValue={searchDefaultValue}
              action={searchAction}
              placeholder={searchPlaceholder}
              preserveParams={preserveSearchParams}
              submitButtonClassName={searchSubmitButtonClassName}
            />
          </Suspense>
        ) : null}
      </div>
    </div>
  )
}
