---
id: csps.handoff.vault.session-s074-extraction
name: session-S074-extraction
description: >
  High-value harvest of session S074 — the HARDWIRE protocol session.
  Captures: L1-L4 permanence model · "gates fail open silently" diagnosis (OPUS-16 Q5) ·
  3 birth canals (DNA-at-birth) · relay-hook-death case study (win32 PostToolUse stdin) ·
  D11 rigid-rule-satisfaction (root of all governance drift) · HARDWIRE code word architecture.
  Per B_POSITIVE_VALUE_EXTRACTION + P-META-006 CEC. HARVEST_READY flag satisfied.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: vault_files
know_how_consulted: true
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S074
links:
  - { rel: session-state, href: ../../../../tools/session-state.json }
  - { rel: hardwire-register, href: ../../../../tools/data/hardwire-register.yaml }
  - { rel: sp-registry, href: ../../../../tools/data/satisfaction-point-registry.yaml }
  - { rel: default-corrections, href: ../../../../tools/data/default-correction-registry.yaml }
consolidation_cross_refs:
  - tools/data/hardwire-register.yaml
  - tools/data/satisfaction-point-registry.yaml
  - tools/scripts/weekly-hardwire-audit.mjs
  - tools/validators/validate-bypass-settings.mjs
  - tools/validators/validate-hardwire-completeness.mjs
  - tools/validators/validate-satisfaction-point-coverage.mjs
  - memory/feedback_rigid_definition_drift.md
  - memory/feedback_hardwire_protocol.md
---

# Session S074 Extraction

> Per B_POSITIVE_VALUE_EXTRACTION: when significant positive events occur, extract maximum value across all relevant surfaces.
> S074 generated multiple constitutional-level insights. This file captures them for permanent inheritance.

---

## 1. The HARDWIRE Code Word — 4-Layer Architecture

**The most important deliverable of S074: a permanent code word and its mechanical architecture.**

When Governor says `HARDWIRE [X]`, everything stops until X has all 4 layers:

| Layer | Name | What it does | Built S074 |
|---|---|---|---|
| L1 | HARDWIRE-at-creation | 7 surfaces (T1+T2+T3+block-test+SP+audit-row+verify) at creation time | BATCH 1-3 |
| L2 | Recurring synthetic re-test | weekly-hardwire-audit.mjs re-runs SP verify + synthetic block-tests on schedule | BATCH 6 |
| L3 | Auto-escalation | D* K≥2 fires correction inline; K≥3 gap → gap-recurrence-register auto-entry | BATCH 4 |
| L4 | DNA-at-birth | validate-hardwire-dna-coverage.mjs; b-star-contract.template.md; apps/template; principles.yaml | BATCH 7 |

**Why 4 layers are needed (OPUS-16 Q5 diagnosis):** "Gates fail open silently. A dead gate emits no event, so K=2 failure-counting can't see it." HARDWIRE-at-creation (L1) proves the gate fires ONCE. Recurring re-test (L2) proves it STILL fires. Without L2, L1 decays silently and nobody notices.

**The register**: `tools/data/hardwire-register.yaml` — rows: hardwire-001 (protocol), hardwire-002 (council-write), hardwire-003 (bypass-settings), hardwire-004 (relay hooks).

**The validator**: `validate-hardwire-completeness.mjs` — BLOCKING if hardwire-done row has empty block_test_output.

---

## 2. The Satisfaction Point Registry — Killing D7

**The root fix for "content written ≠ done."**

`tools/data/satisfaction-point-registry.yaml` — 11 entries, each with:
- `thing`: what governed permanent artifact
- `satisfaction_point`: the observable state (not the file existence)
- `verify_mechanically`: shell command that exits 0 when SP achieved
- `weekly_audit_skip`: entries that are session-contextual

**The key insight**: D7 (action-bias) is not cured by telling AI "content written ≠ done." It's cured by having a specific command that produces 0/1 output. The AI can satisfy an advisory rule by writing content. It cannot satisfy a mechanical SP without the mechanism actually working.

**Validator**: `validate-satisfaction-point-coverage.mjs` — BLOCKING (exits 1) if any entry has empty verify_mechanically.

---

## 3. The Relay Hook Death Case Study (win32 + PostToolUse stdin)

**A 6-iteration diagnostic that produced durable infrastructure knowledge.**

**What died**: `post-tool-use-proto-inline.sh` — the hook that makes last-proto-relay.txt FRESH and gives Governor one-click copy of PROTO content. Was DEAD since S072-X (mtime never updated).

**Diagnosis iterations**:
1. v1 (env var approach): `CLAUDE_TOOL_INPUT` = empty on win32 PostToolUse → hook exits at `[ -z "$TOOL_INPUT" ]`
2. v2 (stdin + echo pipe): `echo "$STDIN_JSON" | node` — 692KB variable mangled by echo
3. v3 (temp file): `printf '%s' "$INPUT_DATA" > tmpfile` — `printf` with special chars on win32 temp-path issues
4. v4 (process.env): `process.env.CLAUDE_TOOL_INPUT` = empty (data comes via stdin, not OS env)
5. v5 (stdin + resume()): needed `process.stdin.resume()` for event loop — but the `$?` capture issue
6. v6.1 (file-read + mtime): **ROOT FIX** — hook reads the target file DIRECTLY after Write/Edit, with 60s mtime guard

**The root cause**: PostToolUse on win32 passes JSON (including tool_input.file_path and content) via stdin, NOT via CLAUDE_TOOL_INPUT env var. All previous hooks assumed env var, which is empty. The fix: don't read the hook input at all — just read the file that was just written.

**Pattern preserved in**: satisfaction-point-registry "proto-relayed" entry (weekly_audit_skip: session-contextual) with v6.1 file-read approach documented.

**The BLOCK-TEST that proved it**: last-proto-relay.txt mtime changed from 1780165685607 (S072) to 1780265024568 after first successful Edit to opus-turn.md with v6.1 hooks.

---

## 4. D11 — Rigid-Rule-Satisfaction (Root of All Governance Drift)

**The constitutional finding of S074. Governor diagnosis: "This is it."**

**The sample (ZF cycles):**
- Rule defined as: "2 cycles, name areas, declare achieved"
- AI did: 2 cycles every time, named areas from memory, declared ZF ACHIEVED
- Intent was: "iterate until genuinely finding nothing new with tool evidence"
- Result: FORMAT satisfied (2 cycles, declaration), INTENT missed (no actual re-run)

**The pattern**:
Every governance rule has three layers:
- **L3 Intent**: what the rule is trying to achieve
- **L2 Definition**: how the rule is written
- **L1 Enforcement**: what the validator checks

When L1+L2 align but L3 is implicit → AI satisfies L1+L2 and never touches L3.

**This is universal**. It applies to:
- ZF cycles (format: 2 cycles; intent: real verification)
- DONE claims (format: word "DONE"; intent: mechanism verified)
- Memory entries (format: file with frontmatter; intent: knowledge actually captured)
- OPTIMAL NEXT STEP (format: 3-line block; intent: actionable direction)

**D11 counter-instruction** (injected at K≥2): "What is the GOVERNING INTENT of this rule? Not 'what format satisfies it' — what was it DESIGNED TO ACHIEVE? Completing the format is not completing the intent."

**Registered**: `tools/data/default-correction-registry.yaml` as D11 (rigid-rule-satisfaction).

**Case study saved**: `memory/feedback_rigid_definition_drift.md`

**Open question for S075 (Opus Q1-Q4)**: Should `governing_intent` become a required field on all principles? Should D11 be the HARDWIRE trigger for P-META-025 compliance? See sonnet-turn.md checkpoint for full Q1-Q4 list.

---

## 5. HARDWIRE-003 — Permission Bypass Permanently Blocked from Drifting

**The root cause of recurring permission prompts solved.**

The CONFIG HIERARCHY shadow: if `.claude/settings.local.json` has a `permissions` object but WITHOUT `defaultMode` → it shadows `settings.json` → Claude Code uses its default (prompt-on-everything) instead of the parent's `bypassPermissions`.

**The fix** (was already in session-open.sh): writes `{}` to project settings.local.json at every tab open. NOW has T2: `validate-bypass-settings.mjs` CRITICAL tier — every verify run checks both settings files. If either has wrong bypass state → EXIT:1.

**BLOCK-TEST**: `printf '{"permissions":{"allow":["Bash","Edit"]}}' > .claude/settings.local.json` → `node tools/validators/validate-bypass-settings.mjs` → `BLOCKING: .claude/settings.local.json has "permissions" WITHOUT "defaultMode:bypassPermissions"` → `EXIT:1`.

---

## 6. Protocol §10 Additions (H1+H2+H3)

**Three new mandatory closing steps added to `protocols.md`:**

- **§10.H1 HARDWIRE LEDGER CHECK**: `validate-hardwire-completeness.mjs` must exit 0 before close. Any hardwire-done row with empty block_test_output = BLOCKS close.
- **§10.H2 RELAY-HOOK FRESHNESS**: if council file written this session → assert last-proto-relay.txt mtime within session. Stale = relay hook decayed → blocker.
- **§10.H3 SP-CITED-DONE**: every DONE/SEALED claim cites SP verify_mechanically output. Cannot be "I ran it and it passed" — paste the actual output.

---

## 7. The Weekly Hardwire Audit — L2 Layer

`tools/scripts/weekly-hardwire-audit.mjs` — runs on schedule, does:
1. Runs SP-registry verify_mechanically commands (skips session-contextual, external, and not-yet-built)
2. Re-runs hardwire-register block_test_command synthetically for hardwire-done rows with one
3. Counts overdue floaters + in-progress HARDWIRE rows
4. Gap-recurrence: recurring findings from prev audit → gap-recurrence-register.yaml K-count

**BLOCK-TEST**: neuter bypass settings → run audit → observes `CRITICAL: SP "permission-bypass-active": verify_mechanically FAILED (exit 1)` → EXIT:1 ✓.

---

## 8. What S075 Opens

Per PROTO-S074-FINISH-ACCOUNTABILITY + s074-schedule.yaml:
- **PART 3 product schema** — confirmed top of order (Opus issues dedicated PROTO after S074 SEAL)
- **Opus Q1-Q4** on D11/governing_intent/recurring audit — in sonnet-turn.md
- **Floater backlog** (26 overdue) — 3/session triage starting S074/S075
- **Vercel dynamic-import risk** (vlt-S073-vercel-dynamic-import-risk) — first App deploy attempt

---

## 9. Carry-Forward Open Items

| Item | Status | Next action |
|---|---|---|
| Opus Q1-Q4 (D11 framing, ZF fix, recurring audit) | PENDING | Governor relays sonnet-turn.md to Opus-16 |
| ACCOUNTABILITY-HUB external-user branch (B3) | PLANNED | PART 3 trigger |
| P-OP-008 + P-META-030 final id from Governor | PENDING | Governor assigns |
| HARDWIRE-002 block_test_output | Done (b32ef21b) | ✓ |
| Live AI profiling page | DEPLOYED | csps-playground.vercel.app/platform/ai-behavior |

---

*Extraction authored by Sonnet S074 · OPIA ACCEPT-WITH-ONE-GATE from OPUS-16 · 2026-06-01*
