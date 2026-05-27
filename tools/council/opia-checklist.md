---
id: csps.council.opia-checklist
name: opia-checklist
description: "Opus Post-Implementation Audit — mandatory 15-point checklist Opus runs after EVERY Sonnet STEP / batch / WAVE close BEFORE writing ACK to opus-turn.md. Engraved from inaugural application S067 turns 37-38. Includes §2 Process-Value-Audit (PVA) cadence for weekly yield-rate measurement."
type: council-reference
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S067
ratified_session: S067
ratification_commit: "8fa3cc00"
authored_by: Opus-11
date: 2026-05-28
core_spine: GVRN
schema_anchor: council
plan_item_id: "DRAFT-S066-MASTER-CONSOLIDATED-RATIFICATION (governor_approval_status: APPROVED S066)"
inherits_from: "P-META-029 + B_HUMBLE_CONSOLIDATION_DISCIPLINE + M-42 + B_META_QUESTION_DISCIPLINE + P-META-006 RZF + P-META-019 STRUCTURAL_PREVENTION"
links:
  - rel: validator
    href: ../../tools/validators/validate-opia-audit-completeness.mjs
  - rel: principle
    href: ../../docs/plan/principles/P-META-029-humble-consolidation-discipline.md
  - rel: proto
    href: ../../docs/plan/protos/PROTO-S067-MASTER-THRESHOLD-ROUTER.md
---

# OPIA — Opus Post-Implementation Audit

**Mandatory checklist Opus runs BEFORE writing any ACK to `opus-turn.md`.**
**Inaugural application: S067 Sonnet STEP 2-7 reviews (turns 37-38).**

---

## §1 — 15-Point OPIA Checklist

Run all 15 points before writing ✓ or ✗ ACK. Each point has a specific CHECK, PASS condition, and FAIL action.

| # | Audit dimension | What it catches | CHECK | PASS condition |
|---|---|---|---|---|
| 1 | File presence on disk at named path | Phantom-claim defects | `existsSync(path)` for each claimed file | All files exist at declared paths |
| 2 | Behavioral test re-run THIS-HEAD | Nominal pass claim | `bash <test>.sh` exits 0 | All behavioral tests pass fresh |
| 3 | `pnpm verify --skip-install` exit_code=0 THIS-HEAD | Hidden regression | Run verify, check exit_code field | exit_code: 0 in verify-last-run.md |
| 4 | Audit-runner.md row fresh (no PENDING/deferred stale text) | Stale-doc EXISTS≠ACTIVE | Read row text, grep for "PENDING\|deferred" | Row says ACTIVE + specific commit SHA |
| 5 | `verify-hooks-functional.sh DECLARED_HOOKS` updated for new hooks | EXISTS ≠ DECLARED | Check hook count = disk count | present=declared=N missing=0 |
| 6 | Settings.json untouched mid-session (S040 / C12) | Mid-session config drift | `git diff HEAD -- .claude/settings.json` | No diff (unchanged) |
| 7 | M-40 `inherits_from` declared on every new artifact | Orphan artifacts | Check frontmatter of each new file | inherits_from: field present |
| 8 | ZF cycles cite files per cycle (C4 prevention) | Nominal ZF | Read CHECKPOINT ZF blocks, check file citations | Each cycle names ≥1 file path or named area |
| 9 | Same-commit ship — validator + test + audit-row in ONE commit (Expert C) | Split-commit drift | Check git log for paired changes | All 3 in same commit SHA |
| 10 | Mechanical enforcement verified (not just text) | EXISTS≠ACTIVE | Run the hook/validator itself | Non-zero output or clean pass |
| 11 | C9 knowledge writeback when integration fixes land | Patch-without-knowledge | Check if canonical doc was updated alongside code | knowledge doc updated in same commit or same session |
| 12 | C6 cross-finding root-cause cluster check | Fragment-findings | Run validate-cross-finding-cluster.mjs | blocking=0 |
| 13 | Per-STEP CHECKPOINT in sonnet-turn.md (not silent ship) | F-NEW-12/16 / C13 | Check sonnet-turn.md for commit SHA + test results | CHECKPOINT present with SHA + ZF cycles |
| 14 | Hidden regression sweep (apps/ typecheck) | C11 hidden surface | verify.mjs apps_typecheck cycle | apps_typecheck cycle exits 0 |
| 15 | prevention_class declared if new finding filed | APPENDIX C automatic demand | Check new improvement/gap entries | prevention_class: C<N> declared |

**Validator:** `validate-opia-audit-completeness.mjs` — ADVISORY S067 → BLOCKING S068.

---

## §2 — Process-Value-Audit (PVA)

**Cadence:** Weekly (composes with `tools/data/flow-activity-monitor.yaml` dormant-flow detection + `audit-runner.md` weekly cron).

**Purpose:** Measure real findings-yield per platform process, not just invocation count. A process that runs but catches nothing is governance theater.

### PVA Scope

Every active platform process assessed:
- **Hooks** (67 on disk) — does each hook catch real violations?
- **Validators** (184+ in verify cycle) — does each validator find real issues?
- **Skills** (31) — is each skill invoked with real outcomes per quarter?
- **Cadences** (weekly/monthly/per-session) — do cadence triggers produce substantive output?
- **Registers** (improvement-register, gap-recurrence) — are entries being closed, or accumulating?

### PVA Yield Metrics

| Yield tier | Definition | Action |
|---|---|---|
| HIGH-VALUE | ≥1 substantive defect catch per 4 weeks | Keep; celebrate |
| MEDIUM-VALUE | 1 catch per 4-8 weeks | Keep; monitor |
| LOW-VALUE | 0 catches across 8 weeks | Flag; K=1 review |
| DEAD-VALUE | 0 catches across 12 weeks + 0 recent invocations | Propose deprecation; K=2 = structural fix required |

### PVA Inheritance

- Extends `tools/data/flow-activity-monitor.yaml` (dormant-flow detection)
- Extends `tools/validators/validate-skill-invocation-rate.mjs` (per-quarter invocation — STEP 4)
- Extends `validate-claimed-mechanical-presence.mjs` (C1 — EXISTS not just ACTIVE but CATCHING)

### PVA Validator

`tools/validators/validate-process-value-yield.mjs` — planned S068 build. This checklist section is the canonical reference; validator builds from this spec.

### PVA Integration with OPIA

PVA runs ALONGSIDE the 15-point OPIA checklist. After each STEP review:
1. Run 15-point OPIA (§1) — confirms this STEP's output is correct
2. Sample 3-5 processes from PVA scope — are they catching? Any DEAD-VALUE candidates?
3. File findings in gap-recurrence-register.yaml if patterns emerge

---

## §3 — OPIA Output Format

Every Opus ACK must include (in this order):
1. SHAPE field + WHY
2. List of 15 OPIA points with ✓/✗ + specific evidence per point
3. DEFECTS section (if any ✗ found) with REQUIRED FIX
4. SECONDARY DEFECTS (advisory findings)
5. SEALED confirmation (once all ✓ + defects resolved)

**Inaugural exhibition of this format:** `tools/council/opus-turn.md` — MEGA-BATCH FULL ADVANCE entry (commit 8fa3cc00) — 15-point table with explicit OPIA finding for verify-hooks DECLARED_HOOKS stale count.
