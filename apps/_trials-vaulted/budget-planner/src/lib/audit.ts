// AuditEvent writer — every BudgetCategory + Transaction mutation calls this
// Tenant-scoped; actor = authenticated userId from Clerk JWT
// Action naming: budget.category.created | budget.transaction.created (domain-prefixed)
// AppendOnlyBase: AuditEvent cannot be deleted — financial audit integrity

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (opts.data as any) ?? undefined,
    },
  })
}
