import { headers } from 'next/headers'
import { getClientIp, rateLimitRequest } from '@/lib/rate-limit'

/** Single message for failed login — avoids email/password/account enumeration. */
export const GENERIC_LOGIN_ERROR = 'Incorrect email or password.'

export const LOGIN_RATE_LIMIT_ERROR =
  'Too many sign-in attempts. Please wait a few minutes and try again.'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Trim and validate login fields on the server. Invalid input uses the generic auth error. */
export function parseLoginCredentials(email: string, password: string): { email: string; password: string } {
  const normalizedEmail = email.trim().toLowerCase().slice(0, 254)
  const normalizedPassword = password.slice(0, 128)

  if (!normalizedEmail || !EMAIL_RE.test(normalizedEmail) || !normalizedPassword) {
    throw new Error(GENERIC_LOGIN_ERROR)
  }

  return { email: normalizedEmail, password: normalizedPassword }
}

export async function assertLoginRateLimit(scope: 'studio' | 'dashboard' | 'admin'): Promise<void> {
  const headerList = await headers()
  const ip = getClientIp(new Request('http://localhost', { headers: headerList }))
  const rate = await rateLimitRequest(`auth:${scope}`, ip, 10, 10 * 60 * 1000)
  if (!rate.success) {
    throw new Error(LOGIN_RATE_LIMIT_ERROR)
  }
}

/** Map Payload/auth failures to a safe user-facing message. */
export function toSafeLoginError(err: unknown, devHint?: string): Error {
  if (err instanceof Error) {
    if (err.message === LOGIN_RATE_LIMIT_ERROR) return err
    if (process.env.NODE_ENV !== 'production' && devHint) {
      return new Error(devHint)
    }
  }
  return new Error(GENERIC_LOGIN_ERROR)
}
