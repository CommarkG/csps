---
id: csps.libs.policies.slices.public.foundation-design
name: foundation-design
description: The CSPS foundation slice design decisions — committed reference for S012 ZModel authoring. Contains the resolved User/Tenant/UserTenant/AuditEvent schema design with rationale. Authoritative for all S012 foundation slices work. VLT-S011-003 and VLT-S011-004 resolutions committed here.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: ARCH
core_spines: [ARCH, GVRN, VALD]
schema_anchor: foundation_design_decisions
tags:
  - domain:architecture
  - domain:data
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S011
links:
  - { rel: topic-plan, href: ../../../docs/plan/_handoff/VAULT/topic-plans/foundation-slices.md }
  - { rel: base-zmodel, href: ../base.zmodel }
  - { rel: schema-expert-skill, href: ../../../../.claude/skills/schema-expert/SKILL.md }
consolidation_cross_refs:
  - tools/session-state.json    # VLT-S011-003/004 resolution tracking
domain_path: platform
---

# Foundation Design Decisions — CSPS

> **This document IS the committed design.** S012 authors ZModel from here. Do not re-derive these decisions — they are ratified.

## VLT-S011-003 — RESOLVED (2026-05-06)

**Decision: 1:N via UserTenant join table.**

```
User (1) ←——→ (N) UserTenant (N) ←——→ (1) Tenant
```

**Rationale:**
- A developer building 3 CSPS apps → 1 User, 3 UserTenant records
- Post-graduation: app takes its UserTenant slice with it → independence preserved
- Standard SaaS pattern (Notion workspaces, Slack teams, Linear teams)

## VLT-S011-004 — RESOLVED (2026-05-06)

**Decision: Clerk org → Tenant = direct 1:1 initially. `Tenant.clerkOrgId = Clerk org ID`.**

**Rationale:**
- Simplest thing that works
- Each Clerk organization maps to exactly one CSPS Tenant
- If flexibility needed later → add ClerkTenantMapping join table at that point
- P-OP-003 PCR: SIMPLE wins over FLEXIBLE until flexibility is proven necessary

## The ZModel (S012 authoritative design)

```prisma
// libs/policies/slices/public/user.zmodel
// Extends base.zmodel (id + createdAt + updatedAt + deletedAt)

model User {
  ...Base
  clerkId      String        @unique                  // Clerk user ID
  email        String        @unique
  displayName  String?
  memberships  UserTenant[]
  
  @@schema("public")
  @@allow("read", auth().id == id || auth().staffRole != null)
  @@deny("delete", true)   // soft-delete only per P-ARCH-007
}

model Tenant {
  ...Base
  slug         String        @unique                  // URL-safe identifier
  name         String
  clerkOrgId   String?       @unique                  // VLT-S011-004: direct Clerk org mapping
  stripeCustomerId String?                            // Stripe integration (S013)
  members      UserTenant[]
  
  @@schema("public")
  @@allow("read", auth().tenantId == id)
  @@deny("delete", true)
}

model UserTenant {
  ...Base
  userId       String
  tenantId     String
  role         String    // 'owner' | 'admin' | 'member' — use glossary term
  user         User      @relation(fields: [userId], references: [id])
  tenant       Tenant    @relation(fields: [tenantId], references: [id])
  
  @@unique([userId, tenantId])           // one membership per user per tenant
  @@schema("public")
  @@allow("read", auth().id == userId || auth().tenantId == tenantId)
  @@deny("delete", true)
}

model AuditEvent {
  ...Base
  tenantId     String
  actorId      String?                               // null = system action
  action       String                                // e.g. "user.created", "invoice.paid"
  resourceType String                                // e.g. "User", "Invoice"
  resourceId   String
  data         Json?                                 // snapshot of changed fields
  
  @@schema("public")
  @@allow("read", auth().tenantId == tenantId)
  @@deny("create,update,delete", true)              // append-only per P-ARCH-008
}
```

## L1 Exit Criteria (from foundation-slices.md)

S012 achieves L1 exit when ALL are true:
- [ ] `libs/policies/slices/public/user.zmodel` authored + TypeScript compiles
- [ ] `libs/policies/slices/public/tenant.zmodel` authored + TypeScript compiles
- [ ] `libs/policies/slices/public/user-tenant.zmodel` authored + TypeScript compiles
- [ ] `libs/policies/slices/public/audit-event.zmodel` authored + TypeScript compiles
- [ ] `pnpm verify --skip-install` exit_code 0
- [ ] `validate-no-implementation-without-plan.mjs` → `unplanned=0` (libs/policies/ covered)
- [ ] `validate-universal-alignment.mjs --scan-new` → 0 alignment gaps

## The App Factory Context (for S012+)

When S012 builds foundation slices, it is simultaneously:
1. **Building the product** (actual ZModel for real apps)
2. **Sealing the template** (foundation-slices become the COPY target for all future apps)
3. **Validating the schema-driven approach** (the platform using itself to govern itself)

After S012, every new SaaS app does:
```
App creation prompt → The Threshold Gate → consolidation-expert scan
  → "User/Tenant/UserTenant/AuditEvent exist in libs/policies/slices/public/"
  → COPY foundation slices, don't rebuild
  → extend with domain-specific entities (Invoice, Ledger, etc.)
  → add domain vocabulary to glossary.yaml
  → build domain-specific ZModel slices
  → pnpm verify validates alignment
```

The foundation IS the template. Building it once means 30 apps inherit it.
