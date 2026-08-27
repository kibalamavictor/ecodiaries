import Link from 'next/link'

const DEFAULT_TRUST_CHIPS = ['Field-documented', 'Community-rooted', 'Partner-ready'] as const

function buildMarqueeTrack(items: readonly string[]): string[] {
  if (!items.length) return []

  const track = [...items]
  while (track.length < 6) track.push(...items)
  return [...track, ...track]
}

type FundingCtaBandProps = {
  eyebrow?: string
  title?: string
  chips?: readonly string[]
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
  className?: string
}

export function FundingCtaBand({
  eyebrow = 'For funders & partners',
  title = "Partner with us to scale what's working",
  chips = DEFAULT_TRUST_CHIPS,
  ctaLabel = 'Start a conversation',
  ctaHref = '/contact?reason=partnership',
  onCtaClick,
  className,
}: FundingCtaBandProps = {}) {
  const chipTrack = buildMarqueeTrack(chips)

  return (
    <section className={['funding-cta-section', className].filter(Boolean).join(' ')} id="partner">
      <div className="funding-cta-card">
        <p className="funding-cta-card__eyebrow" aria-hidden>
          {eyebrow}
        </p>
        <h2 className="funding-cta-card__title">{title}</h2>
        <div className="funding-cta-card__chips" aria-label={eyebrow}>
          <div className="funding-cta-card__chips-track">
            {chipTrack.map((chip, index) => (
              <span key={`${chip}-${index}`} className="funding-cta-card__chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="funding-cta-card__cta-wrap">
          {onCtaClick ? (
            <button type="button" className="funding-cta-card__cta" onClick={onCtaClick}>
              {ctaLabel}
            </button>
          ) : (
            <Link href={ctaHref} className="funding-cta-card__cta">
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
