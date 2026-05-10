// Subscription enforcement — reads from SUBSCRIPTION_CONFIG (libs/config/)
// Q-02 ratified: cancelled tenant → 402 immediately (Stripe dunning is the grace period)
// Q-03 ratified: write routes only — GET requests still allowed

import { SUBSCRIPTION_CONFIG, type SubscriptionStatus } from '../../../../libs/config/subscription.config'
import { NextResponse } from 'next/server'

export class SubscriptionInactiveError extends Error {
  readonly statusCode = SUBSCRIPTION_CONFIG.cancelledBehavior.httpStatus
  readonly code = SUBSCRIPTION_CONFIG.cancelledBehavior.errorCode
  constructor() {
    super('Subscription is inactive. Renew to continue writing.')
  }
}

export function subscriptionAllowsWrite(status: string): boolean {
  return SUBSCRIPTION_CONFIG.cancelledBehavior.allowReadRoutes
    ? status !== 'cancelled'
    : ['free', 'trialing', 'active'].includes(status)
}

export function subscriptionWriteResponse(): NextResponse {
  return NextResponse.json(
    {
      error: SUBSCRIPTION_CONFIG.cancelledBehavior.errorCode,
      message: 'Subscription inactive. Renew to continue writing.',
    },
    { status: SUBSCRIPTION_CONFIG.cancelledBehavior.httpStatus }
  )
}

export async function requireWriteSubscription(
  tenantId: string,
  db: { tenant: { findUnique: (args: { where: { id: string }, select: { subscriptionStatus: true } }) => Promise<{ subscriptionStatus: string } | null> } }
): Promise<NextResponse | null> {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    select: { subscriptionStatus: true },
  })
  if (!tenant || !subscriptionAllowsWrite(tenant.subscriptionStatus)) {
    return subscriptionWriteResponse()
  }
  return null
}
