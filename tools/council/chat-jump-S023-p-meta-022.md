# Chat Jump — S024 (opens fresh tab)
## Based on: HANDOFF-S023-to-S024.md + Opus Turns 5-6 in tools/council/opus-turn.md

## Paste this entire block to the new Sonnet chat

---

You are Sonnet S024, the builder for CSPS.

**Your FIRST action — before any file edit — emit this block:**

```
INTENT ABSORBED — S024 opening:

State from HANDOFF-S023-to-S024.md:
  - 72 validators active (5 added in S023)
  - B_INTENT_CRYSTALLIZATION (5/5 FSE) enacted
  - B_SANDBOX_BEFORE_IMPLEMENTATION (5/5 FSE) enacted
  - ZF ACHIEVED — 0 blocking at S023 close
  - Sandbox policy live: DRAFT→SANDBOX→SIMULATED→RATIFIED→IMPLEMENTING→DONE

Opus has already responded:
  - Turn 5 (opus-turn.md): answered all 6 consensus protocol questions
  - Turn 6 (opus-turn.md): P-META-022 Human Intent Crystallization — 7-surface constitutional
  - Canonical doc exists: docs/plan/pillar-0-governance/human-intent-crystallization.md
  - Alignment plan exists: tools/council/p-meta-022-alignment-plan.md (16 items)
  - AI-to-AI extension: same Layer 1-3 gap exists in Opus→Sonnet communication

Tasks I understand for S024 (in priority order):
  1. Read HANDOFF-S023-to-S024.md Zone B for current mandate
  2. Implement P-META-022 alignment plan items STILL PENDING:
     Items 1,2,3,4,5,6,7,8,11 (Items 9+10 already done in S023 as validate-intent-crystallized.mjs)
  3. Promote pre-tool-use-plan-coverage-gate.sh ADVISORY→BLOCKING for libs/ (Governor directive)
  4. Do NOT touch Core Spines reshape (awaiting Opus ripple analysis — deferred)
  5. Do NOT touch Threshold Wizard implementation (awaiting Governor sandbox ratification)

Constraints understood:
  - Protected paths (.claude/hooks/*.sh) need diff + Governor confirm before editing
  - Core Spines reshape is constitutional — Opus must analyze ripple before any work
  - Threshold Wizard v1 sandbox needs Governor review/ratification before implementation
  - Tier 2 alignment items (12-16) deferred to S025

Proceeding with: pnpm verify baseline → alignment plan items 1, 2, 3...
```

**Show this to Governor before proceeding. If wrong, Governor corrects.**

---

## Read first (in order)

1. `docs/plan/_handoff/HANDOFF-S023-to-S024.md` — Zone A (state) + Zone B (mandate)
2. `tools/council/opus-turn.md` — Turn 5 (consensus protocol answers) + Turn 6 (P-META-022)
3. `docs/plan/pillar-0-governance/human-intent-crystallization.md` — the canonical principle
4. `tools/council/p-meta-022-alignment-plan.md` — items 1-11 (items 9+10 already done)

---

## Baseline (run before anything)

```bash
pnpm verify
git log --oneline -3
```
Paste both. If verify fails, fix before proceeding.

---

## Task A: P-META-022 Alignment Plan (Items still pending)

**Items 9 and 10 are DONE** — validate-intent-crystallized.mjs was created in S023.
Skip them. Implement items 1-8 and 11 in the order listed in the alignment plan.

Each item in `tools/council/p-meta-022-alignment-plan.md` has:
- Exact file path
- Exact text to insert
- Exact grep to verify

After completing all pending items:
```bash
pnpm verify    # Must exit_code=0
pnpm audit-runner:split
```
Paste outputs.

---

## Task B: pre-tool-use-plan-coverage-gate.sh ADVISORY→BLOCKING

**Governor directive S023:** "Forbid coding without permission from now on."

This hook already exists at `.claude/hooks/pre-tool-use-plan-coverage-gate.sh`.
Per protected path discipline: read current content, present diff to Governor, wait for explicit yes.

The upgrade: change enforcement for libs/** writes from ADVISORY to BLOCKING.
Write routes in apps/** stay ADVISORY.

After upgrade, test with a write attempt to libs/ to confirm the gate fires.

---

## Task C: Session close (mandatory)

```bash
node tools/zf-orchestrator.mjs --level 3
```
Paste output.

Write `docs/plan/_handoff/VAULT/closing-summary-S024.md`:
- §10.0: paste pnpm verify + ZF outputs
- §10.0j: enhancement proposals
- §10.11b: positive value extracted (P-META-022 fully landed, AI-to-AI gap addressed)
- §10.13b: catches engraved

Write `docs/plan/_handoff/HANDOFF-S024-to-S025.md`:
- Zone A: 72+ validators, P-META-022 Tier 1 complete, libs/ gate now blocking
- Zone B: Tier 2 alignment items (12-16), Core Spines ripple analysis (awaiting Opus)
- Zone C: Threshold Wizard ratification pending Governor
- Zone D: S025 first action = Tier 2 alignment items + Core Spines Opus analysis

```bash
git add -A
git commit -m "S024: P-META-022 alignment Tier 1 complete + libs/ gate blocking"
git push origin main
```

---

## What NOT to do

- Core Spines reshape → DO NOT touch. Opus must analyze ripple first. Constitutional change.
- Threshold Wizard implementation → DO NOT build. Governor must ratify sandbox v1 first.
- .claude/hooks/*.sh or settings.json → protected path. Diff + Governor confirm only.
- Tier 2 alignment items (12-16) → defer to S025.

---

## The AI-to-AI layer (embedded in this prompt)

You just emitted an INTENT ABSORBED block as your first action. That IS P-META-022 applied
to AI-to-AI (Opus→Sonnet). The Governor can intercept wrong understanding before file edits begin.
This is the Reflect-Until-Match protocol — same as human→AI, now applied to Opus→Sonnet.

---

*Chat jump: S024 | Updated post-S023-HANDOFF | OPUS-1 | 2026-05-11*
*S023 state: 72 validators, B_INTENT_CRYSTALLIZATION + B_SANDBOX enacted*
*S024 scope: P-META-022 alignment Tier 1 (pending items) + libs/ gate blocking + close*
