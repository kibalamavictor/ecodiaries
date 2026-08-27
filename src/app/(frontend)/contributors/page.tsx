import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ContributorApplicationWizard } from '@/components/contributors/ContributorApplicationWizard'
import { ContributorsApplyScroll } from '@/components/contributors/ContributorsApplyScroll'
import { ContributorCtaBanner } from '@/components/contributors/ContributorCtaBanner'
import { ContributorHero } from '@/components/contributors/ContributorHero'
import { ContributorsPageGrid } from '@/components/contributors/ContributorsPageGrid'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { getContributorsForPage } from '@/lib/cms/contributors-page'

export const metadata: Metadata = {
  title: 'Contributors',
  description:
    'Browse EcoDiaries contributors — writers, photographers, filmmakers, researchers, and poets — or apply to join.',
}

export default async function ContributorsPage() {
  const contributors = await getContributorsForPage()
  const newsletterImage = contributors.find((c) => c.avatarUrl)?.avatarUrl || 'https://picsum.photos/seed/eco-voices/900/700'

  return (
    <MagPageShell>
      <ContributorsApplyScroll />
      <ContributorHero />
      <Suspense fallback={<div className="py-16 text-center text-neutral-600">Loading contributors…</div>}>
        <ContributorsPageGrid contributors={contributors} />
      </Suspense>
      <ContributorCtaBanner contributors={contributors} />
      <section className="mag-section" id="apply">
        <div className="mag-wrap mag-two">
          <div>
            <p className="mag-news__eyebrow">Apply</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', maxWidth: '12ch' }}>Become a contributor</h2>
            <p className="mag-excerpt mag-excerpt--full" style={{ marginTop: 16 }}>
              Apply to publish your reporting, photography, film, research, or poetry on EcoDiaries. We review every
              application and respond within two weeks.
            </p>
            <ul className="mag-excerpt mag-excerpt--full" style={{ marginTop: 20, paddingLeft: '1.1rem' }}>
              <li>Structured application by contribution type</li>
              <li>Short editorial call with our team</li>
              <li>Onboarding and style guide</li>
              <li>Publish your first piece within 30 days</li>
            </ul>
          </div>
          <ContributorApplicationWizard />
        </div>
      </section>
      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
