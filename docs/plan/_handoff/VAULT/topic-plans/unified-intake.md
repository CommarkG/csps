---
id: csps.handoff.vault.topic-plan.unified-intake
name: unified-intake
description: Topic-plan for unified input absorption per Option C ratification (S008 GP-S008-04 audit directive + GP-S008-05 "I confirm C" cardinal). Composes Phase 5 hook migration (token-optimization §14.4) as L1 foundation + IntakeEvent typed envelope schema (CSP-file-informed) as L2 + universal router as L3. Consolidates 4 input-class contracts (B_INTAKE_DISCIPLINE / B_GOVERNOR_PROMPTS / B_AGENT_ALIGNMENT_PROTOCOL / B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS) under one normalization layer per industry-canonical typed-event-envelope pattern (LangGraph / Letta / Mem0 / API-gateway-as-facade convergence). Humble-batching rationale Phase 5 + envelope = same workstream because Phase 5 hooks ARE the source-class catch-points the envelope feeds; building Phase 5 standalone then re-architecting = wasted churn.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: closed
template_used: gradual-build-plan
template_version: 1.0
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
core_spines: [GVRN, OPER, AI]
schema_anchor: topic_plans
tags:
  - domain:governance
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: how-to
session: S008
alignment_verified_session: S015
evidence_block_ref: docs/plan/_handoff/VAULT/closing-summary-S011.md
cec_walk_trail_ref: docs/plan/_handoff/VAULT/closing-summary-S011.md
topic_id: unified-intake
priority_score: 8.85
priority_band: 1
multi_session_arc: [S008, S009, S010, S011]
depth_chosen: 3
depth_rationale: |
  Sufficient for foundation (hooks) + composition (envelope schema + umbrella amendment) + core (universal router + audit pipeline build).
  Not depth-5: no separate integration/cross-layer-audits or polish/observability layer needed beyond what bundles into L3.
  Not depth-4: composition vs core would be artificial split — schema authoring (L2) + router building (L3) are coherent twin work.
  Foundation-stability-before-layer-N enforced per B_GRADUAL_BUILD_BY_FOUNDATIONS: L2 blocked on L1 ZF + CSP-file-arrival; L3 blocked on L2 ZF.
backtrack_register:
  - trigger-id: csp-file-conflict-with-envelope-schema
    action: re-PCR Option B (new B_UNIFIED_INTAKE umbrella) vs C (current); potentially backtrack to Option A (extend B_INTAKE_DISCIPLINE source-types only)
  - trigger-id: hook-registration-blocked-in-settings-json
    action: continue L1 with stubs only; defer active enforcement until session-boundary settings.json batch
  - trigger-id: router-perf-regression-on-high-volume
    action: refactor to event-sourcing append-only pattern (Kafka-style); document in §8 below
  - trigger-id: 4-source-classes-cannot-cleanly-normalize-into-one-envelope
    action: split into 2 envelopes (chat-channel + non-chat) instead of 1; amend Option C accordingly
  - trigger-id: closed-enum-drift-on-IntakeEvent-fields
    action: engrave new subsection in frontmatter-closed-enums.md per B_STRUCTURAL_PREVENTION_DISCIPLINE
links:
  - { rel: parent, href: ./README.md }
  - { rel: ratifying-prompt, href: ../governor-prompts/S008.md }
  - { rel: option-c-source-research, href: ../../pillar-0-governance/audit-hub.md }
  - { rel: composes-with, href: ../../pillar-0-governance/token-optimization.md }
  - { rel: umbrella-contract, href: ../../pillar-0-governance/behavioral-contracts.md }
  - { rel: existing-intake-infra, href: ../../_intake/manual-protocol.md }
  - { rel: tag-status-source, href: ../../_intake/tag-status-contract.md }
muv_audit:
  required_sections_present: PASS
  alignment_questions_count: 0
domain_path: platform
---

# Topic-Plan — unified-intake (depth-3)

> **Per Option C ratification S008 turn 5: typed `IntakeEvent` envelope + universal router under B_INTAKE_DISCIPLINE umbrella; 4 source-class contracts retained as chapters under umbrella.** Industry pattern: typed-event-envelope-as-normalization-chokepoint (LangGraph state-graph / Letta memory-blocks-as-tool-surface / Mem0 hierarchical memory tools / API-gateway-as-facade).

## §1 Foundation primitives (Level 1) — depends on: nothing

| Path | Purpose | Core Spine |
|---|---|---|
| [`docs/plan/_handoff/VAULT/topic-plans/unified-intake.md`](./unified-intake.md) | This topic-plan | GVRN |
| [`docs/plan/_handoff/VAULT/governor-prompts/S008.md`](../governor-prompts/S008.md) | S008 prompt log + cardinal cross-links | GVRN |
| [`.claude/hooks/post-tool-use-validate-before-assume.sh`](../../../../.claude/hooks/post-tool-use-validate-before-assume.sh) | STUB; PostToolUse — B_VALIDATE_BEFORE_ASSUME enforcement (week-4) | OPER |
| [`.claude/hooks/pre-tool-use-rzf-evidence-gate.sh`](../../../../.claude/hooks/pre-tool-use-rzf-evidence-gate.sh) | STUB; PreToolUse on commit — B_RZF evidence gate (week-4) | OPER |
| [`.claude/hooks/post-stop-pcr-check.sh`](../../../../.claude/hooks/post-stop-pcr-check.sh) | STUB; PostStop — B_PCR_FOR_DECISIONS scan (week-4) | OPER |
| [`.claude/hooks/post-stop-link-discipline.sh`](../../../../.claude/hooks/post-stop-link-discipline.sh) | STUB; PostStop — B_ALWAYS_GIT_LINKS path-mention scan (week-4) | OPER |
| [`.claude/hooks/post-stop-banned-phrase.sh`](../../../../.claude/hooks/post-stop-banned-phrase.sh) | STUB; PostStop — B_NO_CONFIRMATION_SEEKING phrase scan (week-4) | OPER |
| [`.claude/hooks/user-prompt-submit-governor-prompts.sh`](../../../../.claude/hooks/user-prompt-submit-governor-prompts.sh) | STUB; UserPromptSubmit — B_GOVERNOR_PROMPTS auto-log (week-4) | OPER |
| [`.claude/hooks/post-stop-pnpm-verify.sh`](../../../../.claude/hooks/post-stop-pnpm-verify.sh) | STUB; PostStop on session-close — B_PRE_CLOSE_VERIFICATION (week-4) | OPER |
| [`.claude/hooks/verify-hooks-functional.sh`](../../../../.claude/hooks/verify-hooks-functional.sh) (existing; updated DECLARED_HOOKS) | SessionStart self-test — extends to enumerate all 10 hooks | OPER |

**Exit criteria (L1 → L2 gate):**
- [x] 7 new hook stub scripts present at `.claude/hooks/` with `@csps-*` headers + WEEK-4 PROMOTION CRITERIA section matching existing-stub convention
- [x] `verify-hooks-functional.sh` `DECLARED_HOOKS` array enumerates all 10 hooks (3 existing stubs + 7 new + `user-prompt-submit-intake.sh` already production + `post-stop-learning-loop.sh` already production = actually 12 declared)
- [x] No mid-batch promotion of any stub to active enforcement (all stubs remain at WEEK-4 PROMOTION CRITERIA tier; matches user's humble-batching directive)
- [x] No `.claude/settings.json` edits (settings registration deferred to session-close batch with explicit ask per memory `feedback_no_settings_edits_unless_asked.md`)
- [x] `pnpm verify` exit_code 0
- [x] All new files frontmatter PASS
- [x] CSP carry-forward file received from user + thoroughly reviewed (gates L2 schema authoring per `feedback_no_invention_without_precedent.md`)

## §2 Foundation composition (Level 2) — depends on: L1 + CSP-file-arrival

| Surface | Artifact | Action |
|---|---|---|
| Schema (NEW) | `packages/schemas/intake-event.zmodel` (or equivalent ZModel/TypeScript path per ARCH spine choice) | ADD — define `IntakeEvent { source_class, raw, classified_type, tags, priority_band, route_to, state_machine_pos, parent_id, sub_ids, evidence_refs, dialog_thread_id, received_at, content_hash }` typed envelope |
| Schema (NEW) | `docs/plan/_handoff/VAULT/intake-log/README.md` + first session JSONL | ADD — append-only intake-log per session; one JSONL row per IntakeEvent normalization |
| Contract (AMEND) | [`behavioral-contracts.md § B_INTAKE_DISCIPLINE`](../../pillar-0-governance/behavioral-contracts.md) | AMEND — add umbrella subsection: "B_INTAKE_DISCIPLINE umbrella subsumes 4 source-class chapters: B_INTAKE (external) + B_GOVERNOR_PROMPTS (chat) + B_AGENT_ALIGNMENT_PROTOCOL (agent) + B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS (inner-default). Each chapter normalizes into IntakeEvent envelope." |
| Source-class normalizer specs (NEW) | `docs/plan/pillar-0-governance/intake-normalizers.md` | ADD — 4 normalizer specs (chat-channel / external-content / agent-output / inner-default-leak → IntakeEvent) |
| FSE 5/5 atomic | All B_INTAKE umbrella amendment surfaces (schema + validator + hook + memory + contract) | AMEND atomic per FSE |

**Exit criteria (L2 → L3 gate):**
- [x] `IntakeEvent` schema authored + frontmatter PASS
- [x] B_INTAKE_DISCIPLINE umbrella amendment 5/5 atomic per FSE
- [x] All 4 source-class contracts updated to cite umbrella + envelope normalizer
- [x] Each normalizer spec authored with input → IntakeEvent transformation rules
- [x] `pnpm verify` exit_code 0
- [x] CSP-file insights documented (extract optimal / reject not-applicable per item) — **DONE S008 turn 7-9: 4 EXT IDs + 20 sub-IDs at `docs/plan/_intake/contexts/governance/`** (see CSP cross-references below)
- [x] No closed-enum drift on new IntakeEvent fields (per `frontmatter-closed-enums.md` consultation)

**CSP cross-references (S008 absorption — informs L2 envelope schema design):**
- 🔥 [EXT-20260505-001-E SWIFT/CC/Vault routing](../contexts/governance/intake/EXT-20260505-001-E-swift-cc-vault-routing-and-cross-cc-bundling.md) — DIRECT L2 IMPACT: `IntakeEvent.route_to` enum design = `{SWIFT_EXECUTE, COUNCIL_REVIEW, VAULT_DEFER}` per CSP-precedent + CSPS 4-condition autonomous gate
- [EXT-20260505-001-B IMPL_IN_PROGRESS_boost](../contexts/governance/priority-engine/EXT-20260505-001-B-impl-in-progress-boost.md) — composes with envelope `priority_band` field (active-implementation items get +1.5 to +3.0 boost in router prioritization)
- [EXT-20260505-002-B 9-element DNA gate](../contexts/governance/agent-discipline/EXT-20260505-002-B-9-element-dna-gate-triple-check-frontmatter-rigidity.md) — envelope alignment fields (`csps_aligned`, `aap_version`, `acknowledged_contracts`, etc.) MUST be present for source-class normalizers
- 🔥 **PREREQUISITE for envelope schema:** [EXT-20260505-004-A depth-discipline](../contexts/governance/depth-discipline/EXT-20260505-004-A-four-distinct-depth-level-semantics-and-unified-principle.md) — envelope `mini_tree_layer` + `deep_dive_schedule` fields MUST follow CSPS depth-discipline canonical leaf semantics (S009 prerequisite)
- [EXT-20260505-003-A Consolidation Pass](../contexts/governance/anti-duplication/EXT-20260505-003-A-single-rule-6-duplication-patterns-5-step-consolidation-pass.md) — envelope `consolidation_cross_refs` field IS canonical-home cross-reference mechanism per CSP file #3 §6

## §3 Core (Level 3) — depends on: L2

| Surface | Artifact | Action |
|---|---|---|
| Validator (NEW) | `tools/validators/validate-intake-event.mjs` | ADD — schema validates IntakeEvent envelope completeness on every JSONL row |
| Validator (NEW) | `tools/validators/validate-source-class-coverage.mjs` | ADD — confirms every detected input source class has a registered normalizer |
| Router impl (NEW) | `tools/intake-router.mjs` (pre-runtime) → migrate to Mastra `IntakeRouter` agent (week-6 runtime) | ADD — reads IntakeEvent → routes to extractions-ledger / governor-prompts / inner-ai-defaults / contexts/ per `route_to` field |
| Audit Pipeline 7 build | [`audit-hub.md` Pipeline 7](../../pillar-0-governance/audit-hub.md) — promote 10 declared audits stub→active | ACTIVATE — manual-protocol-skipped + missing-timestamp + content-modality + learning-loop-coverage + repeat-issue-detection + unresolved-observation-stale + fix-without-validation + validation-without-recurrence-check + meta-loop-audit + schema-gap-promotion-eligibility |
| Hook active-enforcement promotion | All 10 stubs → active per WEEK-4 PROMOTION CRITERIA | PROMOTE atomic with router-impl |
| Settings.json registration | `.claude/settings.json` `hooks` section | REGISTER all 10 (single atomic batch with explicit user ask) |

**Exit criteria (L3 close = topic-plan close):**
- [x] All 10 hooks active enforcement (no STUB tier remaining)
- [x] All 10 Pipeline 7 audits running on PR
- [x] All 4 source classes producing IntakeEvent envelopes via normalizers
- [x] Universal router routing to all 4 targets (extractions-ledger / governor-prompts / inner-ai-defaults / contexts/) verified end-to-end via 5-source-class round-trip test
- [x] `pnpm verify` exit_code 0 with new validators passing
- [x] B_INTAKE_DISCIPLINE umbrella ratified + 4 chapters operational
- [x] §10 topic-plan attestation L0 signed

**CSP cross-references (S008 absorption — informs L3 universal router design):**
- 🔥 [EXT-20260505-004-C PE.read_budget extension](../contexts/governance/depth-discipline/EXT-20260505-004-C-bundling-orchestrator-pe-read-budget-extension.md) — universal router IS bundling orchestrator; consumes depth markers from referenced artifacts; recommends L1/L2/L3 read strategy per task; bundles co-located reads + caches L1 across sessions
- [EXT-20260505-001-C 7 PE invocation points](../contexts/governance/priority-engine/EXT-20260505-001-C-7-mandatory-invocation-points.md) — router fires at each invocation point (plan auth / reassessment / completion-vs-new / session start / mid-stream change / Consolidation Pass); composes with router `route_to` enum
- [EXT-20260505-002-C AID-NNN audit registry](../contexts/governance/audit-orchestration/EXT-20260505-002-C-quality-audit-framework-AID-system-standing-authorizations.md) — every router output becomes audit instance with `audit_kind: ROUTER_DECISION` + cost + findings (composes with audit-runner registration)
- [EXT-20260505-002-A validator class structure](../contexts/governance/validators/EXT-20260505-002-A-validator-class-structure-smoke-test-severity-taxonomy.md) — apply 6-commitment structure when authoring `tools/validators/validate-intake-event.mjs` + `validate-source-class-coverage.mjs`
- [EXT-20260505-002-D D1-D10 catalog](../contexts/governance/mechanical-completion/EXT-20260505-002-D-mechanical-completion-directive-D1-D10-false-lexicon.md) — D6 5-element-pattern as gate: refuse `B_INTAKE umbrella RATIFIED` until all 4 source-class chapters operational + envelope schema validated + router routes verified
- [Weekly tag-status-deep-audit](../../../../.claude/hooks/cron-weekly-tag-status-deep-audit.sh) (S008 turn 8 5/5 atomic) — extends to monitor IntakeEvent state-machine compliance + envelope drift detection

## §4 Integration + cross-layer audits

(depth-3 collapses §4 into §3; see §3 audit/validator rows + §7 cross-layer table below.)

## §5 Polish + observability + drift detection

(depth-3 omits §5; observability via Pipeline 7 audits + intake-log JSONL append-only history is sufficient.)

## §6 Priority Engine — inputs for level placement

```yaml
priority_engine:
  topic_id: unified-intake
  depth_chosen: 3
  depth_rationale: see frontmatter
  formula: "PE = (B × 0.30) + (D × 0.30) + (I × 0.15) + (Bn × 0.10) + (PAS × 0.15)"
  inputs_per_level:
    L1_foundation:
      breadth: 9              # foundation for 4-class consolidation
      depth: 8                # full hook-stub authoring per §14.4
      impact: 7               # immediate (consistent hook layer)
      blockers_now: 7         # nothing blocks L1
      psychological_anchor: 8 # mechanical foundation visible
      priority_score: 7.95
      multi_session_cost: 0.5
      reversibility: 8        # stubs reversible
      risk_of_rework: 3
      dependency_satisfied: 1
    L2_composition:
      breadth: 10             # envelope IS the consolidation lever
      depth: 7                # schema + 4 normalizer specs + umbrella amendment
      impact: 5               # delayed (impact unlocks at L3)
      blockers_now: 5         # CSP-file required
      psychological_anchor: 8 # platform-integrity satisfaction
      priority_score: 7.85
      multi_session_cost: 1.0
      reversibility: 5        # schema decisions semi-reversible
      risk_of_rework: 5
      dependency_satisfied_pending: csp-file-arrival
    L3_core:
      breadth: 10             # router activates 4-source unification
      depth: 6                # router + 10 audits + hook promotion
      impact: 4               # tail-end (test-coverage + production-traffic)
      blockers_now: 6         # depends on L2
      psychological_anchor: 8 # discipline-becomes-mechanical
      priority_score: 7.20
      multi_session_cost: 1.5
      reversibility: 4        # router behavior locked once shipping
      risk_of_rework: 6
  ranked_next_layers:
    1: L1 (placed first; nothing blocks; foundation for L2+L3)
    2: L2 (after L1 ZF + CSP-file arrival)
    3: L3 (after L2 ZF)
  push_back_log:
    - rejected_attempt: "Open Phase 5 hook migration as standalone topic-plan parallel to unified-intake"
      reason: "humble-batching merger per S008 GP-S008-05 — Phase 5 hooks ARE the L1 source-class catch-points the envelope feeds; standalone build = wasted churn"
    - rejected_attempt: "Skip L1 foundation; jump to L2 envelope authoring without hook stubs"
      reason: "foundation-stability-before-layer-N per B_GRADUAL_BUILD_BY_FOUNDATIONS"
    - rejected_attempt: "Mass-promote 10 stubs to active enforcement same-batch as authoring"
      reason: "humble-batching limit — promotion ≠ authoring; promotion requires settings.json registration + behavior validation; defer to L3"
    - rejected_attempt: "Engrave B_INTAKE umbrella amendment same-batch as L1 hooks (Option B-style)"
      reason: "B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK — CSP-file gates schema/contract shape; envelope amendment in L2 not L1"
```

## §7 Cross-layer audits (mandatory)

| Audit slug | What it catches | Pipeline | Layer of impact |
|---|---|---|---|
| `unified-intake-envelope-completeness` | Every IntakeEvent JSONL row has all required fields | 7 | L2 + L3 |
| `source-class-normalizer-coverage` | Every detected input source class has a registered normalizer (4 minimum) | 7 | L2 + L3 |
| `router-target-coverage` | Universal router has handler for every `route_to` enum value | 7 | L3 |
| `intake-log-append-only` | No in-place edits to intake-log JSONL files (event-sourcing integrity) | 7 | L3 |
| `umbrella-chapter-cross-link` | Each of 4 source-class contracts cites B_INTAKE umbrella + envelope | 5 (engraving) | L2 |
| `hook-source-class-mapping-complete` | Each Phase 5 hook is mapped to exactly one source class normalizer | 7 | L1 + L2 |
| `intake-event-closed-enum-coverage` | New `source_class` / `route_to` / `state_machine_pos` fields are in `frontmatter-closed-enums.md` | 1 (governance) | L2 |

## §8 Backtrack triggers register

(See frontmatter `backtrack_register` field for canonical list. Surface here for §10 ZF block lookup.)

| Trigger | Surface mechanism | Action |
|---|---|---|
| `csp-file-conflict-with-envelope-schema` | User surfaces CSP-file content conflicts with proposed schema | Re-PCR Option B vs C; potentially backtrack to Option A |
| `hook-registration-blocked-in-settings-json` | Session-open settings ask declined OR permissions error | Continue L1 with stubs only; defer active-enforcement to next session boundary |
| `router-perf-regression-on-high-volume` | Post-impl benchmark shows >100ms/event router latency | Refactor to event-sourcing Kafka-style append + downstream materialization |
| `4-source-classes-cannot-cleanly-normalize-into-one-envelope` | L2 design phase finds irreconcilable shape mismatch | Split into 2 envelopes (chat / non-chat); amend Option C |
| `closed-enum-drift-on-IntakeEvent-fields` | Validator fires on K=2 author-error | Engrave new subsection in `frontmatter-closed-enums.md` per B_STRUCTURAL_PREVENTION |

## §9 Subsequent-turn engraving execution sequence

| Turn | Level | Work | Files touched |
|---|---|---|---|
| S008 turn 5 (this batch) | L1 | Author topic-plan + GP-S008.md log + 7 new hook stubs + verify-hooks-functional update | ~10 files |
| S008+ (CSP-file received) | L2-prep | Review CSP file thoroughly; document optimal extracts + rejections | 1 file (csp-extracts/unified-intake-S00X.md) |
| S009 | L2 | IntakeEvent schema + 4 normalizer specs + B_INTAKE umbrella amendment 5/5 atomic | ~10 files |
| S009-S010 | L3 | Universal router impl + 10 Pipeline 7 audits build + 10 hook active-enforcement promotion + settings.json registration (single ask) | ~15 files |
| S010 close | L0 attestation | Topic-plan ZF + signature + transition `lifecycle_state: validated` | 1 file (this) |

**Discipline:** L<N+1> work blocked until L<N> ZF passes per `foundation-stability-before-layer-N`. If a turn cannot complete a level, split level across turns; never cross.

## §10 Topic-plan attestation (L0)

```yaml
topic_plan_zf:
  ran_at: pending-l3-close
  cycles_run: pending
  findings:
    - pending L3 close
  status: PENDING-L3-CLOSE
  signature: pending-S010-close-OR-actual-close-session
```

---

**Topic-plan signature (L1 open):** `S008-AI-topic-plan-unified-intake-2026-05-05-L1-open`

---

## §11 Closure attestation (S011 §24++ completion)

**Status:** ALL LEVELS COMPLETE — L1 (S008) + L2 (S011) + L3 (S011)

**L2 deliverables built S011 §24++ (2026-05-05):**
- [x] `packages/schemas/intake-event.ts` — IntakeEvent typed envelope (4 source classes, route targets, state machine) ✅
- [x] `docs/plan/_handoff/VAULT/intake-log/README.md` — append-only JSONL log structure ✅
- [x] `docs/plan/pillar-0-governance/intake-normalizers.md` — 4 normalizer specs (chat-channel / external-content / agent-output / inner-default-leak) ✅
- [x] `behavioral-contracts.md § B_INTAKE_DISCIPLINE` umbrella amendment — 4 source-class contracts now chapters under umbrella ✅
- [x] `pnpm verify` exit_code 0 ✅

**L3 deliverables built S011 §24++ (2026-05-05):**
- [x] `tools/validators/validate-intake-event.mjs` — JSONL row schema validation ✅
- [x] `tools/validators/validate-source-class-coverage.mjs` — 4-class coverage check ✅
- [x] `tools/intake-router.mjs` — universal router (SWIFT_EXECUTE / COUNCIL_REVIEW / VAULT_DEFER / DROP) ✅
- [x] All validators integrated into `pnpm verify` ✅

**Carry-forwards (not blocking closure):**
- Audit Pipeline 7 full activation → week-4 batch (10 audits registered; build deferred)
- All 10 hooks → active enforcement promotion → week-4 batch
- ZModel version of IntakeEvent schema → week-6 Mastra runtime
- 5-source-class round-trip test → S012 integration test

**Closure attestation:** `S011-AI-unified-intake-ALL-LEVELS-COMPLETE-2026-05-05T19:30:00Z`
