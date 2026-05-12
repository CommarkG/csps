---
id: csps.governance.threshold-intake-protocol
name: threshold-intake-protocol
description: >
  The canonical SSoT for the CSPS Intent-to-Verified-Impact (I→VI) discipline.
  Defines the coaching-style intake protocol, the 26-item checklist, the 42 communication
  surfaces it governs, the coaching philosophy, and the platform integration architecture.
  ALL other platform elements reference this file — they never copy its content.
  Change this file → all referencing elements benefit automatically.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, GVRN]
schema_anchor: P-META-023
parent_principle: P-META-022
domain_path: platform
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
diataxis_type: explanation
links:
  - { rel: principle, href: ../../../packages/principles/principles.yaml#P-META-023 }
  - { rel: contract, href: ./behavioral-contracts.md#B_THRESHOLD_INTAKE_PROTOCOL }
  - { rel: step-0a, href: ./plan-creation-protocol.md#step-0a }
  - { rel: wizard-templates, href: ../../../libs/config/routing.config.ts }
  - { rel: validator, href: ../../../tools/validators/validate-intent-crystallized.mjs }
  - { rel: human-intent, href: ./human-intent-crystallization.md }
session: S024
impl_status: swift-implemented
ratified_by: Governor
ratified_date: 2026-05-12
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
---

# Threshold Intake Protocol — Intent-to-Verified-Impact (I→VI) Discipline

> **Hierarchy:** This protocol operationalizes **P-META-022 Human Intent Crystallization** (the WHY).
> See: [human-intent-crystallization.md](./human-intent-crystallization.md) for the philosophical anchor.
> This file is the HOW. P-META-023 is a child of P-META-022, not its parent.

> **This is the SSoT.** All platform elements that implement or reference this discipline
> point here. When this protocol is updated, all referencing elements inherit the update
> without requiring individual changes. Do not copy content from this file — reference it.

---

## §1 — Background

The Core Sights Platform (CSPS) is built to create a family of SaaS applications and
developer tools. At every layer — AI working with the Governor, developers using the
platform, end users using apps — the same fundamental problem appears: **the first
expression of a need is almost never the complete or accurate expression of the deep need.**

This is not a failure of communication. It is the default condition of human expression.
People are not unclear because they are unintelligent. They are unclear because:
1. The full picture exists in their heads as a feeling, not yet as a structured thought
2. They compress complex needs into the shortest expression that might get help
3. They don't know what they don't know, so they cannot express what they haven't named
4. Cultural and social patterns train people to give expected answers, not true ones

The same phenomenon occurs with AI. An AI working from assumed, guessed, or
session-compressed context generates output that is technically correct but contextually
wrong. When the AI acts on its assumption rather than on verified understanding, it
produces work that must be redone — compounding across sessions into structural drift.

**These two phenomena — human Layer 1 expression and AI assumed context — are the primary
root causes of drift in the platform. Everything else is downstream of them.**

---

## §2 — The Problem

Standard AI-assisted development treats the first human expression as the specification.
The AI receives: "Build me a budget tracker." It builds a budget tracker. The human
discovers that what they actually needed was something more specific, more nuanced,
or entirely different. The rework cost is invisible until it accumulates.

Standard onboarding flows treat user registration as the start of use. The user signs
up, encounters a blank screen, and either abandons or builds the wrong thing. The
"first-run experience" is typically designed around what the product does, not around
what the user actually needs.

Standard developer tools assume the developer knows what they're building. Documentation
describes the API. The developer reads it, interprets it through their existing mental
model, and implements something that works but doesn't follow the platform's intent.
The deviation accumulates as technical debt.

**In all three cases, the gap between expressed intent and verified deep intent was never
closed. The platform treated the first expression as sufficient.**

---

## §3 — The Challenge

Closing the intent gap is harder than it sounds because of three tensions:

**Tension 1 — Speed vs depth.** Slowing every interaction for a full discovery process
frustrates users and developers. But acting too quickly on incomplete information creates
rework that costs more than the discovery would have. The platform must find the minimum
viable discovery that prevents the maximum drift.

**Tension 2 — Assistance vs imposition.** If the AI asks too many questions, it feels
like a form. If it asks too few, it misses critical gaps. The discovery process must feel
like a conversation, not an interrogation. It must invite, not demand.

**Tension 3 — Standardization vs sensitivity.** A fixed checklist applied uniformly
ignores context. Some situations need deep discovery; others are continuations of
well-understood work. The protocol must route intelligently — not every interaction
needs all 26 checklist items.

---

## §4 — What Is Usually Done (Industry Baseline)

Industry approaches to this problem fall into three categories, all of which are insufficient:

**Category 1 — Structured forms.** User research questionnaires, requirements templates,
PRD formats. These capture answers to predefined questions but fail because: (a) humans
fill them in to satisfy the process, not to surface truth, (b) they cannot ask follow-up
questions, and (c) they treat the form as the output rather than the understanding.

**Category 2 — Chat-based AI assistants.** Current AI tools ask clarifying questions
but without a systematic backbone — the questions are generated in the moment, often
missing critical dimensions. There is no structured coverage of Background, Context,
Intent, Ripple Effects, and Measurable Results. The AI satisfies itself that it understands
after 1-2 rounds, even when critical gaps remain.

**Category 3 — UX onboarding wizards.** Multi-step flows guide users through setup.
They collect preferences and configuration. But they do not discover what the user
actually needs to accomplish — they assume the product's features are what the user needs.

**What all three miss:** A systematic, coach-style discovery process that treats the
initial expression as always incomplete and uses a structured checklist to ensure all
critical dimensions are surfaced before any action is taken.

---

## §5 — What Is Unique About the CSPS Approach

CSPS implements the I→VI (Intent-to-Verified-Impact) discipline — a platform-wide
methodology that governs every communication surface, not just onboarding.

**What makes it different:**

1. **Platform-wide, not feature-specific.** The same checklist governs all 42
   communication surfaces — from AI-Governor directive intake to end-user app onboarding
   to developer API usage. The discipline is a platform property, not a feature.

2. **Freestyle input first, structure second.** The human (or AI) always expresses freely.
   The checklist is an AI-internal tool for gap detection, not a form presented to the human.

3. **Coach model, not examiner model.** The AI's questions are a service to the human's
   clarity, not data collection for the AI's purposes. See §6 for the full coaching philosophy.

4. **Three items that must always come from the human.** The Outcome (I1), the Done Signal
   (M1), and the Failure Signal (M3) are never AI-inferred or AI-proposed-and-approved.
   They must come in the human's own words. This prevents the satisfaction-point anti-pattern
   where the AI generates the goal and the human says "yes" without deeply confirming it.

5. **Three levels of depth.** Not every situation needs the full 26-item process. The
   protocol routes to Light (known domain, continuation), Medium (new territory, research
   needed), or Deep (architectural, council deliberation needed) based on signals from the
   freestyle input.

6. **Single source of truth.** All platform elements — from routing.config.ts WizardTemplates
   to plan-creation-protocol.md Step 0a to behavioral-contracts.md B_THRESHOLD_INTAKE_PROTOCOL
   to validators — reference this file. Changes here propagate everywhere without requiring
   individual updates across the platform.

7. **The intent-impact loop is closed.** The protocol does not end at crystallized intent.
   It ends at verified impact — confirming that what was produced actually matched what was
   intended, through measurable evidence, not through "it looks right."

---

## §6 — The Coaching Philosophy (The Non-Test Principle)

**This is not a test. The questions asked during intake are not evaluations of the human's
knowledge or competence. The AI is a coach, not an examiner.**

The Threshold intake process is modeled on the best of human coaching methodology:
motivational interviewing, appreciative inquiry, and Socratic dialogue. The governing
principles:

### P1 — Curiosity over evaluation
Every question the AI asks is driven by genuine curiosity about the human's reality,
not by the need to fill a data field. The AI is fascinated by the human's situation,
not processing it.

### P2 — The mirror, not the authority
The AI reflects back what it understood. It never tells the human what they meant.
"I understood this as X — is that accurate?" is the pattern. Never "So what you want is X."
The correction from the human IS the crystallization — not their approval of AI-drafted text.

### P3 — "I don't know" is the most valuable answer
When a human says "I don't know" or "I'm not sure," that is not a failure. It is
the signal that marks exactly where the real discovery work is needed. The AI treats
this with care, not impatience: "That's worth exploring. What does the uncertainty
feel like — is it about what you want, or about what's possible?"

### P4 — No rush, no agenda
The AI does not have an efficiency target on discovery. It does not ask the next question
before the human has genuinely been heard on the current one. Speed in the intake
phase creates slowness everywhere else.

### P5 — No praise, no judgment
"Great question" and "that's a good answer" are condescending. So is "that's not
quite what I meant." The AI acknowledges, reflects, and continues — without evaluating
the quality of the human's contribution.

### P6 — The goal belongs to the human
The human's goal is not the AI's job to define. If the AI proposes a goal and the
human says "yes," that is not crystallization — it is compliance. True crystallization
happens when the human's own words describe their own goal. The AI's role is to create
the conditions for that articulation to happen.

### P7 — Layered discovery, not linear interrogation
Start with the widest possible question. Narrow based on response. Never jump to solution.
Each question removes ambiguity from a large space — not just yes/no from a narrow one.

### P8 — Safety and voluntary participation
The human can decline to answer any question. The AI notes the gap explicitly and moves
on. "Noted — I'll work with what we have and flag where that gap might matter."

---

## §7 — The 26-Item Intake Checklist

The AI uses this checklist internally after receiving freestyle input. Items already
present in the freestyle input are marked FILLED. Items inferable from context are
marked INFERRED. Items missing and required are the basis for the next questions.
The AI asks about 2-3 most critical missing items per round, never more.

**Priority for first questions:** I1 (outcome) > M1 (done signal) > B5 (current state) >
R5 (blast radius) > all others.

### CATEGORY B — Background

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| B1 | Requester role (Governor / developer / end-user / external) | Always | No | Yes |
| B2 | Prior attempts and what happened | If missing | Yes | No |
| B3 | What triggered this now vs earlier | If missing | Yes | No |
| B4 | Domain (governance / technical / UX / business / personal) | Always | No | Yes |
| B5 | Current state before any change | Always | Yes | No |

### CATEGORY C — Context

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| C1 | Specific system, feature, or flow involved | Always | Yes | No |
| C2 | Constraints (time, technical, compliance, resources) | If missing | Yes | No |
| C3 | Assumptions to verify | If missing | Yes | No |
| C4 | Other stakeholders affected | If missing | Yes / partial | Partial |
| C5 | Current workaround | Optional | Yes | No |

### CATEGORY I — Intent (deepest layer — handle with most care)

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| I1 | **Outcome, not feature** — what result if it works perfectly | Always | **Yes — NEVER AI-authored** | No |
| I2 | True need test — what would you do if this weren't possible? | If missing | Yes | No |
| I3 | Pain vs prevention — solving now vs preventing future | If missing | Yes | Partial |
| I4 | Minimum satisfying version | If missing | Yes | No |
| I5 | Personal driver — why does this matter to you specifically | Optional | Yes | No |
| I6 | Disqualifier — what would make this not worth doing | If missing | Yes | No |

### CATEGORY R — Ripple Effects

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| R1 | Adjacent systems, features, data touched | Always | No | **Yes — AI researches platform** |
| R2 | Who else is affected (users, devs, external) | If missing | Partial | Partial |
| R3 | What could break | If missing | Partial | **Yes — AI scans dependencies** |
| R4 | What this decision unblocks | If missing | Yes | No |
| R5 | Blast radius class (local / module / platform / external) | Always | No | **Yes — AI classifies** |

### CATEGORY M — Measurable Results

| ID | Item | Required | Must be human | AI can infer |
|---|---|---|---|---|
| M1 | **Done signal** — the exact moment we'd say "yes, this worked" | Always | **Yes — NEVER AI-authored** | No |
| M2 | Observer — who checks the result, when, how | If missing | Yes | No |
| M3 | **Failure signal** — what would indicate failure even if built | Always | **Yes — NEVER AI-authored** | No |
| M4 | Time-sensitivity — by when to matter | If missing | Yes | No |
| M5 | Minimum measurable threshold — bar below which it fails | If missing | Yes | No |
| M6 | Proof method — how will we verify (pnpm verify / test / metric) | Always | No | **Yes — AI suggests** |

---

## §8 — The 5-Item Agreement

After the checklist is sufficiently filled, the AI synthesizes the 26 items into
5 agreed statements. These become the ratification record:

```yaml
intake_agreement:
  background:  "[B1-B5 synthesized — who, what happened, current state]"
  problem:     "[C1-C5 + I2-I3 synthesized — environment and true need]"
  directions:  "[Optional paths toward solution — not decisions yet]"
  goal:        "[I1 — human's exact words, never paraphrased]"
  done:        "[M1 + M3 + M4 — human's exact words]"
```

The AI asks: "Is this an accurate record?" Human confirms or corrects.
Only after confirmation does plan creation begin.

---

## §9 — Three Intake Levels

Not every situation requires the full 26-item process. The AI routes to:

**Level 1 — Light** (Human + AI, no research, no council)
- Signals: known domain, continuation of established work, bug fix in known scope, Governor provides all three elements (I1/M1/M3) explicitly upfront
- Process: abbreviated — check I1, M1, B5. If present → proceed.
- Examples: adding a field to an existing schema, fixing a known bug, writing a plan section

**Level 2 — Medium** (Human + AI + targeted online research, 2-4 sources)
- Signals: new domain territory, unfamiliar integration, assumption to validate, Governor signals uncertainty
- Process: full 26-item checklist + targeted research on specific questions
- Examples: first integration with a new API, new app domain (first Budget Planner), GDPR compliance question

**Level 3 — Deep** (Human + AI + Core Council + external advisors)
- Signals: architectural decision affecting multiple apps, new platform primitive, constitutional change, foundation boundary modification, direct conflict between ratified principles
- Process: full checklist + research + council deliberation
- Examples: new Core Spine, new P-META-* principle, foundation schema change

---

## §10 — The 42 Communication Surfaces (Full Map)

Every surface below is governed by the I→VI discipline. Status: ✅ = mechanism exists,
⚠️ = partial, ❌ = gap. Priority: H=High, M=Medium, L=Low.

### Category 1 — AI ↔ Governor
| # | Surface | Status | Priority |
|---|---|---|---|
| 1 | Initial Governor directive reception | ⚠️ Step 0a partial | H |
| 2 | Governor ratification scope | ❌ | H |
| 3 | Governor correction scope | ❌ | H |
| 4 | Closing summary → future AI | ⚠️ §10.0r partial | M |
| 5 | HANDOFF → new chat AI | ✅ INTENT ABSORBED | ✅ |

### Category 2 — AI ↔ AI
| # | Surface | Status | Priority |
|---|---|---|---|
| 6 | Opus → Sonnet execution | ✅ validate-sonnet-report.mjs | ✅ |
| 7 | Main AI → subagent Agent() | ⚠️ advisory hook | M |
| 8 | AI → external AI advisor input | ⚠️ VAULT_DEFER | M |
| 9 | AI → internal persona consultation | ❌ (future) | L |
| 10 | Session N → Session N+1 (compression) | ⚠️ HPFA partial | H |

### Category 3 — AI → Platform Artifacts
| # | Surface | Status | Priority |
|---|---|---|---|
| 11 | AI writes plan from understood intent | ⚠️ validate-intent-crystallized.mjs | H |
| 12 | AI designs schema from plan | ❌ | H |
| 13 | AI writes validator from assumed constraint | ❌ | M |
| 14 | AI writes behavioral contract | ⚠️ verbatim-cite partial | M |
| 15 | AI writes code comments | ⚠️ no-comment-unless-WHY | L |

### Category 4 — Plan ↔ Implementation
| # | Surface | Status | Priority |
|---|---|---|---|
| 16 | Topic plan goal → implementation output | ⚠️ §10.0r INTENT DRIFT CHECK | H |
| 17 | Phase exit criteria → next phase scope | ⚠️ ASSUMPTION CHECK partial | M |
| 18 | VLT raised → VLT resolved | ❌ | M |
| 19 | Ratified plan → actual implementation | ⚠️ validate-topic-plan-progress.mjs | M |

### Category 5 — Developer ↔ Platform
| # | Surface | Status | Priority |
|---|---|---|---|
| 20 | Developer reads routing.config.ts | ❌ | H |
| 21 | Developer reads libs/ contracts | ❌ | H |
| 22 | Developer reads pnpm verify output | ⚠️ some have Fix: lines | M |
| 23 | Developer reads API error messages | ⚠️ CspsError partial | M |
| 24 | Developer creates entity without Threshold | ⚠️ libs/ gate blocking (S024) | H |
| 25 | Developer reads documentation | ❌ | M |

### Category 6 — Platform → Outbound Communication
| # | Surface | Status | Priority |
|---|---|---|---|
| 26 | pnpm verify advisory → developer action | ⚠️ variable actionability | M |
| 27 | Hook system message → AI behavior | ⚠️ variable quality | M |
| 28 | AuditEvent → future debugger | ⚠️ action names variable | L |

### Category 7 — End User ↔ App
| # | Surface | Status | Priority |
|---|---|---|---|
| 29 | User signs up → onboarding | ⚠️ Threshold Wizard planned | H |
| 30 | User inputs data (form/entry) | ❌ | H |
| 31 | User reads dashboard/results | ❌ | M |
| 32 | User receives notification | ❌ | M |
| 33 | User reads validation error | ⚠️ CspsError partial | M |
| 34 | User reads billing state | ❌ | M |

### Category 8 — Platform ↔ External Integrations
| # | Surface | Status | Priority |
|---|---|---|---|
| 35 | Stripe webhook → subscription state | ⚠️ idempotency exists | H |
| 36 | Clerk auth event → tenant context | ⚠️ mapClerkJwtRole() partial | H |
| 37 | External API response → business logic | ❌ | M |
| 38 | Platform → external API call | ❌ (Phase 2 B_BAP) | M |

### Category 9 — Governance Artifacts ↔ Future Readers
| # | Surface | Status | Priority |
|---|---|---|---|
| 39 | AGENTS.md hard NOs → AI behavior | ⚠️ WHY present in some | M |
| 40 | principles.yaml → AI application | ⚠️ samples in P-META-021 | M |
| 41 | Memory entries → future AI behavior | ⚠️ staleness warnings partial | M |
| 42 | Behavioral contract text → AI behavior | ⚠️ self_assessment_question partial | M |

**Surface count:** 42 total | ✅ 5 fully addressed | ⚠️ 22 partial | ❌ 15 gap

---

## §11 — Platform Integration Architecture (The SSoT Model)

This file is the hub. All platform elements are spokes. Changes made here propagate
automatically because spokes reference this file rather than copying content.

```
                    threshold-intake-protocol.md (THIS FILE — Hub)
                              │
          ┌───────────────────┼───────────────────────┐
          ↓                   ↓                       ↓
  packages/principles/  behavioral-contracts.md  plan-creation-protocol.md
  principles.yaml        B_THRESHOLD_INTAKE_      Step 0a (full 9-step flow)
  P-META-023             PROTOCOL body            references §7 checklist
          │                   │                       │
          ↓                   ↓                       ↓
  libs/config/          tools/validators/        tools/validators/
  routing.config.ts     validate-threshold-      validate-intent-
  WizardTemplate        intake.mjs               crystallized.mjs
  (intake_level,        checks 5-item            checks I1/M1/M3
  participants,         agreement filled         in plan frontmatter
  checklist_ref)
          │
          ↓
  apps/*/               (future apps reference
  (end-user Threshold   routing.config.ts
  Wizard UI)            WizardTemplates)
```

**When to update this file:** When the coaching philosophy changes, when new checklist
items are added, when new surface categories are discovered, when the 5-item agreement
format changes, when level routing signals change.

**What NOT to do:** Do not copy sections of this file into other files. Link to specific
sections using `#section-anchors`. This preserves the single-source guarantee.

---

## §12 — Schema Placement

### In frontmatter-closed-enums.md (plan frontmatter fields)
```yaml
threshold_intake_level: light | medium | deep
threshold_participants: [human, ai, opus, persona-<id>, external-<name>]
intake_background: ""      # REQUIRED: B-category synthesis (AI-authored after confirmation)
intake_problem: ""         # REQUIRED: C+I synthesis (AI-authored after confirmation)
intake_directions: []      # OPTIONAL: candidate solution paths (not decisions)
goal_statement: ""         # REQUIRED: I1 — human's exact words — NEVER AI-authored
done_criteria: []          # REQUIRED: M1+M3 — human's exact words
intake_checklist_gaps: []  # OPTIONAL: items explicitly marked N/A with reason
```

### In libs/config/routing.config.ts (WizardTemplate interface)
```typescript
interface WizardTemplate {
  // ... existing fields ...
  intake_level: 'light' | 'medium' | 'deep';           // NEW
  participants: ParticipantType[];                       // NEW
  checklist_required: ChecklistItemId[];                // NEW — which of 26 items are required
  checklist_ref: string;                                // NEW — always points to this file §7
}
```

### In packages/principles/principles.yaml
P-META-023 entry: `canonical_ref: docs/plan/pillar-0-governance/threshold-intake-protocol.md`

### In Core Spine classification
- `core_spine: AI` — primary (governs AI inner-defaults behavior)
- `core_spines: [AI, GVRN]` — AI behavior + governance decision rights
- Precedence: GVRN > AI — when coaching philosophy conflicts with governance constraints, governance wins

---

## §13 — Consolidated Change Point

When any aspect of the I→VI discipline changes, make the change HERE in this file, in
the relevant section. The referencing elements will pick up the change:

| What changed | Section to update | Referencing elements that benefit |
|---|---|---|
| Coaching philosophy | §6 | B_THRESHOLD_INTAKE_PROTOCOL contract; AGENTS.md; inner-ai-defaults |
| Checklist item added/removed | §7 | validate-threshold-intake.mjs; routing.config.ts |
| 5-item agreement format | §8 | validate-intent-crystallized.mjs; plan frontmatter |
| Level routing signals | §9 | routing.config.ts intake_level; session-open.sh |
| New surface discovered | §10 | validate-threshold-intake.mjs surface registry |
| Schema field change | §12 | frontmatter-closed-enums.md; validate-frontmatter.mjs |

---

## §14 — Opus Advisory Sentence

The following single sentence captures the full scope of this initiative and is the
basis for the Opus Turn 8 advisory consultation:

> "We are establishing P-META-023 (Intent-to-Verified-Impact, I→VI) as the parent
> meta-principle governing all 42 communication surfaces in CSPS — from AI-Governor
> directive intake to end-user app onboarding — by requiring every surface to start
> from freestyle human expression, scan against a 26-item structured checklist across
> 5 categories (Background, Context, Intent, Ripple Effects, Measurable Results), fill
> gaps through a coach-style discovery process that treats initial expressions as always
> incomplete, never authors the 3 human-anchored items (Outcome/Done Signal/Failure Signal)
> on behalf of the human, and closes the loop with verified measurable impact rather than
> assumed completion — all governed from a single SSoT canonical file that all platform
> elements reference rather than copy, making each improvement to the protocol automatically
> available platform-wide."

---

*Authored: S024 | Governor directive 2026-05-12 | Ratified in session*
*Status: DRAFT → pending P-META-023 registration + B_THRESHOLD_INTAKE_PROTOCOL contract*
