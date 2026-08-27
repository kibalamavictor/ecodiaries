'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SupportWorkModal } from '@/components/solutions/SupportWorkModal'

export function SolutionDetailActions({
  title,
  slug,
}: {
  title: string
  slug: string
}) {
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setSupportOpen(true)}
          className="w-full rounded-full bg-brand-lime px-5 py-3 text-sm font-semibold text-brand-forest transition hover:brightness-95"
        >
          Support this work
        </button>
        <Link
          href={`/solutions/${slug}/brief`}
          className="w-full rounded-full border border-brand-green px-5 py-3 text-center text-sm font-semibold text-brand-green transition hover:bg-brand-green/10"
        >
          Download one-pager
        </Link>
        <Link
          href="/contact?reason=partnership"
          className="w-full text-center text-sm font-medium text-brand-green underline"
        >
          Partnership inquiry
        </Link>
      </div>
      <SupportWorkModal solutionTitle={title} open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  )
}
