// libs/integrations/realtime/publisher.ts
// wiring_deferred_until: S040 (requires pnpm add @upstash/redis + UPSTASH_REDIS_REST_URL)
// Stub: graceful no-op until @upstash/redis installed + env vars set

import type { NotificationEvent } from './types'

export async function publishNotification(event: NotificationEvent): Promise<void> {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn('[csps/realtime] Upstash not configured — notification not published:', event.type)
    return
  }
  console.warn('[csps/realtime] @upstash/redis not installed — notification not published:', event.type)
}
