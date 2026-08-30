import { ECO_DIARIES_LOGO_PATH } from '@/components/brand/logo-path'

export function EcoDiariesLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 2000 2000" aria-hidden="true">
      <path d={ECO_DIARIES_LOGO_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <EcoDiariesLogo />
    </span>
  )
}
