import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteNav } from '@/components/layout/SiteNav'
import { OpportunityApplyAction } from '@/components/programmes/OpportunityApplyAction'
import { hasExternalApplication } from '@/lib/programmes/application'
import { formatClosingCapsule, formatProgrammeDateRange } from '@/lib/programmes/dates'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { isProgrammeClosed } from '@/lib/programmes/status'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'
import { OPPORTUNITY_TYPE_LABELS, type Programme } from '@/lib/programmes/types'

type ProgrammeDetailProps = {
  programme: Programme
}

export function ProgrammeDetail({ programme }: ProgrammeDetailProps) {
  const isOpen = !isProgrammeClosed(programme)
  const image = getProgrammeImageUrl(programme.slug, 1200, 675)
  const dateRange = formatProgrammeDateRange(programme.applicationOpenDate, programme.applicationCloseDate)
  const typeLabel = OPPORTUNITY_TYPE_LABELS[programme.opportunityType]
  const externalApply = hasExternalApplication(programme.applicationUrl)

  return (
    <>
      <header className="programme-detail-hero bg-brand-forest text-white">
        <SiteNav variant="light" activeLink="/community" />
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-6">
          <Link href={OPPORTUNITIES_PATH} className="programme-detail-hero__back">
            <ArrowLeft className="programme-detail-hero__back-icon" aria-hidden />
            All opportunities
          </Link>

          <div className="programme-detail-hero__meta">
            <span className="programme-detail-hero__type">{typeLabel}</span>
            <span className={`programme-detail-hero__status ${isOpen ? 'is-open' : 'is-closed'}`}>
              {isOpen ? 'Applications open' : 'Applications closed'}
            </span>
            {programme.eyebrow ? <span className="programme-detail-hero__cadence">{programme.eyebrow}</span> : null}
          </div>

          <h1 className="programme-detail-hero__title">{programme.title}</h1>
          {programme.description ? <p className="programme-detail-hero__lede">{programme.description}</p> : null}
        </div>
      </header>

      <section className="programme-detail">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div>
            <div className="programme-detail__media">
              <Image
                src={image}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>

            {programme.applicationInstructions ? (
              <div className="programme-detail__section">
                <h2 className="programme-detail__heading">How to apply</h2>
                <div className="programme-detail__instructions whitespace-pre-line">
                  {programme.applicationInstructions}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="programme-detail__aside">
            <div className="programme-detail__apply-card">
              <h2 className="programme-detail__apply-title">Ready to join?</h2>
              {dateRange ? <p className="programme-detail__dates">{dateRange}</p> : null}
              <p className="programme-detail__apply-copy">
                {isOpen
                  ? externalApply
                    ? 'Apply through the host organisation’s application form. You’ll be taken to their site in a new tab.'
                    : 'Submit your application and our team will review it within two weeks.'
                  : 'This programme is not accepting applications right now. Check back later or explore other programmes.'}
              </p>
              {isOpen ? (
                <OpportunityApplyAction
                  title={programme.title}
                  opportunityType={programme.opportunityType}
                  applicationUrl={programme.applicationUrl}
                  triggerClassName="programme-detail__apply-btn"
                />
              ) : (
                <Link href={OPPORTUNITIES_PATH} className="programme-detail__apply-btn programme-detail__apply-btn--secondary">
                  Browse open opportunities
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
