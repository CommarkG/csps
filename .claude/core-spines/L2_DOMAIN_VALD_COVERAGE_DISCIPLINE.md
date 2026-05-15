---
id: csps.core-spines.l2-domain-vald-coverage-discipline
name: L2_DOMAIN_VALD_COVERAGE_DISCIPLINE
description: VALD spine domain governing audit registry as single source of truth + atomic validator-surface registration per FSE amendment + 9 audit-hub pipelines orchestrating ~140+ audits across the platform.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: VALD
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_VALD.md
domain: COVERAGE_DISCIPLINE
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
scope_level: S1
---

# L2_DOMAIN_VALD_COVERAGE_DISCIPLINE

Operational decomposition of VALD spine — the domain governing **audit registry coverage + atomic validator-surface registration**.

## What this domain governs

The audit-runner.md registry is the single source of truth for what is checked. Every validator slug is registered atomically when its corresponding discipline is engraved. Implementation may defer; registration cannot. Dangling references — discipline declares a validator that the registry does not list — are a structural defect the registry exists to prevent.

The audit-hub.md orchestration sits above the registry. 10 pipelines (pre-close-verification / agent-alignment / cognitive-context-discipline / zero-findings-cycle / engraving-completeness / schema-integrity / intake-and-learning / complexity-and-hotspots / runtime-health / csps-alignment-over-inner-defaults). Per-pipeline trigger + severity routing + dependency graph + dynamic schema connections (bidirectional audit↔principle linkage).

The validator ratchet protocol controls FAIL_CLOSED promotion. Every new validator runs ADVISORY for ≥5 fires before ratchet review. Cargo-cult-prevention gate: validators with high false-positive rates are not promoted.

## Operational governance surfaces

- **audit-runner.md** (single registry; ~140+ audits)
- **audit-hub.md** (10 pipelines; orchestration layer)
- **FSE atomic registration amendment** (S005 turn 18; registration mandatory same-commit; implementation deferrable)
- **B_AUDIT_ORCHESTRATION** (P-META-011)
- **Validator ratchet protocol** (ADVISORY → FAIL_CLOSED with min-5-fires gate)

## Per-domain validators

- `discipline-engraving-completeness` (spine matrix rows surfaces_count >= 4)
- `audit-of-audits` (meta-RZF on registry; P-META-001 enforcer)
- `single-surface-engraving-anti-pattern` (catches surfaces_count < 2 RED)
- `cross-ref-resolution` (every cited audit slug resolves to registry row)
- `pipeline-coverage` (every audit references backing principle/contract; bidirectional)

## Composition

Composes with L2_DOMAIN_VALD_EVIDENCE_SPECIFICITY (registry coverage is half the discipline; evidence specificity is the other half) + L2_DOMAIN_VALD_RESULT_DRIVEN_VERIFICATION (validators must actually run, not just be registered) + the GVRN Spine's ACCOUNTABILITY_TRACEABILITY domain (every audit references back to its principle/contract).

**Domain signature:** S006-AI-l2-domain-vald-coverage-discipline-2026-05-04T20:00:00Z
