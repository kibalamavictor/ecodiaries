'use client'

type ViewMode = 'atlas' | 'grid'

type AtlasViewToggleProps = {
  view: ViewMode
  onChange: (mode: ViewMode) => void
}

export function AtlasViewToggle({ view, onChange }: AtlasViewToggleProps) {
  return (
    <div className="atlas-view-buttons" role="group" aria-label="Atlas view">
      <button
        type="button"
        className={`atlas-toolbar-btn${view === 'atlas' ? ' is-active' : ''}`}
        onClick={() => onChange('atlas')}
        aria-pressed={view === 'atlas'}
      >
        Map + List
      </button>
      <button
        type="button"
        className={`atlas-toolbar-btn${view === 'grid' ? ' is-active' : ''}`}
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
      >
        Grid Only
      </button>
    </div>
  )
}
