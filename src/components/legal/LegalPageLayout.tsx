import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'

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

function linkifyText(text: string) {
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
    <MagPageShell>
      <div className="mag-section" style={{ paddingTop: 12 }}>
        <MagPageIntro
          eyebrow="Legal"
          title={title}
          lede={lastUpdated ? `Last updated ${lastUpdated}` : undefined}
        />
        <div className="mag-wrap mag-legal">
          {sections.map((section, index) => {
            const sectionId = `legal-section-${index}`
            return (
              <section key={section.heading} aria-labelledby={sectionId}>
                <h2 id={sectionId}>{section.heading}</h2>
                <div>{renderBodyBlocks(section.body)}</div>
              </section>
            )
          })}
        </div>
      </div>
    </MagPageShell>
  )
}
