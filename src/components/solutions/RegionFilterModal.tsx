'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export type RegionFilterSection = {
  label: string
  regions: string[]
}

type RegionFilterModalProps = {
  open: boolean
  onClose: () => void
  regions?: string[]
  sections?: RegionFilterSection[]
  value: string | 'all'
  onSelect: (value: string | 'all') => void
  title?: string
}

export function RegionFilterModal({
  open,
  onClose,
  regions = [],
  sections,
  value,
  onSelect,
  title = 'Filter by region',
}: RegionFilterModalProps) {
  const reduce = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const renderRegionButton = (region: string) => (
    <button
      key={region}
      type="button"
      className={`filter-pill${value === region ? ' active' : ''}`}
      onClick={() => onSelect(region)}
    >
      {region}
    </button>
  )

  return (
    <div
      className="topic-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="topic-modal region-filter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="region-modal-title"
        style={reduce ? undefined : { animation: 'fadeIn .2s ease' }}
      >
        <button type="button" className="topic-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="region-modal-title">{title}</h2>
        <div className="topic-modal-grid">
          <button
            type="button"
            className={`filter-pill${value === 'all' ? ' active' : ''}`}
            onClick={() => onSelect('all')}
          >
            All Regions
          </button>
        </div>
        {sections?.length ? (
          <div className="region-filter-modal__sections">
            {sections.map((section) => (
              <div key={section.label} className="region-filter-modal__section">
                <p className="region-filter-modal__section-label">{section.label}</p>
                <div className="topic-modal-grid">{section.regions.map(renderRegionButton)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="topic-modal-grid">{regions.map(renderRegionButton)}</div>
        )}
      </div>
    </div>
  )
}
