import './contributors.css'
import type { ReactNode } from 'react'

export default function ContributorsLayout({ children }: { children: ReactNode }) {
  return <div className="contributors-tailwind min-h-screen bg-white text-neutral-900">{children}</div>
}
