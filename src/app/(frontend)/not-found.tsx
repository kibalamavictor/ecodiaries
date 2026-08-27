import Link from 'next/link'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteNav } from '@/components/layout/SiteNav'

export default function NotFound() {
  return (
    <>
      <div className="on-dark">
        <SiteNav variant="light" />
        <div className="wrap section" style={{ paddingTop: 72, paddingBottom: 72, minHeight: '52vh' }}>
          <span className="eyebrow">404</span>
          <h1 className="mt-16" style={{ fontSize: 'clamp(30px, 4vw, 46px)', maxWidth: 640 }}>
            This page isn&apos;t on the map
          </h1>
          <p className="lede text-muted">
            The link may be outdated, or the page may have moved — let&apos;s get you back to the stories.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-primary">
              Home
            </Link>
            <Link href="/stories" className="btn btn-outline">
              Stories
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
