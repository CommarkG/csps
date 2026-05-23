---
id: SIA.SONNET-S051-FORK-BRIEF
name: SONNET-S051-FORK-BRIEF
description: "Complete Sonnet brief for S051 — APP-001 fork + S050 close + key S051 priorities"
type: doc
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S051
core_spines: [GVRN, ARCH]
core_spine: GVRN
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.raw.RAW-20260521-DOC-001
  - vault.processing.PRO-20260521-DOC-002-ANALYSIS
  - SIA.SONNET-EXECUTION-BRIEF
context_question: "What does Sonnet need to execute for S051, starting with the APP-001 fork?"
context_quote: "PMI=5/5 confirmed. Fork authorized. Build begins now."
---

# Sonnet S051 — Fork Brief

> **READ FIRST:** For full session context, read `docs/SIA/SONNET-EXECUTION-BRIEF.md`.
> This file is S051-specific additions only.
> Latest commit at time of writing: 21bb1d1

---

## WHAT CHANGED SINCE LAST BRIEF

**APP-001 PMI=5/5 ratified.** Fork authorized.

Section 5 gates closed (Governor ratification S050):
- Onboarding 3 questions: role calibration + capture preference + "what slipped through the cracks?"
- 5 Homepage variants: V1 Sponge / V2 Auditor / V3 Ghostwriter / V4 Timeline / V5 Silo
- First-value moment: push notification "N captured while you were in your meeting" (no manual sorting)

**4 External documents absorbed** into vault (DOC-001 through DOC-004):
- Key relevant insight: The construction worker chunking example is the canonical description of how the Threshold parsing pipeline should work
- The 5 homepage variants are confirmed by two independent documents

**Vault created.** Full neuronal grid at `tools/vault/`:
- `tools/vault/raw/` — 4 raw documents (unchanged)
- `tools/vault/processing/` — 4 analysis files
- `tools/vault/concepts/` — 6 concept files
- `tools/vault/ai-conception/` — 8 behavioral entries

---

## S051 PRIORITIES (PE order)

**Priority 1 (pe=95): APP-001 Fork + Section 5 Build**

Fork `apps/template/` → `apps/app-001-voice-sorting/`

Section 5 implementation:
- Onboarding component: 3 questions (role, capture preference, first capture seed)
- Homepage 5 variants (as A/B test framework: V1 active by default for initial launch)
- Push notification infrastructure for first-value moment

**Priority 2 (pe=91): validate-activation-coverage BLOCKING**
Promote from advisory to blocking. AP-001 detector must enforce itself.

**Priority 3 (pe=90): behavioral-contracts shard execution**
57K/60K tokens — must shard before any new B_* contracts.
5 shards: behavioral-contracts-GVRN/AI/VALD/ARCH/OPER.md

**Priority 4 (pe=88): STT Correction System design**
Schema: per-user vocabulary map + per-contact domain dictionary + system-wide distortion registry.
Design only (vault concept exists at `tools/vault/concepts/SPEECH-TO-TEXT-CORRECTION-SYSTEM.md`).
ZModel schema for the three tables.

**Secondary (pe=82): A/B Testing Hub skeleton**
Experiment definition + segmentation + outcome tracking structure.

---

## EXEC-SESSION DIRECTIVE

```
[PROTOCOL: S051-FORK | STEPS: 1-5 BATCHED | MODE: exec-session]
YOU ARE: Sonnet, the builder in Claude Code VS Code tab.
I AM: OPUS-6 (Claude Opus), the architectural advisor.
THIS IS THE SITUATION: S050 closed. PMI=5/5 confirmed. Fork authorized.
  APP-001 Voice Sorting App — cognitive-offload-professional (Alex). Build now.
  Latest commit: 21bb1d1. Read docs/SIA/SONNET-EXECUTION-BRIEF.md for full context.

STEP 1: S050 HANDOFF + session close

Write docs/plan/_handoff/HANDOFF-S050-to-S051.md:
  Zone A: everything delivered in S050 (SIA docs, sacred file guard, AI Conception Vault
           8 entries, 4 external documents absorbed, ZF discipline engraved, PMI=5/5 ratified)
  Zone B: S051 mandate (APP-001 fork, behavioral-contracts shard, validate-activation-coverage,
           STT schema design)
  ALIGNMENT QUESTIONS (≥3): include APP-001 fork readiness, shard execution scope, STT V1 vs V2

Update tools/council/csps-context.md: last_updated_session: S051

Commit: "close: S050 HANDOFF + session open S051"

STEP 2: APP-001 Fork

Fork apps/template/ → apps/app-001-voice-sorting/
  - Copy all template files
  - Update package.json: name → @csps/app-001-voice-sorting
  - Update README with: APP-001, persona: Alex (cognitive-offload-professional)
  - Add DNA block with @csps-app-001 identifier
  - Update unified-plan.yaml: APP-001-PLAN status → implementing

Do NOT build the UI yet — fork only.

pnpm verify: exit_code=0
Commit: "feat: APP-001 fork from apps/template — cognitive-offload-professional"

STEP 3: APP-001 Section 5 — Onboarding + Homepage skeleton

Create apps/app-001-voice-sorting/src/app/onboarding/page.tsx:
  3-question flow:
    Q1: "What describes your work best?" (role options: Consultant / Founder / Manager / Other)
    Q2: "How do you usually capture ideas?" (Voice-first / Text-first / Doesn't matter)
    Q3: "What's one thing you want to stop worrying about?" (free-form voice input)
  Save responses to user profile
  Route to homepage after completion

Create apps/app-001-voice-sorting/src/app/page.tsx (homepage V1: The Sponge):
  Default variant: V1 — single large mic button, centered, minimal
  Private/Business mode toggle (visible but not required)
  Note: V1 is the default; A/B testing infrastructure will enable variant switching later

Push notification placeholder: add a database trigger or job that fires when N captures are
  processed: surface message "N things sorted while you were away"
  (Stub is sufficient — full push infra in V2)

pnpm --filter @csps/app-001-voice-sorting build → must pass
pnpm verify: exit_code=0
Commit: "feat: APP-001 Section 5 — onboarding + homepage V1 (Sponge)"

STEP 4: validate-activation-coverage BLOCKING

Read tools/validators/validate-activation-coverage.mjs.
Promote from advisory to BLOCKING: contracts with 0 activation surfaces → exit 1.
Add exempt field: activation_exempt: true + activation_exempt_reason: (for intentionally T3-only).
Run pnpm verify — if >5 failures, add them to exempt list with tracking notes.
Commit: "fix: validate-activation-coverage BLOCKING — AP-001 detector enforcing itself"

STEP 5: behavioral-contracts shard execution

Read docs/plan/pillar-0-governance/behavioral-contracts.md (~57K tokens).
Create 5 shard files (behavioral-contracts-GVRN/AI/VALD/ARCH/OPER.md):
  Each shard: frontmatter + B_* contracts belonging to that spine
  Main file becomes: index + cross-refs only
Update tools/generators/split-behavioral-contracts.mjs to generate shards
Run: pnpm contracts:split — confirm all 64 contracts present across shards
pnpm verify: exit_code=0
Commit: "feat: behavioral-contracts shard execution — 5-spine split (57K → distributed)"

SINGLE REPORT FORMAT:
Opus, this is Sonnet. S051 fork done. Steps 1-5 batched.
Step 1 commit: [sha] — S050 HANDOFF
Step 2 commit: [sha] — APP-001 fork
Step 3 commit: [sha] — Section 5 onboarding + homepage
Step 4 commit: [sha] — activation-coverage BLOCKING
Step 5 commit: [sha] — behavioral-contracts shard
pnpm verify: exit_code=[N]
build: [pass/fail]
PE-SUGGESTION: [top non-done item]
Questions: (numbered, blockers only)
```

---

*CSPS | Sonnet S051 Fork Brief | S050 closing | OPUS-6*
