---
id: csps.handoff.vault.session-extraction.S022
name: session-S022-extraction
description: >
  CEC harvest for S022 — the most substantive session in CSPS history: 6 implementation
  sessions, bedrock 22/22 closed, enterprise core complete, ZenStack + RLS active.
  Extracts insights that enhance other platform elements. CEC terminated at 0 new opportunities.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: validated
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD, AI]
schema_anchor: vault_artifacts
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S022
evidence_block_ref: "ZF Level 3: ACHIEVED 0 blocking, 4 advisory — 2026-05-11"
cec_walk_trail_ref: "session-S022-extraction.md §2 CEC walk — 8 cycles to zero"
links:
  - { rel: parent, href: ./README.md }
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
---

# Session S022 Extraction

> **S022 was the STRATEGIC_COMPLETION session arc** — 6 implementation sub-sessions closing all enterprise
> core gaps. 20 decisions ratified. Bedrock went from 21/22 to 22/22. ZenStack enforce restored after
> Prisma version alignment. Postgres RLS deployed on 7 tables. Platform audit found 12 flow gaps with solutions.

---

## §1 — MAJOR INSIGHTS (what this session proved or discovered)

### INS-S022-001: Prisma version pinning is a fundamental monorepo discipline
**What happened:** Root `package.json` pinned `prisma@6.7.0` (exact) but `apps/task-mgmt` used `^6.7.0` (caret). pnpm resolved both to different versions → two peer-dep hashes in store → ZenStack runtime copied to wrong hash → `enhance()` threw "not found" for 3 sessions.

**The rule:** In a pnpm monorepo with shared infrastructure, ALL packages that share a common dependency (Prisma, ZenStack) MUST use the same exact version across root and all app packages. Use exact pins at root; apps can use caret but must be verified to resolve to same version.

**CEC target:** app template scaffold, bedrock checklist, `validate-prisma-version-alignment.mjs` (new)

---

### INS-S022-002: Supabase pooler requires pgbouncer=true (every URL, every file)
**What happened:** DATABASE_URL had the pgbouncer flag in `.env.local` but NOT in `.env` (auto-loaded by Prisma). Prisma's `new PrismaClient()` reads `.env` not `.env.local`. Result: prepared statement "s0" already exists error on every second DB query.

**The rule:** Both `.env` and `.env.local` must have `?pgbouncer=true&connection_limit=1` on the port-6543 Supabase URL. Prisma CLI reads `.env`; Next.js reads `.env.local`. They are not the same file.

**CEC target:** `.env.example` template, app-build-guide, `validate-db-url-pgbouncer.mjs` (new)

---

### INS-S022-003: ZF and harvesting are process steps, not checklist items
**What happened:** S022 Sessions 3-6 were executed code-first. `pnpm verify` (exit_code=0) was run at close. But `pnpm zf:deep` was NOT run. `session-S022-extraction.md` was not created. `§KH` was not written for any session. These were treated as "done if time permits" rather than "required to declare done."

**The rule:** ZF deep cycle + extraction note are mandatory gate items. A session is NOT DONE until: (a) `node tools/zf-orchestrator.mjs --level 3` exits with "ZF ACHIEVED — 0 blocking", (b) session-S{NNN}-extraction.md exists. These must be enforced by the closing-summary template — not trusted to AI memory.

**CEC target:** closing-summary template, session-open protocol, `validate-session-harvest-readiness.mjs` (already active, needs to BLOCK not just advise), new hook: `pre-stop-zf-deep-gate.sh`

---

### INS-S022-004: Defense-in-depth = ZenStack ORM + Postgres RLS
**What happened:** ZenStack bypassed (S3-E1 FAIL initially) → RLS added as compensating control → Prisma version aligned → ZenStack restored → platform now has BOTH layers.

**The rule:** Enterprise multi-tenant isolation requires two independent layers:
- Layer 1: ORM (ZenStack) — catches buggy app code writing wrong tenantId
- Layer 2: DB (RLS) — catches ORM bugs, direct DB access, future services
Both must be active. One-or-the-other is "partially secure."

**CEC target:** Bedrock checklist (`both_isolation_layers_active` field), app-build-guide, `validate-isolation-layers.mjs` (new)

---

### INS-S022-005: AI-defaults declaration is a governance quality gate
**What happened:** Enterprise plan was written with AI-invented values (trial duration, seat limits, feature gating) without flagging them as proposals. Governor had to explicitly correct this. Created `validate-plan-ai-defaults.mjs` retroactively.

**The rule:** Any plan section derived from AI training knowledge (industry conventions, "standard" values, "best practice" patterns) MUST be declared `ai_defaults_influence: partial|dominant` in frontmatter AND labeled `[AI-DEFAULT]` inline. This is a PRE-WRITE discipline, not post-write correction.

**CEC target:** Plan creation protocol (Step 0.5: declare influence source), gradual-build-plan template (frontmatter field), closing-summary template

---

### INS-S022-006: Solo user flow is the #1 signup conversion gap
**What happened:** Architecture (VLT-S014-003: Workspace = Clerk Org) creates a dead-end for solo users: no org → no tenantId → "No organization yet" screen → 0% conversion.

**The rule:** Every app built on CSPS must declare its `solo_user_flow` in its app manifest:
- `auto_org`: platform auto-creates personal org on user.created
- `manual`: user creates org (acceptable for team-only apps)
- `not_applicable`: app doesn't use the tenant model

**CEC target:** App template frontmatter field, `validate-solo-user-flow.mjs` (new), bedrock checklist

---

### INS-S022-007: Webhook handlers must be idempotent by design
**What happened:** All 7 webhook cases (user.created, org.created, etc.) create DB rows without checking if they already exist. A Clerk webhook retry (common after timeout) would attempt to create duplicate rows → DB error → unhappy user during onboarding.

**The rule:** Every webhook handler case MUST begin with an existence check. This is a platform-level structural requirement, not an app-level choice.

**CEC target:** `libs/integrations/clerk/webhook-handler.ts` (fix), `validate-webhook-idempotency.mjs` (new), app template's webhook route

---

### INS-S022-008: PE Situation Registry makes platform meta-state explicit
**What happened:** Created `pe-situation-registry.md` with 4 situations. STRATEGIC_COMPLETION was declared, tracked, and exited formally. This gave the Governor a clear view of "what is the platform doing overall" separate from "what is next."

**The rule:** When the platform is in a named meta-state (completion mode, Opus review, app build mode), that state should be declared in the registry — not inferred from session-state or topic-plans. Other AIs reading session state need a single source for "what mode are we in."

**CEC target:** Session-open protocol (load situation registry at session open), session-state.json (add `active_situation` field), `validate-pe-situation-declared.mjs` (new)

---

## §2 — CEC WALK (cycles to zero)

**Cycle 1:** 8 insights extracted. Identified 12 CEC enhancement targets across:
- 5 new validators
- 3 template updates
- 2 bedrock checklist items
- 1 new process step (solo_user_flow declaration)
- 1 session-open protocol update

**Cycle 2:** Walking each target:
- `validate-prisma-version-alignment.mjs` → enhances: every future pnpm install catches drift
- `validate-db-url-pgbouncer.mjs` → enhances: every app's .env.example validation
- `validate-isolation-layers.mjs` → enhances: bedrock validator's coverage
- `validate-webhook-idempotency.mjs` → enhances: every webhook handler's correctness
- `validate-solo-user-flow.mjs` → enhances: App #2+ sign-up conversion
- `validate-pe-situation-declared.mjs` → enhances: session context loading at every session open
- Closing-summary template: add mandatory ZF deep + extraction section
- Plan creation protocol: add INS-S022-005 (AI-defaults) as Step 0.5

**Cycle 3:** Each of the above has downstream impacts:
- Closing-summary template update → all 22+ future session closes inherit the gate
- Bedrock checklist expansion → `validate-bedrock.mjs` must check new items
- Session-state.json `active_situation` field → session-open.sh reads it

**Cycle 4:** One new opportunity: the `validate-rzf-evidence.mjs` currently gives advisory when ZF evidence is missing. It should BLOCK after the first session that declares it done. This is a mechanical gap discovered during the ZF honesty audit.

**Cycle 5:** No new opportunities from Cycle 4 enhancement.

**CEC complete at Cycle 5. 0 new opportunities found.**

---

## §3 — WHAT MUST BE BUILT (from CEC)

| Artifact | Type | Session | Purpose |
|---|---|---|---|
| `validate-prisma-version-alignment.mjs` | Validator | S023 | Catch version drift before ZenStack breaks |
| `validate-db-url-pgbouncer.mjs` | Validator | S023 | Catch missing pgbouncer flag |
| `validate-isolation-layers.mjs` | Validator | S023 | Confirm ORM + DB isolation both active |
| `validate-webhook-idempotency.mjs` | Validator | S023 | Confirm each handler has existence check |
| `validate-solo-user-flow.mjs` | Validator | S023 | Confirm each app declares solo flow |
| `validate-pe-situation-declared.mjs` | Validator | S023 | Confirm active situation in session-state |
| Closing-summary template update | Template | S023 | Make ZF deep + extraction mandatory gate |
| Plan creation protocol: Step 0.5 | Protocol | S023 | Declare ai_defaults_influence before writing |
| `validate-rzf-evidence.mjs` promotion | Validator | S023 | From advisory → BLOCKING for done claims |
| Webhook idempotency fix | Implementation | S023 | All 7 handlers get existence checks |
| GDPR erasure API + settings page | Implementation | App #2 | Make eraseUser() reachable |
| Prisma migrate baseline | Implementation | S023 | Production migration strategy |
| `session-state.json: active_situation` | Schema | S023 | Explicit platform meta-state |

---

*S022 Extraction v1.0 | CEC walk complete — 5 cycles | 2026-05-11*
*Evidence: ZF Level 3 ACHIEVED, 0 blocking. Validators: 58.*
