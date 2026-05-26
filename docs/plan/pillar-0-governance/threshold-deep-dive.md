---
id: csps.pillar-0-governance.threshold-deep-dive
name: threshold-deep-dive
description: "Full-depth reference on The Threshold — CSPS's universal input governance system. Covers all three layers: platform-level input gate, I→VI intent discipline, and user onboarding gate. Every aspect: what it is, why it exists, how it works, the principles it embodies, and every connected element."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, ARCH, AI, OPER, VALD]
schema_anchor: pillar_0_governance_leaves
diataxis_type: explanation
impl_status: swift-implemented
session: S062
authored_by: Sonnet-10
tags:
  - domain:governance
  - domain:ai
  - domain:ops
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: layer-1-spec, href: ./threshold-gate.md }
  - { rel: layer-1-v2, href: ./threshold-gate-v2.md }
  - { rel: layer-2-protocol, href: ./threshold-intake-protocol.md }
  - { rel: layer-3-wizard, href: ./meta-platform/threshold-gate.md }
  - { rel: implementation, href: ../../../libs/threshold/src/intake.ts }
  - { rel: types, href: ../../../libs/threshold/src/types.ts }
  - { rel: classifier, href: ../../../libs/threshold/src/classifier.ts }
  - { rel: router, href: ../../../libs/threshold/src/router.ts }
  - { rel: pipelines, href: ../../../libs/threshold/config/pipelines.yaml }
  - { rel: validator, href: ../../../tools/validators/validate-threshold-intake.mjs }
  - { rel: classification-rules, href: ../../../tools/config/threshold-classification-rules.yaml }
  - { rel: intake-log, href: ../../../.csps/threshold/intake-log.yaml }
scope_level: S1
context_question: "Is this document current with the active session's Threshold implementation state?"
---

# The Threshold — Complete Reference

> **The central claim:** Every input that enters CSPS — user prompts, external files, agent outputs, AI behavioral defaults, competitor intelligence — crosses The Threshold before any processing occurs. No exceptions. No bypasses. The Threshold is not a filter. It is a **transformer**: raw inputs become typed, classified, routed events. This is how governance happens at the INPUT STREAM level, not just at merge time.

---

## Part 1 — What The Threshold Is

The Threshold is not a single thing. It is a three-layer system, each layer operating at a different scope:

```
LAYER 1 — Platform Input Gate
  Every input to the CSPS platform (AI session, CLI, hooks, agent calls)
  is classified, normalized, routed, and logged before processing.
  Lives in: libs/threshold/ + hooks + threshold-gate.md

LAYER 2 — Intent-to-Verified-Impact (I→VI) Discipline  
  Every communication surface (42 total) applies a coaching-model
  discovery protocol to close the gap between expressed intent and
  verified deep intent. Lives in: threshold-intake-protocol.md + P-META-023

LAYER 3 — Onboarding Gate (User-Facing)
  Every new user crosses a Threshold Wizard before reaching a CSPS app's
  dashboard. The wizard captures archetype (intent, context, use case)
  and stores it in Clerk publicMetadata.
  Lives in: libs/components/src/onboarding/OnboardingWizard.tsx
```

All three share a common insight: **the first expression of any need — whether a user prompt, a user signup, or a developer reading docs — is almost never the complete or accurate expression of the deep need.** The Threshold is the system that closes that gap before it compounds.

---

## Part 2 — The Problem The Threshold Solves

### The Fundamental Pattern

Three failure modes appear identically across the platform:

1. **Governor ↔ AI (Layer 2):** Governor says "Build me X." AI builds X. The real need was Y. Rework compounds across sessions into structural drift.

2. **User ↔ App (Layer 3):** User signs up, lands on a blank dashboard, either abandons or builds in the wrong direction. The onboarding "welcome" designed around what the product does, not what the user needs.

3. **Input ↔ Platform (Layer 1):** A competitor update, an external research file, an agent's output — these enter the AI's processing without governance markers. The AI processes them with its training defaults, not CSPS governance.

In all three cases: **the gap between expressed intent and verified intent was never closed.** The platform treated the first expression as sufficient.

### Why Standard Approaches Fail

| Approach | What it does | Why it fails |
|---|---|---|
| Structured forms | Captures answers to predefined questions | Humans fill them to satisfy the process, not to surface truth |
| Chat-based clarification | AI asks follow-up questions | No structured coverage; AI satisfies itself after 1-2 rounds |
| UX onboarding wizards | Multi-step setup flows | Assume product features are what the user needs |
| CI/CD gates | Enforce quality at merge | Too late — drift happens at the INPUT stage, not merge |

**What all miss:** A systematic, coaching-style discovery process that treats the initial expression as always incomplete, and closes the intent-impact loop with measurable evidence — not assumed completion.

---

## Part 3 — Layer 1: The Platform Input Gate

### 3.1 — The Pipeline

Every input to CSPS runs through this 8-step pipeline:

```
ANY INPUT (chat prompt / file / agent output / AI default)
    ↓
PREAMBLE: CONCEPT_LOAD (P-META-020)
    Select the governing L2 spine domain for this input type.
    This conceptual frame governs all downstream steps.
    ↓
STEP 0: SEE WHAT EXISTS
    Run check_reuse for the concept being introduced.
    Match found → ENHANCE, not CREATE → route to SWIFT_EXECUTE.
    No match → continue.
    ↓
STEP 1: DETECT source_class
    Pattern detection (user-prompt-submit-intake.sh)
    → chat-channel | external-content | agent-output | inner-default-leak
    ↓
STEP 2: NORMALIZE to IntakeEvent
    Typed envelope: { source_class, classified_type, route_to, context, priority_band }
    ↓
STEP 3: CLASSIFY type + priority_band
    10-type closed enum. Spine tag inferred from type.
    Scope tag (S1/S2/S3) inferred from scope signals.
    ↓
STEP 4: ROUTE
    SWIFT_EXECUTE → process immediately (mechanical, reversible, 4-condition gate)
    COUNCIL_REVIEW → surface to Governor (ambiguous, architectural, multi-actor)
    VAULT_DEFER → vault with context + retrieve_when trigger
    DROP → log + discard with reason
    ↓
STEP 5: LOG
    Append to .csps/threshold/intake-log.yaml (append-only)
    ↓
STEP 6: RIPPLE CHECK
    Verify intent → plan → implementation → validation chain coherence.
    Any break = intent-impact gap surfaced to Governor.
    ↓
STEP 7: TRIGGER council member
    Governance-session / ZF-validation / consolidation-expert / etc.
    ↓
STEP 8: IMPACT
    Update IntakeEvent.state_machine_pos → 'executed' | 'deferred'
```

### 3.2 — The 4 Source Classes

Every input belongs to exactly one source class:

| Source Class | What it is | Example |
|---|---|---|
| `chat-channel` | User prompts in the AI chat (UserPromptSubmit) | "Build the voice-profile validator" |
| `external-content` | Uploaded files, URLs, EXT-ID items, research | Competitor release notes, external AI output |
| `agent-output` | Subagent results, tool outputs, validator findings | Agent() return value, `pnpm verify` FAIL output |
| `inner-default-leak` | AI training defaults surfacing despite CSPS governance | Over-agreeing, assuming task complete, adding unrequested features |

### 3.3 — The 13 Input Types (Full Taxonomy)

| # | Input type | source_class | Default route_to |
|---|---|---|---|
| 1 | User prompt (governance directive) | chat-channel | SWIFT_EXECUTE (if 4-condition gate passes) |
| 2 | User prompt (question) | chat-channel | COUNCIL_REVIEW |
| 3 | User prompt (ratification) | chat-channel | SWIFT_EXECUTE |
| 4 | External file / URL / paste | external-content | VAULT_DEFER (always) |
| 5 | Agent / subagent output | agent-output | SWIFT_EXECUTE (mechanical) |
| 6 | Inner-default leak | inner-default-leak | COUNCIL_REVIEW |
| 7 | Competitor platform update | external-content | VAULT_DEFER |
| 8 | Existing app extraction | external-content | VAULT_DEFER |
| 9 | Error log / validator finding | agent-output | SWIFT_EXECUTE or COUNCIL_REVIEW |
| 10 | PR comment / code review | external-content | VAULT_DEFER |
| 11 | Monitoring alert | agent-output | COUNCIL_REVIEW |
| 12 | External AI consultation | external-content | VAULT_DEFER |
| 13 | News / trend signal | external-content | VAULT_DEFER |

**The key insight:** Types 7–13 (competitor updates, market signals, external AI output) are inputs most platforms never treat as governed. CSPS routes them through the identical pipeline as a user prompt. A competitor release note and a Governor directive follow the same classification steps.

### 3.4 — The 10 Input Types (Code Implementation)

The TypeScript implementation uses a tighter 10-type closed enum, mapped to the pipeline taxonomy:

```typescript
type ThresholdInputType =
  | 'governor_directive'   // spine: GVRN / scope: S1 / urgency: high
  | 'architectural_insight'// spine: ARCH / scope: S3 / urgency: medium
  | 'error'               // spine: VALD / scope: S1 / urgency: high
  | 'solution'            // spine: VALD / scope: S1 / urgency: medium
  | 'external_research'   // spine: AI   / scope: S2 / urgency: low
  | 'session_harvest'     // spine: OPER / scope: S2 / urgency: low
  | 'correction'          // spine: AI   / scope: S2 / urgency: medium
  | 'core_seed'           // spine: GVRN / scope: S3 / urgency: medium
  | 'question'            // spine: GVRN / scope: S1 / urgency: low
  | 'quote'               // spine: GVRN / scope: S1 / urgency: low
```

Each type carries three inferred properties: **spine_tag** (which governance domain governs it), **scope_tag** (S1=instance / S2=process / S3=structural), **urgency** (high/medium/low).

### 3.5 — The 7 Routing Pipelines

After classification, each input is routed to one or more pipelines (data-driven, not code-driven — adding a pipeline means adding a YAML entry to `libs/threshold/config/pipelines.yaml`):

| Pipeline | What it handles | Processor |
|---|---|---|
| `PE_INTAKE` | New plan items, priority changes, governor directives | Priority Engine |
| `LEARNING_LOOP` | Session patterns, error+solution pairs, AI observations | Learning Loop Sub-Engine |
| `DOC_UPDATE` | Node changes affecting documentation | Documentation Engine |
| `AI_PROFILE` | AI behavioral corrections, trigger observations | AI Behavioral Profile Registry |
| `CONCEPTION_VAULT` | AI self-modeling, decision architecture insights | AI Conception Vault |
| `AUDIT_QUEUE` | Validation failures, compliance findings | Audit Hub |
| `CORE_SEED_REGISTRY` | Architectural promises reaching K≥2 consensus | Core Seeds Monitor |

**Escalation paths:**
- `error` with urgency=high → direct AUDIT_QUEUE (skips queue)
- `governor_directive` with high urgency → direct PE_INTAKE
- `correction` with scope_tag=S3 → dual routing: AI_PROFILE + CONCEPTION_VAULT

### 3.6 — Model Tier Routing

Every classified input also carries an implicit model tier requirement — determining which AI tab executes, not which tab the Governor is currently in:

```
DECISION_ARCHITECTURE → model_tier: OPUS
  (strategic decisions, multi-session consequences, new principle ratifications)

IMPLEMENTATION → model_tier: SONNET (workspace default)
  (validator builds, hook writes, plan item execution, HANDOFF authoring)

QUICK_CHECK → model_tier: SONNET or HAIKU
  (status checks, single-file reads, git status)

COUNCIL_REVIEW → model_tier: OPUS required
  (triggered by CAQ MODE: 2+ diagnostic types in one prompt, or AP-004 binary-collapse risk)
```

### 3.7 — Import Quarantine (External CSPS-DNA requirement)

Everything imported from outside CSPS crosses a special quarantine path through The Threshold:

```
External input (MCP / Agent / Skill / Package / insight)
    ↓ source_class: external-content → route_to: VAULT_DEFER (always)
    ↓ Analysis phase (outside CSPS processing):
       - Extract wisdom + patterns
       - Map to existing CSPS elements
       - Design CSPS-native equivalent
    ↓ CSPS DNA injection:
       - frontmatter (id + core_spine + schema_anchor)
       - principle compliance tags
       - consolidation cross-refs
       - impl_status: swift-implemented
    ↓ Re-enter Threshold (now source_class: internal)
    ↓ SWIFT_EXECUTE or COUNCIL_REVIEW
```

No imported element enters active use without this quarantine pipeline. This prevents external content from bypassing CSPS governance through the AI's training defaults.

---

## Part 4 — Layer 2: Intent-to-Verified-Impact (I→VI) Discipline

*Principle: P-META-023 (operationalizes P-META-022 Human Intent Crystallization)*  
*File: `docs/plan/pillar-0-governance/threshold-intake-protocol.md`*

### 4.1 — The Core Problem (AI + Human Combined)

Layer 2 addresses a compound problem: **two parties simultaneously expressing incomplete intent.**

**Human side:** The full picture exists as a feeling, not yet as structured thought. People compress complex needs into the shortest expression that might get help. They don't know what they don't know. Cultural patterns train people to give expected answers, not true ones.

**AI side:** An AI working from assumed or guessed context generates output that is technically correct but contextually wrong. When the AI acts on its assumption rather than verified understanding, it produces work that must be redone — compounding across sessions into structural drift.

These two phenomena — human Layer 1 expression and AI assumed context — are identified as the **primary root causes of drift** in CSPS. Everything else is downstream.

### 4.2 — The 26-Item Intake Checklist

The AI applies this checklist internally after receiving any freestyle input. Items already present are marked FILLED. Items inferable from context are marked INFERRED. Missing items become the basis for the next questions (2-3 per round maximum, never more).

**Priority for first questions:** I1 (outcome) > M1 (done signal) > B5 (current state) > R5 (blast radius) > all others.

**CATEGORY B — Background**

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| B1 | Requester role | Always | No | ✓ |
| B2 | Prior attempts and what happened | If missing | Yes | — |
| B3 | What triggered this now | If missing | Yes | — |
| B4 | Domain classification | Always | No | ✓ |
| B5 | Current state before any change | Always | **Yes** | — |

**CATEGORY C — Context**

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| C1 | Specific system/feature/flow | Always | Yes | — |
| C2 | Constraints | If missing | Yes | — |
| C3 | Assumptions to verify | If missing | Yes | — |
| C4 | Other stakeholders affected | If missing | Partial | Partial |
| C5 | Current workaround | Optional | Yes | — |

**CATEGORY I — Intent** *(deepest layer — handle with most care)*

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| I1 | **Outcome, not feature** | Always | **YES — NEVER AI-authored** | — |
| I2 | True need test | If missing | Yes | — |
| I3 | Pain vs prevention | If missing | Yes | Partial |
| I4 | Minimum satisfying version | If missing | Yes | — |
| I5 | Personal driver | Optional | Yes | — |
| I6 | Disqualifier | If missing | Yes | — |

**CATEGORY R — Ripple Effects**

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| R1 | Adjacent systems touched | Always | — | **✓ AI researches platform** |
| R2 | Who else is affected | If missing | Partial | Partial |
| R3 | What could break | If missing | Partial | **✓ AI scans dependencies** |
| R4 | What this decision unblocks | If missing | Yes | — |
| R5 | Blast radius class (local/module/platform/external) | Always | — | **✓ AI classifies** |

**CATEGORY M — Measurable Results**

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| M1 | **Done signal** — exact moment we'd say "yes, this worked" | Always | **YES — NEVER AI-authored** | — |
| M2 | Observer — who checks, when, how | If missing | Yes | — |
| M3 | **Failure signal** — what would indicate failure | Always | **YES — NEVER AI-authored** | — |
| M4 | Time-sensitivity | If missing | Yes | — |
| M5 | Minimum measurable threshold | If missing | Yes | — |
| M6 | Proof method | Always | — | **✓ AI suggests** |

**Three items that must ALWAYS come from the human (I1, M1, M3):** If the AI generates the goal and the human says "yes," that is not crystallization — it is compliance. True crystallization happens when the human's own words describe their own goal.

### 4.3 — The 5-Item Agreement

After the checklist is sufficiently filled, synthesis produces 5 agreed statements. This becomes the ratification record:

```yaml
intake_agreement:
  background:  "[B1-B5 synthesized — who, what happened, current state]"
  problem:     "[C1-C5 + I2-I3 synthesized — environment and true need]"
  directions:  "[Optional paths toward solution — not decisions yet]"
  goal:        "[I1 — human's exact words, never paraphrased]"
  done:        "[M1 + M3 + M4 — human's exact words]"
```

The AI asks: "Is this an accurate record?" Human confirms or corrects. **Only after confirmation does plan creation begin.**

### 4.4 — Three Intake Levels (Routing by Complexity)

Not every situation needs the full 26-item process:

| Level | Signals | Process | Examples |
|---|---|---|---|
| **Light** (Human + AI) | Known domain, continuation of established work, Governor provides I1/M1/M3 explicitly | Check I1, M1, B5. If present → proceed | Bug fix in known scope, adding a field, writing a plan section |
| **Medium** (Human + AI + research) | New domain, unfamiliar integration, assumption to validate | Full 26-item checklist + targeted research (2-4 sources) | First new API integration, new app domain, GDPR question |
| **Deep** (Human + AI + Core Council) | Architectural decision, new platform primitive, constitutional change | Full checklist + research + council deliberation | New Core Spine, new P-META-* principle, foundation schema change |

### 4.5 — The Coaching Philosophy (8 Principles)

The Threshold intake is modeled on motivational interviewing and Socratic dialogue. Eight principles govern every intake interaction:

| # | Principle | What it means |
|---|---|---|
| P1 | Curiosity over evaluation | Every question is driven by genuine curiosity, not data collection |
| P2 | The mirror, not the authority | "I understood this as X — is that accurate?" Never "So what you want is X" |
| P3 | "I don't know" is the most valuable answer | Uncertainty marks exactly where real discovery work is needed |
| P4 | No rush, no agenda | The AI has no efficiency target on discovery |
| P5 | No praise, no judgment | No "great question." No "that's not quite right." Acknowledge, reflect, continue |
| P6 | The goal belongs to the human | If AI proposes a goal and human says "yes," that is compliance, not crystallization |
| P7 | Layered discovery, not linear interrogation | Start wide. Narrow based on response. Never jump to solution |
| P8 | Safety and voluntary participation | Human can decline any question. Gap noted explicitly, not punished |

### 4.6 — The 42 Communication Surfaces

The I→VI discipline governs every communication surface in CSPS — not just AI-Governor intake. 42 surfaces mapped across 9 categories:

| Category | Surfaces covered | Current status |
|---|---|---|
| AI ↔ Governor | Directive reception, ratification scope, correction scope, handoff, closing summary | 1 fully addressed, 4 partial/gap |
| AI ↔ AI | Opus→Sonnet execution, subagent spawns, cross-AI consultation, session compression | 1 fully addressed, 4 partial |
| AI → Platform Artifacts | Plan writing, schema design, validator authoring, contract writing | All partial or gap |
| Plan ↔ Implementation | Topic plan goals, phase exits, VLT resolution, plan-to-impl tracing | All partial or gap |
| Developer ↔ Platform | Reading routing.config, reading libs/ contracts, pnpm verify output, API errors | All partial or gap |
| Platform → Outbound | pnpm verify advisory messages, hook system messages | All partial |
| End User ↔ App | Onboarding, form input, dashboard read, notifications, billing | 1 partially addressed (Wizard planned) |
| Platform ↔ External Integrations | Stripe webhooks, Clerk auth events, external APIs | All partial |
| Governance Artifacts ↔ Future Readers | AGENTS.md hard NOs, principles.yaml, memory entries, behavioral contracts | All partial |

**Overall coverage:** 5 fully addressed / 22 partial / 15 gap (out of 42 total surfaces)

---

## Part 5 — Layer 3: The Onboarding Gate (User-Facing)

*File: `docs/plan/pillar-0-governance/meta-platform/threshold-gate.md`*

### 5.1 — What It Does

The Threshold Gate is the user's first meaningful interaction with any CSPS app. Before reaching the dashboard, the user crosses a wizard that captures their **archetype** — their intent, context, and use case. This enables a personalized first-run experience and prevents the blank-screen abandonment pattern.

### 5.2 — The Flow

```
User arrives at /account-setup
    │
    ▼
Is tenantId in Clerk JWT?  ──NO──→  Poll /api/auth/status (max 30s)
    │
   YES
    │
    ▼
Is auth().publicMetadata?.archetype set?  ──YES──→  Redirect to /dashboard
    │
   NO
    │
    ▼
Render <OnboardingWizard onComplete={handleArchetype} appName="[App Name]" />
    │
    ▼
User completes wizard (< 60 seconds, 3-5 questions)
    │
    ▼
handleArchetype() → Clerk updateUserMetadata({ public_metadata: { archetype } })
    │
    ▼
Clerk confirms → Redirect to /dashboard
```

### 5.3 — Error Handling

| Scenario | Behavior |
|---|---|
| Browser closed mid-wizard | Progress NOT stored. User restarts from Q1 on next visit |
| Clerk updateUserMetadata fails | Show error + retry. Do NOT redirect until confirmed |
| tenantId never arrives (>30s) | Show support message + manual refresh link |

---

## Part 6 — Technical Implementation

### 6.1 — Library: `libs/threshold/`

The TypeScript implementation lives in `libs/threshold/src/`:

| File | Responsibility |
|---|---|
| `types.ts` | All type definitions: `ThresholdInput`, `ThresholdInputType`, `SpineTag`, `ScopeTag`, `RoutingResult`, `PipelineName`, etc. |
| `classifier.ts` | `classify(opts)` — takes raw input metadata, infers spine/scope/urgency, returns `ThresholdInput` |
| `router.ts` | `route(input)` — matches against pipeline rules, returns `RoutingResult` with pipeline list + escalation |
| `intake.ts` | `processGovernorInput(raw, session)` — classify + route + append to `.csps/threshold/intake-log.yaml` |

**Key design principle:** Routing rules are DATA (YAML), not code. Adding a new pipeline = adding a YAML entry to `libs/threshold/config/pipelines.yaml`. No deployment required.

### 6.2 — The Classification Rules File

`tools/config/threshold-classification-rules.yaml` — pattern-based best-effort classification for the non-code intake path (hooks, session tooling). First match wins. Default = `governor_directive`.

```yaml
type_rules:
  - pattern: "exit_code=1|BLOCKING|FAIL"   → type: error    / spine: VALD / urgency: high
  - pattern: "correction|wrong|should be"   → type: correction / spine: AI  / urgency: medium
  - pattern: "K=[23]|every session|recurring" → type: core_seed / spine: ARCH
  - pattern: "\\?"                           → type: question   / spine: GVRN
  - default:                                → type: governor_directive / spine: GVRN
```

### 6.3 — The Intake Log

Two intake logs exist:

| Log | Location | Written by | Purpose |
|---|---|---|---|
| `.csps/threshold/intake-log.yaml` | App root | `libs/threshold/intake.ts` | Session-level TypeScript-driven intake (structured, validated) |
| `tools/data/threshold-intake-log.yaml` | Tools | `user-prompt-submit-intake.sh` hook | Hook-driven intake (pattern-based, YAML append) |

Both are **append-only** — records are never modified after writing.

### 6.4 — The L1 Summary Aggregation

`.csps/threshold/L1-summaries/` holds per-spine summary files (`GVRN-summary.yaml`, `ARCH-summary.yaml`, etc.). These are aggregated from the intake-log by `tools/scripts/aggregate-l1-summaries.mjs` (planned PROTO-THRESHOLD-2). Format: `session → classify → vault → L1-aggregate → Opus review`.

### 6.5 — The Validator

`tools/validators/validate-threshold-intake.mjs` (T2 advisory) reports on the intake log:
- Total entries, type distribution, session counts
- Exit 0 always (advisory only)
- Registered in `pnpm verify` as `threshold_intake` validator

---

## Part 7 — Governing Principles

The Threshold is built on — and enforces — the following platform principles:

| Principle | What it says | How The Threshold enforces it |
|---|---|---|
| **P-META-020 Concept-First Governance** | Context as compass; validators as reference samples | CONCEPT_LOAD fires as Threshold PREAMBLE before every step |
| **P-META-022 Human Intent Crystallization** | Human intent must be crystallized before action | Layer 2 I→VI discipline — the WHY behind the 26-item checklist |
| **P-META-023 Intent-to-Verified-Impact (I→VI)** | The HOW — coaching model, 26-item checklist, 42 surfaces | Layer 2 protocol; all 42 surfaces governed |
| **P-META-017 CSPS-Alignment-Over-Inner-AI-Defaults** | AI training defaults must yield to CSPS governance | Import quarantine + inner-default-leak source class |
| **P-ARCH-028 Core Spine Discipline** | Every input classified by governing spine domain | `spine_tag` inferred at classify time |
| **AP-001 EXISTS ≠ ACTIVE** | Writing a rule ≠ enforcing it | Threshold hooks + validator enforce actively, not just specify |
| **B_INTAKE_GATE** | All inputs must cross Threshold, be classified, logged | Behavioral contract enforced by hooks + validator |

---

## Part 8 — What Makes The Threshold a Platform Moat

Most platforms govern their **output** (code quality, API contracts, merge gates). CSPS governs its **input stream**.

The distinction:

| Standard platform | CSPS Threshold |
|---|---|
| Process for content — what does this input SAY? | Process for governance — what TYPE is this input? |
| Acts on the first expression | Treats the first expression as always incomplete |
| External imports processed by AI training defaults | External imports quarantined until CSPS DNA injected |
| Intent-impact gap invisible until rework accumulates | Intent-impact gap surfaced + closed BEFORE action |
| Competitor signals processed as chat | Competitor signals classified → VAULT_DEFER → structured analysis |
| AI behavioral defaults drift silently | Inner-default-leak source class surfaces + routes to AI_PROFILE |

This is why Threshold is classified as a moat element — no other platform governs its construction process from the first moment of input.

---

## Part 9 — Related and Connected Elements

### 9.1 — Directly Connected (Threshold is the hub)

| Element | Connection |
|---|---|
| `libs/threshold/src/intake.ts` | TypeScript implementation of classify + route + log |
| `tools/config/threshold-classification-rules.yaml` | Pattern rules for hook-driven classification |
| `libs/threshold/config/pipelines.yaml` | Pipeline routing rules (data, not code) |
| `.csps/threshold/intake-log.yaml` | Append-only record of all classified inputs |
| `tools/data/threshold-intake-log.yaml` | Hook-driven intake log |
| `tools/validators/validate-threshold-intake.mjs` | T2 advisory validator |
| `libs/components/src/onboarding/OnboardingWizard.tsx` | Layer 3 user-facing gate |
| `tools/validators/validate-intent-crystallized.mjs` | Checks I1/M1/M3 in plan frontmatter |
| `libs/config/routing.config.ts` | WizardTemplate interface (intake_level, participants, checklist_ref) |

### 9.2 — Governed By Threshold (downstream consumers)

| Consumer | What Threshold provides |
|---|---|
| Priority Engine | Classified intake events → PE_INTAKE pipeline |
| Learning Loop | Error/solution/session-harvest → LEARNING_LOOP pipeline |
| Audit Hub | Error findings → AUDIT_QUEUE pipeline |
| Core Seeds Monitor | K≥2 architectural insights → CORE_SEED_REGISTRY pipeline |
| AI Behavioral Profile Registry | Correction + insight events → AI_PROFILE pipeline |
| Vault | External content + strategic insights → VAULT_DEFER route |
| Council dispatch | COUNCIL_REVIEW route → right skill loaded for right task |

### 9.3 — Hooks That Implement The Threshold

| Hook | Role |
|---|---|
| `user-prompt-submit-intake.sh` | Detects upload/paste/EXT-ID patterns (STEP 1 pattern detection) |
| `user-prompt-submit-governor-prompts.sh` | Logs Governor prompt entries |
| `user-prompt-submit-context-orchestrator.sh` | Task-class detection for context loading (STEP 3) |

### 9.4 — Session Artifacts

| Artifact | Role |
|---|---|
| `.csps/threshold/L1-summaries/GVRN-summary.yaml` | Aggregated GVRN spine intake summary |
| `.csps/threshold/L1-summaries/ARCH-summary.yaml` | Aggregated ARCH spine intake summary |
| `.csps/threshold/L1-summaries/AI-summary.yaml` | Aggregated AI spine intake summary |
| `.csps/threshold/L1-summaries/OPER-summary.yaml` | Aggregated OPER spine intake summary |
| `.csps/threshold/L1-summaries/VALD-summary.yaml` | Aggregated VALD spine intake summary |

---

## Part 10 — Current State + Forward Path

### What's Active

| Component | Status |
|---|---|
| `libs/threshold/` TypeScript library | Production — classify + route + log wired |
| Pattern-based hook classification | Active — `user-prompt-submit-intake.sh` |
| Layer 3 OnboardingWizard gate | Wired (PROTO-001 audit confirmed) |
| I→VI discipline (Layer 2) | Ratified S024 — partial surface coverage (5 of 42 fully addressed) |
| `validate-threshold-intake.mjs` T2 validator | Active in pnpm verify |

### What's Planned

| Item | Target |
|---|---|
| PROTO-THRESHOLD-2: aggregate-l1-summaries.mjs | Automated L1 summary aggregation from intake-log |
| Remaining 37 surface coverage gaps (Layer 2) | Ongoing — highest priority surfaces are AI↔Governor and Plan↔Implementation |
| Developer dashboard `threshold-activity` section | Week-10 admin app on Vercel |
| Full pipeline wiring (all 7 pipelines active) | In progress — PE_INTAKE + AUDIT_QUEUE + LEARNING_LOOP prioritized |

---

## Part 11 — Quick Reference

### Three Questions to Navigate The Threshold

1. **What kind of input is this?**  
   → Check source_class (chat-channel / external-content / agent-output / inner-default-leak)  
   → Check classified_type (governor_directive / error / correction / etc.)

2. **What should happen with this input?**  
   → Check route_to (SWIFT_EXECUTE / VAULT_DEFER / COUNCIL_REVIEW / DROP)  
   → Check model_tier requirement (Opus / Sonnet / either)

3. **Has intent been crystallized?**  
   → Check I1 (outcome), M1 (done signal), M3 (failure signal) — all three must be human-authored  
   → If any missing → intake process required before action

### The One-Sentence Summary

> The Threshold ensures that **no input — user directive, external file, agent output, or AI behavioral default — enters CSPS without first being classified by type, assigned to a governing spine domain, routed to the right pipeline, and logged for traceability**; and that **no action begins until the human's expressed intent has been crystallized into a verified deep intent with measurable success and failure criteria, authored in the human's own words.**

---

*Authored: S062 | Sonnet-10 | Source: threshold-gate.md + threshold-gate-v2.md + threshold-intake-protocol.md + meta-platform/threshold-gate.md + libs/threshold/* + tools/config/threshold-classification-rules.yaml*
