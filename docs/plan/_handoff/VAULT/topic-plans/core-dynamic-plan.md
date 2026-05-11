---
id: csps.handoff.vault.topic-plan.core-dynamic-plan
name: core-dynamic-plan
description: >
  The Core Dynamic Plan (CDP) — Governor directive S018. A schema-perfect-fit lifecycle
  state machine for every major CSPS element. Unifies the currently scattered lifecycle
  fields (lifecycle_state, impl_status, enforcement_stage, ZF evidence) into one coherent
  state machine with a single routing point (the Threshold) and consistent tagging.
  CDP elements are the nodes of the multi-layered grid. INPUTS and FINDINGS are the
  canonical terms for what enters and exits the system. CDP is CSPS's version of the
  Backstage.io Software Catalog pattern — a centralized, schema-governed registry of all
  platform elements with queryable lifecycle state.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: gradual-build-plan
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, VALD, ARCH, OPER]
schema_anchor: topic_plans
tags:
  - domain:governance
  - domain:platform
  - type:how-to
  - audience:ai-agent
  - audience:developer
  - maturity:draft
diataxis_type: how-to
session: S018
execution_mode: deep_quality
intent_crystallized: true
threshold_route: platform.governance
know_how_consulted: true
enforcement_stage: planned
topic_id: core-dynamic-plan
priority_score: 92
priority_band: 1
depth_chosen: 4
depth_rationale: |
  Depth-4: (a) CDP touches all 5 spines — requires deep integration work;
  (b) The lifecycle state machine must be proven on 3+ elements before platform-wide
  rollout; (c) L1 (vocabulary + unified state definition) is the mandatory foundation.
  Not depth-5: the CDP itself is not a constitutional change — it's additive to existing
  structures, not a replacement.
links:
  - { rel: parent, href: ./README.md }
  - { rel: instruction-template, href: ../../../../docs/plan/pillar-0-governance/instruction-template.md }
  - { rel: mechanical-enforcement-policy, href: ../../../../docs/plan/pillar-0-governance/mechanical-enforcement-policy.md }
  - { rel: platform-core-alignment, href: ./platform-core-alignment.md }
  - { rel: ai-personas, href: ../../../platform-audit/ai-personas.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/instruction-template.md
  - docs/plan/pillar-0-governance/mechanical-enforcement-policy.md
  - docs/platform-audit/README.md
  - docs/plan/_handoff/VAULT/topic-plans/platform-core-alignment.md
domain_path: platform
---
## §0 — CONSOLIDATION CHECK (mandatory — read before any implementation)

CHECK WHAT EXISTS before any implementation step in this plan.
- Search: tools/validators/ for existing validators covering this area
- Search: tools/generators/ for existing generators
- Search: .claude/hooks/ for existing hooks
- Search: docs/plan/pillar-0-governance/audit-runner.md for registered slugs
- Search: docs/plan/_handoff/VAULT/topic-plans/ for overlapping plans
- Search: libs/ for existing integrations and patterns

Consolidation finding: [update with findings when implementing each step]



# Topic-Plan — Core Dynamic Plan (CDP) (depth-4)

> **Governor directive S018:** "The CDP is a schema-perfect-fit structure having a CDP dynamic element in any major element of the platform — holding specific core wisdom — one source of truth — centralized — using the core spine methodology — Threshold as definite routing system — each content has a 'place' — statuses from raw to sealed — PE has permanent holistic view."

---

## §HARVEST — What this plan is designed to extract

```yaml
harvest_triggers:
  - on: phase_gate
    collect: [cdp_state_machine_validated, threshold_routing_proven, inputs_findings_vocabulary]
    destination: vault
  - on: plan_close
    collect: [unified_lifecycle_state_across_platform, CDP_elements_3+_proven]
    destination:
      - extraction_note: docs/plan/_handoff/VAULT/session-S019-extraction.md
      - governance_hub: docs/plan/pillar-0-governance/

harvest_questions:
  - "Is there now ONE place to ask 'what is the status of this platform element?'"
  - "Does the Threshold correctly classify every INPUT on entry?"
  - "Can PE derive a complete current-state snapshot from CDP element statuses alone?"
  - "Do FINDINGS feed back into INPUTS as new elements entering the system?"
```

---

## §0 Context — What CDP Solves

**The fragmentation problem (honest diagnosis):**
CSPS today has governance lifecycle data scattered across:
- `lifecycle_state:` (active/pending-review/closed — top-level field)
- `impl_status:` (swift-implemented/audit-1-complete/sealed-zf)
- `enforcement_stage:` (stub/planned/week-4/active/human-judgment)
- ZF evidence blocks (in closing summaries, not on the element itself)
- `maturity:` tag (draft/review/stable/frozen)

To answer "what is the status of B_TOKEN_BUDGET?" requires reading:
- behavioral-contracts.md (text description)
- audit-runner.md (slug + enforcement stage)
- AGENTS.md (hard NO reference)
- feedback_token_budget.md (memory)
- closing-summary (ZF evidence)

There is no single canonical answer. CDP fixes this.

**Validated industry pattern (Backstage.io Software Catalog):**
Spotify's Backstage is exactly this for software components: every service/library/API has a YAML descriptor → catalog → single API → PE-equivalent (scorecards). Used by hundreds of companies including Airbnb, American Airlines, Netflix. The CDP is the governance equivalent.

---

## §1 — Level 1: Vocabulary + Unified State Machine

**Goal:** Define INPUTS, FINDINGS, and the CDP lifecycle state as formal vocabulary. Establish the unified state machine that replaces the scattered fields.

**INPUTS (formal definition):**
Everything that enters the platform governance system. An INPUT is:
- A Governor prompt (new directive, ratification, question)
- External AI review output (Perplexity, Gemini, GPT, Claude-external)
- External research (web, industry patterns)
- A raw thought (from raw-thoughts vault)
- A code change (PR, commit)
- A positive event (ratification, insight) → generates a CEC INPUT

INPUTS enter through the Threshold → classified → staged → routed to canonical location.

**FINDINGS (formal definition):**
Outputs of the validation/audit/ZF process. A FINDING is:
- BLOCKING: stops work immediately (Tier 1 priority, emergency-mode PE)
- ADVISORY: tracked obligation, doesn't stop work
- POSITIVE: CEC discovery, generates a new INPUT for the system
- STRUCTURAL: K=2 pattern → mandatory engraving INPUT

FINDINGS feed back into INPUTS: a FINDING creates a new element entering the system.

**The Unified CDP Lifecycle State Machine:**

```
raw
  → pipeline-intake      (Threshold classified it, EXT-ID assigned)
  → pending-review       (awaiting Governor assessment)
  → pending-ratification (Governor reviewed, decision pending)
  → ratified             (Governor ratified, canonical home assigned)
  → implementing         (active work in progress)
  → implemented          (work done, validation pending)
  → zf-achieved          (last ZF run = ZERO BLOCKING FINDINGS — INST-VALD-001)
  → measured             (KPIs tracked, impact assessed)
  → sealed               (closed, immutable, evidence block present)
```

**Field:** `cdp_status:` (new frontmatter field, replaces the 5 scattered fields above)

**L1 Exit Criteria:**
- [ ] INPUTS and FINDINGS registered in vocabulary.md with definition + concept_ref + canonical_home
- [ ] `cdp_status:` closed-enum defined in frontmatter-closed-enums.md
- [ ] `cdp_status:` added to validate-frontmatter.mjs
- [ ] First 3 CDP elements: B_TOKEN_BUDGET + B_RESULT_NOT_OUTPUT + instruction-template.md
- [ ] pnpm verify exit_code 0

---

## §2 — Level 2: Threshold Routing Protocol

**Goal:** Define the Threshold as the single entry point for all INPUTS. Every INPUT gets classified, staged, and routed without exception.

**The routing protocol:**

```
INPUT arrives (Governor prompt / external review / code change / raw thought)
  ↓
THRESHOLD fires (context-orchestrator + CONCEPT_LOAD + spine classification)
  ↓
CLASSIFICATION:
  → Governor directive    → GVRN L2 → session-state.json (mandate)
  → Ratification          → GVRN L2 → behavioral-contracts.md (new entry)
  → External research     → AI L2   → raw-thoughts vault + EXT-ID
  → Code change           → ARCH L2 → PR validation pipeline
  → Positive finding      → VALD L2 → CEC walk + session extraction
  → Negative finding      → VALD L2 → catch-to-engraving + validator registration
  ↓
CDP ELEMENT CREATED/UPDATED:
  cdp_status: raw → pipeline-intake
  canonical_home: assigned
  concept_ref: spine L2 domain
  ↓
PE SCORES UPDATED:
  PE reads all cdp_status values → generates priority queue
  High-PE: zf-achieved → measured (close the loop)
  Emergency: BLOCKING FINDING
```

**L2 Exit Criteria:**
- [ ] Threshold routing protocol document (threshold-gate-v2.md mini-tree with routing sub-file)
- [ ] cdp_status tracked in session-state.json for active elements
- [ ] PE compositions updated to weight by cdp_status
- [ ] pnpm verify exit_code 0

---

## §3 — Level 3: CDP Elements for 5 Spines

**Goal:** Every major platform element across all 5 spines has a CDP descriptor with cdp_status + concept_ref + ai_behavior_refs.

**The CDP element schema (addition to domain card §1-§11):**

```yaml
# Added to domain card frontmatter
cdp_status: [raw|pipeline-intake|pending-ratification|ratified|implemented|zf-achieved|measured|sealed]
concept_ref: [L2 domain — e.g. "GVRN L2 decision rights"]
ai_behavior_refs:
  - inner-ai-defaults/reasoning-patterns.md#reasoning-ai-satisfaction-point
  - inner-ai-defaults/tooling-patterns.md#tooling-clear-on-idle
canonical_home: [where this element's authoritative definition lives]
inputs_accepted: [list of INPUT types this element processes]
findings_produced: [list of FINDING types this element generates]
```

**L3 Exit Criteria:**
- [ ] `cdp_status:` on all 14 platform-audit domain cards
- [ ] `ai_behavior_refs:` on all 14 domain cards (links to inner-ai-defaults)
- [ ] `validate-ai-behavior-reference-freshness.mjs` (detects stale ai_behavior_refs)
- [ ] `validate-cdp-status-consistency.mjs` (checks cdp_status progression is valid)
- [ ] pnpm verify exit_code 0

---

## §4 — Level 4: PE Holistic View + CDP Query Surface

**Goal:** PE can derive a complete current-state snapshot from CDP element statuses alone. MCP can answer "what is the status of B_TOKEN_BUDGET?" in one query.

**PE holistic view:**
```
PE_QUERY: get_pe_ranking()
  → reads all cdp_status values
  → applies composition weights
  → outputs: [{element, cdp_status, pe_score, next_action}]

HIGH PRIORITY: elements in cdp_status: implemented (validation pending)
MEDIUM PRIORITY: elements in cdp_status: ratified (implementation pending)
LOW PRIORITY: elements in cdp_status: measured (maintenance mode)
EMERGENCY: elements with BLOCKING FINDINGS (regardless of status)
```

**MCP query surface:**
```
get_cdp_element("B_TOKEN_BUDGET")    → full CDP descriptor + cdp_status + ai_behavior_refs
get_inputs_for_session("S018")       → all INPUTS that arrived this session
get_findings_for_session("S018")     → all FINDINGS (positive + negative)
get_elements_by_status("implemented") → all elements awaiting ZF validation
```

**L4 Exit Criteria:**
- [ ] `get_cdp_element()` tool in principles-mcp
- [ ] `get_inputs_for_session()` tool in principles-mcp
- [ ] PE reads cdp_status natively (pe-compute.mjs updated)
- [ ] pnpm verify exit_code 0

---

## §5 — Vault CDP Realignment (planned S019+)

**Goal:** Restructure the vault from content-type organization to lifecycle-stage organization, aligned with CDP states.

**Planned structure (do NOT execute without a dedicated migration session):**


**Migration gate:** validate-no-implementation-without-plan.mjs must show 0 unplanned after restructuring. All cross-references must be updated. Dedicated migration session required.

---

## §Priority Engine Inputs

```yaml
priority_engine:
  topic_id: core-dynamic-plan
  depth_chosen: 4
  priority_band: 1
  priority_score: 92
  B_COMPLETION_OVER_SHINY: active — platform-core-alignment L1 (vocabulary) is a dependency
  dependency: platform-core-alignment L1 must register INPUTS and FINDINGS vocabulary first
  note: >
    CDP cannot start until vocabulary foundation is in place.
    L1 of CDP runs in parallel with L2 of platform-core-alignment.
    The CDP state machine (cdp_status) and the platform-audit template propagation
    (template_version) are complementary mechanisms — both serve the same multi-layered
    grid architecture.
```
