---
id: csps.core-spines.l2-domain-gvrn-amendment-discipline
name: L2_DOMAIN_GVRN_AMENDMENT_DISCIPLINE
description: GVRN spine domain governing how the platform's rules change. Distinguishes constitutional amendments (CC-equivalent + ratification) from operational amendments (PCR + normal review) from per-session adjustments (no formal amendment). Sealed L1 doctrine + 4 immutable Quality Gates are CONSTITUTIONAL; everything else is amendable along the right path.
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
domain: AMENDMENT_DISCIPLINE
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

# L2_DOMAIN_GVRN_AMENDMENT_DISCIPLINE

Operational decomposition of GVRN spine — the domain governing **how the platform's rules change**. Absorbs CSP CNST spine's AMENDABILITY_DISCIPLINE concerns into CSPS GVRN.

## What this domain governs

The platform has rules at multiple altitude levels; each level has its own amendment protocol. Constitutional changes require ratification because they cascade. Operational changes require PCR + normal review. Per-session adjustments require no formal amendment because they don't bind future sessions.

Constitutional rules: 4 CCA Quality Gates (immutable) / Core Spine cardinality (5 — change requires ADR-0025+) / 5/5 FSE atomic discipline / sealed L1_CORE doctrine text / cardinal directives. Operational rules: B_* contracts (amendable PCR) / audit cadences (amendable PCR) / template registry entries (amendable inline) / handoff zone structure (amendable PCR). Per-session: governor-prompts entries / closing-summary content / topic-plan progress markers.

Foundation-stability-before-amendment is a binding rule: foundations engraved at L<N> cannot be amended at L<N+1> in same topic-plan. Amendments to foundations require backtrack-trigger fire OR new topic-plan + ratification.

## Operational governance surfaces

- **ADR process** (per ADR-0023 hybrid frontmatter; MADR format; dispute resolution via ratification)
- **PCR for non-trivial decisions** (B_PCR_FOR_DECISIONS — Pros/Cons/Recommendation 3-block + load-bearing factor + what-would-flip)
- **Backtrack triggers** (every topic-plan declares triggers + actions in §<backtrack-register>)
- **Element-reviews** (depth-3 review pattern for any platform element + enhancement opportunities → ADR candidates)
- **Constitutional vs operational distinction** (severity routing)

## Per-domain validators

- `decision-frame-citation` (PCR on non-trivial decisions)
- `backtrack-trigger-coverage` (topic-plans declare triggers)
- `constitutional-amendment-via-adr-required` (changes to L1 sealed text / 4 QGs / spine cardinality require ADR; impl week-4)
- `foundation-stability-before-amendment` (per topic-plan; L<N> changes after L<N+1> opens require backtrack-trigger fire)

## Composition

Composes with L2_DOMAIN_GVRN_DECISION_RIGHTS_CLARITY (amendments require correct authority) + L2_DOMAIN_GVRN_ACCOUNTABILITY_TRACEABILITY (every amendment traces to its rationale) + the OPER Spine's WORKFLOW_INTEGRITY domain (gradual-build-by-foundations enforces foundation stability mechanically).

**Domain signature:** S006-AI-l2-domain-gvrn-amendment-discipline-2026-05-04T20:00:00Z
