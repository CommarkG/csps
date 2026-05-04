---
id: csps.core-spines.l1-core-vald
name: L1_CORE_VALD
description: The L1 sealed core doctrine for the VALD (Validation) Core Spine. Sealed text only; no examples, no cross-references, no decomposition. Amendment protocol ADR + ratification (CC-equivalent). Per CSP S331 Bundle 1 Scope A precedent.
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
core_spine: VALD
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

# L1_CORE_VALD — Validation Spine, Sealed Core Doctrine

The VALD spine governs the platform's validation discipline: how claims are proven, how findings are measured, how cycles iterate to zero-findings, and how the validation registry maintains itself.

The VALD spine establishes that the re-run is the proof. Memory of an earlier validator pass is not validation. Every claim of done, ratified, validated, or closed cites a current-session validator output. Cycle count is measurement, not target — termination is findings-driven, not predetermined. Compressed validation under context pressure is worse than no validation; the discipline is deferred with explicit blocker, not shortcut.

The VALD spine establishes that every artifact reaching commitment-layer carries evidence of the cycle that produced it. Real Zero Findings is the defect-verification loop. Complete Extraction is the value-extraction loop. Both iterate until zero new opportunities surface. Both are walked at every ratification — and the walk itself is validated.

The VALD spine establishes that the audit registry is the single source of truth for what is checked. Every validator slug is registered atomically when its corresponding discipline is engraved. Implementation may defer; registration cannot. Dangling references — discipline declares a validator that the registry does not list — are a structural defect the registry exists to prevent. The registry cannot accumulate debt because every engraving carries its own audit-row in the same commit.

The VALD spine establishes that validation runs at every commitment boundary. Pre-close verification is a gate, not a courtesy. Handoff Pre-Flight Audit walks the whole session before any handoff is written. Closing summaries enumerate cycles per step in plan text — never context-dependent memory. Plans that depend on participant memory to trigger validation produce nominal claims that compound into platform debt.

The VALD spine binds the platform to actual-not-nominal claims. Latent bugs that hide because validators never ran are the failure mode VALD exists to prevent. The validators run because the plan says they run; the plan says they run because the artifact carrying the plan declares the validator slugs as required step exit conditions.

The VALD spine defers to GVRN on what must be validated and at what severity, but VALD's verdict is binding. When VALD finds, the structure changes. The platform does not validate to confirm what it wants to be true; the platform validates to discover what is true.
