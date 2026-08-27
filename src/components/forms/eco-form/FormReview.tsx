'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormEditLink } from './primitives'

export function FormReviewPanel({
  title = 'Review before you send',
  subtitle,
  children,
  className,
}: {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('overflow-hidden rounded-xl border border-brand-green/20 bg-brand-green/5', className)}
    >
      <div className="border-b border-brand-green/15 bg-brand-forest px-4 py-3 text-white sm:px-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-brand-lime" aria-hidden />
          <p className="text-sm font-semibold">{title}</p>
        </div>
        {subtitle ? <p className="mt-1 text-xs text-white/75">{subtitle}</p> : null}
      </div>
      <div className="space-y-3 p-4 sm:p-5">{children}</div>
    </motion.div>
  )
}

export function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit?: () => void
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">{title}</p>
        {onEdit ? <FormEditLink onClick={onEdit}>Edit</FormEditLink> : null}
      </div>
      <div className="space-y-1 text-sm text-brand-forest">{children}</div>
    </div>
  )
}

export function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-brand-forest">{value}</span>
    </div>
  )
}

export function ReviewTextBlock({ children }: { children: ReactNode }) {
  return <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">{children}</p>
}

export function NewsletterConfirmPanel({
  email,
  onBack,
  onConfirm,
  loading,
}: {
  email: string
  onBack: () => void
  onConfirm: () => void
  loading?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="w-full overflow-hidden rounded-2xl border border-brand-lime/30 bg-white shadow-lg"
    >
      <div className="bg-brand-forest px-4 py-3 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-lime">Almost there</p>
        <p className="mt-1 text-sm font-medium">Confirm your subscription</p>
      </div>
      <div className="space-y-3 p-4">
        <ReviewRow label="Email" value={email} />
        <p className="text-xs text-neutral-600">Complete verification below, then confirm to join the newsletter.</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-brand-forest"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-brand-lime px-6 py-2 text-sm font-semibold text-brand-forest disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Confirm subscription'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
