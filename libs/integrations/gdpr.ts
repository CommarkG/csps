// GDPR Erasure Service
// Q-16 ratified: PII scope = email, displayName, TaskComment.body
// Q-17 ratified: self-service authorization (user-triggered from settings UI)
// Opus S022: NotificationLog must be covered before Phase 1 notifications launch

import { createHash } from 'crypto'

// Minimal DB interface for PII erasure — injected, not imported from app
export interface ErasureDb {
  user: {
    update: (args: { where: { id: string }; data: { email: string; displayName: null; deletedAt: Date } }) => Promise<unknown>
  }
  taskComment: {
    updateMany: (args: { where: { authorId: string }; data: { body: string } }) => Promise<{ count: number }>
  }
  auditEvent: {
    create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>
  }
}

export interface ErasureReceipt {
  erasure_id: string
  timestamp: Date
  fields_cleared: string[]
  rows_affected: number
}

export async function eraseUser(
  userId: string,
  tenantId: string,
  db: ErasureDb
): Promise<ErasureReceipt> {
  const hash = createHash('sha256').update(userId).digest('hex').slice(0, 8)
  const now = new Date()

  // Q-16: erase email + displayName on User row
  await db.user.update({
    where: { id: userId },
    data: { email: `[deleted-${hash}]`, displayName: null, deletedAt: now },
  })

  // Q-16: erase comment bodies authored by this user
  const comments = await db.taskComment.updateMany({
    where: { authorId: userId },
    data: { body: '[deleted]' },
  })

  // Write AuditEvent — immutable record of the erasure (not itself erased per Q-16)
  const auditRecord = await db.auditEvent.create({
    data: {
      tenantId,
      actorId: userId,
      action: 'user.gdpr_erasure_completed',
      resourceType: 'User',
      resourceId: userId,
      data: {
        fields_cleared: ['email', 'displayName', 'taskComment.body'],
        comment_rows_cleared: comments.count,
        erasure_hash: hash,
      },
    },
  })

  return {
    erasure_id: `erasure_${hash}_${(auditRecord as { id: string }).id.slice(0, 8)}`,
    timestamp: now,
    fields_cleared: ['email', 'displayName', 'taskComment.body'],
    rows_affected: 1 + comments.count,
  }
}
