// CSPS Subscription Configuration
// Governor flexibility doctrine (S022): every value here is config, not hardcoded.
// Changing a trial duration or seat limit = edit this file only. No code changes needed.
//
// Q-08 ratified: 14 days trial
// Q-09 ratified: trial triggers on 2nd member (VLT-S014-005 confirmed)
// Q-13 ratified: free=1, trialing=5, paid=unlimited
// Q-02 ratified: cancelled → 402 immediately (Stripe dunning is the grace period)
// Q-03 ratified: write routes only — reads allowed for cancelled tenants

export const SUBSCRIPTION_CONFIG = {
  trial: {
    durationDays: 14,           // Q-08: 14 days. Change here → changes everywhere.
    triggerOnMemberCount: 2,    // Q-09: ratified VLT-S014-005. Change here → changes everywhere.
  },
  seats: {
    free: 1,                    // VLT-S014-005 ratified. DO NOT change without Governor directive.
    trialing: 5,                // Q-13: 5. Expect this to change after first cohort data.
    active: Infinity,           // Q-13: unlimited paid. May become per-seat billing later.
    cancelled: 0,               // Q-02: no write access.
  },
  cancelledBehavior: {
    httpStatus: 402,            // Q-02: 402 immediately on write attempts.
    errorCode: 'subscription_inactive' as const,
    allowReadRoutes: true,      // Q-03: GET requests still allowed — data portability.
  },
} as const;

// S076 Governor ratification: 'free' is DEPRECATED as a subscriptionStatus.
// Free-tier = status 'active' + planId null. Keep 'free' in the type union for
// backward-compat with existing DB rows until the enum migration runs (dim-4 window).
export type SubscriptionStatus = 'free' | 'trialing' | 'active' | 'cancelled';

export function getMaxSeats(status: SubscriptionStatus): number {
  const limit = SUBSCRIPTION_CONFIG.seats[status];
  return limit === Infinity ? Number.MAX_SAFE_INTEGER : (limit ?? 0);
}

export function getSubscriptionTier(status: SubscriptionStatus): 'free' | 'paid' | 'inactive' {
  if (status === 'active') return 'paid';
  if (status === 'cancelled') return 'inactive';
  return 'free'; // trialing returns 'free' tier; legacy 'free' status also maps here
}

export function isTierActive(status: SubscriptionStatus): boolean {
  // S076: 'active' and 'trialing' are entitled. 'free' is DEPRECATED (use active+planId=null).
  // Legacy 'free' rows still get access during the DB migration window (backward compat).
  return status === 'active' || status === 'trialing' || status === 'free'; // free kept for legacy rows
}

export function isNewTenantFree(status: SubscriptionStatus, planId: string | null): boolean {
  // S076 canonical check for "is this a free-tier tenant?" — use this instead of status==='free'
  return status === 'active' && planId === null;
}

export function isWriteAllowed(status: SubscriptionStatus): boolean {
  return isTierActive(status);
}
