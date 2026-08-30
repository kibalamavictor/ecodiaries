'use client'

import { useState, type ComponentType } from 'react'
import {
  Camera,
  Feather,
  Microscope,
  PenLine,
  Sparkles,
  Video,
} from 'lucide-react'
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
import { ContributorApplicationSuccess } from '@/components/contributors/ContributorApplicationSuccess'
import { ContributorTypeFields } from '@/components/contributors/ContributorTypeFields'
import { PhotoSquareCrop } from '@/components/contributors/PhotoSquareCrop'
import { trackEvent } from '@/lib/analytics-client'
import {
  buildContributorApplication,
  categoryLabel,
  detailReviewRows,
  EMPTY_CONTRIBUTOR_APPLICATION,
  syncDetailsWithTypes,
  toApiSubmissionBody,
  zodIssuesToFieldErrors,
} from '@/lib/contributors/application-helpers'
import {
  basicInfoSchema,
  contributionDetailSchema,
  contributionTypesSchema,
  contributorApplicationSchema,
  detailsStepSchema,
} from '@/lib/contributors/schema'
import type { ContributorApplication, ContributorCategory, ContributionDetails } from '@/lib/contributors/types'

const STEPS = ['Basic info', 'Contribution type', 'Details', 'Review'] as const

const TYPE_OPTIONS: {
  value: ContributorCategory
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
}[] = [
  { value: 'writer', label: 'Writer', description: 'Reported stories, essays, and field dispatches', icon: PenLine },
  {
    value: 'photographer',
    label: 'Photographer',
    description: 'Documentary and editorial photography from the field',
    icon: Camera,
  },
  { value: 'filmmaker', label: 'Filmmaker', description: 'Short docs, field reports, and video essays', icon: Video },
  {
    value: 'researcher',
    label: 'Researcher',
    description: 'Science translation and evidence-based explainers',
    icon: Microscope,
  },
  { value: 'poet', label: 'Poet', description: 'Poetry and creative writing on climate and place', icon: Feather },
  { value: 'other', label: 'Other', description: 'Audio, illustration, or another format', icon: Sparkles },
]

function validateDetailFields(details: ContributionDetails[]): Record<string, string> {
  const errors: Record<string, string> = {}
  details.forEach((detail, index) => {
    const parsed = contributionDetailSchema.safeParse(detail)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const suffix = issue.path.length ? issue.path.join('.') : 'type'
        const key = `details.${index}.${suffix}`
        if (!errors[key]) errors[key] = issue.message
      }
    }
  })
  return errors
}

export function ContributorApplicationWizard() {
  const [step, setStep] = useState(0)
  const [application, setApplication] = useState<ContributorApplication>(EMPTY_CONTRIBUTOR_APPLICATION)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const { basicInfo, contributionTypes, details, photo } = application

  function clearErrors() {
    setFieldErrors({})
    setSubmitMessage('')
    if (submitState === 'error') setSubmitState('idle')
  }

  function goToStep(next: number) {
    clearErrors()
    setStep(next)
  }

  function toggleType(type: ContributorCategory) {
    clearErrors()
    const nextTypes = contributionTypes.includes(type)
      ? contributionTypes.filter((t) => t !== type)
      : [...contributionTypes, type]
    setApplication((prev) => ({
      ...prev,
      contributionTypes: nextTypes,
      details: syncDetailsWithTypes(nextTypes, prev.details),
    }))
  }

  function updateDetail(index: number, next: ContributionDetails) {
    clearErrors()
    setApplication((prev) => {
      const updated = [...prev.details]
      updated[index] = next
      return { ...prev, details: updated }
    })
  }

  function validateStep(current: number): boolean {
    if (current === 0) {
      const parsed = basicInfoSchema.safeParse(basicInfo)
      if (!parsed.success) {
        setFieldErrors(zodIssuesToFieldErrors(parsed.error.issues))
        return false
      }
      return true
    }

    if (current === 1) {
      const parsed = contributionTypesSchema.safeParse(contributionTypes)
      if (!parsed.success) {
        setFieldErrors({ contributionTypes: parsed.error.issues[0]?.message || 'Select at least one type' })
        return false
      }
      return true
    }

    if (current === 2) {
      const detailErrors = validateDetailFields(details)
      const stepParsed = detailsStepSchema.safeParse({
        contributionTypes,
        details,
        photo: { croppedPreviewUrl: photo.croppedPreviewUrl },
      })
      const merged: Record<string, string> = { ...detailErrors }
      if (!stepParsed.success) {
        Object.assign(merged, zodIssuesToFieldErrors(stepParsed.error.issues))
      }
      if (Object.keys(merged).length) {
        setFieldErrors(merged)
        return false
      }
      return true
    }

    return true
  }

  function goNext() {
    if (!validateStep(step)) return
    goToStep(Math.min(step + 1, STEPS.length - 1))
  }

  function resetWizard() {
    setApplication(EMPTY_CONTRIBUTOR_APPLICATION)
    setTurnstileToken('')
    setFieldErrors({})
    setSubmitState('idle')
    setSubmitMessage('')
    setStep(0)
  }

  async function onSubmit() {
    if (!validateStep(2)) {
      setStep(2)
      return
    }

    const payload = buildContributorApplication(application)
    const apiBody = toApiSubmissionBody(payload, turnstileToken)
    const parsed = contributorApplicationSchema.safeParse(apiBody)

    if (!parsed.success) {
      setSubmitState('error')
      setSubmitMessage(parsed.error.issues[0]?.message || 'Please complete all required fields')
      return
    }

    if (process.env.NODE_ENV === 'development') {
    }

    setSubmitState('loading')
    try {
      const res = await fetch('/api/contributors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSubmitState('success')
      trackEvent('Contributor Application')
    } catch (err) {
      setSubmitState('error')
      setSubmitMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (submitState === 'success') {
    return (
      <FormScope>
        <ContributorApplicationSuccess onApplyAgain={resetWizard} />
      </FormScope>
    )
  }

  return (
    <FormScope>
      <FormShell>
        <FormProgress steps={[...STEPS]} currentStep={step} />

        {step === 0 ? (
          <div className="space-y-4">
            <FormField>
              <FormLabel htmlFor="contributor-name">Full name</FormLabel>
              <FormInput
                id="contributor-name"
                data-testid="contributor-name"
                value={basicInfo.name}
                onChange={(e) =>
                  setApplication((prev) => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, name: e.target.value },
                  }))
                }
              />
              {fieldErrors.name ? <p className="text-sm text-red-600">{fieldErrors.name}</p> : null}
            </FormField>
            <FormField>
              <FormLabel htmlFor="contributor-email">Email</FormLabel>
              <FormInput
                id="contributor-email"
                data-testid="contributor-email"
                type="email"
                value={basicInfo.email}
                onChange={(e) =>
                  setApplication((prev) => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, email: e.target.value },
                  }))
                }
              />
              {fieldErrors.email ? <p className="text-sm text-red-600">{fieldErrors.email}</p> : null}
            </FormField>
            <FormField>
              <FormLabel htmlFor="contributor-region">Location / region</FormLabel>
              <FormInput
                id="contributor-region"
                data-testid="contributor-region"
                value={basicInfo.region}
                onChange={(e) =>
                  setApplication((prev) => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, region: e.target.value },
                  }))
                }
              />
              {fieldErrors.region ? <p className="text-sm text-red-600">{fieldErrors.region}</p> : null}
            </FormField>
            <FormField>
              <FormLabel htmlFor="contributor-bio">Short bio</FormLabel>
              <FormTextarea
                id="contributor-bio"
                data-testid="contributor-bio"
                rows={4}
                maxLength={200}
                value={basicInfo.bio}
                onChange={(e) =>
                  setApplication((prev) => ({
                    ...prev,
                    basicInfo: { ...prev.basicInfo, bio: e.target.value },
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">{basicInfo.bio.length}/200</p>
              {fieldErrors.bio ? <p className="text-sm text-red-600">{fieldErrors.bio}</p> : null}
            </FormField>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">Select all that apply. Choose at least one to continue.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {TYPE_OPTIONS.map((option) => (
                <SelectableCard
                  key={option.value}
                  selected={contributionTypes.includes(option.value)}
                  onClick={() => toggleType(option.value)}
                  icon={option.icon}
                  title={option.label}
                  description={option.description}
                />
              ))}
            </div>
            {fieldErrors.contributionTypes ? (
              <p className="mt-3 text-sm text-red-600">{fieldErrors.contributionTypes}</p>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            {details.map((detail, index) => (
              <ContributorTypeFields
                key={detail.type}
                detail={detail}
                index={index}
                onChange={updateDetail}
                errors={fieldErrors}
              />
            ))}
            <PhotoSquareCrop
              value={photo}
              onChange={(next) => {
                clearErrors()
                setApplication((prev) => ({ ...prev, photo: next }))
              }}
              error={fieldErrors['photo.croppedPreviewUrl'] || fieldErrors.photo}
            />
            {fieldErrors.details ? <p className="text-sm text-red-600">{fieldErrors.details}</p> : null}
          </div>
        ) : null}

        {step === 3 ? (
          <FormReviewPanel title="Review your application" subtitle="Check each section before you submit.">
            <ReviewSection title="Basic info" onEdit={() => goToStep(0)}>
              <ReviewRow label="Name" value={basicInfo.name} />
              <ReviewRow label="Email" value={basicInfo.email} />
              <ReviewRow label="Region" value={basicInfo.region} />
              <ReviewTextBlock>{basicInfo.bio}</ReviewTextBlock>
            </ReviewSection>

            <ReviewSection title="Contribution type" onEdit={() => goToStep(1)}>
              <ReviewRow
                label="Types"
                value={contributionTypes.map((t) => categoryLabel(t)).join(' · ')}
              />
            </ReviewSection>

            <ReviewSection title="Type-specific details" onEdit={() => goToStep(2)}>
              {details.map((detail) => (
                <div key={detail.type} className="mt-3 border-t border-border pt-3 first:mt-0 first:border-0 first:pt-0">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-forest">
                    {categoryLabel(detail.type)}
                  </p>
                  {detailReviewRows(detail).map((row) => (
                    <ReviewRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </div>
              ))}
            </ReviewSection>

            <ReviewSection title="Photo" onEdit={() => goToStep(2)}>
              {photo.croppedPreviewUrl ? (
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-brand-lime">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.croppedPreviewUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-sm text-brand-forest">Square crop attached</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No photo</p>
              )}
            </ReviewSection>

            <div className="rounded-lg border border-border bg-white p-3">
              <TurnstileWidget onToken={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
            </div>
          </FormReviewPanel>
        ) : null}

        <FormActions
          onBack={step > 0 ? () => goToStep(step - 1) : undefined}
          showBack={step > 0}
          onNext={step < STEPS.length - 1 ? goNext : onSubmit}
          isFinal={step === STEPS.length - 1}
          finalLabel="Submit application"
          loading={submitState === 'loading'}
        />
        {submitState === 'error' ? <FormStatusMessage state={submitState} message={submitMessage} /> : null}
      </FormShell>
    </FormScope>
  )
}
