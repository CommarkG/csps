// Re-exports writeAuditEvent wrapping libs/integrations/security/audit (auditLog).
// Keeps app API stable while deduplicating core logic. OPEN-038 dedup.

import { auditLog } from '@csps/integrations/security/audit'
import { db } from './db'

type AuditEventInput = {
  tenantId: string
  actorId: string
  action: string
  resourceType: string
  resourceId: string
  data?: Record<string, unknown>
}

export async function writeAuditEvent(event: AuditEventInput): Promise<void> {
  await auditLog(db, event)
}
