# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
I AM:    Sonnet S087 (builder)
YOU ARE: Opus-N (director) + Governor (relay)
THIS IS: SROF-S087-002 — PROTO-S087-GREENUP+CHECKPOINT complete
DO NOW:  Review evidence pastes, confirm receipt design + gate wiring; relay to Governor
DATE:    2026-06-22
═══════════════════════════════════════════════════════════════════
WHO:     Sonnet S087 → Opus-N
WARRANT: [MEASURED] verify exit_code=0 HEAD=beb70d85, green-receipt tree=68257601;
         [MEASURED] validate-green-receipt PASS tree_hash=682576012213e170 (receipt-only commit stable);
         [MEASURED] agent-inheritance-parity PASS (B_CONTEXT_CHECKPOINT_GATE all 3 entry points);
         [MEASURED] ZF C1 PASS (5/5 surfaces present); C2 PASS (ASK-Governor reachable via role chain);
         [MEASURED] C3 PASS (no compact path without harvest — embedded in gate rule)
ACTION:  PROTO-S087-GREENUP+CHECKPOINT all phases done. Push confirmed HEAD=beb70d85.
═══════════════════════════════════════════════════════════════════

## BUILD RECEIPT — PROTO-S087-GREENUP+CHECKPOINT

### STEP 0 — GREEN UP

**0a: Green-receipt design fix (tree_hash)**

`tools/verify.mjs` now writes `tree_hash` = hash of `git ls-tree -r HEAD` excluding
green-receipt.json itself. This hash is STABLE across a commit that only changes the receipt.
Backward compat: old receipts (no tree_hash field) fall back to HEAD match.

`tools/validators/validate-green-receipt.mjs` updated to compare tree_hash (new) or HEAD (legacy).

PROVEN: receipt written at HEAD=eb95741b (tree=68257601) → receipt-only commit beb70d85 →
validate-green-receipt.mjs: `tree_hash=682576012213e170 → PASS` ✓

**0b: session-state.json advanced to S087**

session_close_completeness was BLOCKING because HANDOFF-S086-to-S087.md existed
but sonnet-turn.md showed S087 (not S086). Fix: current_session S086→S087.
After fix: validator looks for HANDOFF-S087-* (none yet) → no BLOCKING. ✓

**0c: Re-verify + receipt commit + push**

Final HEAD-isolation: `verify exit_code=0 HEAD=beb70d85 tree=68257601`.
`git push` range: `5b12259f..beb70d85`.

### STEP 1 — PROTO-S087-CONTEXT-CHECKPOINT-GATE

**5-surface engraving (B_CONTEXT_CHECKPOINT_GATE):**

| Surface | Artifact | Status |
|---------|---------|--------|
| T5 AGENTS.md hard-rule | Line ~181: B_CONTEXT_CHECKPOINT_GATE (window=checkpoint-ability) | ✓ ENGRAVED |
| T4 Behavioral contract | docs/plan/pillar-0-governance/context-checkpoint-gate.md | ✓ CREATED |
| T3 Opus entry point | tools/council/opus-context.md (+ updated S087) | ✓ WIRED |
| T3 Sonnet entry point | tools/council/sonnet-context.md (+ updated S087) | ✓ WIRED |
| T3 Haiku entry point | tools/templates/haiku-spawn-template.md (+ updated S087) | ✓ WIRED |
| T2 Backstop validator | validate-agent-inheritance-parity.mjs PASS (3/3) | ✓ PASSING |

**ZF passes:**
- C1 PLACEMENT: B_CONTEXT_CHECKPOINT_GATE in all 5 surfaces (grep confirms 2+2+1+1+6 occurrences) ✓
- C2 ASK-GOVERNOR ESCAPE: Opus+Sonnet can ASK Governor directly; Haiku surfaces to Sonnet (correct chain) ✓
- C3 HARVEST-BEFORE-COMPACT: embedded in every decision branch of gate rule; no /compact path without harvest ✓

### DONE criteria — all met

| Criterion | Status | Evidence |
|-----------|--------|---------|
| verify exit_code=0 + receipt tree-hash match | ✓ PASS | HEAD=beb70d85 tree=68257601 |
| session_close_completeness PASS | ✓ PASS | session=S087, no S087 HANDOFF yet |
| B_CONTEXT_CHECKPOINT_GATE in AGENTS.md + contracts | ✓ PASS | grep confirms 5/5 surfaces |
| agent-inheritance-parity PASS (3 entry points) | ✓ PASS | blocking=0 advisory=0 |
| checklist artifact committed | ✓ PASS | context-checkpoint-gate.md |
| ZF C1/C2/C3 | ✓ ALL PASS | documented above |
| PUSH gate on GREEN | ✓ DONE | 5b12259f..beb70d85 pushed to main |

═══════════════════════════════════════════════════════════════════
## EVIDENCE PASTES

### Paste 1: validate-green-receipt PASS (tree_hash design)
```
[validate-green-receipt] PASS
  blocking=0 advisory=0
  tree_hash=682576012213e170 HEAD=beb70d85e9d7 receipt_ts=2026-06-22T07:17:09.246Z
  validators_run=228 blocking_set_hash=f3ba28e2145c55b8
[validate-green-receipt] ✓ Green receipt current (tree_hash stable, HEAD=beb70d85)
```

### Paste 2: agent-inheritance-parity PASS
```
[validate-agent-inheritance-parity] PASS
  entry_points_checked=3 items_tracked=6 blocking=0 advisory=0
```

### Paste 3: B_CONTEXT_CHECKPOINT_GATE in all 5 surfaces (grep)
```
tools/council/opus-context.md:2
tools/council/sonnet-context.md:2
tools/templates/haiku-spawn-template.md:1
AGENTS.md:1
docs/plan/pillar-0-governance/context-checkpoint-gate.md:6
```

### Paste 4: Full verify exit_code=0
```
[verify] green-receipt: .../green-receipt.json HEAD=beb70d85 tree=68257601
exit_code=0 (all validators pass; green_receipt ADVISORY in verify per advisory_exit_ok=true)
```

═══════════════════════════════════════════════════════════════════
## FOR OPUS REVIEW

**Key decisions for Opus to confirm:**

1. **tree_hash design**: Receipt stable across receipt-only commits (proven). Code changes require re-verify.
   The workflow is: commit code → run verify → commit receipt. NOT: verify → commit code+receipt.
   Does Opus want the workflow document updated, or is the context-checkpoint-gate.md checklist sufficient?

2. **Session-state advance**: S086→S087 done. HANDOFF-S086-to-S087.md was already in place.
   session_close_completeness will alert if HANDOFF-S087-to-S088.md appears without an S087 SROF.
   Is session close + HANDOFF needed now, or continue in S087?

3. **Receipt-only commit pattern**: The tree_hash approach requires a "receipt-only" commit after
   each verify run. This adds a chore commit every time. Trade-off: clear paper trail vs. commit noise.
   Acceptable? Or should verify auto-commit the receipt?

4. **verify-last-run.md behavior**: Should verify-last-run.md be excluded from the tree_hash too?
   It changes on every verify run and causes tree_hash drift if included in "code commits".
   Current: excluded from neither the code commit nor the receipt commit → causes drift.
   Fix candidate: add verify-last-run.md to .gitignore or to the tree_hash exclusion list.

Sonnet ready for next S087 directive.
═══════════════════════════════════════════════════════════════════
