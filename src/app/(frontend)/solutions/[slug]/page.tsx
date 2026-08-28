import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { MagSinglePost } from '@/components/magazine/MagSinglePost'
import { MagSolutionArticle } from '@/components/solutions/MagSolutionArticle'
import { getAtlasProjectBySlug, getAtlasProjects, getRelatedAtlasProjects } from '@/lib/cms/solutions-page'
import { buildPageMetadata } from '@/lib/seo'
import { byline, formatMagDate, sectorLabel, uniquifyMagCards } from '@/lib/magazine'
import { environmentImageForKey } from '@/lib/unsplash-environment'
import type { AtlasProject } from '@/lib/solutions/types'

type Props = { params: Promise<{ slug: string }> }

function toCard(project: AtlasProject) {
  return {
    href: `/solutions/${project.slug}`,
    image: project.coverImageUrl,
    category: sectorLabel(project.sectors[0]),
    title: project.title,
    excerpt: project.summary,
    byline: byline(project.region, formatMagDate(project.publishedAt)),
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getAtlasProjectBySlug(slug)
  if (!project) return { title: 'Project' }
  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/solutions/${slug}`,
    imageUrl: project.coverImageUrl || undefined,
  })
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getAtlasProjectBySlug(slug)
  if (!project) notFound()

  const related = await getRelatedAtlasProjects(slug, project.sectors, 4)
  const extras =
    related.length >= 4
      ? related
      : (await getAtlasProjects()).filter((item) => item.slug !== slug).slice(0, 4)
  const sidebarItems = uniquifyMagCards(extras.slice(0, 4).map(toCard))
  const category = sectorLabel(project.sectors[0])
  const hero = project.coverImageUrl || sidebarItems[0]?.image || environmentImageForKey(`solution:${slug}`)

  return (
    <MagPageShell>
      <MagSinglePost
        category={category}
        title={project.title}
        image={hero}
        imageAlt={project.title}
        byline={byline(project.organization?.name || project.region, formatMagDate(project.publishedAt))}
        avatar={project.organization?.logoUrl}
        sidebarTitle="Latest Post"
        sidebarItems={sidebarItems}
      >
        <MagSolutionArticle project={project} />
      </MagSinglePost>
    </MagPageShell>
  )
}
