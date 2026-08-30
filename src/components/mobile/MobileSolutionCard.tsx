import Image from 'next/image'
import Link from 'next/link'
import type { AtlasProject } from '@/lib/solutions/types'
import { MobileCardText } from '@/components/mobile/MobileCardText'

type MobileSolutionCardProps = {
  solution: Pick<
    AtlasProject,
    'slug' | 'title' | 'summary' | 'coverImageUrl' | 'status' | 'organization'
  >
  statusLabel: string
}

function OrgAvatar({ name, logoUrl }: { name: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-black/10"
      />
    )
  }

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-lime/20 text-[9px] font-bold text-brand-forest ring-1 ring-black/10">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export function MobileSolutionCard({ solution, statusLabel }: MobileSolutionCardProps) {
  const orgName = solution.organization?.name || 'Independent changemaker'
  const orgLogo = solution.organization?.logoUrl

  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="mobile-scroll-card flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
    >
      <div className="mobile-scroll-card__media relative">
        <Image
          src={solution.coverImageUrl}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 767px) 82vw, 320px"
        />
        <span className="absolute left-2 top-2 max-w-[90%] truncate rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.03em] text-white">
          {statusLabel}
        </span>
      </div>
      <MobileCardText title={solution.title} description={solution.summary}>
        <div className="mobile-scroll-card__org-row">
          <OrgAvatar name={orgName} logoUrl={orgLogo} />
          <span className="mobile-scroll-card__org-name">{orgName}</span>
        </div>
      </MobileCardText>
    </Link>
  )
}
