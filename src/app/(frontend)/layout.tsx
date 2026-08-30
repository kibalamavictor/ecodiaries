import type { Metadata, Viewport } from 'next'
import './globals.css'
import './magazine.css'
import './magazine-mobile.css'
import { inter, marcellus, montserrat } from './fonts'
import { PlausibleAnalytics } from '@/components/analytics/Plausible'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
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
    <html lang="en" className={`${inter.variable} ${marcellus.variable} ${montserrat.variable} ${inter.className}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '.magazine-mobile,.magazine-mobile-archive,.mobile-browse-bar,.mobile-browse-sheet{display:none}@media (max-width:639px){.magazine-desktop,.magazine-desktop-archive{display:none}.magazine-mobile,.magazine-mobile-archive{display:block}}',
          }}
        />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
      </head>
      <body>
        <OrganizationJsonLd />
        {children}
        <PlausibleAnalytics />
      </body>
    </html>
  )
}
