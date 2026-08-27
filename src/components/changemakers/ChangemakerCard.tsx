import Image from 'next/image'
import Link from 'next/link'
import type { ChangemakerProfile } from '@/lib/cms/organizations'
import { SECTOR_LABELS, type Sector } from '@/lib/solutions/types'

function formatOrgType(type: string): string {
  return type
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function categoryLabel(org: ChangemakerProfile): string {
  const focus = org.focusAreas[0]
  if (focus && focus in SECTOR_LABELS) return SECTOR_LABELS[focus as Sector]
  if (focus) return formatOrgType(focus)
  return formatOrgType(org.type)
}

type ChangemakerCardProps = {
  org: ChangemakerProfile
  compact?: boolean
}

export function ChangemakerCard({ org, compact = false }: ChangemakerCardProps) {
  const meta =
    org.hqLocation ||
    `${org.projects.length} project${org.projects.length === 1 ? '' : 's'} in the atlas`
  const summary = org.tagline || 'Climate solutions organisation'

  return (
    <Link
      href={`/changemakers/${org.slug}`}
      className={`changemaker-card block text-inherit no-underline${compact ? ' changemaker-card--compact' : ''}`}
    >
      <article className="changemaker-card__inner">
        <div className="changemaker-card__logo">
          {org.logoUrl ? (
            <Image
              src={org.logoUrl}
              alt={org.name}
              fill
              sizes={compact ? '44vw' : '(max-width: 768px) 33vw, 20vw'}
              className="object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="changemaker-card__initials">{initials(org.name)}</span>
          )}
        </div>

        <h3 className="changemaker-card__name">{org.name}</h3>
        <span className="changemaker-card__pill">{categoryLabel(org)}</span>
        <p className="changemaker-card__meta">{meta}</p>
        <p className="changemaker-card__summary">{summary}</p>
      </article>
    </Link>
  )
}
