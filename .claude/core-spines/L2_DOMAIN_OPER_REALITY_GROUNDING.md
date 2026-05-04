---
id: csps.core-spines.l2-domain-oper-reality-grounding
name: L2_DOMAIN_OPER_REALITY_GROUNDING
description: OPER spine domain governing reconciliation between platform claims and observed reality. Validate-before-assume; re-run-IS-the-proof; observability via audit-event emission; drift detection continuous; nominal-not-actual prevention.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: OPER
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_OPER.md
domain: REALITY_GROUNDING
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_OPER_REALITY_GROUNDING

Operational decomposition of OPER spine — the domain governing **reconciliation between platform claims and observed reality**.

## What this domain governs

Every state-claim cites a tool call IN THIS RESPONSE. Memory of an earlier call is not validation. The re-run IS the proof. Latent bugs that hide because validators never ran are the failure mode this domain exists to prevent.

Observability is structural — every state change emits an audit event; every audit event is queryable; every drift is surfaced before it accumulates into debt requiring its own bulk-fix arc. Drift detection is continuous: alignment-drift-over-time per week, full re-registration sweep per major-model-update, principle-count-staleness per session, audit-staleness per quarter.

Nominal-not-actual is the universal failure pattern this domain prevents. RZF blocks emitted without paired validator output are not RZF claims — they are nominal claims that compound into platform debt. The discipline targets this directly: every DONE/RATIFIED/VALIDATED/CLOSED claim cites paired tool-call evidence in same session log.

## Operational governance surfaces

- **B_VALIDATE_BEFORE_ASSUME** (S002 turn 7 + turn 15 strengthening — tool-call sandwich)
- **P-META-006 RZF** (re-run is the proof; cycle count is measurement not target)
- **Audit-event emission on every state change** (per ADR-0007 postgres-trigger-based-audit)
- **principle_count_staleness validator** (LIVE; per-session)
- **alignment-drift-over-time** (per-week)
- **closing-summary §10.0** (mandatory pre-close cycle evidence)

## Per-domain validators

- `assertion-without-preceding-tool-call` (tool-call sandwich required)
- `assertion-without-evidence` (state claims without tool-call output)
- `nominal-rzf-detection` (RZF blocks not preceded by `pnpm verify` stdout)
- `compressed-zero-findings-detection` (RZF compression under context pressure)
- `validator-claim-without-rerun` (DONE/RATIFIED without paired validator output)
- `audit-log-integrity` (no >5min gap per tenant in audit.events)

## Composition

Composes with L2_DOMAIN_OPER_WORKFLOW_INTEGRITY (cycle evidence at every boundary IS reality grounding) + L2_DOMAIN_OPER_PACE_DISCIPLINE (per-layer ZF is the pacing mechanism that grounds completion claims) + the VALD Spine's RESULT_DRIVEN_VERIFICATION domain (re-run IS the proof; cycle count is measurement) + the AI Spine's COGNITIVE_CONTEXT domain (QG3 mid-session edited file re-read prevents memory-of-last-write quality regression).

**Domain signature:** S006-AI-l2-domain-oper-reality-grounding-2026-05-04T20:00:00Z
