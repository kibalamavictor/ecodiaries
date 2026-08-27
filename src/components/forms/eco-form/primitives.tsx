import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function FormShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8', className)}>{children}</div>
  )
}

export function FormProgress({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="mb-8 flex gap-2">
      {steps.map((label, index) => (
        <div key={label} className="flex-1">
          <div
            className={cn('h-1.5 rounded-full', index <= currentStep ? 'bg-brand-lime' : 'bg-neutral-200')}
            aria-hidden
          />
          <p
            className={cn(
              'mt-2 text-xs font-medium',
              index <= currentStep ? 'text-brand-forest' : 'text-neutral-400',
            )}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}

export function FormField({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-1', className)}>{children}</div>
}

export function FormLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-brand-forest">
      {children}
    </label>
  )
}

const controlClass =
  'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-brand-forest placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-lime disabled:opacity-60'

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, props.className)} {...props} />
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClass, props.className)} {...props} />
}

export function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClass, props.className)} {...props} />
}

export function SelectableCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean
  onClick: () => void
  icon?: ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        selected
          ? 'rounded-xl border-2 border-brand-lime bg-brand-lime/10 p-4 text-left'
          : 'rounded-xl border border-border p-4 text-left hover:border-neutral-300'
      }
    >
      {Icon ? <Icon className="mb-2 h-5 w-5 text-brand-forest" /> : null}
      <p className="font-semibold text-brand-forest">{title}</p>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
    </button>
  )
}

export function FormActions({
  onBack,
  onNext,
  nextLabel = 'Continue',
  backDisabled,
  nextDisabled,
  isFinal,
  finalLabel = 'Submit',
  loading,
  showBack = true,
  nextClassName,
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  backDisabled?: boolean
  nextDisabled?: boolean
  isFinal?: boolean
  finalLabel?: string
  loading?: boolean
  showBack?: boolean
  nextClassName?: string
}) {
  return (
    <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      {showBack && onBack ? (
        <button
          type="button"
          disabled={backDisabled || loading}
          onClick={onBack}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-brand-forest disabled:opacity-40 sm:mr-auto"
        >
          Back
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className={cn(
          'rounded-full bg-brand-lime px-6 py-2.5 text-sm font-semibold text-brand-forest disabled:opacity-60',
          isFinal ? 'w-full sm:ml-auto sm:w-auto' : 'sm:ml-auto',
          nextClassName,
        )}
        data-testid={isFinal ? 'contributor-submit' : 'contributor-continue'}
      >
        {loading ? 'Submitting…' : isFinal ? finalLabel : nextLabel}
      </button>
    </div>
  )
}

export function FormStatusMessage({
  state,
  message,
}: {
  state: 'idle' | 'loading' | 'success' | 'error'
  message: string
}) {
  if (!message) return null
  return (
    <p className={cn('mt-4 text-sm', state === 'error' ? 'text-red-600' : 'text-brand-green')}>{message}</p>
  )
}

export function FormEditLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="text-brand-green underline" onClick={onClick}>
      {children}
    </button>
  )
}
