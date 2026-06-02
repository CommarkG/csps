-- PART 3 — Product Schema Migration
-- Plan + Capability + PlanCapability
-- Authored manually (S075): DB unreachable from dev env; apply from machine with Supabase access.
-- Run: npx prisma migrate dev --schema libs/policies/generated/schema.prisma
-- OR: npx prisma migrate deploy --schema libs/policies/generated/schema.prisma
-- GUARDRAIL: must use DIRECT_URL (port 5432), NOT pgbouncer (port 6543) — else 42P05
--
-- governing_intent: These tables implement structural tier enforcement.
-- Capability granted IFF Plan has PlanCapability entry AND Tenant.subscriptionStatus ∈ {active,trialing}.

-- -----------------------------------------------------------------------------
-- Plan (platform-level billing tier)
-- -----------------------------------------------------------------------------
CREATE TABLE "public"."Plan" (
    "id"              UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    "deletedAt"       TIMESTAMP(3),
    "slug"            TEXT NOT NULL,
    "name"            TEXT NOT NULL,
    "description"     TEXT,
    "monthlyPriceUsd" DECIMAL(10,2),
    "stripePriceId"   TEXT,
    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Plan_slug_key" ON "public"."Plan"("slug");
CREATE INDEX "Plan_slug_idx" ON "public"."Plan"("slug");

-- -----------------------------------------------------------------------------
-- Capability (feature slug registry)
-- -----------------------------------------------------------------------------
CREATE TABLE "public"."Capability" (
    "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "deletedAt"   TIMESTAMP(3),
    "slug"        TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "category"    TEXT,
    "deprecated"  BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Capability_slug_key" ON "public"."Capability"("slug");
CREATE INDEX "Capability_slug_idx" ON "public"."Capability"("slug");
CREATE INDEX "Capability_category_idx" ON "public"."Capability"("category");

-- -----------------------------------------------------------------------------
-- PlanCapability (plan × capability join table)
-- -----------------------------------------------------------------------------
CREATE TABLE "public"."PlanCapability" (
    "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "deletedAt"     TIMESTAMP(3),
    "planId"        UUID NOT NULL,
    "capabilityId"  UUID NOT NULL,
    "limitValue"    INTEGER,
    CONSTRAINT "PlanCapability_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlanCapability_planId_fkey"
        FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlanCapability_capabilityId_fkey"
        FOREIGN KEY ("capabilityId") REFERENCES "public"."Capability"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "PlanCapability_planId_capabilityId_key"
    ON "public"."PlanCapability"("planId", "capabilityId");
CREATE INDEX "PlanCapability_planId_idx" ON "public"."PlanCapability"("planId");
CREATE INDEX "PlanCapability_capabilityId_idx" ON "public"."PlanCapability"("capabilityId");

-- -----------------------------------------------------------------------------
-- Seed initial plans (from capabilities.ts SSoT)
-- NOTE: Seed script at libs/policies/seed/seed-capabilities.ts handles Capability rows
-- Run: npx tsx libs/policies/seed/seed-capabilities.ts
-- -----------------------------------------------------------------------------
INSERT INTO "public"."Plan" ("id", "createdAt", "updatedAt", "slug", "name", "description", "monthlyPriceUsd")
VALUES
    (gen_random_uuid(), NOW(), NOW(), 'free',       'Free',       'Solo use — free forever', NULL),
    (gen_random_uuid(), NOW(), NOW(), 'pro',        'Pro',        'Advanced AI + reporting',  19.00),
    (gen_random_uuid(), NOW(), NOW(), 'team',       'Team',       '2+ members + RBAC',        49.00),
    (gen_random_uuid(), NOW(), NOW(), 'enterprise', 'Enterprise', 'Unlimited + custom limits', NULL);

-- C3 FIX (OPUS-16 S075): Tenant.planId FK is NOW in this migration (added to flat schema.zmodel).
-- The planRelation field enables ZenStack enhanced-client policy evaluation for block-tests.
ALTER TABLE "public"."Tenant"
    ADD COLUMN "planId" UUID,
    ADD CONSTRAINT "Tenant_planId_fkey"
        FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Tenant_planId_idx" ON "public"."Tenant"("planId");

-- The existing Tenant.plan String field coexists (backward compat) — migrated in next batch.
