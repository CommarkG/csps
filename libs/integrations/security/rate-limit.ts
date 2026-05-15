// libs/integrations/security/rate-limit.ts
// S032-C: Upstash Redis rate limiting for CSPS API routes.
// Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env vars.
// Governor action required: create free Upstash account at upstash.com, add env vars to Vercel.

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type RateLimitResult = { success: boolean; reset: number; remaining: number }

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null // Rate limiting disabled when env vars not set
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

/**
 * Per-user rate limit: 100 requests per minute (sliding window).
 * Use in authenticated API routes to prevent abuse by a single user.
 */
export async function rateLimitUser(userId: string): Promise<RateLimitResult> {
  const redis = getRedis()
  if (!redis) return { success: true, reset: 0, remaining: 100 } // passthrough when disabled

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'csps:user',
  })

  const result = await limiter.limit(userId)
  return { success: result.success, reset: result.reset, remaining: result.remaining }
}

/**
 * Per-IP auth rate limit: 20 requests per 15 minutes (fixed window).
 * Use on sign-in/sign-up endpoints to prevent brute force.
 */
export async function rateLimitAuth(ip: string): Promise<RateLimitResult> {
  const redis = getRedis()
  if (!redis) return { success: true, reset: 0, remaining: 20 } // passthrough when disabled

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(20, '15 m'),
    prefix: 'csps:auth',
  })

  const result = await limiter.limit(ip)
  return { success: result.success, reset: result.reset, remaining: result.remaining }
}
