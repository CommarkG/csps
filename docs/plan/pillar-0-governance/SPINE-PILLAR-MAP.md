---
id: csps.governance.spine-pillar-map
name: SPINE-PILLAR-MAP
description: "Opus-authored S068 critical section (PHASE 1, Opus-best part). Reconciles the two CSPS structural vocabularies: 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) are the ROUTING AXIS; 8 Pillars (0-7) are CONTENT GROUPINGS. Maps each pillar to its primary spine + cross-cutting spines. Resolves the pillar-1 duplicate (pillar-1-product → pillar-7-product). The canonical answer to 'which spine routes this / which pillar holds this.' Q2 ratified S068."
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: vault_files
version: "1.0"
session: S068
owner: group:finky
authored_by: Opus-12
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, core-maximal, synergetic]
ns_path: "this map → GVRN spine → North Star (core-first)"
context_question: "For this artifact: which Core Spine ROUTES it (the axis) and which Pillar HOLDS it (the grouping)? They are different questions with one answer each."
context_quote: "Spines route. Pillars group. One artifact has exactly one routing spine and one home pillar."
inherits_from: "P-ARCH-028 core-spine-discipline (5 spines + precedence) + CORE-MAXIMAL-DOCTRINE + CSPS-NORTH-STAR + Q2 ratification S068"
links:
  - { rel: core-spine-doctrine, href: ../../.claude/core-spines/L1_CORE_GVRN.md }
  - { rel: core-maximal, href: CORE-MAXIMAL-DOCTRINE.md }
  - { rel: master-plan, href: ../_handoff/MASTER-RE-GATE-PLAN-S068.md }
---

# SPINE-PILLAR-MAP — The Routing Axis

> **Opus-authored critical section (PHASE 1 / PART 1 STEP 2).** Q2 ratified S068: **5 Core Spines route; 8 Pillars group.** This doc is the canonical reconciliation — every node declares both, and they answer different questions.

---

## CORE SEED (the alignment point — carries original intent)

**Intent:** CSPS has two structural vocabularies that drifted into ambiguity — 5 Core Spines and 8 content Pillars. The platform needs ONE routing axis or bundling/orchestration cannot traverse deterministically. **The resolution:** Spines are the *routing axis* (the threshold classifies onto a spine; CIE/PE traverse spines). Pillars are *content groupings* (where a doc physically lives). Every node has exactly one routing spine + one home pillar. This is NOT a merge of the two — it is an explicit separation of their roles.

**Ripple set (core seeds placed on each):** NODEFILE-CONTRACT (`core_spine` + `pillar` fields) · threshold-router (routes onto spine) · validate-corespine-check hook · every existing artifact's frontmatter (`core_spine` already present; `pillar` derivable from path) · CIE/PE traversal.

---

## The Two Vocabularies — Distinct Roles

| | Core Spines (5) | Pillars (8) |
|---|---|---|
| **Role** | ROUTING AXIS | CONTENT GROUPING |
| **Answers** | "which discipline governs + routes this?" | "where does this physically live?" |
| **Used by** | threshold-router, CIE, PE, precedence resolution | directory structure, navigation, ownership |
| **Count** | 5 (fixed) | 8 (0-7, extensible) |
| **Precedence** | GVRN > VALD > ARCH > AI > OPER (P-ARCH-028) | none (groupings, not ranked) |

---

## The 5 Core Spines (routing axis — fixed)

| Spine | Governs | Precedence |
|---|---|---|
| **GVRN** | Decision rights, governance, ratification, North Star | 1 (highest) |
| **VALD** | Validation, verification, evidence, zero-findings | 2 |
| **ARCH** | Data domain, schema, structure, composition | 3 |
| **AI** | AI behavior, inner-defaults, alignment, intelligence | 4 |
| **OPER** | Operations, workflow, pace, delivery | 5 |

## The 8 Pillars (content groupings) → primary spine

| Pillar | Primary spine | Cross-cutting spines | Note |
|---|---|---|---|
| **pillar-0-governance** | GVRN | VALD | constitution, contracts, principles, North Star |
| **pillar-1-architecture-and-stack** | ARCH | OPER | tech stack, repo layout, composition |
| **pillar-2-data-and-schema** | ARCH | GVRN, VALD | ZModel, RLS, entities, Product schema |
| **pillar-3-platform-services** | OPER | ARCH | services, integrations, infra |
| **pillar-4-developer-experience** | OPER | AI, GVRN | DX, journey, tooling ergonomics |
| **pillar-5-ai-systems** | AI | GVRN | CIE, PE, council, inner-defaults |
| **pillar-6-operations-and-delivery** | OPER | VALD | CI/CD, deploy, monitoring |
| **pillar-7-product** (renamed from pillar-1-product) | ARCH | GVRN, AI | product layer, ProductNode, bundling |

**VALD has no home pillar** — it is purely cross-cutting (validation governs everything). VALD-spine artifacts live in the pillar their subject belongs to, with `core_spine: VALD`. This is intentional: validation is an axis, not a content area.

---

## Pillar-1 Duplicate Resolution (Q1 ratified)

`docs/plan/pillar-1-product/` → **`docs/plan/pillar-7-product/`** (git mv, Sonnet STEP 1). `pillar-1-architecture-and-stack` keeps pillar-1. All inbound references updated in the same commit (grep-first per PROTO-S068-PART-1 STEP 1). **This map documents the TARGET state; Sonnet STEP 1 makes pillar-7-product real.**

---

## Usage Rule (mandatory on every node)

Every NodeFile declares:
- `core_spine:` — its routing spine (one of 5; the axis the threshold routes it on)
- `pillar:` — its home pillar (derivable from path; one of 8) — NEW NodeFile field

Conflict resolution: if an artifact seems to span spines, the **highest-precedence spine wins as primary** (GVRN > VALD > ARCH > AI > OPER); others go in `core_spines:` (plural). Home pillar is always singular (physical location).

---

## Architecture Map — Alignment Target (S073 B0 extension)

*Added S073 PROTO-S073-CORESPINE-B0. This document serves as the canonical alignment target
for the core-spine engine registry (tools/config/core-spine-registry.yaml).
The extension does NOT change the spine/pillar routing vocabulary above — it designates
this document as the node map every registry entry aligns to.*

### Role in the core-spine engine

Every entry in `tools/config/core-spine-registry.yaml` carries an `alignment_map` block:

```yaml
alignment_map:
  schema_anchor: vault_files        # which schema type governs this spine's artifacts
  architecture_map_node: "pillar-0-governance (GVRN primary)"  # node in THIS document
  classification_dimension: GVRN   # one of {GVRN, VALD, ARCH, AI, OPER}
  root: null                        # path to the L1_CORE sealed file for this spine
```

`architecture_map_node` is a reference to the matching row in the **Pillars table** above.
It gives the engine a deterministic answer to "where does this spine's content live?"

### Architecture map nodes (pillar × spine cross-reference)

| Node ID | Pillar | Primary spine | Engine notes |
|---------|--------|--------------|--------------|
| `pillar-0-governance` | 0 | GVRN | Constitution, contracts, accountability hub |
| `pillar-1-architecture-and-stack` | 1 | ARCH | Tech stack, repo layout |
| `pillar-2-data-and-schema` | 2 | ARCH | ZModel, RLS, entities |
| `pillar-3-platform-services` | 3 | OPER | Services, integrations |
| `pillar-4-developer-experience` | 4 | OPER | DX, journey, tooling |
| `pillar-5-ai-systems` | 5 | AI | CIE, PE, council, inner-defaults |
| `pillar-6-operations-and-delivery` | 6 | OPER | CI/CD, deploy, monitoring |
| `pillar-7-product` | 7 | ARCH | Product layer, bundling |

*validate-core-spine-template.mjs verifies alignment_map.architecture_map_node ∈ this table
and alignment_map.classification_dimension ∈ {GVRN,VALD,ARCH,AI,OPER} (EXISTS≠ACTIVE — not just text).*
