import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { privacyPolicy } from '@/content/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How EcoDiaries collects, uses, and protects your information across stories, the Solutions Atlas, and organisation profiles.',
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title={privacyPolicy.title}
      sections={privacyPolicy.sections}
      lastUpdated={privacyPolicy.lastUpdated}
    />
  )
}
