---
id: csps.adr.0006-crisis-escalation-load-bearing
title: ADR-0006 — Crisis escalation as load-bearing for v1
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, persona-authors
tags:
  - domain:ai
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - audience:end-user
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-5-ai-systems/crisis-escalation.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0006 — Crisis escalation: load-bearing for v1

## Context and problem statement

CSPS hosts persona-based AI conversational surfaces. Some apps will deal with end-users in vulnerable states (mental health, crisis, financial distress). Per-persona crisis handling is fragile (each persona author would need to re-implement detection + escalation paths) and inconsistent (subtle differences across personas = liability + user harm). It must be inherited, not reinvented.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Per-persona handling | Maximum customization | Inconsistent; liability; reinvention tax |
| Optional platform middleware | Opt-in | Apps that "don't need it" today will need it later; opt-in is fragile |
| **Always-on platform middleware** for crisis-eligible risk classes | Inherited; consistent; mandatory for liability cover | Forces every persona author to declare risk class upfront |

## Decision outcome

**Chosen:** Always-on platform middleware for personas with `risk_class: CRISIS_ELIGIBLE`. The middleware:
1. Pre-LLM input filter (`libs/crisis/detector.ts`) runs before any LLM call on a CRISIS_ELIGIBLE persona.
2. Output validator (`libs/crisis/output-validator.ts`) runs after every persona response on CRISIS_ELIGIBLE.
3. The persona compose function (`libs/personas/compose.ts`) ALWAYS appends `GUARDRAIL_BUNDLES[persona.riskClass]` (which includes crisis bundles) — not configurable per-persona.
4. `CrisisEvent` row is created per detection; routed via the LearningLoopItem ledger.

**Reasoning:** Crisis is the canonical case where "the platform forbids individual apps from re-implementing." Liability + ethical responsibility + technical reliability all converge on always-on inheritance.

## Consequences

- Every persona declares `risk_class: ROUTINE | SENSITIVE | CRISIS_ELIGIBLE` in its slice frontmatter (closed enum).
- The persona compose function's assembly order is fixed: PLATFORM_CONSTITUTION → DOMAIN_OVERLAYS → traits → renderPersonaBlock → persona.systemPrompt → GUARDRAIL_BUNDLES → postHistoryInstructions. No persona author can omit GUARDRAIL_BUNDLES.
- The crisis slice itself meets all 16 slice contract checks (P-ARCH-014 — load-bearing for v1, mandatory).
- Crisis events flow into LearningLoopItem inbox at `priority_tier: P0` (1h triage SLA).

## Enforcement

- `principles.yaml#P-ARCH-014` (severity: critical; ≥4 enforcers; load-bearing for v1)
- Runtime: `libs/personas/compose.ts` (compose function)
- Runtime: `libs/crisis/detector.ts` (pre-LLM filter)
- Runtime: `libs/crisis/output-validator.ts` (post-LLM filter)
- CI: `tools/audit-runner/slice-score.ts` (crisis slice meets all 16 checks)

## Open questions

- For `ROUTINE` risk-class personas, is the output validator overhead worth it? Tentative: skip validator for ROUTINE; pre-LLM detector is cheap and catches edge cases. Re-evaluate after first 90 days of usage data.

## Sources / references

- [pillar-5/crisis-escalation.md](../plan/pillar-5-ai-systems/crisis-escalation.md) (pending S002 §3.5 migration)
- [pillar-5/persona-composition.md](../plan/pillar-5-ai-systems/persona-composition.md) (pending S002 §3.5 migration)
- [Anthropic safety best practices](https://docs.claude.com/en/docs/safety-best-practices)
