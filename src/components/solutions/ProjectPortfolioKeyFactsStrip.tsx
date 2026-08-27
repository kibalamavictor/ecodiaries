import { Calendar, MapPin, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type KeyFact = {
  label: string
  value: string
  icon: LucideIcon
}

type ProjectPortfolioKeyFactsStripProps = {
  facts: KeyFact[]
}

export function ProjectPortfolioKeyFactsStrip({ facts }: ProjectPortfolioKeyFactsStripProps) {
  if (!facts.length) return null

  return (
    <div
      className="project-portfolio__key-facts-strip"
      aria-label="Key facts"
      style={{ gridTemplateColumns: `repeat(${facts.length}, minmax(0, 1fr))` }}
    >
      {facts.map((fact, index) => (
        <div key={fact.label} className="project-portfolio__key-fact">
          {index > 0 ? <span className="project-portfolio__key-fact-divider" aria-hidden /> : null}
          <div className="project-portfolio__key-fact-cell">
            <fact.icon className="project-portfolio__key-fact-icon" strokeWidth={2.25} aria-hidden />
            <p className="project-portfolio__key-fact-value">{fact.value}</p>
            <p className="project-portfolio__key-fact-label">{fact.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function buildPortfolioKeyFacts(input: {
  location: string | null
  stage: string
  documented: string | null
}): KeyFact[] {
  const facts: KeyFact[] = []

  if (input.location) {
    facts.push({ label: 'Location', value: input.location, icon: MapPin })
  }
  if (input.stage) {
    facts.push({ label: 'Stage', value: input.stage, icon: TrendingUp })
  }
  if (input.documented) {
    facts.push({ label: 'Documented', value: input.documented, icon: Calendar })
  }

  return facts
}
