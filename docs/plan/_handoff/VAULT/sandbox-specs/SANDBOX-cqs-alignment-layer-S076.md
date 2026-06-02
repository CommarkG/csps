---
id: csps.handoff.vault.sandbox-cqs-alignment-layer-s076
name: SANDBOX-cqs-alignment-layer-S076
description: >
  SANDBOX design spec for the CQS Alignment Layer — DNA-as-questions engine with
  dual-polarity (positive: enable/intend/cover; negative: prevent/failure-mode/what-breaks-if-absent).
  Per artifact-type. Used for CREATION (answer-before-build) and DEEP-DIVE (surface missing DNA).
  Unifies: CQS (central engine) + instruction-integrity + consolidation-protocol + boundary-crossing.
  ONE canonical home, not four parallel governance systems. NO code until Opus OPIA ratifies.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-06-15"
core_spine: GVRN
core_spines: [GVRN, AI, VALD]
schema_anchor: vault_files
session: S076
authored_by: Sonnet S076
closure_owner: group:finky
closure_decision: "Opus OPIA ratifies spec before any schema, tool, or hook is built"
closure_by: "S076 after OPIA"
layer: system
links:
  - { rel: parent-principle, href: ../../../../packages/principles/principles/P-META-025-context-intent-principle.yaml }
  - { rel: caq-patterns, href: ../../../../tools/config/caq-patterns.yaml }
  - { rel: cruel-critic-skill, href: ../../../../.agents/skills/cruel-critic/SKILL.md }
  - { rel: instruction-integrity-gap, href: ../../../../tools/data/gap-recurrence-register.yaml, note: "gap_INSTRUCTION_INTEGRITY" }
  - { rel: boundary-crossing-protocol, href: SANDBOX-boundary-crossing-protocol-S076.md }
consolidation_cross_refs:
  - tools/config/caq-patterns.yaml
  - .agents/skills/cruel-critic/SKILL.md
  - tools/data/gap-recurrence-register.yaml (gap_INSTRUCTION_INTEGRITY)
  - docs/plan/_handoff/VAULT/sandbox-specs/SANDBOX-boundary-crossing-protocol-S076.md
---

# SANDBOX: CQS Alignment Layer (DNA-as-Questions)

## Context: The Problem with Scattered Alignment

The platform has four separate alignment initiatives, all solving the same root problem ("does this artifact carry its DNA?"):
1. **gap_INSTRUCTION_INTEGRITY** — rules need provenance + governing_intent (anti-rogue + anti-rigidity)
2. **PROTO-S076 consolidation-protocol** — "see what exists first" + bidirectional-SSoT
3. **PROTO-S076 boundary-crossing** — governed crossing of ratified values
4. **5 Guard Questions** — session-start alignment check

These are the SAME animal operating at different scope levels. Design as ONE **Alignment Layer** with CQS as the central engine.

---

## CONSOLIDATION MAP (Preservation/Consolidation/Ripple)

### What EXISTS that CQS absorbs or cross-refs:

| Asset | Location | How CQS Absorbs It |
|-------|----------|-------------------|
| CAQ patterns (5 types) | tools/config/caq-patterns.yaml | CAQ types → CQS negative-pole patterns (diagnostic=NP1, persistence=NP3) |
| cruel-critic 5 amendments | .agents/skills/cruel-critic/SKILL.md | Cruel-critic = negative pole in deep-dive mode (CQS runs cruel-critic as its NP engine) |
| context_question field | Per-register YAML frontmatter | Registers get a `cqs_set_ref:` field pointing to their CQS; context_question = PP1 distilled |
| 5 Guard Questions (G1-G5) | session-open.sh | G1-G5 = CQS for "session-opening" artifact-type (meta-level CQS) |
| B_SIMULATION_COMPARISON BEFORE/AFTER/DELTA | tools/vault/ai-conception/ | Positive pole evidence pattern (PP = demonstrate BEFORE state → assert AFTER claim) |
| gap_INSTRUCTION_INTEGRITY | gap-recurrence-register.yaml | instruction-integrity = CQS applied to incoming instructions (Face A=NP anti-rogue, Face B=PP intent-wrapping) |
| boundary-crossing 5-step | SANDBOX-boundary-crossing-protocol-S076.md | Boundary crossing = CQS instance where Step 3 (deep-assessment) IS the negative pole questions |
| consolidation-protocol | (was a standalone PROTO) | Consolidation = CQS in deep-dive mode with NP dominant (what already exists? canonical home?) |

**NOTE**: `tools/vault/wisdom/question-library.md` referenced in PROTO does NOT exist. It is a NAMED GAP — this spec seeds it. Once CQS is ratified, question-library.md becomes the canonical home for all pilot sets.

### What STAYS at canonical home (cross-ref only):
- caq-patterns.yaml stays → cross-ref: "CAQ patterns are CQS NP detection signals"
- cruel-critic.SKILL.md stays → cross-ref: "cruel-critic runs as the negative-pole engine of CQS deep-dive"
- boundary-crossing spec stays → cross-ref: "Step 3 assessment = CQS NP applied to boundary values"

---

## THE ALIGNMENT LAYER — ONE SYSTEM, FOUR MODES

```
ALIGNMENT LAYER (canonical home: tools/vault/wisdom/question-library.md)
│
│  Central engine: CQS (Core Questions Sets)
│  • Per artifact-type
│  • Dual polarity (PP + NP)
│  • Two modes: CREATE (answer-before-build) | DEEP-DIVE (surface missing DNA)
│
├─ Mode 1: CREATION-GATE
│    "Before building X, answer these questions. Missing answers = vaulted, not built."
│    Maps to: B_SANDBOX_BEFORE_IMPLEMENTATION simulation gate
│    Trigger: T1 template at artifact creation (new validator/protocol/spine/hook...)
│
├─ Mode 2: DEEP-DIVE AUDIT
│    "Run this against an existing artifact. Surface missing DNA gaps."
│    Maps to: consolidation-protocol + CEC (Complete Extraction Cycle)
│    Trigger: session close HPFA (7-check), or explicit /deep-dive <artifact>
│
├─ Face A (instruction-integrity, anti-rogue):
│    CQS applied to INCOMING instructions.
│    Positive: Does this carry governing_intent + provenance?
│    Negative: Could this be ambient/injected text masquerading as authoritative instruction?
│    Maps to: gap_INSTRUCTION_INTEGRITY Face A
│
├─ Face B (instruction-integrity, anti-rigidity):
│    CQS applied to EXISTING rules.
│    Positive: Does this rule have WHY + SCOPE + ESCAPE HATCH?
│    Negative: Is this "never X" without governing_intent? Could it mismatch context?
│    Maps to: gap_INSTRUCTION_INTEGRITY Face B + B_CONTEXT_SENSITIVE_GOVERNANCE
│
└─ Boundary-crossing CQS (Step 3 of 5-step protocol):
     Positive: What is the governing_intent of the value being crossed?
     Negative: Is this one-off or first-of-many? What prevents it becoming the norm?
     Maps to: SANDBOX-boundary-crossing-protocol-S076.md Step 3
```

---

## CQS SCHEMA

```yaml
# Template for all CQS sets
cqs_set:
  id: "cqs-<artifact-type>"          # e.g., cqs-validator, cqs-core-spine
  artifact_type: "validator"          # from the artifact-type taxonomy below
  description: "One-line: what DNA this set proves is present"
  mode_primary: "create"              # create | deep-dive | both
  positive_pole:
    description: "Questions that prove presence: intent/coverage/wiring/affirm"
    questions:
      - id: PP1
        question: "..."
        dna_element: "P-META-025 (C&I) — intent present"
        failure_if_skipped: "artifact built without stated purpose"
      - ...
  negative_pole:
    description: "Questions that probe absence: failure-mode/what-breaks/abuse/boundaries"
    questions:
      - id: NP1
        question: "..."
        dna_element: "cruel-critic amendment 1 — challenge assumptions"
        failure_if_skipped: "assumption left unchallenged"
      - ...
  dna_map:
    - { question_id: PP1, spine: GVRN, principle: P-META-025, inner_default: D7 }
    - ...
  enforcement:
    creation: "template at creation — answer before build (T1 template gate)"
    deep_dive: "audit at session close or /deep-dive — surface gaps"
    answers_required_for_done: [PP1, PP2, NP1, NP2]  # minimum set
```

---

## ARTIFACT TYPE TAXONOMY

Governor's 7 + Opus additions. Each type gets its own CQS set:

| Priority | Artifact Type | Why first | Pilot? |
|----------|--------------|-----------|--------|
| 1 | core-spine | Foundational — errors multiply | ✅ Pilot |
| 2 | validator | Creates enforcement — false gates catastrophic | ✅ Pilot |
| 3 | protocol | Governs behavior — rigidity risk | ✅ Pilot |
| 4 | hook | System-layer — hard to debug if wrong | Later |
| 5 | B_* contract | Behavioral DNA | Later |
| 6 | principle | L1 sealed — ultra-high stakes | Later |
| 7 | handoff/chat-jump | Boundary crossing — context loss | Later |
| 8 | PROTO/relay | Directive — scope creep risk | Later |
| 9 | register | Living data — drift detection | Later |
| 10 | schema-migration | DB-irreversible — highest risk | Later |
| 11 | skill/agent | AI behavior extension | Later |
| 12 | app | Product layer | Last (after foundation) |
| 13 | wizard | User onboarding | Last |
| 14 | output-doc | Summary/report | Last |
| 15 | threshold-file | Routing logic | Last |
| 16 | spine-registry entry | Cross-spine | Later |
| 17 | vault entry | Research/decisions | Later |
| 18 | memory | AI context | Later |
| 19 | summary | Session artifact | Later |

---

## PILOT CQS SET 1 — core-spine

```yaml
id: cqs-core-spine
artifact_type: core-spine
description: "Proves a spine entry carries its domain definition, enforcement wiring, and anti-inflation guardrails"
mode_primary: both

positive_pole:
  - id: PP1
    question: "What fundamental domain does this spine govern? Name 5 concrete artifacts that unambiguously belong to it."
    dna_element: P-ARCH-028 (spine classification) — domain is not a method
    failure_if_skipped: "spine labels a method (like 'simulation') as a domain; inflation begins"

  - id: PP2
    question: "What is the governing intent? (the L3 WHY — not the label or description)"
    dna_element: P-META-025 C&I — operate from intent, not surface
    failure_if_skipped: "spine enforced as label; new entries added by surface similarity not intent alignment"

  - id: PP3
    question: "Which T1+T2+T3 enforcement surfaces make this spine real? If removed, does the spine still enforce?"
    dna_element: AP-001 EXISTS≠ACTIVE — enforcement not description
    failure_if_skipped: "spine is documented theater; no actual enforcement exists"

  - id: PP4
    question: "What metrics prove this spine is active? (validator passes, artifact classification counts)"
    dna_element: P-META-006 (ZF) — evidence not description
    failure_if_skipped: "nominal seal; spine declared active without this-session evidence"

negative_pole:
  - id: NP1
    question: "What is OUT of scope? Name 3 artifacts that look like they belong but must not be classified here."
    dna_element: cruel-critic — challenge scope assumptions
    failure_if_skipped: "spine inflation; edges unclear; AI adds artifacts to wrong spine"

  - id: NP2
    question: "What breaks first if this spine disappears? Name the specific failure mode and which session history illustrates it."
    dna_element: cruel-critic — surface edge cases
    failure_if_skipped: "spine removability not assessed; platform fragility hidden"

  - id: NP3
    question: "How would a rushing AI misclassify an artifact INTO this spine incorrectly? What is the D4 (pattern-match) trap?"
    dna_element: D4 (pattern-match default) — AI applies learned patterns too broadly
    failure_if_skipped: "D4 trap not named; AI will fire it at first opportunity"

  - id: NP4
    question: "If this spine entry is copied and adapted for the next spine, what would the copier get wrong?"
    dna_element: P-META-029 (humble consolidation) — inventory first; unique parts identified
    failure_if_skipped: "context-specific parts become universal; next spine entry inherits wrong values"

dna_map:
  - { question_id: PP1, spine: ARCH, principle: P-ARCH-028, inner_default: D8 }
  - { question_id: PP2, spine: AI,   principle: P-META-025, inner_default: D11 }
  - { question_id: PP3, spine: VALD, principle: P-META-006, inner_default: D3 }
  - { question_id: PP4, spine: VALD, principle: P-META-006, inner_default: D6 }
  - { question_id: NP1, spine: GVRN, principle: B_BALANCE_EXPERT, inner_default: D4 }
  - { question_id: NP2, spine: VALD, principle: cruel-critic,  inner_default: D5 }
  - { question_id: NP3, spine: AI,   principle: P-META-029,   inner_default: D4 }
  - { question_id: NP4, spine: GVRN, principle: P-META-025,   inner_default: D9 }

enforcement:
  creation: "Required before any spine entry is written; answers embedded in the entry"
  deep_dive: "Run quarterly or on spine-registry changes"
  answers_required_for_done: [PP1, PP2, PP3, NP1, NP2]
```

---

## PILOT CQS SET 2 — validator

```yaml
id: cqs-validator
artifact_type: validator
description: "Proves a validator carries its SP-registry anchor, behavioral test, block-test, and coverage boundary"
mode_primary: both

positive_pole:
  - id: PP1
    question: "What satisfaction point does this validator verify? Cite the SP-registry entry."
    dna_element: AP-001 EXISTS≠ACTIVE — mechanism verified, not content written
    failure_if_skipped: "validator runs but proves nothing specific; no satisfaction point"

  - id: PP2
    question: "What is the governing_intent? One sentence: 'This validator exists because WITHOUT it, X breaks by Y session.'"
    dna_element: P-META-025 C&I — intent anchors the validator
    failure_if_skipped: "validator drifts over time as its original purpose is forgotten"

  - id: PP3
    question: "Is there a block-test with pasted output proving the BLOCK behavior? (Not just description of what should block)"
    dna_element: P-META-006 ZF — re-run IS the proof; description ≠ evidence
    failure_if_skipped: "nominal DONE; validator may not block what it claims"

  - id: PP4
    question: "Where is this validator in the verify.mjs hierarchy? STANDARD/DEEP/EXTENDED? Is the tier justified?"
    dna_element: platform-capacity boundary — tier choice has architectural implications
    failure_if_skipped: "validator placed in wrong tier; either blocks when it shouldn't or never runs"

negative_pole:
  - id: NP1
    question: "What failure modes does this validator NOT catch? Name 2 adjacent gaps it deliberately excludes."
    dna_element: cruel-critic — surface edge cases
    failure_if_skipped: "false confidence; AI treats this validator as comprehensive coverage"

  - id: NP2
    question: "What does nominal compliance look like? How would someone pass this validator without actually satisfying its intent?"
    dna_element: AP-001 EXISTS≠ACTIVE — nominal passes are the structural failure mode
    failure_if_skipped: "nominal passing allowed; validator theater replaces real enforcement"

  - id: NP3
    question: "If this validator is removed, how long before someone notices? What is the discovery delay at current tier?"
    dna_element: FINDING-S076-DIM4-EXT-01 pattern — EXTENDED validators can go unnoticed for 1 week
    failure_if_skipped: "validator removal goes undetected; enforcement silently decays"

  - id: NP4
    question: "Is the block-test itself tested? What if the block-test has a false negative (passes when it should block)?"
    dna_element: D3 surface-completeness — block-test completeness ≠ block-test correctness
    failure_if_skipped: "block-test is theater; validator appears tested but isn't"

dna_map:
  - { question_id: PP1, spine: VALD, principle: P-META-006, inner_default: D3 }
  - { question_id: PP2, spine: AI,   principle: P-META-025, inner_default: D11 }
  - { question_id: PP3, spine: VALD, principle: P-META-006, inner_default: D6 }
  - { question_id: PP4, spine: ARCH, principle: B_PLATFORM_CAPACITY, inner_default: D7 }
  - { question_id: NP1, spine: VALD, principle: cruel-critic, inner_default: D5 }
  - { question_id: NP2, spine: GVRN, principle: AP-001,     inner_default: D3 }
  - { question_id: NP3, spine: VALD, principle: P-META-006, inner_default: D7 }
  - { question_id: NP4, spine: VALD, principle: P-META-028, inner_default: D5 }

enforcement:
  creation: "Required before any validator is added to verify.mjs"
  deep_dive: "Run during session close HPFA or when a validator flags unexpectedly"
  answers_required_for_done: [PP1, PP2, PP3, NP1, NP2]
```

---

## PILOT CQS SET 3 — protocol

```yaml
id: cqs-protocol
artifact_type: protocol
description: "Proves a protocol carries its problem-class definition, governing_intent, escape hatch, and recurrence rules"
mode_primary: both

positive_pole:
  - id: PP1
    question: "What PROBLEM CLASS does this protocol solve? One sentence: 'This protocol fires when X, preventing Y.'"
    dna_element: P-META-025 C&I — class-not-instance; threshold-route from problem to protocol
    failure_if_skipped: "protocol applied to wrong problem class; over-fires or under-fires"

  - id: PP2
    question: "What is the governing_intent? What would be catastrophically wrong (not just suboptimal) if this protocol is skipped?"
    dna_element: P-META-025 C&I + PRACE — intent drives mechanical enforcement
    failure_if_skipped: "protocol nominally followed; governing_intent not present; satisfaction at surface"

  - id: PP3
    question: "What are the 3 mandatory artifacts this protocol produces? Are they in permanent files (not chat)?"
    dna_element: G5 PERMANENCE — permanent records only; chat is ephemeral
    failure_if_skipped: "protocol run produces chat-only artifacts; next session starts from zero"

  - id: PP4
    question: "What is the ESCAPE HATCH? Under what conditions is this protocol explicitly suspended, and who can suspend it?"
    dna_element: B_CONTEXT_SENSITIVE_GOVERNANCE — every rule needs an escape hatch
    failure_if_skipped: "protocol becomes a rigid wall; blocks legitimate exceptions without governance"

negative_pole:
  - id: NP1
    question: "What does NOMINAL compliance look like? How would an AI APPEAR to follow this protocol without actually following it?"
    dna_element: AP-001 EXISTS≠ACTIVE — nominal protocol = theater
    failure_if_skipped: "nominal execution accepted; protocol produces the right files but wrong outcomes"

  - id: NP2
    question: "What breaks when this protocol fires at the wrong time? Name the over-trigger failure mode."
    dna_element: rigid-rule-anti-pattern — scope must be precise (initiation pattern, not activity class)
    failure_if_skipped: "protocol over-fires; every session blocked by false positives"

  - id: NP3
    question: "If this protocol fails twice in a row (k=2), what does that signal? Does the protocol itself need re-derivation?"
    dna_element: boundary-crossing NP — k≥2 = the protocol is wrong, not the circumstance
    failure_if_skipped: "protocol failure treated as instance problem; root cause not addressed"

  - id: NP4
    question: "What is the MINIMUM viable version of this protocol that still prevents the failure mode? Is the current version over-engineered?"
    dna_element: balance-expert — complexity score; Occam's razor applied
    failure_if_skipped: "protocol accumulates steps; compliance cost rises; AI skips steps nominally"

dna_map:
  - { question_id: PP1, spine: GVRN, principle: P-META-020, inner_default: D4 }
  - { question_id: PP2, spine: AI,   principle: P-META-025, inner_default: D11 }
  - { question_id: PP3, spine: GVRN, principle: G5,         inner_default: D13 }
  - { question_id: PP4, spine: GVRN, principle: B_CONTEXT_SENSITIVE_GOVERNANCE, inner_default: D10 }
  - { question_id: NP1, spine: VALD, principle: AP-001,     inner_default: D3 }
  - { question_id: NP2, spine: GVRN, principle: rigid-rule-anti-pattern, inner_default: D4 }
  - { question_id: NP3, spine: GVRN, principle: boundary-crossing, inner_default: D9 }
  - { question_id: NP4, spine: GVRN, principle: B_BALANCE_EXPERT, inner_default: D1 }

enforcement:
  creation: "Required before any protocol is authored"
  deep_dive: "Run when protocol fails or is suspected of nominal compliance"
  answers_required_for_done: [PP1, PP2, PP4, NP1, NP2]
```

---

## SIMULATION — CQS-02 (Validator) Deep-Dive on validate-layer-split.mjs

Running CQS-02 in deep-dive mode against the existing `validate-layer-split.mjs` (dim-3 Phase A):

**PP1** ✓ Satisfaction point: layer: field present on all governed artifacts. SP-registry entry: exists in the validator's block-test output.
**PP2** ✓ Governing_intent: "Without layer: classification, scaffold validators can be referenced load-bearingly from system validators, coupling the platform to the council arrangement."
**PP3** ✓ Block-test: removing D16's layer: field → exit 1. Pasted in commit 163b655b.
**PP4** ⚠ Tier: EXTENDED (weekly cron). Discovery delay if removed: up to 1 week.

**NP1 → REAL DNA GAP SURFACED**:
What does validate-layer-split.mjs NOT catch?
- It checks `layer:` field PRESENCE on registered artifacts but does NOT catch NEW D-defaults added to default-correction-registry.yaml WITHOUT a `layer:` field at creation time.
- If a new D20 is added this session without `layer:`, it won't be caught until the next `--extended` run (up to 1 week delay with the EXTENDED tier). 
- **GAP**: no pre-commit gate checks that new D-default entries include `layer:`. The validator is EXTENDED-tier, not pre-commit.

**NP2** ✓ No obvious nominal compliance pattern.
**NP3** ✓ Identified: discovery delay = 1 week (EXTENDED tier). This is acceptable because layer: fields are stable.
**NP4** ✓ Block-test tests real removal behavior.

**CQS deep-dive verdict**: validate-layer-split.mjs is well-formed EXCEPT for NP1 gap — new D-default creation has no real-time layer: gate. The pre-commit hook could add this. This is a GENUINE DNA gap surfaced by CQS deep-dive.

---

## PROPOSED ENFORCEMENT DESIGN

**Mode 1 — Creation Gate** (T1 template):
At creation time, the artifact type template includes the relevant CQS set. A pre-commit hook (or pre-tool-use gate) checks that mandatory PP+NP answers are present before the artifact is committed.

**Mode 2 — Deep-Dive Audit** (scheduled):
A `validate-cqs-coverage.mjs` validator checks that existing artifacts of each type have answered their mandatory CQS questions. Initial run = surfacing gaps; subsequent runs = enforcement.

**Trigger for CQS set**:
```
new artifact detected → classify type → load CQS set for type →
creation mode: require answers before commit
deep-dive mode: check answers against existing artifact → report gaps
```

---

## QUESTIONS FOR OPIA

**Q1**: `tools/vault/wisdom/question-library.md` — is this the right canonical home? Or `tools/config/cqs-sets.yaml` (alongside caq-patterns.yaml)?

**Q2**: CQS deep-dive mode — is it a validator (validate-cqs-coverage.mjs) or a skill (/deep-dive)? Or both?

**Q3**: For Face A/B of instruction-integrity (anti-rogue + anti-rigidity) — are these separate CQS sets or a single "instruction" CQS set with two sub-poles?

**Q4**: dna_map entries reference skills (cruel-critic, B_BALANCE_EXPERT) and non-principle items. Should dna_element be constrained to P-META-* / P-ARCH-* / D-* only, or can it reference behavioral contracts and skills?

**Q5**: Gap surfaced by CQS-02 NP1 (validate-layer-split.mjs: no pre-commit layer: gate on new D-defaults) — authorize fixing this now (small hook addition) or defer to after CQS ratification?

---

## OBLIGATION REGISTRATION NOTE

Per PROTO: supersedes standalone `gap_INSTRUCTION_INTEGRITY` and `consolidation-protocol` PROTOs.
Both are now ABSORBED into this Alignment Layer spec. Their register entries should be updated with a cross-ref to this spec as the unified canonical home.

---

## AUTHOR / SEAL STATUS
- Author: Sonnet S076
- Status: SANDBOX — awaiting Opus OPIA
- Absorbs: gap_INSTRUCTION_INTEGRITY + consolidation-protocol PROTOs
- CQS simulation: validate-layer-split.mjs deep-dive surfaced NP1 real gap (pre-commit layer: gate)
- No code built. Schema + 3 pilot sets + simulation only.
