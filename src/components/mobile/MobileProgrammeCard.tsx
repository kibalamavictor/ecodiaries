import Image from 'next/image'
import Link from 'next/link'
import { opportunityDetailPath } from '@/lib/programmes/routes'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { cn } from '@/lib/utils'
import type { ProgrammePreview } from '@/lib/types'

type MobileProgrammeCardProps = {
  programme: ProgrammePreview
}

export function MobileProgrammeCard({ programme }: MobileProgrammeCardProps) {
  const isOpen = programme.status !== 'closed'

  return (
    <Link
      href={opportunityDetailPath(programme.slug)}
      className="mobile-programme-card mobile-scroll-card"
    >
      <div className="mobile-programme-card__media">
        <Image
          src={getProgrammeImageUrl(programme.slug, 544, 408)}
          alt={programme.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 767px) 82vw, 320px"
        />
        <div className="mobile-programme-card__scrim" aria-hidden />
        <span
          className={cn(
            'mobile-programme-card__status',
            isOpen ? 'mobile-programme-card__status--open' : 'mobile-programme-card__status--closed',
          )}
        >
          {isOpen ? 'Open' : 'Closed'}
        </span>
        <h3 className="mobile-programme-card__title">{programme.title}</h3>
      </div>
    </Link>
  )
}
