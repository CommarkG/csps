---
id: csps.governance.nodefile-contract
name: NODEFILE-CONTRACT
description: "Opus-authored S068 critical section (PHASE 1, Opus-best part). The meta-schema EVERY CSPS artifact (node) inherits. Defines the 8 self-identification questions → frontmatter fields (6 existing + delta), Dewey mini-tree numbering, lazy per-node vault, internal_parts taxonomy, ripple_seeds, and the connectivity fields (CIE/PE, dependencies, services_offered_to) that let orchestration traverse the stack deterministically. Q4 ratified scope: CORE + L1/L2 + pillar headers (~30 files) in S068; instances S069+. Validator ADVISORY S068 → BLOCKING after PVA."
type: governance
diataxis_type: reference
protection_level: protected
status: ratified
impl_status: swift-implemented
core_spine: GVRN
core_spines: [GVRN, ARCH, VALD]
schema_anchor: vault_files
version: "1.0"
session: S068
owner: group:finky
authored_by: Opus-12
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, core-maximal, synergetic, self-improving]
ns_path: "this contract → GVRN spine → North Star (core-first + core-maximal)"
context_question: "Does this node answer all 8 self-identification questions, declare its spine + pillar + connectivity, carry ripple_seeds, and have a vault_ref? If a required field has no governed value — did I FLAG (Template-or-Flag) rather than guess?"
context_quote: "Nothing stands alone. Every node declares who it is, what it inherits, what it uniquely adds, what depends on it, and how it connects to CIE + PE — or it is an orphan."
inherits_from: "SPINE-PILLAR-MAP + CORE-MAXIMAL-DOCTRINE (P-ARCH-032 + Template-or-Flag) + CSPS-PLANNING-DISCIPLINE + M-40 inherits_from + existing frontmatter standard + M-29 Platform Genome"
links:
  - { rel: spine-pillar-map, href: SPINE-PILLAR-MAP.md }
  - { rel: core-maximal, href: CORE-MAXIMAL-DOCTRINE.md }
  - { rel: planning-discipline, href: CSPS-PLANNING-DISCIPLINE.md }
  - { rel: master-plan, href: ../_handoff/MASTER-RE-GATE-PLAN-S068.md }
---

# NODEFILE-CONTRACT — The Meta-Schema Every Node Inherits

> **Opus-authored critical section (PHASE 1 / PART 1 STEP 3).** Every CSPS artifact is a node. This contract defines what every node must declare so the platform is one connected, traversable network — not scattered files. **Reuse-first:** 6 of 8 self-identification questions are ALREADY answered by the existing frontmatter standard; this contract adds only the delta + formalizes connectivity.

---

## CORE SEED (the alignment point — carries original intent)

**Intent (Governor S068):** "Nothing stands alone — the platform must have a place for anything, and every node must have stabilized, formalized connectivity to the rest of the system." A node that doesn't declare its lineage, its unique contribution, its dependents, and its CIE/PE connection is an orphan that orchestration cannot traverse and audits cannot verify. The NodeFile contract makes connectivity a REQUIRED, VALIDATED property — so bundling + CIE + PE can deterministically walk the stack, and so every node's intent is checkable against what it actually does.

**Ripple set (core seeds placed on each):** every artifact's frontmatter (~30 in scope) · validate-nodefile-compliance.mjs · pre-tool-use-nodefile-required.sh · threshold-router (routes new nodes) · pending-nodes register (gap-flagged nodes) · CIE/PE traversal · the holistic audit (node-connectivity completeness scan).

**Reuse-before-create:** does NOT replace the frontmatter standard — EXTENDS it. Does NOT create a new registry — the NodeFile tree IS the schema-filtered view of M-29 Platform Genome.

---

## The 8 Self-Identification Questions → Fields

| # | Question | Field | Status |
|---|---|---|---|
| 1 | Who am I? | `id` + `name` | EXISTING |
| 2 | What is my role? | `type` + `description` | EXISTING |
| 3 | How do I do it? | body content + `context_question` | EXISTING |
| 4 | Which core spine / deeper layers do I come from? | `core_spine` + `pillar` (NEW) + `inherits_from` | EXISTING + `pillar` NEW |
| 5 | What is my unique addition vs my parent? | `unique_addition` | **NEW** |
| 6 | What are my dependencies? | `inherits_from` + `links` (rel: depends-on) | EXISTING |
| 7 | Who gets services from me? | `services_offered_to` | **NEW** |
| 8 | How am I connected to CIE & PE? | `cie_connection` + `pe_connection` | **NEW** |

Plus Opus-added (per discipline + doctrine):
| 9 | What state am I in? | `state` (intake/drafted/ratified/implemented/active/deprecated) | NEW (some have lifecycle_state) |
| 10 | Who validates me? | `links` (rel: validator) | EXISTING pattern |
| 11 | What ripples when I change? | `ripple_seeds` | **NEW** (discipline §5) |

---

## Delta Fields (the only NEW frontmatter — minimal per balance-expert)

```yaml
unique_addition: "What this node adds that its parent (inherits_from) does not already provide"
services_offered_to: ["node-id-1", "node-id-2"]   # who consumes/depends on me
cie_connection: "always_active | shadow | requires_promotion | not_applicable"
pe_connection: "scored | input | output | not_applicable"
mini_tree_ref: "path/to/<node-id>.minitree.md"    # lazy — only when node expands
vault_ref: "auto"                                   # lazy — file minted on first vault write
internal_parts:                                     # tagged + statused sub-parts (Governor: handle internal parts)
  - { id: "part-1", kind: "spec|example|counter-example|open-question|decision-record", status: "draft|active|deprecated|superseded", tags: [] }
depth: 2                                             # mini-tree expansion levels (Governor: 2 depth levels)
ripple_seeds: ["node-id-A", "node-id-B"]            # the ripple set this node touches (discipline §5)
state: "ratified"                                   # node lifecycle state
```

---

## Mini-Tree Numbering (Q5 ratified: Dewey-style)

When a node expands into sub-branches/leaves: `<SPINE>.<NN>.<ARTIFACT>.<PART>` — e.g. `GVRN.00.NODEFILE-CONTRACT.001`. Sortable, queryable, enterprise-readable. **Unlimited granularity** (Core-Maximal §P-ARCH-031): no depth limit — sub-branches + leaves without bound, because CIE/PE activate only what's required.

---

## Lazy Vault Per Node (Q6 ratified)

Every node MAY have a vault (`vault_ref: auto`). The actual `<node-id>.vault.md` file is minted **only on first vault write** — avoids empty-vault noise. Vault content has tagged + statused parts (same `internal_parts` taxonomy). This is where a node's deferred/parked sub-items live (per discipline §2 Finding-Handling: save to the node's vault).

---

## The Gap Field (Template-or-Flag enforcement)

If any required field has **no governed value** (e.g. `services_offered_to` references a consumer that doesn't exist yet, or `cie_connection` has no precedent): the node author MUST NOT guess. Per [P-ARCH-032 Template-or-Flag](CORE-MAXIMAL-DOCTRINE.md): write `<field>: FLAGGED-TO-THRESHOLD` + a `pending-nodes.yaml` row, and the value is co-built + ratified before the node is marked `state: active`. The validator treats a `FLAGGED-TO-THRESHOLD` value as a legitimate pending state (not a failure), but BLOCKS `state: active` while any flag is open.

---

## Enforcement (built by Sonnet, PART 1 Batch 1B)

- `validate-nodefile-compliance.mjs` — ADVISORY S068 → BLOCKING after PVA. Changed-file + hash cache (bottleneck-expert). Scope ~30 files (CORE + L1/L2 + pillar headers) in S068.
- `pre-tool-use-nodefile-required.sh` — flags new artifact creation lacking delta fields.
- Connectivity completeness — checked in the holistic audit (daily L2).

## Scope (Q4 ratified)

S068: CORE + L1/L2 core-spines + pillar headers (~30 files) get full NodeFile compliance. Instance-level retrofit (70 B_* + 29 principles + 193 validators) is S069+ phased. The contract exists now; the retrofit is gradual (Core-Maximal: gradual + verified, not big-bang).
