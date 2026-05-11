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

### AI-to-AI Domain (Opus → Sonnet → Haiku)

The same Layer 1-3 gap exists in AI-to-AI communication.
When Sonnet receives Opus output (e.g., tools/council/opus-turn.md), the gap is:
- Layer 1: What Opus wrote (literal text)
- Layer 2: What it means for this session (which actions to take)
- Layer 3: Why it matters (the platform intent it serves)

A Sonnet that reads Opus output and immediately executes — without reflecting back
its understanding — commits the same arrogance as acting on a human's first expression.

**The INTENT ABSORBED Protocol (Type A boundary):**

At the start of every session where Opus output is present, Sonnet MUST emit:

```
INTENT ABSORBED — Opus Turn [N]:
  Task understanding:  [one sentence per major action Opus specified]
  Why this matters:    [the platform goal this serves — Layer 3]
  Constraints understood: [what NOT to do, deferrals, protected paths]
  First action: [Item 1]
```

This block is the Governor's intervention window. If the reflection is wrong,
the Governor redirects BEFORE Sonnet edits 10 files.

**Mechanical enforcement:**
- session-open.sh: if opus-turn.md was modified since last session → inject
  "Opus output present. Emit INTENT ABSORBED before any file edit."
- B_MUTUAL_UNDERSTANDING_VALIDATION: the INTENT ABSORBED block IS the output_contract
  verification for AI-to-AI boundary type 2 (subagent return confirmation)

---

### All 5 Boundary Types — B_BOUNDARY_ALIGNMENT_PROTOCOL (S024 Governor directive)

The crystallization principle applies at EVERY AI communication boundary, not only AI→AI.
Governor ratification S024: *"MAKE IT MECHANICALLY ENFORCED FOR ALL FUTURE EXTERNAL SYSTEMS. ALWAYS VERIFY YOU UNDERSTOOD WHAT WAS COMMUNICATED TO YOU AND CONFIRM WHAT YOU SAID IS PERFECTLY ALIGNED WITH YOUR INTENT."*

Every boundary crossing has the same Layer 1-3 gap:
- Layer 1: What was literally sent/received
- Layer 2: What it means for this specific task
- Layer 3: What platform goal it serves

**Universal block format (B_BOUNDARY_ALIGNMENT_PROTOCOL):**

BEFORE crossing — UNDERSTANDING BLOCK:
```
BOUNDARY CROSSING — [Type A|B|C|D|E]:
  I understand the request as: [Layer 3 intent — not Layer 1 expression]
  I will produce:              [specific output/action]
  This serves:                 [platform goal]
```

AFTER crossing — ALIGNMENT CONFIRMATION:
```
ALIGNMENT CHECK:
  What was requested: [restatement]
  What I produced:    [one sentence]
  Match:              YES / PARTIAL / NO
  If PARTIAL or NO:   [delta + VLT-S{NNN}-INTENT-DRIFT-{slug}]
```

**The 5 boundary types:**

| Type | Crossing | UNDERSTANDING BLOCK | ALIGNMENT CONFIRMATION | Phase |
|---|---|---|---|---|
| A | Opus → Sonnet cross-session | INTENT ABSORBED (full format above) | Sonnet Report "Match:" field | Done |
| B | Sonnet → subagent Agent() call | In Agent prompt preamble | Agent result review in Sonnet output | Phase 1 |
| C | AI → external API / MCP tool | In AI response before tool call | Post-call note confirming result matched intent | Phase 2 |
| D | AI → new chat (chat-jump) | MUV §8 sections + alignment questions | Cross-chat iteration loop (MUV protocol) | Phase 2 |
| E | AI → human response | Implicit in crystallization Q1-Q3 | End-of-turn "what changed + what's next" | Phase 1 |

**Why all 5 matter:** The gap between what was sent and what was understood exists at every boundary. Enforcing only one boundary type leaves four invisible leak points. The platform's governance compounds when every crossing is verified — not just the ones that "feel important."

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

---

## §10 — MULTIPLE ZF GATES (Wall-to-Wall Verification)

A single "ZF ACHIEVED" at the end is insufficient. Intent can drift at any point in the
lifecycle. There must be a ZF gate at every stage where drift can enter.

```
ZF-1: PRE-PLANNING CRYSTALLIZATION GATE
  Question: Was intent crystallized before planning began?
  Evidence: goal_statement (human-authored) + done_criteria (measurable list)
  When:     Before any plan section is written
  Validator: validate-intent-crystallized.mjs (ACTIVE from S023)
  Status:   BLOCKING for S023+ plans

ZF-2: STEP ALIGNMENT GATE
  Question: Does each implementation step serve the crystallized goal?
  Evidence: Each step includes: "alignment: [how this step advances goal_statement]"
  When:     At the start of each implementation step
  Validator: validate-step-crystallization-alignment.mjs (future — Session B)
  Status:   ADVISORY initially

ZF-3: MILESTONE INTENT GATE
  Question: Does the milestone output match the original Layer 3 need?
  Evidence: HUMBLE_EXECUTOR intent drift check:
            original goal_statement vs. what was actually built
  When:     At every closed-circle milestone
  Validator: closing-summary §INTENT-DRIFT block (ACTIVE — added to template)
  Status:   MANUAL now, automated Session C

ZF-4: DELIVERY GATE (plan completion)
  Question: Is each done_criterion measurably met?
  Evidence: done_criteria checklist with ✅/⏳/❌ per criterion
  When:     At session close / plan declared COMPLETE
  Validator: validate-done-criteria-met.mjs (future — Session C)
  Status:   MANUAL now
```

**ZF-1 is the most critical.** If ZF-1 passes, ZF-2/3/4 are easier to satisfy.
If ZF-1 is skipped, no amount of ZF-2/3/4 can recover from a misunderstood goal.

---

## §11 — INHERITANCE MECHANISM

P-META-022 must be inherited by every artifact created on CSPS — not just acknowledged in documentation.

**Inheritance Path 1: Every new app (via template)**
`apps/template/` will include a `_meta/intent.md` file — a crystallization record for the app itself:
```markdown
# App Intent Record
goal_statement: "[why this app exists — what need it serves]"
done_criteria:
  - "[what success looks like for this app]"
crystallized_at: "[session when Governor defined this]"
```
When a developer forks the template, they fill this in BEFORE writing any domain code.
The app-level crystallization record is the Layer 3 anchor for all feature decisions.

**Inheritance Path 2: Every new plan (via plan-creation-protocol Step 0)**
Step 0 fires before any plan is written. Goal_statement and done_criteria are in frontmatter.
`validate-intent-crystallized.mjs` blocks plans without them.

**Inheritance Path 3: Every feature in every app (via plan ZF-1)**
The feature spec inherits the app's goal_statement context.
Feature done_criteria must connect to the app's Layer 3 need.

**Inheritance Path 4: Every AI interaction (via inner-AI-defaults OD-007)**
The `act-on-first-expression` override fires at every new topic, initiative, or plan.
AI cannot proceed to action without probing Layer 2-3.

**What inheritance guarantees:**
Every app built on CSPS, at every layer from the platform to the feature level,
carries an explicit record of WHY it was built and WHAT "done" means.
Users of CSPS apps get help understanding their needs — automatically inherited.

---

## §12 — EXISTING ELEMENTS ALIGNMENT

These existing platform elements must be updated with P-META-022 cross-references:

| Existing artifact | Current state | Required update |
|---|---|---|
| B_INTENT_CRYSTALLIZATION | Narrow procedural contract | Add: "See B_HUMAN_INTENT_CRYSTALLIZATION for constitutional depth. This contract is superseded by P-META-022." |
| B_CONSENSUS_BEFORE_PROCEEDING | No P-META-022 reference | Add cross-reference: "Consensus as defined by P-META-022 = confirmed Layer 2-3 intent" |
| B_ASK_WHEN_FILLING_GAPS | Addresses under-specified input | Add: "4-condition gate is the operational layer; P-META-022 is the governing philosophy" |
| B_HUMBLE_EXECUTOR | Milestone protocol | Add intent drift check (ZF-3) to milestone format |
| B_AUTONOMOUS_BATCH_WITH_PREFLIGHT | Pre-flight format | Add Q-CRYSTALLIZED: "Is goal_statement present and human-authored?" to Q-GATE list |
| csps-platform-dna.md | 13 DNA elements | Element 0 or add Element 15: Human Intent Crystallization |
| gradual-build-plan.template.md | No intent fields | Add goal_statement + done_criteria to frontmatter |
| Threshold Wizard | Already crystallizes for external users | Add explicit P-META-022 declaration: "This wizard implements P-META-022 for external users" |

**Priority order for updates:**
1. B_CONSENSUS_BEFORE_PROCEEDING cross-reference (touches R1 contract — do first)
2. B_HUMBLE_EXECUTOR intent drift check (ZF-3 gate — high value)
3. B_AUTONOMOUS_BATCH_WITH_PREFLIGHT Q-GATE (immediate enforcement point)
4. csps-platform-dna.md
5. All others in subsequent sessions

---

*Human Intent Crystallization — P-META-022*
*Constitutional tier — affects all human-AI interaction in CSPS*
*Governor directive S023: "save this in multiple places"*
*Sections §10-§12 added S023: Multiple ZF Gates + Inheritance + Existing Alignment*
*S023 | 2026-05-11*
