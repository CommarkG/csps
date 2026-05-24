// CSPS TEMPLATE — replace [App Name] with your app name
// GET /api/events — Server-Sent Events using polling (Vercel serverless compatible).
// Polls user's Redis notification queue every 3 seconds. Streams events to client.
// Pattern: publisher.ts rpush → this route lrange + lrem (consume-once).

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { auth } from '@clerk/nextjs/server'
import type { CspsSessionClaims } from '@csps/integrations'

const POLL_INTERVAL_MS = 3000
const MAX_DURATION_MS = 25000 // Vercel serverless max ~30s

function notificationKey(tenantId: string, userId: string) {
  return `notifications:${tenantId}:${userId}`
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const { Redis } = require('@upstash/redis')
  return new Redis({ url, token })
}

function encode(data: string): Uint8Array {
  return new TextEncoder().encode(data)
}

export async function GET() {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) {
    return new Response('No tenant context', { status: 403 })
  }

  const redis = getRedis()
  const key = notificationKey(tenantId, userId)
  const startTime = Date.now()

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(encode(`data: {"type":"connected"}\n\n`))

      while (Date.now() - startTime < MAX_DURATION_MS) {
        if (redis) {
          try {
            // Get all pending notifications
            const messages = await redis.lrange(key, 0, -1) as string[]

            if (messages.length > 0) {
              // Delete consumed messages
              await redis.del(key)

              // Stream each message
              for (const msg of messages) {
                controller.enqueue(encode(`data: ${msg}\n\n`))
              }
            } else {
              // Heartbeat — keeps connection alive
              controller.enqueue(encode(`data: {"type":"ping"}\n\n`))
            }
          } catch {
            // Redis error — send ping and continue
            controller.enqueue(encode(`data: {"type":"ping"}\n\n`))
          }
        } else {
          // No Redis — just heartbeat
          controller.enqueue(encode(`data: {"type":"ping"}\n\n`))
        }

        // Wait before next poll
        await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
