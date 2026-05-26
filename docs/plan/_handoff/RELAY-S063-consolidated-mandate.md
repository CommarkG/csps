---
id: csps.handoff.RELAY-S063-consolidated-mandate
name: RELAY-S063-consolidated-mandate
description: "Opus-10 S063 consolidated mandate — execute items 1-3 end-to-end, report when stuck OR ready for Opus. Supersedes RELAY-S063-open-opus.md."
type: handoff_files
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: handoff_files
session: S062
links:
  - docs/plan/_handoff/RELAY-S063-open-opus.md
  - tools/data/gap-recurrence-register.yaml
  - tools/config/unified-plan.yaml
---

# RELAY — Opus-10 Consolidated S063 Mandate

**Filed by:** Sonnet-10 (S062-C5, final turns) | **Supersedes:** RELAY-S063-open-opus.md

## Key shift from RELAY 19

Previous relay required per-step Opus ADVANCE. This mandate removes that:
- Items 1, 2, 3 execute end-to-end WITHOUT stopping for Opus ADVANCE
- Stop ONLY for genuine gate criteria (listed below)
- Continuous reporting to `tools/council/sonnet-turn.md` after each commit (3-line entry)

---

## S063 MANDATE — 3 ITEMS (execute in order, no ADVANCE needed for 1-3)

### Item 1: ADDRESS K=4 GAP (gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS) — MUST-FIRST

Build: `.claude/hooks/pre-commit-claim-validator-gate.sh`
- Source the exact pattern from `tools/data/gap-recurrence-register.yaml` → proposed_fix field
- Blocks commits with DONE/SEALED/COMPLETE/CLOSED/RATIFIED unless relevant close-validator has THIS-HEAD exit_code=0
- Relevant validators: validate-handoff-completeness / validate-permanence-coverage / validate-zf-cycle-format / validate-frontmatter

Behavioral test: `tools/tests/behavioral/done-claim-validator-gate-test.sh`
- INPUT A (claim message + failing validator) → exit=1
- INPUT B (claim message + passing validator) → exit=0

Register:
- AGENTS.md hard NO entry
- verify-hooks-functional.sh DECLARED_HOOKS array
- audit-runner.md slug (pre-commit-claim-validator-gate)

Update gap-recurrence-register.yaml:
- status: fix_committed
- structural_fix_committed: <commit SHA>
- behavioral_test_file: tools/tests/behavioral/done-claim-validator-gate-test.sh

**EAT YOUR OWN DOG FOOD:** The commit that adds this hook WILL contain the word "fix". Test the hook against that commit message before activation to ensure it doesn't false-positive on "fix".

---

### Item 2: BUILD R4 REASONING HOOK (pre-commit-describe-without-implement.sh)

Build: `.claude/hooks/pre-commit-describe-without-implement.sh`

Blocks: commits containing `/\b(Proposed fix|Structural fix candidate|Will fix|Planned fix)\b/i`
UNLESS:
- a follow-up commit referencing same finding_id lands within N=2 commits, OR
- explicit `defer-to-session: S<NNN>` appears in the commit body

Test + register + commit per Item 1 pattern.

---

### Item 3: BATCH-K PROTO BUILDS (6 items, in PE order)

Execute each as: author validator/hook → register in verify + audit-runner → commit → 3-line sonnet-turn report

1. PROTO-S063-FIVE-SURFACE-VALIDATOR — validate-five-surface.mjs
2. PROTO-S063-STRUCTURAL-FIX-VALIDATOR — validate-structural-fix.mjs
3. PROTO-S063-CORESPINE-T1-HOOK — pre-tool-use-corespine-check.sh
4. PROTO-S063-GOVERNOR-PROMPTS-VALIDATOR — validate-governor-prompts.mjs
5. PROTO-S063-GRADUAL-BUILD-ENFORCEMENT — validate-gradual-build.mjs + hook
6. PROTO-S063-TEMPLATE-CITATION-VALIDATOR — validate-template-citation.mjs

Use existing validators as templates. Each should follow the @csps-dna header pattern from any validator in `tools/validators/`.

---

## WHEN TO STOP AND ASK OPUS

- Borderline classification Sonnet cannot resolve (triage edge cases like S062 5b)
- Cross-spine impact (change touching GVRN + ARCH + VALD simultaneously)
- Structural disagreement (your root-cause reading differs from Opus's seed)
- New FINDING surfacing K=2+ not in register
- Mass commit (>10 files) — dry-run gate before applying
- RATIFICATION MOMENT (PROTO completion claim) — full ADVANCE required per gap_DONE_CLAIM

## WHEN TO JUST EXECUTE (no stop, no relay needed)

- Single-file edits with clear DONE criteria
- Validator/hook builds matching established patterns
- Mechanical text fixes, test scaffolding, documentation updates

---

## CONTINUOUS REPORTING DISCIPLINE

After each commit:
```
// Append to tools/council/sonnet-turn.md:
<commit_sha> | <what> | <next_planned>
```

When items 1+2+3 finish OR genuine gate hit: write full FROM SONNET block with status + open questions.

ASK OPUS format: write `ASK OPUS: <specific question>` to sonnet-turn.md, keep working on parallel items, return when answered.

---

## CARRY-FORWARDS (Governor lane — not Sonnet work)

- G1: 50% milestone cosign (CORE-COMPLETE-EXIT-CRITERIA.md "Co-signed pending")
- G2: Vercel connect (deploy-checklist.md ready)
- G3: Credential rotation scheduled 2026-05-28
- G4: Zero Friction 5 questions (S060 deferred)
- G5: DNA-Manifesto rewrite (Version C identified)

---

## TOKEN BUDGET DISCIPLINE

- `verify | tail -30` NOT full JSON
- `git add directory/` NOT per-file
- MAX 2 verify runs per logical chunk
- **70% warning:** wrap up current item before starting next
- **80% warning:** write handoff state, prepare for tab transfer
- **90% warning:** STOP immediately, write handoff, hand to next tab

---

## OPUS POSTURE FOR S063

Available for: borderline judgment, structural review, ratification moments.
NOT reviewing every step. Default = trust Sonnet's execution unless flagged.
If items 1-3 finish cleanly without asking → that is the win condition.
