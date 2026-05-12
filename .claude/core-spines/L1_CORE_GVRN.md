---
id: csps.core-spines.l1-core-gvrn
name: L1_CORE_GVRN
description: The L1 sealed core doctrine for the GVRN (Governance) Core Spine. Sealed text only; no examples, no cross-references, no decomposition. Amendment protocol ADR + ratification (CC-equivalent). Per CSP S331 Bundle 1 Scope A precedent.
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
template_status: sealed
file_depth_markers:
  l1_lines: "1-end"
  l2_lines: "N/A"
  l3_lines: "N/A"
  read_protocol: "L1 = full file (~45 lines); no L2/L3 split — sealed doctrine; every word load-bearing"
core_spine: GVRN
schema_anchor: core_spines_l1_doctrine
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: explanation
session: S006
---

# L1_CORE_GVRN — Governance Spine, Sealed Core Doctrine

The GVRN spine governs the platform's self-governance: who decides what, by what authority, with what accountability. It is the layer that makes every other layer possible by setting the rules under which they operate.

GVRN establishes that the platform's principles are codified in a single registry, that every behavioral discipline reaches mechanical enforcement across multiple independent surfaces, that no change to a discipline lands at fewer surfaces than the discipline's severity demands, and that every artifact reaching ratified state carries evidence of the cycle that ratified it.

GVRN binds the platform to honest self-account. Every output that crosses a communication boundary closes a verifiable loop with whoever receives it. Every prompt that enters the platform leaves a governance trace. Every handoff between sessions passes through whole-session audit before it can be written.

GVRN holds the standard above operational convenience. When an enforcement is skipped, late, or partial, the gap is fixed at the structure that allowed the skip, not at the instance. The system is enhanced; the standard is not lowered. What is not mechanically enforced is treated as a temporary fix and converted to mechanical at the earliest commitment boundary.

GVRN is the spine that the other four spines depend on for their authority to act. Architecture builds within the rules GVRN sets. Operations executes the work GVRN authorizes. Validation proves what GVRN demands proven. Intelligence operates within the alignment GVRN defines.

GVRN amends only by ratified governance change. The constitution is amendable; routine work is not amendment. The protocol that distinguishes them is itself part of GVRN.
