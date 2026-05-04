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

## Per-domain validators

- `decision-frame-citation` (PCR for non-trivial decisions)
- `pe-alignment-guardian-coverage` (every substantive response cites verdict)
- `4-condition-gate-respected` (autonomous execution declares all 4 conditions met)
- `checkpoint-category-stopped` (8 categories trigger explicit ask)

## Composition

Composes with L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY (decisions traceable to authority) + L2_DOMAIN_GVRN_AMENDMENT_DISCIPLINE (constitutional changes follow ratified path) + the AI Spine's COGNITIVE_CONTEXT domain (Quality Gates protect synthesis from delegation).

**Domain signature:** S006-AI-l2-domain-gvrn-decision-rights-clarity-2026-05-04T20:00:00Z
