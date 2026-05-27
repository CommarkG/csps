---
id: csps.protos.PROTO-S066-WAVE-1
name: PROTO-S066-WAVE-1
description: "S066 WAVE 1 — three pre-commit prevention-infrastructure gates closing three distinct drift surfaces (Opus output shape / PROTO core-seed presence / validator behavioral-test coverage). Each gate is a single-file hook with one validator + one behavioral test. Auto-execute gate tier per B_REVERSIBILITY_GATED_REVIEW (3 small, reversible, mechanical, no cross-actor)."
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
core_spines: [VALD, GVRN, AI]
schema_anchor: protos
plan_item_id: "DRAFT-S066-PRE-ONSET-SHAPE-CHECK-MECHANICAL + DRAFT-S066-CORE-SEED-MANDATORY + Sonnet-Expert-C-BUILD_TEST_COMMIT_MANDATE"
core_seed_present: true
gate_tier: auto-execute
inherits_from: "M-37 Core Seeds + M-40 Inheritance-as-Default + M-41 Behavioral Test Discipline + B_REVERSIBILITY_GATED_REVIEW + DRAFT-S066-PRE-ONSET-SHAPE-CHECK-MECHANICAL + DRAFT-S066-CORE-SEED-MANDATORY + Sonnet Expert C BUILD_TEST_COMMIT_MANDATE + FINDING-OPUS10-6 PROTO relay format"
links:
  - rel: parent-findings
    href: ../../../tools/data/improvement-register.yaml
  - rel: moat-registry
    href: ../pillar-0-governance/moat-registry.md
  - rel: handoff
    href: ../_handoff/HANDOFF-S065-to-S066.md
  - rel: opus-turn
    href: ../../../tools/council/opus-turn.md
context_question: "Before WAVE 1 ships — are all three hooks built, all three validators emit exit_code 1 on the documented failure input, and all three behavioral tests verify the catch in the same commit?"
---

# PROTO-S066-WAVE-1 — Three Pre-Commit Prevention Gates

**STATUS: ACTIVE** | Session S066 | Sonnet-10 builds | Opus-11 reviews per STEP

**Gate tier:** auto-execute (per B_REVERSIBILITY_GATED_REVIEW — three single-file hooks; each independently reversible via `git rm`; no cross-actor implications; each ships its own behavioral test in the same commit).

---

## WHY THIS PROTO

S062-S065 built prevention infrastructure. S065 PAP exposed three drift surfaces still unclosed at the mechanical layer:

1. **Opus output shape drift** — SHAPE block discipline is behavioral only; nothing prevents a new Opus tab from skipping it. (Q2 finding.)
2. **PROTO core-seed drift** — M-37 says Opus writes core seeds, but no mechanical gate forces every PROTO-*.md to contain `## Core Seed` + `plan_item_id` + `gate_tier`. Sonnet has interpreted correctly mostly; structural enforcement is missing. (Q4 finding.)
3. **Validator behavioral-test drift** — 134/167 validators (80%) lack behavioral tests (PAP-1A 3.6% real coverage). Existing validators may detect nothing. (M-41 + gap_VALIDATOR_BEHAVIORAL_TEST_COVERAGE K=1.)

All three drift surfaces share **one structural shape**. WAVE 1 closes them with three near-identical hooks built from ONE Core Seed pattern.

---

## CORE SEED — the shared architectural anchor

Every WAVE 1 hook follows this exact pattern. Sonnet builds three instances from this seed.

```bash
#!/usr/bin/env bash
# Hook: <stage>-<scope>-<rule-name>.sh
# Fires: <stage> (pre-commit | pre-tool-use)
# Reads: <input source> (git diff --cached --name-only | tool args via $CLAUDE_HOOK_INPUT)
# Filters: only files matching <path-pattern>
# For each matched file:
#   Validates required: <required field / section / matching file>
#   Exits 1 with "[<hook-name>] BLOCKING: <which file> missing <what>. <how to fix>"
# Exits 0 if no matched files OR all matched files pass.

set -euo pipefail

STAGE="<pre-commit | pre-tool-use>"
PATTERN="<file-path-regex>"
REQUIREMENT="<one-line human-readable>"

# 1. Gather files-in-scope (event-source-specific)
files_to_check=$(<event-specific gather logic>)

# 2. Filter to pattern
matched=$(printf '%s\n' "$files_to_check" | grep -E "$PATTERN" || true)

# 3. For each matched file, verify required content
for file in $matched; do
  if ! <check_required_content "$file">; then
    echo "[<hook-name>] BLOCKING: $file missing $REQUIREMENT. Fix: <one-line guidance>"
    exit 1
  fi
done

exit 0
```

**Why this seed:**

- **Shape-uniformity** — every hook reads from one event source, filters by path-pattern, validates one rule, exits 0 or 1. No conditionals layered on conditionals. Reviewable in <60 seconds.
- **Auto-execute gate compliance** — each hook is one file, one rule, one exit. Reversible by `git rm .claude/hooks/<file>`.
- **Behavioral-test coverage trivial** — three standardized inputs per hook (A: violating, B: passing, C: edge — exempted-by-design). Tests live at `tools/tests/behavioral/<hook-name>-test.sh` and run via `bash` against fixture files.
- **Inheritance preserved** — every hook in the WAVE inherits from this Core Seed; future hooks under the same family declare `inherits_from: PROTO-S066-WAVE-1` in their header comment.

**Reference validator (parallel pattern, for STEPs that need both hook + validator):**

```javascript
// tools/validators/validate-<rule-name>.mjs
// Standalone validator runnable via `node tools/validators/validate-<rule-name>.mjs`.
// Returns exit 0 (all pass) or 1 (one or more violations).
// Used by pnpm verify AND by behavioral test.
// Emits JSON summary to tools/data/validate-<rule-name>-last-run.json.
```

---

## STEP 1 — pre-tool-use-shape-check.sh (Q2 Phase 1)

**Hook stage:** `pre-tool-use`
**Fires on:** Edit | Write tool calls targeting `tools/council/opus-turn.md`
**Scope filter:** writes whose `file_path` matches `tools/council/opus-turn.md` AND new content contains > 200 chars (skip conversational-tier per Q3)
**Required content:** writes must contain a SHAPE block matching regex `SHAPE:\s+\S.*\|\s+SHAPE-TIER:\s+(substantive|conversational)\s+\|\s+WHY:\s+\S` within the first 500 chars of new content

**Exempt class** (skip, exit 0 without check):
- writes < 200 chars (conversational fast-path)
- writes whose first 500 chars contain `SHAPE-TIER: conversational` (declared exempt)
- Edit operations whose `old_string` already contained a SHAPE block (header preservation, not new substantive content)

**Failure message format:**
```
[shape-check] BLOCKING: opus-turn.md write missing SHAPE block.
  Required: SHAPE: <type> | SHAPE-TIER: substantive | WHY: <one-line>
  Add to top of new content, or declare SHAPE-TIER: conversational if intentional.
```

**ADVISORY for S066 / BLOCKING from S067** — first session ships as warning-only; once Opus-11 demonstrates 5 clean substantive turns under shape-check, flip to exit 1 in S067.

**ADVISORY semantics (explicit per F-NEW-2):** ADVISORY mode = `exit 0` + emit warning to stderr `[shape-check][ADVISORY S066] would BLOCK S067: <file> missing SHAPE block. <fix-line>`. NOT silent. Sonnet must verify the warning is emitted on INPUT A even though exit_code is 0.

**Self-skip defensive line (per Opus-10 suggestion + F-NEW-3):** Even though path-filter is `opus-turn.md`-only, the hook MUST contain an explicit early-exit:
```bash
# Defensive: never gate on the hook's own file path (future-filter-expansion guard)
[[ "$target_file" == ".claude/hooks/pre-tool-use-shape-check.sh" ]] && exit 0
```
This is 2 lines, costs nothing, prevents future self-reference paradox if path-filter scope grows.

**DONE WHEN:**
1. `.claude/hooks/pre-tool-use-shape-check.sh` exists, executable, follows Core Seed pattern
2. `tools/tests/behavioral/pre-tool-use-shape-check-test.sh` exists with three INPUTs (A violating / B passing / C exempt-conversational) and all three pass expected exit codes
3. Hook registered in `.claude/settings.json` (or settings.local.json per S040 settings-discipline — defer to Sonnet's S040 carry-forward)
4. Hook listed in `verify-hooks-functional.sh` declared-hooks list (S041 enforcement)
5. Single commit. Commit message: `prevent: WAVE-1-STEP-1 — pre-tool-use-shape-check ADVISORY (Q2 Phase 1)`

**ZF gate STEP 1:**
- Cycle 1: Walk hook + test + settings + verify-hooks. Name one finding (e.g., "ADVISORY exit_code is 0 even on flag — is exit code stable across both modes?").
- Cycle 2: Re-examine the finding's area. Name 0 new findings OR resolve.
- Cycle 3 if needed.
- Output: `tools/data/validate-shape-check-last-run.json` (this STEP's THIS-HEAD evidence).

---

## STEP 2 — pre-commit-proto-core-seed-mandatory.sh (Q4)

**Hook stage:** `pre-commit`
**Fires on (phased — per F-NEW-1):**
- **S066 (this build):** NEW PROTO files only — `git diff --cached --name-only --diff-filter=A` filtered to PROTO-*.md. Existing 4 PROTOs (S062-A, S062-DEPLOY, S062-K, S065-PAP) are GRANDFATHERED at this phase and may be modified without triggering the hook.
- **S067 (carry-forward — retroactive backfill):** add `plan_item_id` + `core_seed_present` + `gate_tier` to existing 4 PROTOs' frontmatter (separate work item, filed as carry-forward at WAVE 1 close).
- **S068 (carry-forward — full expansion):** flip filter to `--diff-filter=AM` (added + modified) — full BLOCKING coverage.
**Scope filter (S066 build):** `git diff --cached --name-only --diff-filter=A | grep -E '^docs/plan/protos/PROTO-.*\.md$'`
**Required content per matched file** (all must be present, BLOCKING otherwise):
- Frontmatter field: `plan_item_id:` with non-empty value
- Frontmatter field: `core_seed_present: true`
- Frontmatter field: `gate_tier:` ∈ {`auto-execute`, `check-in`, `full-advance`}
- Body section: `## CORE SEED` OR `## Core Seed` (case-insensitive match) with at least one non-empty paragraph below
- Body section: `## DONE WHEN` (with at least one verifiable criterion below)
- Body section: `## ZF` or `## ZF gate` (with at least one bullet/line below)

**Failure message format:**
```
[proto-core-seed] BLOCKING: <file> missing <missing-field-or-section>.
  Required sections: ## Core Seed + ## DONE WHEN + ## ZF gate
  Required frontmatter: plan_item_id + core_seed_present + gate_tier
  Fix: see docs/plan/protos/PROTO-S066-WAVE-1.md as the canonical exemplar (self-dogfooded).
```

**Concrete body-section check syntax (per F-NEW-5):**
```bash
grep -Eqi '^## *core seed' "$file"   # case-insensitive, allows ## CORE SEED / ## Core Seed / ## core seed
grep -Eq  '^## *DONE WHEN' "$file"
grep -Eqi '^## *zf( gate)?' "$file"
```

**BLOCKING from S066** — Q4 was approved as full mechanical enforcement. No advisory phase.

**Reference exemplar:** THIS FILE (PROTO-S066-WAVE-1.md) is the first PROTO that must self-pass this hook. If THIS file fails the hook validator post-build, the validator has a bug.

**Optional companion validator** (recommended for verify-loop integration): `tools/validators/validate-proto-core-seed.mjs` scans all PROTO-*.md in repo, not just `git diff --cached` — catches PROTOs added pre-hook era. Emits JSON summary.

**DONE WHEN:**
1. `.claude/hooks/pre-commit-proto-core-seed-mandatory.sh` exists, executable, follows Core Seed pattern
2. `tools/validators/validate-proto-core-seed.mjs` exists (verify-loop sweep), runnable standalone
3. `tools/tests/behavioral/proto-core-seed-test.sh` with three INPUTs (A missing-core-seed / B complete-PROTO / C non-PROTO-file-touched-same-commit → unaffected) all pass expected exits
4. Hook registered + listed in verify-hooks-functional declared list
5. PROTO-S066-WAVE-1.md self-passes (run the validator against this very file at the end of STEP 2)
6. Single commit. Message: `prevent: WAVE-1-STEP-2 — pre-commit-proto-core-seed-mandatory BLOCKING (Q4)`

**ZF gate STEP 2:**
- Cycle 1: Walk hook + validator + test + settings + verify-hooks + self-pass-of-this-PROTO. Name one finding.
- Cycle 2: Re-examine the finding area + verify self-pass is THIS-HEAD (not memory). Name 0 new OR resolve.
- Output: `tools/data/validate-proto-core-seed-last-run.json` + self-pass evidence pasted into STEP-2 commit message.

---

## STEP 3 — pre-commit-validator-test-required.sh (Sonnet Expert C BUILD_TEST_COMMIT_MANDATE)

**Hook stage:** `pre-commit`
**Fires on:** any commit creating or modifying `tools/validators/validate-*.mjs`
**Scope filter:** `git diff --cached --name-only | grep -E '^tools/validators/validate-.*\.mjs$'`
**Required content per matched validator file:**
- A matching behavioral test exists in the **same commit** at path `tools/tests/behavioral/<base-name>-test.sh` where `<base-name>` = validator filename minus `.mjs` extension minus `validate-` prefix
  - Example: `validate-shape-check.mjs` → requires `tools/tests/behavioral/shape-check-test.sh`
- OR the validator file declares advisory exemption via frontmatter-comment: `// @behavioral-test-status: advisory-exempt — <one-line reason>` AND `@behavioral-test-status: advisory-exempt` appears in `tools/data/behavioral-test-exempt-registry.yaml` (Sonnet creates this registry as part of STEP 3)

**Failure message format:**
```
[validator-test-required] BLOCKING: tools/validators/<name>.mjs has no matching behavioral test.
  Required: tools/tests/behavioral/<base-name>-test.sh in same commit
  OR declare advisory-exempt via @behavioral-test-status comment + exempt-registry entry
  Fix: see tools/tests/behavioral/<existing-test>.sh as reference; INPUT A flag / INPUT B pass / INPUT C edge.
```

**BLOCKING from S066** — Sonnet's Expert C finding is the structural fix for the 134/167 untested validator backlog. New validators must not extend the gap.

**Multi-commit caveat (per F-NEW-4):** if Sonnet splits validator + test into two commits, the **first commit BLOCKS** (test not yet staged). This is correct hook behavior, not a bug. Stage validator + test in the SAME commit. PROTO message must explicitly note this so Sonnet doesn't interpret the block as a defect.

**Retroactive sweep (NOT part of STEP 3 — separate carry-forward S067):**
- 134 existing validators need behavioral tests OR exempt-registry entries
- Filed as gap_VALIDATOR_BEHAVIORAL_TEST_COVERAGE K=1 with structural fix = systematic sweep
- M-41 ratchet target: PAP-1A 3.6% → 10% by S067 close → 50% by S070 → 100% by quarterly review

**DONE WHEN:**
1. `.claude/hooks/pre-commit-validator-test-required.sh` exists, executable, follows Core Seed pattern
2. `tools/data/behavioral-test-exempt-registry.yaml` created (empty list `exempt_validators: []` initially — registry exists for future exemptions)
3. `tools/tests/behavioral/validator-test-required-test.sh` with three INPUTs (A: new validator without test → flag / B: validator + matching test in same commit → pass / C: validator with exempt-registry entry + comment → pass) all pass expected exits
4. Hook registered + verify-hooks declared list updated
5. **Self-dogfood check:** STEPs 1 and 2 each ship `validate-<name>.mjs` files that must themselves pass STEP-3's hook. If STEP 3 is built last in the WAVE, STEPs 1 and 2 commits won't trigger STEP-3 hook (hook didn't exist yet — clean). If STEP 3 is built FIRST, STEPs 1 and 2 will be forced to ship tests in the same commit (which DONE WHEN already requires). **RECOMMENDED ORDER: STEP 3 last, but treat its hook as self-dogfooding any S067+ validator.**
6. Single commit. Message: `prevent: WAVE-1-STEP-3 — pre-commit-validator-test-required BLOCKING (Expert C)`

**ZF gate STEP 3:**
- Cycle 1: Walk hook + exempt-registry + test + settings + verify-hooks + self-dogfood-check-on-STEP-1-and-STEP-2-artifacts. Name one finding (likely candidate: "does the regex correctly handle `validate-foo-bar.mjs` → `foo-bar-test.sh`?").
- Cycle 2: Re-examine the regex-mapping area; try INPUT D (multi-hyphen validator name) as additional fixture if regex-fragility suspected. Name 0 new OR resolve.
- Output: `tools/data/validate-validator-test-required-last-run.json`.

---

## WAVE 1 AGGREGATE — DONE WHEN

WAVE 1 is DONE when all three STEPs are DONE WHEN-complete AND the following whole-WAVE checks pass:

1. **THIS-HEAD verify:** `node tools/verify.mjs --skip-install` exits 0 after the three commits — paste exit_code line + report path into the WAVE-close commit.
2. **Behavioral test sweep:** `bash tools/tests/behavioral/*-test.sh` (or whatever the convention is — Sonnet verifies path) — all three new tests pass.
3. **verify-hooks-functional sweep:** post-WAVE count = 26 + 3 = 29 hooks declared, 29 present, 29 executable. (Note: pre-existing count is 26 per session-open output.)
4. **Stress-test before close:** Run `tools/templates/new-tab-stress-test.md` 6-layer questions against the closing-summary entry for S066 — every NO answer carried forward explicitly.
5. **Improvement-register update:** Each of DRAFT-S066-PRE-ONSET-SHAPE-CHECK-MECHANICAL, DRAFT-S066-CORE-SEED-MANDATORY, Sonnet Expert C entries gets `status: implemented-S066` + `implementation_commit_sha: <sha>`.
6. **M-41 ratchet move:** PAP-1A behavioral-test-coverage recomputed — should move from 3.6% to ~4.6% (3 new validators with tests / 167 → recompute denominator if 3 new validators added makes it 170).

---

## ZF GATE — WHOLE-WAVE

After all three STEPs land:
- **Cycle 1 (Architecture lens):** Walk the 3 hooks + 3 validators + 3 tests + settings.json + verify-hooks declared list + this PROTO. Name one finding.
- **Cycle 2 (AI-Pairing lens):** Walk the relay quality — did Sonnet honor the Core Seed pattern uniformly? Were any STEPs implemented in a way that drifts from the seed without explicit rationale? Name one finding OR 0 new + re-examine cycle-1 area.
- **Cycle 3 (QA lens):** Walk the behavioral tests — does each have INPUT A (flag) + INPUT B (pass) + INPUT C (edge) per Expert C discipline? Are the tests actually executable, not just present? Name 0 new OR resolve.
- **Cycle 4 only if needed.**
- Output composite: WAVE-close commit message contains the 3-cycle block.

---

## SETTINGS.JSON DISCIPLINE (S040 conflict resolution per F-NEW-6)

**S040 feedback memory:** "settings.json NEVER mid-session — always triggers permission prompts. Batch ALL settings changes to session open/close only."

**Resolution for WAVE 1:**
- **STEP 1 of every STEP:** Sonnet verifies whether Claude Code auto-discovers `.claude/hooks/*.sh` files without explicit `.claude/settings.json` registration. If YES → hooks fire automatically post-creation; no settings.json edit needed.
- **If auto-discovery is NOT the case:** batch the 3 hook-registration entries into ONE settings.json edit at session-close-gate (per S040 discipline). Do not edit settings.json mid-WAVE.
- **`verify-hooks-functional.sh` declared-hooks list** (per F-NEW-6 follow-up): this file is independent of settings.json — manually edit the bash array in the script to add the 3 new hook names. This is in-repo data, not in `.claude/settings.json`, so S040 doesn't apply. Safe to edit mid-WAVE.

Sonnet must report the auto-discovery test result in STEP-1 CHECKPOINT.

---

## PE-FORMULA VALIDATION (Opus-10 PART A application)

Opus-10 applied DRAFT-S066-PE-COMPOUNDING PART A formula to WAVE 1 STEPs:

| STEP | recurrence/session | save/session | build hours | pe_internal |
|---|---|---|---|---|
| 1 shape-check | 5 (every Opus turn) | 10 min | 2h | **2500** |
| 2 core-seed-mandatory | 2 (every PROTO) | 20 min | 3h | **1333** |
| 3 validator-test-required | 1 (every new validator) | 30 min | 3h | **1000** |

Execution sequence 1→2→3 (suggested below) matches descending pe_internal. **Sequence validated by PE formula** — no change needed.

---

## CARRY-FORWARD (NOT in WAVE 1 scope)

The following are explicitly deferred — Sonnet must NOT pull them into WAVE 1:

- **Retroactive 134-validator behavioral-test sweep** → gap_VALIDATOR_BEHAVIORAL_TEST_COVERAGE K=1 ratchet, S067+ work
- **PAP-Part-5 prevention-coverage 5% → 50% target** → S067+ structural sweep
- **CAI-DEFINITION.md ratification** → blocked on Governor typing "CAI-RATIFIED"
- **App #2 wet trial** → Governor S064 3-day postponement (~2026-05-30) — S067 earliest
- **Governor #3 priorities (core/threshold/UX journeys)** → blocked on Governor surface
- **session-state.json dual-mandate schema-flatten** → DRAFT-S066-SESSION-STATE-DUAL-MANDATE-FIX open in improvement-register, awaits Governor approval
- **Retroactive PROTO-frontmatter backfill (4 existing PROTOs: S062-A, S062-DEPLOY, S062-K, S065-PAP)** → S067 work; required before STEP-2 hook flips from `--diff-filter=A` to `--diff-filter=AM` (S068 phase)
- **G3 credential rotation 2026-05-28** → tomorrow, separate work item not WAVE 1

If Sonnet detects pull-into-WAVE-1 of any of the above, surface to Opus-11 via sonnet-turn.md before proceeding.

---

## EXECUTION SEQUENCE (suggested)

1. STEP 1 — pre-tool-use-shape-check (ADVISORY — lowest risk, proves the Core Seed pattern)
2. STEP 2 — pre-commit-proto-core-seed-mandatory (BLOCKING — self-dogfoods on THIS PROTO file)
3. STEP 3 — pre-commit-validator-test-required (BLOCKING — last because it dogfoods STEPs 1+2's validators if reordered)

After each STEP, Sonnet writes per-STEP CHECKPOINT to sonnet-turn.md with:
- exit_code from STEP's verify + behavioral test
- ZF cycle output for that STEP
- ASK OPUS if structural finding surfaces

Opus-11 reviews per STEP at check-in tier (B_REVERSIBILITY_GATED_REVIEW). Full ADVANCE for WAVE close only when whole-WAVE DONE WHEN-complete.

---

## ASK OPUS triggers (real only, per PROTO-S065-PAP precedent)

- New behavioral-test pattern surfaces that doesn't fit INPUT-A/B/C trio → Opus seed
- Settings.json change required mid-session (banned per S040) → Opus + Governor consultation
- Self-dogfood failure: STEP-2 hook flags PROTO-S066-WAVE-1.md itself → Opus debugs (likely validator bug, not PROTO bug)
- Cross-spine finding (e.g., touches AI inner-defaults registry) → Opus classification

---

*Authored S066 | Opus-11 | Core Seed pattern locks the architectural intent | Sonnet builds the three instances | M-37 + M-40 + M-41 + B_REVERSIBILITY_GATED_REVIEW honored*
