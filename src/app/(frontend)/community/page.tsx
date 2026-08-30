import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CommunityExploreNav } from '@/components/community/CommunityExploreNav'
import { FeaturedContributors } from '@/components/contributors/FeaturedContributors'
import { MagCarouselRow } from '@/components/magazine/MagCarouselRow'
import { MagCtaBand } from '@/components/magazine/MagCtaBand'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { getCommunityProjects, getPartners } from '@/lib/cms/community'
import { getContributorsForPage } from '@/lib/cms/contributors-page'
import { getProgrammesForPage } from '@/lib/cms/programmes-page'
import {
  communityProjectToMagCard,
  contributorToMagCard,
  programmeToMagCard,
} from '@/lib/magazine'
import { featuredProgrammes } from '@/lib/programmes/list'
import { getProgrammeImageUrl } from '@/lib/programmes/images'

export const revalidate = 300

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
  const featuredOpps = featuredProgrammes(programmes)
  const spotlight = featuredOpps[0]
  const newsletterImage =
    projects[0]?.image || getProgrammeImageUrl(spotlight?.slug || 'community', 900, 700)

  return (
    <MagPageShell>
      <div className="mag-section" style={{ paddingTop: 12 }}>
        <MagPageIntro
          eyebrow="Community"
          title="The people and projects behind every story"
          lede="EcoDiaries is built by a growing network of contributors, partner organisations, and community-led projects across the continent."
        >
          <CommunityExploreNav />
        </MagPageIntro>
      </div>

      <section className="mag-section" style={{ paddingTop: 8 }}>
        <div className="magazine-desktop">
          <div className="mag-wrap">
            <div className="mag-section-head">
              <h2>Meet a few voices from the ground</h2>
              <Link href="/contributors" className="mag-link">View all →</Link>
            </div>
            <FeaturedContributors contributors={featuredContributors} />
          </div>
        </div>
        <MagCarouselRow
          title="Voices from the ground"
          href="/contributors"
          items={featuredContributors.map(contributorToMagCard)}
          seeMoreLabel="See all contributors"
          seeMoreSubtitle="Writers, photographers, and more"
        />
      </section>

      {projects.length ? (
        <section className="mag-section">
          <div className="magazine-desktop">
            <div className="mag-wrap">
              <div className="mag-section-head">
                <h2>Community projects</h2>
              </div>
              <div className="mag-latest__grid">
                {projects.map((project) => (
                  <article key={project.title} className="mag-card mag-card--md">
                    <div className="mag-card__media">
                      <Image
                        src={project.image || `https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/600`}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <h3 className="mag-title">{project.title}</h3>
                    <p className="mag-excerpt">{project.excerpt}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <MagCarouselRow
            title="Community projects"
            href="/community"
            items={projects.map(communityProjectToMagCard)}
            seeMoreLabel="See all projects"
            seeMoreSubtitle="Work from the network"
          />
        </section>
      ) : null}

      {partners.length ? (
        <section className="mag-section">
          <div className="mag-wrap">
            <p className="mag-news__eyebrow">Partner initiatives</p>
            <h2 style={{ maxWidth: '16ch', margin: '8px 0 24px' }}>Organisations we work with</h2>
            <div className="mag-tag-row">
              {partners.map((name) => (
                <span key={name} className="mag-tag">{name}</span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mag-section">
        <div className="magazine-desktop">
          <div className="mag-wrap mag-news">
            <div>
              <p className="mag-news__eyebrow">Opportunities</p>
              <h2>Structured ways to build skills and get published</h2>
              <p className="mag-excerpt mag-excerpt--full" style={{ marginTop: 16 }}>
                From the Storytelling Academy to Young Guardians, our programmes train the next generation of climate communicators.
              </p>
              <Link href="/opportunities" className="mag-btn" style={{ marginTop: 28 }}>
                Explore opportunities
              </Link>
            </div>
            <div className="mag-news__media">
              <Image
                src={getProgrammeImageUrl(spotlight?.slug || 'community-programmes', 900, 700)}
                alt=""
                fill
                sizes="(max-width: 980px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
        <MagCarouselRow
          title="Opportunities"
          href="/opportunities"
          items={featuredOpps.map(programmeToMagCard)}
          seeMoreLabel="See all opportunities"
          seeMoreSubtitle="Ways to learn and publish"
        />
      </section>

      <MagCtaBand
        eyebrow="Partners"
        title="Build with us"
        lede="NGOs, universities, and media organisations work with EcoDiaries to document and scale climate solutions."
        href="/contact?reason=partnership"
        label="Become a partner"
      />
      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
