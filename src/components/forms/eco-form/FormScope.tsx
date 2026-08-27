import './eco-forms.css'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function FormScope({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('eco-forms-tailwind', className)}>{children}</div>
}
