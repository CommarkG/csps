// @csps-dna
// core_spine: ARCH
// @csps-enforces P-ARCH-007 (soft-delete) — Plan rows are SSoT for billing tiers
// @csps-prevention-class: SEED-MISSING-AFTER-DB-PUSH (FINDING-S076-DIM2-02)
// Run: npx tsx --env-file=.env libs/policies/seed/seed-plans.ts

/**
 * seed-plans.ts — Seed DB Plan table (free/pro/team/enterprise)
 *
 * WHY THIS EXISTS (S076 FINDING-S076-DIM2-02): the 4 Plan rows were authored only
 * inside migration.sql's INSERT. When the schema is applied via `prisma db push`
 * (the method this DB was bootstrapped with), that INSERT never runs — so the Plan
 * table is empty and test-tier-enforcement.ts throws "Team plan not found".
 * This script seeds the same 4 plans idempotently (upsert by slug), mirroring the
 * ratified values in 20260601_part3_product_schema/migration.sql lines 80-85.
 *
 * Run: npx tsx libs/policies/seed/seed-plans.ts
 * GUARDRAIL: must use DIRECT_URL (port 5432) — set in .env.local.
 * Apply BEFORE seed-capabilities.ts and test-tier-enforcement.ts.
 *
 * governing_intent: Plan rows in DB are the billing-tier SSoT the entitlement
 * policy layer (ZenStack) evaluates against. Capability granted IFF Plan has a
 * PlanCapability entry AND Tenant.subscriptionStatus ∈ {active,trialing}.
 */

// FINDING-S076-DIM2-05: changed from '../generated/generated/client' (stale stub — zero model accessors)
// to '@prisma/client' (refreshed by 'npx prisma db push --schema libs/policies/generated/schema.prisma').
// The generated/generated/client path has no output directive → db push writes to node_modules/@prisma/client.
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// GUARD (FINDING-S076-DIM2-05): verify @prisma/client has Plan model.
// If db.plan is undefined, db push has not run with the current schema.
if (!(db as any).plan) {
  console.error('[GUARD-DIM2-05] db.plan is undefined — @prisma/client is stale or missing Plan model.');
  console.error('  Fix: npx prisma db push --schema libs/policies/generated/schema.prisma');
  process.exit(1);
}

const PLAN_DEFINITIONS: Array<{
  slug: string;
  name: string;
  description: string;
  monthlyPriceUsd: string | null;
}> = [
  { slug: 'free',       name: 'Free',       description: 'Solo use — free forever',     monthlyPriceUsd: null },
  { slug: 'pro',        name: 'Pro',        description: 'Advanced AI + reporting',      monthlyPriceUsd: '19.00' },
  { slug: 'team',       name: 'Team',       description: '2+ members + RBAC',            monthlyPriceUsd: '49.00' },
  { slug: 'enterprise', name: 'Enterprise', description: 'Unlimited + custom limits',    monthlyPriceUsd: null },
];

async function main() {
  console.log('[seed-plans] Seeding Plan table...');

  let created = 0;
  let updated = 0;

  for (const plan of PLAN_DEFINITIONS) {
    const result = await db.plan.upsert({
      where: { slug: plan.slug },
      create: {
        slug: plan.slug,
        name: plan.name,
        description: plan.description,
        monthlyPriceUsd: plan.monthlyPriceUsd,
      },
      update: {
        name: plan.name,
        description: plan.description,
        monthlyPriceUsd: plan.monthlyPriceUsd,
      },
    });
    if (result.createdAt === result.updatedAt) created++;
    else updated++;
  }

  console.log(`[seed-plans] done: ${created} created, ${updated} updated (4 plans total)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
