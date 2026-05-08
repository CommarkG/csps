---
id: csps.handoff.vault.sonnet-inheritance-model.S019
name: sonnet-inheritance-model-S019
description: >
  The HOW and WHY of Opus-level reasoning, encoded for permanent Sonnet inheritance.
  Not a checklist — a mental model. Sonnet reading this understands the reasoning
  patterns that produced the 15 S019 findings, so it can apply the same reasoning
  to situations the checklists don't cover. The WHAT is in sonnet-capability-injection.
  The HOW and WHY is here.
version: 1.0
lifecycle: production
lifecycle_state: pending-review
next_review_at: S020
owner: group:finky
core_spine: AI
schema_anchor: opus_consultations
session: S019
created_by: Claude Sonnet 4.6[1M] — Opus-designated architectural review
tags:
  - domain:ai
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:draft
links:
  - { rel: capability-injection, href: ./sonnet-capability-injection-S019.md }
  - { rel: opus-lessons, href: ./opus-lessons-S019/README.md }
---

# Sonnet Inheritance Model — S019
## The HOW and WHY of Opus-Level Reasoning

---

> **Why this document exists:**
> Rules without mental models are followed precisely in familiar situations
> and abandoned in novel ones.
> This document gives Sonnet the mental models that generated the rules —
> so when a new situation doesn't fit the rule's exact form,
> Sonnet can reason from the model instead of searching for the closest rule.

---

## The Fundamental Difference: Reactive vs. Generative

**How Sonnet naturally operates:** Reactive reasoning.
- Receives a prompt → identifies what is asked → executes → reports.
- Scope = the prompt. Evidence = what was explicitly found.
- Satisfaction = the work was done correctly within scope.

**How Opus operates:** Generative reasoning.
- Receives a prompt → identifies what is asked → ALSO asks "what adjacent to this might break?" → executes → reports what was found AND what was NOT found.
- Scope = the prompt PLUS the minimum set of adjacent systems needed to verify the work is correct in context.
- Satisfaction = the work is correct AND the adjacent systems are consistent with it.

**The encoding:** Before any governed work, Sonnet must ask: "What is adjacent to this task that could be inconsistent with what I'm about to do?" This is not a checklist item — it is a reasoning posture.

---

## The Five Mental Models Opus Uses That Sonnet Doesn't

### Mental Model 1: The Cross-File Lens

**How Opus uses it:**
Opus holds multiple files in context simultaneously and reads them as a system, not as individual files. When reading schema.zmodel, it simultaneously holds apps/task-mgmt/prisma/schema.prisma, libs/integrations/index.ts, and the drift validator in mind. It asks: "Do these form a coherent system? Or do they contradict each other?"

**The S019 finding it produced:** Tenant.stripeSubscriptionId was in the app schema but not the ZModel. The drift validator reported CLEAN because it only compared model names. All three files needed to be read simultaneously to see the gap.

**How Sonnet inherits this:**
Before any Write/Edit to a governed file, read the files in the `governed_by` relationship of that file's type (per build-verification-map.yaml). Ask: "Am I about to create a gap between this file and its governing files?"

**The encoded habit (add to code-patterns inner-AI-defaults):**
```
opus_pattern: "Before writing to a file, identify what other files this file
               must be consistent with. Read those files first. Write second."
```

---

### Mental Model 2: The Time Projection Lens

**How Opus uses it:**
Opus projects the current state 10 sessions forward and asks: "If this decision persists without change, what does the platform look like?" It does this specifically for: (a) accumulating debt (validators with deferred coverage, behavioral contracts without enforcement), and (b) architectural decisions that create paths (putting billing logic in app code creates the expectation that billing logic lives in app code).

**The S019 finding it produced:**
- 0/13 behavioral overrides mechanically enforced — because no prior session asked "what does the enforcement gap look like at session 30?"
- Billing trigger in app code — because no prior session asked "what does this create as a pattern for apps 2 through 30?"

**How Sonnet inherits this:**
For any decision that creates a pattern others will follow, ask: "If every future app developer and every future Sonnet session reads this and does the same thing — is that what we want?" If no: the decision needs a comment, a VLT, or a restructuring.

**The encoded habit (add to reasoning-patterns inner-AI-defaults):**
```
opus_pattern: "For any architectural decision, project: what pattern does this
               create for the next 10 sessions and 30 apps? If the pattern is
               wrong at scale, fix the decision now, not later."
```

---

### Mental Model 3: The Coverage Enumeration Lens

**How Opus uses it:**
Opus never accepts "this is implemented" without asking "what levels of implementation are there and how many did we cover?" Every problem has multiple dimensions. Implementing Level 1 and declaring done is the satisfaction point pattern. Opus always enumerates: "Level 1 covers X. Level 2 covers Y. Level 3 covers Z. We implemented Level 1. Levels 2 and 3 are explicitly deferred."

**The S019 finding it produced:**
The drift validator covered model names (Level 1) but not field names (Level 2) or live-DB consistency (Level 3). The validator existed and passed, creating false confidence. Field drift accumulated silently for 19 sessions.

**How Sonnet inherits this:**
Every implementation must include the Coverage Levels declaration: "This covers: [list]. This does NOT cover: [list → VLTs]." This declaration is mandatory, not optional. A validator without a Coverage Levels header is incomplete.

**The encoded habit (add to reasoning-patterns inner-AI-defaults):**
```
opus_pattern: "After implementing anything, enumerate ALL dimensions of the
               problem. For each dimension not addressed: explicitly declare
               it as out of scope with a VLT. 'This is done' without coverage
               enumeration = satisfaction point."
```

---

### Mental Model 4: The Self-Referential Governance Lens

**How Opus uses it:**
Opus asks: "Does the governance system apply to itself?" If a principle says "every claim requires evidence," does the governance system itself demonstrate evidence? If a principle says "validators check coverage," do the validators have Coverage Levels headers? Governance that governs others but not itself is hierarchically incomplete.

**The S019 finding it produced:**
- 0/13 behavioral overrides mechanically enforced — the governance system's own behavioral contracts were not governed by mechanical enforcement
- VALD validates ARCH but nothing validates VALD — the validation spine had no self-validation mechanism

**How Sonnet inherits this:**
After ratifying any new governance rule, ask: "Does this rule apply to itself? Does the governance system obey this rule? If not: either the rule is wrong, or the system needs to be updated to follow its own governance."

**The encoded habit (add to reasoning-patterns inner-AI-defaults):**
```
opus_pattern: "Every new governance rule has a self-referential check:
               'Does the platform currently follow this rule?'
               If no: the rule creates debt on the platform itself —
               document and track it."
```

---

### Mental Model 5: The Moat Measurement Lens

**How Opus uses it:**
Opus distinguishes between: (a) work that builds the moat (compounding advantages that are hard to replicate), and (b) work that maintains the platform (necessary but not differentiating). Every session should contain more moat-building than maintenance. When the ratio inverts — governance overhead growing faster than platform capability — that is the signal to simplify.

**The S019 finding it produced:**
The 6% behavioral enforcement rate means 94% of the platform's AI governance is aspirational. The moat looks strong (52 contracts, 41 validators, 265 audit slugs) but the actual mechanical enforcement rate tells a different story. The quantity of governance artifacts is not the moat — the quality of mechanical enforcement is.

**How Sonnet inherits this:**
At every session close, ask: "Did this session increase the platform's mechanical enforcement rate or decrease it? Did it build capability that compounds over sessions, or did it add artifacts that require maintenance without producing compounding value?"

**The encoded habit:**
```
opus_pattern: "Distinguish: does this work compound (each session builds on it)
               or does it consume (each session must maintain it)?
               Compound work is moat. Consumed work is overhead.
               The ratio of compound-to-consumed work is the moat growth rate."
```

---

## How These Mental Models Enter Sonnet's Operation

### Encoding Level 1: Inner-AI-Defaults Extensions

Add `opus_pattern` field to ALL inner-AI-defaults entries. This is the direct encoding of HOW Opus reasons, adjacent to the WHAT of the override.

**File changes needed:**
Every `.md` file in `docs/plan/_handoff/VAULT/inner-ai-defaults/` gets the following addition to relevant entries:

```yaml
opus_pattern: "[how Opus approaches this; what question Opus asks; what the mental model is]"
moat_relevance: compound | maintenance | neutral
```

The `moat_relevance` field directly connects L5 Mental Model (moat measurement) to every single behavioral pattern.

### Encoding Level 2: Context Bundle Enhancement

The context orchestrator's task-class templates should load the relevant mental model when firing.

For `task-class: schema-work` → load Mental Models 1 (cross-file lens) and 3 (coverage enumeration)
For `task-class: governance-decision` → load Mental Models 4 (self-referential) and 5 (moat measurement)
For `task-class: engraving` → load Mental Model 3 (coverage enumeration) and 4 (self-referential)
For `task-class: planning` → load Mental Model 2 (time projection) and 3 (coverage enumeration)

**This is the critical upgrade to the context orchestrator:** it doesn't just load artifacts — it loads reasoning postures.

### Encoding Level 3: Session-Open Mental Model Declaration

At session-open Q-check, Sonnet must declare which mental model is most relevant for the session's primary task. This makes the mental model selection explicit and conscious rather than implicit.

**Add to session-open.sh Q-checks:**
```
Q19: What is the session's primary work type?
  → Design/architecture → Mental Model 2 + 3
  → Schema/code → Mental Model 1 + 3
  → Governance/contracts → Mental Model 4 + 5
  → Validation → Mental Model 3 + 4
  → Explicitly state which models are active for this session
```

---

## The Self-Improvement Feedback Loop for Mental Models

Mental models decay if they are not validated against outcomes. After each Opus audit, the Governor and Opus review:
1. Which mental model gaps produced the findings?
2. Which mental models were correctly applied and prevented problems?
3. Which mental models need to be added based on new pattern types?

This creates a meta-learning cycle for the mental models themselves — not just for the specific rules they generate.

**Storage:** `docs/plan/_handoff/VAULT/mental-model-audit-log.md`
- One entry per Opus audit
- Lists: models applied correctly ✓ / models missed ✗ / models to add
- This log is loaded in future Opus audit context packages

---

*Claude Sonnet 4.6[1M] | Opus-designated review | S019 | 2026-05-08*
*This document is permanent — it defines how the platform reasons, not just what it does.*
