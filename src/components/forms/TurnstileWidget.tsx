'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void }) => string
      reset: (widgetId: string) => void
    }
  }
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void
  onExpire?: () => void
}

export function TurnstileWidget({ onToken, onExpire }: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const [ready, setReady] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!ready || !ref.current || !window.turnstile || !siteKey) return
    widgetId.current = window.turnstile.render(ref.current, {
      sitekey: siteKey,
      callback: (token) => onToken(token),
      'expired-callback': () => {
        onToken('')
        onExpire?.()
      },
    })
  }, [ready, siteKey, onToken, onExpire])

  if (!siteKey) {
    return null
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer onLoad={() => setReady(true)} />
      <div ref={ref} style={{ marginTop: 12 }} />
    </>
  )
}
