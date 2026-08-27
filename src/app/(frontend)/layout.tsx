import type { Metadata, Viewport } from 'next'
import './globals.css'
import './mobile-cards.css'
import { baloo, inter } from './fonts'
import { PlausibleAnalytics } from '@/components/analytics/Plausible'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
import { ClientEnhancements } from '@/components/layout/ClientEnhancements'
import { absoluteUrl } from '@/lib/seo'

const SITE_DESCRIPTION =
  'EcoDiaries documents African climate solutions and community stories — from farms and forests to youth-led energy access.'

export const metadata: Metadata = {
  title: {
    default: 'EcoDiaries | African Climate Solutions and Stories',
    template: '%s · EcoDiaries',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(absoluteUrl('/')),
  openGraph: {
    title: 'EcoDiaries | African Climate Solutions and Stories',
    description: SITE_DESCRIPTION,
    type: 'website',
    siteName: 'EcoDiaries',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/logo.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0B3E1F',
  width: 'device-width',
  initialScale: 1,
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${inter.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="preconnect" href="https://plausible.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
      </head>
      <body>
        <OrganizationJsonLd />
        {children}
        <ClientEnhancements />
        <PlausibleAnalytics />
      </body>
    </html>
  )
}
