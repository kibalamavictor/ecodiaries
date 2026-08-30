import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChangemakerImpactBand } from '@/components/changemakers/ChangemakerImpactBand'
import { ChangemakerProfileHeader } from '@/components/changemakers/ChangemakerProfileHeader'
import { MagCarouselRow } from '@/components/magazine/MagCarouselRow'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { getChangemakerBySlug } from '@/lib/cms/organizations'
import { atlasProjectToMagCard } from '@/lib/magazine'
import { SECTOR_LABELS } from '@/lib/solutions/types'
import { buildPageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const org = await getChangemakerBySlug(slug)
  if (!org) return { title: 'Changemaker' }
  return buildPageMetadata({
    title: org.name,
    description: org.tagline || `Projects and impact from ${org.name}`,
    path: `/changemakers/${slug}`,
  })
}

export default async function ChangemakerProfilePage({ params }: Props) {
  const { slug } = await params
  const org = await getChangemakerBySlug(slug)
  if (!org) notFound()

  return (
    <MagPageShell>
      <ChangemakerProfileHeader org={org} />
      <ChangemakerImpactBand projects={org.projects} />

      <section className="mag-section">
        <div className="mag-wrap" style={{ display: 'grid', gap: 56 }}>
          {org.aggregateImpact.length ? (
            <div>
              <div className="mag-section-head">
                <h2>Aggregate impact</h2>
              </div>
              <div className="mag-stat-row">
                {org.aggregateImpact.map((tile) => (
                  <div key={`${tile.label}-${tile.value}`}>
                    <div className="num">{tile.value}</div>
                    <div className="label">{tile.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <div className="magazine-desktop">
              <div className="mag-section-head">
                <h2>Project portfolio</h2>
              </div>
              <div className="mag-latest__grid" style={{ marginTop: 8 }}>
                {org.projects.map((project) => (
                  <SolutionCard key={project.id} solution={project} />
                ))}
              </div>
            </div>
            <MagCarouselRow
              title="Project portfolio"
              href="/solutions"
              items={org.projects.map(atlasProjectToMagCard)}
              seeMoreLabel="See all solutions"
              seeMoreSubtitle="Open the atlas"
            />
          </div>

          {org.team.length ? (
            <div>
              <div className="mag-section-head">
                <h2>Team</h2>
              </div>
              <div className="mag-grid-3">
                {org.team.map((member) => (
                  <article key={member.name} className="mag-card mag-card--sm" style={{ textAlign: 'center' }}>
                    {member.photoUrl ? (
                      <div className="mag-profile-logo" style={{ margin: '0 auto 12px' }}>
                        <Image src={member.photoUrl} alt="" fill sizes="88px" />
                      </div>
                    ) : null}
                    <h3 className="mag-title">{member.name}</h3>
                    {member.role ? <p className="mag-meta">{member.role}</p> : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {org.focusAreas.length ? (
            <div className="mag-tag-row">
              {org.focusAreas.map((area) => (
                <span key={area} className="mag-tag">
                  {SECTOR_LABELS[area as keyof typeof SECTOR_LABELS] || area}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </MagPageShell>
  )
}
