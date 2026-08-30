import { MobilePageHero } from '@/components/mobile/MobilePageHero'
import { CommunityExploreNav } from '@/components/community/CommunityExploreNav'

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
        <CommunityExploreNav
          className="filter-row community-mobile-nav"
          linkClassName="filter-pill"
        />
      </div>
    </>
  )
}
