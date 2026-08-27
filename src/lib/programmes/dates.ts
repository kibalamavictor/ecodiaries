export function formatProgrammeDate(value: string | null | undefined): string | null {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatProgrammeDateRange(
  openDate: string | null | undefined,
  closeDate: string | null | undefined,
): string | null {
  const open = formatProgrammeDate(openDate)
  const close = formatProgrammeDate(closeDate)

  if (open && close) return `Opens ${open} · Closes ${close}`
  if (open) return `Opens ${open}`
  if (close) return `Closes ${close}`
  return null
}

export function formatClosingCapsule(closeDate: string | null | undefined): string | null {
  const formatted = formatProgrammeDate(closeDate)
  return formatted ? `Closes ${formatted}` : null
}
