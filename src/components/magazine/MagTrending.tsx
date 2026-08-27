import Image from 'next/image'
import Link from 'next/link'
import type { MagCardItem } from '@/components/magazine/MagCard'

export function MagTrending({ items }: { items: MagCardItem[] }) {
  return (
    <aside className="mag-trending">
      <h2>Trending now</h2>
      <ol>
        {items.map((item, index) => (
          <li key={item.href}>
            <Link href={item.href} className="mag-trend">
              <span className="mag-trend__num">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <h3 className="mag-title">{item.title}</h3>
                {item.byline ? <p className="mag-meta">{item.byline}</p> : null}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  )
}

export function MagSpread({ item }: { item: MagCardItem }) {
  return (
    <section className="mag-spread">
      <Image src={item.image} alt="" fill sizes="100vw" />
      <div className="mag-spread__shade" />
      <div className="mag-spread__copy">
        <span className="mag-chip">{item.category}</span>
        <h2>
          <Link href={item.href}>{item.title}</Link>
        </h2>
        {item.byline ? <p className="mag-meta" style={{ color: 'rgba(255,255,255,.85)' }}>{item.byline}</p> : null}
      </div>
    </section>
  )
}
