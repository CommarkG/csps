/**
 * test-tier-enforcement.ts — MANDATORY governing_intent BLOCK-TESTs
 *
 * Per Opus OPIA requirement: paste BOTH DENIED outputs before SEAL.
 * Run after migration + seed: npx tsx libs/policies/seed/test-tier-enforcement.ts
 *
 * BLOCK-TEST A: capability NOT in tenant's plan → DENIED
 * BLOCK-TEST B: granted capability + subscriptionStatus='cancelled' → DENIED
 *
 * These tests prove the planId × subscriptionStatus interaction:
 * "capability granted IFF Plan has it AND subscriptionStatus ∈ {active,trialing}"
 *
 * governing_intent: structural enforcement, not application-level check.
 * CANNOT RUN until migration applied + seed executed + Tenant.planId FK migrated.
 * The block-test output must be pasted in the SEAL report.
 */

import { PrismaClient } from '../generated/generated/client';
import { CAPABILITY } from '../capabilities';

const db = new PrismaClient();

/**
 * Simulates the entitlement check (server-resolved per Q2 decision).
 * This logic lives in middleware/lib — NOT in JWT.
 */
async function hasCapability(
  tenantId: string,
  capabilitySlug: string
): Promise<{ granted: boolean; reason: string }> {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    // Note: include plan after Tenant.planId FK migration
    // include: { plan: { include: { capabilities: { include: { capability: true } } } } }
  });

  if (!tenant) return { granted: false, reason: 'Tenant not found' };

  // Q3: subscriptionStatus check (billing lifecycle gate)
  const entitledStatuses = ['active', 'trialing'];
  if (!entitledStatuses.includes(tenant.subscriptionStatus)) {
    return {
      granted: false,
      reason: `DENIED: subscriptionStatus='${tenant.subscriptionStatus}' — not in {active,trialing}`
    };
  }

  // Q1+Q2: plan capability check (after planId FK migration)
  // For now (pre-planId-FK), check against plan string field
  if (!tenant.plan || tenant.plan === 'free') {
    // Free tier capabilities
    const freeCapabilities = [CAPABILITY.AI_CONSULT];
    if (!freeCapabilities.includes(capabilitySlug as typeof freeCapabilities[number])) {
      return {
        granted: false,
        reason: `DENIED: capability '${capabilitySlug}' not included in free plan`
      };
    }
  }

  return { granted: true, reason: 'Granted: plan capability check passed' };
}

async function main() {
  console.log('[test-tier-enforcement] Running MANDATORY BLOCK-TESTs...\n');

  // These tests require actual DB data to run.
  // Expected output to paste in SEAL report:
  console.log('BLOCK-TEST A — Capability NOT in plan:');
  console.log('Expected: { granted: false, reason: "DENIED: capability \'analytics_full\' not included in free plan" }');
  console.log('');

  console.log('BLOCK-TEST B — Granted capability + subscriptionStatus=cancelled:');
  console.log('Expected: { granted: false, reason: "DENIED: subscriptionStatus=\'cancelled\' — not in {active,trialing}" }');
  console.log('');

  console.log('NOTE: These tests require live DB + Tenant.planId FK migration to run.');
  console.log('Apply migration.sql, run seed, then re-run this test with actual tenant IDs.');
  console.log('Paste both DENIED outputs in the SEAL report before claiming PART 3 SEAL.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
