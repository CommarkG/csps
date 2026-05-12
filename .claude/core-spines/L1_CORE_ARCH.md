---
id: csps.core-spines.l1-core-arch
name: L1_CORE_ARCH
description: The L1 sealed core doctrine for the ARCH (Architecture) Core Spine. Sealed text only; no examples, no cross-references, no decomposition. Amendment protocol ADR + ratification (CC-equivalent). Per CSP S331 Bundle 1 Scope A precedent.
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
  read_protocol: "L1 = full file (~47 lines); no L2/L3 split — sealed doctrine; every word load-bearing"
core_spine: ARCH
schema_anchor: core_spines_l1_doctrine
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: explanation
session: S006
---

# L1_CORE_ARCH — Architecture Spine, Sealed Core Doctrine

The ARCH spine governs the structural composition of the platform: how components compose into wholes, what integrity properties must be preserved across composition, and how abstraction layers relate to concrete instances.

Architecture is not the description of what exists but the rules by which what exists holds together. ARCH establishes three permanent properties: structural integrity, composability, and traceability.

Structural integrity means every feature in the platform is a slice with bounded contract. Boundaries are crossable only through declared interfaces. Audit events emit on every state change. Validation proves the boundary holds under multi-tenant load. The platform's data model is single source of truth: the schema declares what exists; absence from schema is absence from existence.

Composability means components built once compose across all current and future apps without bespoke per-app derivation. Templates are the mechanism. Every persisted artifact-type has a registered template. Every output type that recurs has a registered shape. Bespoke creation is permitted only with declared novelty rationale and promotion path when the pattern recurs.

Traceability means every artifact carries provenance. Who authored, when, under what schema, governed by which spine, descended from what precedent. The cross-cutting graph is bidirectional. No node stands alone. Orphans are a structural defect the architecture exists to prevent.

ARCH builds outward from a frozen core. Universal traits live at the trunk; domain overlays specialize toward the leaves. Per-app boundaries close at the schema layer. Per-tenant configuration overlays only within those boundaries. The outward direction is the only direction in which specificity grows. Inward changes require re-grounding.

ARCH defers to GVRN on authority and to VALD on whether structures hold. ARCH governs how things fit together; GVRN governs whether they may exist; VALD governs whether they actually work.
