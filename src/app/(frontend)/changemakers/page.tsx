import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ChangemakersGrid } from '@/components/changemakers/ChangemakersGrid'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'
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
  const newsletterImage =
    visible[0]?.coverUrl || visible[0]?.logoUrl || 'https://picsum.photos/seed/eco-orgs/900/700'

  return (
    <MagPageShell>
      <div className="mag-section" style={{ paddingTop: 12, paddingBottom: 8 }}>
        <MagPageIntro
          eyebrow="Changemakers"
          title="Organisations powering climate solutions"
          lede="Meet the NGOs, cooperatives, and community enterprises behind projects in the Solutions Atlas."
        />
      </div>
      <section className="mag-section" style={{ paddingTop: 0 }}>
        <div className="mag-wrap">
          <Suspense fallback={<div className="changemakers-grid__count">Loading…</div>}>
            <ChangemakersGrid changemakers={visible} />
          </Suspense>
        </div>
      </section>
      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
