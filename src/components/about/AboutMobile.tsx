import Link from 'next/link'
import { SiteNav } from '@/components/layout/SiteNav'
import { AboutMobileVideo } from '@/components/about/AboutMobileVideo'
import { MobileScrollRow } from '@/components/mobile/MobileScrollRow'
import { MobileProgrammeCard } from '@/components/mobile/MobileProgrammeCard'
import {
  MOBILE_COLLAGE_END,
  MOBILE_COLLAGE_START,
  MOBILE_VISIBLE_CARDS,
} from '@/components/mobile/mobile-dimensions'
import { collageImages } from '@/lib/cms/homepage'
import type { AboutPageVideos } from '@/lib/about/about-page-media'
import type { SiteSettingsView } from '@/lib/cms/site-settings'
import {
  ABOUT_HERO_HEADLINE,
  ABOUT_HERO_VIDEO_CAPTION,
  ABOUT_MOBILE_INTRO,
  ABOUT_MOBILE_STAT_LABELS,
  OUR_IMPACT_EYEBROW,
  WHO_WE_ARE_EYEBROW,
  WHO_WE_ARE_HEADLINE,
} from '@/lib/about/about-page-content'
import { firstSentence } from '@/lib/about/condense-copy'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'
import type { ProgrammePreview } from '@/lib/types'

type ProgrammeFromCms = {
  slug: string
  eyebrow: string
  title: string
  description: string
  bgClass: string
  status: 'open' | 'closed'
}

type AboutMobileProps = {
  settings: SiteSettingsView
  programmes: ProgrammeFromCms[]
  videos: AboutPageVideos
}

function toProgrammePreview(programme: ProgrammeFromCms): ProgrammePreview {
  return {
    slug: programme.slug,
    eyebrow: programme.eyebrow,
    title: programme.title,
    description: programme.description,
    bgClass: programme.bgClass,
    status: programme.status,
  }
}

function heroVideoCaption(videos: AboutPageVideos): string {
  if (videos.hero.kind === 'ready' && videos.hero.alt) return videos.hero.alt
  return ABOUT_HERO_VIDEO_CAPTION
}

export function AboutMobile({ settings, programmes, videos }: AboutMobileProps) {
  const programmePreviews = programmes.map(toProgrammePreview)
  const visibleProgrammes = programmePreviews.slice(0, MOBILE_VISIBLE_CARDS)
  const programmeCollage = collageImages(
    programmes
      .slice(MOBILE_COLLAGE_START, MOBILE_COLLAGE_END)
      .map((programme) => getProgrammeImageUrl(programme.slug, 272, 192)),
  )

  const missionShort = firstSentence(settings.missionCopy)
  const visionShort = firstSentence(settings.visionCopy)
  const impactStats = settings.impactStats.slice(0, 2)

  return (
    <div className="about-mobile md:hidden">
      <SiteNav variant="light" activeLink="/about" />

      <div className="about-mobile__body">
        <section className="about-mobile__hero" aria-label="About EcoDiaries">
          <p className="about-mobile__eyebrow">About EcoDiaries</p>
          <h1 className="about-mobile__headline">{ABOUT_HERO_HEADLINE}</h1>
          <AboutMobileVideo
            media={videos.hero}
            priority
            caption={heroVideoCaption(videos)}
          />
          <p className="about-mobile__intro">{ABOUT_MOBILE_INTRO}</p>
        </section>

        {impactStats.length > 0 ? (
          <section className="about-mobile__stats-section" aria-label="Impact at a glance">
            <div className="about-mobile__stats">
              {impactStats.map((stat, index) => (
                <div
                  key={`${stat.label}-${stat.num}`}
                  className={`about-mobile__stat${index === 0 ? ' about-mobile__stat--divider' : ''}`}
                >
                  <p className="about-mobile__stat-value">{stat.num}</p>
                  <p className="about-mobile__stat-label">
                    {ABOUT_MOBILE_STAT_LABELS[stat.label] ?? stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="about-mobile__section" id="mission" aria-label="Mission and vision">
          <div className="about-mobile__mission-grid">
            <article className="about-mobile__mv-card">
              <span className="about-mobile__mv-icon" aria-hidden />
              <p className="about-mobile__mv-eyebrow">Our mission</p>
              <p className="about-mobile__mv-copy">{missionShort}</p>
            </article>
            <article className="about-mobile__mv-card">
              <span className="about-mobile__mv-icon" aria-hidden />
              <p className="about-mobile__mv-eyebrow">Our vision</p>
              <p className="about-mobile__mv-copy">{visionShort}</p>
            </article>
          </div>
        </section>

        <section className="about-mobile__section" aria-label="Who we are">
          <p className="about-mobile__eyebrow">{WHO_WE_ARE_EYEBROW}</p>
          <h2 className="about-mobile__subhead">{WHO_WE_ARE_HEADLINE}</h2>
          <AboutMobileVideo media={videos['who-we-are']} />
        </section>

        <section className="about-mobile__section" aria-label="Our impact">
          <p className="about-mobile__eyebrow">{OUR_IMPACT_EYEBROW}</p>
          <AboutMobileVideo media={videos.impact} />
        </section>

        {programmePreviews.length > 0 ? (
          <section className="about-mobile__programmes" aria-label="Running programmes">
            <div className="about-mobile__programmes-head">
              <h2 className="about-mobile__programmes-title">Running programmes</h2>
              <Link href={OPPORTUNITIES_PATH} className="about-mobile__programmes-link">
                View all
              </Link>
            </div>
            <MobileScrollRow
              seeMore={{
                label: 'Programmes',
                countText: `All ${programmePreviews.length} programmes`,
                href: OPPORTUNITIES_PATH,
                images: programmeCollage,
              }}
            >
              {visibleProgrammes.map((programme) => (
                <MobileProgrammeCard key={programme.slug} programme={programme} />
              ))}
            </MobileScrollRow>
          </section>
        ) : null}
      </div>
    </div>
  )
}
