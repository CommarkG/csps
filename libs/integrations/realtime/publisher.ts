// libs/integrations/realtime/publisher.ts
// wiring_deferred_until: S039 (requires UPSTASH_REDIS_REST_URL + notification UI in apps)
// S035-B: Publish notifications to a per-user Redis list.
// Uses rpush (append to list) — SSE route polls with lrange + lrem to consume.
// Polling-based SSE pattern: compatible with Vercel serverless (no SUBSCRIBE needed).
// Graceful passthrough when UPSTASH env vars not set.

import type { NotificationEvent } from './types'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const { Redis } = require('@upstash/redis')
  return new Redis({ url, token })
}

function notificationKey(tenantId: string, userId: string): string {
  return `notifications:${tenantId}:${userId}`
}

/**
 * Publish a notification to a user's queue.
 * The SSE route polls this queue every 3 seconds and consumes events.
 */
export async function publishNotification(event: NotificationEvent): Promise<void> {
  const redis = getRedis()
  if (!redis) {
    console.warn('[csps/realtime] Upstash not configured — notification not published:', event.type)
    return
  }

  const key = notificationKey(event.tenantId, event.userId)
  const payload = JSON.stringify({ ...event, timestamp: Date.now() })

  await redis.rpush(key, payload)

  // Auto-expire notification queue after 24h to prevent unbounded growth
  await redis.expire(key, 86400)
}
