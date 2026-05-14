// CSPS TEMPLATE — replace [App Name] with your app name
// Platform audit event writer — all significant actions create an immutable AuditEvent
// Pattern: never delete AuditEvents. They are the compliance trail.

import { db } from './db'

type AuditEventInput = {
  tenantId: string
  actorId: string
  action: string        // e.g. 'user.login', '[app].resource.created'
  resourceType: string  // e.g. 'User', '[Resource]'
  resourceId: string
  data?: Record<string, unknown>
}

export async function writeAuditEvent(event: AuditEventInput): Promise<void> {
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
