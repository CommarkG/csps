---
id: SIA.META-02-MINI-TREE-DEPTH
type: architecture
protection_level: protected
status: draft
core_spines: [ARCH, OPER, AI]
context_question: "What are Mini Tree and Depth Levels, why are they different concepts, and how do they work together?"
context_quote: "Mini Tree decides WHICH nodes. Depth Level decides HOW MUCH of each node. These are orthogonal."
version: "0.1"
session: S050
name: "SIA-META-mini-tree-depth"
description: "Mini Tree (which nodes) and Depth Levels (how much) — orthogonal efficiency mechanisms"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# META-02 — Mini Tree + Depth Levels

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> These are two separate efficiency mechanisms. Do not conflate them.

---

## 1. The Critical Distinction

| Concept | Question it answers | Unit of selection |
|---|---|---|
| **Mini Tree** | Which nodes are included in this context? | Nodes (breadth) |
| **Depth Level** | How much of each included node is loaded? | Content within a node (depth) |

These are orthogonal dimensions. A node can be:
- **Included at D1** — present but minimal (peripheral awareness)
- **Included at D3** — present with full operational context (execution-ready)
- **Excluded** — not part of this context at all

The Mini Tree selects the nodes. The Depth Level specifies per-node how much content to include.

---

## 2. Mini Tree

### 2.1 What It Is

Mini Tree is a general efficiency mechanism for avoiding cognitive overload. Instead of loading all platform elements at full context, the Mini Tree selects an optimal subset — the minimum necessary for the current task — and loads them.

[TO FILL: The tree metaphor — root (the essential concept), branches (the required context), leaves (the optional detail). Different tasks prune the tree differently.]

### 2.2 How Mini Tree Selection Works

[TO FILL: Who decides which nodes are in the Mini Tree for a given task? The Platform Intelligence Engine (PIE). Based on: task type, active Core Spines, depth level configuration, current session type (ARCH/MIXED/EXEC).]

### 2.3 Mini Tree Weights

[TO FILL: Each node has a `mini_tree_weight` field (see R1-01-NODE-SCHEMA.md). This weight influences how likely the PIE is to include the node when constructing the Mini Tree for a task. High weight = included in almost all Mini Trees. Low weight = included only when directly relevant.]

### 2.4 Peripheral Awareness

[TO FILL: Peripheral nodes — included at D1 only. They don't consume significant context budget but they remain "present." The Queen dimension of PE uses peripheral awareness: important timing signals are always in the Mini Tree at D1 even when not the focus.]

---

## 3. Depth Levels

### 3.1 The Principle

Depth Levels are intent-driven, not number-driven. A depth specification includes:
- **Intent:** What this depth achieves
- **Guardrail:** The boundary condition
- **Typical form:** An illustrative example (not binding)
- **Exception condition:** When typical form doesn't apply

### 3.2 Depth Specifications

**D1 — Minimal Context**
- Intent: enough to remind without loading
- Typical form: concept name + one orientation statement
- Exception: if the concept requires more to orient without distorting, use more
- Use: peripheral nodes, background awareness, reminder context

**D2 — Orientation Context**
- Intent: enough to understand what this node is and why it exists
- Typical form: concept + rationale + key constraints
- Use: supporting nodes that inform but aren't primary

**D3 — Operational Context**
- Intent: enough to execute correctly
- Typical form: full spec + rationale + constraints + typical examples
- Use: nodes actively needed for the current task

**D4 — Implementation Context**
- Intent: enough to build correctly
- Typical form: D3 + implementation details + validator references + edge cases
- Use: nodes being built or modified

**D5 — Complete Context**
- Intent: sufficient for ratification and audit
- Typical form: complete with all sub-elements, history, ratification evidence
- No fixed form — completeness is contextually determined
- Use: sacred file review, Governor ratification, post-session audit

---

## 4. How They Work Together — The PIE Configuration

For each task, the PIE produces a configuration:

```yaml
task_context:
  mini_tree:
    - node_id: "R1.4-THRESHOLD"
      depth: D3    # actively needed
    - node_id: "R1.6-AI-BEHAVIORAL-PROFILE"
      depth: D1    # peripheral — reminder only
    - node_id: "PHI-01-PALACE-PHILOSOPHY"
      depth: D1    # always present in Mini Tree at D1
    - node_id: "R2.1-PIE"
      depth: D2    # orientation only — not executing PIE work
```

[TO FILL: How this configuration is generated. What inputs the PIE uses. How it adapts across session types.]

---

## 5. Mini Tree in Documentation

[TO FILL: Each documentation node uses Mini Tree internally. The document is a tree: the root is the §header (sealed, always D1), branches are §body sections, leaves are sub-sections with individual depth levels and notes. Reading the document is traversing the tree at whatever depth is needed.]

---

## 6. Open Questions

1. Is the `mini_tree_weight` field the right mechanism, or should inclusion be computed dynamically from task type + spine?
2. Should depth levels be integers (D1-D5) or a continuous scale?
3. How does Mini Tree interact with the governor's working memory across a multi-turn session?

---

*CSPS — SIA | Mini Tree + Depth Levels v0.1 | S050 | Protection: protected (proposed)*
