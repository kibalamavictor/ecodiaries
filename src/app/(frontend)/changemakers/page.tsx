import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ChangemakersGrid } from '@/components/changemakers/ChangemakersGrid'
import { getChangemakers } from '@/lib/cms/organizations'
import { filterChangemakersByType } from '@/lib/changemakers/filters'

export const metadata: Metadata = {
  title: 'Changemakers',
  description: 'Organisations and changemakers behind fundable climate projects across Africa.',
}

type Props = { searchParams: Promise<{ type?: string }> }

export default async function ChangemakersPage({ searchParams }: Props) {
  const { type } = await searchParams
  const changemakers = await getChangemakers()
  const visible = filterChangemakersByType(changemakers, type)

  return (
    <>
      <div className="page-head-dark changemakers-hero">
        <SiteNav variant="light" activeLink="/solutions" />
        <div className="wrap changemakers-hero__wrap">
          <span className="eyebrow">Changemakers</span>
          <h1 className="changemakers-hero__title">Organisations powering climate solutions</h1>
          <p className="lede changemakers-hero__lede">
            Meet the NGOs, cooperatives, and community enterprises behind projects in the Solutions Atlas.
          </p>
        </div>
      </div>

      <section className="changemakers-list-section bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Suspense fallback={<div className="changemakers-grid__count">Loading…</div>}>
            <ChangemakersGrid changemakers={visible} />
          </Suspense>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
