import type { Metadata } from 'next'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ChangemakerProfileHeader } from '@/components/changemakers/ChangemakerProfileHeader'
import { ChangemakerImpactBand } from '@/components/changemakers/ChangemakerImpactBand'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { getChangemakerBySlug } from '@/lib/cms/organizations'
import { SECTOR_LABELS } from '@/lib/solutions/types'
import { buildPageMetadata } from '@/lib/seo'
import Image from 'next/image'
import { notFound } from 'next/navigation'

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
    <>
      <ChangemakerProfileHeader org={org} />
      <ChangemakerImpactBand projects={org.projects} />

      <section className="changemaker-profile__body pb-5 md:py-14">
        <div className="changemaker-profile__content mx-auto max-w-6xl space-y-14 px-4 sm:px-6">
          {org.aggregateImpact.length ? (
            <div className="hidden md:block">
              <h2 className="text-xl font-bold text-brand-forest">Aggregate impact</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {org.aggregateImpact.map((tile) => (
                  <div key={`${tile.label}-${tile.value}`} className="rounded-xl border border-border p-4">
                    <p className="text-xl font-bold text-brand-forest">{tile.value}</p>
                    <p className="text-sm text-brand-green">{tile.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="changemaker-profile__portfolio">
            <h2 className="text-xl font-bold text-brand-forest md:mt-0">Project portfolio</h2>
            <div className="mt-4 grid gap-6 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3">
              {org.projects.map((p) => (
                <SolutionCard key={p.id} solution={p} />
              ))}
            </div>
          </div>

          {org.team.length ? (
            <div>
              <h2 className="text-xl font-bold text-brand-forest">Team</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {org.team.map((member) => (
                  <div key={member.name} className="rounded-xl border border-border p-4 text-center">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="mx-auto rounded-full object-cover"
                      />
                    ) : null}
                    <p className="mt-2 font-semibold text-brand-forest">{member.name}</p>
                    {member.role ? <p className="text-sm text-muted-foreground">{member.role}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {org.focusAreas.length ? (
            <div className="flex flex-wrap gap-2">
              {org.focusAreas.map((area) => (
                <span key={area} className="rounded-full bg-brand-lime/15 px-3 py-1 text-sm font-medium text-brand-forest">
                  {SECTOR_LABELS[area as keyof typeof SECTOR_LABELS] || area}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
