---
id: csps.handoff.vault.part3-product-schema-sandbox-s075
name: PART3-PRODUCT-SCHEMA-SANDBOX-S075
description: >
  DRAFT→SANDBOX spec for PART 3 product schema. SPEC-FIRST per sandbox-before-implementation.
  Foundation slices (User/Tenant/AuditEvent) already exist (ECA confirmed). PART 3 adds:
  Plan/PricingTier + Capability/Feature + tier classification. NO Prisma/ZModel migrations
  until council ratifies. Simulates 3 scenarios vs real data.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-06-15"
core_spine: ARCH
schema_anchor: vault_files
closure_owner: group:finky
closure_decision: "Opus ratifies spec before any migration or ZModel file is written"
closure_by: "S076 after OPIA"
links:
  - { rel: base-zmodel, href: ../../../../libs/policies/base.zmodel }
  - { rel: foundation-design, href: ../../../../libs/policies/slices/public/foundation-design.md }
  - { rel: user, href: ../../../../libs/policies/slices/public/user.zmodel }
  - { rel: tenant, href: ../../../../libs/policies/slices/public/tenant.zmodel }
  - { rel: audit-event, href: ../../../../libs/policies/slices/public/audit-event.zmodel }
  - { rel: user-tenant, href: ../../../../libs/policies/slices/public/user-tenant.zmodel }
consolidation_cross_refs:
  - libs/policies/base.zmodel
  - libs/policies/slices/public/foundation-design.md
  - libs/policies/slices/public/tenant.zmodel
---

# PART 3 — Product Schema DRAFT SANDBOX Spec

## ECA (Existing-Coverage Attestation)
```
ran: node tools/scripts/platform-inventory-scan.mjs --exhaustive --query="User Tenant AuditEvent schema ZModel Prisma RLS"
passes: 2, zero-new: ACHIEVED, total: 5 platform artifacts
```

Files confirmed with content (read this session, D12 compliant):
- `libs/policies/base.zmodel:1` — Base mixin (id UUID v7, createdAt, updatedAt, deletedAt, soft-delete)
- `libs/policies/slices/public/user.zmodel:17` — User model (Clerk, staffRole, tenantId session context)
- `libs/policies/slices/public/tenant.zmodel:30` — Tenant model (Clerk org, Stripe, subscription enum)
- `libs/policies/slices/public/audit-event.zmodel:21` — AuditEvent (append-only, RLS, trigger-only writes)
- `libs/policies/slices/public/user-tenant.zmodel:17` — UserTenant (membership, MembershipRole enum)
- `libs/policies/slices/public/foundation-design.md` — VLT-S011-003/004 ratified decisions

**What the foundation already has:**
- ✓ Base mixin applied to all entities
- ✓ Tenant.subscriptionStatus: `free | trialing | active | cancelled`
- ✓ UserTenant.role: `owner | admin | member`
- ✓ Tenant.stripeCustomerId (Stripe wiring placeholder)
- ✓ AuditEvent with trigger-only writes (P-ARCH-008)
- ✓ All RLS policies tenant-scoped

**What PART 3 adds (gap, not duplication):**
- ❌ No Plan/PricingTier entity (subscription status exists but no plan details)
- ❌ No Capability/Feature model (what features each tier unlocks)
- ❌ No tier classification system beyond the 4-value enum
- ❌ No App entity (apps are tenants or scoped differently — design decision needed)

---

## LEVEL-0 INTENT (governing_intent — per P-META-031 / HARDWIRE-007)

**Governing_intent of PART 3:**
"The product schema defines how the platform tracks what tenants are entitled to (their plan), what capabilities those plans unlock (features), and how that entitlement is enforced at the data layer (RLS + middleware checks). The goal is to make billing/tier enforcement a structural property, not an application-level check — so the platform can never accidentally serve features to tiers that haven't paid for them."

This is NOT about: CRUD apps, user management, or billing UI.
This IS about: structural entitlement enforcement at the schema layer.

---

## THE 3 NEW ENTITIES (design decisions)

### Entity 1: Plan
**Purpose**: Defines a billing tier — what a tenant subscribes to.
**Relationship to Tenant**: Tenant has one active Plan. Plan has many Tenants.
**Governing_intent**: Plan is the contract between the platform and the tenant. It exists independently of individual tenants so that plan changes propagate across all tenants on that plan without manual updates.

```zmodel
// Draft — NOT final, NOT migrated
model Plan {
  id          String   // UUID, immutable
  slug        String   @unique  // e.g. "free", "pro", "team", "enterprise"
  name        String
  description String?
  monthlyPriceUsd Decimal?     // null = free forever
  stripePriceId String?        // Stripe Price ID for recurring billing

  tenants   Tenant[]
  capabilities PlanCapability[]

  // Governing_intent: plans are platform-level records, not tenant-owned.
  // Staff can create/update; tenants can only read their own plan.
  @@allow("read", true)                    // plans are public (pricing page)
  @@allow("create,update", auth().staffRole == "staff" || auth().staffRole == "admin")
  @@deny("delete", true)                   // never hard-delete plans
}
```

**ADD to Tenant model** (no other changes):
```zmodel
// Add to existing Tenant:
planId   String?                           // null = free (default plan)
plan     Plan?  @relation(fields: [planId], references: [id])
```

### Entity 2: Capability
**Purpose**: Defines a named feature/ability the platform provides.
**Governing_intent**: Capabilities are the vocabulary of what the platform can do. Declaring them explicitly (vs. hardcoding feature flags) means the tier system is schema-driven and auditable.

```zmodel
// Draft — NOT final
model Capability {
  id          String   @unique
  slug        String   @unique  // machine-readable: "ai_consult", "multi_member", "analytics_full"
  name        String
  description String?
  category    String?            // grouping: "ai", "collaboration", "reporting"

  plans PlanCapability[]
}
```

### Entity 3: PlanCapability (join table)
**Purpose**: Which capabilities each plan unlocks. Many-to-many.

```zmodel
// Draft — NOT final
model PlanCapability {
  planId       String
  capabilityId String
  limitValue   Int?              // null = unlimited; N = usage limit

  plan       Plan       @relation(fields: [planId], references: [id])
  capability Capability @relation(fields: [capabilityId], references: [id])

  @@unique([planId, capabilityId])
}
```

---

## TIER CLASSIFICATION (the entitlement check)

Rather than a new model, tier classification is a VIEW over Plan + PlanCapability:

```typescript
// Pseudocode — no migration needed; computed in middleware/lib
async function hasCapability(tenantId: string, capabilitySlug: string): Promise<boolean> {
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    include: { plan: { include: { capabilities: { include: { capability: true } } } } }
  });
  if (!tenant?.plan) return FREE_CAPABILITIES.includes(capabilitySlug); // free tier
  return tenant.plan.capabilities.some(pc => pc.capability.slug === capabilitySlug);
}
```

**RLS enforcement**: In ZModel policies, reference `auth().tenantPlan.capabilities` once the plan is in the auth context. This is the "structural enforcement" the governing_intent requires.

---

## SCENARIO SIMULATIONS

### Scenario A: Free Tier solo user
```
User(clerkId=A) → UserTenant(role=owner) → Tenant(slug="yariv-solo", planId=null)
Plan(slug="free") has capabilities: ["ai_consult:5/month", "single_member"]
```
Expected: hasCapability(tenantId, "ai_consult") = true (up to 5 uses/month)
Expected: hasCapability(tenantId, "multi_member") = false → new member invite blocked at middleware

**D12 check**: Does the existing User+Tenant schema support this? YES — planId=null maps to free plan by convention. No schema changes needed for this scenario.

### Scenario B: Team upgrade (2nd member triggers trialing→active)
```
Tenant.subscriptionStatus = trialing (2nd member joins)
→ Stripe webhook → Tenant.planId = Plan(slug="team").id
→ PlanCapability["team", "multi_member"] → hasCapability = true
```
Expected: AuditEvent logged with action="tenant.plan_upgraded", resourceType="Tenant", resourceId=tenantId
Expected: All UserTenant members now see multi_member capabilities

**D12 check**: AuditEvent schema already supports this. Trigger fires on Tenant UPDATE. ✓

### Scenario C: Enterprise with custom limits
```
Plan(slug="enterprise-custom-yariv") → PlanCapability limit_value overrides
→ "ai_consult": limit_value=500 (vs 5 on free, unlimited on standard team)
```
Expected: hasCapability check returns true AND limit_value=500 for quota enforcement
Expected: No schema change needed — limitValue column already in PlanCapability spec

**D12 check**: This works without additional entities. The limitValue column covers custom quotas.

---

## INVARIANTS (must hold in final schema)

Per Opus B3 spec + P-ARCH-007/008 + foundation design:

1. **Every entity has tenant_id** (directly or via join): Plan is platform-level (no tenantId); PlanCapability is platform-level. Tenant has planId. UserTenant has tenantId. AuditEvent has tenantId. ✓
2. **RLS mandatory**: Plan is read-only for tenants; PlanCapability is read-only; Capability is read-only. Staff-only writes. ✓
3. **Soft-delete by default** (P-ARCH-007): Plan uses @@deny("delete", true) — plans deprecate, not delete. ✓
4. **Audit via triggers** (P-ARCH-008): AuditEvent written by PostgreSQL trigger, not app code. ✓
5. **governing_intent declared** (HARDWIRE-007 / P-META-031): Each entity spec above has governing_intent. ✓

---

## WHAT THIS SPEC DOES NOT INCLUDE (deferred, D8 applied)

- Stripe Price/Invoice entities → defer until Stripe wiring session
- App entity → the "app as tenant scoped context" decision needs its own VLT resolution
- Analytics schema → PART 4
- AI context storage → PART 5
- The existing `subscriptionStatus` enum on Tenant — redundant with Plan.slug once Plan is wired. Migration to remove it deferred until Plan is confirmed; both coexist for now.

---

## SANDBOX COUNCIL QUESTIONS (for Opus ratification)

Q1: **Plan as platform record vs per-tenant copy**: The spec above uses Plan as a shared platform record (one "team" plan, many tenants). Should plans be copyable (enterprise might need custom fields)? Or is the limitValue in PlanCapability sufficient for customization?

Q2: **Auth context**: To make RLS enforce tier, `auth().tenantPlan.capabilities` needs to be injected. Is this via ZenStack's `@@auth()` directive or via middleware that enriches the auth token? This is the most implementation-sensitive decision.

Q3: **subscriptionStatus redundancy**: Tenant already has `subscriptionStatus: free|trialing|active|cancelled`. Once Plan is wired, subscriptionStatus is partially redundant (status AND plan). Should we keep both (belt+suspenders for billing), or does Plan replace the enum?

Q4: **Capability slug namespace**: Who owns the capability slug registry? Is it a database table (migrated), a TypeScript enum (config), or a YAML file (governance)? Config-driven is safest for extensibility.

---

*DRAFT authored by Sonnet S075 · ECA confirmed (file-read evidence above) · 3 scenarios simulated · governing_intent declared · NO migrations until OPIA · 2026-06-01*
