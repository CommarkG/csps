// libs/integrations/security/rate-limit.ts
// wiring_deferred_until: S040 (requires pnpm add @upstash/ratelimit @upstash/redis + env vars)
// Stub: graceful passthrough until packages installed + UPSTASH_REDIS_REST_URL set

type RateLimitResult = { success: boolean; reset: number; remaining: number }

export async function rateLimitUser(_userId: string): Promise<RateLimitResult> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { success: true, reset: 0, remaining: 100 }
  console.warn('[csps/security] rateLimitUser: @upstash packages not installed')
  return { success: true, reset: 0, remaining: 100 }
}

export async function rateLimitAuth(_ip: string): Promise<RateLimitResult> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { success: true, reset: 0, remaining: 20 }
  console.warn('[csps/security] rateLimitAuth: @upstash packages not installed')
  return { success: true, reset: 0, remaining: 20 }
}
