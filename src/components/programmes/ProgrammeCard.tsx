'use client'

import Image from 'next/image'
import Link from 'next/link'
import { OpportunityApplyAction } from '@/components/programmes/OpportunityApplyAction'
import { formatClosingCapsule } from '@/lib/programmes/dates'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { isProgrammeClosed } from '@/lib/programmes/status'
import { opportunityDetailPath } from '@/lib/programmes/routes'
import { OPPORTUNITY_TYPE_LABELS, type ProgrammeCardData } from '@/lib/programmes/types'
import './programme-card.css'

export type { ProgrammeCardData }

export function ProgrammeCard({ programme }: { programme: ProgrammeCardData }) {
  const image = getProgrammeImageUrl(programme.slug)
  const isOpen = !isProgrammeClosed(programme)
  const closingLabel = formatClosingCapsule(programme.applicationCloseDate)
  const typeLabel = OPPORTUNITY_TYPE_LABELS[programme.opportunityType]

  return (
    <article id={programme.slug} className="programme-grid-card">
      <Link href={opportunityDetailPath(programme.slug)} className="programme-grid-card__main">
        <div className="programme-grid-card__media">
          <Image
            src={image}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            className="programme-grid-card__image"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="programme-grid-card__type">{typeLabel}</span>
          <span className={`programme-grid-card__status ${isOpen ? 'is-open' : 'is-closed'}`}>
            <span className="programme-grid-card__status-dot" aria-hidden />
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <div className="programme-grid-card__body">
          <h3 className="programme-grid-card__title">{programme.title}</h3>
          {programme.description ? (
            <p className="programme-grid-card__description">{programme.description}</p>
          ) : null}
        </div>
      </Link>

      <div className="programme-grid-card__footer">
        <div className="programme-grid-card__divider" role="presentation" />
        <div className="programme-grid-card__footer-row">
          {closingLabel ? <span className="programme-grid-card__closes">{closingLabel}</span> : null}
          {isOpen ? (
            <OpportunityApplyAction
              title={programme.title}
              opportunityType={programme.opportunityType}
              applicationUrl={programme.applicationUrl}
              triggerClassName="programme-grid-card__apply"
            />
          ) : (
            <span className="programme-grid-card__apply programme-grid-card__apply--disabled">
              Applications closed
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
