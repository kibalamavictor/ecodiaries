import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ProjectPortfolio } from '@/components/solutions/ProjectPortfolio'
import { getAtlasProjectBySlug, getRelatedAtlasProjects } from '@/lib/cms/solutions-page'
import { getPayloadClient } from '@/lib/payload'
import { buildPageMetadata, resolveOgImage } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getAtlasProjectBySlug(slug)
  if (!project) return { title: 'Project' }
  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/solutions/${slug}`,
    imageUrl: resolveOgImage(null, null, project.title, project.sectors[0]),
  })
}

async function getImpactUpdates(projectId: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'impact-updates',
      where: { project: { equals: projectId } },
      sort: '-date',
      limit: 12,
    })
    return result.docs.map((doc) => ({
      id: String(doc.id),
      date: doc.date,
      title: doc.title,
      body: doc.body,
      metrics:
        doc.metrics?.map((m) => ({ label: m.label || '', value: m.value || '' })).filter((m) => m.label && m.value) ??
        [],
    }))
  } catch {
    return []
  }
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getAtlasProjectBySlug(slug)
  if (!project) notFound()

  const [related, impactUpdates] = await Promise.all([
    getRelatedAtlasProjects(slug, project.sectors),
    getImpactUpdates(project.id),
  ])

  return (
    <div className="solutions-tailwind solution-detail-page min-h-screen bg-white">
      <div className="solution-detail-page__stage">
        <SiteNav variant="light" activeLink="/solutions" />
        <ProjectPortfolio project={project} related={related} impactUpdates={impactUpdates} />
      </div>
      <SiteFooter />
    </div>
  )
}
