'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'
import { StudioSidebar } from '@/components/studio/layout/sidebar'
import { StudioTopbar } from '@/components/studio/layout/topbar'

const STORAGE_KEY = 'ecodiaries-studio-sidebar-collapsed'

export function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') setCollapsed(true)
    setHydrated(true)
  }, [])

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  if (pathname === '/studio/login') {
    return (
      <>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </>
    )
  }

  return (
    <div className="flex min-h-screen bg-studio-page">
      {hydrated ? (
        <StudioSidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
      ) : (
        <aside className="hidden h-screen w-64 shrink-0 border-r border-gray-100 bg-white lg:block" />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <StudioTopbar onMenuClick={() => setMobileOpen(true)} onSidebarToggle={toggleCollapsed} />
        <main className="flex-1 min-h-screen bg-studio-page p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}
