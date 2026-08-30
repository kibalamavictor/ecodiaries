'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FormActions,
  FormField,
  FormInput,
  FormLabel,
  FormStatusMessage,
  FormTextarea,
} from '@/components/forms/eco-form'
import { SolutionFormDialog } from '@/components/solutions/SolutionFormDialog'
import { submitInterestLead } from '@/app/(frontend)/solutions/actions'
import { trackEvent } from '@/lib/analytics-client'

export type IntentType = 'support' | 'partner' | 'intro' | 'download'

const INTENT_COPY: Record<IntentType, { title: string; description: string; cta: string }> = {
  support: {
    title: 'Support this work',
    description: 'Express funding interest. Our partnerships team will follow up — no payment on this site.',
    cta: 'Send interest',
  },
  partner: {
    title: 'Partner on this project',
    description: 'Tell us how your organisation could collaborate or scale this solution.',
    cta: 'Request partnership',
  },
  intro: {
    title: 'Request an introduction',
    description: 'We will connect you with the organisation behind this project.',
    cta: 'Request intro',
  },
  download: {
    title: 'Download one-pager',
    description: 'Receive a PDF brief and register your interest with the project team.',
    cta: 'Get one-pager',
  },
}

type ProjectIntentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  intent: IntentType
  projectId: string
  projectTitle: string
  organizationId?: string
  onePagerUrl?: string
  donationUrl?: string
}

export function ProjectIntentModal({
  open,
  onOpenChange,
  intent,
  projectId,
  projectTitle,
  organizationId,
  onePagerUrl,
  donationUrl,
}: ProjectIntentModalProps) {
  const copy = INTENT_COPY[intent]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  function reset() {
    setName('')
    setEmail('')
    setOrganization('')
    setMessage('')
    setConsent(false)
    setState('idle')
    setStatusMessage('')
  }

  async function onSubmit() {
    if (!consent) {
      setState('error')
      setStatusMessage('Please confirm we may contact you about this project.')
      return
    }
    setState('loading')
    const result = await submitInterestLead({
      projectId,
      organizationId,
      type: intent,
      name,
      email,
      organizationName: organization || undefined,
      message: message || `Interest in: ${projectTitle}`,
      consent: true,
    })
    if (!result.ok) {
      setState('error')
      setStatusMessage(result.error)
      return
    }
    setState('success')
    setStatusMessage('Thank you — we will be in touch shortly.')
    trackEvent(`Project Intent: ${intent}`)
    if (intent === 'download' && onePagerUrl) {
      window.open(onePagerUrl, '_blank', 'noopener,noreferrer')
    }
    setTimeout(() => {
      onOpenChange(false)
      reset()
    }, 1400)
  }

  return (
    <SolutionFormDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
      title={copy.title}
      description={
        <>
          {copy.description}{' '}
          <strong className="font-semibold text-brand-forest">{projectTitle}</strong>
        </>
      }
    >
      {intent === 'support' && donationUrl ? (
        <p className="mb-4 text-sm text-neutral-600">
          Or{' '}
          <Link
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-green underline underline-offset-2"
          >
            donate directly via the organisation
          </Link>
          .
        </p>
      ) : null}

      {state === 'success' ? (
        <div className="solution-form-dialog__success">{statusMessage}</div>
      ) : (
        <>
          <div className="space-y-4">
            <FormField>
              <FormLabel htmlFor="intent-name">Your name</FormLabel>
              <FormInput id="intent-name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField>
              <FormLabel htmlFor="intent-email">Email</FormLabel>
              <FormInput id="intent-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
            <FormField>
              <FormLabel htmlFor="intent-org">Organization (optional)</FormLabel>
              <FormInput id="intent-org" value={organization} onChange={(e) => setOrganization(e.target.value)} />
            </FormField>
            <FormField>
              <FormLabel htmlFor="intent-message">Message</FormLabel>
              <FormTextarea id="intent-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
            </FormField>
            <label className="solution-form-dialog__consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="solution-form-dialog__checkbox"
              />
              <span>
                I agree EcoDiaries may contact me about this project and share my details with the organisation behind
                it.
              </span>
            </label>
          </div>

          <FormActions onNext={onSubmit} isFinal finalLabel={copy.cta} loading={state === 'loading'} showBack={false} />
          <FormStatusMessage state={state} message={state === 'error' ? statusMessage : ''} />
        </>
      )}
    </SolutionFormDialog>
  )
}
