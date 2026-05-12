---
name: schema-expert
description: When designing ZModel schemas OR reviewing Prisma migrations OR defining RLS policies OR working on tenant isolation OR architecting foundation slices (User/Tenant/AuditEvent) OR choosing between schema patterns — apply expert schema design for multi-tenant SaaS. Triggers on "ZModel", "schema", "Prisma", "RLS", "tenant isolation", "foundation slices", "User model", "Tenant model", "AuditEvent", "database schema", "row-level security", "tenant_id", "@@schema". The schema spine: every entity has tenant_id; RLS is mandatory; soft-delete by default (P-ARCH-007); audit via triggers not app code (P-ARCH-008).
allowed_tools: [Read, Write, Edit, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: [read, write]
sensitive_data_access: false
backed_by_principle: P-ARCH-003
backed_by_contract: B_CORE_SPINE_DISCIPLINE
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_CORE_SPINE_DISCIPLINE
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: schema-design-with-rls-tenant-isolation-and-audit
  max_tokens: 3000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010
  - P-META-002
  - P-ARCH-003    # files-are-truth-db-is-index
  - P-ARCH-006    # slice-contract-90-percent-to-merge
  - P-ARCH-007    # soft-delete-by-default
  - P-ARCH-008    # audit-by-trigger-not-app-code
  - P-ARCH-018    # schema-per-app
consolidation_cross_refs:
  - libs/policies/base.zmodel          # foundation base mixin
  - docs/plan/pillar-2-data-and-schema/foundation-zmodel.md
  - docs/plan/_handoff/VAULT/topic-plans/foundation-slices.md
template_grade: B
links:
  - { rel: p-meta-022, href: ../../../../docs/plan/pillar-0-governance/human-intent-crystallization.md }
---

# /schema-expert — ZModel + RLS + multi-tenant schema design

## CSPS schema invariants (load BEFORE designing any schema)

| Invariant | Principle | Enforcement |
|---|---|---|
| Every entity extends Base | P-ARCH-003 | base.zmodel mixin |
| Every entity has tenant_id | P-ARCH-018 | RLS policy requirement |
| Soft-delete only (deletedAt) | P-ARCH-007 | @@deny delete in ZModel |
| Audit via triggers | P-ARCH-008 | audit-triggers.sql |
| @@schema("app_<slug>") per app | P-ARCH-002 | ZenStack config |
| Foundation slices = public schema | P-ARCH-001 | @@schema("public") |

## Foundation slice pattern

```typescript
// Every foundation entity follows:
model User {
  ...Base
  clerkId      String    @unique
  email        String    @unique
  tenants      UserTenant[]
  @@schema("public")
  @@allow("read", auth().id == id || auth().staffRole != null)
}

model Tenant {
  ...Base  
  slug         String    @unique
  users        UserTenant[]
  @@schema("public")
}

model UserTenant {  // 1:N bridge (user can be in multiple tenants)
  userId     String
  tenantId   String
  role       String   // 'owner' | 'admin' | 'member'
  user       User     @relation(...)
  tenant     Tenant   @relation(...)
  @@unique([userId, tenantId])
  @@schema("public")
}
```

## RLS base policy pattern

```typescript
// In every app entity:
@@allow("all", auth().tenantId == tenantId)
@@deny("delete", true)  // soft-delete only
```

## When to ask the Governor (design questions to vault)
- User/Tenant relationship: 1:1 per app-instance OR 1:N spanning multiple apps?
- Clerk org → CSPS Tenant: direct mapping or join table?
- AuditEvent: tenant-scoped or global? (architectural choice)
