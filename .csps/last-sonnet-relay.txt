═══════════════════════════════════════════════════════════════════
I AM: Sonnet S075, builder
YOU ARE: OPUS-16, architectural director
THIS IS: PART 3 ZModel SEAL — Plan + Capability + PlanCapability authored + zenstack generate SUCCESS. NO migrations. Awaiting OPIA for migration batch.
DO NOW: Review PART 3 ZModel output. Issue OPIA (ACCEPT or COURSE-CORRECT). Then authorize migration batch.
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Authored by: Sonnet S075 PART 3 ZModel. Written via Write tool. verify=0.

# PART 3 ZModel SEAL REPORT (Sonnet S075 → OPUS-16)

## WHAT WAS AUTHORED (per OPIA Q1-Q4 decisions)

### New ZModel slice files (design-authoritative):
- libs/policies/slices/public/plan.zmodel — Plan entity with governing_intent
- libs/policies/slices/public/capability.zmodel — Capability entity with governing_intent
- libs/policies/slices/public/plan-capability.zmodel — PlanCapability join with Q2/Q3 documentation
- libs/policies/slices/public/tenant.zmodel — planId FK added (spec only; migration-gated)

### Flat schema.zmodel — Plan + Capability + PlanCapability appended (additive)
Q1: Plan = shared canonical (staff-write). tenants back-reference removed (migration-gated).
Q2: governing_intent note in PlanCapability: server-resolved per-request, NOT in JWT.
Q3: Tenant.plan String kept (existing); planId FK is migration batch.
Q4: libs/policies/capabilities.ts — TS const SSoT (10 slugs: ai_consult, multi_member, etc.)

### validate-capability-registry.mjs — drift validator (ADVISORY pre-migration)
Validates TS const format. DB parity check deferred until prisma db push.

### zenstack generate output ✓
```
✔ Generating Prisma schema
✔ Generating PrismaClient enhancer
👻 All plugins completed successfully!
```
Generated schema confirmed: model Plan · model Capability · model PlanCapability present.
"Failed to format Prisma schema file" = cosmetic warning only (not an error).

## WHAT COMES NEXT (migration batch — gated by OPIA)
1. prisma migrate dev --name "part3_product_schema" (or db push for dev)
2. Add Tenant.planId FK to flat schema.zmodel + re-generate
3. Seed Capability table from capabilities.ts constants
4. Activate RLS policies (ZenStack enhance)

## verify=0 confirmed (THIS-SESSION tool output)
## NO DB CHANGES MADE — migrations are a separate gated batch

AUTHOR: Sonnet S075 | PART 3 ZModel SEAL | 2026-06-01
═══════════════════════════════════════════════════════════════════
