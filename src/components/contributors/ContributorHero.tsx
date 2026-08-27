import { SiteNav } from '@/components/layout/SiteNav'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'

export function ContributorHero() {
  return (
    <>
      <header className="hidden bg-brand-forest text-white md:block">
        <SiteNav variant="light" activeLink="/contributors" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-lime">Contributors</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Our Contributors</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Writers, photographers, filmmakers, researchers, and poets documenting climate stories across Africa — the
            voices behind EcoDiaries.
          </p>
          <ContributorsApplyLink className="mt-8 inline-flex items-center rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-forest transition hover:brightness-95">
            Become a Contributor
          </ContributorsApplyLink>
        </div>
      </header>

      <header className="contributors-hero bg-brand-forest text-white md:hidden">
        <SiteNav variant="light" activeLink="/contributors" />
        <div className="contributors-hero__wrap mx-auto max-w-6xl px-4 sm:px-6">
          <p className="contributors-hero__eyebrow">Contributors</p>
          <h1 className="contributors-hero__title">Our Contributors</h1>
          <p className="contributors-hero__lede">
            Writers, photographers, filmmakers, researchers, and poets documenting climate stories across Africa — the
            voices behind EcoDiaries.
          </p>
          <ContributorsApplyLink className="contributors-hero__cta">Become a Contributor</ContributorsApplyLink>
        </div>
      </header>
    </>
  )
}
