// Shared AuditEvent writer — every Task/Project mutation calls this
// Tenant-scoped; actor = authenticated userId from Clerk JWT

import { db } from './db'

export async function writeAuditEvent(opts: {
  tenantId: string
  actorId: string | null
  action: string
  resourceType: string
  resourceId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>
}) {
  return db.auditEvent.create({
    data: {
      tenantId: opts.tenantId,
      actorId: opts.actorId,
      action: opts.action,
      resourceType: opts.resourceType,
      resourceId: opts.resourceId,
      // Prisma Json field accepts any serializable value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (opts.data as any) ?? undefined,
    },
  })
}
