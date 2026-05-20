---
id: csps.plan.universal-logic-framework.master-blueprint
name: Universal Combinatorial Logic Engine — Master Blueprint
description: "Vocabulary-agnostic blueprint for a universal combinatorial framework
  for high-stakes prioritization, dependency mapping, and multi-conclusion decision
  support. Every specific application (SaaS tool, governance system, personal productivity
  platform) is an INSTANCE of this framework. Implementers: adapt vocabulary and
  infrastructure to your own system before building."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: apps_planning
batch: BATCH-B
epoch: E1
session: S047
---

# Universal Combinatorial Logic Engine
## Master Blueprint — Architecture, Psychology, and Implementation

---

> **IMPLEMENTER NOTICE (READ FIRST)**
>
> This document defines architectural and psychological patterns for a **Universal Logic
> Infrastructure**. It is intentionally abstracted from all specific brand names, product
> names, and domain-specific terminology to prevent conflict with your existing systems.
>
> **Your obligation as the implementer:**
> 1. Replace every generic term (Engine, Framework, Template, Council, etc.) with your
>    own vocabulary equivalents.
> 2. Map the mathematical patterns to your own data structures.
> 3. The logic is universal. The vocabulary is yours.
>
> The only thing that must NOT change: the mathematical relationships between the concepts.
> Those are the invariants.

---

## PART I — THE UNIVERSAL CORE ARCHITECTURE

### 1.1 What This Engine IS

A **Combinatorial Priority Engine** is a decision-support infrastructure that:

- Treats every input item as a **node** in a dependency graph, not a row in a list
- Computes **combined impact** — how the failure or completion of one node affects connected nodes
- Produces **multiple reasoned conclusions** from the same input set, each optimized for a different objective
- **Learns from behavior**, not just stated preferences — what users DO corrects what users SAY

This is the mathematical soul of any system that needs to sort complex, interdependent realities into actionable sequences. The soul is identical whether you are:
- Prioritizing construction deliveries against cash flow
- Managing software engineering backlog against business goals
- Structuring a personal productivity system that overcomes recurring cognitive bottlenecks
- Running a multi-AI governance council

**The use case changes. The mathematics does not.**

---

### 1.2 The Three Axes of Computation

Every element in the engine is evaluated on three axes:

**AXIS 1 — GRAVITY**
How much does this element impact other elements if it fails or succeeds?
- A blocked critical path node has high gravity — its failure cascades
- An isolated aesthetic choice has low gravity — its failure is contained
- Gravity is computed from the **dependency matrix**, not declared by the user

**AXIS 2 — VELOCITY**
How urgently must this element be addressed?
- Combines: deadline proximity, rate of change of the situation, cost of inaction
- Velocity decays or grows over time — the engine must re-compute, not cache

**AXIS 3 — INHERITANCE**
Which universal rules does this element inherit from higher-level templates?
- An element inherits constraints from its domain template
- Inherited constraints cannot be overridden without explicit exception declaration
- The inheritance chain makes the reasoning traceable — "why is this high priority?" has a complete answer

**The combination formula:**
```
Priority Score = (Gravity × Gravity_weight) + (Velocity × Velocity_weight) + (Inheritance_modifier)
```
The weights are the sliders. Different use cases set different default weights. The mathematics stays fixed.

---

### 1.3 The Dependency Matrix — The Heart of Combinatoriality

A simple list ranks items independently. A combinatorial engine maps the connections BETWEEN items.

**Horizontal connectivity:** Item A and Item B operate in the same time window. A delay in A shifts B.

**Vertical connectivity:** Strategic goal G requires tactical step T1 and T2. T1 must complete before T2. G cannot close without both.

**Cross-domain connectivity:** A financial constraint in domain F blocks a capacity decision in domain O. These are different domains — most systems miss this link. The combinatorial engine makes it explicit.

**Computing combined risk:**
When two connected nodes are both at risk, the **combined risk is not additive — it is multiplicative.** This is the key insight most priority systems miss. The engine must detect when failure of Node A doubles the impact of failure of Node B.

---

### 1.4 The Inheritance Architecture

The engine is built in layers. Each layer inherits from the one above and specializes downward:

```
UNIVERSAL CORE (sealed — applies to every use case)
  ↓ inherits into
DOMAIN TEMPLATE (ratified per domain — applies to this category of use case)
  ↓ inherits into
INSTANCE CONFIGURATION (active — this specific user, this specific context)
  ↓ inherits into
EDGE CASE EXTENSION (provisional — handling a situation not covered above)
```

**What lives at each level:**

| Level | What it contains | Who can change it |
|---|---|---|
| Universal Core | Mathematical axioms. Anti-guessing policy. Trust ladder rules. | Constitution only — never by instance |
| Domain Template | Domain-specific weights. Typical connectivity patterns. Default priority bands. | Domain governance — ratified process |
| Instance Configuration | User-specific preferences. Communication tone. Data sources enabled. | User — within domain template constraints |
| Edge Case Extension | One-time exceptions. Provisional handling. Expires unless promoted. | User — but flagged for review |

---

> **REMINDER — IMPLEMENTER:**
> *Replace "Universal Core / Domain Template / Instance Configuration" with your
> own layering vocabulary. Map these four levels to your own infrastructure's
> abstraction hierarchy. The levels themselves are mandatory. The names are not.*

---

## PART II — PSYCHOLOGICAL PROCESSING AND DATA ABSORPTION

### 2.1 Why Systems Fail: The Cognitive Wall

The most sophisticated priority engine produces zero value if users cannot or will not input the data it needs. This is the primary failure mode of enterprise software — not the algorithm, but the friction of input.

**Research basis:**
Cognitive Load Theory (Sweller, 1988) establishes that working memory has a fixed capacity. Every manual data entry step consumes working memory that could be used for actual work. When the cognitive wall is high enough, users abandon input entirely.

**The implication:** The engine must be designed primarily as an **absorption system** — a system that reduces the cognitive cost of input to near zero — and secondarily as a priority calculator.

---

### 2.2 The Fragmented Input Protocol

**The principle:** Incoming data arrives as fragments, not finished entries.

No high-stakes user has time to complete a structured form at the moment of input. They are driving, in a meeting, or in a crisis. The engine must accept unstructured fragments and hold them in a pending state — never complete them on behalf of the user, never block action on their incompleteness.

**The three-state holding model:**

```
STATE 1 — READY TO ACT
The fragment contains sufficient context for the engine to propose a structured action.
No human intervention needed before execution.

STATE 2 — NEEDS CLARIFICATION
The fragment is real but ambiguous. The engine flags it and holds it.
It will not execute, will not assume, will not hallucinate missing context.
The user resolves the ambiguity when they choose to — not on the engine's timeline.

STATE 3 — ARCHIVED PENDING TRAINING
The fragment has insufficient context for current action but carries signal.
The engine stores it for pattern learning. It may become relevant when correlated
with future inputs or when the user's context changes.
```

**The anti-guessing policy:** The engine NEVER fills in missing context. When a fragment would require an assumption to become actionable, it goes to STATE 2. This is non-negotiable — it is the primary trust-building mechanism.

**Research basis:** Trust in automation (Lee & See, 2004) — trust is built through demonstrated reliability and appropriate confidence. An engine that guesses correctly 80% of the time and silently errs 20% of the time destroys more trust than one that asks for clarification 100% of the time.

---

### 2.3 The Dual-Mode Input Design

**Cognitive offloading via voice:**
The primary input channel must have ZERO cognitive overhead. Voice capture during activity (driving, walking, working) is the highest-value channel because:

1. It captures System 1 thinking (Kahneman) — the fast, automatic, experience-based intuitions — before they are filtered, forgotten, or distorted by System 2 deliberation
2. It requires no context switch — no stopping to type, find the app, organize
3. It captures MORE information per unit of user effort than any other input method

**Photo/document capture as secondary channel:**
Physical artifacts (invoices, punch lists, handwritten notes) carry structured information that the user has already produced. The engine reads them and converts them to fragments — the user's effort is already done.

**The 60-second first-value moment:**
The engine must demonstrate value within 60 seconds of first use. This is not marketing — it is the behavioral commitment threshold (Fogg Behavior Model). Before the user has invested meaningful effort, they must see meaningful output. This "quick win" converts initial curiosity into habitual use.

---

> **REMINDER — IMPLEMENTER:**
> *Adapt "State 1 / State 2 / State 3" to your own status vocabulary. Adapt
> "voice capture" and "photo ingestion" to your own input channels.
> The underlying pattern — fragment → hold → clarify → act — is universal.
> The channels are implementation choices.*

---

### 2.4 Behavioral Verification — What Users DO vs. What They SAY

**The stated-preference problem:**
Users report what they believe is optimal, not what they actually do. A user who says "my best time is 6 AM" but consistently acts at 4 PM is telling you their aspiration, not their behavior. An engine built on stated preferences will optimize for the wrong target.

**The behavioral verification cycle:**

```
1. OBSERVE — record actual behavior without intervention
2. ACCUMULATE — wait for statistical significance (N ≥ threshold, not single events)
3. DETECT DIVERGENCE — identify patterns where behavior consistently differs from stated preferences
4. INITIATE VERIFICATION LOOP — surface the divergence to the user:
   "I notice your behavior suggests [X]. Your stated preference is [Y].
   Would you like to update your configuration to match your actual patterns?"
5. USER DECIDES — not the engine. The engine surfaces; the user ratifies.
```

**Why threshold-based (not event-based):**
A single deviation is noise. Three consecutive deviations are a pattern. Seven out of ten over two weeks are a fact. The engine must not flag individual anomalies — only statistically significant divergence.

**Research basis:** Implementation intentions vs. action control (Gollwitzer & Sheeran, 2006). The gap between intention and behavior is systematic, not random. Systems that detect and close this gap are adopted at dramatically higher rates than those that trust stated preferences.

---

### 2.5 The Trust Ladder — Progressive Permission

**The core principle:** The engine earns access, it does not demand it.

Most systems request maximum permission upfront ("Please connect your email, calendar, contacts...") — and lose 80% of users before delivering a single unit of value.

**The ladder structure:**

```
RUNG 0 — Observation only
Engine reads patterns from explicit user input only.
No external data. No integrations.
Demonstrates value: "Here's what I see in what you've told me."

RUNG 1 — Read-only external
Engine reads metadata from connected systems (call logs, timestamps, durations).
No content access. No active parsing.
Demonstrates value: "Here's what the patterns in your communication show."

RUNG 2 — Structured parsing on explicit permission
Engine parses specific, user-designated sources (forwarded emails, named contacts).
User controls exactly which inputs are processed.
Demonstrates value: "Here's what this specific document/contact pattern tells us."

RUNG 3 — Active proxy with confirmation
Engine proposes actions, user confirms before any external action.
Nothing happens without explicit approval.
Demonstrates value: "Here's a draft. One tap to send."

RUNG 4 — Autonomous within defined bounds
Engine acts within rules the user has explicitly approved.
User defines the bounds; engine operates within them.
No silent expansion of permissions.
```

**Research basis:** Progressive disclosure (Nielsen, 1990) and the foot-in-the-door technique (Cialdini). Small initial commitments lead to larger subsequent ones. Each rung of the ladder is a small commitment that makes the next rung natural.

---

> **REMINDER — IMPLEMENTER:**
> *Adapt "Rung 0-4" to your own permission levels. The psychological principle —
> earned trust through demonstrated value before requesting permissions — is
> non-negotiable for user adoption. The specific rungs are yours to define.*

---

### 2.6 The Sensitivity Calibration System

**The problem:** A single communication tone does not work across all users, all contexts, all relationships.

**The calibration matrix:**

| Dimension | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|
| Tone | Clinical / Logical | Professional | Warm / Personal | High Empathy |
| Depth | Bullet point | Short summary | Context-rich | Full audit trail |
| Urgency channel | Silent / Dashboard | Nudge notification | Chat message | Voice interruption |
| Privacy | Full business context | Filtered | Personal only | Silent mode |

**Per-recipient calibration:**
Different external recipients require different calibration. The engine maintains a calibration profile per recipient class (family, suppliers, clients, team). User sets defaults; behavior refines them.

**The feedback loop:**
External recipients (not just the primary user) can provide feedback on communication quality. This distributed feedback makes the calibration more accurate over time than any single user can achieve alone.

---

## PART III — TEMPLATE ARCHITECTURE AND COUNCILS

### 3.1 The Template Mechanism

**What a template is:**
A template is a saved configuration of the dependency matrix weights, input channels, calibration settings, and output formats — optimized for a specific type of use case.

**The template inheritance rule:**
Every template extends from the Universal Core. It cannot override Universal Core axioms — only specialize them. A template that violates an axiom is invalid, regardless of who created it.

**Template discovery:**
The engine includes a **suggestion agent** that analyzes active configurations and proposes matching templates:
- "Your current configuration resembles the [Domain X] pattern. Would you like to inherit the optimized weights from that template?"
- Accepted: the instance inherits the template's defaults
- Declined: the instance continues with its current configuration
- Neither response is forced — this is suggestion, not imposition

---

> **REMINDER — IMPLEMENTER:**
> *Adapt "template" to your own configuration vocabulary. In some systems this
> is called a "preset," "profile," "workspace," or "mode." The mathematical
> content — saved weight configurations that inherit from a universal core —
> is what matters. The name is yours.*

---

### 3.2 The Core Council — Multi-Discipline Reasoning

**What a council is:**
For decisions where a single optimization axis produces an inadequate answer, the engine convenes a structured multi-perspective reasoning process. Each perspective applies a different lens to the same data and produces its own conclusion. The conclusions are then synthesized into a multi-outcome recommendation.

**The standard council composition:**

| Role | Primary lens | Typical output |
|---|---|---|
| The Analyst | Data extraction and quantitative risk | Numerical probabilities, cost/benefit |
| The Strategist | Long-term patterns and systemic effects | Trend analysis, positioning |
| The Human Factor | Cognitive load, relationship health, sustainability | Behavioral predictions, burnout indicators |
| The Skeptic | Counter-arguments, failure modes | Risk list, assumption challenges |

**Council output format:**
The council never produces a single "correct" answer. It produces:
- **Conclusion A (Aggressive):** Optimized for speed and scale. High risk, high reward.
- **Conclusion B (Defensive):** Optimized for loss prevention and trust. Slower, sustainable.
- **Conclusion C (Balanced):** Optimized for sustainable growth. The middle path with explicit trade-off disclosure.

Each conclusion includes a **reasoning trace** — the mathematical and logical path that produced it. The user can inspect any conclusion to understand why.

---

### 3.3 Multi-Conclusion Output and Reasoning Traces

**Why single-answer systems fail high-stakes users:**
In high-stakes contexts, the "best" answer depends on the user's current risk tolerance, resource state, and strategic position — factors that change. A system that gives one answer trains users to accept one answer, removing their judgment from the loop.

**The multi-conclusion requirement:**
Every significant decision output must provide at least three conclusions, each optimized for a different objective. The user chooses which conclusion matches their current context.

**The reasoning trace requirement:**
Every conclusion must show its work. "Task A is priority 1" is insufficient. The correct output is:
"Task A is priority 1 because: (1) it is connected to Tasks B and C which are deadline-critical, (2) failure of Task A would increase the combined risk of Tasks B+C by factor 2.4, (3) under the current Velocity axis, Task A has 6 hours before irreversibility threshold is crossed."

The trace makes the engine auditable. Users who understand the reasoning either trust it more or correct it with better information. Either outcome improves the system.

---

> **REMINDER — IMPLEMENTER:**
> *Adapt "Analyst / Strategist / Human Factor / Skeptic" to your own council
> personas. Adapt "Conclusion A/B/C" to your own outcome framing. The
> mathematical requirement — multiple conclusions from multiple lenses with
> explicit reasoning — is the invariant. Your vocabulary is your own.*

---

## PART IV — THE DEVELOPER'S CONTROL PANEL (WEIGHT CONFIGURATION)

### 4.1 The Significance Sliders

The engine exposes key configuration parameters as adjustable dimensions. Different use cases default to different positions:

**Slider 1 — Automation vs. Manual Verification**
Left: Nothing executes without explicit user approval
Right: Engine executes within defined rules without asking
Default: Starts left, earns right as trust is established (the Trust Ladder in practice)

**Slider 2 — Short-term Wins vs. Long-term Infrastructure**
Left: Optimize for immediate visible impact
Right: Optimize for compounding platform value over time
Default: Depends on domain template; construction defaults left, governance defaults right

**Slider 3 — Individual Optimization vs. Collective Intelligence**
Left: Data stays in private silo, all learning is individual
Right: Anonymized patterns contribute to collective template improvement
Default: Left — data privacy is the prerequisite for adoption. Right is earned through the Trust Ladder.

**Slider 4 — Strict Hierarchy vs. Dynamic Reprioritization**
Left: Once set, priorities don't change unless manually updated
Right: Engine continuously recomputes based on new inputs and behavioral signals
Default: Middle — scheduled recomputation at defined intervals, not continuous

---

### 4.2 The Private/Business Silo — Non-Negotiable Architecture

**The rule:** Private data and business data occupy separate processing environments with no cross-contamination.

This is not a UX feature — it is an architectural requirement. The reason most productivity systems fail is that users do not trust them with their personal data. The hard silo is what earns permission to process any data at all.

**Implementation requirement:**
- The silo boundary must be visible in the UI at all times — never ambiguous
- Private data must be excluded from all business analytics, reporting, and external outputs
- The silo toggle is user-controlled, not engine-controlled
- Violation of the silo (by bug or design) is a critical failure — not an advisory warning

---

> **REMINDER — IMPLEMENTER:**
> *Adapt the "private/business silo" to your own data isolation model. In
> some contexts this is personal/professional, in others it is
> confidential/non-confidential. The principle — hard isolation with
> visible user control — is non-negotiable for adoption. The vocabulary is yours.*

---

## PART V — IMPLEMENTATION SEQUENCE

**The sequence is not arbitrary — it is derived from the Trust Ladder and the dependency matrix of the engine's own components.**

```
PHASE 1 — THE ABSORPTION LAYER (prerequisite for all else)
Build the data capture mechanism. Fragmented input. Three-state holding.
Nothing else works until data can be captured at near-zero cognitive cost.
Success criterion: User captures at least 5 fragments on day 7 without prompting.

PHASE 2 — THE DEPENDENCY GRAPH (enables combinatorial logic)
Build the connection infrastructure. Every item declares its dependencies.
The matrix computes gravity scores.
Success criterion: System correctly identifies a blocked critical path
that the user would have missed in a linear list.

PHASE 3 — THE MULTI-CONCLUSION OUTPUT (enables trust)
Build the reasoning trace and multi-outcome display.
Users see not just what is recommended but why.
Success criterion: User changes their stated decision after reading the reasoning trace.
This is the proof the trace is adding value, not just noise.

PHASE 4 — THE TEMPLATE LAYER (enables scaling)
Build the template mechanism. Save, share, inherit.
The first template is always auto-generated from the user's own configuration.
Success criterion: A new user reaches full productivity in 50% less time
using a template vs. configuring from scratch.

PHASE 5 — THE COUNCIL (enables high-stakes decisions)
Build the multi-perspective reasoning process.
Deploy initially for the highest-stakes decisions only.
Success criterion: Users report the council surfaced a consideration
they had not thought of and that consideration changed their decision.

PHASE 6 — THE BEHAVIORAL LAYER (completes the loop)
Build the verification cycle. Behavior vs. stated preferences.
The engine now self-improves.
Success criterion: Users report the engine understands them better
than they expected within 30 days.
```

---

> **REMINDER — IMPLEMENTER:**
> *The phase sequence is driven by the dependency graph of the engine itself —
> Phase N cannot produce value without Phase N-1 being operational.
> Do not reorder the phases. Do not skip phases. The order is the architecture.*

---

## FINAL PRINCIPLES — THE INVARIANTS

These are the mathematical and psychological axioms that cannot be overridden:

1. **The anti-guessing axiom:** The engine never fills in missing context. It routes to STATE 2.
2. **The trust-ladder axiom:** Access is earned, not demanded. Permissions grow with demonstrated value.
3. **The reasoning-trace axiom:** Every recommendation shows its mathematical path.
4. **The multi-conclusion axiom:** High-stakes outputs always provide at least three conclusions.
5. **The behavior-over-statement axiom:** Statistical behavioral patterns override stated preferences after N observations.
6. **The silo axiom:** Private and business data occupy permanently separate environments.
7. **The inheritance axiom:** Every instance inherits from a template; no instance stands alone.
8. **The combinatorial axiom:** Dependencies between items are computed, not declared. The matrix is the truth.

---

> **REMINDER — IMPLEMENTER:**
> *These 8 axioms are the Universal Core. They are sealed. Every specific
> application of this engine must honor them. Where they conflict with your
> existing architecture, investigate the conflict — it likely points to a
> structural gap that needs to be addressed, not a reason to override the axiom.*

---

*Document version: 1.0 | Session: S047 | This document is vocabulary-agnostic by design.*
*CSPS mapping: see csps-mapping.md in this directory.*
*Crystallization questions: see crystallization-questions.md in this directory.*
