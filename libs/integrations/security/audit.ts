// libs/integrations/security/audit.ts
// S032-C: Platform audit log writer. Wraps AuditEvent creation.
// Pattern: accepts db as parameter (injected at call site from @/lib/db) — keeps lib generic.
//
// Usage:
//   import { auditLog } from '@csps/integrations/security/audit'
//   import { db } from '@/lib/db'
//   await auditLog(db, { tenantId, actorId, action: 'user.login', resourceType: 'User', resourceId: userId })

import type { PrismaClient } from '@prisma/client'

type AuditLogInput = {
  tenantId: string
  actorId?: string | null
  action: string        // e.g. 'task.created', 'member.added', 'webhook.triggered'
  resourceType: string  // e.g. 'Task', 'UserTenant', 'WebhookEndpoint'
  resourceId: string
  data?: Record<string, unknown>
}

export async function auditLog(db: PrismaClient, event: AuditLogInput): Promise<void> {
  await db.auditEvent.create({
    data: {
      tenantId: event.tenantId,
      actorId: event.actorId,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      data: event.data ?? {},
    },
  })
}
