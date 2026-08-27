'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import {
  BookOpen,
  FileText,
  Handshake,
  Headphones,
  LayoutDashboard,
  Menu,
  Lightbulb,
  Mail,
  Settings,
  ShieldCheck,
  Users,
  Video,
} from 'lucide-react'
import { getEditorProfile, getUnreadContactCount } from '@/app/(studio)/studio/auth-actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Content',
    items: [
      { href: '/studio', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/studio/stories', label: 'Stories', icon: FileText },
      { href: '/studio/solutions', label: 'Solutions', icon: Lightbulb },
      { href: '/studio/watch', label: 'Watch', icon: Video },
      { href: '/studio/listen', label: 'Listen', icon: Headphones },
      { href: '/studio/programmes', label: 'Programmes', icon: BookOpen },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/studio/contributors', label: 'Contributors', icon: Users },
      { href: '/studio/partners', label: 'Community Partners', icon: Handshake },
      { href: '/studio/contact', label: 'Contact Submissions', icon: Mail },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/studio/settings', label: 'Settings', icon: Settings },
      { href: '/studio/admin', label: 'Studio Admin', icon: ShieldCheck },
    ],
  },
]

function NavLink({
  item,
  collapsed,
  unreadCount,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  unreadCount: number
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const active =
    item.href === '/studio'
      ? pathname === '/studio'
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  const Icon = item.icon
  const showBadge = item.href === '/studio/contact' && unreadCount > 0

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40',
        active
          ? 'bg-studio-primary text-white'
          : 'text-gray-600 hover:bg-green-50 hover:text-green-800',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : 'text-gray-500 group-hover:text-green-700')} />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {showBadge ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </>
      )}
    </Link>
  )
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate?: () => void
}) {
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const [p, count] = await Promise.all([getEditorProfile(), getUnreadContactCount()])
      if (p) setProfile({ name: p.name, role: p.role })
      setUnreadCount(count)
    })
  }, [])

  const initials = profile?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ED'

  return (
    <div className="flex h-full flex-col bg-white">
      <div className={cn('flex h-16 items-center border-b border-gray-100 px-4', collapsed ? 'justify-center' : 'gap-2')}>
        <Link href="/studio" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40 rounded-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-studio-primary text-sm font-bold text-white">
            E
          </span>
          {!collapsed && <span className="text-base font-bold text-gray-800">EcoDiaries</span>}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-gray-400">{group.label}</p>
            )}
            <nav className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  unreadCount={unreadCount}
                  onNavigate={onNavigate}
                />
              ))}
            </nav>
          </div>
        ))}
      </ScrollArea>

      <div className="border-t border-gray-100 p-4">
        <Link
          href="/studio/profile"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40',
            collapsed && 'justify-center',
          )}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-100 text-studio-primary">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800 capitalize">{profile?.name ?? 'Editor'}</p>
              <p className="text-xs capitalize text-gray-500">{profile?.role ?? 'Editor'}</p>
              <p className="text-xs font-medium text-studio-accent">View Profile</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  )
}

export function StudioSidebar({
  collapsed,
  mobileOpen,
  onMobileOpenChange,
}: {
  collapsed: boolean
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}) {
  return (
    <>
      <aside
        className={cn(
          'hidden h-screen shrink-0 flex-col border-r border-gray-100 bg-white transition-[width] duration-200 ease-in-out lg:flex',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent collapsed={false} onNavigate={() => onMobileOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
