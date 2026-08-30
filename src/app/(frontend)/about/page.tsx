import Link from 'next/link'
import type { Metadata } from 'next'
import { MagCard } from '@/components/magazine/MagCard'
import { MagCarouselRow } from '@/components/magazine/MagCarouselRow'
import { MagMedia } from '@/components/magazine/MagMedia'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { getProgrammes } from '@/lib/cms/community'
import { OPPORTUNITIES_PATH, opportunityDetailPath } from '@/lib/programmes/routes'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { programmeToMagCard } from '@/lib/magazine'
import { getSiteSettings } from '@/lib/cms/site-settings'
import { getAboutPageVideos } from '@/lib/about/about-page-media'
import { ABOUT_HERO_HEADLINE, ABOUT_INTRO_PARAGRAPHS } from '@/lib/about/about-page-content'

export const metadata: Metadata = {
  title: 'About',
  description: 'EcoDiaries is a climate storytelling platform documenting stories of environmental action, resilience, and innovation across Africa.',
}

const FALLBACK_STILL = 'https://picsum.photos/seed/about-hero/1400/620'

export default async function AboutPage() {
  const [settings, programmes, videos] = await Promise.all([
    getSiteSettings(),
    getProgrammes(),
    getAboutPageVideos(),
  ])

  const heroStill = videos.hero.kind === 'ready' ? videos.hero.src : FALLBACK_STILL
  const whoStill = videos['who-we-are'].kind === 'ready' ? videos['who-we-are'].src : 'https://picsum.photos/seed/who-we-are/1400/620'
  const impactStill = videos.impact.kind === 'ready' ? videos.impact.src : 'https://picsum.photos/seed/impact/900/700'
  const newsletterImage = programmes[0] ? getProgrammeImageUrl(programmes[0].slug, 900, 700) : heroStill

  return (
    <MagPageShell>
      <div className="mag-section" style={{ paddingTop: 12 }}>
        <MagPageIntro eyebrow="About EcoDiaries" title={ABOUT_HERO_HEADLINE}>
          <div className="mag-two" style={{ marginTop: 12 }}>
            {ABOUT_INTRO_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="mag-excerpt mag-excerpt--full">
                {paragraph}
              </p>
            ))}
          </div>
        </MagPageIntro>
        <div className="mag-wrap" style={{ marginTop: 32 }}>
          <MagMedia src={heroStill} alt={videos.hero.kind === 'ready' ? videos.hero.alt : ''} priority />
        </div>
      </div>

      <section className="mag-section" id="mission">
        <div className="mag-wrap mag-two">
          <div>
            <p className="mag-news__eyebrow">Our mission</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginTop: 12 }}>{settings.missionCopy}</h2>
          </div>
          <div>
            <p className="mag-news__eyebrow">Our vision</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginTop: 12 }}>{settings.visionCopy}</h2>
          </div>
        </div>
      </section>

      <section className="mag-section">
        <div className="mag-wrap">
          <p className="mag-news__eyebrow">Who we are</p>
          <h2 style={{ margin: '8px 0 28px' }}>A platform built for climate stories</h2>
          <MagMedia src={whoStill} alt={videos['who-we-are'].kind === 'ready' ? videos['who-we-are'].alt : ''} />
        </div>
      </section>

      <section className="mag-section">
        <div className="mag-wrap mag-two mag-two--center">
          <MagMedia
            src={impactStill}
            alt={videos.impact.kind === 'ready' ? videos.impact.alt : ''}
            ratio="4 / 3"
          />
          <div>
            <p className="mag-news__eyebrow">Our impact</p>
            <div className="mag-stat-row" style={{ marginTop: 20, border: 0, padding: 0, gridTemplateColumns: '1fr 1fr' }}>
              {settings.impactStats.map((stat) => (
                <div key={stat.label}>
                  <div className="num">{stat.num}</div>
                  <div className="label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mag-section">
        <div className="magazine-desktop">
          <div className="mag-wrap">
            <div className="mag-section-head">
              <h2>Six ways to get involved</h2>
              <Link href={OPPORTUNITIES_PATH} className="mag-link">View all opportunities →</Link>
            </div>
            <div className="mag-latest__grid">
              {programmes.map((programme) => (
                <MagCard
                  key={programme.slug}
                  item={{
                    href: opportunityDetailPath(programme.slug),
                    image: getProgrammeImageUrl(programme.slug),
                    category: programme.eyebrow || 'Opportunity',
                    title: programme.title,
                    excerpt: programme.description,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <MagCarouselRow
          title="Six ways to get involved"
          href={OPPORTUNITIES_PATH}
          items={programmes.map(programmeToMagCard)}
          seeMoreLabel="See all opportunities"
          seeMoreSubtitle="Programmes, grants, and fellowships"
        />
      </section>

      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
