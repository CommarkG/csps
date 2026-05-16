// libs/integrations/jobs/trigger.ts
// S035-C: Helper to trigger webhook delivery from anywhere in the platform.
// Usage: await triggerWebhook(tenantId, 'task.created', { taskId, title })

import { inngest } from './inngest'

/**
 * Trigger outbound webhook delivery for all active endpoints in a tenant.
 * Non-blocking — Inngest handles delivery with retries.
 */
export async function triggerWebhook(
  tenantId: string,
  eventType: string,
  data: unknown
): Promise<void> {
  await inngest.send({
    name: 'webhook/deliver',
    data: { tenantId, eventType, data },
  })
}
