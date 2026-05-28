---
id: csps.apps.debt-collection.phase-1-findings-consolidation
name: phase-1-findings-consolidation
description: "PROTO-S062-K STEP 4 — complete findings consolidation for debt-collection Phase 1 wet trial. Every finding mapped to propagation_target + action + status. Source of truth for what was learned, what was fixed, and what propagation work is queued."
type: wet-trial-artifact
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
app: debt-collection
session: S062
authored_by: Sonnet-10
date: 2026-05-26
proto: PROTO-S062-K
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD]
schema_anchor: wet_trial_artifacts
links:
  - { rel: wet-trial-log, href: ./wet-trial-log.yaml }
  - { rel: phase-1-gap-audit, href: ./phase-1-gap-audit.md }
  - { rel: e2e-validation, href: ./debts.yaml }
---

# Debt Collection — Phase 1 Findings Consolidation

> PROTO-S062-K STEP 4 | Consolidation + propagation_target audit | Sonnet-10 | S062

All findings from the debt-collection Phase 1 wet trial (S060 build + S062 governance trial).
Every finding has a propagation_target, action, and status.

Valid propagation_target values: `template | validator | hook | b-contract-candidate | app-only | wontfix`

---

## Consolidation Table

| Finding ID | Type | Propagation target | Action | Status | Commit |
|---|---|---|---|---|---|
| AP-005 | bug_fix | `template` | webpack resolve.dedupe removed from next.config.js template | DONE | e07504d |
| AP-006 | bug_fix | `template` | inngest resolve.alias + NormalModuleReplacementPlugin in next.config.js | DONE | e07504d |
| SG-001 | structural_gap | `template` | libs/config/package.json created — @csps/config now a real workspace package | DONE | e07504d |
| SG-002 | structural_gap | `template` | @csps/integrations import changed to workspace alias (@csps/config/...) | DONE | e07504d |
| DW-001 | deferred_wiring | `template` | inngest v4 API migration — all 4 job functions updated in libs/integrations/jobs | DONE | e07504d |
| SG-003 | structural_gap | `template` | 6 missing deps added to apps/template/package.json | DONE | e07504d |
| SG-004 | structural_gap | `template` | export const dynamic = 'force-dynamic' added to all app root layouts incl. template | DONE | e07504d |
| GAP-1-closed | validator_added | `validator` | validate-voice-profile.mjs created (Component B, platform-wide T2) + registered | DONE | 018555d |
| GAP-3-closed | structural_gap | `app-only` | export const dynamic = 'force-dynamic' on debts/route.ts + generate-message/route.ts | DONE | 208cc9b |
| GAP-2-already-present | false_positive | `wontfix` | relatedPages was present since S060 — no action | CLOSED | 080041e |
| E2E-BLOCKER-1 | infrastructure | `template` | apps/template/setup-guide.md — Phase 1 setup checklist (DB seeding, Clerk local dev) | QUEUED → PROTO-S063-TEMPLATE-SETUP-GUIDE | — |
| E2E-BLOCKER-2 | env-config | `template` | apps/template/.env.example — add ANTHROPIC_API_KEY with comment | QUEUED → PROTO-S063-TEMPLATE-ENV-EXAMPLE | — |
| AUDIT-PROCESS-1 | audit-discipline | `hook` | pre-tool-use-audit-grep-check.sh stub — require source_grep_evidence before listing gap | QUEUED → PROTO-S063-AUDIT-GREP-GATE | — |
| META-1-frontmatter-recurrence | template-gap | `template` | .csps/templates/governance-doc.md with all 4 required fields pre-filled (K=2 trigger) | QUEUED → PROTO-S063-FRONTMATTER-TEMPLATE | — |

**Summary:** 10 DONE | 1 CLOSED (wontfix) | 4 QUEUED | 0 BLOCKED

---

## DONE Findings (10) — Evidence

### S060 Build Fixes (7) — all propagated at commit e07504d

These were discovered during the first real-app build in S060 and fixed in the same commit:

| ID | What was fixed | Where propagated |
|---|---|---|
| AP-005 | `resolve.dedupe` is Vite-only — removed from all next.config.js templates | apps/template/next.config.js |
| AP-006 | Inngest ESM/CJS — webpack picks wrong entry without resolve.alias | libs/integrations + template next.config.js |
| SG-001 | @csps/config had no package.json — workspace resolution failed | libs/config/package.json (new file) |
| SG-002 | Relative import `../../config/...` breaks in symlinked node_modules | libs/integrations/index.ts |
| DW-001 | Inngest SDK v4 API migration (deferred from S040) — finally wired | libs/integrations/jobs/functions/* |
| SG-003 | 6 production deps missing from template package.json | apps/template/package.json |
| SG-004 | Root layout missing force-dynamic — Clerk requires runtime rendering | apps/template/src/app/layout.tsx + all apps |

**Key signal from S060:** Every structural fix was immediately propagated to `apps/template/`. This is the Component A/B discipline working correctly — the app (Component A) surfaces the gap, the template (Component B) receives the permanent fix. Future apps forked from template inherit all 7 fixes automatically.

### S062 Gap Closures (3)

| ID | What was fixed | Where propagated |
|---|---|---|
| GAP-1-closed | Missing T2 validator for voice-profile compliance | `tools/validators/validate-voice-profile.mjs` (platform-wide) |
| GAP-3-closed | API routes implicitly dynamic but not declaratively — force-dynamic added | `apps/debt-collection/src/app/api/` (app-only) |
| GAP-2-already-present | False positive — relatedPages was in pageDNA since S060 | wontfix |

---

## QUEUED Findings (4) — Forward PROTOs

### E2E-BLOCKER-1 → PROTO-S063-TEMPLATE-SETUP-GUIDE

**Problem:** Every developer forking from `apps/template/` to build a new CSPS app will hit the same "redirect to /sign-in" issue unless they manually seed a DB user record and configure Clerk JWT claims. The setup steps exist in memory (`feedback_clerk_local_dev_setup.md`) but nowhere in the template itself.

**Required action:**
1. Create `apps/template/setup-guide.md` with a "Phase 1 Local Dev Checklist"
2. Must include: (a) seed DB user record via Prisma Studio or seed script, (b) set `user.public_metadata.tenantId` in Clerk dashboard, (c) configure Clerk JWT template, (d) sign out / sign in to refresh claims
3. Reference: `C:\Users\finky\.claude\projects\...\memory\feedback_clerk_local_dev_setup.md`
4. Wire to `apps/template/README.md` as "Setup before running"

**Why template (not hook):** This is a human-executed setup, not a machine-checkable gate. Documentation in the template repo ensures every fork inherits it.

---

### E2E-BLOCKER-2 → PROTO-S063-TEMPLATE-ENV-EXAMPLE

**Problem:** `apps/template/.env.example` does not list `ANTHROPIC_API_KEY`. Any app that uses AI generation will fail at runtime with an SDK AuthenticationError and the developer will have no immediate indication of what's missing.

**Required action:**
1. Add to `apps/template/.env.example`:
   ```
   # Required for AI message generation (get from console.anthropic.com)
   ANTHROPIC_API_KEY=your_key_here
   ```
2. Check whether other AI-related keys should also be documented (PostHog, Sentry, etc.)
3. Verify `apps/debt-collection/.env.example` also has this key

**Why template:** `.env.example` is the canonical "keys you need to run this" document. It belongs in the template so every fork inherits it.

---

### AUDIT-PROCESS-1 → PROTO-S063-AUDIT-GREP-GATE

**Problem:** In STEP 1, the gap audit listed `relatedPages` as missing without grepping the actual source files first. 1/3 of STEP 2 work was spent on a non-issue. Root cause: no structural requirement forces the AI to cite `file:line` evidence before writing a gap entry.

**Required action:**
1. Add `source_grep_evidence` as a required field in gap audit entries (schema)
2. Add `pre-tool-use-audit-grep-check.sh` stub hook — when writing to files matching `*gap-audit*.md` or `*wet-trial-log*.yaml` with `type:structural_gap`, warn if `source_grep_evidence` field is absent
3. Hook should be advisory (not blocking) for now — K=1, not K=2 yet

**Why hook (not validator):** The check must fire at write time, not after commit. A hook intercepts the Edit call before the file is written. A validator would catch it too late (post-commit).

---

### META-1-frontmatter-recurrence → PROTO-S063-FRONTMATTER-TEMPLATE

**Problem (K=2):** Two consecutive new markdown governance artifacts this session were missing the same 4 required frontmatter fields (`version`, `owner`, `lifecycle`, `lifecycle_state`):
- `docs/plan/_handoff/VAULT/strategic/tab-transfer-stability-analysis.md` (caught by validate-frontmatter.mjs at STEP 0)
- `apps/debt-collection/.csps/phase-1-gap-audit.md` (caught and self-fixed at commit a0e5c32)

K=2 triggers mandatory structural fix per B_STRUCTURAL_PREVENTION_DISCIPLINE + P-META-019.

**Required action:**
1. Create `.csps/templates/governance-doc.md` — a template file with ALL required frontmatter fields pre-filled with placeholder values and inline comments explaining each field
2. All new governance docs start from this template (fork, not blank)
3. Add check to `validate-frontmatter.mjs`: if a file has 0 frontmatter at all (no `---`) and is in `docs/plan/` or `.csps/`, warn "did you start from governance-doc.md template?"
4. Link from `AGENTS.md` hard NOs: "never create a governance markdown file without frontmatter"

**Why template:** The root cause is starting new files from blank. The fix is a canonical starting point — not a validator that catches the miss after the fact.

---

## Audit-Process Improvement Signal

**Finding:** STEP 1 gap audit identified GAP-2 (relatedPages missing) without grepping current source. The file at `create/page.tsx:16` clearly had `relatedPages: ['/dashboard', '/message']` since S060.

**Pattern tag:** `audit_process_improvement: grep_before_listing_gap`

**Implication for future wet trials:** Before listing any "X is missing" finding in a gap audit, the AI MUST:
1. `grep -r "relatedPages" apps/<app>/src/` (or equivalent)
2. Cite `file:line` as `source_grep_evidence` in the finding
3. Only list the gap if grep returns 0 results

This is not punitive — it costs 10 seconds and prevents 1/3 of STEP 2 from becoming wasted classification work.

---

## Phase 1 Overall Health

| Dimension | Result |
|---|---|
| **E2E flow achievable** | ✅ 4 clicks, avatar_goal_achieved: true |
| **Phase 1 code blockers** | ✅ 0 |
| **Setup dependencies documented** | ⚠️ 2 queued (BLOCKER-1, BLOCKER-2) |
| **Voice profile compliance** | ✅ Both Phase 1 pages pass validate-voice-profile.mjs |
| **API route hardening** | ✅ force-dynamic on both routes |
| **pageDNA completeness** | ✅ All 3 pages pass validate-page-dna.mjs |
| **verify outer exit_code** | ✅ 0 (confirmed S062) |
| **Propagation targets assigned** | ✅ 14/14 findings have propagation_target |

**Verdict:** Phase 1 is complete and ratifiable. The 4 QUEUED items are quality-of-life improvements for the template — they do not affect the Phase 1 app's functionality.

---

*STEP 4 complete. Commit this file as evidence. Await Opus ADVANCE for STEP 5 (Phase 1 ratification request).*
