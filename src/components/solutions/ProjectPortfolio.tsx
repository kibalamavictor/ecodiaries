'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CircleCheck, ChevronRight, Download, Mail, X } from 'lucide-react'
import { isLexicalDocument } from '@/lib/cms/richtext'
import { ProjectIntentModal, type IntentType } from '@/components/solutions/ProjectIntentModal'
import { FundingCtaBand } from '@/components/solutions/FundingCtaBand'
import {
  buildPortfolioKeyFacts,
  ProjectPortfolioKeyFactsStrip,
} from '@/components/solutions/ProjectPortfolioKeyFactsStrip'
import { SolutionCardStatusBadge } from '@/components/solutions/mobile/SolutionMobileCardParts'
import { SolutionCoverTransition } from '@/components/solutions/mobile/SolutionCoverTransition'
import { StagePill } from '@/components/solutions/StagePill'
import { isLikelyStockCoverImage, stockCoverImageMessage } from '@/lib/solutions/cover-image-audit'
import type { AtlasProject, Sector, VerificationTier } from '@/lib/solutions/types'
import { SECTOR_LABELS, STATUS_LABELS } from '@/lib/solutions/types'

type ProjectPortfolioProps = {
  project: AtlasProject
  related: AtlasProject[]
  impactUpdates: { id: string; date: string; title: string; body: unknown; metrics: { label: string; value: string }[] }[]
}

const SECTOR_COLOR: Record<Sector, string> = {
  energy: '#f6d211',
  water: '#1f6f8b',
  agriculture: '#4ba62b',
  biodiversity: '#2fa84f',
  pollution: '#7d1f3f',
  'climate-justice': '#0e3a1d',
}

const VERIFICATION_BADGE: Partial<Record<VerificationTier, string>> = {
  self_reported: 'Self-reported',
  field_reported: 'Field-reported',
  independently_verified: 'Verified',
}

function verificationLabel(tier?: VerificationTier | null): string | null {
  if (!tier) return null
  return VERIFICATION_BADGE[tier] ?? null
}

function formatOrgType(type: string): string {
  return type
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function locationLabel(project: AtlasProject): string | null {
  const parts = [project.locationName, project.region, project.country].filter(Boolean)
  if (!parts.length) return null
  return [...new Set(parts)].join(', ')
}

function documentedLabel(publishedAt: string): string | null {
  if (!publishedAt) return null
  const date = new Date(publishedAt)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function fundingStatusPrefix(project: AtlasProject): string | null {
  if (project.fundingStatus === 'seeking') return 'Seeking'
  if (project.fundingStatus === 'partial') return 'Raising'
  if (project.fundingStatus === 'funded') return 'Funded'
  return null
}

function parseFundingAmount(raw: string): { value: number; prefix: string; suffix: string; decimals: number } | null {
  const match = raw.trim().match(/^([^\d]*?)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null

  const numeric = Number(match[2].replace(/,/g, ''))
  if (Number.isNaN(numeric)) return null

  const fractional = match[2].includes('.') ? (match[2].split('.')[1]?.length ?? 0) : 0

  return {
    value: numeric,
    prefix: match[1],
    suffix: match[3],
    decimals: fractional,
  }
}

function formatFundingValue(value: number, decimals: number): string {
  if (decimals > 0) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return Math.round(value).toLocaleString('en-US')
}

function fundingAskVisible(project: AtlasProject): boolean {
  const need = project.fundingNeed
  return Boolean(
    need?.amount ||
      need?.useOfFunds ||
      (project.fundingStatus !== 'not_seeking' && fundingStatusPrefix(project)),
  )
}

function useOfFundsItems(text?: string | null): string[] {
  if (!text) return []
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
}

function useSolutionDetailNavHeight() {
  useLayoutEffect(() => {
    const stage = document.querySelector('.solution-detail-page__stage') as HTMLElement | null
    const nav = stage?.querySelector('.site-nav')
    if (!stage || !nav) return

    const syncNavHeight = () => {
      const { height } = nav.getBoundingClientRect()
      stage.style.setProperty('--solution-detail-nav-height', `${Math.ceil(height)}px`)
    }

    syncNavHeight()

    const observer = new ResizeObserver(syncNavHeight)
    observer.observe(nav)

    window.addEventListener('resize', syncNavHeight)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncNavHeight)
    }
  }, [])
}

export function ProjectPortfolio({ project }: ProjectPortfolioProps) {
  const [intent, setIntent] = useState<IntentType | null>(null)

  useSolutionDetailNavHeight()

  const verification = verificationLabel(project.verificationTier)
  const location = locationLabel(project)
  const documented = documentedLabel(project.publishedAt)
  const stage = STATUS_LABELS[project.status]
  const impactItems = project.keyImpact.filter((item) => item.label && item.value).slice(0, 4)
  const hasHeroImage = Boolean(project.coverImageUrl?.trim())
  const askItems = useOfFundsItems(project.fundingNeed?.useOfFunds)
  const showAsk = fundingAskVisible(project)
  const hasBody = isLexicalDocument(project.body)
  const galleryItems = project.gallery.filter((item) => item.url).slice(0, 5)
  const partnerNames = (project.partnerOrgs ?? []).filter(Boolean)

  const keyFacts = [
    { label: 'Location', value: location },
    { label: 'Stage', value: stage },
    { label: 'Documented', value: documented },
  ].filter((fact) => fact.value)

  const keyFactsStrip = buildPortfolioKeyFacts({ location, stage, documented })
  const showStockCoverFlag = isLikelyStockCoverImage(project.coverImageUrl)

  function openIntent(type: IntentType) {
    setIntent(type)
  }

  return (
    <>
      <article className="project-portfolio">
        {/* 1 — Hero (full-bleed to viewport top, under floating nav) */}
        <div className={`project-portfolio__hero${hasHeroImage ? '' : ' project-portfolio__hero--fallback'}`}>
          {hasHeroImage ? (
            <SolutionCoverTransition
              slug={project.slug}
              src={project.coverImageUrl}
              imageClassName="project-portfolio__hero-image"
              sizes="100vw"
              priority
            />
          ) : null}
          <div className="project-portfolio__hero-tint" aria-hidden />
          <div className="project-portfolio__hero-badges">
            <div className="project-portfolio__hero-badge-slot project-portfolio__hero-badge-slot--start">
              <span className="md:hidden">
                <SolutionCardStatusBadge status={project.status} />
              </span>
              <span className="hidden md:inline-flex">
                <StagePill status={project.status} variant="overlay" />
              </span>
            </div>
            {verification ? (
              <div className="project-portfolio__hero-badge-slot project-portfolio__hero-badge-slot--end">
                <span className="project-portfolio__verified-badge">{verification}</span>
              </div>
            ) : null}
          </div>
        </div>

        {showStockCoverFlag ? (
          <p className="project-portfolio__cover-flag md:hidden" role="status">
            {stockCoverImageMessage()}
          </p>
        ) : null}

        <div className="project-portfolio__spine">
          {/* 2 — Intro */}
          <section className="project-portfolio__intro">
            {project.sectors.length ? (
              <>
                <div className="project-portfolio__sector-pills md:hidden" role="list">
                  {project.sectors.map((sector) => (
                    <span key={sector} className="project-portfolio__sector-pill" role="listitem">
                      {SECTOR_LABELS[sector]}
                    </span>
                  ))}
                </div>
                <p className="project-portfolio__eyebrow project-portfolio__eyebrow--categories hidden md:flex">
                  {project.sectors.map((sector, index) => (
                    <span key={sector} className="project-portfolio__category">
                      {index > 0 ? <span className="project-portfolio__category-sep"> · </span> : null}
                      <span
                        className="project-portfolio__category-dot"
                        style={{ background: SECTOR_COLOR[sector] ?? '#4ba62b' }}
                        aria-hidden
                      />
                      {SECTOR_LABELS[sector]}
                    </span>
                  ))}
                </p>
              </>
            ) : null}

            <h1 className="project-portfolio__title">{project.title}</h1>

            {project.summary ? <p className="project-portfolio__thesis">{project.summary}</p> : null}

            {keyFacts.length ? (
              <div className="project-portfolio__facts hidden md:grid">
                {keyFacts.map((fact, index) => (
                  <div
                    key={fact.label}
                    className={`project-portfolio__fact${index < keyFacts.length - 1 ? ' project-portfolio__fact--divider' : ''}`}
                  >
                    <span className="project-portfolio__fact-label">{fact.label}</span>
                    <span className="project-portfolio__fact-value">{fact.value}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <ProjectPortfolioKeyFactsStrip facts={keyFactsStrip} />
          </section>

          {/* 3 — Impact band */}
          {impactItems.length ? <ImpactBand items={impactItems} /> : null}

          {/* 4 — How it works */}
          {hasBody ? (
            <section className="project-portfolio__story" aria-labelledby="project-story-heading">
              <p id="project-story-heading" className="project-portfolio__section-eyebrow">
                How it works
              </p>
              <div className="project-portfolio__richtext">
                <RichText data={project.body as never} />
              </div>
            </section>
          ) : null}

          {/* 5 — Led by */}
          {project.organization ? (
            <section className="project-portfolio__led" aria-labelledby="project-led-heading">
              <p id="project-led-heading" className="project-portfolio__section-eyebrow">
                Led by
              </p>
              <Link href={`/changemakers/${project.organization.slug}`} className="project-portfolio__org-card">
                {project.organization.logoUrl ? (
                  <Image
                    src={project.organization.logoUrl}
                    alt=""
                    width={42}
                    height={42}
                    className="project-portfolio__org-avatar project-portfolio__org-avatar--image"
                  />
                ) : (
                  <span className="project-portfolio__org-avatar project-portfolio__org-avatar--initial" aria-hidden>
                    {project.organization.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="project-portfolio__org-copy">
                  <span className="project-portfolio__org-name">{project.organization.name}</span>
                  <span className="project-portfolio__org-meta">
                    {project.organization.type ? (
                      <span className="project-portfolio__org-type">{formatOrgType(project.organization.type)}</span>
                    ) : null}
                    {verification ? (
                      <span className="project-portfolio__org-verification">
                        <CircleCheck className="project-portfolio__org-verification-icon" aria-hidden />
                        {verification}
                      </span>
                    ) : null}
                  </span>
                </span>
                <ChevronRight className="project-portfolio__org-chevron" aria-hidden />
              </Link>
            </section>
          ) : null}

          {/* 6 — The ask */}
          {showAsk ? (
            <section className="project-portfolio__ask" aria-labelledby="project-ask-heading">
              <p id="project-ask-heading" className="project-portfolio__section-eyebrow">
                The ask
              </p>
              <div className="project-portfolio__ask-card">
                <FundingAskHeadline project={project} />
                {askItems.length ? (
                  <ul className="project-portfolio__ask-list">
                    {askItems.map((item) => (
                      <li key={item} className="project-portfolio__ask-item">
                        <CircleCheck className="project-portfolio__ask-icon" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ) : null}

          {partnerNames.length ? (
            <FundingCtaBand
              className="funding-cta-section--portfolio"
              eyebrow="Project partners"
              title="Partners backing this project"
              chips={partnerNames}
              ctaLabel="Join the partners"
              onCtaClick={() => openIntent('partner')}
            />
          ) : null}

          {/* Project gallery */}
          {galleryItems.length ? <ProjectGallery items={galleryItems} projectTitle={project.title} /> : null}

          {/* 7 — Action bar (desktop) */}
          <PortfolioActions className="project-portfolio__actions project-portfolio__actions--desktop" onSupport={() => openIntent('support')} onIntro={() => openIntent('intro')} onDownload={() => openIntent('download')} />
        </div>

        {/* 7 — Action bar (mobile sticky) */}
        <PortfolioActions className="project-portfolio__actions project-portfolio__actions--mobile" onSupport={() => openIntent('support')} onIntro={() => openIntent('intro')} onDownload={() => openIntent('download')} />
      </article>

      {intent ? (
        <ProjectIntentModal
          open={Boolean(intent)}
          onOpenChange={(open) => !open && setIntent(null)}
          intent={intent}
          projectId={project.id}
          projectTitle={project.title}
          organizationId={project.organization?.id}
          onePagerUrl={project.onePagerUrl || `/solutions/${project.slug}/brief`}
          donationUrl={project.organization?.donationUrl}
        />
      ) : null}
    </>
  )
}

type GalleryItem = { url: string; caption?: string }

const GALLERY_AUTO_ADVANCE_MS = 5000

function ProjectGallery({ items, projectTitle }: { items: GalleryItem[]; projectTitle: string }) {
  const reduce = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const activeScrollIndexRef = useRef(0)
  const [autoScrollPaused, setAutoScrollPaused] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const lightboxItem = lightboxIndex === null ? null : items[lightboxIndex]

  const pauseAutoScroll = useCallback(() => {
    setAutoScrollPaused(true)
  }, [])

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current
      const item = itemRefs.current[index]
      if (!container || !item) return

      const targetLeft = item.offsetLeft - container.offsetLeft
      container.scrollTo({
        left: targetLeft,
        behavior: reduce ? 'auto' : 'smooth',
      })
    },
    [reduce],
  )

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length)
  }, [items.length])

  useEffect(() => {
    if (items.length <= 1 || autoScrollPaused || reduce) return

    const timer = window.setInterval(() => {
      const next = (activeScrollIndexRef.current + 1) % items.length
      activeScrollIndexRef.current = next
      scrollToIndex(next)
    }, GALLERY_AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [autoScrollPaused, items.length, reduce, scrollToIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((index) => (index === null ? null : (index - 1 + items.length) % items.length))
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((index) => (index === null ? null : (index + 1) % items.length))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [lightboxIndex, items.length])

  function showPrev() {
    setLightboxIndex((index) => (index === null ? null : (index - 1 + items.length) % items.length))
  }

  function showNext() {
    setLightboxIndex((index) => (index === null ? null : (index + 1) % items.length))
  }

  return (
    <>
      <section className="project-portfolio__gallery" aria-labelledby="project-gallery-heading">
        <p id="project-gallery-heading" className="project-portfolio__section-eyebrow">
          Project gallery
        </p>
        <div
          ref={scrollRef}
          className="project-portfolio__gallery-scroll scrollbar-hide"
          aria-roledescription="carousel"
          onTouchStart={pauseAutoScroll}
          onPointerDown={pauseAutoScroll}
          onFocusCapture={pauseAutoScroll}
        >
          <ul className="project-portfolio__gallery-list">
            {items.map((item, index) => {
              const caption = item.caption?.trim() || `Image ${index + 1}`

              return (
                <li
                  key={`${item.url}-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  className="project-portfolio__gallery-item"
                >
                  <button
                    type="button"
                    className="project-portfolio__gallery-trigger"
                    onClick={() => {
                      pauseAutoScroll()
                      setLightboxIndex(index)
                    }}
                    aria-label={`View ${caption}`}
                  >
                    <span className="project-portfolio__gallery-media">
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        className="project-portfolio__gallery-image"
                        sizes="280px"
                      />
                    </span>
                    <span className="project-portfolio__gallery-caption">{caption}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {lightboxItem ? (
        <div
          className="project-portfolio__gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} gallery`}
          onClick={() => setLightboxIndex(null)}
        >
          <div className="project-portfolio__gallery-lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="project-portfolio__gallery-lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery"
            >
              <X aria-hidden />
            </button>
            {items.length > 1 ? (
              <>
                <button type="button" className="project-portfolio__gallery-lightbox-nav project-portfolio__gallery-lightbox-nav--prev" onClick={showPrev} aria-label="Previous image">
                  ‹
                </button>
                <button type="button" className="project-portfolio__gallery-lightbox-nav project-portfolio__gallery-lightbox-nav--next" onClick={showNext} aria-label="Next image">
                  ›
                </button>
              </>
            ) : null}
            <div className="project-portfolio__gallery-lightbox-media">
              <Image
                src={lightboxItem.url}
                alt=""
                fill
                className="project-portfolio__gallery-lightbox-image"
                sizes="100vw"
                priority
              />
            </div>
            <p className="project-portfolio__gallery-lightbox-caption">
              {lightboxItem.caption?.trim() || `Image ${(lightboxIndex ?? 0) + 1}`}
            </p>
            {items.length > 1 ? (
              <p className="project-portfolio__gallery-lightbox-count" aria-live="polite">
                {(lightboxIndex ?? 0) + 1} / {items.length}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}

type ParsedFundingAmount = { value: number; prefix: string; suffix: string; decimals: number }

function AnimatedFundingAmount({ parsed }: { parsed: ParsedFundingAmount }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [displayValue, setDisplayValue] = useState(reduce ? parsed.value : 0)

  useEffect(() => {
    if (!inView) return

    if (reduce) {
      setDisplayValue(parsed.value)
      return
    }

    let frame = 0
    let start: number | null = null
    const duration = 1500

    function tick(timestamp: number) {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplayValue(parsed.value * eased)
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }

    setDisplayValue(0)
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [inView, parsed.value, reduce])

  return (
    <span ref={ref} className="project-portfolio__ask-amount" aria-label={formatFundingValue(parsed.value, parsed.decimals)}>
      {parsed.prefix}
      {formatFundingValue(displayValue, parsed.decimals)}
      {parsed.suffix}
    </span>
  )
}

function FundingAskHeadline({ project }: { project: AtlasProject }) {
  const need = project.fundingNeed
  const statusPrefix = fundingStatusPrefix(project)
  const amountRaw = need?.amount?.trim()
  const parsed = amountRaw ? parseFundingAmount(amountRaw) : null
  const currencySuffix =
    need?.currency && amountRaw && !amountRaw.includes(need.currency) ? ` ${need.currency}` : ''

  if (amountRaw) {
    return (
      <h2 className="project-portfolio__ask-headline">
        {statusPrefix ? <>{statusPrefix} </> : null}
        {parsed ? <AnimatedFundingAmount parsed={parsed} /> : amountRaw}
        {currencySuffix}
      </h2>
    )
  }

  if (statusPrefix && need?.useOfFunds) {
    return <h2 className="project-portfolio__ask-headline">{statusPrefix} support</h2>
  }

  return null
}

type ImpactItem = { label: string; value: string; unit?: string }

function ImpactBand({ items }: { items: ImpactItem[] }) {
  const reduce = useReducedMotion()

  return (
    <motion.section
      className="project-portfolio__impact"
      aria-labelledby="project-impact-heading"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="project-portfolio__impact-glow" aria-hidden />
      <motion.p
        id="project-impact-heading"
        className="project-portfolio__impact-eyebrow"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        The impact
      </motion.p>
      <div className="project-portfolio__impact-stats">
        {items.map((item, index) => (
          <motion.div
            key={`${item.label}-${index}`}
            className={`project-portfolio__impact-stat${index < items.length - 1 ? ' project-portfolio__impact-stat--divider' : ''}`}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="project-portfolio__impact-value"
              initial={reduce ? false : { scale: 0.92 }}
              whileInView={reduce ? undefined : { scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: reduce ? 0 : 0.08 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.value}
              {item.unit ? <span className="project-portfolio__impact-unit"> {item.unit}</span> : null}
            </motion.p>
            <p className="project-portfolio__impact-label">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function PortfolioActions({
  className,
  onSupport,
  onIntro,
  onDownload,
}: {
  className: string
  onSupport: () => void
  onIntro: () => void
  onDownload: () => void
}) {
  return (
    <div className={className}>
      <button type="button" className="project-portfolio__action-primary" onClick={onSupport}>
        Support this work
      </button>
      <button type="button" className="project-portfolio__action-icon" onClick={onIntro} aria-label="Request an introduction">
        <Mail aria-hidden />
      </button>
      <button type="button" className="project-portfolio__action-icon" onClick={onDownload} aria-label="Download one-pager">
        <Download aria-hidden />
      </button>
    </div>
  )
}
