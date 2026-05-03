---
id: csps.intake.extractions-ledger
name: external-input-extractions-ledger
description: The running log of every external input the AI has received during the pre-runtime period. One row per EXT-ID. Append-only. Never edit-in-place; if a state changes, append a new state-transition row. This is the manual equivalent of `public.external_input` + `public.learning_loop_item` joined; once runtime ships (week 4 / week 6), a one-shot migration script ports this into the database preserving every EXT-ID.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocol, href: ./manual-protocol.md }
  - { rel: contexts, href: ./contexts/README.md }
---

# Extractions Ledger

> **Append-only ledger of every external input received. No silent drops. No forgotten uploads.**

## Format

Each row records one external input + one state-transition. Columns:

| Column | Meaning |
|---|---|
| `EXT-ID` | Unique extraction ID (`EXT-YYYYMMDD-NNN`) |
| `received_at` | ISO timestamp |
| `source_type` | enum from `source-types.md` |
| `risk` | low / medium / high |
| `scan_status` | clean / quarantined / skipped |
| `contexts` | comma-separated list of contexts the input fan-out hit |
| `routed_to` | downstream artifact references (leaf doc / ADR / new principle / etc.) |
| `state` | observed / triaged / routed / fixing / validated / closed (per Learning Loop pipeline) |
| `next_action` | what needs to happen next (or "—" if state is closed) |
| `notes` | session reference, user-context, anything material |

State transitions: append a NEW row when state changes; do not edit prior rows. The chain of rows for one EXT-ID is the audit trail.

## Ledger entries

| EXT-ID | received_at | source_type | risk | scan_status | contexts | routed_to | state | next_action | notes |
|---|---|---|---|---|---|---|---|---|---|
| EXT-20260502-001 | 2026-05-02T15:00Z | HUMAN_CHAT | low | clean | (parent of 4 sub-IDs) | (parent) | triaged | sub-IDs A,B,C validated; D pending review | Treasure #3 (S002 turn 6 inline proposals); 4 sections; multi-section parent. SCHEMA-GAP signal triggered K=1 for `governance/handoff-protocol-mechanics` leaf proposal. |
| EXT-20260502-001-A | 2026-05-02T15:05Z | HUMAN_CHAT | low | clean | cross-cutting (gov: stewardship + learning-loop + adr-process) | protocols.md §16 v1.2 | validated | recurrence-check 2026-08-01 | Intent-to-impact validation proposal; ACTED ON SAME-TURN — protocols.md v1.1→v1.2 ships §16. lifecycle_state: promoted. |
| EXT-20260502-001-B | 2026-05-02T15:06Z | HUMAN_CHAT | low | clean | cross-cutting (gov: stewardship + learning-loop) | protocols.md §17 + §11b v1.2 | validated | recurrence-check 2026-08-01 | Two-sided handshake proposal; ACTED ON SAME-TURN — protocols.md adds §17 closing checklist + §11b fresh-chat attestation. lifecycle_state: promoted. |
| EXT-20260502-001-C | 2026-05-02T15:07Z | HUMAN_CHAT | low | clean | governance/learning-loop | insights.md + learning-loop.md industry-parallels | validated | recurrence-check 2026-08-01 | Constitutional reference (CSP S192 — memory-vs-mechanical); independent platform validation of P-META-001/004/005 design. Append to insights vault. |
| EXT-20260502-001-D | 2026-05-02T15:10Z | HUMAN_CHAT | low | clean | intake/dashboard-plan + operations/dashboards | _intake/dashboard-plan.md | routed | dashboard-plan.md created; week 4-12 build-order | Dev front-end dashboard plan; 6 admin pages spec'd. Cross-routed: intake (recursive — about intake) + operations/dashboards (planned leaf). |
| EXT-20260502-002 | 2026-05-02T16:30Z | AI_OTHER | low | clean | (parent of 8 sub-IDs) | (parent) | triaged | extract sub-IDs A–H | **Treasure #1 — AI_BEHAVIOR_AUTONOMY_AUDIT from CSP** (was visible in S002 turn 7 message — AI prior failed to detect; B_VALIDATE_BEFORE_ASSUME engraved). Origin: `other-app` / `csp-platform`. CARRY-FORWARDS: 4 conditions for autonomous execution + 8 checkpoint categories + 5-element engraving pattern + trust calibration. ABSORBED into ai-behavior-spine.md + behavioral-contracts.md (S002 turn 7). |
| EXT-20260502-003 | 2026-05-02T16:31Z | AI_OTHER | low | clean | (parent of 7 sub-IDs) | (parent) | validated | post-process: protocols.md v1.2 already aligned | **Treasure #2 — SESSION_LIFECYCLE_PROTOCOL from CSP**. VALIDATES protocols.md v1.2 (intent-to-impact + two-sided handshake) + ENHANCES with continuity-manifest signature format + opening-receipt format + targeted-read pass-protocol + handoff Zone A/B/C/D structure + state-declaration fixed-format. lifecycle_state: promoted (work it proposes already shipped this turn). |
| EXT-20260502-002-A | 2026-05-02T16:32Z | AI_OTHER | low | clean | governance/operating-principles | behavioral-contracts.md § B_AUTONOMY_4_CONDITIONS | validated | recurrence-check 2026-08-01 | "4 conditions for autonomous execution" (ratified scope + reversible + mechanical + no cross-actor). Verbatim adoption in behavioral-contracts.md. |
| EXT-20260502-002-B | 2026-05-02T16:33Z | AI_OTHER | low | clean | governance/operating-principles | behavioral-contracts.md § B_CHECKPOINT_8_CATEGORIES | validated | recurrence-check 2026-08-01 | "8 checkpoint categories" (constitutional / cross-tier / external / circulated / irreversible / scope-expansion / strategy-pivots / high-stakes-one-shot). Verbatim adoption. |
| EXT-20260502-002-C | 2026-05-02T16:34Z | AI_OTHER | low | clean | governance/mechanical-enforcement | ai-behavior-spine.md (the 5-element matrix) | validated | recurrence-check 2026-08-01 | "5-element engraving pattern" (schema + validator + hook + memory + contract). The CONSOLIDATION FRAMEWORK that ai-behavior-spine.md uses to score each discipline. |
| EXT-20260502-002-D | 2026-05-02T16:35Z | AI_OTHER | low | clean | cross-cutting (governance/learning-loop + governance/audit-runner) | (referenced in ai-behavior-spine.md) | triaged | needs explicit "trust calibration" doc | "Trust grows / shrinks" mechanism. Currently referenced; no dedicated doc yet — schema-gap candidate (K=1) for `governance/trust-calibration` leaf. |
| EXT-20260502-003-A | 2026-05-02T16:36Z | AI_OTHER | low | clean | governance/stewardship-protocol + cross-cutting | protocols.md §10 (closing protocol) | validated | recurrence-check 2026-08-01 | "7-step session close protocol". CSPS protocols.md §10 already has this shape; ENHANCED with CSP's signature/receipt format + Zone A/B/C/D handoff structure (deferred to next handoff). |
| EXT-20260502-003-C | 2026-05-02T16:37Z | AI_OTHER | low | clean | cross-cutting (governance/stewardship + governance/learning-loop) | protocols.md §17 + §11b v1.2 | validated | recurrence-check 2026-08-01 | "Two-sided handshake — 4-phase mutual confirmation". VALIDATES protocols.md v1.2 + adds CSP-specific structured-payload + signature/receipt schema. Was already aligned in S002 turn 6-7. |
| EXT-20260502-003-D | 2026-05-02T16:38Z | AI_OTHER | low | clean | governance/stewardship-protocol | protocols.md §16 v1.2 + behavioral-contracts.md § B_INTENT_TO_IMPACT | validated | recurrence-check 2026-08-01 | "Step 5b intent-to-impact tagging". VALIDATES protocols.md §16 v1.2 (independent platform evidence). |
| EXT-20260502-004 | 2026-05-02T18:00Z | AI_EXTRACTION | low | clean | governance/adr-process | _intake/contexts/governance/adr-process/EXT-20260502-004-decision-alternatives-S002.md | routed | recurrence-check 2026-08-01 | Decision-alternatives archive per user S002 turn 9 directive ("save all parts not included for future assessments"); 7 BLKs × non-recommended options preserved with rejection rationale + re-assessment conditions. |
| EXT-20260502-005 | 2026-05-02T20:00Z | AI_OTHER | low | clean | (parent of 24 sub-IDs A-X) | (parent — see children + zero-findings-discipline.md) | validated | recurrence-check 2026-08-01 | **Treasure #5 — REAL_ZERO_FINDINGS_DISCIPLINE_from_CSP_S333.md.** Origin: `other-app` / `csp-platform-S333`. Comprehensive RZF transfer (L1/L2/L3 tier-authored). User S002 turn 10 EXTENDS with CEC (Complete Extraction Cycle — positive branch addressing AI's universal negative-only-validation pattern). ABSORBED into P-META-006 + B_RZF + B_CEC + zero-findings-discipline.md (NEW canonical leaf) + 3 memory entries + 3 audits + F9 + AGENTS.md hard NOs (3) + protocols.md §19/§20 + manual-protocol Step 6b + learning-loop K=2 composition + stewardship cycle metadata + dashboard /admin/intake/zero-findings page. lifecycle_state: promoted. |
| EXT-20260502-005-A through W | 2026-05-02T20:01Z | AI_OTHER | low | clean | various per-section routing | governance/* + _intake/* + behavioral-contracts.md | validated | recurrence-check 2026-08-01 | 23 sub-IDs absorbing CSP-direct RZF content (3 check types / 7 triggers / 8 anti-patterns / cycle structure / evidence-block format / state machine / handshake integration / 12-step adoption checklist / open research questions). All routed to specific governance leaves. |
| EXT-20260502-005-X | 2026-05-02T20:02Z | AI_OTHER | low | clean | governance/zero-findings-discipline (NEW leaf) + governance/behavioral-contracts.md § B_CEC | zero-findings-discipline.md + behavioral-contracts.md | validated | recurrence-check 2026-08-01 | **The user-extension sub-ID** — Complete Extraction Cycle (CEC). Positive branch counterpart to RZF's negative branch. Catches AI's universal failure pattern of negative-only validation. Folded into P-META-006 as CSPS-specific extension. |

### Schema-gap registry entries

| proposed_leaf_name | proposed_pillar | first_seen | k_count_90d | k_count_lifetime | latest_ext_id | state |
|---|---|---|---|---|---|---|
| handoff-protocol-mechanics | governance | 2026-05-02 | 1 | 1 | EXT-20260502-001 (A+B) | observed (K=1; if recurs within 90d → ADR draft) |
| trust-calibration | governance | 2026-05-02 | 1 | 1 | EXT-20260502-002-D | observed (K=1) |
| ai-behavior-autonomy | governance | 2026-05-02 | 1 | 1 | EXT-20260502-002 (A+B+C) | promoted (absorbed into spine + behavioral-contracts as B_AUTONOMY_4_CONDITIONS + B_CHECKPOINT_8_CATEGORIES) |
| zero-findings-discipline | governance | 2026-05-02 | 1 | 1 | EXT-20260502-005 | promoted (turn 10) — absorbed as P-META-006 + new leaf zero-findings-discipline.md + B_RZF + B_CEC. NEW dedicated leaf created (not just contract addition) because the discipline has substantial state machine + cycle structure + evidence-block format + walk-trail format that warrants dedicated canonical doc. |

## Summary counts (refresh on every chat-close)

| State | Count |
|---|---|
| observed | 0 |
| triaged | 3 (parent EXT-20260502-001 + parent EXT-20260502-002 + EXT-20260502-002-D) |
| routed | 1 (EXT-20260502-001-D — dashboard plan, awaiting dashboard build) |
| fixing | 0 |
| validated | 9 (1-A/B/C + 2-A/B/C + 3 + 3-A/3-C/3-D — proposals acted same-turn) |
| closed | 0 (recurrence-checks scheduled 2026-08-01) |
| **Total tracked** | **13 (3 parents + 10 sub-IDs)** |

| Risk profile distribution | Count |
|---|---|
| low | 13 |
| medium | 0 |
| high | 0 |
| quarantined | 0 |

| Origin distribution (S002 turn 7 stamping) | Count |
|---|---|
| human-user | 5 (treasure #3 + sub-IDs) |
| other-app (csp-platform) | 8 (treasures #1 + #2 + sub-IDs) |
| online-sourced | 0 |
| internal-csps | 0 |
| near-miss-reported | 0 |

## How to add an entry (for the AI processing inputs)

Per `manual-protocol.md` step 6: every input that enters the system gets exactly one creation row here. State transitions append new rows. The session AI updates this ledger before the closing summary, never after.

When the user uploads multiple files at once: one EXT-ID per file (or per logically distinct unit), not one EXT-ID for the batch. Multi-file batches get a `batch_id` in notes if grouping matters for downstream review.

## Migration to runtime (planned, week 6)

When the LearningLoopItem table ships:

1. Migration script reads this markdown ledger.
2. Each row INSERTs a `public.external_input` row + N `public.learning_loop_item` rows (one per context routed).
3. The `parent_input_id` link is preserved.
4. The `state` column maps directly to `pipeline_state`.
5. After successful migration, this file's `lifecycle_state` becomes `resolved` → `deprecated`.

The migration script lives at `tools/intake/migrate-manual-ledger.ts` (TBD; ships week 6).

## Why this exists

Pre-runtime, the AI's session memory is the only "in-memory queue" for received inputs. Session memory dies at session end. Without this ledger, an upload received in S002 chat-1 would be lost when chat-2 opens. The ledger is the durable record that survives chat-jump.

This is **exactly** the user's stated concern: *"I must be sure that once pasted or uploaded they will be processed and not forgotten."* The ledger is the structural answer.
