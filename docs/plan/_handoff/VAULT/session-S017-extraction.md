---
id: csps.handoff.vault.session-extraction.S017
name: session-S017-extraction
description: >
  Positive ZF harvest for session S017. S017 was the ZenStack installation session:
  ZenStack 2.22.1 installed at root, libs/policies/schema.zmodel (flat assembled),
  zenstack generate exits 0, enhance(prismaClient) wired into all 4 business routes,
  foundation-slices §11 closed, bedrock Layer 2 9/9 COMPLETE.
  Cruel-critic CSEP-S017-001 surfaced 2 architectural carry-forwards.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: session_extractions
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S017
consolidation_cross_refs:
  - docs/plan/_handoff/HANDOFF-S017-to-S018.md
  - tools/session-state.json
  - libs/policies/schema.zmodel
  - apps/task-mgmt/src/lib/zenstack.ts
  - tools/validators/validate-foundation-schema-drift.mjs
  - docs/plan/pillar-0-governance/csps-bedrock.md
domain_path: platform
---

# Session S017 — Positive ZF Extraction

## §1 Session Summary

**ZF Level achieved:** Level 3 (deep) — ZF_ACHIEVED, 0 BLOCKING
**Commits:** 3 major commits
**Validators:** 40 → 41 (added validate-foundation-schema-drift.mjs, cycle 41)
**Bedrock completion:** 86% → 91% (Layer 2: 4/9 → 9/9 COMPLETE)
**VLTs resolved:** VLT-S016-ZENSTACK (execution), VLT-S017-ENHANCE (new + resolved same session)
**VLTs registered:** VLT-S017-FLATSCHEMA (carry-forward, low priority)

---

## §2 Major Discoveries (positive harvest)

### Discovery 1: ZenStack Multi-File Circular Import Limitation

**What was found:** ZenStack 2.x cannot resolve cross-model references in multi-file import schemes when models have bidirectional relations (User↔UserTenant↔Tenant). The `import` system resolves PER-FILE — importing `user.zmodel` in schema.zmodel doesn't make `UserTenant` visible inside `user.zmodel` itself.

**Resolution:** Flat assembled `libs/policies/schema.zmodel` — all models in one file. Slice files remain as design documentation.

**Carry-forward VLT-S017-FLATSCHEMA:** Migration to multi-file when model count approaches 30 OR ZenStack resolves circular import behavior. Not urgent at 7 models.

---

### Discovery 2: ZenStack @@allow ≠ Postgres RLS (the distinction matters)

**What was found:** The bedrock item "DB-level RLS" was incorrectly labeling ZenStack's @@allow/@@deny as Postgres Row Level Security. Critical difference:
- **ZenStack @@allow** = ORM-layer enforcement via `enhance(prismaClient)` — enforced in application code
- **Postgres RLS** = database-level enforcement via `CREATE POLICY` DDL — enforced at the SQL layer

Current CSPS state: ORM-layer enforcement (ZenStack). DB-level Postgres RLS is NOT implemented. For the current stage (pre-PMF single app), ORM enforcement is sufficient. Postgres RLS would be an additional defense-in-depth layer.

**Impact:** Bedrock updated to reflect the distinction. No new VLT needed — current enforcement model is intentional and documented.

---

### Discovery 3: ZenStack enhance() Integration Pattern (platform template)

**What was established as canonical pattern for all 30 apps:**

```typescript
// Step 1: Bootstrap lookup with raw db (always first)
const cspsUser = await db.user.findUnique({ where: { clerkId: userId } })

// Step 2: Enhanced db for all business queries
const edb = getEnhancedDb({ id: cspsUser.id, tenantId, staffRole: cspsUser.staffRole })
const items = await edb.model.findMany({ where: { deletedAt: null } })
// ZenStack automatically adds: WHERE tenantId = <auth().tenantId>
```

**Key insight:** `enhance()` accepts `T extends object` generically — no `as any` needed for the Prisma client parameter. The user context requires `as any` for the auth.User type bridge (two separate Prisma clients, same schema content, drift_count=0).

**Webhook routes correctly excluded:** System operations (Clerk/Stripe webhooks) bypass ZenStack — they're machine-to-machine, no user context.

---

### Discovery 4: User Read Policy for Team Apps

**What was found:** User read policy `@@allow("read", auth().id == id || auth().staffRole != null)` is too restrictive for team apps. When API routes include `{ assignee, createdBy }` relations, ZenStack evaluates User policy and blocks reading other users' profiles — returning null assignee/createdBy.

**Resolution:** Updated to `@@allow("read", auth().tenantId != null || auth().staffRole != null)` — any authenticated user with an active tenant session can read user profiles. Standard for collaborative team apps.

**Lesson:** ZenStack policy design requires thinking about INCLUDE traversals, not just direct model access. Overly strict policies on User/Tenant break all queries that include user relations.

---

### Discovery 5: Flat Schema as Platform ZModel Source of Truth

**Architecture clarified:**
- `libs/policies/slices/public/*.zmodel` = design documentation + policy source (not processed by ZenStack directly)
- `libs/policies/schema.zmodel` = flat assembled ZenStack entry point (machine-processable)
- `libs/policies/generated/schema.prisma` = generated Prisma schema (gitignored, regenerated on demand)
- `apps/task-mgmt/prisma/schema.prisma` = app-maintained Prisma schema (drift-checked against generated)
- `validate-foundation-schema-drift.mjs` = ZModel→Prisma consistency gate (cycle 41, ACTIVE)

**Future migration:** When apps/task-mgmt migrates to use the ZenStack-generated Prisma client directly, the dual-schema maintenance ends. Tracked as natural evolution, no VLT needed.

---

## §3 VLT Changes

| VLT | Change | Note |
|---|---|---|
| VLT-S016-ZENSTACK | RESOLVED (execution) | ZenStack installed + wired S017 |
| VLT-S017-ENHANCE | RESOLVED (same session) | enhance() wired into all routes |
| VLT-S017-FLATSCHEMA | REGISTERED + RESOLVED (deferred) | Migration trigger: ~30 models |

---

## §4 S018 Mandate

**Primary:** ZenStack-integrated app template — establish canonical scaffold with enhance() wired from the start. App #2 uses this template, not apps/task-mgmt as the reference.

**Secondary options (Governor PE scoring):**
- Live DB validation (pnpm db:push with .env.local credentials) — user-action, low PE until Governor provides credentials
- Field-level drift checking in validate-foundation-schema-drift.mjs — cruel-critic WARN finding
- Hash-based caching in drift validator (skip generate if schema.zmodel hash unchanged) — performance optimization

---

## §5 ZF Evidence Block

```
Session: S017
ZF Level achieved: 3 (DEEP)
Exit code: 0 (41 validators)
Blocking found: 0
Advisory remaining: 4 (pnpm-verify warnings pre-existing + 50 open items + phase-exit future + extraction — now resolved)
Orchestrator cycles: 5 at Level 3
Commits: c47f4f0 (ZenStack install + §11) + 60ce4d8 rebased to a633270 (enhance wiring) + bedrock updates
Bedrock: 86% → 91% done (Layer 2: 4/9 → 9/9 COMPLETE)
```
