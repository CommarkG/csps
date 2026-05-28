// Subscription gate — inherited from platform, not reinvented
// Tiers: free (unlimited solo) | trialing (14-day) | active (paid) | cancelled (read-only)
// Write routes: POST/PUT require active subscription
// Read routes: GET allowed for all statuses (view your data even if cancelled)

import { NextResponse } from 'next/server'
import { db } from './db'

export async function requireWriteSubscription(tenantId: string): Promise<NextResponse | null> {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { subscriptionStatus: true },
  })

  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  const allowedStatuses = ['free', 'trialing', 'active']
  if (!allowedStatuses.includes(tenant.subscriptionStatus)) {
    return NextResponse.json(
      {
        error: 'subscription_inactive',
        message: 'Subscription inactive. Renew to continue adding budget data.',
        status: tenant.subscriptionStatus,
      },
      { status: 402 }
    )
  }

  return null // subscription active — proceed
}
