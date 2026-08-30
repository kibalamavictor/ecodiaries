'use client'

export function PrintBriefButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-brand-lime px-4 py-2 text-sm font-semibold text-brand-forest"
    >
      Print / Save as PDF
    </button>
  )
}
