'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FileText,
  Grid2X2,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react'
import { getEditorProfile, logoutEditor, searchStudioContent } from '@/app/(studio)/studio/auth-actions'
import { StudioNotifications } from '@/components/studio/layout/studio-notifications'
import { MobileMenuButton } from '@/components/studio/layout/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { StudioSearchResult } from '@/lib/studio/types'

const pageTitles: Record<string, string> = {
  '/studio': 'Dashboard',
  '/studio/stories': 'Stories',
  '/studio/solutions': 'Solutions',
  '/studio/watch': 'Watch',
  '/studio/listen': 'Listen',
  '/studio/programmes': 'Programmes',
  '/studio/contributors': 'Contributors',
  '/studio/partners': 'Community Partners',
  '/studio/contact': 'Contact Submissions',
  '/studio/settings': 'Settings',
  '/studio/profile': 'Profile',
  '/studio/admin': 'Studio Admin',
}

function usePageTitle(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname]
  const match = Object.keys(pageTitles).find((key) => key !== '/studio' && pathname.startsWith(key))
  return match ? pageTitles[match] : 'Studio'
}

export function StudioSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<StudioSearchResult[]>([])
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await searchStudioContent(query)
        setResults(data)
      })
    }, 200)
    return () => clearTimeout(timer)
  }, [query, open])

  const navigate = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router],
  )

  return (
    <>
      <Button
        variant="outline"
        className="hidden h-9 w-9 border-gray-200 bg-white p-0 text-gray-500 hover:bg-gray-50 sm:inline-flex"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search stories, contributors, contact submissions…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {pending ? <CommandEmpty>Searching…</CommandEmpty> : null}
          {!pending && results.length === 0 ? <CommandEmpty>No results found.</CommandEmpty> : null}
          <CommandGroup heading="Results">
            {results.map((item) => (
              <CommandItem key={item.id} onSelect={() => navigate(item.href)}>
                <span className="font-medium">{item.title}</span>
                <span className="ml-2 text-xs text-muted-foreground capitalize">{item.type}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.subtitle}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export function StudioTopbar({
  onMenuClick,
  onSidebarToggle,
}: {
  onMenuClick: () => void
  onSidebarToggle: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const pageTitle = usePageTitle(pathname)
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    getEditorProfile().then(setProfile)
  }, [])

  const initials = profile?.name
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ED'

  async function handleLogout() {
    await logoutEditor()
    router.push('/studio/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-100 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={onSidebarToggle}
        className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:inline-flex"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <MobileMenuButton onClick={onMenuClick} />

      <div className="hidden min-w-0 sm:block">
        <p className="text-sm text-gray-500">
          Studio / <span className="font-semibold text-gray-800">{pageTitle}</span>
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <StudioSearch />
        <StudioNotifications />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-800">
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Quick links</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/studio/stories">
                <FileText className="mr-2 h-4 w-4" /> New Story
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/studio/solutions">
                <LayoutGrid className="mr-2 h-4 w-4" /> New Solution
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/studio/contact">
                <Search className="mr-2 h-4 w-4" /> Contact Submissions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/studio/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 rounded-full pl-1 pr-2 hover:bg-gray-100">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-green-100 text-studio-primary text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium capitalize">{profile?.name ?? 'Editor'}</p>
              <p className="text-xs font-normal text-muted-foreground">{profile?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/studio/profile')}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/studio/settings')}>
              <Settings className="mr-2 h-4 w-4" /> Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
