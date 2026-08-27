'use client'

import { useState, type ReactNode } from 'react'
import { TurnstileWidget } from '@/components/forms/TurnstileWidget'
import {
  FormActions,
  FormField,
  FormInput,
  FormLabel,
  FormProgress,
  FormScope,
  FormStatusMessage,
  FormTextarea,
  FormReviewPanel,
  ReviewRow,
  ReviewSection,
  ReviewTextBlock,
} from '@/components/forms/eco-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { trackEvent } from '@/lib/analytics-client'
import { programmeApplicationSchema } from '@/lib/forms/schemas'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type ProgrammeApplicationWizardProps = {
  programmeName: string
  triggerClassName?: string
  triggerLabel?: ReactNode
}

export function ProgrammeApplicationWizard({
  programmeName,
  triggerClassName = 'programme-apply-btn',
  triggerLabel = 'Apply now',
}: ProgrammeApplicationWizardProps) {
  const steps = ['Your details', 'Background', 'Motivation', 'Review']
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [state, setState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [background, setBackground] = useState('')
  const [motivation, setMotivation] = useState('')

  function resetOnClose() {
    setStep(0)
    setState('idle')
    setMessage('')
  }

  function goNext() {
    const payload = { name, email, background, motivation, programme: programmeName }
    if (step === 0) {
      const parsed = programmeApplicationSchema.pick({ name: true, email: true }).safeParse(payload)
      if (!parsed.success) {
        setState('error')
        setMessage(parsed.error.issues[0]?.message || 'Check your details')
        return
      }
    }
    if (step === 1) {
      const parsed = programmeApplicationSchema.pick({ background: true }).safeParse(payload)
      if (!parsed.success) {
        setState('error')
        setMessage(parsed.error.issues[0]?.message || 'Add more background')
        return
      }
    }
    if (step === 2) {
      const parsed = programmeApplicationSchema.pick({ motivation: true }).safeParse(payload)
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
          reason: 'Programmes & training',
          programme: programmeName,
          message: `Programme application: ${programmeName}\n\nBackground:\n${background}\n\nMotivation:\n${motivation}`,
          turnstileToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setState('success')
      setMessage('Application submitted. We will respond within two weeks.')
      trackEvent('Programme Application')
      setName('')
      setEmail('')
      setBackground('')
      setMotivation('')
      setTurnstileToken('')
      setStep(0)
      setOpen(false)
      resetOnClose()
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) resetOnClose()
        }}
      >
        <DialogContent className="border-border bg-white sm:max-w-lg">
          <FormScope>
            <DialogHeader>
              <DialogTitle className="text-brand-forest">Apply to {programmeName}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Tell us about your background and why this programme is the right fit. We respond within two weeks.
            </p>

            <FormProgress steps={steps} currentStep={step} />

            {step === 0 ? (
              <div className="space-y-4">
                <FormField>
                  <FormLabel htmlFor={`prog-name-${programmeName}`}>Full name</FormLabel>
                  <FormInput id={`prog-name-${programmeName}`} value={name} onChange={(e) => setName(e.target.value)} />
                </FormField>
                <FormField>
                  <FormLabel htmlFor={`prog-email-${programmeName}`}>Email</FormLabel>
                  <FormInput
                    id={`prog-email-${programmeName}`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormField>
              </div>
            ) : null}

            {step === 1 ? (
              <FormField>
                <FormLabel htmlFor={`prog-bg-${programmeName}`}>Your background</FormLabel>
                <FormTextarea
                  id={`prog-bg-${programmeName}`}
                  rows={5}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Experience, studies, or storytelling work so far…"
                />
              </FormField>
            ) : null}

            {step === 2 ? (
              <FormField>
                <FormLabel htmlFor={`prog-mot-${programmeName}`}>Why this programme?</FormLabel>
                <FormTextarea
                  id={`prog-mot-${programmeName}`}
                  rows={5}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="What do you hope to learn or publish?"
                />
              </FormField>
            ) : null}

            {step === 3 ? (
              <FormReviewPanel title="Review your application" subtitle={`Applying to ${programmeName}`}>
                <ReviewSection title="Programme">
                  <ReviewRow label="Name" value={programmeName} />
                </ReviewSection>
                <ReviewSection title="Your details" onEdit={() => setStep(0)}>
                  <ReviewRow label="Name" value={name} />
                  <ReviewRow label="Email" value={email} />
                </ReviewSection>
                <ReviewSection title="Background" onEdit={() => setStep(1)}>
                  <ReviewTextBlock>{background}</ReviewTextBlock>
                </ReviewSection>
                <ReviewSection title="Motivation" onEdit={() => setStep(2)}>
                  <ReviewTextBlock>{motivation}</ReviewTextBlock>
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
              finalLabel="Submit application"
              loading={state === 'loading'}
            />
            <FormStatusMessage state={state} message={message} />
          </FormScope>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** @deprecated Use ProgrammeApplicationWizard */
export const ProgrammeApplicationForm = ProgrammeApplicationWizard
