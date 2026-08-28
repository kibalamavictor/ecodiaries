'use client'

import Link from 'next/link'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  if (typeof console !== 'undefined') {
    console.error(error)
  }
  return (
    <MagPageShell>
      <div className="mag-empty">
        <MagPageIntro
          eyebrow="Something went wrong"
          title="We hit a snag loading this page"
          lede="It’s not you — please try again, or head home while we sort things out."
        >
          <div className="mag-actions">
            <button type="button" className="mag-btn" onClick={() => reset()}>
              Try again
            </button>
            <Link href="/" className="mag-tag">
              Home
            </Link>
          </div>
        </MagPageIntro>
      </div>
    </MagPageShell>
  )
}
