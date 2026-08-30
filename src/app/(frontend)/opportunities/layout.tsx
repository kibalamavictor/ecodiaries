import './opportunities.css'
import type { ReactNode } from 'react'

export default function OpportunitiesLayout({ children }: { children: ReactNode }) {
  return <div className="programmes-tailwind programmes-page min-h-screen bg-white text-neutral-900">{children}</div>
}
