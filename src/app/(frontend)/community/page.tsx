import type { Metadata } from 'next'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { FeaturedContributors } from '@/components/contributors/FeaturedContributors'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { CommunityMobileHero } from '@/components/community/CommunityMobileHero'
import { CommunityMobileContributors } from '@/components/community/CommunityMobileContributors'
import { CommunityMobileProjects } from '@/components/community/CommunityMobileProjects'
import { CommunityMobileOpportunities } from '@/components/community/CommunityMobileOpportunities'
import { FundingCtaBand } from '@/components/solutions/FundingCtaBand'
import { getCommunityProjects, getPartners } from '@/lib/cms/community'
import { getContributorsForPage } from '@/lib/cms/contributors-page'
import { getProgrammesForPage } from '@/lib/cms/programmes-page'
import { featuredProgrammes } from '@/lib/programmes/list'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Community',
  description: 'The people and projects behind every EcoDiaries story — contributors, partners, and community-led projects.',
}

export default async function CommunityPage() {
  const [contributors, projects, partners, programmes] = await Promise.all([
    getContributorsForPage(),
    getCommunityProjects(),
    getPartners(),
    getProgrammesForPage(),
  ])
  const featuredContributors = contributors.slice(0, 4)
  const spotlightProgrammes = featuredProgrammes(programmes)

  return (
    <>
      <div className="hidden md:block magazine">
        <SiteNav activeLink="/community" />
        <MagPageIntro
          eyebrow="Community"
          title="The people and projects behind every story"
          lede="EcoDiaries is built by a growing network of contributors, partner organisations, and community-led projects across the continent."
        >
          <nav className="mobile-section-nav" aria-label="Explore community" style={{ marginTop: 20 }}>
            <Link href="/contributors">Contributors</Link>
            <Link href="/opportunities">Opportunities</Link>
            <Link href="/solutions">Solutions</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <ContributorsApplyLink>Apply</ContributorsApplyLink>
          </nav>
        </MagPageIntro>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>Meet a few voices from the ground</h2>
            </div>
            <FeaturedContributors contributors={featuredContributors} />
          </div>
        </section>

        <section className="section on-paper">
          <div className="wrap">
            <div className="section-head">
              <h2>Community Projects</h2>
            </div>
            <div className="card-grid grid-3">
              {projects.map((project) => (
                <div key={project.title} className="story-card" style={{ cursor: 'default' }}>
                  <div className="story-thumb">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="33vw"
                      className="story-thumb__image"
                    />
                  </div>
                  <div className="story-card-body">
                    <div className="story-card-body__content">
                      <h3>{project.title}</h3>
                      <p className="excerpt">{project.excerpt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section on-dark">
          <div className="wrap">
            <span className="eyebrow">Partner Initiatives</span>
            <h2 className="mt-16">Organisations we work with</h2>
            <div className="tag-row mt-32">
              {partners.map((name) => (
                <span key={name} className="tag tag-ghost">{name}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="two-col">
              <div>
                <span className="eyebrow">Opportunities</span>
                <h2 className="mt-16">Structured ways to build skills and get published</h2>
                <p className="mt-16" style={{ color: 'var(--ink-soft)' }}>
                  From the Storytelling Academy to Young Guardians, our programmes train the next generation of climate communicators.
                </p>
                <Link href="/opportunities" className="btn btn-primary mt-32" style={{ width: 'fit-content' }}>
                  Explore opportunities <ArrowRightIcon />
                </Link>
              </div>
              <div className="feature-media" style={{ aspectRatio: '4/3' }}>
                <Image src="https://picsum.photos/seed/community-programmes/700/560" alt="Youth reporters in a training session" width={700} height={560} sizes="50vw" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="md:hidden community-page">
        <CommunityMobileHero />
        <CommunityMobileContributors contributors={featuredContributors} />
        <CommunityMobileProjects projects={projects} />
        {partners.length ? (
          <FundingCtaBand
            eyebrow="Partner Initiatives"
            title="Organisations we work with"
            chips={partners}
            ctaLabel="Become a partner"
            ctaHref="/contact?reason=partnership"
          />
        ) : null}
        <CommunityMobileOpportunities programmes={spotlightProgrammes} />
      </div>

      <NewsletterBanner />
      <SiteFooter />
    </>
  )
}
