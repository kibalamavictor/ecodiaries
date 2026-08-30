import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRightIcon } from '@/components/icons'

type MobileHomeSectionProps = {
  title: string
  href: string
  eyebrow?: string
  children?: ReactNode
}

export function MobileHomeSection({ title, href, eyebrow, children }: MobileHomeSectionProps) {
  return (
    <section className="px-4 py-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.03em] text-brand-green">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-[17px] font-semibold leading-snug text-foreground">{title}</h2>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-brand-green"
        >
          View all
          <ArrowRightIcon />
        </Link>
      </div>
      {children}
    </section>
  )
}
