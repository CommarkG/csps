---
id: csps.handoff.vault.topic-plan.platform-excellence-completion-S023
name: platform-excellence-completion-S023
description: >
  The definitive completion plan for CSPS enterprise-level platform excellence.
  Governor directive S022: close all gaps found in flow audit, make ZF + harvesting
  mandatory mechanical steps, add monitoring + notification infrastructure, PE-ordered
  sequence. Simplest viable path with upgrade hooks at every point.
  ai_defaults_influence: none — all items derived from audit findings, CEC, and PE scoring.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD, OPER]
schema_anchor: topic_plans
domain_path: platform
tags:
  - domain:governance
  - domain:architecture
  - type:how-to
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S023
execution_mode: deep_quality
know_how_consulted: true
enforcement_stage: active
topic_id: platform-excellence-completion-S023
priority_score: 99
priority_band: 1
depth_chosen: 4
depth_rationale: |
  Depth-4: 4 implementation sessions + monitoring infrastructure.
  Platform-level foundation work — must be done before App #2.
  Not depth-5: no constitutional changes. All additive to existing structures.
impl_status: swift-implemented
ai_defaults_influence: none
ratification_status: RATIFIED
ratification_date: "2026-05-11"
ratification_by: "Governor — all 7 PCR decisions approved"
links:
  - { rel: parent, href: ./README.md }
  - { rel: bedrock, href: ../../../../pillar-0-governance/csps-bedrock.md }
  - { rel: flow-audit, href: ../platform-flow-audit-S022.md }
  - { rel: s022-extraction, href: ../session-S022-extraction.md }
  - { rel: session-state, href: ../../../../../tools/session-state.json }
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



# Platform Excellence Completion Plan — S023+

> **Governor directive:** "Go over everything and have a saved plan fully detailed.
> Close all gaps before loading more things. ZF is mandatory. Harvesting is mandatory.
> Mechanically monitored. Simplest viable but upgradeable. PE-ordered."

---

## §0 — HONESTY DECLARATION

**ZF audit (S022):** ZF Level 3 was NOT run per session. `pnpm verify` was run (exit_code=0).
The difference: `verify` checks validators; `zf:deep` cycles until 0 blocking AND extracts advisories.
**This plan permanently fixes this by making `pnpm zf:deep` a mechanical gate — not a reminder.**

**Harvesting audit (S022):** Sessions 3-6 had no extraction notes. `know_how_consulted: true` was set
nominally. §KH was skipped. CEC was not run.
**This plan permanently fixes this by making extraction mandatory BEFORE session close is declared.**

**What IS clean:** 58 validators, pnpm verify exit_code=0, bedrock 22/22, ZF Level 3 ACHIEVED.

---

## §1 — PE ORDERING RATIONALE

```
PE Formula: score = B×0.30 + D×0.30 + I×0.15 + Bn×0.10 + PAS×0.15

Session 0 (Week-4 retirement + over-system audit):
  B=10 (constitutional: 49 "planned week-4" items classified), D=10 (all other sessions depend on this),
  PE_SCORE = 9.5 | Band 1 — BLOCKING
  REASON: Cannot build enforcement for CLASS A items without knowing which items they are.
  See: docs/plan/_handoff/VAULT/over-the-system-audit-S022.md

Session A (Process hardening — ZF/harvest enforcement + CLASS A items):
  B=10 (constitutional: every future session inherits this), D=10 (all sessions depend on this),
  PE_SCORE = 9.25 | Band 1 — BLOCKING
  REASON: Every session we run without this burns more sessions recovering. Fix process FIRST.

Session B (System stability — webhook idempotency + migration + session revocation):
  B=8 (multi-app impact), D=9 (App #2 cannot go live without these),
  PE_SCORE = 8.35 | Band 1 — BLOCKING
  REASON: Data integrity (idempotency) + production safety (migration) + security (revocation).

Session C (Monitoring infrastructure — 6 new validators + closing template):
  B=8 (every future session monitored), D=8 (monitoring enables confident App #2),
  PE_SCORE = 7.9 | Band 1 — BLOCKING
  REASON: The validators from the CEC walk — without them the gaps we found will recur.

Session D (App template + guide — GDPR API + solo user flow):
  B=7 (unblocks App #2 + all future apps), D=7,
  PE_SCORE = 7.15 | Band 1 — BLOCKING
  REASON: Cannot build App #2 cleanly without the template. Solo user flow is the #1 conversion gap.

App #2 kick-off (PE-scored separately after Session D):
  B=8 (first app proves the platform works), D=5 (foundation is ready),
  PE_SCORE = 6.8 | Band 2 — HIGH
```

---

## §2 — SESSION PLAN (PE-ordered, detailed)

---

### SESSION A: Process Hardening (PE_SCORE=9.25 | Band 1 | EXECUTE FIRST)

**Mission:** Make ZF + harvesting mechanically enforced — not opt-in, not trusted to AI memory.

**Pre-flight:**
```
Q-GATE:      pnpm verify exit_code=0 ✅
Q-COMPLETE:  Session A is process-layer — no new features
Q-GLOBAL:    All changes platform-level (tools/templates, hooks)
QUESTIONS:   0 — all mechanical, no Governor decisions needed
```

**STEP A1 — Promote `validate-rzf-evidence.mjs` from ADVISORY to BLOCKING**
```
Current: exits 0 even when no ZF evidence present (advisory only)
Change:  exits 1 when a session-level DONE claim has no ZF evidence
How:     Read closing-summary files for "DONE" declarations
         If no ZF orchestrator output referenced → exit 1
Scope:   Forward-only (sessions before S022 grandfathered)
```

**STEP A2 — Promote `validate-session-harvest-readiness.mjs` from ADVISORY to BLOCKING**
```
Current: status=HARVEST_READY means no extraction exists → exits 0 (advisory)
Change:  exits 1 when session validator count > 40 AND no extraction exists
This session (S022): RESOLVED by session-S022-extraction.md
Future sessions: extraction REQUIRED to declare DONE
```

**STEP A3 — Add mandatory ZF deep + extraction section to closing-summary template**
```
File: docs/plan/_handoff/VAULT/closing-summary-template.md
Add §10.0-ZF-DEEP block:
  MANDATORY — paste output of: node tools/zf-orchestrator.mjs --level 3
  Must show: STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain
  MUST BE PASTED VERBATIM — no paraphrase, no "ZF clean" claims without output

Add §10.0-HARVEST block:
  MANDATORY — paste output of: node tools/validators/validate-session-harvest-readiness.mjs
  Must show: status=HARVEST_DONE
  If status=HARVEST_READY: session-S{NNN}-extraction.md MUST be created before this block
```

**STEP A4 — Add pre-stop hook for ZF + harvest gates**
```
File: .claude/hooks/pre-stop-zf-deep-gate.sh
Behavior:
  1. Run validate-session-harvest-readiness.mjs
  2. If HARVEST_READY → emit warning: "Session extraction missing for S{NNN}. Create it before closing."
  3. Run validate-rzf-evidence.mjs
  4. If no ZF evidence → emit warning: "ZF deep cycle not run. Run: node tools/zf-orchestrator.mjs --level 3"
  Enforcement: ADVISORY this session; BLOCKING from S024 (gives one session to adjust)
```

**STEP A5 — Add §KH (Know-How) to gradual-build-plan template**
```
File: tools/templates/gradual-build-plan.template.md
Add required §KH section:
  ## §KH — Know-How Consultation
  Before implementing [session-name]:
  - Checked: docs/plan/_handoff/VAULT/know-how/ for relevant patterns
  - Relevant patterns found: [list or "none"]
  - Decisions influenced by: [pattern IDs or "none"]
Validation: validate-plan-know-how.mjs already checks know_how_consulted: true
Enhancement: check that §KH section exists AND is non-empty
```

**Evidence required:**
```
[A-E1] validate-rzf-evidence.mjs exits 1 when no ZF evidence in closing-summary
[A-E2] validate-session-harvest-readiness.mjs exits 1 when extraction missing
[A-E3] closing-summary-template.md shows §10.0-ZF-DEEP + §10.0-HARVEST blocks
[A-E4] pre-stop-zf-deep-gate.sh present + fires advisory
[A-E5] pnpm verify exit_code=0 (all changes pass)
```

---

### SESSION B: System Stability (PE_SCORE=8.35 | Band 1)

**Mission:** Close data integrity + production safety + security gaps found in flow audit.

**Pre-flight:**
```
Q-GATE:      Session A complete + pnpm verify exit_code=0
QUESTIONS:   0 — all items derived from flow audit, no new decisions needed
```

**STEP B1 — Webhook idempotency (SYS-1)**
```
File: libs/integrations/clerk/webhook-handler.ts
For EACH case, add existence check at top:
  user.created:            check db.user.findUnique({ where: { clerkId: id } })
  organization.created:   check db.tenant.findUnique({ where: { clerkOrgId } })
  membership.created:     check db.userTenant.findFirst({ where: { userId, tenantId } })
  membership.updated:     no create → no check needed (update is already idempotent)
  membership.deleted:     wrap in try/catch (delete of non-existent = ok)
  user.deleted:           check db.user.findUnique before updating
  organization.deleted:   check db.tenant.findUnique before updating
Pattern: if (existing) break  — early return, no error
```

**STEP B2 — Session revocation on membership removal (F-1)**
```
File: libs/integrations/clerk/webhook-handler.ts, case organizationMembership.deleted
Add after UserTenant deletion:
  // Revoke all active sessions for this user (they should not retain JWT access)
  // Note: requires CLERK_SECRET_KEY in env. Uses Clerk REST API.
  // Implementation: call Clerk's /v1/users/{userId}/sessions endpoint
  // For MVP: document as pending (Clerk Node SDK installation needed in libs/integrations)
Register as: VLT-S023-SESSION-REVOCATION — pending Clerk SDK in libs/integrations
```

**STEP B3 — Production migration strategy (SYS-2)**
```
Action 1: Add prisma migrate to package.json scripts:
  "db:migrate:dev":  "prisma migrate dev --schema apps/task-mgmt/prisma/schema.prisma"
  "db:migrate:prod": "prisma migrate deploy --schema apps/task-mgmt/prisma/schema.prisma"

Action 2: Create initial migration baseline from current schema:
  cd apps/task-mgmt && pnpm exec prisma migrate dev --name baseline --create-only
  This creates migrations/ directory with the current schema as baseline

Action 3: Document migration workflow in app-build-guide.md (Session D)

Note: keep db:push for rapid development iteration; migrate:dev for committed schema changes
```

**STEP B4 — Prisma version alignment validator (INS-S022-001)**
```
File: tools/validators/validate-prisma-version-alignment.mjs
Checks:
  1. Read root package.json: get prisma + @prisma/client versions
  2. Read all apps/*/package.json: get their prisma + @prisma/client versions
  3. Check all versions match (exact or compatible resolution)
  4. If mismatch: BLOCKING — "Prisma version drift detected: root@X vs apps/Y@Z"
Register in verify.mjs + audit-runner.md
```

**STEP B5 — pgbouncer URL validator (INS-S022-002)**
```
File: tools/validators/validate-db-url-pgbouncer.mjs
Checks (from .env.example in each app):
  1. If DATABASE_URL contains ":6543/" (Supabase pooler port)
  2. Verify it also contains "?pgbouncer=true"
  3. ADVISORY if missing (can't read actual .env — validates the template)
Register in verify.mjs + audit-runner.md
```

**Evidence required:**
```
[B-E1] Webhook idempotency: send duplicate webhook event → no error (idempotent)
[B-E2] Migration: migrations/ directory exists with baseline migration file
[B-E3] validate-prisma-version-alignment.mjs exits 0 on current repo
[B-E4] validate-db-url-pgbouncer.mjs exits 0 + advisory if missing
[B-E5] pnpm verify exit_code=0
```

---

### SESSION C: Monitoring Infrastructure (PE_SCORE=7.9 | Band 1)

**Mission:** Build the 6 validators from CEC walk. These are the "always-on" sensors.

**Pre-flight:**
```
Q-GATE:      Session B complete + pnpm verify exit_code=0
QUESTIONS:   0 — all derived from INS-S022-001 through INS-S022-008
```

**STEP C1 — validate-isolation-layers.mjs (INS-S022-004)**
```
Checks:
  1. ZenStack: apps/*/src/lib/zenstack.ts imports from @zenstackhq/runtime (not bypassed)
  2. Postgres RLS: check session-state.json for rls_enabled: true flag
     (We can't query Supabase in CI — use a documented manual verification step)
  3. AuditEvent trigger: check audit-triggers.sql has CREATE TRIGGER section
ADVISORY if RLS not confirmed; BLOCKING if ZenStack is bypassed
```

**STEP C2 — validate-webhook-idempotency.mjs (INS-S022-007)**
```
Checks:
  Scan libs/integrations/clerk/webhook-handler.ts for each case
  Each case must have one of: findUnique | findFirst | try-catch around delete
  If any case missing the pattern: ADVISORY + list which case
```

**STEP C3 — validate-solo-user-flow.mjs (INS-S022-006)**
```
Checks:
  Scan apps/*/src/app/api/webhooks/clerk/route.ts
  If webhook route exists: check that libs/integrations/clerk/webhook-handler.ts
    has either: (a) auto-org creation in user.created, OR
                (b) a comment declaring solo_user_flow: manual|not_applicable
ADVISORY when missing — each app must declare its solo flow policy
```

**STEP C4 — validate-pe-situation-declared.mjs (INS-S022-008)**
```
Checks:
  1. pe-situation-registry.md exists (already does)
  2. session-state.json has active_situation field
  3. The declared situation exists in pe-situation-registry.md as ACTIVE
ADVISORY when missing; helps future sessions know what mode they're in
```

**STEP C5 — validate-gdpr-erasure-path.mjs (GAP-D1)**
```
Checks:
  For each app in apps/*:
  1. libs/integrations/gdpr.ts imported (check package imports)
  2. DELETE /api/settings/account route exists
ADVISORY when missing; becomes BLOCKING before app goes live to users
```

**STEP C6 — validate-subscription-error-handling.mjs (GAP-E1)**
```
Checks:
  All POST/PUT/PATCH routes that import requireWriteSubscription
  Check their error handler returns { error: 'subscription_inactive', renewal_url?: string }
ADVISORY when renewal_url missing; BLOCKING when error code missing
```

**STEP C7 — Add active_situation to session-state.json**
```
Add: "active_situation": "APP_BUILD_MODE"
Update pe-situation-registry to be referenced by session-open.sh:
  On session open: read active_situation → display current platform mode
```

**Evidence required:**
```
[C-E1 through C-E6] Each validator runs + exits 0 on current repo
[C-E7] session-state.json has active_situation: "APP_BUILD_MODE"
[C-E8] pnpm verify exit_code=0 (6 new validators registered)
[C-E9] node tools/zf-orchestrator.mjs --level 3 → ZF ACHIEVED
```

---

### SESSION D: App Template + GDPR API (PE_SCORE=7.15 | Band 1)

**Mission:** Create the scaffold every future app starts from. Make GDPR erasure reachable.

**Pre-flight:**
```
Q-GATE:      Session C complete + pnpm verify exit_code=0
QUESTIONS:   0 — no new Governor decisions needed
```

**STEP D1 — GDPR erasure API (GAP-D1, Q-17 ratified: self-service)**
```
File: apps/task-mgmt/src/app/api/settings/account/route.ts
DELETE handler:
  1. auth() → userId, tenantId
  2. Get cspsUser from DB
  3. Call eraseUser(cspsUser.id, tenantId, db)
  4. (Future) Delete user from Clerk: await clerkClient.users.deleteUser(userId)
  5. Return { erased: true, erasure_id }
Wire UI: settings page (minimal) with "Delete my account" button
```

**STEP D2 — Solo user flow: auto-create personal org (GAP-A1)**
```
File: libs/integrations/clerk/webhook-handler.ts, user.created case
After creating User row:
  - Check if user already has an org (via Clerk API)
  - If no org: call Clerk API to create personal org
    await clerkClient.organizations.createOrganization({
      name: `${email.split('@')[0]}'s workspace`,
      createdBy: userId,
    })
  - This triggers org.created webhook → Tenant + UserTenant created automatically
Note: clerkClient requires @clerk/backend installed in libs/integrations
```

**STEP D3 — App template scaffold**
```
Directory: apps/template/
Structure:
  package.json (with correct Prisma version + ZenStack)
  prisma/schema.prisma (import from libs/policies — shared schema)
  src/app/api/webhooks/clerk/route.ts (wired from libs/integrations)
  src/app/api/webhooks/stripe/route.ts (wired from libs/integrations)
  src/app/api/settings/account/route.ts (GDPR erasure)
  src/lib/zenstack.ts (enhance() correctly set up)
  src/lib/subscription.ts (reads from libs/config)
  src/lib/audit.ts (writeAuditEvent)
  .env.example (with pgbouncer=true in DATABASE_URL)
  README.md: "Fork this to build App #2. Run: pnpm install → pnpm db:push → pnpm dev"
```

**STEP D4 — App build guide**
```
File: docs/plan/pillar-1-product/app-build-guide.md
Sections:
  1. Prerequisites (Clerk app, Supabase project, env vars)
  2. Fork the template (git checkout -b app-name, mv apps/template apps/your-app)
  3. Clerk setup (JWT template, webhook URL, org settings)
  4. Supabase setup (DATABASE_URL + DIRECT_URL, db:push)
  5. First run (pnpm dev, sign up, verify "No org yet" → create org → tasks)
  6. Schema extension (add your domain entities to schema.zmodel)
  7. Graduation path ($1K MRR → extract + deploy standalone)
```

**Evidence required:**
```
[D-E1] DELETE /api/settings/account → eraseUser() called → AuditEvent written
[D-E2] New user signs up → personal org created automatically → can use app
[D-E3] apps/template/ exists with all required files
[D-E4] validate-app-template-completeness.mjs exits 0 on apps/template/
[D-E5] pnpm verify exit_code=0
[D-E6] node tools/zf-orchestrator.mjs --level 3 → ZF ACHIEVED
[D-E7] session-S023-extraction.md exists before SESSION D declared DONE
```

---

## §3 — MONITORING INFRASTRUCTURE (the "always-on" notification system)

**Philosophy:** Every enhancement need must be detected mechanically and surfaced automatically.
Nothing relies on AI memory or human review of changelogs.

```
SIGNAL TYPE → DETECTOR → NOTIFICATION → RESPONSE

Prisma drift    → validate-prisma-version-alignment.mjs → verify FAIL → fix before next session
DB URL missing  → validate-db-url-pgbouncer.mjs         → verify advisory → fix in template PR
ZenStack bypass → validate-isolation-layers.mjs          → verify FAIL → emergency fix
Webhook non-idm → validate-webhook-idempotency.mjs       → verify advisory → fix before live
Solo flow gap   → validate-solo-user-flow.mjs             → verify advisory → fix in app plan
Situation drift → validate-pe-situation-declared.mjs     → verify advisory → update session-state
GDPR gap        → validate-gdpr-erasure-path.mjs          → verify advisory → fix before EU launch
Subscription err→ validate-subscription-error-handling.mjs→ verify advisory → fix before launch
Harvest missing → validate-session-harvest-readiness.mjs  → verify FAIL → create extraction note
ZF not done     → validate-rzf-evidence.mjs               → verify FAIL → run zf:deep first
AI defaults     → validate-plan-ai-defaults.mjs           → verify advisory → get Governor review
PE connectivity → validate-pe-connectivity.mjs            → verify FAIL → add PE scores to plans
```

**Escalation tiers:**
- `pnpm verify` exit_code=0 = ALL BLOCKING checks pass. Can commit.
- Advisory warnings: tracked, addressed per session, not blocking commits
- `pnpm zf:deep` = ZERO BLOCKING across 5 cycles. Can declare session DONE.
- `session-SNNN-extraction.md` exists = Harvesting done. Can write closing-summary.

---

## §4 — MANDATORY PROCESS (how to declare a session DONE)

```
BEFORE declaring any session complete:

1. pnpm verify → exit_code=0 (58+ validators — no exceptions)

2. node tools/zf-orchestrator.mjs --level 3 → paste output showing:
   STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain
   (Advisory warnings: each must be either DONE or DEFERRED with reason)

3. node tools/validators/validate-session-harvest-readiness.mjs → status=HARVEST_DONE
   If HARVEST_READY: create session-SNNN-extraction.md FIRST

4. Paste all three outputs into closing-summary §10.0-ZF-DEEP + §10.0-HARVEST

5. Git commit + push

NOTHING ELSE COUNTS AS DONE. Memory of earlier runs ≠ evidence. Re-run IS the proof.
```

---

## §5 — WHAT IS NOT IN THIS PLAN (and why)

| Excluded item | Why | When |
|---|---|---|
| App #2 domain choice | Governor decision (Business vs Personal — PCR Decision 7) | Governor declares |
| Billing UI (Stripe Checkout) | Per-app concern, not platform core | App #2 build plan |
| Staff admin panel | staffRole field exists; panel is a feature, not core | Post-App #2 |
| API rate limiting | Infrastructure concern; acceptable at 0-1 users | Post-first-paying-customer |
| Full GDPR compliance audit | Legal review needed; eraseUser() is the tech foundation | Pre-EU launch |

---

## §6 — AI-DEFAULTS DECLARATION

**ai_defaults_influence: none**

Every item in this plan is derived from:
- Flow audit findings (12 gaps, observed in real code review)
- CEC walk (S022 extraction §2 — 5 cycles to zero)
- Governor-ratified PCR decisions (7 ratified on 2026-05-11)
- PE scoring formula (computed, not estimated)

No industry convention or AI training default was used as a plan value without Governor ratification.

---

## §7 — EVIDENCE GATE (closing this plan)

**Plan is DONE when:**
```
Session A: [A-E1] through [A-E5] pasted + ZF ACHIEVED + extraction exists
Session B: [B-E1] through [B-E5] pasted + ZF ACHIEVED + extraction exists
Session C: [C-E1] through [C-E9] pasted + ZF ACHIEVED + extraction exists
Session D: [D-E1] through [D-E7] pasted + ZF ACHIEVED + extraction exists

Final check:
  node tools/validators/validate-bedrock.mjs → 22/22 (no regression)
  node tools/zf-orchestrator.mjs --level 3 → ZF ACHIEVED
  validate-session-harvest-readiness.mjs → HARVEST_DONE (for S023)
  pe-situation-registry.md: APP_BUILD_MODE ACTIVE, all other situations CLOSED
```

---

*Platform Excellence Completion Plan v1.0 | S023+ | 2026-05-11*
*All 7 PCR decisions ratified by Governor. AI-defaults: none. PE-ordered.*
*Session start condition: pnpm verify exit_code=0 ✅ (confirmed 58 validators)*
