'use client'

import type { ReactNode } from 'react'
import { FormScope, FormShell } from '@/components/forms/eco-form'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type SolutionFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  children: ReactNode
  className?: string
}

export function SolutionFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: SolutionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('solution-form-dialog', className)}>
        <FormScope>
          <FormShell className="solution-form-dialog__shell">
            <DialogTitle className="font-display text-xl font-bold text-brand-forest">{title}</DialogTitle>
            {description ? <div className="solution-form-dialog__lede">{description}</div> : null}
            <div className="solution-form-dialog__body">{children}</div>
          </FormShell>
        </FormScope>
      </DialogContent>
    </Dialog>
  )
}
