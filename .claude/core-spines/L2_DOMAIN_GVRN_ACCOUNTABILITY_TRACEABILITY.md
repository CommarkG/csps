---
id: csps.core-spines.l2-domain-gvrn-accountability-traceability
name: L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY
description: GVRN spine domain governing accountability + provenance. Every artifact traces to its author/session/principle/contract; every decision traces to its authority; every engraving traces to its 5 surfaces; every validator failure traces to backing principle. Operational layer beneath L1_CORE_GVRN.
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
domain: ACCOUNTABILITY_TRACEABILITY
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY

Operational decomposition of GVRN spine — the domain governing **provenance and accountability**.

## What this domain governs

Every artifact carries the answer to: who authored, when, in what session, governed by which spine, descended from what precedent. Every decision carries the answer to: who decided, by what authority, with what evidence. Every engraving carries the answer to: which 5 surfaces hit, atomically or staged, with what cycle evidence.

Provenance is structural — embedded in frontmatter + git history + governor-prompts log + handoff §17 attestations + closing-summary §10.0 cycle evidence. Provenance is not optional documentation; it is the load-bearing identity of the artifact.

## Operational governance surfaces

- **Frontmatter provenance** (id + session + ratification_session + amendment_protocol)
- **Governor Prompts** (B_GOVERNOR_PROMPTS — every user prompt logged with verbatim + tags + distribution)
- **Handoff Pre-Flight Audit** (B_HANDOFF_PRE_FLIGHT_AUDIT — whole-session walk before handoff write; check engraving completeness + audit registration + cycle evidence + schema connections)
- **Cycle evidence** (closing-summary §10.0 + §10.0e + §10.0f + §10.0g/h/i/j — per-cycle paired tool-call output)
- **Cross-reference graph** (every B_*/P-* declares cross_references; bidirectional; nothing-stands-alone)

## Per-domain validators

- `governor-prompt-coverage` (every substantive user prompt logged)
- `governor-prompt-distribution-complete` (cardinal-flagged GPs cross-link to user-intents)
- `hpfa-pre-handoff-coverage` (handoff write blocked without HPFA PASS)
- `cross-ref-resolution` (every cited principle/contract/audit slug resolves)
- `handoff-attestation-and-handshake-present` (paired §17 attest + receipt within 7 days)
- `nothing-stands-alone-audit` (orphan detection — no schema_anchor / no core_spine / dangling refs)

## Composition

Composes with L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY (authority is what's being traced) + the VALD Spine's EVIDENCE_SPECIFICITY domain (cycle evidence is what proves traceability holds) + the AI Spine's ALIGNMENT_PROTOCOL domain (every agent invocation traces through AAP).

**Domain signature:** S006-AI-l2-domain-gvrn-accountability-traceability-2026-05-04T20:00:00Z
