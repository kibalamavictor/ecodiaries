import './watch.css'
import '@/app/(frontend)/mobile-cards.css'
import type { ReactNode } from 'react'

export default function WatchLayout({ children }: { children: ReactNode }) {
  return <div className="watch-page min-h-screen bg-white text-neutral-900">{children}</div>
}
