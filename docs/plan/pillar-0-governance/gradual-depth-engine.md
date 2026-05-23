---
id: csps.pillar-0-governance.gradual-depth-engine
name: gradual-depth-engine
description: >
  The Gradual Depth Engine (GDE) — Governor directive S018. The fundamental architectural
  principle that makes complex systems manageable: every element, every process, every
  interaction must have explicitly predefined depth levels (L1/L2/L3 minimum). Without
  predefined depth levels, systems face two failure modes: cognitive overload (always
  loading everything) or discovery failure (can't find things when needed). The GDE
  resolves this through predefined, queryable, machine-selectable depth levels that
  activate on demand based on context and need.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
enforcement_stage: planned
impl_status: swift-implemented
core_spine: AI
core_spines: [AI, GVRN, ARCH, VALD, OPER]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ai
  - domain:platform
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S018
links:
  - { rel: parent, href: ./README.md }
  - { rel: cdp-plan, href: ../../plan/_handoff/VAULT/topic-plans/core-dynamic-plan.md }
  - { rel: grace-architecture, href: ../../platform-audit/platform-services/context-orchestrator.md }
  - { rel: depth-discipline, href: ./depth-discipline.md }
  - { rel: instruction-template, href: ./instruction-template.md }
consolidation_cross_refs:
  - docs/plan/_handoff/VAULT/topic-plans/core-dynamic-plan.md
  - docs/platform-audit/platform-services/context-orchestrator.md
  - docs/plan/pillar-0-governance/depth-discipline.md
domain_path: platform
diataxis_type: explanation
core_spine: ARCH
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# The Gradual Depth Engine (GDE)

> **Governor directive S018:** "The key for a manageable architecture of this kind is a brilliant gradual engine of usage. These can work only if everything has a predefined gradual level of depth and complexity. This is the fundamental issue as far as I can see."

---

## Why This Is the Fundamental Issue

Complex systems fail in two predictable ways:

**Failure Mode 1 — Cognitive Overload:** Everything is loaded at maximum depth by default. A session that opens AGENTS.md (3,096 words), principles.yaml (85K tokens), behavioral-contracts.md (48K tokens), all domain cards simultaneously — cannot reason effectively. Context is saturated before work begins.

**Failure Mode 2 — Discovery Failure:** Nothing is loaded until explicitly requested. The AI operates on training defaults because relevant context wasn't loaded. Architectural decisions are made without the platform's constraints. The satisfaction point fires at "I answered the question" rather than "I answered it correctly in the CSPS context."

**The only escape:** Predefined depth levels that are:
1. EXPLICIT — every element declares its L1/L2/L3 representation
2. MACHINE-SELECTABLE — the orchestrator can choose the right depth based on task class
3. ESCALATABLE — when L1 is insufficient, L2 loads automatically via escalation ladder
4. QUERYABLE — an external party can request "give me the L1 of GVRN" and get a consistent answer

---

## The Three Depth Levels (GDE Standard)

Every CSPS element MUST have all three levels defined.

**L1 — Executive / Orientation (mandatory, always available, ≤200 tokens)**
What is this? What does it govern? Why does it matter right now?
For an AI: loads at session-open, always resident in Tier 0 cache.
For a human: read in 30 seconds, complete orientation.

**L2 — Operational / Working (on-demand, ≤2,000 tokens)**
How does it work? What are the key mechanisms? What are the constraints?
For an AI: loads when L1 is insufficient (task-complexity escalation, Ladder 3).
For a human: read in 5 minutes, enough to operate confidently.

**L3 — Implementation / Specification (deep dive, no token limit)**
What are the exact file paths, line numbers, validator commands, failure cases?
For an AI: loads when L2 is insufficient or explicit L3 trigger fires.
For a human: reference documentation, consulted when implementing.

---

## Where GDE Already Exists in CSPS

**Already implemented:**

| Element | L1 | L2 | L3 |
|---|---|---|---|
| Domain cards §4 | "Executive view" | "Operational view" | "Implementation view" |
| Context-loading templates | estimated_token_cost_L1 | estimated_token_cost_L2 | (full depth on demand) |
| Depth-discipline.md | Depth markers in frontmatter | — | — |
| Principles.yaml | L1 depth queries | L2 depth queries | Full principles |
| ZF orchestrator | Level 1 (advisory) | Level 2 (phase gate) | Level 3 (deep — session close) |
| file_depth_markers | l1_lines | l2_lines | l3_lines |

**The gap:** These depth levels exist in different systems with different notations. They are NOT unified under one GDE standard. When the context orchestrator loads "L1 of GVRN," it reads from the domain card. When it loads "L1 of P-META-006," it queries MCP. When it loads "L1 of B_TOKEN_BUDGET," it reads the behavioral contracts. Three different sources, three different L1 formats, no unified queryable interface.

---

## The GDE Standard (What We're Building)

**Every CSPS element must declare:**

```yaml
# In frontmatter (for documents)
depth_levels:
  l1: "One sentence: what this element is and does"
  l1_tokens: 150  # target
  l2: "Brief description of the operational content at L2"
  l2_tokens: 1500  # target
  l3: "Reference to full implementation detail"
  l3_location: "./this-file.md#section"  # where L3 lives

# Or in domain card §4 (for CDP elements)
# (Already exists — the GDE formalizes and unifies it)
```

**The orchestrator uses this to:**
1. Pre-load L1 of task-relevant elements at session-open (Tier 0 cache)
2. Load L2 on-demand when L1 is insufficient (Tier 1 MCP query)
3. Load L3 only when implementation detail is explicitly needed (Tier 3 or Tier 4)

---

## The Gradual Engines (Mechanism)

The "engines" are the escalation mechanisms that move from depth to depth:

**Engine 1 — Context Orchestrator:** Detects task class → selects context bundle at appropriate depth → loads L1 by default, escalates to L2 on failure signal.

**Engine 2 — ZF Escalation Ladder (Task Complexity):** When L1 context produces BLOCKING findings → domain_failure_signal → next turn loads L2 for that domain automatically.

**Engine 3 — MCP Query Expansion:** `get_domain_card("GVRN")` returns L1 by default. `get_domain_card("GVRN", depth="L2")` returns full detail. The depth parameter makes the gradient explicit.

**Engine 4 — Vault CDP Pipeline:** INPUTS enter at L1 (raw). As they progress through cdp_status states, richer context is added (L2 at ratification, L3 at implementation). The depth grows with the lifecycle stage.

---

## The Vault-GDE Connection

This is the architectural insight that connects vaults to the GDE:

**Vaults are L1 depth** — they hold the compact, staged representation of INPUTS in transit.
**Domain cards are L2 depth** — they hold the operational description of CDP elements.
**Implementation files are L3 depth** — they hold the actual code, validators, and contracts.

When the Threshold processes an INPUT:
1. INPUT enters at L1 (raw, compact, just enough to classify)
2. Threshold routes it to the appropriate CDP pipeline stage
3. As the element matures, L2 and L3 representations are built
4. The Threshold never loads L3 — it's always L1, escalating only on explicit need

This means the vault restructuring is NOT cosmetic — it's architectural. Items in the vault ARE L1 artifacts. When they're promoted to domain cards, they become L2. When they're implemented and validated, L3 exists. The three-tier vault structure (INCOMING/PIPELINE/SEALED) maps directly to L1/L2/L3.

---

## The Fundamental Rule of GDE

> **Every element in CSPS must have explicitly defined L1, L2, and L3 representations. An element without predefined depth levels cannot be safely loaded by the context orchestrator, cannot be escalated by the ZF ladder, and cannot be queried by the MCP knowledge graph. It is invisible to the gradual architecture.**

**The self-assessment question (human-judgment complement):**
"Can I load only L1 of this element and get meaningful orientation? Can I escalate to L2 when L1 is insufficient? Is L3 explicitly defined?"

If any answer is NO: the element violates GDE.

---

## Implementation Roadmap

**GDE is the infrastructure dependency for both:**
- CDP (core-dynamic-plan.md) — L1/L2/L3 per lifecycle stage
- Platform-core-alignment (platform-core-alignment.md) — L1/L2/L3 per threshold routing step

**Build order:**
1. **Now:** GDE principle documented (this file) + registered in platform
2. **CDP L1:** Add `depth_levels:` frontmatter to domain-card.template.md (schema_version → 1.1)
3. **CDP L3:** Validate that all CDP elements have explicit L1/L2/L3 via `validate-depth-levels.mjs`
4. **Context orchestrator Phase 10:** Reads depth_levels to determine what to load at each engine tier
5. **MCP Phase 5:** `get_element("X", depth="L1|L2|L3")` makes depth queryable

**The gradual build IS the GDE in action:** Each step above loads the next level of the GDE itself. GDE describes itself at L1 (this paragraph), L2 (the implementation roadmap), L3 (the specific validator commands and file changes).
