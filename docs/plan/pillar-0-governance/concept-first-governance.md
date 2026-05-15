---
id: csps.pillar-0-governance.concept-first-governance
name: concept-first-governance
description: The governing methodology for AI behavior in CSPS. Context is the primary navigation tool; rigid enforcement elements (validators, contracts, hooks) are reference samples that confirm whether behavior honors the underlying concept — not the primary definition of correct behavior. Introduces CONCEPT_LOAD as the preamble to The Threshold pipeline. Defines the L1/L2/L3 diagnostic path. Canonicalizes P-META-020.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, AI, VALD, ARCH]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ai
  - type:explanation
  - audience:ai-agent
  - audience:developer
  - maturity:stable
diataxis_type: explanation
session: S014
file_depth_markers:
  l1_lines: "1-80"
  l2_lines: "81-end"
  read_protocol: "L1 = methodology + diagnostic path + composition. L2 = CONCEPT_LOAD spec + scope boundary + anti-patterns."
links:
  - { rel: principle, href: ../../../packages/principles/principles.yaml#P-META-020 }
  - { rel: threshold, href: ./threshold-gate-v2.md }
  - { rel: cca, href: ./cognitive-context-architecture.md }
  - { rel: l1-ai, href: ../../../.claude/core-spines/L1_CORE_AI.md }
  - { rel: l1-gvrn, href: ../../../.claude/core-spines/L1_CORE_GVRN.md }
  - { rel: inner-defaults, href: ../_handoff/VAULT/inner-ai-defaults/README.md }
  - { rel: topic-plan, href: ../_handoff/VAULT/topic-plans/p-meta-020-concept-first-governance.md }
domain_path: platform
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Concept-First Governance — P-META-020

> **The compass model:** Context navigates. Rigid elements confirm.

---

## §1 — The Methodology

### The problem it solves

Specific cases are infinite. Rule sets are finite. Any governance model that treats validators and contracts as the primary definition of correct behavior will always be catching up — adding rules after each new failure. At scale, this produces:
- Validator proliferation with diminishing returns
- Bottlenecks where all checks fire at the same level
- Brittleness when a new situation doesn't match any named rule

### The model

**Context is the primary navigation tool.** When the AI has a deep, active understanding of the relevant concept, it navigates new situations correctly — including ones no rule yet covers. Rigid elements (validators, behavioral contracts, hooks) are **reference samples**: they confirm whether behavior is honoring the concept. Failure is a calibration signal, not a sentence.

```
DEEP CONCEPT UNDERSTANDING
        ↓
AI navigates the situation using the concept as compass
        ↓
Validators fire as reference samples
        ↓
Sample passes → concept honored ✓
Sample fails  → concept drift detected → re-examine concept, not just the artifact
```

### Why this is not "rules are optional"

The validators are mandatory. The contracts are non-negotiable. The difference is in what a failure means:

| Old model | Concept-first model |
|---|---|
| Validator fails → patch the validator target | Validator fails → which concept was this sampling? |
| Add rule to cover new case | Load concept; new case navigates from it |
| Enforcement grows without bound | Enforcement stays bounded; concept depth grows |

---

## §2 — The L1/L2/L3 Diagnostic Path

The Core Spine architecture already encodes this model structurally:

```
L1 (sealed doctrine)   = THE CONCEPT ITSELF
L2 (domain doctrine)   = HOW THE CONCEPT APPLIES IN THIS DOMAIN
L3 (instances)         = WHERE THE CONCEPT MANIFESTS (validators, contracts, artifacts)
```

**When an L3 element fails — the correct diagnostic path:**

```
L3 instance fails
    ↓
Ask: what L2 domain does this instance sample?
    ↓
Has my understanding of that L2 domain drifted?
    ↓
Is the L1 conceptual anchor still fully intact and active in context?
    ↓
Fix: at the highest level where drift is detected
     (L3 patch alone = anti-pattern; L2 re-alignment = correct; L1 re-read = if needed)
```

This diagnostic path prevents rule-violation-patching — the most common governance failure mode.

---

## §3 — CONCEPT_LOAD at The Threshold

Every input that enters CSPS via The Threshold (threshold-gate-v2.md) loads a conceptual frame before processing. This is the PREAMBLE step — it runs before Step 0 (consolidation check) and before any classification or routing.

**Spine selection by input type:**

| Input type | Primary spine domain | Why |
|---|---|---|
| User directive / ratification | GVRN — decision rights | Authority flows from Governor |
| Implementation (code/schema) | ARCH L2 data/structure | Architecture decisions shape extraction |
| AI behavior / defaults | AI L2 inner-defaults | Training defaults vs platform DNA |
| Validation request / evidence | VALD L2 coverage | Evidence must be specific, not nominal |
| External content / research | AI L2 alignment | Absorb selectively via VAULT_DEFER |
| Operations / cadence | OPER L2 reality-grounding | Grounded in what system currently does |

**Scope boundary — CCA Layer 1 vs Threshold PREAMBLE:**

| Mechanism | When | What |
|---|---|---|
| CCA Layer 1 (Permanent Constitution) | Session open — fires once | Full constitutional bedrock: all L1 sealed files loaded |
| Threshold PREAMBLE (CONCEPT_LOAD) | Each input — fires per-input | Selects the most relevant L2 domain for THIS specific input |

These are sequential, not competing. Session open loads the constitution (Layer 1). Each input selects its domain from within that constitutional frame (PREAMBLE). Different granularity.

---

## §4 — Composition with P-META-017, 018, 019

P-META-020 is the **parent frame**. The following principles are applications of it:

| Principle | Role under P-META-020 |
|---|---|
| P-META-017 (inner-defaults override) | The inner-AI-defaults registry is a **calibration instrument** for the AI's conceptual alignment, not a gate. The registry shows WHERE training defaults diverge from platform concept. Disposition: keep/override/adjust = conceptual alignment verdict. |
| P-META-018 (PE alignment guardian) | Anti-sycophancy gate = **conceptual misalignment detector**. When a request conflicts with PE top-priority, it means the immediate-request concept is misaligned with the in-flight-completion concept. Structured deflection re-anchors to the governing concept. |
| P-META-019 (structural prevention) | Fix the structure = fix the **conceptual expression** that allowed the failure. K=2 promotion to engrave = the concept has been demonstrated twice and now deserves a registered validator. |
| P-META-009 (CCA) | The 5-layer cognitive architecture IS the concept-loading implementation. Layer 1 (Permanent Constitution) loads the concept. Layers 2-5 process within it. Quality gates protect against concept degradation. |

P-META-020 does not REPLACE any of these — it NAMES the methodology they collectively implement.

---

## §5 — Reference Sampling Model

Validators, contracts, and hooks sample concept alignment. They are not the complete definition of correct behavior. A `conceptual_sample_of` field (Tier 2 wiring — topic-plan §2) links each enforcement artifact to its parent L2 domain, enabling:
- Automatic diagnostic path: which concept did this validator fail to honor?
- Audit coverage: is the ARCH data domain adequately sampled by the current validator set?
- Drift tracking: when a concept changes at L2, which L3 validators need re-examination?

### The "Interface Pollution" anti-pattern (from industry research)

When an outer-sphere concern requires a change to the core schema, it is a concept-first violation: the outer layer's specific need is overriding the core's conceptual integrity. The plan-coverage gate (B_NO_WILD_IMPLEMENTATION) is the mechanical enforcement — no implementation in `libs/` or `apps/` without a covering ratified plan that declares its L2 domain anchor.

---

## §6 — Anti-Patterns

| Anti-pattern | Description | Structural fix |
|---|---|---|
| `rule-violation-patching` | Validator fires → patch the artifact without checking L2 drift | Add §10.0k to closing summary: "conceptual alignment — any L3 failures indicating L2/L1 drift?" |
| `context-depth-degradation` | Rich understanding at decision point degrades to checkbox across session boundary | Threshold PREAMBLE loads concept per-input; session-open loads L1 per-session |
| `validator-proliferation` | Adding validators as substitute for concept depth | Validators must declare `conceptual_sample_of`; new validators require existing L2 coverage before adding L3 |
| `concept-load-skip` | Processing input before loading conceptual frame | PREAMBLE is mandatory; Threshold routes only after CONCEPT_LOAD |

## §7 — The Triad: Context + Principle + Mechanical (P-META-021)

> P-META-020 establishes that context is the compass. P-META-021 completes the model: context alone is not sufficient. The minimum viable governance stack for consequential decisions requires all three layers.

```
CONTEXT    (P-META-020) = load the conceptual frame (WHAT to navigate toward)
PRINCIPLE  (P-META-021) = name the specific rule that applies (WHERE the boundary is)
MECHANICAL (P-META-021) = enforce independently of AI memory (HOW it holds across sessions)
```

**Why each layer alone fails:**

| Layer alone | Failure mode |
|---|---|
| Context only | Navigates correctly when fresh; degrades across sessions; novel situations find no named boundary |
| Principle only | Rules are finite; cases are infinite; new situations fall through the long tail |
| Mechanical only | Catches named failures; silent on unnamed ones; without understanding, workarounds emerge |

**The feedback loop that makes the triad compound:**

```
Mechanical fires → finding named → enters drift-log → enriches context → better navigation next session
                                  ↓
                             Principle cited → context understands WHY boundary exists
```

This is why CSPS gets better at governance over time rather than accumulating governance debt. Each firing of a mechanical element is a lesson that, if extracted (positive ZF), improves the conceptual frame for the next session.

**Governor-ratified samples (★ = ratified | ⏳ = pending ratification):**

| Situation | Context layer | Principle layer | Mechanical layer | Triad verdict | Status |
|---|---|---|---|---|---|
| Phase advance while VLTs open | GVRN L2: VLTs are open obligations | B_CONSENSUS_BEFORE_PROCEEDING | validate-open-plan-levels.mjs | BLOCK advance | ★ must-be-ratified |
| Add more validators | AI L2: validators are samples not definitions | P-META-020: concept-first | validate-instruction-context.mjs | Deepen concept, not add rule | ★ must-be-ratified |
| Plan promise abandoned | VALD L2: promises are obligations | P-META-006 RZF | validate-open-plan-levels.mjs | Surface obligation | ★ must-be-ratified |
| Wild implementation | GVRN L2: no plan = no authority | B_GRADUAL_BUILD_BY_FOUNDATIONS | pre-tool-use-plan-coverage-gate.sh | BLOCK write | ★ must-be-ratified |
| Nominal ZF claim | VALD L2: evidence specificity | P-META-006 RZF | post-stop-pnpm-verify.sh | BLOCK DONE claim | ★ must-be-ratified |

> **Note:** Each sample is marked "must-be-ratified-by-governor." AI-authored samples are illustrative, not canonical, until the Governor explicitly ratifies them. Ratification converts a sample from ILLUSTRATIVE to CANONICAL — it becomes a platform reference case.

