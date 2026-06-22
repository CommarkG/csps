---
id: csps.research.S084-journey-revised-external-comments
name: S084-journey-revised-external-comments
description: "Round-2 external critique (Gemini + Claude) of the REVISED journey-orchestrator design. Strong convergence on CRITICAL pre-build corrections. Folded into JOURNEY-ORCHESTRATOR-PLAN."
version: "1.0"
session: S084
owner: group:finky
authored_by: external (Gemini, Claude) — captured by OPUS-21
core_spine: AI
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: audit-1-complete
precedent_checked: true
links:
  - { rel: plan, href: ../../pillar-0-governance/JOURNEY-ORCHESTRATOR-PLAN.md }
  - { rel: round1, href: S084-journey-external-consolidation.md }
---

# Revised-Design External Critique — Round 2 (Gemini + Claude, 2026-06-18)

> Both converge. CRITICAL pre-build corrections (architectural — expensive to retrofit). GPT round-2 pending.

## CONSENSUS — the corrections (both agree)
- **R1 gate posture (HIGH):** flat "blocking at every PEG" = gate-fatigue + shadow workarounds + compliance
  theater (esp. the Improvement/CIE engine — if it blocks, users feed it junk). FIX: a `gate_mode[risk_class]
  [phase]` matrix = blocking | advisory | silent. Specifics (Claude): ZF blocks only at phase≥3 on Standard/
  Governed (advisory on Fast); CIE emit NEVER blocks (fire+log); Threshold blocks entry+P1 only; PE blocks
  at Decide only. Gemini: blocking reserved for structural-invariant/core-schema; advisory-with-tracking for
  optimization; silent pass-through for routine enrichment.
- **R2 ripple (HIGH):** (a) graph must be STATIC-declared + continuously validated, NOT inferred at fire-time
  (Bazel/Turborepo); (b) CYCLE DETECTION + freeze-pending-decision (loops feed back → circular ripples likely);
  (c) SEPARATE detect / compute / execute (Flyway/Liquibase/Prisma) with human-confirm between compute+execute
  on Governed; (d) upstream change publishes a NEW VERSION — downstream stay pinned to stable + get a
  "deprecation/update-required" flag scheduled as decoupled tasks (no blocking the upstream initiator).
- **R3 health (build now, minimal):** 3 layers ONLY — L1 session-close structured log (queryable, no UI) ·
  L2 weekly digest (≤5 metrics: gate-bypass-rate by branch, CIE emit-vs-action rate, ripple freq+blast) ·
  L3 event-driven breach alert (Governed-branch bypass-rate over threshold in 48h). Build the LOG first;
  no dashboard before 30 sessions of data (exception-driven invariants, not streaming telemetry).
- **R4 risk-class (agree + mitigate):** risk-class must be PLATFORM-SUGGESTED + PA-ratifiable, NOT user-
  declared (users down-classify for less friction). LOG overrides → weekly digest surfaces classifier
  miscalibration. Auto-override: "Exploratory" that touches a core-schema asset → escalate to Governed.
  BRANCH-PERSONA COMPATIBILITY CHECK at entry: low-tier persona on Governed task → escalate/narrow-scope.
- **R5 THE COLLAPSE RISK (CRITICAL):** concurrent Ripple Passes / writes on the shared core-spine graph =
  TOCTOU + DB lock contention + write amplification. FIX: **DECOUPLE the real-time workspace state (drafts/
  saves/sessions → fast unstructured store) from the immutable governance registry (heavy recursive graph
  checks run ONLY on explicit PEG transaction, as async batch commit).** Ripple Pass takes a VERSIONED
  SNAPSHOT at fire-time, checks graph-version before commit; if changed → pause + surface conflict (no silent merge).

## Claude's pre-build verdict (severity)
- CRITICAL: concurrent ripple on shared graph → versioned snapshots/subgraph locking (architectural).
- HIGH: flat gates → gate_mode matrix; ripple no cycle-detection → detect+freeze (architectural).
- MEDIUM: detect/compute/execute conflated → separate; risk-class override logging; branch-persona entry check.
- LOW: health not scheduled → build L1 log now, defer L2/L3.
"Three are architectural (gate matrix, cycle detection, concurrency) — changing them after build is expensive."

## GPT round-2 — distinct adds (converges on R1-R5; adds depth)
- GATES: 5-tier policy result — allow / deny(block) / warn(advisory) / require-approval / logged. CIE blocks
  ONLY on Critical/Structural; else emit+queue. Threshold mandatory at entry/scope-change/activation/cross-
  tenant — NOT every micro-step. ZF evidence depth risk-classed (Fast=auto-captured ok; Governed=all PEGs;
  Exploratory=known/unknown/hypothesis/confidence not final proof).
- RIPPLE: not one function — a 10-step PIPELINE (event→classify→affected-slice→edge-rules→severity→actions→
  owner→block-decision→evidence→graph-update). TYPED edges (uses/validates/renders/inherits/references_vocab/
  references_schema/...) each with an invalidation rule. SEVERITY P0(block-activation)/P1(block-verify)/P2
  (ticket)/P3(log). Expand→Migrate→Contract for schema/API. Cache ripple by (change_signature, graph_version).
  "If a Ripple Report routinely has 50+ items, the model has already failed."
- HEALTH: Owner Health Brief + exception feed (SRE symptom-based + DORA balance). P0/P1 real-time only;
  daily/session brief (≤5 owner decisions); weekly improvement review. NOT dashboards before 30 sessions.
- RISK-CLASS: system-SUGGESTED + downgrade-requires-reason+permission+log + auto-upgrade on schema/security/
  billing touch. Reclassify on new-input/dep-expand/criteria-change/permission-cross. Aggregate risk per batch.
- R5 COLLAPSE: the central orchestrator as a SYNCHRONOUS gatekeeper. FIX: an EVENTED workflow engine — split
  Journey / Policy / Evidence / Ripple / CIE / Notification / Audit-event-store services; async + idempotent.
  10 non-negotiables: every event has id · every artifact versioned · gate records policy-version · ripple
  records graph-version · saves use optimistic concurrency · every blocker has ONE owner+severity+expiry ·
  every override logged · async workers idempotent · "done" reproducible from the event log.
- VOCAB FIXES (critical — feed the realignment): "no-skip" → **no-silent-skip** (allow compression/override/
  N-A, never UNRECORDED); "verify-completely" → **verify against acceptance criteria + confidence + monitoring/
  rollback** (complete verification is usually false). 
- BUILD: MVP spine first (5-phase state machine + risk selector + persona overlay + PEG evidence + policy
  result model + ripple for 2-3 typed artifact classes + Owner Health Brief + append-only event log). DEFER
  full CIE automation / universal ripple / dashboards / auto-remediation. "Build narrow, typed, observable, severity-based."
