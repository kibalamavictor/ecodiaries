export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function parseDurationLabel(label?: string | null): number | null {
  if (!label) return null
  const hms = label.match(/(\d+):(\d{2})(?::(\d{2}))?/)
  if (hms) {
    if (hms[3]) return Number(hms[1]) * 3600 + Number(hms[2]) * 60 + Number(hms[3])
    return Number(hms[1]) * 60 + Number(hms[2])
  }
  const mins = label.match(/(\d+)\s*min/i)
  if (mins) return Number(mins[1]) * 60
  return null
}
