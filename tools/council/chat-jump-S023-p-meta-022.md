# Chat Jump — S023 P-META-022 Implementation + Session Close

## Paste this entire block to the new Sonnet chat

---

You are Sonnet, the builder for the CSPS platform (CoreSights Platform Services).
You are opening a continuation of session S023.

**Before doing anything, run:**
```bash
pnpm verify
git log --oneline -3
```
Paste both outputs. If verify fails, fix it before proceeding.

---

## Your task this session

**Step 1: Read `tools/council/p-meta-022-alignment-plan.md`**
This file has 16 items. You are implementing **Tier 1 only (Items 1-10)**.
Each item has: file path + exact text to insert + grep verification.
Follow them in order. Verify each one with the grep command shown.

**What you are implementing:**
P-META-022 — Human Intent Crystallization. The constitutional principle that the gap between
what humans express and what they need is the default condition of all human-AI interaction.
Canonical document: `docs/plan/pillar-0-governance/human-intent-crystallization.md`

**Step 2: After Items 1-10, run:**
```bash
pnpm verify       # Must be exit_code=0
pnpm audit-runner:split
```
Paste both outputs.

**Step 3: Chat close (mandatory — do not skip)**

Run the full session close:
```bash
node tools/zf-orchestrator.mjs --level 3
```
Paste output.

Then write `docs/plan/_handoff/closing-summary-S023.md` covering:
- §10.0: pnpm verify output + ZF output (paste both)
- §10.0j: enhancement proposals from this session
- §10.11b: positive value extracted
- §10.13b: catches engraved

Then write `docs/plan/_handoff/VAULT/HANDOFF-S023-to-S024.md` covering:
- Zone A: current state (67 validators, P-META-022 Tier 1 implemented)
- Zone B: what was done this session
- Zone C: open items (Tier 2 of alignment plan, Tier 2 of P-META-022 brief)
- Zone D: first action for S024

Then:
```bash
git add -A
git commit -m "S023 close: P-META-022 Tier 1 alignment + session close"
git push origin main
```

---

## Files to read (in order)

1. `tools/council/p-meta-022-alignment-plan.md` — your implementation instructions
2. `docs/plan/pillar-0-governance/human-intent-crystallization.md` — the principle (read §1-§3 only)
3. `tools/council/opus-turn.md` Turn 6 addendum — Opus scope guidance

## What NOT to do

- Do not implement Tier 2 items (defer to S024)
- Do not edit `.claude/hooks/*.sh` or `.claude/settings.json` (protected path — needs Governor diff + confirm)
- Do not add scope beyond Items 1-10 + chat close

---

*Chat jump: S023 continuation | OPUS-1 output | 2026-05-11*
*Tier 1 + chat close = this session. Tier 2 = S024.*
