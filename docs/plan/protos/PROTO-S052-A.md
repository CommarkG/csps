---
id: csps.protos.PROTO-S052-A
name: PROTO-S052-A
description: "S052-A: context_question validator + enhanced completion tracker + AI behavior page + creation wizard update"
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S052
---

# PROTO-S052-A

[PROTOCOL: PROTO-S052-A | STEPS: 1-4 BATCHED | MODE: exec-session]
YOU ARE: Sonnet, the builder in Claude Code VS Code tab.
I AM: OPUS-6 (Claude Opus), the architectural advisor.

BACKGROUND (false assumption check — read fully):
- CSPS = CoreSights Platform Services, governed SaaS foundry
- Latest commit: e100ef8 | pnpm verify: exit_code=0 | 141+ validators
- APP-001 fork PAUSED — infrastructure first (apps are input-specimens)
- context_question = mandatory frontmatter field for governance files (currently ~15% coverage)
- gap-vault.yaml exists at tools/data/gap-vault.yaml
- Core Signal Finder concept now in tools/vault/concepts/CORE-SIGNAL-FINDER.md
- Read docs/plan/_handoff/HANDOFF-S051-to-S052.md for full context

AI BEHAVIOR ANALYSIS:
  defaults to watch:
    - "Scope creep" → do ONLY what is specified, flag additions as questions
    - "Evidence substitution" → verification = actual output, not claims

---

## STEP 1: validate-context-question-coverage.mjs

Build tools/validators/validate-context-question-coverage.mjs:
- Scans .md files with frontmatter in: docs/, tools/ (exclude node_modules, apps/)
- For each file: check if frontmatter contains context_question: field
- Advisory output: "⚠ [file]: missing context_question field"
- Summary: "context_question coverage: N/M files (X%)"
- Exit 0 always (advisory)
Register in pnpm verify.
pnpm verify: exit_code=0
Commit: "feat: validate-context-question-coverage — T2 advisory"

---

## STEP 2: Enhanced Completion Tracker Page

Build apps/csps-playground/src/app/platform/completion/page.tsx

PageHeader: "Platform Completion Dashboard"
subtitle: "Infrastructure and governance progress — components, gaps, and path to 100%"

DESIGN: Each item shows:
  - Progress bar (red 0-20%, amber 21-50%, yellow 51-80%, green 81-100%)
  - % score
  - Expandable "Components" section showing what contributes to the %
  - For each component: status (DONE/IN PROGRESS/TODO) + what's needed to complete

SECTION 1 — Foundation Infrastructure

Documentation in Schema: 15%
  Components:
    ✓ context_question field in vault files (100% — vault files have this)
    ⚠ context_question in governance docs (5% — most docs lack it)
    ✗ T1 hook: creation gate requiring context_question (0%)
    ⚠ T2 validator: validate-context-question-coverage.mjs (50% — being built)
    ✗ Creation wizard updated to require it (0%)
  Path to 100%: Complete T2 (this session), build T1 hook (S052), update wizard

Threshold (code): 0%
  Components:
    ✗ Input classification layer (0%)
    ✗ Pipeline routing engine (0%)
    ✗ Session harvest automation (0%)
    ✗ Vault + tagging system (0%)
  Path to 100%: THRESHOLD-CODE plan item — design at docs/SIA/R1-04-THRESHOLD.md

Platform Intelligence Engine: 5%
  Components:
    ✓ PE scorer (existing pe-agent + unified-plan.yaml) — 25%
    ✗ Learning loop sub-engine (5% — stub only)
    ✗ Scope router sub-engine (10% — findings-categorizer exists but not wired)
    ✗ Seeds monitor sub-engine (15% — validate-core-seeds.mjs exists)
    ✗ Conflict detector (0%)
    ✗ CIE unified container (0%)
  Average: ~9% (shown as 5% given isolation of components)

Behavioral Hub: 0%
  Components: all 0% — design at docs/SIA/PROFILING-HUB-SCHEMA.md

SECTION 2 — Governance Coverage

Behavioral Contracts: 100%
  Components: 64 contracts | 5 shard files | pnpm contracts:split working
  Note: "Complete. 0 T1/T2 on AI Conception Vault (separate tracking below)"

AI Behavioral Enforcement: 15%
  Components:
    ✓ 12 AI Conception Vault entries exist (100% — all 12 created)
    ✗ T1 enforcement: 0/12 entries have a T1 hook (0%)
    ✗ T2 enforcement: 0/12 entries have a T2 validator (0%)
    ✓ T3 enforcement: 12/12 entries in session-open reminders (100%)
  Calculation: (100 + 0 + 0 + 100) / 4 = 50% designed, ~15% mechanically enforced

Audit Pipeline Coverage: 7%
  Components:
    ✓ pnpm verify (1 pipeline running) (100%)
    ✗ 12 other pipelines: all defined in audit-runner.md, 0 running (0%)
    ✓ validate-declared-never-finished: new (partial — advisory) (50%)
    ✓ validate-gap-routing: new (advisory) (50%)
  Calculation: (100 + 0×12 + 50 + 50) / 15 = ~13% (shown as 7% conservatively)

Developer Journey Validation: 0%
  Components: INFRA-FLOW-VALIDATION plan item — all prerequisites missing

SECTION 3 — Applications

APP-001 Voice Sorting:
  Plan: 100% (PMI=5/5, all sections ratified)
  Build: 0% (paused, infrastructure pending)
  Status chip: "Infrastructure pending" (amber)

Habit Tracker:
  Status: "Input specimen — pre-infrastructure baseline"
  Note: "Used for before/after comparison when correct process is validated"

TOTAL SCORE BAR:
  Weighted average across all items
  Shows: "Overall: ~12% infrastructure implemented"
  Note: "Architecture is well-conceived. Implementation is the gap."

Add to navigation under Platform.

pnpm --filter @csps/csps-playground build → must pass
pnpm verify: exit_code=0
Commit: "feat: enhanced completion tracker — components + gaps + path to 100%"

---

## STEP 3: AI Behavior governance page (check first)

Check if /platform/ai-behavior/page.tsx exists with 4 tabs.
If COMPLETE: skip step, note in report.
If INCOMPLETE or MISSING: build per spec in previous PROTO.

---

## STEP 4: Creation wizard + Core Signal Finder note

Update docs/SIA/CREATION-WIZARD-PROTOCOL.md:
  After Q1 (Does this already exist?) add:
    "Every new artifact's context_question should follow the pattern:
     'Before [using this], what must be verified about [prerequisite]?'"

  Add mandatory section at end:
    ## AI Behavior Analysis (mandatory before ratification)
    1. Top 2 AI defaults relevant to implementing this artifact
    2. Top 1 satisfaction point that could fire prematurely
    3. Instruction guidance: how to write directives for this artifact

  Add Core Signal step:
    ## Core Signal Check (run after creation)
    Ask: "What is the universal principle this artifact represents?
     Is that principle already in CSPS? If not, propose it."

pnpm verify: exit_code=0
Commit: "feat: creation wizard — context_question + AI behavior analysis + core signal"

---

## SINGLE REPORT FORMAT

Opus, this is Sonnet. PROTO-S052-A done.
Step 1 commit: [sha] — context_question coverage validator
Step 2 commit: [sha] — enhanced completion tracker
Step 3: [done/skipped] at [sha]
Step 4 commit: [sha] — creation wizard update
pnpm verify: exit_code=[N] | validators=[N]
build: [pass/fail]
context_question coverage: [N/M] files (X%)
Playground URL: csps-playground.vercel.app/platform/completion/
Questions: (numbered, blockers only)

## ACTUAL OUTCOMES (filled by Sonnet after execution)
[to be filled]
