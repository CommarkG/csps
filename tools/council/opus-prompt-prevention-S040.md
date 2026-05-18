---
id: csps.council.opus-prompt-prevention-S040
name: opus-prompt-prevention-S040
description: "Comprehensive Opus prompt: six-persona prevention audit findings + Core Scopes framework + PRACE + inheritance blocking + all S040 ratifications. For Opus Turn 97."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S040
---

# Opus Prompt — Prevention Audit & Core Scopes Turn 97
## COPY BELOW THIS LINE TO OPUS TAB

---

```
[PROTOCOL: SROF-016 | STEP: 1 of 1 | MODE: REVIEW + RATIFY + DIRECT]

YOU ARE: OPUS-3 (Claude Opus), the architectural advisor for CSPS.
         You are in a separate Claude Code tab from Sonnet.
         You have no memory of previous sessions — read everything below before responding.

I AM: Yariv Fink (Governor). S040 was a massive session.
      Platform: github.com/CommarkG/csps | Last commit: d1e40b3
      Session: S040 (the longest session in CSPS history — closing now)

THIS IS THE SITUATION: S040 produced 15+ commits including:
  - PRACE ratified as moat M-27 (Permanent Recurring AI Contextual Enforcement)
  - CSPS PACK created (profile-registry.yaml — 7 AI behavior profiles with 4 parameters each)
  - CSPS consensus definition engraved (explore + consolidate + holistic + ripple)
  - Core Scopes framework created (3-scope prevention pipeline)
  - Council PROTOCOL.md updated with CSPS consensus
  - Inheritance blocking design completed (PI-034, S041 Sprint 2)
  - Habit Tracker App #2 built and pushed
  - B_ZERO_NAVIGATION_FOR_GOVERNOR ratified as constitutional

YOUR TASK: Review Section 1 (what was built). Answer Section 2 (6 SROF questions).
  Then produce Turn 97 directive for Sonnet (Section 3 items to implement in S041 Sprint 1).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — S040 RATIFICATIONS (read, confirm, or refine)

1A. PRACE = Permanent Recurring AI Contextual Enforcement — Constitutional, Moat M-27
  Every governance rule must answer: training default + satisfaction point + T1+T2+T3.
  File: docs/plan/pillar-0-governance/behavioral-contracts/B_PRACE.md
  Session-open.sh injected. AGENTS.md hard NO added. Memory file created.
  STATUS: 5/5 FSE. Needs P-META-027 in principles.yaml (OPEN-046).

1B. CSPS PACK — AI behavior profile registry
  7 profiles in profile-registry.yaml. Each: trigger + default + satisfaction_point + csps_override.
  Profiles: DEFAULT-ME-1/2/3 (enforcement), DEFAULT-R1/2/3/4 (development reasoning), DEFAULT-B1 (boundary)
  File: docs/plan/_handoff/VAULT/inner-ai-defaults/profile-registry.yaml
  STATUS: canonical source exists. Children (ai-profiling-triggers.yaml) not yet built.

1C. Core Scopes — Three-scope prevention framework
  Scope-1: Immediate Resolution | Scope-2: Ripple Response | Scope-3: Permanent Prevention
  6 mandatory locations: Plans, Implementation, Audits, Validation, Evolve, Session Close
  File: docs/plan/pillar-0-governance/core-scopes.md
  STATUS: defined. Not yet in gradual-build-plan.template.md or plan-creation-protocol.md.

1D. CSPS Consensus Definition — Now in PROTOCOL.md and vocabulary
  "NOT agreement. IS: exploring various points of view + consolidating into optimal path +
   considering holistic aspects + mapping ripple effects."
  Files: tools/council/PROTOCOL.md (updated) + L1-vocabulary.md

1E. Inheritance Blocking Design — PI-034
  Design in: tools/council/opus-inheritance-blocking-design-S040.md
  Mechanism: inheritance-registry.yaml + pre-tool-use-inheritance-guard.sh (BLOCKING exit 2)
  STATUS: design complete. Implementation = S041 Sprint 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 2 — SIX SROF QUESTIONS (answer all)

Q1 [Architecture — Core Scopes]: The three Core Scopes are defined but not yet wired into
  the two HOW WE PLAN documents: plan-creation-protocol.md and gradual-build-plan.template.md.
  Should both be updated with the Prevention Analysis section, or only gradual-build-plan?
  Priority rationale: gradual-build-plan is used more frequently.

Q2 [Enforcement — Prevention]: The six-persona audit found that B_STRUCTURAL_PREVENTION_DISCIPLINE
  (the meta-rule about prevention) has its T1 hook (post-stop-pcr-check.sh) as a STUB.
  The prevention rule is undefended. What's the S041 Sprint 1 directive for this specific gap?
  Should it be: (a) promote post-stop-pcr-check.sh to advisory minimum immediately, or
  (b) build a real PCR validator that checks if multi-option responses contain PCR blocks?

Q3 [Architecture — CSPS PACK]: The profile-registry.yaml is the canonical source.
  Its children need a sync mechanism (pnpm profiles:sync — OPEN-049).
  Is the architecture correct: registry → triggers.yaml → hook reads triggers.yaml → hook fires?
  Or should the hook read profile-registry.yaml directly (simpler but couples them)?

Q4 [Session — Harvesting]: The Governor declared the three-scope harvesting pipeline as mandatory
  after each session. Currently session close requires: HANDOFF + pnpm verify exit_code=0.
  Should the harvesting pipeline be added as a THIRD mandatory close requirement (alongside
  HANDOFF and verify), enforced by validate-handoff-completeness.mjs? Or a separate validator?

Q5 [PRACE — P-META-027]: PRACE needs to be formalized as P-META-027 in principles.yaml (OPEN-046).
  P-META-026 = planning-before-implementing. P-META-027 = PRACE.
  What is the minimum description for P-META-027 that distinguishes it from P-META-019
  (structural prevention)? The distinction: P-META-019 = fix structure not instance.
  P-META-027 = design enforcement around AI cognitive patterns (contextual, with reasoning).

Q6 [Inheritance — Blocking]: The inheritance-guard hook (PI-034) should block child edits
  with exit 2 (BLOCKING). But what about the playground HTML files at csps-playground.vercel.app?
  Those are a separate repo. Can the same blocking mechanism apply to static HTML trees,
  or does the playground need its own inheritance enforcement separate from the CSPS repo?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 3 — S041 SPRINT 1 DIRECTIVE (produce this for Sonnet)

Based on your SROF answers, produce a PROTO-022 directive for Sonnet covering:

Priority items for S041 Sprint 1 (first 2 hours):
A. P-META-027 (PRACE) in principles.yaml — single new principle entry
B. Core Scopes Prevention Analysis section in gradual-build-plan.template.md
C. Core Scopes [S1]/[S2]/[S3] tags added to opus-open-items.md format
D. post-stop-pcr-check.sh promoted from STUB to advisory minimum
E. Core Scopes added to session-open.sh PRACE block (T3 injection)

Format the directive as PROTO-022 following the SROF template format.
Include verification tail: pnpm verify exit_code=0 + show verify output.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 4 — PREVENTION AUDIT FINDINGS (six-persona — for your review)

Real data from S040 audit:
- 10 hooks marked week-4/S041 (deferred stubs)
- verify-hooks-functional.sh = STUB (reports all hooks as functional, always)
- audit_runner_full_pass = DEFERRED since S025 ("ships week-4" — week-4 never defined)
- 25 OPEN items still pending
- B_STRUCTURAL_PREVENTION_DISCIPLINE T1 hook (post-stop-pcr-check.sh) = STUB
- B_PCR_FOR_DECISIONS T1 = STUB (the PCR rule is not checked mechanically)
- 0 files in apps/ or libs/ have @csps-dna inheritance declarations

Critical prevention gap (Sonnet S040 audit finding):
"The prevention discipline itself (B_STRUCTURAL_PREVENTION_DISCIPLINE) is the undefended territory."
Translation: the rule that says "fix structure not instance" has no T1 that fires when structure is NOT fixed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALIGNMENT QUESTIONS:
AQ1: Do you have access to docs/plan/pillar-0-governance/core-scopes.md?
AQ2: Do you have access to docs/plan/_handoff/VAULT/inner-ai-defaults/profile-registry.yaml?
AQ3: Is this sufficient context for SROF questions Q1-Q6, or should Sonnet send the full
     gradual-build-plan.template.md content?

Sonnet, reporting S040 close state. Awaiting Turn 97 consolidated directive.
```
