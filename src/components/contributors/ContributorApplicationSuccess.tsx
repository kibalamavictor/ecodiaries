'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { FormShell } from '@/components/forms/eco-form'

type ContributorApplicationSuccessProps = {
  onApplyAgain: () => void
}

export function ContributorApplicationSuccess({ onApplyAgain }: ContributorApplicationSuccessProps) {
  return (
    <FormShell className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-lime/20">
        <CheckCircle2 className="h-9 w-9 text-brand-green" aria-hidden />
      </div>
      <h3 className="mt-6 font-display text-2xl font-bold text-brand-forest">Application received</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
        Thank you for applying to contribute to EcoDiaries. Our editorial team will review your application and respond
        within two weeks.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/stories"
          className="inline-flex justify-center rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-forest"
        >
          Read latest stories
        </Link>
        <button
          type="button"
          onClick={onApplyAgain}
          className="inline-flex justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-brand-forest"
        >
          Submit another application
        </button>
      </div>
    </FormShell>
  )
}
