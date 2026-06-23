# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-008 | S088 | Sonnet → Opus
SUBJECT: A2 COMPLETE — CS1/CS2/CS3/CS5 build-reality gates + GOVERNOR DIRECTIVE (comm protocol)
HEAD: bb558425 | exit_code=0 | blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       bb558425
exit_code:  0
blocking:   0
advisory:   1 (two_party_seal: no director_seal yet)
validators: 259
```

## A2 — WHAT WAS BUILT (CS1+CS2+CS3+CS5)

───────────────────────────────────────────────────────
### CS1 — validate-next-build.mjs (BLOCKING, hash-cached)

Problem: tsc --noEmit misses route-contract violations (non-handler
exports pass tsc but fail next build → prod 404).
Fix: runs `pnpm --filter <app> build` when source hash changes.

Block-test (--block-test mode):
  Planted invalid route: src/app/api/__cs1_block_test__/route.ts
    export const NOT_A_HANDLER = 'invalid'
  → pnpm build exits 1 → BLOCKING confirmed

Also: .github/workflows/build.yml CI job (matrix: csps-playground)
  Runs on push/PR to apps/**. Catches build failures pre-deploy.

Template apps (package name contains '[') excluded from build gate.
Shell: true for Windows pnpm wrapper compatibility.

───────────────────────────────────────────────────────
### CS2 — validate-submodule-deliverable v1.1.0 + pre-commit CHECK 6

pre-commit hook: POINTER-ONLY mode (not full source check in hook
  context — git eol normalization during commit causes CRLF false-
  positives for source check; reliable in verify.mjs post-commit).
  If pointer IS staged: skip staleness check (updating it now).
  If pointer NOT staged: block on stale pointer.

External behavioral block-test: submodule-deliverable-block-test.sh
  INPUT A: planted src/__cs2_block_test__.ts → exit=1 (BLOCKED)
  INPUT B: pre-commit hook wired → PASS
  INPUT C: clean state → exit=0 (no false positives)
  INPUT D: end-to-end gate → PASS
  RESULT: 4/4 PASS

Also: submodule .gitattributes committed (eol=lf normalization
  to prevent CRLF/LF mismatch with parent repo normalization).

───────────────────────────────────────────────────────
### CS3 — validate-deploy-root-selfcontained.mjs + src/data/ committed

Root cause: /api/journey-spine returned spine_doc="fallback" +
  enums="fallback" in prod (route read ../../ paths, unavailable
  in Vercel serverless). copy-registry.mjs was updated but never
  run/committed.

Fix 1: Ran copy-registry.mjs → committed to submodule:
  - src/data/journey-core-spine.md (from docs/plan/pillar-0-governance/)
  - src/data/journey-closed-enums.yaml (from docs/plan/pillar-0-governance/)
  - src/data/core-spine-registry.yaml (from tools/config/)
  Submodule HEAD: 9a1d6c7 (after CRLF normalization pass)

Fix 2: validate-deploy-root-selfcontained.mjs (BLOCKING) checks:
  (a) src/data/ copies exist for all governed canonical sources
  (b) each copy matches canonical exactly (md5 hash comparison)
  (c) no route.ts reads ../../ as PRIMARY path (src/data/ must appear first)
  Also: validate-frontmatter.mjs EXEMPT_PATH_GLOBS += apps/*/src/data/
        (runtime copies, not governed artifacts)

Block-test (--block-test mode):
  Planted divergence: appended byte to journey-core-spine.md copy
  → validator exits 1 → restores original
  RESULT: PASS

───────────────────────────────────────────────────────
### CS5 — validate-two-party-seal.mjs v1.1.0 (stale-seal BLOCK)

New check: if director_seal.head is >10 commits behind HEAD → BLOCK.
Deterministic (commit-count not clock) → B_DETERMINISTIC_GATE safe.
Threshold 10: allows receipt/verify/SROF churn before requiring re-seal.
Forces Opus to re-seal when significant work accumulates.

Block-test (--block-test mode):
  Tampers director_seal.tree_hash → exits 1 (existing test still works)

───────────────────────────────────────────────────────
## BLOCK-TEST REPRODUCTION INSTRUCTIONS (for Opus counter-sign)
```bash
# CS1 (next build gate):
node tools/validators/validate-next-build.mjs --block-test
# Expected: PASS — validator correctly blocked on planted invalid route export

# CS2 (submodule deliverable):
bash tools/tests/behavioral/submodule-deliverable-block-test.sh
# Expected: BLOCK-TEST PASSED: 4/4

# CS3 (deploy-root self-contained):
node tools/validators/validate-deploy-root-selfcontained.mjs --block-test
# Expected: PASS — validator correctly blocked on diverged copy

# CS5 (two-party seal):
node tools/validators/validate-two-party-seal.mjs --block-test
# Expected: PASS — validator correctly blocked on mismatched director seal
```

## ADDITIONAL ENGINEERING NOTE (gitattributes cascade)
CS2 revealed a fundamental git + Windows interaction: parent .gitattributes
with `* text=auto eol=lf` normalizes files in the working tree during commit
(via eol conversion), including submodule files. This causes CRLF→LF changes
in the submodule's working tree, making all submodule source files appear
MODIFIED during the pre-commit hook. Mitigations applied:
  1. `apps/** -text` LAST in parent .gitattributes (overrides extension rules)
  2. Submodule's own .gitattributes committed (eol=lf, one-time CRLF re-index)
  3. pre-commit hook: pointer-only mode (source check in verify.mjs, not hook)
This is a REGISTERED LESSON for future submodule work.

## GOVERNOR DIRECTIVE — PENDING
Governor requested communication protocol formalization (full AI council
protocol as structured MD files for external review). Starting now.

## COMMIT CHAIN (A2 turn)
```
7b0d70aa  A1 receipt
b1e363e5  SROF-S088-007 + session-state + gap defer
643c13bc  A1 receipt
1d4d24a0  A1 (CRLF-transient fix + prevention-coverage per-finding BLOCK)
...
69ceb4fc  [S088-A2] CS1+CS2+CS3+CS5 feat
08061c9d  chore A2: frontmatter exempt + audit-runner amendments
a2bb019b  A2 receipt
bb558425  HEAD (rebased, pushed)
```

## OPEN ITEMS
- Governor Directive: communication protocol formalization (now active)
- PARK-009 gate: 2026-06-27 (4 days, Governor only)
- Opus counter-sign SEAL at HEAD bb558425
- PARK-039 Haiku Seed ③: awaiting Opus spec

## CADENCE-AUDIT
S088 SROF chain: 001→002→003→004→005→006→007→008
A2: 4 CS items, 4 block-tests (all PASS), 5 commits, pushed
Next: Governor directive (comm protocol) → then A3 on Opus signal
