'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  NewsletterConfirmPanel,
  ReviewRow,
  ReviewSection,
} from '@/components/forms/eco-form'
import { trackEvent } from '@/lib/analytics-client'
import { newsletterSchema } from '@/lib/forms/schemas'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type NewsletterFormProps = {
  variant?: 'banner' | 'card' | 'magazine'
}

export function NewsletterForm({ variant = 'banner' }: NewsletterFormProps) {
  const steps = ['Email', 'Confirm']
  const [step, setStep] = useState(0)
  const [state, setState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  function goNext() {
    const parsed = newsletterSchema.safeParse({ email })
    if (!parsed.success) {
      setState('error')
      setMessage(parsed.error.issues[0]?.message || 'Enter a valid email')
      return
    }
    setState('idle')
    setMessage('')
    setStep(1)
  }

  async function onSubmit() {
    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setState('success')
      setMessage(data.message || 'Check your email to confirm your subscription.')
      trackEvent('Newsletter Signup')
      setEmail('')
      setTurnstileToken('')
      setStep(0)
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (variant === 'magazine') {
    return (
      <FormScope className="mag-news__form">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="mag-news__row"
            >
              <FormInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="mag-news__input"
              />
              <button type="button" onClick={goNext} className="mag-btn">
                Subscribe
              </button>
            </motion.div>
          ) : (
            <motion.div key="confirm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <NewsletterConfirmPanel email={email} onBack={() => setStep(0)} onConfirm={onSubmit} loading={state === 'loading'} />
              <div className="mt-3">
                <TurnstileWidget onToken={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <FormStatusMessage state={state} message={message} />
      </FormScope>
    )
  }

  if (variant === 'banner') {
    return (
      <FormScope className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-row items-center gap-2"
            >
              <FormInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-full border-0 bg-white px-3 py-2 text-sm shadow-sm"
              />
              <button
                type="button"
                onClick={goNext}
                className="shrink-0 rounded-full bg-brand-lime px-3 py-2 text-xs font-semibold text-brand-forest"
              >
                Subscribe
              </button>
            </motion.div>
          ) : (
            <motion.div key="confirm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <NewsletterConfirmPanel email={email} onBack={() => setStep(0)} onConfirm={onSubmit} loading={state === 'loading'} />
              <div className="mt-3 rounded-xl border border-brand-green/20 bg-white p-3">
                <TurnstileWidget onToken={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <FormStatusMessage state={state} message={message} />
      </FormScope>
    )
  }

  return (
    <FormScope>
      <FormShell>
        <FormProgress steps={steps} currentStep={step} />
        {step === 0 ? (
          <FormField>
            <FormLabel htmlFor="newsletter-email">Email address</FormLabel>
            <FormInput
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </FormField>
        ) : (
          <FormReviewPanel title="Confirm subscription" subtitle="Verify your email to join the EcoDiaries newsletter.">
            <ReviewSection title="Subscriber">
              <ReviewRow label="Email" value={email} />
            </ReviewSection>
            <TurnstileWidget onToken={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
          </FormReviewPanel>
        )}
        <FormActions
          onBack={step > 0 ? () => setStep(0) : undefined}
          showBack={step > 0}
          onNext={step === 0 ? goNext : onSubmit}
          isFinal={step === 1}
          finalLabel="Subscribe"
          loading={state === 'loading'}
        />
        <FormStatusMessage state={state} message={message} />
      </FormShell>
    </FormScope>
  )
}
