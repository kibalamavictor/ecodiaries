'use client'

import { useEffect, useState } from 'react'

type Section = { id: string; label: string }

export function StorySidebar({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [sections])

  return (
    <aside className="story-sidebar">
      <div className="eyebrow" style={{ marginBottom: 14 }}>
        Go to Section
      </div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, borderLeft: '2px solid var(--line)' }}>
        {sections.map(({ id, label }) => (
          <li
            key={id}
            style={{
              paddingLeft: 14,
              borderLeft: active === id ? '2px solid var(--lime-dark)' : 'none',
              marginLeft: active === id ? -2 : 0,
              fontWeight: active === id ? 700 : 400,
              color: active === id ? 'inherit' : 'var(--ink-soft)',
            }}
          >
            <a href={`#${id}`} style={{ color: 'inherit' }}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
