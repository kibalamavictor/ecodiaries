import type { ReactNode } from 'react'

type MagPageIntroProps = {
  eyebrow?: string
  title: string
  lede?: string
  children?: ReactNode
}

export function MagPageIntro({ eyebrow, title, lede, children }: MagPageIntroProps) {
  return (
    <header className="mag-page-intro mag-wrap">
      {eyebrow ? <p className="mag-news__eyebrow">{eyebrow}</p> : null}
      <h1 className="mag-title mag-page-intro__title">{title}</h1>
      {lede ? <p className="mag-excerpt mag-page-intro__lede">{lede}</p> : null}
      {children}
    </header>
  )
}
