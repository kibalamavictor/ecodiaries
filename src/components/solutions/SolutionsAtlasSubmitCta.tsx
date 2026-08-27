import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { ArrowRightIcon } from '@/components/icons'

const BULLETS = [
  'Reach funders, partners, and field reporters',
  'Showcase impact with maps, metrics, and media',
  'Join a verified atlas of African climate solutions',
]

export function SolutionsAtlasSubmitCta() {
  return (
    <section className="atlas-submit-cta" aria-labelledby="atlas-submit-cta-title">
      <div className="atlas-submit-cta__inner">
        <div className="atlas-submit-cta__icon" aria-hidden>
          <MapPin className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="atlas-submit-cta__body">
          <p className="atlas-submit-cta__eyebrow">Solutions Atlas</p>
          <h2 id="atlas-submit-cta-title" className="atlas-submit-cta__title">
            Feature your climate project
          </h2>
          <p className="atlas-submit-cta__lede">
            Changemakers and organizations — list your initiative on our Solutions Atlas so journalists,
            funders, and communities can discover and support your work.
          </p>
          <ul className="atlas-submit-cta__bullets">
            {BULLETS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="atlas-submit-cta__actions">
            <Link href="/contact?reason=partnership&topic=atlas" className="atlas-submit-cta__primary">
              Submit your project
              <ArrowRightIcon />
            </Link>
            <Link href="/solutions" className="atlas-submit-cta__secondary">
              Browse the atlas
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
