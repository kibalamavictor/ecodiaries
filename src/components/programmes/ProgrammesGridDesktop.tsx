'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProgrammeCard } from '@/components/programmes/ProgrammeCard'
import { ProgrammeFilters } from '@/components/programmes/ProgrammeFilters'
import { programmeFilterSummary } from '@/lib/programmes/filters'
import { prepareProgrammesList } from '@/lib/programmes/list'
import type { Programme } from '@/lib/programmes/types'

export function ProgrammesGridDesktop({ programmes }: { programmes: Programme[] }) {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'all'
  const age = searchParams.get('age') || 'all'
  const query = searchParams.get('q') || ''

  const filteredProgrammes = useMemo(
    () => prepareProgrammesList(programmes, type, age, query),
    [programmes, type, age, query],
  )

  const activeLabel = programmeFilterSummary(type, age, query)
  const isSearchActive = Boolean(query.trim())

  return (
    <section className="section programmes-section bg-white" id="opportunities">
      <div className="wrap">
        <ProgrammeFilters />
        <p className="mt-4 text-sm text-muted-foreground">
          Showing {filteredProgrammes.length} opportunit{filteredProgrammes.length === 1 ? 'y' : 'ies'}
          {activeLabel !== 'All' ? (
            <>
              {' '}
              <span className="font-semibold text-brand-forest">· {activeLabel}</span>
            </>
          ) : null}
        </p>

        {filteredProgrammes.length === 0 ? (
          <p className="mt-12 text-center text-neutral-600">
            {isSearchActive
              ? 'No opportunities match your search yet.'
              : 'No opportunities match these filters yet.'}
          </p>
        ) : (
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProgrammes.map((programme) => (
              <div key={programme.slug} className="h-full">
                <ProgrammeCard programme={programme} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
