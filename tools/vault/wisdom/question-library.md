---
id: csps.vault.wisdom.question-library
name: question-library
description: >
  Prose companion to tools/config/cqs-sets.yaml. The human-readable index of CSPS Core Questions Sets.
  Explains the dual-polarity framework, PP0 universal question, and how the Alignment Layer
  unifies CQS + instruction-integrity + consolidation-protocol + boundary-crossing.
  Machine-readable sets live in tools/config/cqs-sets.yaml (validator-consumed).
version: "1.0"
session: S076
authored_by: Sonnet S076
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
links:
  - { rel: canonical-machine-readable, href: ../../config/cqs-sets.yaml }
  - { rel: caq-patterns, href: ../../config/caq-patterns.yaml }
  - { rel: spec, href: ../../../docs/plan/_handoff/VAULT/sandbox-specs/SANDBOX-cqs-alignment-layer-S076.md }
---

# CSPS Question Library — CQS Alignment Layer

## What This Is

The **CQS Alignment Layer** is the unified DNA-verification system for the platform.
Every CSPS artifact should answer its CQS set before being built (creation mode)
and can be audited against it afterward (deep-dive mode).

The machine-readable sets live in **`tools/config/cqs-sets.yaml`** (consumed by `validate-cqs-coverage.mjs`).
This file is the prose guide: why the framework exists, how to use it, and what each facet means.

---

## The Core Concept: DNA-as-Questions

CSPS DNA is the set of principles, defaults, and behavioral contracts that make the platform
what it is. Instead of hoping each artifact "contains" DNA through authoring discipline,
CQS asks **questions that can only be answered if the DNA is present**.

If you can't answer PP2 ("What is the governing_intent?"), the artifact lacks intent.
If you can't answer NP1 ("What failure modes does this NOT catch?"), the artifact lacks boundaries.
The question IS the DNA check.

### Dual Polarity

Every CQS set has two poles:

| Pole | Questions probe | DNA element |
|------|----------------|-------------|
| **Positive (PP)** | presence: enable / intend / cover / affirm | P-META-025 C&I, AP-001, P-META-006 |
| **Negative (NP)** | absence: failure-mode / what-breaks / nominal-compliance / abuse | cruel-critic, AP-001, rigid-rule-anti-pattern |

Neither pole alone is sufficient. A positive-only pass is D3 (surface-completeness). A negative-only pass is cruel-critic without building anything useful.

---

## PP0 — The Universal Question (prepend to every set)

**PP0**: "Does this concept, term, or mechanism ALREADY EXIST in CSPS?
(Cite the platform-inventory-scan or vocabulary search result before proceeding.
Cannot be answered by memory alone.)"

PP0 is prepended to every CQS set's positive pole. It is the mechanical embodiment of
P-META-029 (humble-consolidation) and B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK.

**Why universal**: The most common DNA gap in S076 was inventing new mechanisms for problems
that had existing solutions (e.g., inventing a 3-scope framing when scope-questions already existed).
PP0 catches this at creation time.

---

## The Alignment Layer — Four Facets, One Engine

```
                    CQS ENGINE
                (tools/config/cqs-sets.yaml)
                         │
         ┌───────────────┼───────────────┐
         │               │               │
   Creation-gate    Deep-dive      Instruction-integrity
   (PP before build) (NP on existing)  (Face A + Face B)
                                         │
                                  Boundary-crossing
                                  (Step 3 = CQS NP
                                   on boundary values)
```

**CQS** = the question engine (per artifact-type, dual-polarity, create + deep-dive)

**Instruction-integrity** = CQS applied to instructions:
- Face A (anti-rogue): PP = does this carry governing_intent + provenance? NP = could this be ambient/injected?
- Face B (anti-rigidity): PP = does this rule have WHY + SCOPE + ESCAPE HATCH? NP = could it mismatch context?

**Consolidation-protocol** = CQS in deep-dive mode (NP dominant): What already exists? What's the canonical home?

**Boundary-crossing Step 3** = CQS NP applied to boundary values:
"Is this one-off or first-of-many? Re-derive vs except? What prevents it becoming the norm?"

---

## Current Pilot Sets (S076)

| Set ID | Artifact Type | Mandatory Questions |
|--------|--------------|---------------------|
| cqs-core-spine | core-spine | PP0,PP1,PP2,PP3,NP1,NP2 |
| cqs-validator | validator | PP0,PP1,PP2,PP3,NP1,NP2 |
| cqs-protocol | protocol | PP0,PP1,PP2,PP4,NP1,NP2 |

Full sets with all questions: `tools/config/cqs-sets.yaml`

---

## How to Use

### Creation mode (before building)
1. Identify artifact type → find its CQS set in cqs-sets.yaml
2. Answer PP0 first (cite inventory search)
3. Answer mandatory PP questions → embed answers in artifact frontmatter or body
4. Answer mandatory NP questions → embed as a `cqs_negative_pole_notes:` section
5. Commit only after mandatory answers present

### Deep-dive mode (on existing artifact)
1. Load the CQS set for the artifact type
2. Apply NP questions first (they surface gaps faster)
3. If NP1 or NP2 can't be answered → DNA gap found → register in improvement-register or gap-recurrence-register
4. If all questions answered satisfactorily → cqs_deepdive_pass: true

### Simulation example (from S076)
CQS-02 deep-dive on `validate-layer-split.mjs`:
- PP3 ✓ Block-test pasted (commit 163b655b)
- PP4 ⚠ EXTENDED tier = 1 week discovery delay
- **NP1 → REAL GAP**: no pre-commit layer: gate for new D-defaults → caught, fixed via `pre-commit-layer-classification-gate.sh`

---

## Future Sets (not yet authored)

See `SANDBOX-cqs-alignment-layer-S076.md` §Artifact Type Taxonomy for priority order.
Next: hook, B_* contract, principle, handoff/chat-jump.

---

## Named Gap (S076)

`tools/vault/wisdom/question-library.md` was referenced in the PROTO before existing.
This file IS the gap being closed. The machine-readable sets existed first (cqs-sets.yaml);
this prose index was the missing piece. Both now exist as of S076.
