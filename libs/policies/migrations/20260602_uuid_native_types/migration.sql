-- UUID Native Types Migration
-- gap_DIM2_CORE_ID_UUID_UPGRADE — deadline 2026-06-16 (calendar-enforced)
-- Authored: Sonnet S077, 2026-06-02
-- Opus directive: Q1=FREE, Q6=A (S077 opening PROTO)
--
-- WHAT: Converts all id columns + FK scalars from TEXT → native UUID type.
--       Values already conform (valid UUID v4 strings). USING ::uuid cast is safe.
--       Improves storage efficiency + index performance at 30-app multi-tenant scale.
--
-- WHAT IS NOT CHANGED:
--   Plan.id / Capability.id / PlanCapability.id — already UUID (PART 3 migration).
--   Tenant.planId / PlanCapability.planId / PlanCapability.capabilityId — already UUID.
--   AuditEvent.resourceId — generic external reference; NOT a CSPS UUID FK; kept as TEXT.
--
-- DO NOT run manually. Use the apply script (one command, atomic, self-verifying):
--   npx tsx --env-file=.env libs/policies/migrations/apply-uuid-migration.ts
--
-- WHY NOT prisma migrate deploy: DB was bootstrapped via prisma db push (P3005 — no baseline).
-- WHY NOT prisma db push: cannot cast text→uuid (Opus FINDING S077).
-- CORRECT path: raw SQL via apply-uuid-migration.ts on DIRECT_URL (port 5432).
--
-- governing_intent: Native UUID types give correct storage + index efficiency at 30-app scale.
--   The TEXT→UUID cast is safe because all existing values are valid UUID v4 strings.
--   See gap_DIM2_CORE_ID_UUID_UPGRADE in tools/data/gap-recurrence-register.yaml.
--
-- BLOCK-TEST (run after applying):
--   1. SELECT COUNT(*) FROM "public"."User" — must equal pre-migration row count (zero rows lost)
--   2. SELECT "id"::text FROM "public"."User" LIMIT 1 — must return a UUID-format string
--   3. SELECT column_name, data_type FROM information_schema.columns
--      WHERE table_schema = 'public' AND column_name = 'id' AND data_type != 'uuid'
--      — must return 0 rows (all id columns are now uuid type)
--   4. SELECT conname FROM pg_constraint WHERE contype = 'f' AND conname LIKE '%_fkey'
--      AND NOT conname IN ('Tenant_planId_fkey', 'PlanCapability_planId_fkey', 'PlanCapability_capabilityId_fkey')
--      — must return all FK constraints re-added (count = 20)
--
-- subscriptionStatus 'free' enum cleanup: deferred — separate migration after this lands.
--   Current: enum has 'free' value (deprecated, no rows should have it after S076 default=active fix).
--   Plan: UPDATE SET subscriptionStatus='active' WHERE subscriptionStatus='free', then DROP ENUM VALUE.
-- ============================================================================

BEGIN;

-- ── STEP 1: Drop all FK constraints that will have type mismatch during ALTER ──
-- (FK constraints that reference TEXT id columns being changed to UUID)
-- Constraints involving Plan/Capability/PlanCapability FKs are EXCLUDED — already UUID.

ALTER TABLE "public"."UserTenant"       DROP CONSTRAINT IF EXISTS "UserTenant_userId_fkey";
ALTER TABLE "public"."UserTenant"       DROP CONSTRAINT IF EXISTS "UserTenant_tenantId_fkey";
ALTER TABLE "public"."AuditEvent"       DROP CONSTRAINT IF EXISTS "AuditEvent_tenantId_fkey";
ALTER TABLE "public"."Project"          DROP CONSTRAINT IF EXISTS "Project_tenantId_fkey";
ALTER TABLE "public"."Task"             DROP CONSTRAINT IF EXISTS "Task_tenantId_fkey";
ALTER TABLE "public"."Task"             DROP CONSTRAINT IF EXISTS "Task_projectId_fkey";
ALTER TABLE "public"."Task"             DROP CONSTRAINT IF EXISTS "Task_createdById_fkey";
ALTER TABLE "public"."Task"             DROP CONSTRAINT IF EXISTS "Task_assigneeId_fkey";
ALTER TABLE "public"."TaskComment"      DROP CONSTRAINT IF EXISTS "TaskComment_taskId_fkey";
ALTER TABLE "public"."TaskComment"      DROP CONSTRAINT IF EXISTS "TaskComment_authorId_fkey";
ALTER TABLE "public"."Notification"     DROP CONSTRAINT IF EXISTS "Notification_tenantId_fkey";
ALTER TABLE "public"."Notification"     DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE "public"."Habit"            DROP CONSTRAINT IF EXISTS "Habit_tenantId_fkey";
ALTER TABLE "public"."HabitLog"         DROP CONSTRAINT IF EXISTS "HabitLog_habitId_fkey";
ALTER TABLE "public"."HabitLog"         DROP CONSTRAINT IF EXISTS "HabitLog_tenantId_fkey";
ALTER TABLE "public"."WebhookEndpoint"  DROP CONSTRAINT IF EXISTS "WebhookEndpoint_tenantId_fkey";
ALTER TABLE "public"."BudgetCategory"   DROP CONSTRAINT IF EXISTS "BudgetCategory_tenantId_fkey";
ALTER TABLE "public"."Transaction"      DROP CONSTRAINT IF EXISTS "Transaction_tenantId_fkey";
ALTER TABLE "public"."Transaction"      DROP CONSTRAINT IF EXISTS "Transaction_categoryId_fkey";
ALTER TABLE "public"."BudgetGoal"       DROP CONSTRAINT IF EXISTS "BudgetGoal_tenantId_fkey";

-- ── STEP 2: Alter id columns TEXT → UUID (14 tables) ──
-- Safe: all values are valid UUID v4 strings (confirmed from S076 seed run).

ALTER TABLE "public"."User"             ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."Tenant"           ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."UserTenant"       ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."AuditEvent"       ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."Project"          ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."Task"             ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."TaskComment"      ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."Notification"     ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."Habit"            ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."HabitLog"         ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."WebhookEndpoint"  ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."BudgetCategory"   ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."Transaction"      ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;
ALTER TABLE "public"."BudgetGoal"       ALTER COLUMN "id"        TYPE uuid USING "id"::uuid;

-- ── STEP 3: Alter FK columns TEXT → UUID ──
-- User.tenantId: denormalized field, no FK constraint — simple ALTER.
ALTER TABLE "public"."User"             ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- UserTenant FK fields
ALTER TABLE "public"."UserTenant"       ALTER COLUMN "userId"     TYPE uuid USING "userId"::uuid;
ALTER TABLE "public"."UserTenant"       ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- AuditEvent FK fields (actorId nullable — USING handles NULL correctly)
ALTER TABLE "public"."AuditEvent"       ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;
ALTER TABLE "public"."AuditEvent"       ALTER COLUMN "actorId"    TYPE uuid USING "actorId"::uuid;

-- Project FK fields
ALTER TABLE "public"."Project"          ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- Task FK fields (projectId + assigneeId nullable)
ALTER TABLE "public"."Task"             ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;
ALTER TABLE "public"."Task"             ALTER COLUMN "projectId"  TYPE uuid USING "projectId"::uuid;
ALTER TABLE "public"."Task"             ALTER COLUMN "createdById" TYPE uuid USING "createdById"::uuid;
ALTER TABLE "public"."Task"             ALTER COLUMN "assigneeId" TYPE uuid USING "assigneeId"::uuid;

-- TaskComment FK fields
ALTER TABLE "public"."TaskComment"      ALTER COLUMN "taskId"     TYPE uuid USING "taskId"::uuid;
ALTER TABLE "public"."TaskComment"      ALTER COLUMN "authorId"   TYPE uuid USING "authorId"::uuid;

-- Notification FK fields
ALTER TABLE "public"."Notification"     ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;
ALTER TABLE "public"."Notification"     ALTER COLUMN "userId"     TYPE uuid USING "userId"::uuid;

-- Habit FK fields
ALTER TABLE "public"."Habit"            ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- HabitLog FK fields
ALTER TABLE "public"."HabitLog"         ALTER COLUMN "habitId"    TYPE uuid USING "habitId"::uuid;
ALTER TABLE "public"."HabitLog"         ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- WebhookEndpoint FK fields
ALTER TABLE "public"."WebhookEndpoint"  ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- BudgetCategory FK fields
ALTER TABLE "public"."BudgetCategory"   ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- Transaction FK fields
ALTER TABLE "public"."Transaction"      ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;
ALTER TABLE "public"."Transaction"      ALTER COLUMN "categoryId" TYPE uuid USING "categoryId"::uuid;

-- BudgetGoal FK fields
ALTER TABLE "public"."BudgetGoal"       ALTER COLUMN "tenantId"   TYPE uuid USING "tenantId"::uuid;

-- ── STEP 4: Re-add all FK constraints ──
-- All referenced columns are now UUID type — constraints can be recreated.

ALTER TABLE "public"."UserTenant"
    ADD CONSTRAINT "UserTenant_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "public"."User"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."UserTenant"
    ADD CONSTRAINT "UserTenant_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."AuditEvent"
    ADD CONSTRAINT "AuditEvent_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Project"
    ADD CONSTRAINT "Project_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Task"
    ADD CONSTRAINT "Task_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Task"
    ADD CONSTRAINT "Task_projectId_fkey"
        FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."Task"
    ADD CONSTRAINT "Task_createdById_fkey"
        FOREIGN KEY ("createdById") REFERENCES "public"."User"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Task"
    ADD CONSTRAINT "Task_assigneeId_fkey"
        FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."TaskComment"
    ADD CONSTRAINT "TaskComment_taskId_fkey"
        FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."TaskComment"
    ADD CONSTRAINT "TaskComment_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "public"."User"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Notification"
    ADD CONSTRAINT "Notification_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Notification"
    ADD CONSTRAINT "Notification_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "public"."User"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Habit"
    ADD CONSTRAINT "Habit_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."HabitLog"
    ADD CONSTRAINT "HabitLog_habitId_fkey"
        FOREIGN KEY ("habitId") REFERENCES "public"."Habit"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."HabitLog"
    ADD CONSTRAINT "HabitLog_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."WebhookEndpoint"
    ADD CONSTRAINT "WebhookEndpoint_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."BudgetCategory"
    ADD CONSTRAINT "BudgetCategory_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Transaction"
    ADD CONSTRAINT "Transaction_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Transaction"
    ADD CONSTRAINT "Transaction_categoryId_fkey"
        FOREIGN KEY ("categoryId") REFERENCES "public"."BudgetCategory"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."BudgetGoal"
    ADD CONSTRAINT "BudgetGoal_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;

-- ── STEP 5: Verification ──
-- apply-uuid-migration.ts runs CHECK 1/2/3 inside this transaction before committing.
-- Migration history is NOT tracked by Prisma (_prisma_migrations table does not exist;
-- DB was bootstrapped via prisma db push, not prisma migrate). No action needed here.

COMMIT;
