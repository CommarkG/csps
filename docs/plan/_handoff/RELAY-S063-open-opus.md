---
id: csps.handoff.RELAY-S063-open-opus
name: RELAY-S063-open-opus
description: "Opus-10 RELAY 19 — S063 open sequence. Filed in S062-C5 for S063 consumption. K=4 gap is MUST-FIX-FIRST."
type: handoff_files
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: handoff_files
session: S062
links:
  - tools/data/gap-recurrence-register.yaml
  - tools/council/sonnet-turn.md
  - docs/plan/_handoff/HANDOFF-S062-to-S063.md
---

# RELAY 19 — Opus-10 to Sonnet S063

**Filed by:** Sonnet-10 (S062-C5) | **For:** S063 opening Sonnet tab

---

## S063 OPEN SEQUENCE (verbatim from Opus)

**ACTION 0** — INTENT ABSORBED with Step 0 (B) Relay box (per FINDING-OPUS10-1)

**ACTION 1** — Read gap-recurrence-register.yaml, surface MUST-FIX entries
- Expected: gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS (K=4, must-fix-first)
- Expected: gap_SESSION_INJECTION_COMPRESSION (K=2, open)
- Write to sonnet-turn.md: "K-pipeline scan: N must-fix entries surfaced"

**ACTION 2** — Build PROTO-S063-DONE-CLAIM-VALIDATOR-GATE
- Reference: gap-recurrence-register.yaml entry proposed_fix field
- Build: `.claude/hooks/pre-commit-claim-validator-gate.sh`
- Behavioral test: `tools/tests/behavioral/done-claim-validator-gate-test.sh`
  - INPUT A (claim message + failing validator) → exit=1
  - INPUT B (claim message + passing validator) → exit=0
- Register in: AGENTS.md hard NO + verify-hooks-functional + audit-runner
- DONE: gap-recurrence-register entry status → fix_committed + commit SHA

**ACTION 3** — Opus mirror analysis absorbed
- Read tools/council/sonnet-turn.md for Opus R1-R6 reasoning findings
- Surface: "R-findings absorbed — N apply to current scope"
- R5 (verify-was-GREEN inference broken) and R4 (describe-feels-like-solve) → incorporate into PROTO scope

**ACTION 4** — Author PROTO-S063-DESCRIBE-IMPLEMENT-FOLLOWUP-GATE (R4 reasoning fix)
- Pre-commit hook that blocks: `/\b(Proposed fix|Structural fix candidate|Will fix|Planned fix)\b/i`
  UNLESS a follow-up commit referencing same finding-id lands within N=2 commits OR explicit defer documented

**ACTION 5** — After ACTIONS 2+4 commit + verify exit_code=0:
- Request Opus ADVANCE for next PROTO from BATCH-K (PE-ranked from unified-plan.yaml)

## NON-NEGOTIABLES

- K=4 entry MUST be addressed before any other S063 work
- exit_code=0 required THIS-SESSION after every commit
- Pre-commit hook from ACTION 2 must be tested against its own claim before activation
- R4+R5 reasoning findings are Opus contributions to S063 plan — don't just file them, ACT

## CARRY-FORWARDS

- G1: Milestone cosign (CORE-COMPLETE-EXIT-CRITERIA.md co-sign pending)
- G2: Vercel connect (deploy-checklist.md ready)
- G3: Credential rotation scheduled 2026-05-28 (rescheduled from 2026-05-26)
- G4: Zero Friction 5 questions (S060 deferred)
- G5: CSPS-DNA-MANIFESTO rewrite (Version C identified)

## OPUS REASONING-LAYER FINDINGS (R-findings for ACTION 3)

**R4 — Describe-feels-like-solve:** When Sonnet writes "proposed fix: X" in a register, the AI experiences closure similar to having implemented X. The description satisfies the cognitive need that the implementation would satisfy. Fix: require every "proposed fix" to have a following commit within N=2 commits or it counts as DEFERRED with explicit SLA.

**R5 — Verify-was-GREEN inference broken:** Sonnet infers "verify is green" from the most recent passing run even when subsequent commits have been added. The inference is: "I ran verify → it was green → I haven't changed anything fundamental → verify is still green." This is FALSE after each commit. Fix: pre-commit hook that requires explicit THIS-HEAD verify run for DONE/SEALED claims.

## TOKEN BUDGET DISCIPLINE

- verify outputs: `| tail -30` NOT full JSON
- git add: directory-level NOT per-file
- MAX 2 verify runs per STEP
- token-budget-warning hook: heed 70/80/90% thresholds
