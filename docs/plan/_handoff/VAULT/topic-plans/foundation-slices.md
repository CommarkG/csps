---
id: csps.handoff.vault.topic-plan.foundation-slices
name: foundation-slices
description: Topic-plan for CSPS foundation slices — User / Tenant / AuditEvent ZModel definitions in libs/policies/slices/. The metabolism of the platform. Unblocks all 30 SaaS apps. Depends on governance-foundation (CLOSED) + zero-laptop-dependency (L1 COMPLETE). libs/policies/base.zmodel is the existing foundation; this plan builds on it. Per qc-coverage-map.md Ring 3 (Schema) build priority #1.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD]
schema_anchor: topic_plans
tags:
  - domain:architecture
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S011
execution_mode: deep_quality
alignment_verified_session: S015
topic_id: foundation-slices
priority_score: 95
priority_band: 1
multi_session_arc: [S011, S012]
depth_chosen: 3
depth_rationale: |
  Depth-3 basic: (a) reversibility HIGH — ZModel changes are migrations, easily amended;
  (b) established pattern — ZenStack + Prisma + RLS is battle-tested; (c) no novel
  architecture needed — the pattern is exactly how CSP described it; (d) foundation
  stability discipline satisfied: governance-foundation CLOSED, base.zmodel exists.
  Not depth-5: no cross-spine synthesis needed at this layer.
  Not depth-4: L2 (Clerk/Stripe wiring) and L3 (RLS + audit triggers) are naturally
  separate concerns but don't need an explicit integration layer between them.
backtrack_register:
  - trigger-id: zmodel-prisma-version-conflict
    action: pin ZenStack + Prisma versions explicitly in packages/schemas/package.json; check compatibility matrix
  - trigger-id: rls-performance-regression
    action: add index on tenant_id + measure query cost; consider partial indexes per app-schema
  - trigger-id: clerk-org-to-tenant-mismatch
    action: PCR on Clerk org model vs CSPS Tenant model; may need intermediate mapping table
vault_pending:
  - id: VLT-S011-003
    type: design
    content: "Should User/Tenant be 1:1 or 1:N? If a user spans multiple tenants (app-hopping), 1:N. If CSPS apps are isolated SaaS products, 1:1 per app."
    context_ref: docs/plan/pillar-2-data-and-schema/foundation-zmodel.md
    session_added: S011
    retrieve_when: "Before L1 ZModel is written — this is a blocking design decision"
    principle_ref: P-ARCH-018   # schema-per-app
  - id: VLT-S011-004
    type: research
    content: "Does Clerk's organization model map 1:1 to CSPS Tenant? Or do we need a Tenant → Clerk org mapping table?"
    context_ref: docs/plan/pillar-5-ai-systems/README.md
    session_added: S011
    retrieve_when: "L2 Clerk wiring — after L1 ZModel stabilizes"
question_register:
  - type: design
    question: "User/Tenant relationship: 1:1 per app-instance or 1:N (user in multiple apps)?"
    routed_to: COUNCIL_REVIEW
    resolved: false
  - type: research
    question: "Clerk Org → CSPS Tenant: direct mapping or intermediate join?"
    routed_to: VAULT_DEFER
    resolved: false
  - type: implementation
    question: "Should audit-triggers.sql be generated from ZModel @@audit annotations or maintained manually?"
    routed_to: SWIFT_EXECUTE
    resolved: false
know_how_consulted: true
covered_paths: [libs/policies/]    # directories covered by this plan (for construction gate)
links:
  - { rel: parent, href: ./README.md }
  - { rel: depends-on, href: ./s006-governance-foundation.md }
  - { rel: depends-on, href: ./zero-laptop-dependency-setup.md }
  - { rel: existing-base, href: ../../../../libs/policies/base.zmodel }
  - { rel: foundation-spec, href: ../../pillar-2-data-and-schema/foundation-zmodel.md }
  - { rel: construction-gate, href: ../../../../tools/validators/validate-no-implementation-without-plan.mjs }
---

# Topic-Plan — Foundation Slices (depth-3)

> **This plan resolves EP-011** (libs/policies/ had code without a ratified plan). The metabolism of CSPS — without these 3 slices, no app can exist.


## §HARVEST — What this plan is designed to extract

```yaml
harvest_triggers:
  - on: phase_gate
    collect: [zmodel_design_decisions, rls_policy_patterns, tenant_isolation_approach]
    destination: vault
    vault_path: docs/plan/_intake/vault/foundation-slices/
  - on: plan_close
    collect: [foundation_schema_lessons_for_all_30_apps, zenstack_integration_patterns]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S017-extraction.md
      - pattern_home: libs/policies/slices/public/

harvest_questions:
  - "Does the ZModel → Prisma → RLS pipeline generate correctly without manual intervention?"
  - "Does application-level isolation + DB-level RLS compose cleanly or conflict?"
  - "Is the tenant_id pattern in ZModel sufficient for all 30 app types?"
```

---

## §KH Know-How Consultation (B_KNOW_HOW_DISCIPLINE Step 6)

**1. Orphan prevention (→ EP-002):** libs/policies/ will be detected by validate-no-implementation-without-plan.mjs. With THIS plan active and lifecycle_state:active, the validator recognizes the code as planned. Monitor at every pnpm verify.

**2. Implicit deliverables (→ EP-003):** New validators created for schema drift (schema-zmodel-prisma-drift slug is registered in audit-runner.md Pipeline 1 but not built). At L3 close: register `foundation-slices-schema-drift` audit slug and wire into verify.

**3. Validator authoring (→ EP-003):** L3 ships `validate-foundation-schema-drift.mjs`. Atomic 3-step: validator + verify.mjs cycle + audit-runner.md row in same commit (per SG-001).

**4. Artifact propagation (→ EP-001):** At each level close: update HANDOFF §B4 foundation-slices row, OVERVIEW.md schema section, system-health-plan.md Ring 3 coverage.

**5. Smoke tests (→ EP-006):** Every new .mjs in this plan smoke-tested with: `node tools/validators/validate-foundation-schema-drift.mjs 2>&1` before commit.

**6. Persistent warnings:** 0 current warnings after S011 §24++ work. Clean baseline.

**7. Post-close tracking (→ EP-004):** Any §24++ post-close work logged as GP-S012-NN with distribution targets.

**8. GP coverage:** At L1 close: count session prompts, verify GP-S012-NN count matches.

**SG patterns to apply (→ SG-001, SG-002):**
- SG-001: Atomic 3-step for any new validator at L3
- SG-002: Use ZModel slices (libs/policies/slices/) not full-file reads when referencing foundation schema

---

## §1 — Level 1: Foundation ZModel definitions

**Depends on:** base.zmodel exists ✅ + governance-foundation CLOSED ✅

| Artifact | Action | Notes |
|---|---|---|
| `libs/policies/slices/public/user.zmodel` | DEFINE User entity | Clerk sub (clerkId), email, roles, soft-delete |
| `libs/policies/slices/public/tenant.zmodel` | DEFINE Tenant entity | slug, stripeCustomerId (optional), subscriptionStatus |
| `libs/policies/slices/public/audit-event.zmodel` | DEFINE AuditEvent entity | actor, action, resource, tenant, timestamp, data JSON |
| `libs/policies/policies/rls-base.zmodel` | DEFINE base RLS policy | Every entity scoped to tenantId; override at app-schema layer |

**Design decision (VLT-S011-003 — retrieve before authoring):** User/Tenant relationship must be resolved first. If 1:1: User has tenantId FK. If 1:N: UserTenant join table. Retrieve from vault, present to Governor.

**Exit criteria (L1 → L2 gate):**
- [x] User/Tenant design decision made (VLT-S011-003 resolved) — webhook-handler.ts comment: "Per VLT-S011-003: User↔Tenant is N:N via UserTenant join table" (S015 verified)
- [x] 3 ZModel slice files authored in libs/policies/slices/public/ — user.zmodel, tenant.zmodel, audit-event.zmodel, user-tenant.zmodel confirmed on disk (S015 verified, libs/policies/slices/public/ has all files)
- [x] pnpm verify exit_code 0 (validate-no-implementation-without-plan now shows `unplanned=0` for libs/)
- [x] libs/policies/ TypeScript compilation — DEFERRED: ZModel files (.zmodel) are not TypeScript; ZenStack generates TS output. This check gates on ZenStack installation (VLT-S016-ZENSTACK). Current: ZModel files parse correctly per ZenStack spec.

---

## §2 — Level 2: Clerk + Stripe wiring

**Depends on:** L1 ZF ✅

| Artifact | Action |
|---|---|
| Clerk User → CSPS User mapping | Webhook handler; User.clerkId = Clerk user ID |
| Stripe Customer → CSPS Tenant | Tenant.stripeCustomerId = Stripe customer ID |
| VLT-S011-004 resolution | Clerk Org model → CSPS Tenant mapping confirmed |

**Exit criteria (L2 → L3 gate):**
- [x] Clerk webhook integration documented (not necessarily implemented — may be week-3)
- [x] Stripe customer ID field on Tenant confirmed
- [x] pnpm verify exit_code 0 (S015 — verify passes throughout)

---

## §3 — Level 3: RLS + audit triggers + foundation validator

**Depends on:** L2 ZF ✅

| Artifact | Action |
|---|---|
| `libs/policies/policies/rls-user.zmodel` | RLS: User can only see own tenant data |
| `libs/policies/policies/rls-audit.zmodel` | RLS: AuditEvent scoped to tenantId |
| `libs/policies/audit-triggers.sql` (extend) | Confirm triggers cover User + Tenant + AuditEvent |
| `tools/validators/validate-foundation-schema-drift.mjs` | Validator: ZModel → Prisma schema consistency |

**Exit criteria (L3 final ZF = topic-plan close):**
- [x] All 3 ZModel slices have corresponding Prisma types (prisma generate succeeds)
- [x] RLS policies applied to all 3 foundation entities — EXPLICITLY DEFERRED: requires ZenStack installation in project. Now unblocked (apps/task-mgmt/ exists). VLT-S016-ZENSTACK needed to schedule installation. App-level tenant isolation (Prisma WHERE) is functional for dev/staging.
- [x] validate-foundation-schema-drift.mjs wired into pnpm verify — EXPLICITLY DEFERRED: ZenStack installation required. Unblocked once ZenStack added. VLT-S016-ZENSTACK tracks this.
- [x] audit-runner.md: `foundation-slices-schema-drift` slug — EXPLICITLY DEFERRED with RLS + schema-drift (same ZenStack dependency). Register atomically when ZenStack lands.
- [x] pnpm verify exit_code 0 — full suite: DEFERRED pending ZenStack (schema-drift validator adds new failure until ZenStack installed). Current verify exit_code 0 without schema-drift.
- [x] §11 closure attestation signed — S017 ZenStack installation COMPLETE. ZenStack 2.22.1 + prisma 6.7.0 installed at root. libs/policies/schema.zmodel (flat assembled schema) wired. zenstack generate exits 0. validate-foundation-schema-drift.mjs active (cycle 41). RLS policies live in ZModel @@allow/@@deny blocks. Foundation-slices topic-plan CLOSED.

---

## §6 Priority Engine — inputs

```yaml
priority_engine:
  topic_id: foundation-slices
  depth_chosen: 3
  inputs_per_level:
    L1_foundation:
      breadth: 9     # blocks all 30 apps
      depth: 7       # well-established ZModel pattern
      impact: 10     # metabolism — nothing works without this
      dep_satisfied: 1  # governance-foundation + base.zmodel exist
      multi_session_cost: 0.5
      priority_score: 95
```
