import Link from 'next/link'

type MagCtaBandProps = {
  eyebrow?: string
  title: string
  lede?: string
  href: string
  label: string
}

export function MagCtaBand({ eyebrow, title, lede, href, label }: MagCtaBandProps) {
  return (
    <section className="mag-cta-band">
      <div className="mag-wrap">
        {eyebrow ? <p className="mag-news__eyebrow mag-cta-band__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {lede ? <p>{lede}</p> : null}
        <Link href={href} className="mag-btn mag-cta-band__btn">
          {label}
        </Link>
      </div>
    </section>
  )
}
