import Image from 'next/image'
import Link from 'next/link'
import { MagCarouselRow } from '@/components/magazine/MagCarouselRow'
import type { MagCardItem } from '@/components/magazine/MagCard'
import { OpportunityApplyAction } from '@/components/programmes/OpportunityApplyAction'
import { hasExternalApplication } from '@/lib/programmes/application'
import { formatProgrammeDateRange } from '@/lib/programmes/dates'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { isProgrammeClosed } from '@/lib/programmes/status'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'
import { OPPORTUNITY_TYPE_LABELS, type Programme } from '@/lib/programmes/types'

type ProgrammeDetailProps = {
  programme: Programme
  related?: MagCardItem[]
}

export function ProgrammeDetail({ programme, related = [] }: ProgrammeDetailProps) {
  const isOpen = !isProgrammeClosed(programme)
  const image = getProgrammeImageUrl(programme.slug, 1600, 900)
  const dateRange = formatProgrammeDateRange(programme.applicationOpenDate, programme.applicationCloseDate)
  const typeLabel = OPPORTUNITY_TYPE_LABELS[programme.opportunityType]
  const externalApply = hasExternalApplication(programme.applicationUrl)

  return (
    <>
      <section className="mag-article-hero">
        <Image src={image} alt="" fill priority sizes="100vw" />
        <div className="mag-spread__shade" />
        <div className="mag-wrap mag-article-hero__copy">
          <p className="mag-breadcrumb">
            Home · Opportunities · {typeLabel}
          </p>
          <h1>{programme.title}</h1>
          {programme.description ? (
            <p className="mag-excerpt mag-excerpt--full" style={{ color: 'rgba(255,255,255,.82)', maxWidth: '52ch' }}>
              {programme.description}
            </p>
          ) : null}
          <p className="mag-meta" style={{ color: 'rgba(255,255,255,.78)', marginTop: 16 }}>
            {isOpen ? 'Applications open' : 'Applications closed'}
            {programme.eyebrow ? ` · ${programme.eyebrow}` : ''}
          </p>
        </div>
      </section>

      <section className="mag-article-body">
        <div className="mag-wrap mag-two">
          <div>
            {programme.applicationInstructions ? (
              <>
                <p className="mag-news__eyebrow">How to apply</p>
                <h2 style={{ fontSize: 32, margin: '8px 0 16px' }}>Ready when you are</h2>
                <div className="mag-excerpt mag-excerpt--full" style={{ whiteSpace: 'pre-line' }}>
                  {programme.applicationInstructions}
                </div>
              </>
            ) : (
              <>
                <p className="mag-news__eyebrow">{typeLabel}</p>
                <h2 style={{ fontSize: 32, margin: '8px 0 16px' }}>{programme.title}</h2>
                {programme.description ? <p className="mag-excerpt mag-excerpt--full">{programme.description}</p> : null}
              </>
            )}
            <Link href={OPPORTUNITIES_PATH} className="mag-link" style={{ display: 'inline-block', marginTop: 28 }}>
              ← All opportunities
            </Link>
          </div>

          <aside className="mag-contact-card">
            <p className="mag-news__eyebrow">Apply</p>
            <h2>Join this programme</h2>
            {dateRange ? <p className="mag-meta" style={{ marginBottom: 12 }}>{dateRange}</p> : null}
            <p className="mag-excerpt mag-excerpt--full">
              {isOpen
                ? externalApply
                  ? 'Apply through the host organisation’s form. You’ll be taken to their site in a new tab.'
                  : 'Submit your application and our team will review it within two weeks.'
                : 'This programme is not accepting applications right now. Check back later or explore other opportunities.'}
            </p>
            <div style={{ marginTop: 24 }}>
              {isOpen ? (
                <OpportunityApplyAction
                  title={programme.title}
                  opportunityType={programme.opportunityType}
                  applicationUrl={programme.applicationUrl}
                  triggerClassName="mag-btn"
                />
              ) : (
                <Link href={OPPORTUNITIES_PATH} className="mag-btn">
                  Browse open opportunities
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>
      <MagCarouselRow
        title="More opportunities"
        href={OPPORTUNITIES_PATH}
        items={related}
        seeMoreLabel="See all opportunities"
        seeMoreSubtitle="Programmes, grants, and fellowships"
      />
    </>
  )
}
