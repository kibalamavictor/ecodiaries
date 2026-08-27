'use client'

import { useState } from 'react'
import { TurnstileWidget } from '@/components/forms/TurnstileWidget'
import {
  FormActions,
  FormField,
  FormInput,
  FormLabel,
  FormProgress,
  FormReviewPanel,
  FormStatusMessage,
  FormTextarea,
  ReviewRow,
  ReviewSection,
  ReviewTextBlock,
} from '@/components/forms/eco-form'
import { SolutionFormDialog } from '@/components/solutions/SolutionFormDialog'
import { trackEvent } from '@/lib/analytics-client'
import { supportInterestSchema } from '@/lib/forms/schemas'

type SupportWorkModalProps = {
  solutionTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportWorkModal({ solutionTitle, open, onOpenChange }: SupportWorkModalProps) {
  const steps = ['Your details', 'Message', 'Review']
  const [step, setStep] = useState(0)
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [body, setBody] = useState(`I would like to learn more about supporting "${solutionTitle}".`)

  function resetOnClose() {
    setStep(0)
    setState('idle')
    setMessage('')
  }

  function goNext() {
    if (step === 0) {
      const parsed = supportInterestSchema.pick({ name: true, email: true }).safeParse({ name, email })
      if (!parsed.success) {
        setState('error')
        setMessage(parsed.error.issues[0]?.message || 'Check your details')
        return
      }
    }
    if (step === 1) {
      const parsed = supportInterestSchema.pick({ message: true }).safeParse({ message: body })
      if (!parsed.success) {
        setState('error')
        setMessage(parsed.error.issues[0]?.message || 'Add more detail')
        return
      }
    }
    setState('idle')
    setMessage('')
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  async function onSubmit() {
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          reason: 'A partnership',
          message: `Interest in supporting: ${solutionTitle}\nOrganization: ${organization || 'N/A'}\n\n${body}`,
          turnstileToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setState('success')
      setMessage('Thank you — our partnerships team will follow up shortly.')
      trackEvent('Solution Support Interest')
      onOpenChange(false)
      resetOnClose()
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <SolutionFormDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) resetOnClose()
      }}
      title="Support this work"
      description={
        <>
          Express interest in funding or partnering on{' '}
          <strong className="font-semibold text-brand-forest">{solutionTitle}</strong>.
        </>
      }
    >
      <FormProgress steps={steps} currentStep={step} />

      {step === 0 ? (
        <div className="space-y-4">
          <FormField>
            <FormLabel htmlFor="support-name">Your name</FormLabel>
            <FormInput id="support-name" value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField>
            <FormLabel htmlFor="support-email">Email</FormLabel>
            <FormInput id="support-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField>
            <FormLabel htmlFor="support-org">Organization (optional)</FormLabel>
            <FormInput id="support-org" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          </FormField>
        </div>
      ) : null}

      {step === 1 ? (
        <FormField>
          <FormLabel htmlFor="support-message">Message</FormLabel>
          <FormTextarea id="support-message" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
        </FormField>
      ) : null}

      {step === 2 ? (
        <FormReviewPanel title="Review your interest" subtitle="Confirm details before we route this to our partnerships team.">
          <ReviewSection title="Solution">
            <ReviewRow label="Project" value={solutionTitle} />
          </ReviewSection>
          <ReviewSection title="Contact" onEdit={() => setStep(0)}>
            <ReviewRow label="Name" value={name} />
            <ReviewRow label="Email" value={email} />
            <ReviewRow label="Organization" value={organization || '—'} />
          </ReviewSection>
          <ReviewSection title="Message" onEdit={() => setStep(1)}>
            <ReviewTextBlock>{body}</ReviewTextBlock>
          </ReviewSection>
          <div className="rounded-lg border border-border bg-white p-3">
            <TurnstileWidget onToken={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
          </div>
        </FormReviewPanel>
      ) : null}

      <FormActions
        onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
        showBack={step > 0}
        onNext={step < steps.length - 1 ? goNext : onSubmit}
        isFinal={step === steps.length - 1}
        finalLabel="Send interest"
        loading={state === 'loading'}
      />
      <FormStatusMessage state={state} message={message} />
    </SolutionFormDialog>
  )
}
