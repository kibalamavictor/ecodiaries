type SolutionHeroProps = {
  title?: string
}

export function SolutionHero({ title = 'Climate solutions across Africa' }: SolutionHeroProps) {
  return (
    <header className="solutions-hero__intro mag-wrap">
      <p className="mag-news__eyebrow">Solutions atlas</p>
      <h1 className="mag-title mag-page-intro__title">{title}</h1>
      <p className="mag-excerpt mag-page-intro__lede">
        A growing record of what is working, where, and who’s behind it — field-documented
        innovations you can learn from, fund, and scale.
      </p>
    </header>
  )
}
