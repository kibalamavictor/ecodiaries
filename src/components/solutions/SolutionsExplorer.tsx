'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { RegionCombobox } from '@/components/solutions/RegionCombobox'
import { SolutionCard } from '@/components/solutions/SolutionCard'
import { SolutionMap } from '@/components/solutions/SolutionMap'
import { FilterPills } from '@/components/ui/FilterPills'
import { ATLAS_REGION_FILTER_OPTIONS, projectMatchesRegionFilter } from '@/lib/solutions/coordinates'
import {
  SECTOR_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  SECTOR_LABELS,
  type Sector,
  type Solution,
  type SolutionStatus,
} from '@/lib/solutions/types'

type ViewMode = 'list' | 'map'

type SolutionsExplorerProps = {
  solutions: Solution[]
}

const sectorFilters = SECTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value,
}))

const statusFilters = STATUS_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value,
}))

export function SolutionsExplorer({ solutions }: SolutionsExplorerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [view, setView] = useState<ViewMode>('list')
  const [sector, setSector] = useState<Sector | 'all'>('all')
  const [region, setRegion] = useState<string | 'all'>('all')
  const [status, setStatus] = useState<SolutionStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    setSector((searchParams.get('sector') as Sector) || 'all')
    setRegion(searchParams.get('region') || 'all')
    setStatus((searchParams.get('status') as SolutionStatus) || 'all')
    setQuery(searchParams.get('q') || '')
    setView(searchParams.get('view') === 'map' ? 'map' : 'list')
  }, [searchParams])

  const filtered = useMemo(() => {
    return solutions.filter((s) => {
      if (sector !== 'all' && !s.sectors.includes(sector)) return false
      if (!projectMatchesRegionFilter(s, region)) return false
      if (status !== 'all' && s.status !== status) return false
      if (query) {
        const q = query.toLowerCase()
        if (
          !s.title.toLowerCase().includes(q) &&
          !s.summary.toLowerCase().includes(q) &&
          !s.region.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [solutions, sector, region, status, query])

  function syncUrl(patch: Partial<{ sector: string; region: string; status: string; q: string; view: string }>) {
    const params = new URLSearchParams(searchParams.toString())
    const next = {
      sector: patch.sector ?? sector,
      region: patch.region ?? region,
      status: patch.status ?? status,
      q: patch.q ?? query,
      view: patch.view ?? view,
    }
    if (next.sector === 'all') params.delete('sector')
    else params.set('sector', next.sector)
    if (next.region === 'all') params.delete('region')
    else params.set('region', next.region)
    if (next.status === 'all') params.delete('status')
    else params.set('status', next.status)
    if (!next.q) params.delete('q')
    else params.set('q', next.q)
    if (next.view === 'list') params.delete('view')
    else params.set('view', next.view)
    const qs = params.toString()
    router.replace(qs ? `/solutions?${qs}` : '/solutions', { scroll: false })
  }

  return (
    <section id="explore" className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-brand-forest">Explore solutions</h2>
          <button
            type="button"
            onClick={() => {
              const nextView = view === 'map' ? 'list' : 'map'
              setView(nextView)
              syncUrl({ view: nextView })
            }}
            className="inline-flex w-fit rounded-full border border-brand-forest px-4 py-2 text-sm font-semibold text-brand-forest transition hover:bg-brand-lime/10"
          >
            {view === 'map' ? 'List view' : 'Map view'}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <RegionCombobox
              sections={[
                { label: 'Africa', regions: ATLAS_REGION_FILTER_OPTIONS.africa },
                { label: 'Global — ready to replicate in Africa', regions: ATLAS_REGION_FILTER_OPTIONS.global },
              ]}
              value={region}
              onChange={(value) => {
                setRegion(value)
                syncUrl({ region: value })
              }}
            />
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length} solution{filtered.length === 1 ? '' : 's'}
              {sector !== 'all' ? ` in ${SECTOR_LABELS[sector]}` : ''}
              {query ? ` for “${query}”` : ''}
            </p>
          </div>

          <FilterPills filters={sectorFilters} paramKey="sector" basePath="/solutions" modalTitle="Filter by sector" />
          <FilterPills filters={statusFilters} paramKey="status" basePath="/solutions" modalTitle="Filter by status" />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-neutral-600">No solutions match these filters yet.</p>
        ) : view === 'list' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${sector}-${region}-${status}-${query}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                >
                  <SolutionCard solution={solution} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="mt-10 rounded-xl border border-border bg-muted/30 p-2">
            <SolutionMap solutions={filtered} />
          </div>
        )}
      </div>
    </section>
  )
}
