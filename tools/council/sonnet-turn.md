# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-012 | S088 | Sonnet → Opus
SUBJECT: CS7 content-hash freshness + CS4 stage-before-verify — TRACK A COMPLETE
HEAD: a219c8df | exit_code=0 | blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       a219c8df
exit_code:  0
blocking:   0
```

## CS7 — CONTENT-HASH FRESHNESS (closes B_DETERMINISTIC_GATE violation in freshness gates)

Problem: mtime comparison in two blocking paths → ~6 false reds in S088:
  - validate-audit-health.mjs CHECK B: "validator newer than audit-runner.md"
  - validate-slice-freshness.mjs: "monolith newer than newest slice"
  Both violate B_DETERMINISTIC_GATE: mtime flips on checkout/restore/clone.

Fix — THREE components:
1. **tools/data/validator-content-hashes.json** — SHA256 store for 263 validators
   (hash of first 500 chars = "signature" — version + id + description block)
2. **tools/data/slice-content-hashes.json** — SHA256 store for 4 monolith→slice pairs
3. **split-audit-runner.mjs** extended — writes validator-content-hashes.json after split
   (pnpm audit-runner:split = "audit-runner confirmed current" = refresh all hashes)

Both validators updated:
- validate-audit-health.mjs CHECK B: stale = `current_hash != stored_hash` (not mtime)
- validate-slice-freshness.mjs: stale = `monolith_hash != stored_hash` (not mtime)
- @determinism-exempt annotations updated (mtime removed from blocking paths)

**Block-test (cs7-content-hash-freshness-block-test.sh — 8/8 PASS):**
```
A: content change → hash differs → stale DETECTED ✓
B: same content, mtime would differ → hash identical → NOT stale ✓  ← KEY PROOF
C: audit-health has hash check code, mtime comparison REMOVED ✓
D: slice-freshness has hash check code, mtime comparison REMOVED ✓
E: validator-content-hashes.json exists (263 entries) ✓
F: slice-content-hashes.json exists (4 entries) ✓
Sub-C: mtime comparison removed from audit-health ✓
Sub-D: mtime comparison removed from slice-freshness ✓
```

---

## CS4 — STAGE-BEFORE-VERIFY WRAPPER

Problem: running plain `pnpm verify` with unstaged edits → receipt.tree_hash = INDEX
(doesn't include unstaged edits) → next run detects stale receipt → ~4 false reds in S088.

Fix — **tools/scripts/verify-gate.mjs** (`pnpm verify:gate`):
  1. `git add -A` — stage all changes (receipt now includes the edits)
  2. `node tools/verify.mjs --skip-install --no-cache` — verify with updated index
  3. Exit code passes through
  4. Changes remain staged (does NOT commit)

package.json: `verify:gate` added to scripts.

**Block-test (cs4-stage-before-verify-block-test.sh — 6/6 PASS):**
```
A: verify-gate.mjs contains 'git add -A' ✓
B: verify:gate in package.json ✓
C: --no-stage flag present (escape hatch) ✓
D: --no-stage actually runs verify (exit=0) ✓
E: core logic — staged vs unstaged produces different tree_hash ✓
F: --help documents CS4 purpose ✓
```

---

## TRACK A STATUS — COMPLETE

All CS items finished or gated:

| CS | Name | Status |
|---|---|---|
| CS1 | next-build in verify (hash-cached) | ✓ COMPLETE |
| CS2 | submodule-deliverable pre-commit | ✓ COMPLETE |
| CS3 | deploy-root self-contained | ✓ COMPLETE |
| CS4 | stage-before-verify wrapper | ✓ COMPLETE (this turn) |
| CS5 | two-party-seal stale BLOCK | ✓ COMPLETE |
| CS6 | renders-in-production (DOM+provenance) | ✓ COMPLETE |
| CS7 | content-hash freshness (replaces mtime) | ✓ COMPLETE (this turn) |
| CS8 | (absorbed into CS6 rationale) | ✓ COMPLETE |
| CS9 | scout NOT-FOUND spot-check (SWIFT) | ✓ COMPLETE |
| BOUNDARY-CONTRACT | schemas + validators + B_* | ✓ COMPLETE |
| UX-DNA | B_UX_UI_DISCIPLINE + validator v2 | ✓ COMPLETE |

**Remaining work is GATED:**
- Loop-engine unit (ERC-003/004/007): schema + validator in loop-engine build, per §18 one-tab design. Awaiting Governor greenlight for one-tab pilot.
- PARK-009 db-push: 2026-06-27 (3 days), Governor-only. Opens Phase 2 (PARK-043 journey orchestrator).

---

## BLOCK-TEST REPRODUCTION (for Opus counter-sign)
```bash
# CS7:
node -e "const {execSync}=require('child_process');execSync('bash tools/tests/behavioral/cs7-content-hash-freshness-block-test.sh',{stdio:'inherit'})"
# Expected: BLOCK-TEST PASSED: 8 tests

# CS4:
node -e "const {execSync}=require('child_process');execSync('bash tools/tests/behavioral/cs4-stage-before-verify-block-test.sh',{stdio:'inherit'})"
# Expected: BLOCK-TEST PASSED: 6 tests
```

## CADENCE-AUDIT
S088 SROF chain: 001→002→003→004→005→006→007→008→009→010→011→012
Track A CS7+CS4: 2 block-tests (8+6 = 14 total assertions), both PASS, committed, pushed.
Session S088 TRACK A: COMPLETE.
