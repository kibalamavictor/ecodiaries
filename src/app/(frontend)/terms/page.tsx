import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { termsOfUse } from '@/content/legal'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms governing your use of EcoDiaries — including stories, the Solutions Atlas, organisation profiles, and community features.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout
      title={termsOfUse.title}
      sections={termsOfUse.sections}
      lastUpdated={termsOfUse.lastUpdated}
    />
  )
}
