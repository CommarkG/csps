---
id: csps.governance.ai-default.rigid-rule-anti-pattern
name: rigid-rule-anti-pattern
description: AI default override — when creating governance rules, always include the WHY concept and a Governor-override escape hatch. Rules without WHY become rigid. Rules without escape hatches break at edge cases. This is D10 (over-generalization) prevention.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S016
impl_status: swift-implemented
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/plan/_handoff/VAULT/inner-ai-defaults/reasoning-patterns.md
  - docs/plan/pillar-0-governance/csps-layer-separation.md
---

# Rigid Rule Anti-Pattern

## The Default Being Overridden

**AI training default — rule-writing:** When asked to prevent a behavior, write a blanket rule: "Never do X." Clean, simple, clear. Problem: "Never X" fails when the Governor says "do X." The AI has the rule but lost the concept.

**Instance from S016:** User pointed out AI keeps surfacing app-layer work. AI response: wrote hard NO "Never surface app-layer activities." Rigid. Immediately wrong when Governor says "help me deploy today." The correct rule: "Never PROACTIVELY include app-layer work in AI mandates — but DO execute it fully when Governor directs."

## The Pattern: D10 Over-generalization

D10 is over-generalization from instance to class. The AI observes:
- Instance: "AI proactively added app-layer work to the session mandate"
- Class it inferred: "AI should never do app-layer work"
- Actual class: "AI should not proactively initiate app-layer work without Governor direction"

The difference between the inferred class and the actual class:
- Inferred: ALL app-layer work = bad
- Actual: PROACTIVE (AI-initiated) app-layer work in mandates = bad; REACTIVE (Governor-directed) = fine

## The Three-Part Rule Structure

Every governance rule that restricts AI behavior must have three parts:

**1. CONCEPT:** What principle is being protected?
- Not: "Never surface app-layer work"
- Yes: "Never displace core work with AI-proactive app work (B_COMPLETION_OVER_SHINY + B_PLATFORM_FIRST_OPTIMIZATION)"

**2. SCOPE:** Where exactly does the rule apply?
- Not: "app-layer activities"
- Yes: "AI-proactive inclusion of app-layer activities in session mandates or optimal next steps"

**3. ESCAPE HATCH:** When is the rule suspended?
- Not: (none)
- Yes: "Governor explicitly directs the app-layer activity → execute fully, no friction"

## How to Apply

Before writing any new AGENTS.md hard NO or governance rule:
1. Write the WHY sentence first: "This rule protects [concept] because [mechanism]."
2. Write the SCOPE precisely: what specific behavior is prevented, not the entire activity class.
3. Write the ESCAPE HATCH: "Unless [Governor-override condition] → then [what to do instead]."

If you can't write a clear WHY + SCOPE + ESCAPE HATCH, the rule is not yet understood deeply enough to be engraved. Vault it and return when the concept is clearer.

## Recognition Signals (when a rule is too rigid)

- The rule says "never" without a condition
- The rule names an activity class (app-layer work) rather than an initiation pattern (AI-proactive app work)
- The rule has no Governor-override clause
- Applying the rule literally would produce obviously wrong behavior in normal Governor interactions
- The rule solves the instance but creates new problems at edge cases
