---
id: csps.libs.policies
name: policies
description: ZModel + ZenStack policy definitions. Hosts base.zmodel (Base mixin per P-ARCH-007 soft-delete), audit-triggers.sql (DDL per ADR-0007), and per-slice .zmodel files. Compiled by ZenStack to Prisma schema + @@allow policies. Schema-per-app boundary enforced per P-ARCH-002.
version: 0.0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:data
  - type:schema
  - audience:developer
  - maturity:draft
links:
  - { rel: parent, href: ../README.md }
  - { rel: foundation-spec, href: ../../docs/plan/pillar-2-data-and-schema/foundation-zmodel.md }
  - { rel: audit-triggers-spec, href: ../../docs/plan/pillar-2-data-and-schema/audit-triggers.md }
  - { rel: schema-per-app, href: ../../docs/plan/pillar-2-data-and-schema/app-schema-contract.md }
created-new-because: |
  Per build-order.md week 1: base ZModel + audit-trigger DDL must commit before any slice
  can scaffold. libs/policies/ is the canonical home for cross-slice schema policy.
---

# @csps/libs/policies

ZModel + ZenStack + audit-trigger SQL. Compiled by ZenStack to Prisma schema with `@@allow` row-level policies.

## Files

| File | Purpose |
|---|---|
| [`base.zmodel`](./base.zmodel) | Base mixin (id/createdAt/updatedAt/deletedAt) + ActorKind enum + LifecycleState enum. Soft-delete by default per P-ARCH-007. |
| [`audit-triggers.sql`](./audit-triggers.sql) | Audit schema + audit.events partitioned table + fn_write_event trigger function + attach_trigger helper. Applied by tools/bootstrap.ps1 step 4. |

## Foundation slices (week-2)

`foundation/User.zmodel` + `foundation/Tenant.zmodel` + `foundation/AuditEvent.zmodel` ship week-2 alongside Stripe + Clerk wiring per build-order.md.

## App slices (week-3+)

Per app: `apps/<slug>/slices/<name>.zmodel` declares `@@schema("app_<slug>")` per P-ARCH-002 schema-per-app. Generator `nx g platform:slice` scaffolds.
