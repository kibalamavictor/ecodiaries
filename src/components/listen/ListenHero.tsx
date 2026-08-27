import { MobilePageHero } from '@/components/mobile/MobilePageHero'

const HERO_LEAD = 'Interviews, community conversations, and documentary-style audio stories'

export function ListenHero() {
  return (
    <MobilePageHero
      className="md:hidden listen-mobile-hero"
      title="Listen"
      lead={HERO_LEAD}
      activeLink="/listen"
      showSearch={false}
    />
  )
}
