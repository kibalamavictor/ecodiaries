import '../contributors/contributors.css'
import './community.css'
import type { ReactNode } from 'react'

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <div className="contributors-tailwind">{children}</div>
}
