// libs/integrations/jobs/functions/deliver-webhook.ts
// S035-C: Deliver outbound webhooks to registered endpoints.
// Triggered by event "webhook/deliver" — use triggerWebhook() to fire.
// Signs payload with HMAC-SHA256, POSTs to endpoint URL, logs result.
// Note: WebhookEndpoint model requires db:push for S032 schema changes to activate.

import { createHmac } from 'crypto'
import { inngest } from '../inngest'
import { PrismaClient } from '@prisma/client'
import { auditLog } from '../../security/audit'

type WebhookDeliverData = {
  tenantId: string
  eventType: string
  data: unknown
}

export const deliverWebhookFn = inngest.createFunction(
  {
    id: 'deliver-webhook',
    name: 'Deliver Webhook',
    retries: 3,
    triggers: [{ event: 'webhook/deliver' }],
  },
  async ({ event }) => {
    const { tenantId, eventType, data } = event.data as WebhookDeliverData
    const timestamp = Date.now()
    const prisma = new PrismaClient()

    try {
      // Query active endpoints for this tenant (raw prisma — system job, no auth context)
      let endpoints: { id: string; url: string; secret: string }[] = []
      try {
        endpoints = await prisma.webhookEndpoint.findMany({
          where: { tenantId, active: true, deletedAt: null },
          select: { id: true, url: true, secret: true },
        })
      } catch {
        // WebhookEndpoint model may not exist yet (db:push pending) — skip gracefully
        return { tenantId, eventType, endpoints: 0, note: 'WebhookEndpoint table not found — run db:push' }
      }

      const results: { endpointId: string; success: boolean; statusCode?: number }[] = []

      for (const endpoint of endpoints) {
        const body = JSON.stringify({ eventType, data, timestamp })
        const sig = createHmac('sha256', endpoint.secret)
          .update(body)
          .digest('hex')

        let success = false
        let statusCode: number | undefined

        try {
          const res = await fetch(endpoint.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSPS-Signature': `sha256=${sig}`,
              'X-CSPS-Event': eventType,
            },
            body,
          })

          statusCode = res.status
          success = res.ok

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
          }
        } catch (err) {
          success = false
        }

        // Audit log the delivery attempt
        try {
          await auditLog(prisma, {
            tenantId,
            action: 'webhook.delivered',
            resourceType: 'WebhookEndpoint',
            resourceId: endpoint.id,
            data: { success, statusCode, eventType },
          })
        } catch { /* audit log failure should not block webhook */ }

        results.push({ endpointId: endpoint.id, success, statusCode })
      }

      return { tenantId, eventType, delivered: results.length, results }
    } finally {
      await prisma.$disconnect()
    }
  }
)
