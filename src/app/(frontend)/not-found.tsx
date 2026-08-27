import Link from 'next/link'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'

export default function NotFound() {
  return (
    <MagPageShell>
      <div className="mag-empty">
        <MagPageIntro
          eyebrow="404"
          title="This page isn’t on the map"
          lede="The link may be outdated, or the page may have moved — let’s get you back to the stories."
        >
          <div className="mag-actions">
            <Link href="/" className="mag-btn">
              Home
            </Link>
            <Link href="/stories" className="mag-tag">
              Stories
            </Link>
            <Link href="/solutions" className="mag-tag">
              Solutions
            </Link>
          </div>
        </MagPageIntro>
      </div>
    </MagPageShell>
  )
}
