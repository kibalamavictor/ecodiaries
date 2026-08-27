'use client'

import Link from 'next/link'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteNav } from '@/components/layout/SiteNav'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <>
      <div className="on-dark">
        <SiteNav variant="light" />
        <div className="wrap section" style={{ paddingTop: 72, paddingBottom: 72, minHeight: '52vh' }}>
          <span className="eyebrow">Something went wrong</span>
          <h1 className="mt-16" style={{ fontSize: 'clamp(30px, 4vw, 46px)', maxWidth: 640 }}>
            We hit a snag loading this page
          </h1>
          <p className="lede text-muted">
            It&apos;s not you — please try again, or head home while we sort things out.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => reset()}>
              Try again
            </button>
            <Link href="/" className="btn btn-outline">
              Home
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
