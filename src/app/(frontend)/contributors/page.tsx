import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { ContributorApplicationWizard } from '@/components/contributors/ContributorApplicationWizard'
import { ContributorsApplyScroll } from '@/components/contributors/ContributorsApplyScroll'
import { ContributorCtaBanner } from '@/components/contributors/ContributorCtaBanner'
import { ContributorHero } from '@/components/contributors/ContributorHero'
import { ContributorsPageGrid } from '@/components/contributors/ContributorsPageGrid'
import { getContributorsForPage } from '@/lib/cms/contributors-page'

export const metadata: Metadata = {
  title: 'Contributors',
  description:
    'Browse EcoDiaries contributors — writers, photographers, filmmakers, researchers, and poets — or apply to join.',
}

export default async function ContributorsPage() {
  const contributors = await getContributorsForPage()

  return (
    <>
      <ContributorsApplyScroll />
      <ContributorHero />
      <Suspense fallback={<div className="py-16 text-center text-neutral-600">Loading contributors…</div>}>
        <ContributorsPageGrid contributors={contributors} />
      </Suspense>
      <ContributorCtaBanner contributors={contributors} />
      <section className="contributors-apply scroll-mt-8 bg-neutral-50 pb-16 pt-8 md:py-16" id="apply">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-bold text-brand-forest">Become a contributor</h2>
            <p className="contributors-apply__lede mt-4 text-neutral-600">
              Apply to publish your reporting, photography, film, research, or poetry on EcoDiaries. We review every
              application and respond within two weeks.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-neutral-700">
              <li>Structured application by contribution type</li>
              <li>Short editorial call with our team</li>
              <li>Onboarding and style guide</li>
              <li>Publish your first piece within 30 days</li>
            </ul>
          </div>
          <ContributorApplicationWizard />
        </div>
      </section>
      <NewsletterBanner className="contributors-newsletter" />
      <SiteFooter />
    </>
  )
}
