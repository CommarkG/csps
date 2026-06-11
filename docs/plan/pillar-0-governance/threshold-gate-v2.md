---
id: csps.pillar-0-governance.threshold-gate-v2
name: threshold-gate-v2
description: >
  THE THRESHOLD — canonical governance gate (v3). Every input to CSPS crosses this gate
  before processing. Governing intent: ABSORB-WITHOUT-DERAIL. Contains: 13-input taxonomy,
  8-step pipeline with CONCEPT_LOAD preamble + STEP-0 see-what-exists + No-Orphans cascade
  + EQA-wired consolidation glance, PARK 4-lane deferral model (schedule/queue/vault/obligation),
  DNA-stamp at intake, import quarantine, ripple-check, model-tier routing, platform moat.
  Family consolidated 2026-06-10 S082 (threshold-gate.md absorbed; threshold-intake-protocol.md
  + threshold-deep-dive.md remain as companion SSoT docs).
version: "3.0"
status: ratified
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
template_used: pillar-leaf
template_status: stable
core_spine: GVRN
core_spines: [GVRN, OPER, AI, VALD, ARCH]
schema_anchor: pillar_0_governance_leaves
diataxis_type: explanation
session: S082
governing_intent: >
  ABSORB-WITHOUT-DERAIL. Every input is absorbed (classified, routed, logged — governance
  applied from the first moment of input) without derailing active work. Nothing enters
  unclassified. Nothing is silently dropped. Nothing requires interrupting the active plan
  unless the input meets the 4-condition interrupt gate. The Threshold is how CSPS governs
  its construction process at the INPUT STREAM level — not just at merge time.
park_code_word_ratified: true
park_ratified_session: S082
dna_stamp_anchor: tools/config/dna-registry.yaml
never_drop_anchor: P-META-033
no_orphans_anchor: P-META-036
eqa_anchor: docs/plan/pillar-0-governance/CONSOLIDATION-AUDIT-S082.md
file_depth_markers:
  l1_lines: "1-120"
  l2_lines: "121-end"
  read_protocol: "L1 = governing_intent + 13-input taxonomy + 8-step pipeline + PARK lanes. L2 = STEP-0 detail + PARK 13-route map + DNA-stamp + import quarantine + ripple-check + moat + dashboard."
links:
  - { rel: threshold-v1, href: ./threshold-gate.md }
  - { rel: intake-protocol-ssot, href: ./threshold-intake-protocol.md }
  - { rel: deep-dive-reference, href: ./threshold-deep-dive.md }
  - { rel: layer-3-onboarding, href: ./meta-platform/threshold-gate.md }
  - { rel: dna-registry, href: ../../../tools/config/dna-registry.yaml }
  - { rel: vault-methodology, href: ./vault-methodology.md }
  - { rel: council-registry, href: ./council-registry.md }
  - { rel: consolidation-audit, href: ./CONSOLIDATION-AUDIT-S082.md }
domain_path: platform
scope_level: S1
context_question: "Is this Threshold doc current with the active session's Threshold implementation state?"
---

# The Threshold — Canonical Gate

> **ABSORB-WITHOUT-DERAIL.** Every input type — trivial or non-trivial, internal or external — crosses The Threshold before any processing. The type determines source_class and classified_type; the content determines the route. Nothing is processed before crossing. Nothing is dropped without a PARK guarantee.

---

## §0 — Document Navigation (Three-Layer System)

The Threshold is a three-layer system. This document is Layer 1 (the Platform Input Gate). The other layers have their own canonical SSoT documents:

| Layer | What it is | Canonical file |
|-------|-----------|----------------|
| **Layer 1 — Platform Input Gate** | Classifies, routes, and logs every input to CSPS before processing | **This file** |
| **Layer 2 — I→VI Discipline** | Closes the intent-impact gap on every communication surface (42 surfaces, 26-item checklist) | [`threshold-intake-protocol.md`](./threshold-intake-protocol.md) |
| **Layer 3 — Onboarding Gate** | User-facing wizard captures archetype before dashboard (OnboardingWizard UI) | [`meta-platform/threshold-gate.md`](./meta-platform/threshold-gate.md) |

For the complete three-layer reference see: [`threshold-deep-dive.md`](./threshold-deep-dive.md).

---

## §1 — The 13 Input Types (Complete Taxonomy)

| # | Input type | source_class | classified_type | Default route | PARK lane (if deferred) |
|---|---|---|---|---|---|
| 1 | User prompt (governance directive) | chat-channel | user-directive | SWIFT_EXECUTE (4-condition) | PARK:schedule |
| 2 | User prompt (question) | chat-channel | question | COUNCIL_REVIEW | — |
| 3 | User prompt (ratification) | chat-channel | ratification | SWIFT_EXECUTE | — |
| 4 | External file/URL/paste | external-content | document | VAULT_DEFER | PARK:vault |
| 5 | Agent/subagent output | agent-output | tool-result | SWIFT_EXECUTE (mechanical) | — |
| 6 | Inner-default leak | inner-default-leak | sycophancy | COUNCIL_REVIEW | PARK:obligation |
| 7 | Competitor platform update | external-content | competitor-intel | VAULT_DEFER | PARK:queue |
| 8 | Existing app extraction | external-content | app-extraction | VAULT_DEFER | PARK:vault |
| 9 | Error log / validator finding | agent-output | error | SWIFT_EXECUTE or COUNCIL | PARK:obligation (if K≥2) |
| 10 | PR comment / code review | external-content | code-review | VAULT_DEFER | PARK:vault |
| 11 | Monitoring alert | agent-output | performance-alert | COUNCIL_REVIEW | PARK:obligation |
| 12 | External AI consultation | external-content | ai-research | VAULT_DEFER | PARK:vault |
| 13 | News / trend signal | external-content | trend-intel | VAULT_DEFER | PARK:queue |

**The platform advantage:** Types 7–13 (competitor updates, market signals, external AI output) are inputs most platforms never treat as governed. CSPS routes them through the same pipeline as a user prompt — classified, routed, logged, DNA-stamped, and PARK'd with a guaranteed retrieve_when trigger.

---

## §1b — Model Tier Routing Schema

Every input that crosses The Threshold carries an implicit `model_tier` requirement:

```
DECISION_ARCHITECTURE → model_tier: OPUS
  Strategic, multi-session consequences: kill-condition ratification, new principle,
  PROTO design, EPOCH design, invariant selection.
  Execution: Governor opens Opus tab, pastes input with ZCA block.

IMPLEMENTATION → model_tier: SONNET (workspace default)
  Build + wire + verify: validator builds, hook writes, plan item execution,
  HANDOFF authoring, file edits per ratified spec.

QUICK_CHECK → model_tier: SONNET or HAIKU
  Fast lookup, status check, single-file read, git status.

COUNCIL_REVIEW → model_tier: OPUS required
  CAQ MODE fires (2+ diagnostic types in one prompt, or AP-004 binary-collapse risk).
  Execution: PAUSE, route to Opus tab before any SWIFT_EXECUTE.
```

---

## §2 — The 8-Step Pipeline

```
ANY INPUT
    ↓
PREAMBLE: CONCEPT_LOAD (P-META-020 — mandatory before any step)
    Select the governing L2 spine domain for this input type:
      user-directive / ratification  → GVRN (authority + decision rights)
      implementation (code/schema)   → ARCH L2 data/structure domain
      AI behavior / defaults         → AI L2 inner-defaults domain
      validation / evidence          → VALD L2 coverage domain
      external-content / research    → AI L2 alignment domain (VAULT_DEFER)
      operations / cadence           → OPER L2 reality-grounding domain
    If no clear domain → default to GVRN → COUNCIL_REVIEW.
    ↓
STEP 0: SEE WHAT EXISTS + NO-ORPHANS CASCADE + EQA GLANCE  [See §3 for detail]
    (a) Run check_reuse for the concept being introduced.
        Match found → ENHANCE, not CREATE → route to SWIFT_EXECUTE.
        No match → continue.
    (b) No-Orphans check (P-META-036): any new artifact must declare spine +
        canonical home BEFORE creation is authorized.
        "Enhance > Consolidate > New-as-core-or-branch" is the cascade.
    (c) EQA glance (Scope-2 of catch-pipeline P-META-037): if STEP-0 finds
        3+ similar artifacts without SSoT → flag as scatter → EQA consolidation candidate.
    ↓
STEP 1: DETECT source_class
    Pattern detection: user-prompt-submit-intake.sh
    → chat-channel | external-content | agent-output | inner-default-leak
    ↓
STEP 2: NORMALIZE to IntakeEvent
    Typed envelope: { source_class, classified_type, route_to, context, priority_band,
                      dna_stamp_required, park_lane (if deferred) }
    ↓
STEP 3: CLASSIFY type + priority_band
    Closed enum (13 types). Spine tag inferred from type. Scope tag (S1/S2/S3) inferred.
    context-orchestrator.sh task-class detection → load appropriate council member.
    ↓
STEP 4: ROUTE
    SWIFT_EXECUTE → process immediately (mechanical, reversible, 4-condition gate passes)
    COUNCIL_REVIEW → surface to Governor with context intact
    PARK          → defer with guaranteed retrieval (4 lanes — see §4)
    DROP          → log + discard with explicit reason (rare; requires human approval)
    ↓
STEP 5: LOG
    Append to .csps/threshold/intake-log.yaml (append-only, never modified)
    ↓
STEP 6: RIPPLE CHECK  [See §5 for detail]
    Verify intent → plan → implementation → validation chain coherence.
    For PARK'd items: add retrieve_when trigger + context preservation.
    Any chain break = intent-impact gap surfaced to Governor.
    ↓
STEP 7: TRIGGER council member
    governance-session / consolidation-expert / synergy-master / zf-validation / etc.
    ↓
STEP 8: IMPACT
    Update IntakeEvent.state_machine_pos → 'executed' | 'parked' | 'council'
```

---

## §3 — STEP-0 Detail: See What Exists + No-Orphans + EQA

STEP-0 has three mandatory sub-steps before any other step runs:

### 3a — Reuse Check (Consolidation-First)

Before introducing any new concept, run `check_reuse`:
- Search existing: behavioral-contracts-index.yaml + audit-runner-index.yaml + principles slices + skill registry
- Match found → **ENHANCE the existing, do NOT create parallel**
- Near-match → **CONSOLIDATE** (inform Governor, propose cross-ref)
- No match → continue to Step 1

### 3b — No-Orphans Cascade (P-META-036)

If STEP-0a finds no match and a new artifact may be created:
1. **Enhance first** — can the new concept enhance an existing artifact?
2. **Consolidate next** — can it become a canonical home for similar scattered content?
3. **New-as-core-or-branch** — only then create new; MUST declare at creation:
   - Primary `core_spine` (GVRN/ARCH/AI/OPER/VALD)
   - `schema_anchor` (canonical home category)
   - No-Orphans parent in the spine hierarchy

Any new artifact created without these declarations violates P-META-036 and is blocked by the pre-tool-use-corespine-check.sh hook.

### 3c — EQA Consolidation Glance (Scope-2 of Catch Pipeline, P-META-037)

STEP-0 also fires as the positive-polarity Scope-2 sweep:
- If STEP-0 discovers 3+ similar artifacts without a designated SSoT → this is a SCATTER CATCH (P-META-037 catch, positive or negative polarity)
- Route the scatter catch to the EQA pipeline (see `CONSOLIDATION-AUDIT-S082.md`)
- PARK the consolidation opportunity in PARK:queue with retrieve_when = "next EQA session"

**Why STEP-0 grounds the EQA:** Every input crossing The Threshold gets a free scatter check. This makes the EQA continuous (per-input) not batch-only. The EQA cadence (session/weekly/milestone) catches what per-input sweeps miss; per-input sweeps catch what the cadence would miss between runs.

---

## §4 — PARK: The 4-Lane Deferral Model

**PARK** is the unified deferral verb replacing the scattered defer vocabulary. Governor code word: `"PARK X"` = capture with guarantee of return. Opus response: `"PARKED: X → [lane], resurfaces @ [condition]"`.

### The 4 Lanes

| Lane | Description | Never-drop? | Retrieve trigger |
|------|-------------|-------------|-----------------|
| **PARK:schedule** | Dated obligation — specific session or date committed | ✅ YES | The committed session arrives |
| **PARK:queue** | Next available slot — no date, but ordered in backlog | ✅ YES | Next consolidation pass or PE re-score |
| **PARK:vault** | Condition-triggered retrieval — surfaces when context is relevant | ✅ YES | Named condition (e.g., "when app#1 deployed") |
| **PARK:obligation** | Hard commitment — never-drop enforced, P-META-033 governed | ✅ YES | Condition OR explicit Governor confirmation |

**All 4 lanes are never-drop.** PARK is not "defer and forget." PARK is "defer with a guaranteed return path." P-META-033 governs the obligation lane specifically; all lanes inherit the never-drop guarantee.

### PARK Row Schema (design spec — register consolidation in PHASEB)

```yaml
# Every PARK'd item has this shape (regardless of which lane):
park_entry:
  id: "PARK-SXXX-NN"                    # session + sequence
  lane: schedule | queue | vault | obligation
  input_type: "[1-13 from §1]"
  content: "[the captured concept/directive/insight verbatim]"
  retrieve_when: "[specific condition or session]"
  never_drop: true                       # always
  context_preserved: "[what the future-self needs to know]"
  source_proto: "[PROTO that created this park entry, if any]"
  created_session: SXXX
  closed_session: null                   # null = still open
  closed_evidence: null
```

### 13 Input Types → PARK Lane Mapping

| # | Input type | Primary route | If deferred → PARK lane | Example retrieve_when |
|---|---|---|---|---|
| 1 | User directive | SWIFT_EXECUTE | PARK:schedule | "session S085 after Phase B gate" |
| 2 | Question | COUNCIL_REVIEW | (council resolves) | — |
| 3 | Ratification | SWIFT_EXECUTE | — | — |
| 4 | External file | VAULT_DEFER | **PARK:vault** | "when this domain is being built" |
| 5 | Agent output | SWIFT_EXECUTE | — | — |
| 6 | Inner-default leak | COUNCIL_REVIEW | **PARK:obligation** | "next session — must address D-leak" |
| 7 | Competitor update | VAULT_DEFER | **PARK:queue** | next EQA pass |
| 8 | App extraction | VAULT_DEFER | **PARK:vault** | "when app type N is being designed" |
| 9 | Error/validator | SWIFT or COUNCIL | **PARK:obligation** (K≥2) | "before app#2 — structural fix required" |
| 10 | PR comment | VAULT_DEFER | **PARK:vault** | "during next code review session" |
| 11 | Monitoring alert | COUNCIL_REVIEW | **PARK:obligation** | "before next perf review" |
| 12 | External AI research | VAULT_DEFER | **PARK:vault** | "when this topic enters build queue" |
| 13 | News/trend | VAULT_DEFER | **PARK:queue** | next EQA or strategy session |

### 8 Defer-Verb Consolidation (Design Only — Physical Merge = PHASEB)

The platform currently has 8 scattered defer-verb mechanisms. All map to PARK lanes:

| Existing mechanism | File | Maps to PARK lane |
|---|---|---|
| VAULT_DEFER (route outcome) | intake-router.mjs | → PARK:vault |
| vault_pending.retrieve_when | intake-log entries | → PARK:vault schema |
| gap-recurrence-register entries | tools/data/gap-recurrence-register.yaml | → PARK:obligation (K≥2) |
| improvement-register entries | tools/data/improvement-register.yaml | → PARK:queue (not-yet-propagated) |
| impact-obligation-register entries | tools/data/impact-obligation-register.yaml | → PARK:obligation |
| never-drop register (P-META-033) | session closing/handoff | → PARK:obligation |
| threshold-intake-log deferred entries | .csps/threshold/intake-log.yaml | → PARK:vault (existing) |
| Deferred plan items (unified-plan.yaml) | tools/config/unified-plan.yaml | → PARK:schedule |

**PHASEB consolidation:** Physically merge these 8 registers into one `tools/data/park-register.yaml` (PARK SSoT), cross-referencing originals. Gated on cycle-counter reconciliation + Governor per-register ratification.

---

## §5 — The Ripple Check (STEP-6 Detail)

Between INTENT (what the input said) and IMPACT (what the platform does), 6 checkpoints must be coherent:

```
Intent (input as received)
    ↓ [THRESHOLD GATE] — classified correctly?
Classification (source_class + classified_type)
    ↓ [PE ALIGNMENT] — right priority band?
PE Routing (PE band → council member)
    ↓ [COUNCIL DISPATCH] — right skill loaded?
Skill/Plan (§KH consultation + reuse check)
    ↓ [CONSTRUCTION GATE] — plan before implementation?
Implementation (code/artifact)
    ↓ [ZF GATE] — pnpm verify exit_code 0?
Impact (sealed-zf artifact)
```

Any break in this chain = intent-impact gap. The ripple-check expert (council-registry §2) verifies chain coherence on every non-trivial SWIFT_EXECUTE item.

For PARK'd items: STEP-6 adds `retrieve_when` trigger + context preservation (what the future-self needs to understand the item without reconstructing context from scratch).

---

## §6 — DNA-STAMP at Intake (Element 1)

Every input crossing The Threshold is DNA-stamped before entering CSPS. This is especially critical for external-content inputs (types 4, 7, 8, 10, 12, 13).

### DNA-Stamp Requirement

All inputs that proceed beyond VAULT_DEFER to active use must carry CSPS DNA markers per `tools/config/dna-registry.yaml`:

```yaml
# Required DNA markers (dna-registry.yaml SSoT):
dna_required:
  - frontmatter.id             # canonical CSPS ID format
  - frontmatter.core_spine     # one of GVRN/ARCH/AI/OPER/VALD
  - frontmatter.schema_anchor  # valid schema_anchor enum value
  - frontmatter.impl_status    # swift-implemented | audit-1-complete | sealed-zf
  - principle_compliance       # cites at least one P-META or P-ARCH principle
  - consolidation_cross_refs   # what existing elements this relates to
```

### DNA-Stamp Pipeline (for external inputs)

```
External input → VAULT_DEFER (always)
    ↓ Analysis phase:
       - Extract wisdom + patterns
       - Map to existing CSPS elements (STEP-0 reuse check)
       - Design CSPS-native equivalent
    ↓ DNA injection (per dna-registry.yaml):
       - Add required frontmatter fields
       - Add principle compliance tags
       - Add consolidation_cross_refs
    ↓ Re-enter Threshold (now source_class: internal)
    ↓ SWIFT_EXECUTE or COUNCIL_REVIEW
```

No imported element enters active use without DNA injection. This is how The Threshold prevents external content from bypassing CSPS governance via AI training defaults.

**Link:** `tools/config/dna-registry.yaml` — the machine-readable SSoT for all required DNA fields and their valid values.

---

## §7 — Import Quarantine

*Preserved from threshold-gate.md §4 — distinct protocol for cross-boundary content.*

Everything imported from outside CSPS crosses a quarantine path:

```
External source (MCP / Agent / Skill / Package / insight / research)
    ↓ source_class: external-content → VAULT_DEFER (always)
    ↓ DNA-stamp check (§6 above)
    ↓ Analysis phase:
       - Is this already covered by existing CSPS elements? (STEP-0)
       - If yes → ENHANCE (not create new)
       - If no → design CSPS-native equivalent
    ↓ PARK the quarantined item (lane depends on urgency + domain)
    ↓ Governor ratification of CSPS-native design
    ↓ Re-enter Threshold as source_class: internal
    ↓ SWIFT_EXECUTE or COUNCIL_REVIEW
```

**B_INTAKE_GATE:** *"Every input to CSPS must cross The Threshold — be classified into source_class, normalized to IntakeEvent, assigned route_to, and logged to intake-log. No input bypasses The Threshold. External imports additionally require CSPS DNA injection (dna-registry.yaml) before active use."*

---

## §8 — Platform Moat: Input-Stream Governance

*Preserved from threshold-gate.md §6 — why this is a moat.*

Most platforms govern their **output** (code quality, API contracts, merge gates). CSPS governs its **input stream**.

| Standard platform | CSPS Threshold |
|---|---|
| Processes input for CONTENT — what does it say? | Processes input for GOVERNANCE — what TYPE is it? |
| Acts on the first expression | Treats first expression as always incomplete (I→VI) |
| External imports processed by AI training defaults | External imports quarantined until CSPS DNA injected |
| Intent-impact gap invisible until rework accumulates | Intent-impact gap surfaced + closed before action |
| Competitor signals processed as chat | Competitor signals classified → PARK:queue → structured analysis |
| AI behavioral defaults drift silently | inner-default-leak source class surfaces + routes to AI_PROFILE |
| Inputs either processed or dropped | All inputs: SWIFT_EXECUTE / COUNCIL_REVIEW / PARK / DROP |
| No guarantee on deferred items | PARK 4-lane model: ALL deferrals are never-drop |

---

## §9 — Platform Comparison as an Input Type

Type 7 (competitor-intel) flows through The Threshold like any other input:

```yaml
# Example IntakeEvent for competitor input
id: "EXT-20260506-001-A"
source_class: external-content
classified_type: competitor-intel
content: "Backstage v1.5 released automated component discovery via repo scanning"
route_to: VAULT_DEFER
park:
  lane: queue
  retrieve_when: "Next EQA consolidation pass or platform-audit session"
  never_drop: true
  context_preserved: >
    Backstage automated discovery = what validate-nothing-stands-alone does manually.
    Possible validation that CSPS approach is industry-aligned.
```

The comparison framework lives at `docs/plan/_handoff/VAULT/platform-comparisons/`.

---

## §10 — Developer Dashboard Schema (Week-10)

```yaml
# dashboard_schema.yaml
sections:
  - id: council-status
    title: "Active Council Members"
    data_source: council-registry.md
    refresh: per-session
    admin_configurable: true

  - id: moat-health
    title: "Moat Elements"
    data_source: moat-registry.md + validate-moat-coverage output
    refresh: daily

  - id: threshold-activity
    title: "Threshold Pipeline Activity"
    data_source: .csps/threshold/intake-log.yaml
    refresh: per-session

  - id: park-register
    title: "PARK Register — Open Deferrals"
    data_source: tools/data/park-register.yaml (PHASEB)
    refresh: per-session
    note: "Shows all open PARK entries by lane; never-drop items highlighted"

  - id: ep-sg-registry
    title: "Error Patterns / Success Patterns"
    data_source: know-how/error-patterns/ + know-how/success-patterns/
    refresh: weekly

  - id: consolidation-eqa
    title: "EQA — Consolidation Debt Score"
    data_source: CONSOLIDATION-AUDIT-S082.md + tools/data/ scatter metrics
    refresh: weekly
```

---

## §11 — Governing Principles

| Principle | What it governs | How Threshold enforces it |
|---|---|---|
| **P-META-020 Concept-First Governance** | Context as compass; spine selection first | CONCEPT_LOAD PREAMBLE before every step |
| **P-META-022 Human Intent Crystallization** | First expression always incomplete | Layer 2 I→VI discipline (threshold-intake-protocol.md) |
| **P-META-023 I→VI Discipline** | 26-item checklist, 42 surfaces | Layer 2 SSoT (threshold-intake-protocol.md) |
| **P-META-033 No-Lost-Threads** | Every routed input guaranteed to resurface | PARK 4-lane model — all lanes never-drop |
| **P-META-036 No-Orphans Law** | Every new artifact declares spine + home | STEP-0b: No-Orphans cascade gates creation |
| **P-META-037 Symmetric Catch Processing** | Every catch (pos/neg) through 3 scopes | STEP-0c: EQA glance = Scope-2 of catch pipeline |
| **P-META-017 CSPS-Alignment-Over-Inner-Defaults** | AI training defaults yield to governance | inner-default-leak source class + AI_PROFILE pipeline |
| **P-ARCH-028 Core Spine Discipline** | Every input classified by governing spine | spine_tag inferred at STEP-3 classify time |
| **B_INTAKE_GATE** | All inputs classified + logged | Threshold hooks + validate-threshold-intake.mjs |

---

## §12 — Cross-References + Family Navigation

### This Document vs Family Members

| File | Relationship | Status |
|------|-------------|--------|
| `threshold-gate.md` (root) | v1 spec — content absorbed into this v3; original kept for link stability | Cross-ref only; this v3 is canonical |
| `threshold-gate-v2.md` | **THIS FILE** — canonical governance gate v3 | Active |
| `meta-platform/threshold-gate.md` | Layer 3 OnboardingWizard UI (ARCH spine, S037) — DIFFERENT concept | Stays at its location; not merged |
| `threshold-deep-dive.md` | Comprehensive 3-layer reference synthesizing all Threshold layers | Companion reference; not retired |
| `threshold-intake-protocol.md` | I→VI discipline SSoT (P-META-023) — Layer 2 | Companion SSoT; not retired |

### Implementation Files

| File | Role |
|------|------|
| `libs/threshold/src/intake.ts` | TypeScript: classify + route + log |
| `tools/config/threshold-classification-rules.yaml` | Pattern rules for hook-driven classification |
| `libs/threshold/config/pipelines.yaml` | Pipeline routing rules (data, not code) |
| `.csps/threshold/intake-log.yaml` | Append-only classified input record |
| `tools/data/threshold-intake-log.yaml` | Hook-driven intake log (separate from TS log) |
| `tools/validators/validate-threshold-intake.mjs` | T2 advisory validator in pnpm verify |
| `tools/config/dna-registry.yaml` | DNA stamp SSoT |

---

## §13 — Preservation Diffs (S082 Consolidation)

**Content absorbed from `threshold-gate.md` (root, v1, 146 lines):**
- §4 Import quarantine → now §7 here (enhanced with DNA-stamp link)
- §5 B_INTAKE_GATE contract wording → now embedded in §7
- §6 Platform moat table (standard vs CSPS) → now §8 here (expanded)
- §2 Component table (current state) → superseded by threshold-deep-dive.md Part 10 (more current)

**Not absorbed (stays in threshold-deep-dive.md as the detailed reference):**
- TypeScript library implementation detail (Part 6)
- L1-summary aggregation protocol (§6.4)
- Per-spine session artifacts detail (§9.4)
- Full current-state + forward-path tracking (Part 10)

**`meta-platform/threshold-gate.md` — NOT merged (different concept):**
- This file covers the OnboardingWizard UI flow (Layer 3, ARCH spine). `threshold-deep-dive.md` already synthesizes it as Part 5. It stays at its current location.

**`threshold-intake-protocol.md` — NOT merged (remains SSoT for I→VI):**
- 26-item checklist, 42 surfaces, coaching philosophy, 5-item agreement. Layer 2 SSoT. This file cross-refs it at §0 Layer 2 entry.

---

*RATIFIED v3.0 — part of CONCEPT cluster Item 4. Ratified with cluster Item 7, 2026-06-11. No enforcement code built yet (PHASEB gated).*
*Consolidated S082: threshold-gate.md absorbed; family cross-referenced; 6 elements woven.*
