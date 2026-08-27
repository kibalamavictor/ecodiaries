const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstileToken(token: string | undefined, remoteIp?: string): Promise<boolean> {
  if (process.env.TURNSTILE_SKIP_VERIFY === 'true') return true

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[turnstile] TURNSTILE_SECRET_KEY missing in production')
      return false
    }
    return true
  }

  if (!token) return false

  const body = new URLSearchParams({
    secret,
    response: token,
    ...(remoteIp ? { remoteip: remoteIp } : {}),
  })

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = (await res.json()) as { success?: boolean }
  return Boolean(data.success)
}
