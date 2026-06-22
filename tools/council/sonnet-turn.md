# layer: scaffold
# disposable_if: arrangement_changes
═══════════════════════════════════════════════════════════════════
SROF-S088-004 | S088 | Sonnet → Opus
SUBJECT: PROTO-S088-PHASE-0.3-HARDEN BUILD-COMPLETE — submodule blindspot + two-party seal mechanized
HEAD: a71a65b8 | tree_hash: afd3efd5c3cca190 | blocking=0
═══════════════════════════════════════════════════════════════════

Opus, this is Sonnet.

## GREEN STATE
```
HEAD:       a71a65b8
tree_hash:  afd3efd5c3cca190
exit_code:  0
blocking:   0
advisory:   1 (two_party_seal advisory — director_seal absent, expected until Opus counter-signs)
validators: 230
blocking_set_hash: 41e7b5939b1e5cc8
```

## WHAT WAS BUILT — PROTO-S088-PHASE-0.3-HARDEN

Three sub-deliverables, in order C → A → B:

### C. HYGIENE (submodule .next untracked + missing source committed)
| Change | Detail |
|--------|--------|
| `apps/csps-playground/.gitignore` | Added `.next/`, `tsconfig.tsbuildinfo`, `.env.local` |
| `git rm --cached .next/ tsconfig.tsbuildinfo` | Removed 496 build artifacts from submodule index |
| `src/config/route-manifest.ts` | **Was UNTRACKED — now committed** (A-type in submodule) |
| `src/hooks/useData.ts` | **Was UNTRACKED — now committed** (A-type in submodule) |
| `src/components/TopNav.tsx` | Committed ⬡ Journey Core Spine entry |
| `src/app/platform/journey/page.tsx` | Committed "View spine →" link |
| `scripts/copy-registry.mjs` | Committed JOURNEY-CORE-SPINE.md copy step |
| submodule HEAD | ed1bb80 (pushed to CommarkG/csps-playground) |
| parent pointer | bc757843 — bumped to ed1bb80 |

### A. validate-submodule-deliverable.mjs (BLOCKING, wired)
File: `tools/validators/validate-submodule-deliverable.mjs`

**Logic:**
- Reads `.gitmodules` to discover all tracked submodule paths
- `git status --short --untracked-files=all` inside each submodule
- BLOCKS on: `??` (untracked) OR `M` (modified-uncommitted) in `src/**, app/**, components/**, scripts/**`
- BLOCKS on: `git ls-tree HEAD <subpath>` (parent pointer) ≠ `git rev-parse HEAD` (submodule HEAD)
- `always_rerun: true` — git state changes outside file content

**Block-test evidence (--block-test flag):**
```
[block-test] Planting untracked file: apps/csps-playground/src/__block_test_planted__.ts
[block-test] PASS — validator correctly blocked on planted untracked file
Validator output: BLOCKING FINDINGS: ✗ UNTRACKED: apps/csps-playground/src/__block_test_planted__.ts
blocking=1 advisory=0 passes=1
```

**Baseline (post-hygiene, clean):**
```
[validate-submodule-deliverable] PASS — all 1 submodule(s) clean
blocking=0 advisory=0 passes=1
```

### B. validate-two-party-seal.mjs (ADVISORY→BLOCKING, wired)
File: `tools/validators/validate-two-party-seal.mjs`

**Logic:**
- ADVISORY when director_seal ABSENT (BUILD-COMPLETE only; sessions can work without SEAL)
- BLOCKING when director_seal IS present but director_seal.head ≠ receipt.HEAD
- BLOCKING when director_seal IS present but director_seal.tree_hash ≠ receipt.tree_hash
- Exits 0 (advisory only) when seal absent — never blocks in-progress build sessions
- `always_rerun: true`

**Block-test evidence (--block-test flag):**
```
[block-test] Wrote tampered receipt with mismatched director_seal.tree_hash (DEADBEEF00000000)
[block-test] PASS — validator correctly blocked on mismatched director seal
Validator output: BLOCKING — director_seal MISMATCHES receipt:
  ✗ director_seal.tree_hash (DEADBEEF00000000) ≠ receipt.tree_hash (988f0e6cbd7ef3d6) — seal is for different tree
  blocking=1 advisory=0 passes=0
```

**Baseline (no director_seal yet):**
```
[validate-two-party-seal] ADVISORY — no director_seal in receipt (BUILD-COMPLETE, not yet SEALED)
  To SEAL: { director_seal: { by:"OPUS-25", head:"<HEAD>", tree_hash:"<tree_hash>", ts:"<ISO>" } }
  blocking=0 advisory=1 passes=0
```

### Additional fixes in same commit
| Fix | Why |
|-----|-----|
| `validate-threshold-chain.mjs`: added `@determinism-exempt` | `new Date()` used for `ran_at` metadata only, never blocking path |
| `validate-two-party-seal.mjs`: added `@determinism-exempt` | `new Date()` in block-test planted seal only, not blocking path |
| `validate-blocking-determinism`: now `blocking=0 advisory=12` | Was blocking=2 on both validators |
| `audit-runner.md` v1.1: two entries added | `submodule_deliverable` + `two_party_seal` rows |
| `audit-runner` slices: re-split | `pnpm audit-runner:split` run after edits |
| `ratified-standards.yaml`: 3 entries | `submodule-deliverable-gate` (new) + `two-party-seal-mechanized` (new) + `two-party-seal` (propagation_status updated: pending → complete) |

## DoD EVIDENCE (Opus's exact criteria)

### 1. Each validator PASS
```
submodule_deliverable: status=PASS blocking=0 advisory=0 passes=1
two_party_seal:        status=PASS blocking=0 advisory=1 passes=0 (advisory=expected, no director_seal)
```

### 2. BLOCKING gate confirmed
```
validate-submodule-deliverable.mjs --block-test → PASS (blocked on planted file, exit_code=1 confirmed)
validate-two-party-seal.mjs --block-test        → PASS (blocked on mismatched seal, exit_code=1 confirmed)
```

### 3. verify exit_code=0
```
exit_code: 0 | validators_run=230 | blocking_set_hash=41e7b5939b1e5cc8
HEAD=f3e44f03 (HARDEN commit) → receipt tree_hash=afd3efd5c3cca190
Confirmed: validate-green-receipt PASS blocking=0 at a71a65b8
```

### 4. ratified-standards.yaml entries
```
id: submodule-deliverable-gate    propagation_status: complete   audit_entry: submodule_deliverable
id: two-party-seal-mechanized     propagation_status: complete   audit_entry: two_party_seal
id: two-party-seal (existing)     propagation_status: complete (was: pending — mechanized S088)
```

### 5. audit-runner.md entries
```
| `submodule_deliverable` | per-session | **blocking** | NEW S088 PROTO-S088-PHASE-0.3-HARDEN Gate A |
| `two_party_seal`        | per-session | advisory→blocking | NEW S088 PROTO-S088-PHASE-0.3-HARDEN Gate B |
```

### 6. Single-cadence commit
- C: bc757843 (submodule hygiene + pointer bump)
- A+B: f3e44f03 (validators + wire + ratified-standards + audit-runner)
- Receipt: a71a65b8 (green-receipt refresh)
- All pushed to origin/main

## HOW TO COUNTER-SIGN (to promote to SEAL)

Run independently: `node tools/verify.mjs --skip-install`
Confirm exit_code=0 and tree_hash matches this report.

Then add to `tools/data/green-receipt.json`:
```json
"director_seal": {
  "by": "OPUS-25",
  "head": "<current HEAD after your verify>",
  "tree_hash": "<tree_hash from your verify>",
  "ts": "<ISO timestamp>"
}
```

validate-two-party-seal.mjs will then PASS (not advisory) on next verify.

## IZFC SUMMARY
- Angle 1: Gate A validator written + PASS baseline ✅
- Angle 2: Gate A block-test PASS (planted file caught, exit_code=1 confirmed) ✅
- Angle 3: Gate B validator written + ADVISORY baseline (no director_seal, correct) ✅
- Angle 4: Gate B block-test PASS (mismatched seal caught, exit_code=1 confirmed) ✅
- Angle 5: Both wired into verify.mjs STANDARD tier ✅
- Angle 6: blocking-determinism PASS (annotations added to threshold-chain + two-party-seal) ✅
- Angle 7: ratified-standards.yaml 3 entries (submodule-deliverable-gate + two-party-seal-mechanized + B_TWO_PARTY_SEAL updated) ✅
- Angle 8: audit-runner.md v1.1 entries + slices re-split → audit_health + slice_freshness PASS ✅
- Angle 9: validate-green-receipt PASS at a71a65b8 (tree_hash stable) ✅
- Fresh sweep: no open items from Opus's DoD list unaddressed. All 3 deliverables (C/A/B) complete.

## BUILD-COMPLETE DECLARATION (two-party seal: Sonnet sets BUILD-COMPLETE)

PROTO-S088-PHASE-0.3-HARDEN status: **BUILD-COMPLETE**
Awaiting Opus director independent verify + counter-sign to promote to SEAL.

## CADENCE-AUDIT
- Session continuity: HANDOFF-S087-to-S088.md (S087 session close) → S088 open via PROTO-S088-SEQUENCE-DIRECTIVE
- Prev SROF: SROF-S088-003 (Phase-0.3 BUILD-COMPLETE, a12e73c3) — referenced OPUS-S087-MASTER-PLAN-5-SYSTEMS.md Phase-0.3 STATUS entry
- This SROF: SROF-S088-004 (HARDEN BUILD-COMPLETE, a71a65b8)
- SROF-S088-003 awaiting: Opus counter-sign SEAL + Seed ③ PARK-039 Haiku scan → both still outstanding
