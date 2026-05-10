---
id: csps.product.reference.graduation-path
name: graduation-path
description: Canonical graduation design for CSPS apps — which schema slices stay shared, which extract with the app at the $1K MRR trigger.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: graduation-design
tags:
  - domain:planning
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S015
file_depth_markers:
  l1_lines: "1-50"
  l2_lines: "51-end"
  read_protocol: "L1 = graduation boundary (always read). L2 = process detail."
consolidation_cross_refs:
  - apps/sandbox/prisma/schema.prisma
  - tools/session-state.json
domain_path: platform
---

# Graduation Path — CSPS App Extraction Design

## §1 Graduation Trigger (ratified VLT-S014-004)

**Trigger:** $1K MRR sustained for 30 days.
**Action:** App graduates from CSPS platform to its own standalone repository.

## §2 Graduation Boundary (the extraction line)

From `apps/sandbox/prisma/schema.prisma` — the boundary is explicitly commented:

```
// ─── Foundation slices (STAYS SHARED at graduation) ──────────────────────────
// User, Tenant, UserTenant, AuditEvent

// ─── Task management slices (EXTRACTS WITH APP at graduation) ────────────────
// Project, Task, TaskComment
```

### What STAYS in CSPS (shared platform)

| Model | Why it stays |
|---|---|
| `User` | Identity is platform-wide; all 30 apps share it |
| `Tenant` | Multi-tenancy is platform infrastructure |
| `UserTenant` | Membership is platform infrastructure |
| `AuditEvent` | Compliance/audit is platform-wide concern |

### What EXTRACTS WITH THE APP

| Model | Why it extracts |
|---|---|
| `Project` | App-specific entity |
| `Task` | App-specific entity |
| `TaskComment` | App-specific entity |
| `TaskStatus`, `TaskPriority`, `ProjectStatus` enums | App-specific |

### What EXTRACTS WITH THE APP (integrations)

| Package | Why it extracts |
|---|---|
| `libs/integrations/clerk/` | App still needs Clerk auth; extracted copy |
| `libs/integrations/stripe/` | App still needs billing; extracted copy |

## §3 Post-Graduation Architecture

After graduation, the extracted app:
- Has its own `schema.prisma` with only Project/Task/TaskComment + User/Tenant references
- Imports User/Tenant/UserTenant/AuditEvent from the CSPS platform package (until fully standalone)
- Maintains its own Stripe subscription (no longer governed by CSPS billing)
- Retains Clerk org → Tenant mapping (1:1 via clerkOrgId stays in place)

## §4 Graduation Process (high level)

1. $1K MRR trigger confirmed → Governor decides to graduate
2. `apps/task-mgmt/` extracted to new GitHub repo
3. `prisma/schema.prisma` in new repo: keeps Project/Task/TaskComment, references shared foundation
4. CSPS platform provides `@csps/foundation` npm package (User/Tenant/UserTenant/AuditEvent)
5. New repo updates DATABASE_URL + CLERK + STRIPE to production values
6. CSPS removes app-specific routes; foundation package version-locked

## §5 Schema Drift Risk at Graduation

**Risk:** CSPS foundation schema evolves (e.g., `User.staffRole` changes) after graduation → breaking the app.
**Mitigation:** `@csps/foundation` package uses semver. Breaking changes increment major version. Graduated apps pin their major version.

**This is why `validate-foundation-schema-drift.mjs` is deferred** — it's a Phase 5+ concern.
The validator needs ZenStack to track schema drift across the foundation/app boundary.
Without ZenStack, schema drift is caught at `prisma generate` time (sufficient for Phase 5 MVP).
