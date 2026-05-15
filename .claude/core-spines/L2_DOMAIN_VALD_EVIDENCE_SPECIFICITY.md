---
id: csps.core-spines.l2-domain-vald-evidence-specificity
name: L2_DOMAIN_VALD_EVIDENCE_SPECIFICITY
description: VALD spine domain governing per-cycle structured evidence + closing-summary §10.0 mandatory headers + cycle-types closed enum (RZF / CEC / FSE / pre-close-verification / per-step-validation / per-engraving-atomic-5-surface).
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
domain: EVIDENCE_SPECIFICITY
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

# L2_DOMAIN_VALD_EVIDENCE_SPECIFICITY

Operational decomposition of VALD spine — the domain governing **per-cycle structured evidence + closing-summary §10.0 mandatory headers**.

## What this domain governs

Every artifact reaching commitment-layer carries structured evidence of the cycle that produced it. Real Zero Findings (RZF) is the defect-verification loop — cycles_run + findings_per_cycle + final_status + coverage + validators_run + signature. Complete Extraction Cycle (CEC) is the value-extraction loop — extracted_essence + cycles_walked + walk_scope + applications_made + not_applicable + needs_human_judgment + signature. Five-Surface Engraving (FSE) is the engraving-completeness loop — surfaces_count + per-surface-status + classify-decision + atomic-flag + meta-RZF-result.

The closing-summary §10.0 is the mandatory aggregation point. Every closing summary lists each cycle that ran + its exit-code + evidence path. Cycles run per-session: §10.0 (pnpm verify) / §10.0e (governor-prompts) / §10.0f (HPFA) / §10.0g (MUV) / §10.0h (inner-default leak report) / §10.0i (alignment-citation) / §10.0j (enhancement proposals) / §10.10 (RZF aggregate) / §10.11 (CEC aggregate) / §10.13 (FSE aggregate).

The cycle-types closed enum (per P-META-008): rzf / cec / fse / pre-close-verification / per-step-validation / per-engraving-atomic-5-surface. New cycle types require principle amendment.

## Operational governance surfaces

- **closing-summary-template.md** (canonical mandatory-headers spec)
- **B_PRE_CLOSE_VERIFICATION** (P-META-008; pnpm verify before any §10.10 RZF block)
- **B_RZF + B_CEC + B_FIVE_SURFACE_ENGRAVING** (the 3 cycle types active)
- **tools/verify.mjs** (orchestrator; emits structured §10.0 evidence)

## Per-domain validators

- `pre-close-cycle-coverage` (PR-blocking error)
- `nominal-rzf-detection` (PR-blocking warn)
- `closing-summary-checklist-completeness` (PR-blocking error)
- `catch-engraving-coverage` (per-session warn)
- `positive-value-extraction-coverage` (per-session warn)
- `enhancement-proposal-coverage` (per-session error — NEW S006 turn 8)

## Composition

Composes with L2_DOMAIN_VALD_COVERAGE_DISCIPLINE (registry knows what to check; evidence specificity is what's emitted) + L2_DOMAIN_VALD_RESULT_DRIVEN_VERIFICATION (evidence shows the result vs the process) + the OPER Spine's REALITY_GROUNDING domain (evidence is the reality the discipline grounds claims in) + the GVRN Spine's ACCOUNTABILITY_TRACEABILITY domain (closing-summary § structure is the provenance shape).

**Domain signature:** S006-AI-l2-domain-vald-evidence-specificity-2026-05-04T20:00:00Z
