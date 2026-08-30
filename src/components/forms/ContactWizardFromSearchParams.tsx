'use client'

import { useSearchParams } from 'next/navigation'
import { ContactWizard } from '@/components/forms/ContactWizard'
import type { ContactReason } from '@/lib/forms/schemas'

const REASON_FROM_QUERY: Record<string, ContactReason> = {
  partnership: 'A partnership',
  atlas: 'A partnership',
  contributor: 'Becoming a contributor',
  programmes: 'Programmes & training',
  story: 'A story tip',
}

const ATLAS_PREFILL =
  "I'd like to feature our climate project on the Solutions Atlas.\n\nOrganization:\nProject name:\nRegion:\nBrief description:\n\n"

export function ContactWizardFromSearchParams() {
  const searchParams = useSearchParams()
  const raw = searchParams.get('reason') || ''
  const topic = searchParams.get('topic') || ''
  const defaultReason = REASON_FROM_QUERY[raw.toLowerCase()]
  const defaultBody =
    topic === 'atlas' || raw.toLowerCase() === 'atlas' ? ATLAS_PREFILL : undefined

  return <ContactWizard defaultReason={defaultReason} defaultBody={defaultBody} />
}
