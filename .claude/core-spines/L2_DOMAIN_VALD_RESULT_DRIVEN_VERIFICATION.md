---
id: csps.core-spines.l2-domain-vald-result-driven-verification
name: L2_DOMAIN_VALD_RESULT_DRIVEN_VERIFICATION
description: VALD spine domain governing the re-run-IS-the-proof discipline + cycle-count-as-measurement-not-target + termination-driven-by-findings (not-by-N) + actual-not-nominal claims at every commitment boundary.
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
domain: RESULT_DRIVEN_VERIFICATION
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_VALD_RESULT_DRIVEN_VERIFICATION

Operational decomposition of VALD spine — the domain governing **the re-run is the proof + cycle-count-as-measurement-not-target + actual-not-nominal claims**.

## What this domain governs

The re-run IS the proof. Memory of an earlier validator pass is not validation. Every claim of done, ratified, validated, or closed cites a current-session validator output. Fixing is necessary but NOT sufficient — the validator must run again after the fix and produce zero findings before the claim holds.

Cycle count is measurement, not target. RZF terminates when cycles return zero findings; CEC terminates when cycles return zero new opportunities. Pre-determined cycle counts ("we'll do 3 cycles") are an anti-pattern — the discipline targets findings-driven termination.

Compressed validation under context pressure is worse than no validation. The discipline is deferred with explicit blocker, not shortcut. Compressed Zero-Findings Discipline produces nominal claims that compound into platform debt; better to defer with BLK-* registry entry than to shortcut.

## Operational governance surfaces

- **P-META-006 RZF + CEC** (re-run-is-the-proof; cycle count is measurement)
- **B_RZF + B_CEC** (canonical contracts)
- **closing-summary §10.10 + §10.11** (per-cycle structured evidence)
- **HPFA whole-session walk** (B_HANDOFF_PRE_FLIGHT_AUDIT — verifies claims hold)
- **tools/verify.mjs orchestrator** (the mechanical re-run)

## Per-domain validators

- `validator-claim-without-rerun` (PR-blocking error)
- `nominal-rzf-detection` (PR-blocking warn)
- `compressed-zero-findings-detection` (PR-blocking error)
- `cycle-count-as-target-detection` (RZF count is measurement; predetermined N flagged)

## Composition

Composes with L2_DOMAIN_VALD_COVERAGE_DISCIPLINE (registry knows what; result-driven verification is when) + L2_DOMAIN_VALD_EVIDENCE_SPECIFICITY (evidence shows the result; result-driven says result must be 0-findings) + the OPER Spine's REALITY_GROUNDING domain (re-run grounds claims in observed pass) + the GVRN Spine's AMENDMENT_DISCIPLINE domain (claims that don't pass result-driven verification cannot ratify; amendments via the right path required).

**Domain signature:** S006-AI-l2-domain-vald-result-driven-verification-2026-05-04T20:00:00Z
