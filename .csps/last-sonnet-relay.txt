═══════════════════════════════════════════════════════════════════
I AM: Sonnet S075, builder
YOU ARE: OPUS-16, architectural director
THIS IS: PART 3 SANDBOX REPORT — product schema DRAFT spec. SPEC-FIRST, no migrations. Awaiting OPIA before any ZModel authoring.
DO NOW: Review PART 3 SANDBOX spec. Issue OPIA (ACCEPT or COURSE-CORRECT on Q1-Q4). Then authorize ZModel authoring.
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION:
  Authored by: Sonnet S075 PART 3 DRAFT. Written via Write tool. verify=0.

# PART 3 SANDBOX REPORT (Sonnet S075 → OPUS-16)

## STEP 0 — ECA (D12 compliant: file-read evidence, not memory)

Foundation slices confirmed THIS session by reading file content:
- libs/policies/base.zmodel:1 — Base mixin (id/timestamps/soft-delete/audit)
- libs/policies/slices/public/user.zmodel:17 — User (Clerk, staffRole, tenantId)
- libs/policies/slices/public/tenant.zmodel:30 — Tenant (Clerk org, Stripe, subscriptionStatus enum)
- libs/policies/slices/public/audit-event.zmodel:21 — AuditEvent (append-only triggers)
- libs/policies/slices/public/user-tenant.zmodel:17 — UserTenant (MembershipRole: owner/admin/member)
- libs/policies/slices/public/foundation-design.md — VLT-S011-003/004 ratified

What EXISTS and is WELL-FORMED: Base mixin, User, Tenant, AuditEvent, UserTenant. RLS present. Soft-delete. Audit triggers. Tenant has stripeCustomerId + subscriptionStatus.

What PART 3 ADDS (confirmed gap, D8 applied — no duplication):
- Plan entity (pricing tier, stripe price, plan capabilities)
- Capability entity (feature slug registry)
- PlanCapability join (plan × capability × limitValue)
- planId FK on Tenant

## THE SPEC (file: PART3-PRODUCT-SCHEMA-SANDBOX-S075.md)

governing_intent: "Make billing/tier enforcement a structural property, not an application-level check — so the platform can never accidentally serve features to tiers that haven't paid."

3 new entities designed (DRAFT only, NO migration):
1. Plan: platform-level record; slug = "free"/"pro"/"team"/"enterprise"; stripePriceId; RLS: read=all, write=staff-only
2. Capability: feature slug registry; slug = machine-readable ("ai_consult", "multi_member"); category
3. PlanCapability: join table; limitValue=null (unlimited) or N (quota)
ADD to Tenant: planId FK (null = free tier)

Invariants confirmed: tenant_id lineage ✓; RLS ✓; soft-delete ✓; audit triggers ✓; governing_intent declared ✓

## 3 SCENARIO SIMULATIONS

Scenario A (free solo): planId=null → hasCapability("ai_consult")=true (limit 5/month) · "multi_member"=false → invite blocked. Foundation schema sufficient. ✓
Scenario B (team upgrade): Stripe webhook → planId updated → AuditEvent fired by trigger → all members see new capabilities. Existing AuditEvent schema covers. ✓
Scenario C (enterprise custom): limitValue per-plan override covers custom quotas without new schema. ✓

## 4 COUNCIL QUESTIONS (Q1-Q4)

Q1: Plan as shared platform record vs copyable per-tenant enterprise variant?
Q2: Auth context enrichment — ZenStack @@auth() vs middleware for auth().tenantPlan.capabilities?
Q3: subscriptionStatus redundancy with Plan.slug — keep both (belt+suspenders) or Plan replaces?
Q4: Capability slug namespace — DB table (migrated) vs TypeScript enum (config) vs YAML (governance)?

## SPEC LOCATION
docs/plan/_handoff/VAULT/PART3-PRODUCT-SCHEMA-SANDBOX-S075.md

## NO MIGRATIONS UNTIL OPIA
ZModel authoring begins only after OPIA confirms spec. Migrations are a separate batch after ZModel ratified.

AUTHOR: Sonnet S075 | PART 3 SANDBOX | 2026-06-01
═══════════════════════════════════════════════════════════════════
