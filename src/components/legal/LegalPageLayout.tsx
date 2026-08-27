import type { ReactNode } from 'react'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import './legal.css'

export type LegalSection = {
  heading: string
  body: string
}

type LegalPageLayoutProps = {
  title: string
  sections: LegalSection[]
  lastUpdated?: string
}

const EMAIL_PATTERN = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
const EMAIL_TEST = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function linkifyText(text: string): ReactNode[] {
  const parts = text.split(EMAIL_PATTERN)
  return parts.map((part, index) =>
    EMAIL_TEST.test(part) ? (
      <a key={`${part}-${index}`} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      part
    ),
  )
}

function renderBodyBlocks(body: string) {
  const blocks = body.split(/\n\n+/).map((block) => block.trim()).filter(Boolean)
  if (!blocks.length) return null

  return blocks.map((block, index) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    const isBulletList = lines.length > 1 && lines.every((line) => /^[-•*]\s+/.test(line))
    const isNumberedList = lines.length > 1 && lines.every((line) => /^\d+[.)]\s+/.test(line))

    if (isBulletList) {
      return (
        <ul key={index}>
          {lines.map((line) => (
            <li key={line}>{linkifyText(line.replace(/^[-•*]\s+/, ''))}</li>
          ))}
        </ul>
      )
    }

    if (isNumberedList) {
      return (
        <ol key={index}>
          {lines.map((line) => (
            <li key={line}>{linkifyText(line.replace(/^\d+[.)]\s+/, ''))}</li>
          ))}
        </ol>
      )
    }

    return <p key={index}>{linkifyText(block.replace(/\n/g, ' '))}</p>
  })
}

export function LegalPageLayout({ title, sections, lastUpdated }: LegalPageLayoutProps) {
  return (
    <>
      <div className="legal-page">
        <div className="legal-page__nav">
          <SiteNav variant="dark" />
        </div>
        <article className="legal-page__inner">
          <header className="legal-page__header">
            <p className="legal-page__eyebrow">Legal</p>
            <h1 className="legal-page__title">{title}</h1>
            {lastUpdated ? <p className="legal-page__updated">Last updated: {lastUpdated}</p> : null}
            <div className="legal-page__divider" role="presentation" />
          </header>

          {sections.map((section, index) => {
            const sectionId = `legal-section-${index}`
            return (
            <section key={section.heading} className="legal-page__section" aria-labelledby={sectionId}>
              <h2 className="legal-page__section-title" id={sectionId}>
                {section.heading}
              </h2>
              <div className="legal-page__prose">{renderBodyBlocks(section.body)}</div>
            </section>
            )
          })}
        </article>
      </div>
      <SiteFooter />
    </>
  )
}
