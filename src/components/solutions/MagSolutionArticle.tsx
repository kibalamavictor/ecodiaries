import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { isLexicalDocument } from '@/lib/cms/richtext'
import { SolutionDetailActions } from '@/components/solutions/SolutionDetailActions'
import { SECTOR_LABELS, STATUS_LABELS, type AtlasProject } from '@/lib/solutions/types'

function locationLabel(project: AtlasProject): string | null {
  const parts = [project.locationName, project.region, project.country].filter(Boolean)
  if (!parts.length) return null
  return [...new Set(parts)].join(', ')
}

export function MagSolutionArticle({ project }: { project: AtlasProject }) {
  const location = locationLabel(project)
  const stage = STATUS_LABELS[project.status]
  const documented = project.publishedAt
    ? new Date(project.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null
  const facts = [
    { label: 'Location', value: location },
    { label: 'Stage', value: stage },
    { label: 'Documented', value: documented },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value))
  const impact = project.keyImpact.filter((item) => item.label && item.value).slice(0, 4)
  const gallery = project.gallery.filter((item) => item.url).slice(0, 4)
  const hasBody = isLexicalDocument(project.body)
  const sector = project.sectors[0] ? SECTOR_LABELS[project.sectors[0]] : 'Solutions'

  return (
    <>
      {project.summary ? <p className="mag-excerpt mag-excerpt--full mag-single__lede">{project.summary}</p> : null}

      {facts.length ? (
        <ul className="mag-single__meta-facts">
          {facts.map((fact) => (
            <li key={fact.label}>
              <span className="mag-meta">{fact.label}</span>
              <strong>{fact.value}</strong>
            </li>
          ))}
        </ul>
      ) : null}

      {impact.length ? (
        <>
          <h2>Impact on the ground</h2>
          <div className="mag-stat-row mag-single__facts">
            {impact.map((item) => (
              <div key={item.label}>
                <div className="num">
                  {item.value}
                  {item.unit ? ` ${item.unit}` : ''}
                </div>
                <div className="label">{item.label}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {hasBody ? (
        <>
          <h2>How it works</h2>
          <RichText data={project.body as never} />
        </>
      ) : null}

      {project.organization ? (
        <>
          <h2>Led by</h2>
          <p>
            <Link href={`/changemakers/${project.organization.slug}`} className="mag-link">
              {project.organization.name}
            </Link>
            {project.organization.tagline ? ` — ${project.organization.tagline}` : null}
          </p>
        </>
      ) : null}

      {gallery.length ? (
        <>
          <h2>From the field</h2>
          <div className="mag-single__gallery">
            {gallery.map((item, index) => (
              <figure key={`${item.url}-${index}`}>
                <span className="mag-single__gallery-media">
                  <Image src={item.url} alt={item.caption || `${project.title} ${index + 1}`} fill sizes="(max-width: 980px) 100vw, 40vw" />
                </span>
                {item.caption ? <figcaption className="mag-meta">{item.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </>
      ) : null}

      <h2>Support this {sector.toLowerCase()} work</h2>
      <SolutionDetailActions title={project.title} slug={project.slug} />
    </>
  )
}
