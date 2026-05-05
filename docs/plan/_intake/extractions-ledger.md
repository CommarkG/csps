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
| EXT-20260505-001 | 2026-05-05T03:50Z | AI_OTHER | low | clean | (parent of 6 sub-IDs A-F) | (parent — see children + governance/priority-engine + governance/intake + governance/token-optimization) | triaged | sub-IDs A-F routed; awaiting Governor PCR for engraving decisions | **CSP series #1 — PRIORITY_ENGINE_AND_WORK_ORCHESTRATION_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md.** Origin: CSP S336+/S337-prep. Sister doc QC_VALIDATION_ALIGNMENT_REPORT pending. 18-section comprehensive PE doctrine: formula + 5 dimensions + IMPL_IN_PROGRESS_boost + 7 invocation points + cross-CC PART-LEVEL bundling + Band 1/2/3 + PE_ALIGNMENT_GUARDIAN + 7 reassessment triggers + 4 pillars + mechanical layer (pe_compute.ps1 + cache + context_inject) + 8 composition points + 80/10/10 phase rule + multi-session arc + SWIFT/CC/Vault routing + Tier 1/2/3 adoption playbook. **HIGH-VALUE EXTRACT** — directly informs unified-intake topic-plan L2 envelope schema. |
| EXT-20260505-001-A | 2026-05-05T03:55Z | AI_OTHER | low | clean | governance/priority-engine | tools/templates/priority-engine.schema.yaml + B_GRADUAL_BUILD §6 + topic-plan template §6 | routed | PCR-required: Option A/B/C dimension reconciliation (CSPS Breadth/Depth/Impact/Blockers/PAS vs CSP Blast/Dependency/Idle/Bundle/PAS) | PE formula structure validates CSPS approach but **dimensions diverge in semantics despite same letter abbreviations**. Recommendation: Option C hybrid (keep CSPS dimensions + extract CSP mechanical-detection patterns). Multi-session arc work. |
| EXT-20260505-001-B | 2026-05-05T03:55Z | AI_OTHER | low | clean | governance/priority-engine | B_GRADUAL_BUILD_BY_FOUNDATIONS amendment OR new B_COMPLETION_DEBT_PRIORITIZATION + P-OP-002 FWWS extension | routed | PCR-required: amendment vs new contract | **HIGH-LEVERAGE: IMPL_IN_PROGRESS_boost** (+1.5/+2.0/+3.0). CSPS has FWWS philosophical principle but no mechanical boost in PE formula. Schema needs `implementation_status` enum + new validator + new hook. Directly relevant to unified-intake L2 — would mechanically enforce the "don't drift to new topic before L<N> closes" judgment I'm currently using. |
| EXT-20260505-001-C | 2026-05-05T03:55Z | AI_OTHER | low | clean | governance/priority-engine (NEW leaf candidate) + audit-hub.md Pipeline composition | governance/priority-engine.md (new canonical leaf) + tools/pe-compute.mjs (new tool) + tools/pe-context-cache.json (new schema) + new SessionStart hook | routed | PCR-required: 5 vs 7 invocation points (CSPS-adapted vs CSP-verbatim) | 7 mandatory PE invocation points + mechanical layer (pe_compute.ps1 pattern). CSPS has scattered invocation but no enumerated-mandatory list + no compute layer + no session-start brief. Multi-session arc; natural L2/L3 sub-deliverable in unified-intake topic-plan. |
| EXT-20260505-001-D | 2026-05-05T03:55Z | AI_OTHER | low | clean | governance/reassessment (new leaf candidate) + B_GRADUAL_BUILD_BY_FOUNDATIONS amendment | governance/reassessment-triggers.md + reassessment-log.md | routed | PCR-required: standalone vs amendment | 7 reassessment triggers (CSPS-adapted to 5: topic-plan layer transition / multi-session checkpoint / constitutional engraving / consecutive blocker / user explicit). CSPS has implicit per-layer ZF gate; needs enumerated + log. |
| EXT-20260505-001-E | 2026-05-05T03:55Z | AI_OTHER | low | clean | unified-intake topic-plan L2 + governance/intake + governance/humble-batching | unified-intake.md §2 envelope schema (route_to field) + B_INTAKE_DISCIPLINE umbrella + P-OP-004 humble-batching + new governor-input-vault.md | routed | **PRIORITY for L2 phase** | **DIRECT L2 IMPACT.** SWIFT/CC/Vault three-route model → IntakeEvent.route_to field design. Cross-CC PART-LEVEL bundling ("unit of work is the ADDITION") → retroactively validates S008 turn 5 humble-batching merger of Phase 5 hooks into unified-intake L1. Should be FIRST item L2 phase consumes when CSP-file work begins. |
| EXT-20260505-001-F | 2026-05-05T03:55Z | AI_OTHER | low | clean | governance/token-optimization (B_TOKEN_BUDGET extension) + cross-cutting (4-pillar consideration deferred) | B_TOKEN_BUDGET R6 (new) + measure-token-cost.mjs phase tracking + new context-budget hook | routed | PCR-required: 80/10/10 percentages + 5% floor enforcement | **80/10/10 session phase rule HIGH-VALUE** — extends B_TOKEN_BUDGET R3 with phase-aware compaction. **4-pillar balance metric LOWER-PRIORITY** — defer (CSPS 5-spine system + 4-pillar = dual-categorization complexity; CSPS-divergence too costly). |
| EXT-20260505-002 | 2026-05-05T04:30Z | AI_OTHER | low | clean | (parent of 6 sub-IDs A-F) | (parent — see children + governance/{validators,agent-discipline,audit-orchestration,mechanical-completion,review-discipline,operational-discipline}) | triaged | sub-IDs A-F routed; deep-dives scheduled per priority_for_10_phase_completion | **CSP series #2 — QC_VALIDATION_ALIGNMENT_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md (v2 post-consolidation).** 26-section comprehensive QC + Validation + Alignment toolkit: 5-element-pattern (already in CSPS) + validator class structure + smoke test + severity taxonomy + 7+3 active validators + Quality Audit Framework AID-NNN + 14 audit kinds + standing authorizations + 9-element DNA gate + Triple-check protocol + IVP 5+1 + L3 Expert Panel 6 voices + cruel-critic discipline + MECHANICAL_COMPLETION_DIRECTIVE + D1-D10 counter-default catalog + "false" lexicon + 5 known FP classes + 4-batch close + file_depth_markers + rigid-vs-flex + 5-prevention catalog + 10-scenario test. **EXCEPTIONAL VALUE D1-D10 catalog + MECHANICAL_COMPLETION_DIRECTIVE.** New pipeline-enhancement fields applied: mini_tree_layer + deep_dive_schedule + priority_for_10_phase_completion + consolidation_cross_refs. |
| EXT-20260505-002-A | 2026-05-05T04:35Z | AI_OTHER | low | clean | governance/validators (new leaf candidate) + tools/validators/* convention | validator-class-structure 6-commitments + smoke-test discipline + severity taxonomy | routed | DEFERRED to S010-S011 Phase 9 measurement-validator authoring | Validator class structure (STATEFUL/COMPOSABLE/EXIT-CODED/PIPELINED/SELF-DESCRIBING/GRADUATION-AWARE) + RED/YELLOW/GREEN/INFO/LEGACY severity + smoke-test discipline. Apply when authoring validate-token-budget.mjs Phase 9. |
| EXT-20260505-002-B | 2026-05-05T04:35Z | AI_OTHER | low | clean | governance/agent-discipline | B_AGENT_ALIGNMENT_PROTOCOL extension (7→9 fields) + Triple-check sub-protocol + Full DNA Coverage Audit | routed | DEFERRED to S009-S010 next skill/hook authoring | 9-element DNA gate (CSPS-adapted to 7-8 elements; drop spheres-RETIRED CSP-specific) + Triple-check (Pre-adoption ALREADY VIA validate-aap-frontmatter; add Mid + Post checks) + Full DNA Coverage Audit pattern. Composes with B_AGENT_ALIGNMENT_PROTOCOL S007 §24+ amendment. |
| EXT-20260505-002-C | 2026-05-05T04:35Z | AI_OTHER | low | clean | governance/audit-orchestration | audit-instance-registry.md (NEW; week-4) + AID-NNN system + audit-instance.template.md | routed | DEFERRED to week-4 audit-runner ship | Quality Audit Framework AID-NNN + 14 audit kinds (CSPS-adapted to 6) + standing authorizations. CSPS audit-hub.md has 10 pipelines but no per-instance ID; week-4 audit-runner is natural ship-point. |
| EXT-20260505-002-D | 2026-05-05T04:35Z | AI_OTHER | low | clean | governance/mechanical-completion | D1-D10 counter-default catalog + MECHANICAL_COMPLETION_DIRECTIVE template + "false" lexicon + 5 FP classes | routed | 🔥 **HIGH-LEVERAGE — RECOMMEND PCR FOR S009** | D1-D10 catalog (6 already in CSPS via memory entries 7/11/13/14; 4 NEW: D1/D3/D4/D5/D9/D10) + MECHANICAL_COMPLETION_DIRECTIVE pattern + 5 known FP classes (documentation-context / path-prefix / multi-line-regex / brace-escape / validator-self-reference). HIGHEST-VALUE EXTRACT in EXT-002 — directly maps to AI failure modes. |
| EXT-20260505-002-E | 2026-05-05T04:35Z | AI_OTHER | low | clean | governance/review-discipline + pillar-5-ai-systems/ | new review-discipline.md (3-tier escalation) + B_PCR_FOR_DECISIONS extension + B_CRUEL_CRITIC_REVIEW (new) + IVP/L3 subagent-spawn templates | routed | DEFERRED to S010-S011 first CONSTITUTIONAL change | IVP 6 personas + L3 Expert Panel 6 voices + cruel-critic discipline. CSPS B_PCR_FOR_DECISIONS exists; extend with blast-tiered escalation. Subagent templates require Mastra runtime (week-6+) OR Claude Code subagents (now). |
| EXT-20260505-002-F | 2026-05-05T04:35Z | AI_OTHER | low | clean | governance/operational-discipline + protocols.md §10 + frontmatter-standard | 5 sub-disciplines: 4-batch close + file_depth_markers + rigid-vs-flex + 5-prevention catalog + 10-scenario test | routed | MIXED readiness — file_depth_markers IMMEDIATE; others S009-S011 | 5 closely-related operational disciplines clustered. file_depth_markers IMMEDIATE adoption (already self-applied in EXT-002 + EXT-003 extracts). 10-scenario already in CSPS §14.5 (Phase 4d carry-forward). 4-batch close + rigid-vs-flex + 5-prevention scheduled S009-S011. |
| EXT-20260505-003 | 2026-05-05T04:30Z | AI_OTHER | low | clean | (parent of 4 sub-IDs A-D) | (parent — see children + governance/anti-duplication) | triaged | sub-IDs A-D routed; protocol IMMEDIATELY adopted; contract S009 PCR | **CSP series #3 — ANTI_DUPLICATION_AND_CONSOLIDATION_DISCIPLINE_REPORT_ON_CSP_prepared_by_CSP_2026-05-05.md.** 16-section discipline: single rule (each fact ONE canonical home) + 6 duplication patterns + 5-step Consolidation Pass protocol + 4 invocation triggers + composition with SCHEMA / Core Spines / 5-element-pattern / PE / validators + 6 counter-cases (when NOT to consolidate). **SELF-DEMONSTRATING** — applied its own discipline to PE Report v1→v2 + QC Report v1→v2 (commits f123768f + cd009466). CSPS receives v2 versions. **PROTOCOL ADOPTED THIS BATCH** — all EXT-002/003 extracts cross-reference EXT-001 instead of duplicating. |
| EXT-20260505-003-A | 2026-05-05T04:40Z | AI_OTHER | low | clean | governance/anti-duplication | new B_CONSOLIDATION_PASS contract + protocols.md §10 amendment + validate-consolidation.mjs (CSPS CD analog) | routed | ✅ DISCIPLINE ALREADY ADOPTED THIS BATCH; contract engraving S009 PCR | Single rule + 6 duplication patterns + 5-step protocol (Detect/Identify/Replace/Verify/Smoke-test). Heuristic threshold ≥3 occurrences. SELF-DEMONSTRATING (this batch already applies via cross-references). |
| EXT-20260505-003-B | 2026-05-05T04:40Z | AI_OTHER | low | clean | governance/anti-duplication | B_CONSOLIDATION_PASS invocation triggers + composition with EXT-001-D reassessment + audit-hub Pipeline 7 amendment | routed | DEFERRED to S009 with B_CONSOLIDATION_PASS engraving | 4 invocation triggers (same-batch comprehensive doc / P-GOV-24 reassessment / grep ≥3 / file_depth_marker overlap) + composition with PE invocation point #8. CSPS-adapted: add as 6th PE invocation point. |
| EXT-20260505-003-C | 2026-05-05T04:40Z | AI_OTHER | low | clean | governance/anti-duplication + pillar-1-architecture | feedback_csp_core_spine_absorptions.md amendment + B_CONSOLIDATION_PASS sub-rule | routed | MOSTLY DEFERRED — Pattern 1 schema-as-canonical-home ALREADY ADOPTED in CSPS | Schema-as-canonical-home (CSPS strongly adopted via frontmatter-closed-enums + principles.yaml + template-registry) + HUB-file-per-spine (CSPS L1_CORE_<SPINE>.md files ARE the equivalent). SPINE_TO_PILLAR_MAPPING analog deferred (CSPS no separate pillar layer). |
| EXT-20260505-003-D | 2026-05-05T04:40Z | AI_OTHER | low | clean | governance/anti-duplication | B_CONSOLIDATION_PASS counterweight subsection + new feedback_when_not_to_consolidate.md | routed | ✅ READY for S009 PCR engraving with Extract A | 6 counter-cases: L1 budget / local context / discoverability / citations / different-purpose-examples / mid-authoring premature. **Counter-case 5 + 6 IMMEDIATELY APPLY** (don't collapse intentionally-different-lens extracts; don't consolidate topic-plan unified-intake mid-authoring). |

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
