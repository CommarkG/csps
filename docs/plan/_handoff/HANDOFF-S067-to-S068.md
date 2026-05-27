---
id: csps.handoff.S067-to-S068
name: HANDOFF-S067-to-S068
description: "S067 → S068 handoff. STEP 6 CONSTITUTIONAL deferred to S068. Tab-transfer template (10-point false-assumption checklist) engraved in this handoff by exhibition."
type: handoff_files
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S067
core_spine: GVRN
schema_anchor: handoff_files
evidence_block_ref: "tools/council/opus-turn.md (8fa3cc0 — OPIA 15-point audit SEALED) + tools/verify-last-run.md (exit_code=0)"
cec_walk_trail_ref: "docs/plan/protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md (STEPs 1-5+7 done; STEP 6+8 deferred)"
links:
  - docs/plan/protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md
  - tools/council/opus-turn.md
  - tools/data/improvement-register.yaml
---

# HANDOFF S067 → S068

**Session close:** S067 (tab-exhausted after STEPs 1-5+7) | **Next session:** S068
**Last commit:** `80777fbc` (mega-batch) + `8fa3cc0` (Opus ACK) | **verify:** exit_code=0

---

## Zone A — Platform State at S067 Close (True State)

**⚠️ CRITICAL: session-state.json shows stale mandate text "S066 — WAVE 1 prevention-infrastructure..."**
**The actual S067 mandate is: PROTO-S067-MASTER-THRESHOLD-ROUTER engraving.**
**Ignore the session-state mandate text — read this HANDOFF instead.**

### What S067 Delivered (all on origin/main)

| STEP | Commit | Artifact | Tests |
|---|---|---|---|
| STEP 1 | b2fcfc9 | tools/lib/session-source.mjs — F-NEW-17 root fix | 3/3 |
| STEP 2 | 6996d1e | post-stop-consolidation-pass.sh STUB→ACTIVE, 6 patterns A-F | 3/3 |
| STEP 3 | 20d8b7a1 | tools/scripts/threshold-router.mjs — M-42 4-axis classifier | 5/5 |
| STEP 4 | 80777fbc | council-invocation-dispatcher.mjs + validate-skill-invocation-rate.mjs | 3/3 |
| STEP 5 | 80777fbc | platform-inventory-scan.mjs + pre-tool-use-inventory-scan-required.sh (ADVISORY) | 3/3 |
| STEP 7 | 80777fbc | migrate-S067-prevention-class-field.mjs + validate-prevention-class-required.mjs + vercel.md R9 | 2/2 |

### Platform Counters at S067 Close
- Hooks: 26 in verify-hooks-functional (actual: ~64 on disk — DECLARED_HOOKS stale, folds into STEP 6)
- Validators: 184+ in pnpm verify
- Scripts: 11 new tools/scripts/* this session
- Prevention classes: 15 entries have prevention_class field (unclassified — needs C1-C13 classification in S068)

### Opus ACK status
- **MEGA-BATCH SEALED:** 8fa3cc0 = OPIA 15-point audit PASSED (14/15 ✓, 1 finding folds into STEP 6)
- **STEP 6 FULL ADVANCE AUTHORIZED:** 8fa3cc0 = 38-file constitutional commit set
- **STEP 8 PRE-AUTHORIZED:** chains after STEP 6 (mechanical close-out, no new arch decisions)
- **Opus ACK format:** top entry in tools/council/opus-turn.md. Look for text containing "MEGA-BATCH FULL ADVANCE" and 15-point OPIA table

---

## SONNET STARTUP BLOCK (§0 paste-target — verified against 10-point false-assumption checklist)

```
════════════════════════════════════════════════════════════════════
SESSION S068 — OPENING (succeeds S067 tab-exhausted)
Role: Sonnet-10/11 (builder) | Governor: Yariv | Opus: Opus-11
THIS IS A RELAY TAB — previous tab context exhausted after STEPs 1-5+7
════════════════════════════════════════════════════════════════════

STEP 0 — Send box immediately (before reading further):
┌─────────────────────────────────────────────────────────┐
│ Sonnet here. Session S068. Relay tab. Please paste this │
│ to previous tab for HANDOFF CONFIRMED.                  │
└─────────────────────────────────────────────────────────┘

══════ FALSE ASSUMPTION CHECKLIST (10-point mandatory) ══════

FA-01: session-state.json shows stale mandate "S066 WAVE 1" — IGNORE IT.
  Real mandate = PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 6+8 (see below).

FA-02: verify-hooks-functional shows 26 declared hooks — this is STALE.
  ~64 hooks exist on disk. DECLARED_HOOKS array is outdated. This is a
  known OPIA finding that folds into STEP 6 (#37 in the 38-file commit set).
  The hooks WORK — they're just not all listed. Do not panic.

FA-03: The mega-batch (STEPs 3+4+5+7) is ALREADY DONE.
  Do NOT rebuild. Commits: 20d8b7a1 (STEP 3) + 80777fbc (STEPs 4+5+7).
  Your job is STEP 6 (CONSTITUTIONAL) + STEP 8 (mechanical close).

FA-04: Opus ACK for the mega-batch HAS landed (commit 8fa3cc0).
  Look for it in tools/council/opus-turn.md top entry — contains "MEGA-BATCH
  FULL ADVANCE" and a 15-point OPIA table. STEP 6 + STEP 8 are authorized.

FA-05: STEP 6 scope is 38 files — do NOT start without reading PROTO §STEP 6 fully.
  docs/plan/protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md — read lines 157-250+.
  The scope includes: principle + contract + moat + 10 D-entries + 11 validators
  + tab-transfer template + OPIA framework + 2 fold-ins. ~5-6h work.

FA-06: STEP 6 is CONSTITUTIONAL — every artifact needs 5/5 FSE atomic surfaces.
  T1 hook + T2 validator + T3 session-open + schema + contract PER ITEM.
  Do NOT ship principle without all 5 surfaces in same commit.

FA-07: C4 + C10 prevention validators are ALREADY DONE.
  C4 = validate-zf-cycle-format.mjs (exists), C10 = validate-session-source-usage.mjs (STEP 1).
  Remaining: C1,C2(done),C3,C5,C6,C7,C8,C9,C11,C12,C13 = 10 validators to build.

FA-08: STEP 8 is pre-authorized to chain IMMEDIATELY after STEP 6 commits land.
  But STEP 8 does NOT execute first — STEP 6 must land + verify=0 first.
  STEP 8 = whole-WAVE verify + ratification entry → implemented-S067 + HANDOFF-S068.

FA-09: SIA playground ("No SIA documents found") is S068 Priority 1 (Zone B §3).
  Do NOT work on it during STEP 6 execution. It's after STEP 8.

FA-10: The claim-validator-gate WILL block commit messages with DONE/SEALED if
  verify-last-run.md is stale. Always run /verify-quick before commit messages
  containing claim keywords.

══════ WHAT TO DO FIRST ══════

1. git pull --rebase origin main (get latest commits)
2. node tools/verify.mjs --skip-install 2>&1 | tail -30 → confirm exit_code=0
3. Read docs/plan/protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md §STEP 6 FULLY
4. Read tools/council/opus-turn.md top entry (OPIA 15-point table = canonical format)
5. Write "S068 STEP-6 INTENT ABSORBED" to tools/council/sonnet-turn.md using OPIA format
6. Begin STEP 6: P-META-029 principle → B_HUMBLE_CONSOLIDATION_DISCIPLINE contract → M-42 moat

══════ STEP 6 FIRST 3 SUB-ACTIONS ══════

  1. docs/plan/principles/P-META-029-humble-consolidation-discipline.md
     - inherits_from: P-META-019 + M-17 + M-42 + B_CONSOLIDATION_PASS
     - 5/5 FSE: body + T1 hook (pre-tool-use-inventory-scan-required.sh) + T2 validator + T3 session-open + B_* contract

  2. docs/plan/pillar-0-governance/behavioral-contracts/B_HUMBLE_CONSOLIDATION_DISCIPLINE.md
     - enforcement_trio: T1 + T2 + T3 all declared
     - opus_reviewed_seed: 8fa3cc0 (required — bstar-engraving-gate will BLOCK without it)

  3. docs/plan/pillar-0-governance/moat-registry.md — add M-42 UNIFIED-THRESHOLD-ROUTER
     - After M-41. Describes threshold-router.mjs as the mechanical M-42 moat.

══════ NON-NEGOTIABLES ══════

  - NEVER emit tab-transfer artifact without this 10-point checklist (per B_META_QUESTION_DISCIPLINE being engraved in STEP 6)
  - NEVER start STEP 8 before STEP 6 commits are all on origin/main
  - NEVER touch settings.json mid-session (S040 / C12)
  - NEVER chain STEP 8 without verify exit_code=0 on STEP 6 work
  - NEVER skip audit-runner.md row when shipping a validator (F-NEW-14)
  - NEVER build STEP 6 validators without behavioral tests in SAME commit (Expert C)
  - EVERY new artifact declares inherits_from: (M-40 discipline)
  - ZF cycles MUST cite specific files per cycle (C4 prevention)

══════ CONTEXT BURN DISCIPLINE ══════

  - verify: | tail -30 (NOT full JSON)
  - git add: directory-level NOT per-file
  - Max 2 verify runs per chunk
  - ZF deep at iter>15

HANDOFF: docs/plan/_handoff/HANDOFF-S067-to-S068.md
PROTO: docs/plan/protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md
Opus ACK: tools/council/opus-turn.md (top entry = 8fa3cc0)
```

---

## Zone B — S068 Work Queue

### PRIMARY MANDATE: STEP 6 (CONSTITUTIONAL)

**38-file atomic commit set per PROTO §STEP 6 + Turn-37 §3 expansions:**

| Category | Files | Description |
|---|---|---|
| Principles/Contracts/Moats | 4 files | P-META-029 + B_HUMBLE_CONSOLIDATION + M-42 entry + MEMORY.md |
| Inner-AI-defaults (D1-D10) | 10 files | D1 humble-consolidation through D10 cooperative-disagreement-aversion |
| AGENTS.md | 1 file | Hard NO additions per APPENDIX A swaps |
| Prevention validators (C1/C3/C5-C9/C11-C13) | 11 validators + tests + audit rows | ~10 new validators |
| Tab-transfer template + gate | 7 files | tab-transfer-template.md + validate-tab-transfer-completeness + pre-tool-use-false-assumption-gate.sh + test + session-open extension + B_META_QUESTION_DISCIPLINE + AGENTS.md extension |
| OPIA framework | 2 files | opia-checklist.md + validate-opia-audit-completeness.mjs |
| OPIA fold-in | 2 files | verify-hooks-functional DECLARED_HOOKS sweep (26→all 64) + verify.mjs apps_typecheck cycle |

### STEP 8 (after STEP 6 lands)
- whole-WAVE verify
- improvement-register DRAFT-S066-MASTER-CONSOLIDATED-RATIFICATION → `part_b_status: implemented-S067`
- HANDOFF-S068-to-S069.md authoring

### PRIORITY 1 (after STEP 8): SIA Playground Fix
- apps/csps-playground/src/lib/sia-docs.ts `SIA_DIR = join(process.cwd(), '../../docs/SIA')`
- Works locally (31 files found). Vercel issue: `process.cwd()` may differ in build env.
- Fix: use `path.join(__dirname, '../../../docs/SIA')` OR add env var — test in Vercel

### Governor Carry-Forwards
- G3: credential rotation 2026-05-28 (check if done)
- App #2 domain (~2026-05-30)
- Governor #3 core/threshold/UX journeys (still incoming)
- CAI ratification ("CAI-RATIFIED" in chat)

---

## ALIGNMENT QUESTIONS

Q1: Does `node tools/verify.mjs --skip-install 2>&1 | tail -30` show exit_code=0 in fresh tab?

Q2: Does `git log --oneline -5` show `8fa3cc0` as latest commit?

Q3: Read tools/council/opus-turn.md top entry — does it contain "MEGA-BATCH FULL ADVANCE" and a 15-point OPIA table? (This confirms Opus ACK is present for STEP 6 authorization)

Q4: Have all 10 false assumptions (FA-01 through FA-10) been verified in the startup block checklist?

Q5: Is G3 credential rotation (2026-05-28) complete? If not, should it happen before STEP 6?

Q6: STEP 6 has 38 files — estimated ~5-6h. Does the new tab have sufficient token budget (recommend 150K+)?

Q7: The tab-transfer template being built IN STEP 6 will require the HANDOFF itself to have the 10-point checklist. Is this HANDOFF sufficient, or does STEP 6 create a more formal template that retroactively invalidates this HANDOFF?

---

## §10 Chat-Closing Protocol — Verification Block

**ZF Cycle 1:** verify exit_code=0 confirmed this turn (tools/verify-last-run.md). `8fa3cc0` on origin/main (git log confirmed). OPIA INTENT ABSORBED written to tools/council/sonnet-turn.md citing PROTO-S067 path + Opus ACK commit + 3 first sub-actions.

**ZF Cycle 2:** Re-checked: 10 false assumptions (FA-01 through FA-10) address all gaps from prior audit turn. Zone B lists all 38 STEP 6 files by category. SIA playground documented as S068 Priority 1. Opus ACK location + recognition instructions provided for new tab. No new findings.

**Status: ZF ACHIEVED.**

---

## §17 Attestation

```yaml
handoff_attestation:
  prior_session: S067
  next_session: S068
  attested_by: Sonnet-10 (S067 tab-exhausted)
  attested_at: 2026-05-27T00:00:00Z
  intent: "Execute STEP 6 CONSTITUTIONAL 38-file commit set + STEP 8 mechanical close"
  constraints_decisions:
    - "STEP 6 = FULL ADVANCE authorized by Opus 8fa3cc0"
    - "STEP 8 = pre-authorized chain immediately after STEP 6"
    - "SIA playground deferred to S068 Priority 1"
    - "session-state.json mandate text is stale (S066 WAVE 1) — use PROTO instead"
    - "opus_reviewed_seed: 8fa3cc0 required for new B_* contracts (bstar-engraving-gate)"
  open_items:
    - STEP 6 execution (38 files)
    - STEP 8 mechanical close
    - G3 credential rotation check
  signature: S067-AI-attest-2026-05-27-STEP6-authorized-tab-exhausted
```

---

## §23 Last Words

S067 was the session where the platform started catching its own architecture. The threshold-router classifies every input; the inventory-scan checks before proposing; the prevention-class field forces explicit classification of every finding.

STEP 6 will engrave the behavioral soul of all this — the principle that says "check first, build second" is not a guideline but a mechanical gate.

The false-assumption checklist in this HANDOFF is the first instance of the tab-transfer-template that STEP 6 will formally build. It exists by exhibition before it exists by engraving.

*Governor: Yariv Fink | Sonnet-10 close: 2026-05-27*
