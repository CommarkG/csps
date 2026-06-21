---
id: csps.protos.proto-s086-inheritance-loop
name: PROTO-S086-INHERITANCE-LOOP
description: >
  Inheritance & Recurring-Completeness Loop — structural fix for completeness-decay-across-boundaries.
  Class: anything fixed/decided in one tab/session is not mechanically guaranteed to be carried forward,
  re-verified still-true, and completed in the next. Root: verify proves EXISTS/well-formed, never that
  live mechanisms FUNCTION or that prior obligations were re-swept. Ratified Governor S086.
diataxis_type: reference
version: "1.0"
session: S086
authored_by: OPUS-25
owner: group:finky
core_spine: GVRN
schema_anchor: proto_files
lifecycle: production
lifecycle_state: active
impl_status: implementing
ratified_by: "Governor S086"
ratified_at: "2026-06-21"
plan_item_id: PARK-S084-040
core_seed_present: true
gate_tier: full-advance
links:
  - { rel: feedback-activation, href: ../../../../C:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/memory/feedback_activation_steady_state_verify.md }
  - { rel: p-meta-033, href: ../../pillar-0-governance/no-lost-threads.md }
---

# PROTO-S086-INHERITANCE-LOOP
## Inheritance & Recurring-Completeness Loop

**Ratified Governor S086 (CAQ Scope-3 complete)**

---

## Root Cause

**Class**: anything fixed/decided in one tab/session is not mechanically guaranteed to be carried
forward, re-verified still-true, and completed in the next.

**Training defaults** that caused recurrence:
- D4 (pattern-match): fix the instance, assume the class is handled
- D5 (single-pass): verify once, consider it stable
- Satisfaction point: "verify=0 passes" felt like "all mechanisms function" — it does not.
  verify proves EXISTS/well-formed; it never asserts live hooks FUNCTION or prior obligations were re-swept.

**Evidence**: gp hook writing S067.md without frontmatter on every live turn;
6 UserPromptSubmit hooks reading `CLAUDE_USER_PROMPT` (never set by Claude Code) for 845+ empty entries;
Q3/Q4 decisions living in chat only, not in session-state.json.

**Memory refs**: feedback_activation_steady_state_verify, feedback_exists_not_equals_active, P-META-033 No-Lost-Threads

---

## The Fix (4 Phases)

### PHASE A — Stop the Bleeding
A1. governor-prompts + raw-comments hooks: write minimal YAML frontmatter at file CREATE.
    Backfill the 2 offenders (governor-comments/2026-06-21.md, governor-prompts/S067.md).
A2. Both hooks resolve session via tools/lib/session-source.mjs → current session.
A3. .gitignore .csps/_preview_tmp.txt + pattern.

### PHASE B — Instance Hardwires
B1. validate-hook-prompt-source.mjs (BLOCKING; in verify+audit-runner): every
    user-prompt-submit-*.sh MUST read stdin .prompt; env-var-only primary = FAIL. Block-test.
B2. frontmatter-exemption SSoT: tools/config/frontmatter-exempt-paths.yaml consumed by BOTH
    validate-frontmatter AND validate-universal-alignment (kill the divergent lists).
B3. validate-hook-activation-smoke.mjs (in verify): pipe {"prompt":"SMOKE-<ts>"} to EACH prompt
    hook; assert (a) it consumes the prompt, (b) any file it writes passes frontmatter.
B4. Engrave B_ACTIVATION_STEADY_STATE_VERIFY (5-surface).

### PHASE C — The Loop
C1. tools/lib/obligations-ledger.mjs — Single Obligations Ledger: one enumerable view over
    gap-recurrence + improvement + park + blocking_decisions + open-VLTs.
C2. Session-OPEN inheritance gate (BLOCKING, wired into SessionStart): re-derive ground truth
    (HEAD-isolation verify + activation-smoke) + sweep SOL — every open item re-verified-still-true
    or explicitly actioned/re-parked THIS session, else block.
C3. validate-session-close-completeness.mjs (BLOCKING): IZFC at session scope.
C4. validate-inheritance-integrity.mjs (BLOCKING): no obligation lives only in chat;
    cross-artifact decision propagation; inheritance channel parse.
C5. Mutual attestation: SessionStart emits Opus inheritance receipt; build emits Sonnet receipt.
C6. Wire into SessionStart startup context + CLAUDE.md pointer.

### PHASE D — Close Open Data Threads
D1. THRESHOLD-ROUTER-CONTRACT ratification in tools/session-state.json.
D2. Propagate Q3 (PARK-041 pre-db-push) + Q4 (unified orchestrator) into session-state.json.
D3. AGENTS.md 201→<200 lines.

---

## Core Seed

Inheritance & Recurring-Completeness Loop. Every obligation/decision in one tab must be mechanically
guaranteed to be carried forward, re-verified still-true, and completed in the next. Root cause:
verify proves EXISTS/well-formed, not that live mechanisms FUNCTION or prior obligations were re-swept.
Fix: activation smoke at session-open + obligations ledger (re-derive from committed files, never chat)
+ session-close completeness gate + inheritance integrity validator.

## DONE WHEN

1. verify exit_code=0 with B1/B3/C3/C4 LIVE
2. Regression proofs: hook stdin-break → B3 RED; session-state drift → C4 RED
3. governor-prompts/*.md + governor-comments/*.md pass frontmatter
4. obligations-ledger.mjs: total_open counted, sourced from committed files
5. Sonnet + Opus inheritance receipts: 0 obligations from tab/temp memory

## ZF Gate

- Cycle 1 (placement): all phases A/B/C/D present, all validators wired
- Cycle 2 (any other hook reds tree?): governor-prompts, governor-comments, session-open all verified
- Cycle 3 (tab/temp dependency check): obligations-ledger reads committed files only — 0 tab memory

## DONE Criteria
1. node tools/verify.mjs → exit_code 0 with B1/B3/C2/C3/C4 LIVE
2. Regression proofs: break hook stdin-read → B3 RED; revert session-state decision → C4 RED
3. governor-comments/2026-06-21.md + governor-prompts/*.md pass frontmatter + universal_alignment
4. obligations-ledger.mjs prints open-obligation count + sample
5. Opus + Sonnet inheritance receipts
6. session-state shows router-contract + Q3/Q4 resolved; AGENTS.md <200
7. ZF Cycle 1 (placement) + 2 (any hook reds tree?) + 3 (any part depends on tab/temp memory?)
