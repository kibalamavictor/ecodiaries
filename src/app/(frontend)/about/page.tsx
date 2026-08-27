import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { getProgrammes } from '@/lib/cms/community'
import { OPPORTUNITIES_PATH, opportunityDetailPath } from '@/lib/programmes/routes'
import { getSiteSettings } from '@/lib/cms/site-settings'
import { PlayIcon } from '@/components/icons'
import { AboutMobile } from '@/components/about/AboutMobile'
import { getAboutPageVideos } from '@/lib/about/about-page-media'

export const metadata: Metadata = {
  title: 'About',
  description: 'EcoDiaries is a climate storytelling platform documenting stories of environmental action, resilience, and innovation across Africa.',
}

export default async function AboutPage() {
  const [settings, programmes, videos] = await Promise.all([
    getSiteSettings(),
    getProgrammes(),
    getAboutPageVideos(),
  ])

  return (
    <>
      <div className="hidden md:block on-dark">
        <SiteNav variant="light" />
        <div className="wrap" style={{ paddingTop: 54 }}>
          <div className="two-col" style={{ gridTemplateColumns: '.85fr 1.15fr' }}>
            <div>
              <h1 className="about-hero-title">
                A climate storytelling platform documenting stories that matter
              </h1>
            </div>
            <div>
              <span className="eyebrow">Turning Awareness into Action</span>
              <p className="mt-16 text-muted" style={{ fontSize: '15.5px', maxWidth: 480 }}>
                Across Africa, communities are already responding to climate challenges with creativity, innovation, and resilience. Many of these solutions remain invisible beyond the communities where they originate.
              </p>
              <p className="mt-16 text-muted" style={{ fontSize: '15.5px', maxWidth: 480 }}>
                EcoDiaries exists to identify, document, and amplify these stories so others can learn, adapt, and act — connecting communities and promoting the spread of proven environmental solutions.
              </p>
            </div>
          </div>

          <div className="feature-media mt-48" style={{ aspectRatio: '16/7' }}>
            <Image src="https://picsum.photos/seed/about-hero/1200/520" alt="A storyteller being interviewed on location" width={1200} height={520} sizes="100vw" />
            <button className="play-btn" aria-label="Play" type="button">
              <PlayIcon />
            </button>
          </div>
        </div>

        <div className="wrap section">
          <div className="two-col" id="mission">
            <div>
              <span className="eyebrow">Our Mission</span>
              <h2 className="mt-16 about-section-title">
                {settings.missionCopy}
              </h2>
            </div>
            <div>
              <span className="eyebrow">Our Vision</span>
              <h2 className="mt-16 about-section-title">
                {settings.visionCopy}
              </h2>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="wrap section" style={{ paddingTop: 0 }}>
          <span className="eyebrow">Who We Are</span>
          <h2 className="mt-16">A platform built for climate stories</h2>
          <div className="feature-media mt-32" style={{ aspectRatio: '16/7.4' }}>
            <Image src="https://picsum.photos/seed/who-we-are/1200/520" alt="Behind the scenes of a documentary interview" width={1200} height={520} sizes="100vw" />
            <button className="play-btn" aria-label="Play" type="button">
              <PlayIcon />
            </button>
          </div>
        </div>

        <div className="wrap section" style={{ paddingTop: 0 }}>
          <span className="eyebrow">Our Impact</span>
          <div className="two-col mt-24" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
            <div className="feature-media" style={{ aspectRatio: '4/3' }}>
              <Image src="https://picsum.photos/seed/impact/700/560" alt="A young reporter speaking into a microphone" width={700} height={560} sizes="50vw" />
              <button className="play-btn" aria-label="Play" type="button">
                <PlayIcon />
              </button>
            </div>
            <div className="stat-block">
              {settings.impactStats.map((stat) => (
                <div key={stat.label}>
                  <div className="num">{stat.num}</div>
                  <div className="label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wrap section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2>Six ways to get involved</h2>
            <Link href={OPPORTUNITIES_PATH} className="btn btn-outline btn-sm">
              View all opportunities
            </Link>
          </div>
          <div className="card-grid grid-3">
            {programmes.map((p) => (
              <Link key={p.slug} href={opportunityDetailPath(p.slug)} className={`programme-card ${p.bgClass}`}>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AboutMobile settings={settings} programmes={programmes} videos={videos} />

      <NewsletterBanner />
      <SiteFooter />
    </>
  )
}
