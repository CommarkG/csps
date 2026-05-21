---
id: SIA.R1-01-NODE-SCHEMA
type: architecture
protection_level: protected
status: draft
core_spines: [ARCH, GVRN]
context_question: "What is the universal structural definition of a node in CSPS, and how does node inheritance work?"
context_quote: "A node is not an artifact. It is a living, inheriting unit of the platform."
version: "0.1"
session: S050
name: "SIA-R1-node-schema"
description: "Universal node definition and inheritance model for CSPS SIA Round 1"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# R1.1 — Node Schema

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> This is the foundational data model. Everything in CSPS is (or becomes) a node.

---

## 1. What Is a Node?

[TO FILL: Definition of a node. A node is not just a file or a document — it is the fundamental unit of the CSPS platform. It can represent a principle, a feature, a plan item, a journey stage, an agent, a skill, or a documentation section.]

---

## 2. Universal Node Fields

```yaml
# Every node in CSPS must have these fields. No exceptions.
node:
  id:                # unique identifier — format: [domain].[type].[name]
  type:              # node type — from closed enum [see §3]
  parent_node:       # parent node id — null only for root nodes
  depth_level:       # D1-D5 — how much context this node loads [see META-02]
  status:            # from closed enum [see §4]
  core_spines:       # list — primary spine first
  dna_inherited:     # list of DNA properties inherited from parent
  doc_ref:           # path to the node's living document
  mini_tree_weight:  # how this node participates in Mini Tree selection
  context_question:  # mandatory — "What essential question does this node answer?"
  context_quote:     # mandatory — a recurring phrase anchoring this node's purpose
  protection_level:  # draft | active | protected | sacred
```

---

## 3. Node Types (Closed Enum)

[TO FILL: The complete list of node types. Examples: principle, contract, schema, validator, hook, template, plan_item, skill, agent, journey_stage, documentation_section, core_seed]

---

## 4. Node Status (Closed Enum)

[TO FILL: The status lifecycle for nodes. Proposed: draft → active → sealed | deprecated | vault]

---

## 5. Inheritance Model

[TO FILL: How a child node inherits from its parent. Which fields are inherited vs. overridden. When inheritance creates a conflict, how it is resolved. The sealed section rule: sealed sections cannot be overridden without ratification.]

### 5.1 DNA Inheritance

[TO FILL: Every node inherits the dna_inherited[] list from its parent. New DNA items can be added. Existing items cannot be removed without explicit Governor authorization.]

### 5.2 Context Inheritance

[TO FILL: context_question and context_quote — a child node's context anchors must not contradict the parent's. They can specialize the parent's context but not invert it.]

---

## 6. The Protocol (R1.1.4 — Propagation Rules)

[TO FILL: When the node schema itself changes (R1.1 is modified), all nodes are flagged for review. The propagation mechanism: which file types are affected, how the flag is raised, how Governor confirms updates.]

---

## 7. File Type Registry (R1.1.2)

Each node type maps to one or more file types:

| Node type | Primary file type | Secondary file type |
|---|---|---|
| principle | .md (frontmatter) | — |
| contract | .md (behavioral-contracts.md entry) | — |
| validator | .mjs | .md (documentation node) |
| hook | .sh | .md (documentation node) |
| schema | .yaml | .md (documentation node) |
| template | .md or .yaml | — |
| plan_item | .yaml (unified-plan.yaml entry) | — |
| skill | .md (SKILL.md) | — |
| journey_stage | .yaml | .md (documentation node) |

[TO FILL: Complete the table. Add file type constraints.]

---

## 8. Open Questions

1. Should `type` be strictly enforced at creation, or can it evolve?
2. What is the correct inheritance model when a node has multiple parent references?
3. How deep should the `dna_inherited[]` chain go before it becomes overhead?

---

*CSPS — SIA | Node Schema v0.1 | S050 | Protection: protected (proposed)*
