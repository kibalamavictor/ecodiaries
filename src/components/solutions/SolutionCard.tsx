import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CircleCheck } from 'lucide-react'
import {
  SECTOR_COLORS,
  SECTOR_LABELS,
  STATUS_LABELS,
  type AtlasProject,
  type Sector,
  type SolutionStatus,
  type VerificationTier,
} from '@/lib/solutions/types'
import './solution-card.css'

type SolutionCardProps = {
  solution: AtlasProject
}

const STATUS_DOT_COLORS: Record<SolutionStatus, string> = {
  piloted: '#8a8a8a',
  scaling: '#0B3E1F',
  established: '#1a1a1a',
}

const FALLBACK_DOT = '#0B3E1F'

const VERIFICATION_BADGE_LABELS: Partial<Record<VerificationTier, string>> = {
  self_reported: 'Self-reported',
  field_reported: 'Field-reported',
  independently_verified: 'Verified',
}

function sectorColor(sector?: Sector): string {
  if (!sector) return FALLBACK_DOT
  return SECTOR_COLORS[sector] ?? FALLBACK_DOT
}

function statusDotColor(status: SolutionStatus): string {
  return STATUS_DOT_COLORS[status] ?? FALLBACK_DOT
}

function verificationBadgeLabel(tier?: VerificationTier | null): string | null {
  if (!tier) return null
  return VERIFICATION_BADGE_LABELS[tier] ?? null
}

function OrgAvatar({ name, logoUrl }: { name: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={22}
        height={22}
        loading="lazy"
        decoding="async"
        className="solution-card__org-avatar solution-card__org-avatar--image"
      />
    )
  }

  return (
    <span className="solution-card__org-avatar solution-card__org-avatar--initial" aria-hidden>
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const primarySector = solution.sectors[0]
  const orgName = solution.organization?.name
  const orgLogo = solution.organization?.logoUrl
  const verificationLabel = verificationBadgeLabel(solution.verificationTier)
  const categoryColor = sectorColor(primarySector)

  return (
    <Link href={`/solutions/${solution.slug}`} className="solution-card">
      <div className="solution-card__media">
        <Image
          src={solution.coverImageUrl}
          alt=""
          fill
          loading="lazy"
          decoding="async"
          className="solution-card__image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {primarySector ? (
          <span
            className="solution-card__pill solution-card__pill--category"
            style={{ color: categoryColor, '--pill-dot': categoryColor } as CSSProperties}
          >
            <span className="solution-card__pill-dot" aria-hidden />
            {SECTOR_LABELS[primarySector]}
          </span>
        ) : null}
        <span
          className="solution-card__pill solution-card__pill--status"
          style={{ '--pill-dot': statusDotColor(solution.status) } as CSSProperties}
        >
          <span className="solution-card__pill-dot" aria-hidden />
          {STATUS_LABELS[solution.status]}
        </span>
      </div>

      <div className="solution-card__body">
        <h3 className="solution-card__title">{solution.title}</h3>
        <p className="solution-card__description" aria-hidden={!solution.summary}>
          {solution.summary || '\u00A0'}
        </p>

        <div className="solution-card__footer">
          <div className="solution-card__divider" role="presentation" />
          <div className="solution-card__org-row">
            {orgName ? (
              <>
                <OrgAvatar name={orgName} logoUrl={orgLogo} />
                <span className="solution-card__org-name">{orgName}</span>
              </>
            ) : null}
            {verificationLabel ? (
              <span className="solution-card__verification">
                <CircleCheck className="solution-card__verification-icon" aria-hidden />
                {verificationLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
