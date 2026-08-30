'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { MenuIcon, SearchIcon } from '@/components/icons'
import { BrandMark } from '@/components/brand/BrandMark'

const navLinks = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/stories', label: 'Stories' },
  { href: '/community', label: 'Community' },
] as const

type SiteNavProps = {
  variant?: 'light' | 'dark'
  activeLink?: string
}

export function SiteNav({ activeLink }: SiteNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const isActive = (href: string) => {
    if (activeLink) return activeLink === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  function onSearch(event: FormEvent) {
    event.preventDefault()
    const next = query.trim()
    router.push(next ? `/stories?q=${encodeURIComponent(next)}` : '/stories')
    setSearchOpen(false)
  }

  const navLinkItems = navLinks.map(({ href, label }) => (
    <Link key={href} href={href} className={isActive(href) ? 'active' : undefined} onClick={closeMenu}>
      {label}
    </Link>
  ))

  return (
    <header className={`mag-nav${searchOpen ? ' is-searching' : ''}${menuOpen ? ' nav-open' : ''}`}>
      <div className="mag-wrap mag-nav__inner">
        <Link href="/" className="mag-brand" onClick={closeMenu}>
          <BrandMark /> EcoDiaries
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {navLinkItems}
        </nav>
        <div className="mag-nav__actions">
          <Link href="/#subscribe" className="mag-btn" onClick={closeMenu}>
            Subscribe
          </Link>
          <button
            type="button"
            className="mag-search-btn"
            aria-label={searchOpen ? 'Close search' : 'Search'}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon />
          </button>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav className="mag-nav-drawer mag-wrap" aria-label="Main navigation">
          {navLinkItems}
        </nav>
      ) : null}
      <div className="mag-search-panel">
        <form className="mag-wrap" onSubmit={onSearch}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search stories, topics, solutions, or places…"
            aria-label="Search"
          />
          <button type="submit" className="mag-btn">
            Search
          </button>
        </form>
      </div>
    </header>
  )
}
