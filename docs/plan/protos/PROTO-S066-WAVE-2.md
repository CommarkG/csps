---
id: csps.protos.PROTO-S066-WAVE-2
name: PROTO-S066-WAVE-2
description: "S066 WAVE 2 — PART B of DRAFT-S066-PE-COMPOUNDING. Auto-scheduling validator + age-escalation mechanism for improvement-register and gap-recurrence-register findings. Triggered by WAVE 1 shipping in <2 sub-sessions (escalation trigger fired d6e066f → 58415ef). Closes the floating-findings problem: K=1 entries auto-promote to K=2 if not addressed within N sessions; session-close gate enforces top-3 PE-scored findings have committed-fix OR explicit-defer-with-reason."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S066
authored_by: Opus-11
date: 2026-05-27
core_spine: VALD
core_spines: [VALD, GVRN]
schema_anchor: protos
plan_item_id: "DRAFT-S066-PE-COMPOUNDING-FOR-INTERNAL-ENHANCEMENTS (PART B)"
core_seed_present: true
gate_tier: auto-execute
inherits_from: "DRAFT-S066-PE-COMPOUNDING (PART A applied S066) + PROTO-S066-WAVE-1 Core Seed pattern + M-30 Gap Recurrence Register + M-41 Behavioral Test Discipline + B_REVERSIBILITY_GATED_REVIEW"
links:
  - rel: parent-finding
    href: ../../../tools/data/improvement-register.yaml
  - rel: wave-1
    href: PROTO-S066-WAVE-1.md
  - rel: gap-register
    href: ../../../tools/data/gap-recurrence-register.yaml
context_question: "Before WAVE 2 ships — does every open finding have must_address_by_session, does the validator escalate K=1→K=2 after 3 sessions, and does session-close-gate block close if top-3 PE findings have neither fix-SHA nor explicit-defer?"
---

# PROTO-S066-WAVE-2 — Auto-Scheduling Validator + Age-Escalation

**STATUS: ACTIVE** | Session S066 | Sonnet-10 builds | Opus-11 reviews per STEP

**Gate tier:** auto-execute per B_REVERSIBILITY_GATED_REVIEW (1 validator + 1 schema-field + 1 close-gate hook; all reversible, mechanical, no cross-actor).

---

## WHY THIS PROTO

PART A (formula) was applied S066 manually — PE-FORMULA VALIDATION table in WAVE-1 PROTO confirmed the formula works on real findings. PART B mechanizes the **floating-findings problem**: K=1 entries today sit indefinitely (gap_PREVENTION_COVERAGE_GAP K=1 from S065 is already at risk of floating). PART B forces deadlines + escalation + close-gate enforcement.

Three structural elements:
1. **Schema:** `must_address_by_session` field on every open finding (default: `filing_session + 5`)
2. **Validator:** `validate-finding-scheduling.mjs` surfaces overdue findings (ADVISORY K=1 / BLOCKING K=2)
3. **Close-gate:** session-close hook checks top-3 highest-PE findings have committed-fix-SHA OR `explicit_defer_reason: <string>`

---

## CORE SEED — the schema + validator + gate triad

Every WAVE 2 element follows this exact pattern (inherits from WAVE-1 Core Seed bash template):

```yaml
# Schema delta (every entry in improvement-register.yaml + gap-recurrence-register.yaml)
- id: <existing-id>
  ...existing fields...
  must_address_by_session: S<NNN>        # NEW — defaults to filing_session + 5
  age_escalation_status: on-time | overdue-1 | overdue-2-promoted-K2  # NEW — auto-computed
  explicit_defer_reason: <string> | null # NEW — set if Governor explicitly defers
  fix_commit_sha: <sha> | null           # NEW — set on resolution
```

```javascript
// tools/validators/validate-finding-scheduling.mjs (per Core Seed)
// 1. Read improvement-register.yaml + gap-recurrence-register.yaml
// 2. For each entry with status != closed:
//    - if current_session > must_address_by_session AND no fix_commit_sha AND no explicit_defer_reason:
//        if k_count == 1: ADVISORY warning (stderr, exit 0)
//        if k_count >= 2: BLOCKING (stderr, exit 1)
//    - if current_session > must_address_by_session + 3 AND k_count == 1:
//        auto-promote: k_count = 2, log to gap-recurrence-register, emit BLOCKING
// 3. Emit JSON summary to tools/data/validate-finding-scheduling-last-run.json
```

```bash
# .claude/hooks/post-stop-session-close-gate-extension.sh (extends existing close-gate)
# Before session close:
#   Compute top-3 highest-pe_internal open findings
#   For each: require fix_commit_sha != null OR explicit_defer_reason != null
#   If any of top-3 missing both: BLOCK session close, list which
```

---

## STEP 1 — schema migration (improvement-register + gap-recurrence-register)

**Scope:** add 4 new fields to every entry with `status != closed` in both registers.

**Defaults applied programmatically:**
- `must_address_by_session: S<filing_session + 5>` (if entry has `first_found: S065`, default to `S070`)
- `age_escalation_status: on-time` (computed at validator runtime; on-disk default)
- `explicit_defer_reason: null`
- `fix_commit_sha: null` (unless entry already has a related commit-cite — Sonnet best-effort scan)

**DONE WHEN:**
1. Schema migration script `tools/scripts/migrate-S066-WAVE-2-scheduling-fields.mjs` exists and is idempotent (re-run = no-op)
2. All open entries in both registers have 4 new fields populated
3. Behavioral test `tools/tests/behavioral/scheduling-schema-migration-test.sh` confirms migration on fixture before/after
4. Single commit: `prevent: WAVE-2-STEP-1 — scheduling schema migration (PART B)`

**ZF gate STEP 1:**
- Cycle 1 (Architecture lens): walk migration script + idempotency check. Name 1 finding.
- Cycle 2 (Data-integrity lens): verify no existing fields overwritten. Name 0 new OR resolve.
- Output: migration script log + `validate-finding-scheduling-last-run.json` first run.

---

## STEP 2 — validator (validate-finding-scheduling.mjs)

**Build:** `tools/validators/validate-finding-scheduling.mjs` per Core Seed JS skeleton above.

**REQUIRED (per WAVE-1 STEP-2 engraving — same lesson Sonnet learned via audit_health FAIL):**
- Add audit-runner.md row: `finding_scheduling | tools/validators/validate-finding-scheduling.mjs | per session | ADVISORY+BLOCKING-by-K`
- Behavioral test `tools/tests/behavioral/finding-scheduling-test.sh` with INPUT A (overdue K=1 → ADVISORY exit 0 + stderr) / INPUT B (on-time → silent exit 0) / INPUT C (overdue K=2 → BLOCKING exit 1)
- Add validator to `pnpm verify` pipeline in tools/verify.mjs cycles list

**DONE WHEN:**
1. Validator exists, runs standalone via `node tools/validators/validate-finding-scheduling.mjs`
2. Audit-runner.md row added (CRITICAL — engraved lesson from WAVE-1 STEP-2)
3. Behavioral test passes A/B/C in same commit
4. Added to pnpm verify pipeline
5. `pnpm verify` exits 0 THIS-HEAD
6. Single commit: `prevent: WAVE-2-STEP-2 — validate-finding-scheduling (PART B)`

**ZF gate STEP 2:**
- Cycle 1 (Architecture): walk validator code + audit-runner row + pipeline integration. Name 1 finding.
- Cycle 2 (AI-Pairing): re-check the auto-promotion logic — does K=1→K=2 promotion correctly update gap-recurrence-register.yaml AND not double-count? Name 0 new OR resolve.
- Cycle 3 (QA): re-check behavioral test edge — what about an entry filed THIS session (filing_session = current_session, must_address_by_session = current_session + 5)? Should be on-time. Test INPUT D if not covered. Name 0 new OR resolve.

---

## STEP 3 — close-gate extension

**Build:** extend existing `post-stop-session-close-gate.sh` with top-3-PE check.

**Logic:**
- Read both registers, compute `pe_internal` per entry (formula from PART A applied)
- Sort descending, top 3
- For each of top 3: require `fix_commit_sha != null` OR `explicit_defer_reason != null`
- If any missing both: emit BLOCKING message naming which 3 + which field missing
- Bypass: closing-summary must contain section `## §10.0k top-3-PE-explicit-defer` with reason per missing entry

**DONE WHEN:**
1. Extension script `tools/scripts/close-gate-top3-pe-check.mjs` exists (called from post-stop-session-close-gate.sh)
2. `post-stop-session-close-gate.sh` updated to invoke the check
3. Behavioral test `tools/tests/behavioral/close-gate-top3-pe-test.sh` with INPUT A (top-3 has missing-both → BLOCK) / INPUT B (top-3 all have fix or defer → PASS) / INPUT C (closing-summary has §10.0k for missing → PASS via bypass)
4. Single commit: `prevent: WAVE-2-STEP-3 — close-gate top-3 PE enforcement (PART B)`

**ZF gate STEP 3:**
- Cycle 1: walk extension + invocation + bypass logic. Name 1 finding.
- Cycle 2: re-check whether top-3 is stable across runs — if PE scores change session-to-session, the "top 3" may shift. Document this — it's intentional (the highest-PE always gets enforced). Name 0 new OR resolve.
- Cycle 3: re-check behavioral test for INPUT D — what if register is empty (fresh repo)? Top-3 = none, gate passes trivially. Test covers? Add if not.

---

## ZF gate

Each STEP has its own per-STEP ZF cycles (specified inline above under each STEP). The WAVE-2 aggregate ZF gate runs after all 3 STEPs land:

- **Cycle 1 (Architecture):** Walk schema migration + validator + close-gate extension + audit-runner registration + behavioral tests. Name one finding.
- **Cycle 2 (AI-Pairing — relay quality):** Re-examine whether Sonnet honored the Core Seed pattern uniformly across STEPs. Re-check whether STEP-2's pe_internal re-computation handles edge cases (new findings filed this session not yet in registers, entries with explicit_defer_reason already set, etc.). Name 0 new OR resolve.
- **Cycle 3 (QA):** Re-examine behavioral tests across STEPs — does each have INPUT A/B/C plus any D edges named in per-STEP ZF? Are the auto-promote tests deterministic (K=1→K=2 fires reliably regardless of session-state.json field order)? Name 0 new OR resolve.
- **Cycle 4 if needed.**
- Output: WAVE-2 close commit message contains the 3-cycle block.

## WAVE 2 AGGREGATE — DONE WHEN

1. `node tools/verify.mjs --skip-install` exits 0 THIS-HEAD after all 3 commits
2. Behavioral tests A/B/C (+ any D edges) all pass for the 3 STEPs
3. Hook count: 29 → 30 declared (close-gate extension counted; or unchanged if it modifies existing hook in place)
4. Validator count: 180 → 181 (+ validate-finding-scheduling)
5. PE-formula application THIS session: re-run on all open findings, identify any new overdues, file as session-S066-close findings
6. Improvement-register: DRAFT-S066-PE-COMPOUNDING marked `part_b_status: implemented-S066` with commit SHAs
7. Update PE-FORMULA VALIDATION table in WAVE-1 PROTO to reference WAVE-2 mechanization

---

## SETTINGS.JSON DISCIPLINE — S040 + WAVE-1 lesson

Same rule as WAVE 1: hooks auto-fire from `.claude/hooks/` (per Sonnet's WAVE-1 STEP-1 auto-discovery test result — confirmed in STEP-1 CHECKPOINT). NO settings.json mid-session edit needed. Add new hook name to `verify-hooks-functional.sh` declared list (in-repo, not settings.json).

---

## CARRY-FORWARD (OUT-OF-SCOPE for WAVE 2)

- PART C — auto-surface at session-open (top-5 MUST-CONSIDER injection) → S067
- INTRA-SESSION-SYMMETRY-PROTOCOL (DRAFT-S067) → S067
- Retroactive PROTO-frontmatter backfill (4 existing PROTOs) → S067
- 134-validator behavioral-test sweep → S067+ structural sweep
- G3 credential rotation 2026-05-28 → tomorrow, separate work item
- App #2 wet trial → ~2026-05-30

---

## ASK OPUS triggers

- Schema migration finds entries with conflicting existing schema (e.g., `must_address_by_session` field collides with prior usage) → Opus arbitrates
- PE-formula re-run identifies finding with extreme score (>5000 or <50) → Opus reviews for formula-edge
- Close-gate test reveals existing closing-summaries lack §10.0k structure (retroactive sweep needed?) → Opus seeds carry-forward

---

## EXECUTION SEQUENCE

1. STEP 1 — schema migration (lowest risk, mechanical)
2. STEP 2 — validator (medium; audit-runner.md row REQUIRED — Sonnet's WAVE-1 lesson)
3. STEP 3 — close-gate extension (highest blast radius — touches session-close; ship last)

Per-STEP CHECKPOINT to sonnet-turn.md after each commit (same format as WAVE 1). Opus-11 reviews at check-in tier between STEPs. Full ADVANCE for WAVE close.

---

*Authored S066 | Opus-11 | Escalation trigger fired (WAVE 1 < 2 sub-sessions) | M-30 + M-41 + B_REVERSIBILITY_GATED_REVIEW honored*
