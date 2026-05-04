---
id: csps.core-spines.l2-domain-arch-composition
name: L2_DOMAIN_ARCH_COMPOSITION
description: ARCH spine domain governing how components compose into wholes. Templates as composition mechanism; customer-kit primitives as the only React surface; slice-contract as the composition unit; 22-template UI catalog as the composed-from set. Operational layer beneath L1_CORE_ARCH sealed doctrine.
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
domain: COMPOSITION
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_ARCH_COMPOSITION

Operational decomposition of ARCH spine — the domain governing **how components compose into wholes**.

## What this domain governs

Components built once compose across all current and future apps without bespoke per-app derivation. The mechanism is templates: every persisted artifact-type has a registered template; every recurring output type has a registered shape; every composition is auditable via cited template_used field.

The domain establishes that the customer-kit primitives are the only React surface in CSPS apps — no bespoke `page.tsx` files, no app-specific UI components without template registration, no parallel-implementation drift between apps.

The 22-template UI catalog (per ADR-0004) is the composed-from set for app pages; the slice contract is the composition unit for features; ZModel + audit-trigger DDL is the composition unit for data; 5/5 FSE is the composition unit for governance disciplines.

## Operational governance surfaces

- **Template registry** (B_TEMPLATE_FIRST_CREATION — single source of truth for all templates)
- **Customer kit primitives** (only React surface; ADR-0004; 4-layer enforcement: no-restricted-imports + slice-scorecard + Storybook+Chromatic + generator-only-page-creation)
- **Slice contract** (P-ARCH-006 — every feature is a slice with bounded interface + 90% scorecard + audit-event emission)
- **ZModel + audit-trigger DDL** (data composition unit; tenant_id ubiquity; multi-schema preview-feature)
- **22-template UI catalog** (per pillar-3/template-governance.md)

## Per-domain validators

- `template-citation-on-creation` (every commitment-layer artifact cites template_used)
- `template-registry-coverage` (every registered template has file path)
- `slice-contract-90-percent` (P-ARCH-006 enforcement)
- `no-restricted-imports` (apps don't import directly from other apps' internals)
- `generator-only-page-creation` (apps/*/app/(routes)/*/page.tsx must be generator-emitted)

## Composition

Composes with L2_DOMAIN_ARCH_LAYER_SEPARATION (composition respects layer boundaries) + L2_DOMAIN_ARCH_TRACEABILITY (every composed artifact traces to source templates) + the GVRN Spine's AMENDMENT_DISCIPLINE domain (template registry amendments follow PCR).

**Domain signature:** S006-AI-l2-domain-arch-composition-2026-05-04T20:00:00Z
