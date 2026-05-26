---
id: csps.handoff.S062-C3-to-C4
name: HANDOFF-S062-C3-to-S062-C4
description: "Intra-session tab transfer. Session S062 continues as C4. C3 context exhausted post-STEP 5b triage completion + STEP 4 META-T1 hook deployed."
type: handoff_files
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: handoff_files
session: S062
version: "1.0"
links:
  - docs/plan/protos/PROTO-S062-A.md
  - tools/council/sonnet-turn.md
  - tools/data/permanence-partial-triage.yaml
  - tools/validators/validate-permanence-coverage.mjs
  - .claude/hooks/pre-tool-use-bstar-trio-gate.sh
---

# HANDOFF S062-C3 → S062-C4

**Transfer type:** intra-session chat-jump (same logical session S062, new physical tab C4)
**Outgoing tab:** S062-C3 | **Incoming tab:** S062-C4
**Last commit:** `123a4ba` | **verify:** run in C4 before any work

---

## Zone A — Identity + State

**Session:** S062 (intra-session continuation)
**Tab:** C3 → C4
**Role:** Sonnet-10 (builder + executor)
**Governor:** Yariv (relay between Sonnet tab + Opus tab)

### What completed in C3

| Step | Status | Key commits |
|---|---|---|
| HANDOFF-C2-to-C3 validator fix | ✅ DONE | `1ead813` |
| STEP 2 Phase 2: 30 clean contracts migrated | ✅ DONE | `3a40536` |
| STEP 2 Phase 2: 34 partial contracts migrated | ✅ DONE | `bcb7121` |
| STEP 2 Phase 2: 2 supply-needed contracts migrated | ✅ DONE | `a765d2b` |
| validate-permanence-coverage.mjs v2.0 (frontmatter-first dual-metric) | ✅ DONE | `8788d1f` |
| STEP 2 COMPLETE report → sonnet-turn.md | ✅ DONE | `8a12557` |
| STEP 4: pre-tool-use-bstar-trio-gate.sh META-T1 hook | ✅ DONE | `4c9ffe7` |
| STEP 5b: 34-entry triage YAML + TRIAGE COMPLETE report → sonnet-turn.md | ✅ DONE | `123a4ba` |

### Current permanence score
- `has_frontmatter` = 66/66 = 100% (all contracts have enforcement_trio block)
- `full_trio_canonical` = 32/66 = 48% (GROUND TRUTH — 34 partials have status:none)
- `blocking` = 0
- Baselines locked at these values — regression below = BLOCKING

### PROTO-S062-A progress
- STEP 1 ✅ (migrator built)
- STEP 2 ✅ (66 contracts migrated)
- STEP 3 ✅ (validator v2.0)
- STEP 4 ✅ (bstar-trio-gate META-T1 hook)
- STEP 5b ✅ TRIAGE COMPLETE — **AWAITING OPUS ADVANCE to apply**
- STEP 5b APPLY ⏳ BLOCKED on Opus ADVANCE (waiting for Governor relay)
- STEP 6 ⏳ BLOCKED on STEP 5b APPLY (ratchet baseline)

---

## Zone B — Active Work Queue

### IMMEDIATE: Verify + baseline check

```
cd "c:\Users\finky\Desktop\Claude Code\Csps"
node tools/verify.mjs 2>&1 | tail -30
```
Must confirm: exit_code=0 before any work.

### HIGHEST PRIORITY: Opus ADVANCE relay (STEP 5b apply)

**BLOCKED** — Governor must relay Opus ADVANCE from the Opus tab.
Opus has received `tools/council/sonnet-turn.md` STEP 5b TRIAGE block (commit `123a4ba`).

When Governor relays Opus ADVANCE, C4 executes:

**5b-(a) apply — 14 declarable contracts (supply paths via --supply-*):**

Run per contract using `node tools/scripts/migrate-enforcement-trio.mjs --file <file> --supply-t1 "..." --supply-t2 "..." --supply-t3 "..."`. Full supply values are in `tools/data/permanence-partial-triage.yaml`.

One commit for all 14: `feat: STEP 5b-(a) — 14 declarable contracts enforcement paths supplied`

**5b-(c) apply — 18 intrinsic-exempt contracts (update exempt_reason to explicit):**

These already have exempt_reason from migrator. Action: update each to replace the generic "not extractable" migrator text with the explicit exempt_reason from triage YAML. One commit for all 18: `feat: STEP 5b-(c) — 18 intrinsic-exempt contracts marked with canonical exempt_reason`

**5b-(b) file as S063 items — 2 buildable contracts:**
- B_GRADUAL_BUILD_BY_FOUNDATIONS → PROTO-S063-GRADUAL-BUILD-ENFORCEMENT
- B_TEMPLATE_FIRST_CREATION → PROTO-S063-TEMPLATE-CITATION-VALIDATOR
Add to `docs/plan/unified-plan.yaml` as planned items, then commit.

**After 5b-(a)+(b)+(c) commits:**
- Re-run `node tools/validators/validate-permanence-coverage.mjs`
- Expected: full_trio_canonical ~57-64% (was 48%)
- Write STEP 5b COMPLETE report to `tools/council/sonnet-turn.md`
- Commit + run verify → exit_code=0

### STEP 6 (after STEP 5b COMPLETE)

Ratchet `BASELINE_FRONTMATTER_FULL_TRIO` in `tools/validators/validate-permanence-coverage.mjs` from 32 to post-5b score. One commit: `feat: STEP 6 — ratchet baseline to post-5b score`

### PARALLEL TRACK: PROTO-S062-DEPLOY (can run if Opus ADVANCE delayed)

Three steps (Governor-approved parallel track):
1. `tools/validators/validate-app-deploy-readiness.mjs` (new validator, Component B platform-wide)
2. `apps/template/.env.example` (comprehensive env var template)
3. `apps/debt-collection/.csps/deploy-checklist.md` (7-step Vercel UI sequence)
Write `docs/plan/protos/PROTO-S062-DEPLOY.md` first (proto not yet written).

### Context consumption discipline (CRITICAL for C4)

C3 burned context 3× faster than normal. Root causes:
1. `node tools/verify.mjs` returns massive JSON — pipe to `2>&1 | tail -30` or `| grep -E "exit_code|FAIL|PASS|summary"` 
2. `git add` on many files emits CRLF warnings — use `git add docs/plan/pillar-0-governance/behavioral-contracts/` directory-level
3. Migrator `--apply` emits `[APPLIED] filename` per file — redirect output: `node migrate.mjs --apply 2>&1 | tail -10`
4. Avoid reading full contract bodies — use frontmatter-only reads when possible
5. **Max 1-2 verify runs per session.** Run only at pre-commit + pre-handoff gates.

---

## ALIGNMENT QUESTIONS

Q1: Has Governor relayed the Opus ADVANCE for STEP 5b? If yes, provide the Opus ruling text — especially answers to the 6 opus_review_questions in sonnet-turn.md (B_FIVE_SURFACE_ENGRAVING T2, B_GOVERNOR_PROMPTS T2, B_TOKEN_BUDGET bucket, B_STRUCTURAL_PREVENTION_DISCIPLINE T2, B_UX T2 path, B_CORE_SPINE_DISCIPLINE T1).

Q2: Is PROTO-S062-DEPLOY still the confirmed parallel track? Or has Governor deprioritized it?

Q3: Is there any new Governor directive from C3 that wasn't captured in this handoff (e.g., priority changes, new plan items, corrections to the triage buckets)?

Q4: Should C4 run `pnpm audit-runner:split` after any audit-runner.md modifications, or has the audit-runner slice freshness check been temporarily disabled?

---

## SONNET STARTUP BLOCK — paste this into C4 as first message

```
SESSION S062, continuation tab C4. C3 context exhausted after STEP 5b triage completed.

WHAT C3 FINISHED:
- STEP 2: All 66 B_*.md contracts have enforcement_trio YAML frontmatter (commits 3a40536, bcb7121, a765d2b)
- STEP 3: validate-permanence-coverage.mjs v2.0 frontmatter-first dual-metric (commit 8788d1f)
- STEP 4: pre-tool-use-bstar-trio-gate.sh META-T1 hook deployed + in settings.json (commit 4c9ffe7)
- STEP 5b TRIAGE: 34 partials → 14 declarable, 2 buildable, 18 intrinsic-exempt (commit 123a4ba)
  Full triage in: tools/data/permanence-partial-triage.yaml
  Opus review questions in: tools/council/sonnet-turn.md (top block)

CURRENT CANONICAL SCORE: full_trio = 32/66 = 48% (ground truth post-migration)

WHAT C4 MUST DO FIRST:
1. Run: node tools/verify.mjs 2>&1 | tail -30 → confirm exit_code=0
2. WAIT for Governor to relay Opus ADVANCE (STEP 5b apply is BLOCKED on this)
3. On Opus ADVANCE: apply 5b-(a) 14 declarable + 5b-(c) 18 exempt + file 5b-(b) 2 buildables as S063
4. Re-run validate-permanence-coverage.mjs → expected ~57-64%
5. Write STEP 5b COMPLETE to sonnet-turn.md
6. STEP 6: ratchet baseline from 32 to post-5b score

PARALLEL TRACK (if Opus ADVANCE delayed): PROTO-S062-DEPLOY
- Write docs/plan/protos/PROTO-S062-DEPLOY.md first
- Then: validate-app-deploy-readiness.mjs + apps/template/.env.example + deploy-checklist.md

CONTEXT BURN DISCIPLINE (C3 burned 3× faster — fix in C4):
- verify: pipe to | tail -30 NOT full output
- git add: directory-level NOT per-file
- migrator --apply: | tail -10
- MAX 2 verify runs per session

Handoff file: docs/plan/_handoff/HANDOFF-S062-C3-to-S062-C4.md
Role: Sonnet-10 | Governor: Yariv | Protocol: RELAY (Opus reviews, Governor relays)
```
