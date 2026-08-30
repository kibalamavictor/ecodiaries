import { NextResponse } from 'next/server'
import { getClientIp, rateLimitRequest } from '@/lib/rate-limit'
import { verifyTurnstileToken } from '@/lib/turnstile'

type GuardBody = { turnstileToken?: string }

export async function guardPublicForm(request: Request, endpoint: string, body: GuardBody) {
  const ip = getClientIp(request)
  const rate = await rateLimitRequest(endpoint, ip)
  if (!rate.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes and try again.' },
      { status: 429 },
    )
  }

  const valid = await verifyTurnstileToken(body.turnstileToken, ip)
  if (!valid) {
    return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 403 })
  }

  return null
}
