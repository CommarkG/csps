// libs/integrations/jobs/trigger.ts
// wiring_deferred_until: S040 (requires 'inngest' package + INNGEST_SIGNING_KEY)

import { inngest } from './inngest'

export async function triggerWebhook(
  tenantId: string,
  eventType: string,
  data: unknown
): Promise<void> {
  if (!process.env.INNGEST_SIGNING_KEY) return
  await inngest.send({
    name: 'csps/webhook.trigger',
    data: { tenantId, eventType, payload: data },
  })
}
