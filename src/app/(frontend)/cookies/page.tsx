import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { cookiePolicy } from '@/content/legal'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'How EcoDiaries uses cookies and similar technologies across the site, including the Solutions Atlas.',
}

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title={cookiePolicy.title}
      sections={cookiePolicy.sections}
      lastUpdated={cookiePolicy.lastUpdated}
    />
  )
}
