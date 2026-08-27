'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { MenuIcon } from '@/components/icons'
import { BrandMark } from '@/components/brand/BrandMark'

let hasPlayedNavEntrance = false

const navLinks = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/stories', label: 'Stories' },
  { href: '/community', label: 'Community' },
] as const

type NavVariant = 'light' | 'dark'

type SiteNavProps = {
  variant?: NavVariant
  activeLink?: string
}

export function SiteNav({ variant = 'light', activeLink }: SiteNavProps) {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuTop, setMenuTop] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [playEntrance] = useState(() => {
    if (hasPlayedNavEntrance) return false
    hasPlayedNavEntrance = true
    return true
  })

  const isActive = (href: string) => {
    if (activeLink) return activeLink === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const closeMenu = () => setMenuOpen(false)

  const navLinkItems = navLinks.map(({ href, label }) => (
    <Link
      key={href}
      href={href}
      className={isActive(href) ? 'active' : undefined}
      onClick={closeMenu}
    >
      {label}
    </Link>
  ))

  const menuStyle =
    menuOpen && menuTop != null
      ? ({ '--nav-menu-top': `${menuTop}px` } as CSSProperties)
      : undefined

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) {
      setMenuTop(null)
      return
    }

    const updateMenuTop = () => {
      const el = wrapRef.current
      if (!el) return
      setMenuTop(el.getBoundingClientRect().bottom + 10)
    }

    updateMenuTop()
    window.addEventListener('resize', updateMenuTop)
    window.addEventListener('scroll', updateMenuTop, { passive: true })
    return () => {
      window.removeEventListener('resize', updateMenuTop)
      window.removeEventListener('scroll', updateMenuTop)
    }
  }, [menuOpen])

  return (
    <>
      {menuOpen && typeof document !== 'undefined'
        ? createPortal(
            <>
              <button
                type="button"
                className="nav-backdrop"
                aria-label="Close menu"
                onClick={closeMenu}
              />
              <nav
                className={`nav-links nav-links-drawer nav-${variant}`}
                aria-label="Main navigation"
                style={menuStyle}
              >
                {navLinkItems}
              </nav>
            </>,
            document.body,
          )
        : null}
      <motion.header
        className={`site-nav nav-${variant}${menuOpen ? ' nav-open' : ''}`}
        initial={playEntrance && !reduce ? { opacity: 0, y: -8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="wrap" ref={wrapRef}>
          <Link href="/" className="brand">
            <BrandMark /> EcoDiaries
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            {navLinkItems}
          </nav>
          <div className="nav-cta">
            <Link href="/contact" className="btn btn-primary btn-sm" onClick={closeMenu}>
              Newsletter
            </Link>
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
      </motion.header>
    </>
  )
}
