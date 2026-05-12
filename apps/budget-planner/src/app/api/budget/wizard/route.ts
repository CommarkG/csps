// GET /api/budget/wizard — check if wizard was completed for this tenant
// POST /api/budget/wizard — store crystallized budget intent (wizard completion)
//
// This is the Threshold Wizard API — the platform's proof of P-META-022 in user-facing code.
// The 3 crystallization questions produce: goalStatement (Q2c) + budgetTargets (Q3c)
// These are the user's OWN WORDS — never AI-drafted, never overridden by the platform.
//
// Once wizard is completed: BudgetGoal exists → dashboard is accessible
// Non-skippable gate: no dashboard without BudgetGoal (enforced in page.tsx redirect)

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { CspsSessionClaims } from '@csps/integrations'
import { db } from '@/lib/db'
import { writeAuditEvent } from '@/lib/audit'
import { getEnhancedDb } from '@/lib/zenstack'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}
function noTenant() {
  return NextResponse.json({ error: 'no_tenant' }, { status: 403 })
}

// GET — check wizard completion status
export async function GET() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return noTenant()

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  const goal = await edb.budgetGoal.findUnique({ where: { tenantId } })

  return NextResponse.json({
    completed: !!goal,
    goal: goal ?? null,
  })
}

// POST — complete wizard (stores human-authored Q2c + Q3c answers)
export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return unauthorized()
  const tenantId = (sessionClaims as CspsSessionClaims)?.tenantId
  if (!tenantId) return noTenant()

  const body = await request.json().catch(() => null)

  // goalStatement = Q2c: "What would success look like?" — human's exact words
  if (!body?.goalStatement || typeof body.goalStatement !== 'string' || body.goalStatement.trim().length < 5) {
    return NextResponse.json({
      error: 'goal_statement_required',
      message: 'Please describe what financial success looks like for you (your own words).',
    }, { status: 400 })
  }

  // budgetTargets = Q3c: [{categoryName, monthlyLimit}] — human's numbers
  if (!Array.isArray(body.budgetTargets) || body.budgetTargets.length === 0) {
    return NextResponse.json({
      error: 'budget_targets_required',
      message: 'Please add at least one spending target.',
    }, { status: 400 })
  }

  const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })
  if (!cspsUser) return NextResponse.json({ error: 'user_not_found' }, { status: 404 })

  const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })

  // Upsert: wizard can be re-completed if user wants to update their goals
  const goal = await edb.budgetGoal.upsert({
    where: { tenantId },
    create: {
      tenantId,
      goalStatement: body.goalStatement.trim(),
      budgetTargets: body.budgetTargets,
    },
    update: {
      goalStatement: body.goalStatement.trim(),
      budgetTargets: body.budgetTargets,
      completedAt: new Date(),
    },
  })

  // Audit trail — wizard completion is a significant user event
  await writeAuditEvent({
    tenantId,
    actorId: cspsUser.id,
    action: 'budget.wizard.completed',
    resourceType: 'BudgetGoal',
    resourceId: goal.id,
    data: {
      goalStatement: goal.goalStatement,
      targetCount: body.budgetTargets.length,
    },
  })

  return NextResponse.json({ completed: true, goal }, { status: 201 })
}
