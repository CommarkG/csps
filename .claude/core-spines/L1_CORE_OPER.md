---
id: csps.core-spines.l1-core-oper
name: L1_CORE_OPER
description: The L1 sealed core doctrine for the OPER (Operations) Core Spine. Sealed text only; no examples, no cross-references, no decomposition. Amendment protocol ADR + ratification (CC-equivalent). Per CSP S331 Bundle 1 Scope A precedent.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
classification: SEALED
sealed_text_only: true
ratification_session: S006
amendment_protocol: ADR + ratification (sealed text changes require ratified ADR per P-ARCH-028)
do_not_expand:
  - No examples in this file
  - No cross-references to other artifacts in this file
  - No domain decomposition (L2_DOMAIN files own that)
  - No instance lists (L3_INSTANCES files own that)
  - Sealed prose only — every word load-bearing
template_used: l1-core-sealed-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: OPER
schema_anchor: core_spines_l1_doctrine
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: explanation
session: S006
---

# L1_CORE_OPER — Operations Spine, Sealed Core Doctrine

The OPER spine governs the platform's workflow integrity: how work is paced, sequenced, deployed, observed, and reconciled with reality.

Operations is the most adaptive of the spines. When governance changes the rules, when validation surfaces failure, when architecture evolves its structures, operations must flex to honor what the higher spines require. This is not weakness — it is the spine's defining property. OPER absorbs change so that the layers above it can change without operations becoming the bottleneck.

The OPER spine establishes that work proceeds through gradual build by foundations. Every multi-session topic enters via templated plan. Depth is chosen at three, four, or five levels with explicit rationale. Each level passes zero-findings before the next begins. Foundation stability is enforced before any layer of dependent work starts. The platform does not skip foundations. The platform does not split work into arbitrary parts. The platform does not finish-fast at the expense of structure.

The OPER spine establishes that the platform is canonical in the cloud, not on any single physical machine. Every artifact reaches the canonical store before any session closes. Multi-machine parity is engraved in bootstrap discipline. Remote access is first-class. Secrets live in dedicated stores, never in the repository.

The OPER spine establishes that every session is governed. Prompts are logged. Handoffs are pre-flight audited. Closing summaries cite cycle evidence. No work claims completion without paired tool-call proof. Drift is detected continuously across sessions and across model upgrades. The session is not opaque to future sessions; the session leaves a trail.

The OPER spine establishes that observability is structural. Every state change emits an audit event. Every audit event is queryable. Every drift is surfaced before it accumulates into debt that requires its own bulk-fix arc.

The OPER spine defers to GVRN on what work is authorized, to VALD on whether work meets its claims, to ARCH on what structures the work produces, and to AI on what intelligent behavior governs the work's execution.
