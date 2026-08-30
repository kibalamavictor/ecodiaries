import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type LimitResult = { success: boolean; remaining: number }

const memoryStore = new Map<string, { count: number; resetAt: number }>()

function memoryLimit(key: string, limit: number, windowMs: number): LimitResult {
  const now = Date.now()
  const entry = memoryStore.get(key)
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }
  if (entry.count >= limit) return { success: false, remaining: 0 }
  entry.count += 1
  return { success: true, remaining: limit - entry.count }
}

function getRedisLimiter(endpoint: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const redis = new Redis({ url, token })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 m'),
    prefix: `ecodiaries:${endpoint}`,
  })
}

export async function rateLimitRequest(
  endpoint: string,
  identifier: string,
  limit = 10,
  windowMs = 10 * 60 * 1000,
): Promise<LimitResult> {
  const redisLimiter = getRedisLimiter(endpoint)
  if (redisLimiter) {
    const { success, remaining } = await redisLimiter.limit(identifier)
    return { success, remaining }
  }
  return memoryLimit(`${endpoint}:${identifier}`, limit, windowMs)
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
