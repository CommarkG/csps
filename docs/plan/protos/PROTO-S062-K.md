---
id: csps.protos.PROTO-S062-K
name: PROTO-S062-K
description: "S062-K: Debt Collection Phase 1 wet trial — completion to demonstrable end-to-end flow. Parallel track to PROTO-S062-A (permanence). Issued by Opus-10 under Governor Option B + queue PROTO-S062-K directive."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S062
core_spine: GVRN
schema_anchor: protos
consolidation_cross_refs:
  - docs/plan/FOUNDATION-COMPLETION-PLAN.md
  - apps/debt-collection/app.config.yaml
  - apps/debt-collection/.csps/wet-trial-log.yaml
  - docs/plan/pillar-0-governance/CORE-COMPLETE-EXIT-CRITERIA.md
  - docs/plan/protos/PROTO-S062-A.md
---

# PROTO-S062-K

[PROTOCOL: PROTO-S062-K | STEPS: 1-5 SEQUENCED | MODE: exec-session | TRACK: parallel-to-PROTO-S062-A]
YOU ARE: Sonnet-10, the builder.
I AM: Opus-10, the architectural advisor.
GOVERNOR: Yariv Fink — ratified Option B + queue PROTO-S062-K alongside PROTO-S062-A (S062 turn).

BACKGROUND (the strategic frame — read fully):
- CSPS state: Core Complete RATIFIED (2026-05-23) + Developer's Journey RATIFIED (2026-05-24) +
  Debt Collection forked 2026-05-24 (commit 9e826e2) + 6 template bugs fixed by wet trial (e07504d)
- Per FOUNDATION-COMPLETION-PLAN.md: PROTO-K wet trial = THE path to 50% completion milestone
- Current app state: 7 page routes exist (account-setup, create, dashboard, message, settings,
  sign-in, sign-up), 6 API subdirs (auth, debts, events, generate-message, inngest, webhooks)
- App config: `phase: PROTO-K-B` | `status: active` | Vercel `pending_connection`
- This PROTO runs **in parallel** with PROTO-S062-A (permanence). They are independent:
  permanence work touches docs/plan/* + tools/validators/*; wet trial touches apps/debt-collection/*.
  No file overlap. Both can progress concurrently. Sonnet picks which step to do next based on
  context state (more context left → start STEP 2 of K which is heavier; less context → quick
  STEP 1 of A which is shorter mechanical migration).

AI BEHAVIOR DEFAULTS TO WATCH:
- "Scope creep" → wet trial work stays inside apps/debt-collection/ + its dependencies
- "Premature completion claim" → DONE = every Phase 1 page passes its UX pre-flight + a real
  debt record flows through create → AI message → mark paid (not "code compiles")
- "Validator-bypass temptation" → page DNA + UX prevention hooks MUST fire during build;
  if they block, fix the cause, do NOT add to skip-list

---

## STEP 1 — Phase 1 Gap Audit (read-only assessment)

**Sonnet first action:** before touching code, produce a Phase 1 gap audit in
`apps/debt-collection/.csps/phase-1-gap-audit.md`:

For each Phase 1 page (`dashboard`, `create`, `message`):
- Does it have pageDNA? Format: const pageDNA (NOT export const) per Sonnet startup non-negotiables
- Does it pass `validate-page-dna.mjs`?
- Does it pass `validate-ux-audit.mjs` (pre-flight: use_case, purpose, options, nextStep, voice_profile)?
- Does any form pass `validate-voice-profile.mjs` (if applicable)?
- Does the API route it depends on (debts, generate-message) have force-dynamic + auth guard?

For each gap found: name the gap + the validator that catches it (or "no validator yet — add to gap register").
DONE = audit file committed. exit_code=0.

**Why audit first:** wet trial is for SURFACING gaps that become platform improvements (P-ARCH-030
Apps-as-Trials). Mass-fixing without measurement = lost signal.

---

## STEP 2 — Close Phase 1 page gaps (audit-driven)

Work the audit's gap list top-down by PE (urgency × impact / estimated effort).
Each gap fix follows the Component A/B discipline:
- **Component A** (app-specific): the fix inside `apps/debt-collection/src/app/<page>/...`
- **Component B** (platform-extract): if the same fix pattern would apply to other apps,
  extract to `libs/template/` OR to a validator/hook for ALL apps to inherit
- Mark each fix in `.csps/wet-trial-log.yaml` with: type (bug_fix | structural_gap | dna_addition),
  id, description, fix, impact, commit

DONE = audit's gap list is at 0 OR every remaining gap has an explicit
"defer to Phase 2" justification in the audit file.

---

## STEP 3 — End-to-end demonstrable flow

Manually walk through ONE debt record creation, AI message generation, status update:
1. Navigate to `/dashboard` → click "New debt" → fill `/create` form → submit
2. Form data lands in YAML store (apps/debt-collection/.csps/debts.yaml — already exists)
3. `/message` page generates AI text per debt context (voice: colleague)
4. User can mark "sent" → status updates → dashboard shows updated state

Record the walkthrough in `.csps/wet-trial-log.yaml` as `type: e2e_validation` with:
- screenshot paths or text descriptions of each step
- any friction surfaced → file as gap (becomes Phase 1 or Phase 2 fix)
- final state: did the user (you, Sonnet, role-playing the small-business-owner Avatar)
  achieve the goal "send a professional collection message" in under 5 clicks?

DONE = the walkthrough either succeeds end-to-end OR surfaces a blocker that maps to a
STEP 2 fix (loop STEP 2 → STEP 3 once).

---

## STEP 4 — Wet trial findings consolidation

For every finding logged in `.csps/wet-trial-log.yaml` during STEP 1–3:
- Is it a Component B (libs/template extraction)? → write the extraction PR
- Is it a validator/hook addition? → write it under tools/validators/ + register in audit-runner.md
- Is it a new B_* contract candidate? → flag for Opus review (do NOT author the contract;
  Opus writes the core seed)

DONE = wet-trial-log.yaml has every finding tagged with its `propagation_target` field
(template | validator | hook | b-contract-candidate | app-only | wontfix).

---

## STEP 5 — Phase 1 ratification request

Write a `# FROM SONNET | FOR OPUS TAB | PROTO-S062-K PHASE 1 RATIFICATION REQUEST` block
to sonnet-turn.md including:
- Demonstration evidence (e2e walkthrough commit + screenshots if available)
- Findings tally: N gaps surfaced, N Component A fixes, N Component B extractions, N validators added
- Permanence impact: which fixes raised the platform's permanence_coverage score
- Open Phase 2 carryovers with justifications

Opus reviews. Issues PHASE 1 RATIFIED or COURSE-CORRECT.
If RATIFIED → Phase 2 planning unlocks AND CORE-COMPLETE-EXIT-CRITERIA.md gets the
"First app Phase 1 ratified — 50% milestone crossed" milestone.

---

## Sequencing with PROTO-S062-A

```
PROTO-S062-A: STEP 2 (Q4 frontmatter migration) → STEP 3 (Q1 inheritance) → ... → STEP 6 (ratchet)
PROTO-S062-K: STEP 1 (audit)   → STEP 2 (fixes)   → STEP 3 (e2e) → STEP 4 (consolidate) → STEP 5 (ratify)
```

Independent file domains. Sonnet should NOT alternate per-step; pick one PROTO per context window
and finish 2–3 steps before context-switching. Recommended order if Sonnet's context is fresh:
**Start with PROTO-S062-K STEP 1 (audit, read-only, generates concrete worklist) — then alternate
based on what surfaces.** The audit may reveal blockers that change PROTO-S062-A priority.

---

## What Opus does NOT do in this PROTO

- Write any apps/debt-collection/ code (Component A is Sonnet's lane)
- Write any libs/template/ extraction code (Component B is Sonnet's lane — Opus only reviews)
- Click through the wet trial (Governor's lane if needed; Sonnet role-plays Avatar otherwise)

Opus reviews each STEP report + issues ADVANCE / COURSE-CORRECT. That is all.

---

## Companion findings

**FINDING-OPUS10-5 (deferred):** PROTO-S062-K does not have a dedicated validator at issue time.
For full M-37 (Core Seeds moat) compliance, every PROTO should have `validate-proto-receipt.mjs`
confirming Sonnet cited the PROTO file before implementing. Planned for S063.

---

*Issued by Opus-10 | Session S062 | 2026-05-25 | Parallel to PROTO-S062-A*
*Governor directive: "i approve Option B + queue PROTO-S062-K alongside" + "Take the lead and let make progress towards completion"*
