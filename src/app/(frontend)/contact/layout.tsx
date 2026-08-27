import '@/components/forms/eco-form/eco-forms.css'
import type { ReactNode } from 'react'

/** Shared Tailwind scope for brand-token pages (contact, programmes, etc.) */
export default function FrontendFormsLayout({ children }: { children: ReactNode }) {
  return <div className="eco-forms-tailwind">{children}</div>
}
