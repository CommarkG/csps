---
id: csps.core-spines.l2-domain-arch-layer-separation
name: L2_DOMAIN_ARCH_LAYER_SEPARATION
description: ARCH spine domain governing layer boundaries. Trunk vs domain overlays vs persona vs app; CSPS-CORE vs SOLUTION_<X>; outward-layering pattern (CORE → L1 → L2 → L3 → L4 → L5) with DNA consistency enforced at every transition. Operational layer beneath L1_CORE_ARCH sealed doctrine.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: ARCH
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_ARCH.md
domain: LAYER_SEPARATION
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_ARCH_LAYER_SEPARATION

Operational decomposition of ARCH spine — the domain governing **layer boundaries and outward-layering**.

## What this domain governs

Architecture has altitude levels. Trunk-level rules apply universally; domain overlays specialize for sub-domains; persona overlays specialize for AI personas; app overlays specialize for individual SaaS apps; tenant overlays specialize within apps. Going outward = increasing specificity; going inward = re-grounding.

The domain establishes that CSPS-CORE (the platform itself) is architecturally separate from SOLUTION_<X> (any individual app or solution built on CSPS). Conflating the two — accepting an app-specific concern as a platform-level rule, or imposing a platform-level rule on an app's contextual edge — is the failure mode this domain prevents.

The 5-layer outward pattern applies to every spine: L1 (sealed core) → L2 (domain decomposition) → L3 (instance registry) → L4 (per-app overlay) → L5 (per-tenant configuration). Each layer enforces the layer beneath it; backward propagation requires re-grounding.

## Operational governance surfaces

- **P-ARCH-013** universal-traits-trunk-domain-overlays (the 5-layer pattern's persona-specific instance)
- **P-ARCH-028** csps-core-spines (the meta-layering — CORE → L1 → L2 → L3)
- **Schema-per-app boundary** (per ADR-0017; multi-schema preview-feature; Booking's Customer ≠ CRM's Customer)
- **Stripe Entitlements** (per-customer-tier feature gates)
- **CSPS-CORE vs SOLUTION distinction** (memory feedback_layer_separation_discipline.md)

## Per-domain validators

- `corespine-layer-compliance` (declared core_spine ∈ canonical 5-set + L1 exists)
- `L1-do-not-expand-violation` (sealed L1 stays sealed)
- `spine-precedence-conflict-detector` (multi-spine artifacts with conflicting governance)
- `schema-per-app` (P-ARCH-018; cross-app schema imports rejected)
- `csps-core-vs-solution-conflation-detector` (impl deferred — concept-level audit pending semantic detection)

## Composition

Composes with L2_DOMAIN_ARCH_COMPOSITION (composition happens within layer boundaries) + L2_DOMAIN_ARCH_STRUCTURAL_INTEGRITY (each layer has its own integrity contract) + the GVRN Spine's AMENDMENT_DISCIPLINE domain (layer changes follow ratification protocol).

**Domain signature:** S006-AI-l2-domain-arch-layer-separation-2026-05-04T20:00:00Z
