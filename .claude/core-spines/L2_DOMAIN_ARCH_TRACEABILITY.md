---
id: csps.core-spines.l2-domain-arch-traceability
name: L2_DOMAIN_ARCH_TRACEABILITY
description: ARCH spine domain governing artifact provenance + cross-cutting graph integrity. Every artifact carries who/when/which-schema/which-spine/precedent. Bidirectional cross-reference graph; nothing-stands-alone; schema_anchor + core_spine REQUIRED. Operational layer beneath L1_CORE_ARCH sealed doctrine.
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
domain: TRACEABILITY
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
scope_level: S1
---

# L2_DOMAIN_ARCH_TRACEABILITY

Operational decomposition of ARCH spine — the domain governing **artifact provenance and cross-cutting graph integrity**.

## What this domain governs

Every artifact carries the answer to: who authored, when, in what session, governed by which spine, descended from what precedent, schema-anchored to which table. The cross-cutting graph is bidirectional — every cited reference resolves; every artifact is reachable from at least one parent; orphans are a structural defect.

The domain establishes that frontmatter is non-optional. Universal-required core fields (id + lifecycle + lifecycle_state + tags) plus per-file-type extensions (per ADR-0023 hybrid frontmatter) plus core_spine + schema_anchor (per P-ARCH-028) are the minimum identity declarations. Without them, the artifact has no place in the platform graph.

Graduated apps inherit the discipline: vendored principles.yaml + audit-runner + MCP server prove descent (per P-META-002 principles-travel). Provenance survives the boundary between platform and graduated product.

## Operational governance surfaces

- **Universal-required frontmatter** (per ADR-0023 hybrid; id + lifecycle + tags + core_spine + schema_anchor)
- **Cross-reference resolution** (every cited principle/contract/audit slug resolves to existing artifact)
- **nothing-stands-alone-audit** (RED on ORPHAN_NO_CORE_SPINE / ORPHAN_NO_SCHEMA_ANCHOR)
- **Vendored principles.yaml + version + hash** (P-META-002; graduated apps trace to CSPS commit)
- **MCP server provenance** (csps-principles-mcp; every agent connects to same registry)

## Per-domain validators

- `frontmatter_validate` (universal-required core present; closed-enum tags valid)
- `cross-ref-resolution` (every reference resolves)
- `nothing-stands-alone-audit` (orphan detection)
- `principles-version-known` (P-META-002; graduated apps cite CSPS commit)
- `inheritance-coverage` (P-META-003; every app dir has principles inheritance)

## Composition

Composes with L2_DOMAIN_ARCH_COMPOSITION (templates carry their own provenance) + the GVRN Spine's ACCOUNTABILITY_TRACEABILITY domain (governance traces back to artifacts) + the VALD Spine's EVIDENCE_SPECIFICITY domain (cycle evidence IS provenance for ratifications).

**Domain signature:** S006-AI-l2-domain-arch-traceability-2026-05-04T20:00:00Z
