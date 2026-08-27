'use client'

import { useState, type ComponentType } from 'react'
import { FileText, GraduationCap, Handshake, HelpCircle, UserPlus } from 'lucide-react'
import { TurnstileWidget } from '@/components/forms/TurnstileWidget'
import {
  FormActions,
  FormField,
  FormInput,
  FormLabel,
  FormProgress,
  FormReviewPanel,
  FormScope,
  FormShell,
  FormStatusMessage,
  FormTextarea,
  ReviewRow,
  ReviewSection,
  ReviewTextBlock,
  SelectableCard,
} from '@/components/forms/eco-form'
import { trackEvent } from '@/lib/analytics-client'
import {
  contactDetailsSchema,
  contactMessageSchema,
  contactReasonSchema,
  contactReasons,
  type ContactReason,
} from '@/lib/forms/schemas'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const REASON_OPTIONS: {
  value: ContactReason
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
}[] = [
  { value: 'A story tip', label: 'Story tip', description: 'Pitch a climate story or field report', icon: FileText },
  {
    value: 'Becoming a contributor',
    label: 'Contributor',
    description: 'Apply to write, photograph, or report for EcoDiaries',
    icon: UserPlus,
  },
  {
    value: 'A partnership',
    label: 'Partnership',
    description: 'Fund, collaborate, or scale solutions with us',
    icon: Handshake,
  },
  {
    value: 'Programmes & training',
    label: 'Programmes',
    description: 'Join a storytelling or youth reporting programme',
    icon: GraduationCap,
  },
  { value: 'Something else', label: 'Something else', description: 'General questions or other inquiries', icon: HelpCircle },
]

type ContactWizardProps = {
  defaultReason?: ContactReason
  programme?: string
  defaultBody?: string
}

export function ContactWizard({ defaultReason, programme, defaultBody }: ContactWizardProps) {
  const steps = ['Your details', 'Topic', 'Message', 'Review']
  const [step, setStep] = useState(0)
  const [state, setState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState<ContactReason>(defaultReason || contactReasons[0])
  const [body, setBody] = useState(
    programme ? `I am interested in the programme: ${programme}.\n\n` : defaultBody || '',
  )
  const [organization, setOrganization] = useState('')

  function goNext() {
    if (step === 0) {
      const parsed = contactDetailsSchema.safeParse({ name, email })
      if (!parsed.success) {
        setState('error')
        setMessage(parsed.error.issues[0]?.message || 'Check your details')
        return
      }
    }
    if (step === 1) {
      const parsed = contactReasonSchema.safeParse({ reason })
      if (!parsed.success) {
        setState('error')
        setMessage('Select a topic')
        return
      }
    }
    if (step === 2) {
      const parsed = contactMessageSchema.safeParse({ message: body, organization })
      if (!parsed.success) {
        setState('error')
        setMessage(parsed.error.issues[0]?.message || 'Check your message')
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
      const fullMessage =
        reason === 'A partnership' && organization
          ? `Organization: ${organization}\n\n${body}`
          : programme
            ? `${body}\n\nProgramme: ${programme}`
            : body

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          reason,
          message: fullMessage,
          programme,
          turnstileToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setState('success')
      setMessage('Message sent. We will respond within 2 business days.')
      trackEvent('Contact Submit')
      setName('')
      setEmail('')
      setBody(programme ? `I am interested in the programme: ${programme}.\n\n` : '')
      setOrganization('')
      setTurnstileToken('')
      setStep(0)
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <FormScope>
      <FormShell>
        <FormProgress steps={steps} currentStep={step} />

        {step === 0 ? (
          <div className="space-y-4">
            <FormField>
              <FormLabel htmlFor="contact-name">Full name</FormLabel>
              <FormInput id="contact-name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField>
              <FormLabel htmlFor="contact-email">Email</FormLabel>
              <FormInput id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {REASON_OPTIONS.map((option) => (
              <SelectableCard
                key={option.value}
                selected={reason === option.value}
                onClick={() => setReason(option.value)}
                icon={option.icon}
                title={option.label}
                description={option.description}
              />
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            {reason === 'A partnership' ? (
              <FormField>
                <FormLabel htmlFor="contact-org">Organization</FormLabel>
                <FormInput
                  id="contact-org"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Your organization (optional)"
                />
              </FormField>
            ) : null}
            <FormField>
              <FormLabel htmlFor="contact-message">Message</FormLabel>
              <FormTextarea
                id="contact-message"
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tell us what you'd like to share…"
              />
            </FormField>
          </div>
        ) : null}

        {step === 3 ? (
          <FormReviewPanel title="Review your message" subtitle="Check everything looks right before sending.">
            <ReviewSection title="Your details" onEdit={() => setStep(0)}>
              <ReviewRow label="Name" value={name} />
              <ReviewRow label="Email" value={email} />
            </ReviewSection>
            <ReviewSection title="Topic" onEdit={() => setStep(1)}>
              <ReviewRow label="Reason" value={reason} />
            </ReviewSection>
            <ReviewSection title="Message" onEdit={() => setStep(2)}>
              {organization ? <ReviewRow label="Organization" value={organization} /> : null}
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
          finalLabel="Send message"
          loading={state === 'loading'}
        />
        <FormStatusMessage state={state} message={message} />
      </FormShell>
    </FormScope>
  )
}

export const ContactForm = ContactWizard
