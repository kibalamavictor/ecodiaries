import Image from 'next/image'
import Link from 'next/link'
import { CircleCheck } from 'lucide-react'
import { RichTextContent } from '@/components/content/RichTextContent'
import { lexicalToPlainText } from '@/lib/cms/richtext'
import type { ChangemakerProfile } from '@/lib/cms/organizations'

const COVER_FALLBACK = (slug: string) => `https://picsum.photos/seed/${slug}-cover/1600/900`
const LOGO_FALLBACK = (slug: string) => `https://picsum.photos/seed/${slug}-logo/240/240`

function formatOrgType(type: string): string {
  return type
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function metaLine(org: ChangemakerProfile): string | null {
  const parts = [org.hqLocation, formatOrgType(org.type)].filter(Boolean)
  return parts.length ? parts.join(' · ') : null
}

function hasBio(bio: unknown): boolean {
  return Boolean(lexicalToPlainText(bio))
}

function orgInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

export function ChangemakerProfileHeader({ org }: { org: ChangemakerProfile }) {
  const coverSrc = org.coverUrl || COVER_FALLBACK(org.slug)
  const logoSrc = org.logoUrl || LOGO_FALLBACK(org.slug)
  const meta = metaLine(org)
  const impactTiles = org.aggregateImpact.filter((tile) => tile.label && tile.value).slice(0, 3)

  return (
    <>
      <section className="mag-article-hero">
        <Image src={coverSrc} alt="" fill priority sizes="100vw" />
        <div className="mag-spread__shade" />
        <div className="mag-wrap mag-article-hero__copy">
          <p className="mag-breadcrumb">Home · Changemakers · {formatOrgType(org.type)}</p>
          <h1>{org.name}</h1>
          {meta ? (
            <p className="mag-meta" style={{ color: 'rgba(255,255,255,.78)' }}>
              {org.verified ? 'Verified · ' : ''}
              {meta}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mag-wrap">
        <div className="mag-profile-panel">
          <div className="mag-profile-logo">
            {org.logoUrl ? (
              <Image src={logoSrc} alt="" fill sizes="88px" priority />
            ) : (
              <span aria-hidden>{orgInitial(org.name)}</span>
            )}
          </div>
          <div>
            {org.verified ? (
              <p className="mag-meta" style={{ marginBottom: 8 }}>
                <CircleCheck aria-hidden style={{ width: 14, height: 14, display: 'inline', marginRight: 6 }} />
                Verified organisation
              </p>
            ) : null}
            {org.tagline ? <p className="mag-excerpt mag-excerpt--full" style={{ maxWidth: '52ch' }}>{org.tagline}</p> : null}
            {hasBio(org.bio) ? (
              <div className="mag-excerpt mag-excerpt--full" style={{ marginTop: 16 }}>
                <RichTextContent data={org.bio} />
              </div>
            ) : null}
          </div>
          {org.website ? (
            <a href={org.website} target="_blank" rel="noopener noreferrer" className="mag-btn">
              Work with this org
            </a>
          ) : null}
        </div>

        {impactTiles.length ? (
          <div className="mag-stat-row" aria-label="Aggregate impact" style={{ marginBottom: 24 }}>
            {impactTiles.map((tile) => (
              <div key={`${tile.label}-${tile.value}`}>
                <div className="num">{tile.value}</div>
                <div className="label">{tile.label}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}
