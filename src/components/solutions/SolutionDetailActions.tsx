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
          className="mag-btn"
          style={{ width: '100%', height: 44 }}
        >
          Support this work
        </button>
        <Link
          href={`/solutions/${slug}/brief`}
          className="mag-tag"
          style={{ width: '100%', height: 44, justifyContent: 'center' }}
        >
          Download one-pager
        </Link>
        <Link
          href="/contact?reason=partnership"
          className="mag-link"
          style={{ textAlign: 'center' }}
        >
          Partnership inquiry
        </Link>
      </div>
      <SupportWorkModal solutionTitle={title} open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  )
}
