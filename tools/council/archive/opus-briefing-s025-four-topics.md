# Opus Briefing S025 — Four Architectural Topics for Council Review
## Written by: Sonnet S025 | Governor directive 2026-05-12
## Status: AWAITING OPUS TURN — do not implement until Opus responds

> **Governance note:** These four topics were identified by the Governor as requiring Opus
> architectural review BEFORE implementation. Sonnet has assessed them, extracted PE scores,
> and prepared specific questions. Opus reviews → Governor ratifies → Sonnet implements.

---

## TOPIC 1: Template Ratification Grades — "Not All Templates Are Equal"

### The Problem
The Governor identified a fundamental gap: sealing a reusable dashboard template is a very
different act than creating an edge function for a single customer. Currently CSPS treats
all template ratification the same (K=2 promotion → stable). This is wrong.

**The Core Spine correspondence the Governor identified:**
> "As you go more externally, responsibility decreases. At the core, all parameters must
> be maximized."

This maps directly to the L1/L2/L3 layer doctrine:
- L1 (sealed core) → Maximum ratification: research + external AI consensus + Opus council + Governor + ZF Level 3
- L2 (domain template) → Medium ratification: research + Governor + ZF Level 2
- L3 (instance template) → Light ratification: Governor confirms + ZF Level 1

### Current State
- `B_TEMPLATE_FIRST_CREATION` — behavioral contract exists ✓
- `template-registry.md` — SSoT with K=2 promotion ✓
- `template_status: novel-pending-pattern-evaluation | stable` — two states only ✗
- No grade distinction between a core platform template (gradual-build-plan) vs an app-level template (a budget-planner component)
- No research requirement before sealing
- No consensus protocol with external AI

### Proposed Grade System (Sonnet draft — for Opus evaluation)

| Grade | Layer | Name | When applied | Ratification requirements |
|---|---|---|---|---|
| **A** | L1 | Sealed Foundation | Templates that govern ALL platform behavior across all apps | Full Threshold Deep: research + external AI + Opus council + Governor ratification + ZF Level 3 + FSE 5/5 |
| **B** | L2 | Domain Standard | Templates for platform-wide reuse across 2+ apps | Threshold Medium: targeted research + Governor + ZF Level 2 |
| **C** | L3 | App Provisional | App-specific templates, edge functions, customer-specific | Threshold Light: Governor confirms + ZF Level 1 |
| **D** | L3 | Experimental | K=1 (first use) — novel-pending-pattern-evaluation | No external review; marked `template_status: experimental` |

### Questions for Opus
1. Does this grade system compose correctly with the existing depth_chosen (3/4/5) discipline?
2. What should trigger Grade A → must Opus council fire automatically?
3. How do we retroactively grade existing templates in template-registry.md?
4. Should the `template_status` closed enum be expanded with: `experimental | draft | provisional | domain-standard | sealed`?
5. What is the mechanical trigger for "research required before sealing"? (External AI consultation like the GPT/Gemini reviews we've been doing?)

### PE Score
PE=82 (Band 2) — affects all template creation going forward; high D (dependency significance)

---

## TOPIC 2: Idea Routing with Active Implementation

### The Problem
During Budget Planner build (active Layers 1-3), the Governor raised multiple architectural
ideas (P-META-023, threshold-intake-protocol, B_BOUNDARY_ALIGNMENT_PROTOCOL, I→VI discipline).
The current handling was ad-hoc: the AI pivoted between the active build and the new ideas
without a formal routing protocol.

The correct behavior: new ideas should go through a formal INTAKE_INTERRUPT_PROTOCOL.
Currently:
- `raw-thoughts-queue.md` exists but has no PE-aware routing logic
- `B_PE_ALIGNMENT_GUARDIAN` deflects low-PE ideas when high-PE work is active
- But there's no formal "interrupt vs vault" decision tree

### The Three Cases
```
New idea arrives during active implementation:

Case 1 — VAULT: PE(new idea) < PE(current work) × 1.5
  → raw-thoughts-queue.md with PE score + trigger condition
  → Continue current work
  → No interruption

Case 2 — DEFER-AND-PLAN: PE(new idea) > PE(current work) × 1.5
  → Current work paused at next ZF gate (not mid-implementation)
  → New idea enters Threshold intake (9-step)
  → Topic plan created
  → Resume or pivot based on PE comparison
  
Case 3 — ARCHITECTURAL INTERRUPT: New idea touches L1 sealed elements
  → Immediate stop (even mid-phase)
  → Opus council triggered
  → Governor decision on: ignore | pause | pivot
```

### What the Governor specifically asked
> "How do we optimally route things like a new idea when we have an active implementation
> + pending plans?"

### Proposed Artifact
A new governance document: `docs/plan/pillar-0-governance/intake-interrupt-protocol.md`
- Defines the 3 cases above formally
- Provides the decision tree
- Specifies: when to vault, when to plan, when to interrupt
- Connects to PE formula: interrupt only when `PE(idea) > PE(active) × 1.5`
- The "1.5 completion bias multiplier" from B_COMPLETION_OVER_SHINY already handles Case 1

### Questions for Opus
1. Is the ×1.5 multiplier the right threshold for deferral? Or should it be ×2.0 for implementation interrupts?
2. What is the right ZF gate to pause at? (End of current phase vs end of current session?)
3. How does this compose with the session-state.json blocking_decisions mechanism?
4. Should the Opus council automatically trigger when PE(idea) > 90 even during active build?

### PE Score
PE=76 (Band 2) — high impact on AI behavior; prevents shiny-object drift AND prevents ignoring important ideas

---

## TOPIC 3: Opus Consultation Pipeline Formalization

### The Problem
Currently: Opus is consulted ad-hoc when the Governor decides. There's no mechanical trigger,
no formal consultation format, and no "virtual Opus as auditor" running continuously.

The Governor asked:
> "I want to formalize and enhance this Opus consultation pipeline. It must have core
> principles that are mechanically enforced in the threshold routing."
> "Should we have the Opus virtual part we created active as auditor of any plan and
> any implementation?"

### What Exists
- `tools/council/PROTOCOL.md` — communication protocol (INTENT ABSORBED + Sonnet Report)
- `tools/council/council-state.json` — tracks session state
- Opus Turn format: State at Writing + RZF required
- `tools/council/opus-advisory-arc-S023.md` — enterprise arc with session assignments

### What's Missing
1. **Mechanical consultation triggers** — currently all ad-hoc
2. **"Virtual Opus" role** — a set of Opus-style questions the AI asks itself before any consequential action
3. **Consultation grade system** — not every question needs full Opus council
4. **Audit mode** — Opus reviewing completed plans for architecture violations

### Proposed Consultation Levels

| Level | Name | Trigger | Opus involvement | Response time |
|---|---|---|---|---|
| L0 | Auto-questions | Every consequential decision | None (Sonnet asks itself Opus-style questions) | Same session |
| L1 | Express review | PE > 85 new items; new P-META-* principles | Opus reviews plan only | Next Opus turn |
| L2 | Full advisory | L1 changes; architectural decisions; template Grade A ratification | Opus Turn (full format) | Next Opus session |
| L3 | Council seal | Constitutional changes; new Core Spine category; contradicting sealed principles | Opus + Governor + ZF Level 3 | Multiple sessions |

### The "Virtual Opus" Mechanism
A set of questions (Q-type: B/Z for boundary and completion) that Sonnet asks BEFORE
every consequential implementation, acting AS IF Opus is reviewing:

```
VIRTUAL OPUS AUDIT (fires before any consequential action):
  Q1 [R-type]: What is the blast radius if this is wrong?
  Q2 [Z-type]: What evidence would prove this is correct?
  Q3 [R-type]: Does this contradict any existing L1 sealed element?
  Q4 [B-type]: Am I implementing because I understand deeply, or because it was requested?
  Q5 [G-type]: What gap in my understanding could make this decision wrong?
  IF any answer is "I don't know" → escalate to L1 consultation minimum
```

This is the AI-self-check that makes Opus less necessary for routine work while catching
the cases that genuinely need council.

### Core Principles for Threshold Routing (mechanically enforced)
1. Any new item rated depth-5 OR affecting L1 sealed elements → automatic L2 consultation
2. Any new P-META-* or P-ARCH-* principle → automatic L2 consultation
3. Any template Grade A ratification → automatic L2 consultation
4. Any contradiction with existing B_* contracts → automatic L3 council
5. New Core Spine category → automatic L3 council

### Questions for Opus
1. Is the 5-question Virtual Opus Audit the right set? What would you add?
2. How should the L1 "express review" work mechanically — a comment in opus-turn.md?
3. Should the "sessions_since_opus_review" counter trigger mandatory L2 consultation at 10?
4. How should Opus review completed implementations — audit mode format?
5. What is the boundary between Sonnet judgment and Opus judgment?

### PE Score
PE=88 (Band 1) — affects all future platform work; the consultation pipeline IS how quality compounds

---

## TOPIC 4: When AI Implements Independently vs Consults Opus

### The Core Question
The Governor asked for a consolidated top-expert view on this tension. Currently:
- Sonnet has broad autonomy with behavioral contracts as guardrails
- Opus is consulted session-to-session (every ~10 sessions)
- The Governor decides when Opus is needed
- There is no mechanical rule

### The Two Failure Modes
**Under-consultation:** Sonnet implements consequential things without Opus review.
Risk: accumulated technical debt, architectural drift, contradictions in contracts.
Example: this session's B_BOUNDARY_ALIGNMENT_PROTOCOL was created without Opus review.
Opus's feedback: "direction approved, but 5 refinements needed."

**Over-consultation:** Every decision waits for Opus, paralysis. Cost: 5-10x session overhead.
Not appropriate for routine implementation work.

### The Resolution: Hierarchical Authority Binding
```
GOVERNOR (overrides anything with documented reason)
  ↕
OPUS (architects; does not implement; governs WHETHER and WHAT)
  ↕
SONNET (implements; governs HOW and WHEN within ratified bounds)
  ↕
HAIKU (subagent for mechanical tasks within Sonnet session)
```

**Sonnet implements independently when ALL of:**
- Item is within a ratified plan at current depth level
- No L1 sealed elements affected
- blast_radius ≤ module level (not platform-wide)
- Virtual Opus Audit: all 5 questions answered confidently
- depth_chosen ≤ 4 (depth-5 = always consult Opus for architectural decisions)

**Sonnet consults Opus when ANY of:**
- depth_chosen = 5 (constitutional scope)
- New P-META-* / P-ARCH-* / B_* constitutional principle
- Template Grade A ratification
- Implementation contradicts or extends existing Opus-ratified element
- PE(item) > 85 AND item is not in ratified arc plan
- Virtual Opus Audit: any "I don't know" answer
- Governor says "consult Opus"

### The "Opus as Continuous Auditor" Option
Rather than Opus participating only in Turn sessions, Opus can:
1. Review every closing-summary before it's written
2. Flag plan-level architectural concerns by reading HANDOFF files
3. Provide standing patterns ("here's the template for X kind of decision")

This is only feasible if Opus's overhead is low (reading, not full analysis every session).

### Questions for Opus
1. What is the correct authority boundary between you and Sonnet?
2. Should you review every closing-summary, or only ones that touch architectural concerns?
3. How do you want Sonnet to flag "this might need Opus review" — a special marker in the HANDOFF?
4. What is the minimum information you need to give an express review (L1 consultation)?
5. How should Sonnet represent your perspective in sessions when you're not present?

### PE Score
PE=85 (Band 1) — foundational to how the platform develops; impacts every future session

---

## Sonnet's PE Assessment — What Can Run Without Opus

These items from the above are low-blast-risk and PE-ordered:

| PE | Item | Why safe without Opus | Session |
|---|---|---|---|
| 78 | Budget Planner Layer 4 (GDPR + webhook + tests) | Concrete app work, no governance changes | S025 NOW |
| 72 | Add `template_grade` field to frontmatter-closed-enums.md | Additive field, no breaking change | S025 NOW |
| 68 | Create `Virtual Opus Audit` 5-question block in question-protocol.md | Documentation, no enforcement yet | S025 NOW |
| 65 | Create `intake-interrupt-protocol.md` first draft | Advisory document, no mechanical enforcement | S025 |
| 60 | `sessions_since_opus_review` → auto-consultation at 10 (already tracked) | Minor enhancement to existing session tracking | S025 |

**What NEEDS Opus before implementation:**
- Template ratification grade system (Topic 1): changes template-registry.md + B_TEMPLATE_FIRST_CREATION + all template frontmatter
- Formal Opus consultation pipeline (Topic 3): changes PROTOCOL.md + council-state.json + session-open.sh
- Intake interrupt protocol formal enforcement (Topic 2): changes validate-gradual-bundling.mjs + session-open.sh

---

## The Single Sentence for Opus Turn 9

> "We need Opus architectural guidance on four interconnected questions before implementing:
> (1) a template ratification grade system (Grade A/B/C/D based on L1/L2/L3 layer doctrine —
> sealing a core template requires research + external AI + council; an app-specific template
> requires only Governor confirmation); (2) an intake-interrupt-protocol for routing new ideas
> during active implementations (PE × 1.5 threshold for vault vs plan vs interrupt); (3) a
> formalized Opus consultation pipeline with mechanical triggers (depth-5 → always, L1 change
> → always, PE > 85 new items → express review) plus a Virtual Opus Audit (5 self-check
> questions Sonnet asks before any consequential action); (4) the authority boundary between
> independent Sonnet implementation and required Opus consultation — specifically whether
> Opus should be a continuous auditor of closing-summaries and plans, or session-based only."

---

*Sonnet S025 | 2026-05-12 | Prepared for Opus Turn 9*
*Governor approved: "save these for once the complete plan is over and prepare a detailed file"*
*Status: VAULT — implement only after Opus responds*
