---
id: csps.governance.THE-IDEAL-BUILD
name: THE-IDEAL-BUILD
description: "If building CSPS from scratch today with all accumulated S001-S053 wisdom — this is the build order, the core decisions, and the right sequence. Not documentation of what was built. The TARGET STATE. Updated when major architectural decisions prove correct across 3+ sessions."
type: architecture
protection_level: sacred
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spines: [GVRN, ARCH, AI]
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
version: "0.1"
session: S053
impl_status: swift-implemented
diataxis_type: reference
context_question: "Before designing any new platform feature, does The Ideal Build already describe the correct approach — and if not, why not?"
context_quote: "If I were to build this platform from scratch, how would I be building it? The content and context must be using all of the systems' insights and wisdom, having gradual cycles of build up, establishing the core with its pillars, and applying all the audits."
links:
  - csps.governance.PLATFORM-GENOME
  - vault.concepts.OPTIMAL-BUILD-ORDER-S050
  - vault.concepts.GRID-CONSCIOUSNESS
---

# The Ideal Build
## What CSPS would be if built today with S001-S053 wisdom

> This is NOT documentation of what was built. It is the TARGET STATE.
> The Platform Genome shows what EXISTS. The Gap Register shows what's BROKEN.
> The Improvement Register shows what IMPROVED. The Ideal Build shows what SHOULD BE.
>
> Updated when: a moat element has proven itself across 3+ sessions and would be
> built first if starting over. This document earns its entries — not every insight qualifies.
>
> Current version: v0.1 (S053 skeleton). Sections marked [TO BUILD] need one proven 
> session cycle before being filled.

---

## Phase 0 — Foundation (build first, everything depends on this)

### 0.1 — Governance Philosophy
Build BEFORE any code:
- **PRACE** (Permanent Recurring AI Contextual Enforcement): every rule needs T1+T2+T3 at creation. Written rule = 0%. T3 alone = will drift.
- **Grid Architecture**: each node carries permanent context. No central bottleneck. HANDOFF = delta only.
- **Default Storage is Ephemeral**: AI defaults to chat (ephemeral). Build structural forcing for permanent storage from day 1.
- **Guard Questions over Rules**: rules activate compliance mode. Guard questions activate verification mode.

### 0.2 — Core Spines (5, declared at project start)
GVRN > VALD > ARCH > AI > OPER (precedence order). Every artifact declares its spine. Constitutional: sealed, never amended without ADR.

### 0.3 — Platform Genome (index first, content second)
Build the Platform Genome before the first validator. The Genome is the index every tab loads. Without it, every new session re-discovers the same principles.

### 0.4 — Three-Question Communication Test
Establish before multi-model coordination begins:
1. Who sent this? (one entity, no ambiguity)
2. Who reads this? (one entity, no ambiguity)
3. What does the receiver do next? (one action)
FROM/TO format follows naturally from these three questions.

---

## Phase 1 — Behavioral Infrastructure

### 1.1 — Gap Recurrence Register
Build BEFORE the first behavioral contract. K counts prevent the mirror loop.
K >= 2: structural fix required. K >= 3: blocks session close.

### 1.2 — Improvement Register
Build ALONGSIDE the Gap Register. Positive findings need the same 4-stage pipeline as negative findings. Without it, improvements disappear into chat.

### 1.3 — Behavioral Test Suite
Every behavioral rule needs a test case at creation. Not a description of what the rule does — a test that shows the T2 validator catches the violation. Build this infrastructure before the first validator.

### 1.4 — AI Inner Defaults Registry
Register all AI training defaults that CSPS overrides. Required at creation:
- training_default (what the AI does by default)
- satisfaction_point (what incorrect "done" looks like)
- T1/T2/T3 enforcement
Key overrides: SUMMARIZATION_DRIVE, AUTHORITY_ATTRIBUTION, EXAMPLE_INSTRUCTION_CONFUSION, RIGID_RULE_SATISFACTION (rigid-rule-anti-pattern.md).

---

## Phase 2 — Creation Standards

### 2.1 — Three Depth Levels (L1/L2/L3)
Every artifact specifies its depth level at creation:
- L1: verbatim, raw, no AI paraphrase — quotes go here
- L2: structured with context_question (guard quality) + context_quote (verbatim) + inherits_from
- L3: indexed in Platform Genome, linked from validators

### 2.2 — Guard Questions vs. Guide Questions
context_question = a guard, not a guide. Cannot be answered without checking state.
Pattern: "Before [action], has [specific verifiable state] been confirmed?"
The Question Library (tools/vault/libraries/QUESTION-LIBRARY.md) is the canonical reference.

### 2.3 — Inheritance Declaration
Every new artifact declares: `inherits_from:` (which Platform Genome section)
The creation wizard requires this field. No orphan nodes.

### 2.4 — Explore → Ratify → Execute Pipeline
Three phases, never mixed:
- EXPLORE: analysis produces plan item, nothing else
- RATIFY: Governor approves plan item
- EXECUTE: Sonnet builds against ratified plan item only

---

## Phase 3 — Validation Infrastructure

### 3.1 — Reflexive Tool Application
Every new validator is immediately run on the work that produced it. This is M-33.
The first run catches gaps in the process that built the tool.

### 3.2 — Challenge Round Protocol
After every implementation: Sonnet lists context_question for each artifact.
Opus independently generates best context_question.
Compare → consolidate → stronger version goes in artifact AND Question Library.
The library grows. Future artifacts benefit from accumulated question patterns.

### 3.3 — Communication Quality Validation
validate-communication-quality.mjs checks new communication templates for:
- FROM/TO format compliance (ADVISORY)
- Governor impersonation patterns (BLOCKING)
The communication-samples.md library provides pattern-matching data (not just rule checking).

---

## Phase 4 — Behavioral Intelligence (BEHAVIOR-HUB)

[TO BUILD — requires Phase 1-3 foundations to prove correct across 3+ sessions]

### 4.1 — Vocabulary Service (Phase 1 YAML, Phase 2 ZModel)
- UserVocabulary (global, @csps/vocabulary-service in libs/)
- AppVocabulary (per-app, PRIVATE-BUSINESS-SILOS isolation)
- First-visit profile creation (not first correction)

### 4.2 — THRESHOLD-CODE (input classification)
- 10 input types, 7 routing pipelines
- extends user-prompt-submit-intake.sh
- session harvest (R1.4.4) is the downstream consumer

---

## Phase 5 — Application Infrastructure

[TO BUILD — proves correct when first CSPS-correct app completes INFRA-FLOW-VALIDATION]

### 5.1 — INFRA-FLOW-VALIDATION (9-step end-to-end test)
Every app must pass all 9 steps before being called CSPS-correct.
Currently: 4 ACTIVE, 3 PARTIAL, 2 NOT BUILT.

### 5.2 — App Health Scanner
Dynamic evaluation using Platform Genome as criteria source.
MDPE-scores every gap. "Build from scratch" output per The Ideal Build.

---

## When to Update This Document

A section earns its place here when:
1. The approach has been implemented
2. It has been tested in at least one real build
3. It has been challenged (cruel critic / balance expert review)
4. The session that challenged it confirmed: "this would be first if starting over"

Speculative improvements do NOT belong here. Proven improvements do.

---

*The Ideal Build | docs/plan/pillar-0-governance/ | S053 | v0.1 skeleton*
*Next update: after first CSPS-correct app passes INFRA-FLOW-VALIDATION*
