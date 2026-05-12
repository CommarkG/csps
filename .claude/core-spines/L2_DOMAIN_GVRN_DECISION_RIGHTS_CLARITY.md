---
id: csps.core-spines.l2-domain-gvrn-decision-rights-clarity
name: L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY
description: GVRN spine domain governing who decides what. Maps decisions to authority (user-as-Governor / AI / persona / agent / customer / app). Establishes 4-conditions-for-autonomous-execution gate + 8-checkpoint-categories that require explicit human approval. Operational layer beneath L1_CORE_GVRN sealed doctrine.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: GVRN
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_GVRN.md
domain: DECISION_RIGHTS_CLARITY
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY

Operational decomposition of GVRN spine — the domain governing **who decides what**. Beneath the L1 sealed core; above the L3 instance registry.

## What this domain governs

Every decision in CSPS has a clear authority. Authorities are: **user-as-Governor** (sovereign override + ratification of constitutional changes), **AI** (autonomous within ratified scope per 4-conditions gate), **persona** (within composition scope at runtime), **agent** (within AAP-bounded capability), **customer** (within app feature-tier entitlements), **app** (within graduation-readiness contract).

The domain establishes that authority is binding on action — not advisory. When a decision is made, the actor who made it is named. When authority is unclear, the decision is escalated to user-as-Governor before execution.

## Operational governance surfaces

- **4-conditions gate** (B_AUTONOMY_4_CONDITIONS): ratified scope + reversible + mechanical + no-cross-actor → AI autonomous; one false → ask
- **8 checkpoint categories** (B_CHECKPOINT_8_CATEGORIES): constitutional / cross-tier / external-dispatched / editing-circulated / irreversible / scope-expansion / strategy-pivot / high-stakes-one-shot → AI MUST stop + ask
- **PE_ALIGNMENT_GUARDIAN** (B_PE_ALIGNMENT_GUARDIAN): when human input misaligns with PE top-priority, AI deflects-not-executes
- **Two-sided handshake** (B_TWO_SIDED_HANDSHAKE): every session boundary closes I→I loop with explicit attestation + receipt
- **Multi-topic decomposition** (P-META-024 — SEALED Opus Turn 16 S027): when a single prompt contains >2 distinct CONCEPT_LOAD spine classifications, AI must decompose before crystallizing — emit routing table first, then route each sub-topic through P-META-023 independently.

## Per-domain validators

- `decision-frame-citation` (PCR for non-trivial decisions)
- `pe-alignment-guardian-coverage` (every substantive response cites verdict)
- `4-condition-gate-respected` (autonomous execution declares all 4 conditions met)
- `checkpoint-category-stopped` (8 categories trigger explicit ask)

## Triad Minimum Stack (P-META-021 — added S014 CEC)

This domain IS the "authority" layer of the triad. For consequential decisions, the triad minimum stack requires:
- CONTEXT (this domain): which L2 spine domain governs this decision?
- PRINCIPLE: B_CONSENSUS_BEFORE_PROCEEDING or B_AUTONOMY_4_CONDITIONS or specific P-*
- MECHANICAL: one of the 4 operational governance surfaces above must fire independently

A consequential decision in the GVRN domain without all 3 layers active = authority bypass. The 4-conditions gate IS the mechanical layer for autonomous AI decisions. The PE_ALIGNMENT_GUARDIAN IS the mechanical layer for priority misalignment. Missing either = single-layer reliance.

## Composition

Composes with L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY (decisions traceable to authority) + L2_DOMAIN_GVRN_AMENDMENT_DISCIPLINE (constitutional changes follow ratified path) + the AI Spine's COGNITIVE_CONTEXT domain (Quality Gates protect synthesis from delegation) + P-META-021 (Triad Governance — this domain IS the "context + principle" stack for GVRN decisions; mechanical is provided by 4-conditions gate and PE guardian).

**Domain signature:** S006-AI-l2-domain-gvrn-decision-rights-clarity-2026-05-04T20:00:00Z (amended S014 CEC: Triad minimum stack)
