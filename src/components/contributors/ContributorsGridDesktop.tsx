'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import type { Contributor, ContributorCategory } from '@/lib/contributors/types'
import { CATEGORY_QUERY_MAP, CONTRIBUTOR_FILTER_OPTIONS, QUERY_FROM_CATEGORY } from '@/lib/contributors/types'
import { ContributorCard } from '@/components/contributors/ContributorCard'
import { FilterPills } from '@/components/ui/FilterPills'

const contributorFilters = CONTRIBUTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value === 'all' ? 'all' : QUERY_FROM_CATEGORY[option.value],
}))

export function ContributorsGridDesktop({ contributors }: { contributors: Contributor[] }) {
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<ContributorCategory | 'all'>('all')

  useEffect(() => {
    const raw = searchParams.get('category') || 'all'
    setActiveFilter(CATEGORY_QUERY_MAP[raw] ?? 'all')
  }, [searchParams])

  const visibleContributors = useMemo(
    () =>
      activeFilter === 'all'
        ? contributors
        : contributors.filter((c) => c.categories.includes(activeFilter)),
    [activeFilter, contributors],
  )

  return (
    <section className="mag-section" style={{ paddingTop: 8 }}>
      <div className="mag-wrap">
        <FilterPills
          filters={contributorFilters}
          paramKey="category"
          basePath="/contributors"
          modalTitle="Filter by contribution type"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Showing {visibleContributors.length} contributor{visibleContributors.length === 1 ? '' : 's'}
        </p>

        {visibleContributors.length === 0 ? (
          <p className="mt-12 text-center text-neutral-600">No contributors in this category yet.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
            >
              {visibleContributors.map((contributor, index) => (
                <motion.div
                  key={contributor.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                >
                  <ContributorCard contributor={contributor} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
