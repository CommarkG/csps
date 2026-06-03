---
id: csps.vault.chat-jump-S039-complete
name: chat-jump-S039-complete
description: "Complete professional chat transfer for S039/S040 continuation. WHO/WHAT/HOW/NOW + deep context + alignment questions. ZCA-compliant. Improved with full session nuances."
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S039
scope_level: S1
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ../README.md }
  - { rel: handoff, href: ../../HANDOFF-S038-to-S039.md }
---

# Chat Transfer — S039 Complete State (v2 — improved)

**Last commit:** 8644dc3 | **Date:** 2026-05-17 | **OPUS-2 Turn:** 95+
**Verify:** exit_code=0 | **Budget Planner build:** FIXED (c2fc7f7)

---

## WHO YOU ARE AND HOW THIS WORKS

**You are:** A new Claude Sonnet instance — builder/implementer. You write code, create files, run validators, commit to GitHub, and report back. You do NOT make architectural decisions.

**Your role:** Before touching any file: write `INTENT ABSORBED` to `tools/council/sonnet-turn.md`.

**OPUS-2 (Claude Opus, separate tab):** Architectural Advisor. Read `tools/council/opus-turn.md` from Turn 90+ for recent directives. Writes using format: `[PROTOCOL: ID | STEP: N of M | MODE: x]`.

**The Governor (Yariv Fink):** Human decision-maker. Relays between you and OPUS-2. **Only the Governor can set `ratified_at`** on PI items. "proceed" or "approved" is NOT ratification.

**The project (CSPS):** CoreSights Platform Services — governed, AI-collaborative foundation for multi-tenant SaaS. Next.js 14 monorepo, pnpm, Clerk/Supabase/ZenStack/Vercel. Budget Planner live at csps-budget-planner.vercel.app.

**The workspace:** `c:\Users\finky\Desktop\Claude Code\Csps` — repo root.

---

## WHAT (platform state)

```yaml
validators: 127+ (node tools/verify.mjs exit_code=0)
principles: 65 (including P-ARCH-031, P-UX-002/ZCA, P-OPER-002)
behavioral_contracts: 61 (including B_ZCA, B_DONE_RIGHT_FROM_THE_START)
skills: 27 (all AAP-aligned, /pe-agent Class A PE-scoring + bundling)
moat_elements: 26 (M-26: DNA inheritance gate — new libs/ files blocked without @csps-enforces)
session: S039 active → S040 opens
last_commit: 8644dc3 (chat-jump + platform-state-snapshot)
```

**Budget Planner:** FIXED at c2fc7f7. Build was failing because:
- `sentry.client.config.ts` imported `@sentry/nextjs` (not installed) → deleted
- `inngest/next` imported in API route (not installed) → stubbed
- `libs/integrations/jobs/inngest.ts` had hard `inngest` import chain → stubbed
- Added `src/types/deferred-packages.d.ts` for type stubs of 7 deferred packages
- `tsc --noEmit` now 0 errors

**New in S037-S039 (read ALL of these):**
- `docs/plan/pillar-4-developer-experience/developer-journey/` — 10-doc PE-scored developer journey mini-tree
- `docs/plan/pillar-0-governance/meta-platform/` — 8-doc meta-platform mini-tree
- `tools/council/quality-protocols/` — shared/opus/sonnet quality specs (3 files)
- `docs/plan/_handoff/VAULT/COMPLETION-GAP-ANALYSIS-S039.md` — honest analysis of why governance fails
- `docs/plan/_handoff/VAULT/user-journey-tests/` — UJT infrastructure (pnpm record:ujt)
- `docs/plan/_handoff/VAULT/templates/page-creation-checklist.md` — fill before any JSX

---

## HOW (communication rules + critical protocols)

**Rules 1-10 (tools/council/communication-protocol-shared.md):**
- Rule 1: Every Sonnet→Opus: `Opus, this is Sonnet.`
- Rule 6: DONE = built + wired + called + verified. Not just committed.
- Rule 7 (ZCA): WHO/WHAT/HOW/NOW at every boundary. Receiver starts from zero.
- Rule 8: Register → Implement → Wire → Verify.
- Rule 9: Pre-directive RZF. Directive quality gate.
- Rule 10: YOU ARE / I AM / THIS IS THE SITUATION / YOUR TASK for all directives.

**THE MOST CRITICAL PROTOCOL (Governor ratified S039):**
```
NOTHING IS CODED WITHOUT A RATIFIED PLAN.
Ratified = Governor explicitly said "ratified" + set ratified_at.
"proceed" or "approved" alone is NOT ratification.
Pending plan → no implementation, period.
```

**ZF discipline (enforced by hook #6 on every prompt):**
- ZF = Zero Findings. Cycle terminates ONLY when nothing new is found.
- Cycle 2 MUST name what was re-examined from Cycle 1 — not "0 new findings" (EP-ERR-008: nominal RZF)
- Every substantive response requires ZF before finalizing

**Build verification:** For build-related fixes: run `pnpm --filter @csps/[app] build` — not just `tsc --noEmit`. tsc alone is insufficient (OPEN-033).

---

## THE COMPLETION GAP (critical insight — read before any implementation)

From `docs/plan/_handoff/VAULT/COMPLETION-GAP-ANALYSIS-S039.md`:

**The core problem:** AI training defaults generate code that passes governance validators but does NOT make users able to accomplish their goals. The satisfaction point fires at "validators pass" not at "user achieves goal."

**What actually works:** T2 validators that block commits. T1 hooks that fire before response. T3 session injections dilute by turn 10.

**The fix:** `user_journey_test:` field on PI items — done criterion must be user-behavioral, not validator-proxy. A feature is DONE when the user_journey_test PASSES, not when pnpm verify passes.

**Implication for every new feature you build:** Before writing code, state the user_journey_test: "Given [user state], When [action], Then [observable outcome]." This is the DONE criterion.

---

## GOVERNANCE NUANCES (don't miss these)

**EP-ERR-007 (plain-path references):** Every file path in chat output must be a clickable markdown link `[name](path)`. Never bare paths like `tools/verify.mjs`. The `post-stop-link-discipline.sh` hook catches this.

**EP-ERR-008 (nominal RZF):** Cycle 2 of RZF that just says "0 new findings" without naming what was re-examined = the #1 governance failure. The `validate-quality-alignment.mjs` validator measures this — current `directive_rzf_quality_rate=0%`. Must name the specific area re-examined.

**DNA inheritance (M-26):** Every new `libs/` TypeScript file > 50 lines needs `// @csps-enforces P-XXX-NNN` annotation. `validate-new-file-dna.mjs` BLOCKS commits if missing. This applies to YOU — before writing any new integration file, add the annotation.

**validate-handoff-completeness v2.0 (BLOCKING):** HANDOFFs from S037+ must have Zone A, Zone B, AND `## ALIGNMENT QUESTIONS` with 3+ questions. If you write a HANDOFF without these, `pnpm verify` FAILS. Pre-S037 HANDOFFs are grandfathered as advisory.

**Enforcement trio:** Every new rule/principle/contract needs T1+T2+T3 at creation. T3-only WILL drift. `validate-enforcement-trio-assigned.mjs` checks this on PI items.

---

## DEFERRED PACKAGES (stub situation)

These packages are NOT installed — graceful stubs exist:
- `inngest` → `libs/integrations/jobs/inngest.ts` stubbed (wiring_deferred_until: S040)
- `resend` → `libs/integrations/email/client.ts` stubbed (wiring_deferred_until: S040)
- `posthog-node`, `@upstash/*`, `@aws-sdk/*`, `zod` → type stubs in `apps/budget-planner/src/types/deferred-packages.d.ts`

**Governor action required to activate any:** install package + set env var in Vercel + test.

---

## PLANNING GRID CONCEPT (not yet built as tooling)

The Governor ratified the planning grid concept in S039. Key points:
- Every new feature activates a subgraph of planning nodes (User Model, Data Model, API Surface, UI Flows, Auth, Business Logic)
- Nodes must reach VALIDATED status before implementation
- This is conceptual — no tooling built yet
- The `developer-journey/02-planning-grid.md` document specifies it
- Implementation awaits OPUS-2 ratification in Turn 96+

---

## NOW (open items and first actions)

**Awaiting Governor (HIGHEST PE):**
- OPEN-030: App #3 domain decision → this unlocks all S040 app work
- OPEN-026: Ratify P-META-026 (planning-before-implementing as constitutional principle)

**Quick governance fixes (S040 can start here):**
- OPEN-031: Register EP-ERR entry for premature-done-on-tsc-not-build in error-registry/
- OPEN-032: Audit empty `(dashboard)` route group in budget-planner
- OPEN-033: Update communication-protocol-shared.md Rule 6 to require `pnpm build`

**UJT-001 pending:** Visit csps-budget-planner.vercel.app, sign up, record result:
```bash
pnpm record:ujt --test UJT-001 --result pass --observation "what you saw"
```

**First actions in new chat:**
1. Write INTENT ABSORBED to `tools/council/sonnet-turn.md`
2. Run `node tools/verify.mjs` — confirm exit_code=0
3. Update `tools/council/platform-state-snapshot.md` to S039 CLOSED
4. Check OPUS-2 tab for Turn 96 directive OR await Governor App #3 decision

---

## ALIGNMENT QUESTIONS (P-META-014 MUV — mandatory, answer before implementation)

**Q1 — Budget Planner build:** Visit csps-budget-planner.vercel.app after commit c2fc7f7. Did it load (200) or still 404? The build fix was deployed but not yet verified live. UJT-001 status = pending.

**Q2 — App #3 domain:** Has Governor made OPEN-030 decision? If yes, OPUS-2 needs the domain to write the planning grid specification and PE-scored topic-plan. If no, S040 starts with governance housekeeping (OPEN-031/032/033).

**Q3 — Completion gap — will you follow it?** The completion gap analysis (VAULT/COMPLETION-GAP-ANALYSIS-S039.md) says satisfaction points fire at "validators pass." For every feature you build this session: can you state the user_journey_test BEFORE writing any code? If you can't, you're not ready to implement.

**Q4 — Deferred packages:** Are Resend, Inngest, or any other deferred service ready to activate? (RESEND_API_KEY, INNGEST_SIGNING_KEY in Vercel?) If yes, OPEN-033 should happen before activating them (so the verification tail is correct).

**Q5 — OPUS-2 quality score:** Run `node tools/validators/validate-quality-alignment.mjs` and report: what is the current `directive_rzf_quality_rate`? If still 0%, that means every OPUS-2 directive in the last 5 turns had a nominal Cycle 2. This is the most important quality metric to improve.

---

## SEALED DECISIONS (do NOT re-open)

- P-UX-002 ZCA — Zero-Context Assumption constitutional
- P-ARCH-031 Completion Seal — DONE = wired + called + verified
- Enforcement Trio constitutional (T1+T2+T3)
- Planning-before-implementing protocol (Governor ratified S039)
- Rule 10 — YOU ARE / I AM / THIS IS THE SITUATION / YOUR TASK format
- DNA inheritance gate M-26

---

*S039 ACTIVE → S040 opens | Last commit: 8644dc3 | verify exit_code=0*
*Budget Planner build FIXED | App #3 PENDING Governor | Planning protocol RATIFIED*
*Deferred packages stubbed | Quality alignment validator live | UJT-001 pending browser test*
