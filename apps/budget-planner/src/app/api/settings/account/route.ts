// DELETE /api/settings/account — GDPR self-service erasure
// Platform inheritance: eraseUser() from libs/integrations/gdpr.ts
// Budget-planner extension: also erases budget-specific PII:
//   - BudgetGoal.goalStatement (personal financial intent — user's exact words)
//   - Transaction.note fields (personal annotations)
//
// After erasure: user's financial data is anonymized but structure preserved for audit
// AuditEvent: budget.account.erased (immutable record of erasure timestamp)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { eraseUser } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function DELETE() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return NextResponse.json({ error: 'no_tenant' }, { status: 403 })

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  // Step 1: Standard CSPS PII erasure (User.email, User.displayName, TaskComment.body)
  // Note: Budget Planner has no task comments; eraseUser still handles User fields
  const receipt = await eraseUser(cspsUser.id, tenantId, {
    user: {
      update: (args) => db.user.update(args),
    },
    taskComment: {
      // Budget Planner doesn't have task comments — no-op
      updateMany: async () => ({ count: 0 }),
    },
    auditEvent: {
      create: (args) => db.auditEvent.create(args),
    },
  })

  // Step 2: Budget-specific PII erasure
  // Anonymize BudgetGoal.goalStatement (personal financial statement)
  await db.budgetGoal.updateMany({
    where: { tenantId },
    data: { goalStatement: '[erased]' },
  })

  // Anonymize Transaction.note fields (personal annotations)
  await db.transaction.updateMany({
    where: { tenantId, deletedAt: null },
    data: { note: null },
  })

  // Audit trail (immutable — records that erasure happened, not what was erased)
  await writeAuditEvent({
    tenantId,
    actorId: cspsUser.id,
    action: 'budget.account.erased',
    resourceType: 'User',
    resourceId: cspsUser.id,
    data: {
      erasure_id: receipt.erasure_id,
      fields_cleared: [...receipt.fields_cleared, 'BudgetGoal.goalStatement', 'Transaction.note'],
    },
  })

  return NextResponse.json({
    erased: true,
    receipt: receipt.erasure_id,
    timestamp: receipt.timestamp,
  })
}
