'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/', label: 'Home' },
  { href: '/stories', label: 'Stories' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/watch', label: 'Watch' },
  { href: '/listen', label: 'Listen' },
] as const

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {items.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${
                  active ? 'text-brand-forest' : 'text-muted-foreground'
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${active ? 'bg-brand-lime' : 'bg-transparent'}`}
                  aria-hidden
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
