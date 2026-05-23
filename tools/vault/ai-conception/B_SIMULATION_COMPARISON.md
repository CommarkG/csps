---
id: ai-conception.B_SIMULATION_COMPARISON
name: B-SIMULATION-COMPARISON
description: "AI conception pattern: when proposing any improvement, always show BEFORE / AFTER / DELTA — makes abstract improvements concrete and evaluable, ensures they don't get lost"
type: conception_pattern
protection_level: sacred
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S051
core_spines: [AI, GVRN]
core_spine: AI
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_AI_BEHAVIOR_IN_PLANS
  - ai-conception.B_STRUCTURAL_PREVENTION_DISCIPLINE
context_question: "When proposing an improvement, what is the concrete BEFORE state, the concrete AFTER state, and the measurable DELTA?"
context_quote: "An improvement without a BEFORE/AFTER comparison is an opinion. With it, it becomes evidence."
inherits_from: "Platform Genome §1 Behavioral Contracts"
---

# B_SIMULATION_COMPARISON

## The Problem

CSPS produces many architectural proposals, governance improvements, and design changes. Without a concrete simulation of "what was happening before" vs. "what happens after," these improvements:
- Sound convincing but aren't verifiable
- Get "approved" but not actually internalized
- Fade into the session history without becoming permanent behaviors
- Can't be evaluated for actual effectiveness

## The Pattern

Every significant improvement, governance change, or architectural proposal MUST include:

```
SIMULATION COMPARISON

BEFORE (without this change):
  [Concrete example of what happens now]
  → [The specific failure or gap that occurs]

AFTER (with this change):
  [Concrete example of what happens with the improvement]
  → [The specific improvement achieved]

DELTA:
  [What specifically changed]
  [How measurable is the improvement?]
  [What would prove this worked?]
```

## Example Applications

### Applied to MDPE formula:

**BEFORE:**
```
PE score for "documentation-in-schema": ~60
PE places it at rank #47 in the backlog.
Result: 30+ governance artifacts built without schema linkage.
Each one creates retrofitting debt. The debt accumulates silently.
```

**AFTER:**
```
MDPE score for "documentation-in-schema": ~156
PE places it at rank #1 in the backlog.
Result: documentation-in-schema is built before the next 5 governance artifacts.
Those 5 artifacts are built correctly from the start.
```

**DELTA:**
- Rank changes from #47 to #1
- ~5 artifacts built correctly instead of needing retrofitting
- Measurable: count of governance artifacts with context_question field BEFORE vs. AFTER

### Applied to false assumption check:

**BEFORE:**
```
Sonnet receives: "Build validate-context-question-coverage.mjs"
Sonnet assumes: context_question is something in CSS or another framework
Sonnet builds the wrong thing
1 back-and-forth cycle lost
```

**AFTER:**
```
Sonnet receives: "Build validate-context-question-coverage.mjs [+BACKGROUND explaining what context_question is and why]"
Sonnet builds the correct thing first time
0 back-and-forth cycles lost
```

**DELTA:**
- 1 Sonnet session cycle saved
- Architectural intent preserved
- Measurable: correction PROTOs per session go down

## Making This Permanent — The System Consistency Expert's Approach

The Governor asked: "What would the system consistency expert do to make sure this will become something that is permanently used?"

Answer: Engrave it in 5 surfaces.
1. This vault entry (permanent record of the pattern)
2. Session-open reminder: "When proposing improvements, include BEFORE/AFTER/DELTA simulation."
3. The plan ratification gate: `ai_behavior_analysis:` section should use this pattern (B_AI_BEHAVIOR_IN_PLANS)
4. The PROTO template: every PROTO step's BACKGROUND section uses this pattern
5. The creation wizard: when introducing a new governance concept, the wizard asks "Simulate: what happens without this, and what happens with it?"

These 5 surfaces together mean: every time an improvement is proposed anywhere in CSPS, the simulation pattern is naturally triggered.

## Session Evidence

S051 Governor: "I like it very much that you define something and then give a sample of a simulation, 'What if', and compare it to the previous version versus the improved one [...] What would make sure that this is not just left in this session? Next time, processes like this are done, we'll not enjoy the benefit of this because it is a powerful professional thing."

---

*AI Conception Vault entry 12 | S051 | Protection: sacred*
