// Webhook idempotency — prevents duplicate processing when Stripe/Clerk retries delivery.
// wiring_deferred_until: S039 (used by webhook endpoints when webhook delivery is activated)
// Uses AuditEvent as the idempotency store (append-only, immutable — ideal for this).
//
// Pattern: call isProcessed(key, db) before handling; call markProcessed(key, ...) after.
// The key is typically: `${eventType}.${eventId}` (e.g., 'user.created.evt_xxx')

import type { PrismaClient } from '@prisma/client'

const SYSTEM_TENANT = 'system'  // for webhook events not tied to a specific tenant

export async function isProcessed(webhookKey: string, db: PrismaClient): Promise<boolean> {
  const existing = await db.auditEvent.findFirst({
    where: { action: `webhook.processed.${webhookKey}` },
  })
  return !!existing
}

export async function markProcessed(
  webhookKey: string,
  tenantId: string,
  db: PrismaClient
): Promise<void> {
  await db.auditEvent.create({
    data: {
      action: `webhook.processed.${webhookKey}`,
      actorId: null,
      resourceType: 'Webhook',
      resourceId: webhookKey,
      tenantId,
      data: { processed_at: new Date().toISOString() },
    },
  })
}

// Convenience: idempotent wrapper for webhook handlers
// Usage: await withIdempotency('user.created.evt_xxx', tenantId, db, async () => { ... })
export async function withIdempotency(
  webhookKey: string,
  tenantId: string,
  db: PrismaClient,
  handler: () => Promise<void>
): Promise<{ processed: boolean }> {
  if (await isProcessed(webhookKey, db)) {
    return { processed: false }  // already handled, skip
  }
  await handler()
  await markProcessed(webhookKey, tenantId, db)
  return { processed: true }
}
