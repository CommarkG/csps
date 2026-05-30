---
id: csps.handoff.CORE-SEEDS-PLAN-PARTS
name: CORE-SEEDS-PLAN-PARTS
description: >
  Permanent, inheritable core seeds for every plan part (PARTS 2-8 of MASTER-RE-GATE-PLAN-S068
  + the S069 Communication Schema + Journey Doctrine). Each is a MINI-NODE: an architectural
  anchor + its alignments (what it inherits from / connects to) + status. Authored by OPUS-13
  so any fresh tab inherits aligned intent for each part — building to intent, not to defaults.
  This is the single canonical core-seed index; handoffs reference it (do not re-copy).
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: planned
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: handoff_files
version: "1.0"
session: S069
owner: group:finky
authored_by: OPUS-13
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic, core-maximal]
ns_path: "this → GVRN spine → North Star (build-to-intent via inherited seeds)"
context_question: "Before building any plan part: have I read its core seed here — its anchor + alignments — so I build to intent, not to my defaults?"
context_quote: "Nothing stands alone; every part inherits its DNA + alignment from a declared seed. — CSPS"
inherits_from: "MASTER-RE-GATE-PLAN-S068 + PLAN-S069-COMMS-AND-JOURNEY + INHERITANCE-MODEL + communication-protocol-shared.md"
links:
  - { rel: master-plan, href: MASTER-RE-GATE-PLAN-S068.md }
  - { rel: s069-plan, href: PLAN-S069-COMMS-AND-JOURNEY.md }
  - { rel: opus-directives, href: ../../../tools/council/opus-turn.md }
---

# CORE SEEDS — Plan Parts (mini-nodes)

> Each node: **ANCHOR** (the architectural intent) · **ALIGNS** (inherits-from / connects-to) · **STATUS**. Permanent + inherited at every tab boundary. Reference this; do not re-copy.

## NODE — PART 2 · Threshold
**ANCHOR:** the classification brain — every input's `{spine, pipeline, place, criticality, audience_tier}` decided here. routeInput wired into [user-prompt-submit-intake.sh](.claude/hooks/user-prompt-submit-intake.sh) at M6 (the 4/532 fix). Router is stateless + tenant-shardable + fast/slow-path + brownout-equipped (M8). PLACE-NOT-FOUND explicit catch-all (never silent default, M7).
**ALIGNS:** extends M-42 router (no parallel) · CIP `PROPOSED-CHANGE` route sits ON TOP as 11th class (S072 P1) · 14 input_classes (10 base + 4 expansion per cornerstone) all unique-routed.
**STATUS:** **SEALED at cb925cd1 (S071 M9, OPUS-14 15-point OPIA ACCEPT)** · measurement window post-S071 will prove ≥95% routed (currently infrastructure-ready, 4/532 baseline cited in [council-invocation-log.yaml](tools/data/council-invocation-log.yaml) header).

## NODE — PART 3 · Product Schema
**ANCHOR:** 3-layer profile→product; every entity carries `tenant_id` + RLS (mandatory).
**ALIGNS:** foundation slices (User/Tenant/AuditEvent) · Core-Maximal (apps bundle core, build nothing net-new) · audience-hierarchy end-user tier (product comms).
**STATUS:** not started.

## NODE — PART 4 · Governance Constitution
**ANCHOR:** the 10 doctrines unified as one constitution.
**ALIGNS:** Core-Spine precedence GVRN>VALD>ARCH>AI>OPER (P-ARCH-028) · the B_* contracts · P-META/ARCH/OP principles.
**STATUS:** not started.

## NODE — PART 5 · Question Placement
**ANCHOR:** questions are first-class governance artifacts (CAQ) — define where each type lives + when it fires.
**ALIGNS:** RULE 15 CAQ · threshold (questions route) · contextual-locality (question at point of use).
**STATUS:** not started.

## NODE — PART 6 · Page-Type Templates
**ANCHOR:** 10 archetypes (incl. DashboardTemplate) — reusable page contracts.
**ALIGNS:** UX 7-rules · the comms dashboard · Journey Doctrine (a page IS a journey step).
**STATUS:** not started.

## NODE — PART 7 · Frictionless Onboarding
**ANCHOR:** the first journey a participant takes; built on PART 2+3+6.
**ALIGNS:** Journey Doctrine (optimal order · early-win · progressive disclosure) · audience-hierarchy (onboard per tier).
**STATUS:** not started (needs 2+3+6).

## NODE — PART 8 · Developer's Journey
**ANCHOR:** re-walk the 9 INFRA-FLOW steps with the full S069 stack (B_HUMBLE · B_META_QUESTION · D1-D13 · OPIA · NodeFile · Journey Doctrine · activation language) → app-creation-ready. The culmination.
**ALIGNS:** needs PART 2+3+7 · every step embeds the Journey Doctrine · Governor must SEE it to ratify.
**STATUS:** not started (needs 2+3+7).

## NODE — Communication Schema (S069)
**ANCHOR:** communication as first-class core — situations × handling + AI→Human 6-tier audience hierarchy (Governor / core-dev / external-dev / account-owner-admin / team-leader / end-user). Wired to ai-behavior-spine (the AI is the communicator; its defaults distort comms). `governing_principle: P-META-028`.
**ALIGNS:** extends communication-protocol-shared.md · consolidates the 9 B_* comms contracts under it · threshold classifies audience_tier at ingress (PART 2 SEALED) · /platform/communication dashboard live.
**STATUS:** **RATIFIED + IMPLEMENTED** (S071 Turn 1 ratification flip · M2 + Facet C glossary at line 222 of [vocabulary.md](docs/plan/pillar-0-governance/vocabulary.md) · `validate-vocabulary-coverage.mjs` advisory).

## NODE — Journey Doctrine (S069)
**ANCHOR:** what makes a journey good — optimal order, readiness, progressive disclosure, peak-end, the avoid-list. System-wide (onboarding · handoff · session · app-build), not dev-journey-only.
**ALIGNS:** PART 7+8 · comms-schema (a journey IS communication) · CIP (no local-optimization that harms the whole) · canonical for the dev-journey + user-journey Vercel pages.
**STATUS:** **RATIFIED + IMPLEMENTED** (S071 Turn 1 ratification flip + cross-ref line 66 to vocabulary.md added M2).

## NODE — CIP (Change-Impact Pipeline, S069)
**ANCHOR:** no change lands without STAGE → RIPPLE-QC (multi-direction, never self-test) → NET-IMPACT (net-positive only) → THRESHOLD (PROPOSED-CHANGE class — 11th in router) → TERMINAL (RATIFIED+IMPLEMENTED | VAULTED-with-trigger | REJECTED-with-reason | SUPERSEDED). Prevents local-fix-harms-global.
**ALIGNS:** sits ON TOP of the wired threshold (PART 2 SEALED cb925cd1) · extends prevention-class register + vault + unified-plan · composes with PLATFORM-OBSERVATION L5 (audit findings → CIP staging) · LIVED-INSTANCE-IT-WOULD-CATCH: the e662f587 sacred-file-protection regression (dialog fix achieved zero-dialogs but silently dropped sacred-file protection on the Bash path).
**STATUS:** **UNBLOCKED → S072 P1** (Governor S071 Turn 22 Option D LOCKED). 3 CIP milestones from PROTO-S069-CIP: M1 staging schema + validate-prior-plan-conflict · M2 multi-direction ripple-QC orchestration + council-registry fix · M3 PROPOSED-CHANGE route + validate-cip-terminal-coverage + PREVENTION→threshold wire. OPUS-14 authors PROTO-S072-CIP in opus-turn.md first.

## NODE — Cornerstone P-META-028 · Context-Refined Communication (S071)
**ANCHOR:** "Context-Refined Communication is the Primary Prevention Tool." However deep an insight, if communicated rigidly or without context, the intent never delivers. Every instruction/number/rule/definition wrapped (sample — expandable / tunable / allowlisted); no silent caps. Sits above the comms-schema.
**ALIGNS:** [packages/principles/principles/P-META-028-context-refined-communication.yaml](packages/principles/principles/P-META-028-context-refined-communication.yaml) slice · bidirectional cross-refs to communication-schema.yaml + prevention-class register · `is_cornerstone: true` · enforces Facets A-F (all M5).
**STATUS:** **RATIFIED + 6 FACETS ENFORCED** (S071 Turn 1 + M1 cornerstone registration + Facets A/B/C/D/E/F across M1-M5). `validate-context-wrapped-numbers.mjs` advisory + `validate-nominal-rzf-detector.mjs` sibling family.

## NODE — Long-Run Builder Doctrine (S071)
**ANCHOR:** within a ratified plan, builder runs from start to SEAL — pausing ONLY for R1-R9 real stops (Governor interrupt · BLOCKING verify · off-plan design decision · ASK-OPUS-STOP · OPIA COURSE-CORRECT · context <20% · sacred-edit denied · TS design-choice · plan-reshaping gap), NEVER for N1-N8 nominal stops (confirmation-seeking · over-caution · end-of-milestone ACK · mid-batch status · advisory validator · typo/lint · understanding-check · scope-creep). Closes the EXISTS≠ACTIVE on B_AUTONOMOUS_BATCH_WITH_PREFLIGHT (S016 CONSTITUTIONAL was T1=none + T2=none + wrong exempt_reason).
**ALIGNS:** [docs/plan/pillar-0-governance/LONG-RUN-BUILDER-DOCTRINE.md](docs/plan/pillar-0-governance/LONG-RUN-BUILDER-DOCTRINE.md) · consolidates B_AUTONOMOUS_BATCH (GO) + B_CONSENSUS_BEFORE_PROCEEDING (STOP) + B_NO_CONFIRMATION_SEEKING (memory) + milestone-run · T1: pre-tool-use-nominal-stop-detector.sh · T2: validate-no-nominal-stops-mid-milestone.mjs · T3: session-open-context.mjs injection · AGENTS.md hard NO.
**STATUS:** **RATIFIED + 5-SURFACE ENFORCED** (Governor S071 Turn 7 + M0.7 build). Sonnet S072 inherits at session-open.

## NODE — RZF-LATEST v1.1 (S071)
**ANCHOR:** Real Zero Findings — a DONE claim cites this-turn verify whose top-level `$?`=0 AND Cycle 2+ names specific files (with extensions) re-examined. Failure modes named taxonomy: **FCC** (False Completion Claim — parent class · S070 M3 dashboard-404 inaugural) · **EP-008 nominal-RZF** (subclass of FCC — "0 new findings" without naming areas) · **PSP** (Premature Satisfaction Point — claiming termination by consulting one signal when multiple required · S014 single-source-navigation inaugural). Classify-before-fix: BLOCKING / ADVISORY / DEFERRABLE-to-vault-pending. `verify_top_exit:<int>` un-fakeable structured field mandatory M1+.
**ALIGNS:** [docs/plan/pillar-0-governance/RZF-LATEST.md](docs/plan/pillar-0-governance/RZF-LATEST.md) v1.1 · external research absorbed S071 Turn 9 (3 accepted / 6 rejected — decision-of-record at [_handoff/VAULT/external-input/rzf-refined-definition-S071/INDEX.md](docs/plan/_handoff/VAULT/external-input/rzf-refined-definition-S071/INDEX.md)) · post-edit-verify trap (§5) named.
**STATUS:** **RATIFIED v1.1** (S071 Turn 9 Governor ratification of amendment).

## NODE — ONE-SOURCE-OF Doctrine (S071, S072-queued)
**ANCHOR:** Every concept on the platform has exactly ONE canonical source; everything else REFERENCES it; **creation** of a new concept is gated by a canonical-search check, so scatter is prevented at the moment of birth — not chased afterwards.
**ALIGNS:** [docs/plan/pillar-0-governance/ONE-SOURCE-OF-DOCTRINE.md](docs/plan/pillar-0-governance/ONE-SOURCE-OF-DOCTRINE.md) · inherits P-META-029 humble-consolidation + B_CONSOLIDATION_PASS + validate-nothing-stands-alone + INHERITANCE-MODEL + P-META-028 · 4 creation-time prevention points (P1 threshold INVOKE consolidation-expert · P2 pre-tool-use-canonical-search-gate.sh · P3 inherits_from validation against CSR · P4 weekly-consolidation-audit.mjs).
**STATUS:** **DRAFT — Q1=HOLD-S072** (Governor S071 Turn 4). M10 build queued S072 P2: tools/data/canonical-source-register.yaml (9-row seed) + tools/scripts/new-artifact.mjs + .claude/hooks/pre-tool-use-canonical-search-gate.sh (Bash + SACRED) + extended validate-nothing-stands-alone + weekly-consolidation-audit + /platform/canonical-register page. Adds `creation-request` as 11th threshold input class.

## NODE — AI-PROFILING → Communication Feedback (S071, partial; ADJUST/INJECT/MEASURE S072-queued)
**ANCHOR:** Closed feedback loop: OBSERVE D1-D13 firings per tier → AGGREGATE → ADJUST `activation_language` per `{situation, tier}` → INJECT counter-programming → MEASURE drop-off. The platform's AI is the communicator; its training defaults are the drift source; only a feedback loop tunes them.
**ALIGNS:** [docs/plan/pillar-0-governance/AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md](docs/plan/pillar-0-governance/AI-PROFILING-TO-COMMUNICATION-FEEDBACK.md) · extends ai-profiler.sh hook + caq-patterns.yaml + D1-D13 registry + ai-behavior-signals.jsonl (now mandates `audience_tier` per M5) + communication-schema.yaml activation_language[] · ADJUST stage = MEASURE-AGAIN of PLATFORM-OBSERVATION pipeline (general case is the abstract; this is the per-tier instance).
**STATUS:** **DRAFT — Q2=HOLD-S072 (Governor S071 Turn 5)**. M5 built OBSERVE+AGGREGATE stages (`audience_tier` mandated + backfill). S072 P3: profile-to-activation-language.mjs (K≥3 rolling-7-day-window → draft pair → governed path) + ADJUST/INJECT/MEASURE + /platform/ai-profile page.

## NODE — PLATFORM-OBSERVATION Doctrine (S071, S072-queued)
**ANCHOR:** Every recurring observation of platform reality flows through ONE named pipeline: OBSERVE (existing audits/signals/intake-stages) → AGGREGATE (POS snapshot) → CLASSIFY (RZF-LATEST v1.1 BLOCKING/ADVISORY/DEFERRABLE) → ROUTE (threshold M6+, input_class=observation_finding) → STAGE (proto/PREVENTION/vault) → RATIFY (Governor) → IMPLEMENT (Sonnet next milestone) → MEASURE-AGAIN (CIE closure). Closes PSP-AUDITS-NEVER-CLOSE-INTO-RATIFIED-IMPROVEMENT.
**ALIGNS:** [docs/plan/pillar-0-governance/PLATFORM-OBSERVATION-DOCTRINE.md](docs/plan/pillar-0-governance/PLATFORM-OBSERVATION-DOCTRINE.md) · NO parallel machinery — extends audit-runner (28 pipelines) + cie-pe-trigger-audit (M5) + weekly-persona-trigger-audit (M4) + AI-PROFILING OBSERVE + RZF-LATEST severity · formalizes 3-stage intake pipeline (intake-gate→routing→invocation) vs the false-duplicate-merge mandate (vlt-S068-00009 RESOLVED).
**STATUS:** **DRAFT pending Governor ratification — S072 P5**. PE order: L1 3-stage intake formalization (~30min) → L4 ZF-deep auto-trigger (~1h, closes iter-N persistent signal) → L2 platform-observation-aggregator.mjs (~2h) → L3 /platform/observation page (~3h) → L5 audit→CIP integration (after CIP M3). Total ~6-7h.

## NODE — P-META-029 Backfill (S071-surfaced, S072-queued)
**ANCHOR:** humble-consolidation-discipline.md exists at docs/plan/principles/ but NOT registered in packages/principles/principles-index.yaml slice manifest. **Inaugural MEMORY-VS-DISK-DRIFT instance** (the partial-engraving variant of EXISTS≠ACTIVE — doc-without-registration).
**ALIGNS:** vlt-S072-pmeta-029-registry-backfill · related to ONE-SOURCE-OF (both canonical-registration domain) · prevention surface for the validate-context-wrapped-numbers + future validate-registry-completeness.
**STATUS:** **QUEUED S072 P4** (~15 min: append to packages/principles/principles.yaml between P-META-028 line 2437 and next P-* · run `pnpm --filter @csps/principles split` · verify total_count 69→70 · commit). Natural side-fix during P1 CIP build OR P2 ONE-SOURCE M10 build.
