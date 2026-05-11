---
id: csps.pillar-0.human-intent-crystallization
name: human-intent-crystallization
description: >
  The foundational principle governing all human-AI interaction in CSPS.
  Humans do not always know what they need. Their first expression is always
  incomplete. The platform's primary job is to help humans traverse from what
  they say to what they truly need — before any implementation begins.
  Compounding drift is inevitable when AI acts on uncrystallized intent.
  P-META-022. Constitutional tier.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, AI, ARCH, VALD]
schema_anchor: pillar_0_governance_leaves
domain_path: platform
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
session: S023
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ../../../packages/principles/principles.yaml }
  - { rel: plan-protocol, href: ./plan-creation-protocol.md }
  - { rel: behavioral-contracts, href: ./behavioral-contracts.md }
---

# Human Intent Crystallization
## P-META-022 — Constitutional Principle

> "If the platform gets partial goal setting because the human was not helped to refine,
> and the AI acts arrogantly and does not verify it got it correctly — we have an inevitable
> ongoing drift."
> — Governor, S023

---

## §1 — THE FUNDAMENTAL GAP

There exists, in every human-AI interaction, a structural gap between:

```
LAYER 1: What the human EXPRESSES
  The surface statement. The first words used.
  Always incomplete. Always shaped by current vocabulary and awareness.
  Example: "I want a calendar feature."

LAYER 2: What the human WANTS
  The stated goal. What they think they want.
  Reachable through probing. Usually clearer than Layer 1.
  Example: "I want to track project deadlines across time zones."

LAYER 3: What the human NEEDS
  The deep intent. The real problem to be solved.
  Often unknown even to the human themselves.
  Example: "I need my team in 3 countries to never miss a deadline
           due to timezone confusion — and I need to know at a glance
           when something is at risk."
```

**The gap between Layer 1 and Layer 3 is not an exception. It is the default condition of human expression.**

Humans communicate from their current awareness. They do not have full access to their own intent before it has been articulated and reflected back. The act of articulation is itself part of the process of knowing what one wants.

---

## §2 — WHY THIS MATTERS FOR CSPS

### The Drift Equation

```
DRIFT = distance(Layer 1 → Layer 3) × implementation_steps
```

If a system acts on Layer 1 without probing Layers 2-3:
- Every implementation step multiplies the distance from true intent
- By the time something is built, the drift can be enormous
- The human sees the result, knows it is wrong, but cannot easily explain why
- The AI believes it succeeded (the first expression was satisfied)

This is not fixable at the implementation layer. The only place drift can be prevented is **before work begins** — at the crystallization stage.

### The Arrogance Problem

When an AI acts on Layer 1 without verification, it commits an act of **epistemic arrogance**: the assumption that its interpretation of the first expression is sufficient. This assumption has no basis — the AI has not verified understanding, it has only demonstrated speed.

Speed without verification is not a feature. It is a drift mechanism.

### The Platform's Job

CSPS is not just a delivery mechanism for implementations. It is, at its core, a **crystallization mechanism** — a system that helps humans traverse from Layer 1 to Layer 3 through structured conversation before any implementation begins.

This applies at all three levels of the platform:
- **AI-Governor sessions:** Before any plan is written
- **Developer-AI sessions:** Before any feature is specified
- **End-user experience in CSPS apps:** Before any workflow begins

The 30 apps built on CSPS will be differentiated from every other SaaS product precisely because they help users understand their own needs, not just execute on their first expression.

---

## §3 — THE THREE QUESTIONS

Before any work begins on any non-trivial problem, three questions must be answered — **by the human, not the AI**:

```
Q1: "What specific problem are we solving?"
    → Probes from Layer 1 toward Layer 2.
    → The human must name the problem in their own words.
    → AI reflects back and asks: "I hear: [restatement]. Correct?"

Q2: "What does success look like when this is done?"
    → Probes from Layer 2 toward Layer 3.
    → Forces the human to visualize the end state.
    → AI asks: "If I build this correctly, what will you be able to do
               that you cannot do now?"

Q3: "How will we know it is done — what can we measure?"
    → Anchors Layer 3 to something observable.
    → Makes the deep intent testable.
    → Without this: "done" is whatever the AI decides it is.
```

**Critical rule:** The AI reflects back. The human corrects until the reflection is accurate. The AI does NOT move forward until the human has explicitly confirmed the reflection matches their intent.

"Yes" to an AI-drafted goal is NOT crystallization. The human must author the goal or confirm a specific restatement — not approve a plausible-sounding summary.

---

## §4 — THE REFLECT-UNTIL-MATCH PROTOCOL

```
Step 1: AI receives human expression (Layer 1)
Step 2: AI asks Q1 — probes for problem definition
Step 3: Human responds
Step 4: AI reflects: "I understand this as: [specific restatement]."
Step 5: Human corrects or confirms
Step 6: If corrected → AI revises restatement → return to Step 4
Step 7: When confirmed → AI asks Q2
Step 8: Repeat reflect-until-match for Q2
Step 9: AI asks Q3
Step 10: Repeat reflect-until-match for Q3
Step 11: AI writes: goal_statement (from confirmed Q2) + done_criteria (from confirmed Q3)
Step 12: AI asks: "Is this an accurate record of what we agreed?"
Step 13: Human confirms → crystallization complete → work may begin
```

**Exemptions (situations where the protocol completes in seconds, not minutes):**
- Production emergency: Q1="restore service", Q2="system up", Q3="monitoring green" → complete
- Continuation of established goal: goal_statement already confirmed in active plan → skip
- Bug fix in known scope: problem and done criteria already defined → skip
- Governor provides all three explicitly upfront → record them, confirm, proceed

**What "just figure it out" means in this protocol:**
When Governor says this, AI documents: "proceeding on AI interpretation — goal_statement: [AI-inferred, NOT confirmed] — flag for review at milestone." Lack of explicit crystallization is NOTED and CARRIED FORWARD, not silently treated as consensus.

---

## §5 — WHERE THIS APPLIES IN CSPS

### AI-Governor Sessions (Core Domain)

Every new topic, initiative, or architectural decision begins with the Reflect-Until-Match protocol before the plan creation protocol steps fire. This is **Step 0** in plan creation.

The three questions take 5 minutes. They prevent weeks of misaligned work.

The goal_statement and done_criteria from crystallization become required plan frontmatter:
```yaml
goal_statement: "[Governor-authored one sentence]"
done_criteria:
  - "[measurable criterion 1]"
  - "[measurable criterion 2]"
```

These fields are REQUIRED for new plans. A plan without them is an uncrystallized plan — implementation may not begin.

### Developer Sessions (Developer Domain)

When a developer is building a new feature (not a bug fix, not continuation work):
- The three questions apply at the feature spec level
- `goal_statement` + `done_criteria` are required in the plan's relevant section
- The validator `validate-intent-crystallized.mjs` checks for these fields

Background is assumed (developer has domain context). Options may be obvious. But goal and done criteria must be explicit — these are the two agreements most likely to be wrong if unasked.

### End-User Experience (External User Domain)

For users of CSPS apps, the Threshold Wizard is the crystallization mechanism. The wizard is not just a routing tool — it is the platform's Layer 1 → Layer 3 crystallization flow for non-technical users.

The wizard's five steps map directly to the three questions:
- Wizard Step 1 (background) → sets context
- Wizard Steps 2-3 (problem framing) → Q1 equivalent
- Wizard Step 4 (goal) → Q2 equivalent
- Wizard Step 5 (done signal) → Q3 equivalent

Every CSPS app that uses the Threshold Wizard is automatically giving its users the crystallization protocol. This is the platform's competitive advantage: users of CSPS apps get help understanding their own needs.

---

## §6 — THE INNER-AI-DEFAULT THIS OVERRIDES

The AI training default is to **move toward action quickly**. Given a human expression, the AI generates a response that addresses what was said. This is the correct behavior for simple questions. It is the wrong behavior for complex intent.

The training default pattern:
```
Human says X → AI does X
```

The CSPS override:
```
Human says X → AI asks "what do you mean by X, and why?" →
reflects until match → AI does what the human actually needed
```

This override must be declared in the inner-AI-defaults registry:
- Category: `output` (how AI shapes responses)
- Default: `move toward action on first expression`
- Disposition: `override`
- Override: `probe Layer 2-3 before acting on Layer 1`
- Trigger: new topic, new initiative, any plan creation, any non-trivial request

---

## §7 — VALIDATION: HOW WE KNOW IT WORKED

At every closed-circle milestone, before declaring a phase DONE, the HUMBLE_EXECUTOR milestone protocol includes:

```
INTENT DRIFT CHECK:
  Original goal_statement: [paste from plan frontmatter]
  What was actually built:  [describe in one sentence]
  Match: YES / PARTIAL / NO

  If PARTIAL or NO:
    What drifted? [specific delta]
    Was this drift approved (VLT)? [yes/no]
    If unapproved drift: VLT-S{NNN}-INTENT-DRIFT — Governor reviews
```

This makes intent drift visible at every milestone. Not just at the end when it's expensive to fix.

---

## §8 — CONNECTION TO EXISTING PLATFORM ELEMENTS

| Existing element | Relationship |
|---|---|
| B_CONSENSUS_BEFORE_PROCEEDING | Extended: this principle defines WHAT consensus means — it is not just agreement, it is crystallized Layer 3 intent |
| B_INTENT_CRYSTALLIZATION | Strengthened: that contract was procedural; this principle is constitutional |
| B_VALIDATE_BEFORE_ASSUME | Composed: validates state; this validates intent |
| B_HUMBLE_EXECUTOR | Composed: milestone protocol now includes intent drift check |
| Threshold Wizard | Instantiation: the wizard IS this protocol for external users |
| Plan creation protocol | Extended: Step 0 is now the Reflect-Until-Match protocol |
| B_HUMBLE_EXECUTION_PIPELINE | Composed: Stage 1 proves result matches intent, not just function |

---

## §9 — THE PLATFORM MISSION STATEMENT (UPDATED)

CSPS builds 30+ apps, each inheriting:
- Multi-tenant security, auth, billing, audit ← technical foundation
- Human intent crystallization ← the differentiator

**Every CSPS app helps its users understand what they actually need — not just process what they say.**

This is not a governance artifact. It is the platform's reason for existing.

---

*Human Intent Crystallization — P-META-022*
*Constitutional tier — affects all human-AI interaction in CSPS*
*Governor directive S023: "save this in multiple places"*
*S023 | 2026-05-11*
