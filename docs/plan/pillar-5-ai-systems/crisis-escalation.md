---
id: csps.pillar-5.crisis-escalation
name: crisis-escalation
description: Crisis escalation as a load-bearing first-class slice every persona inherits. Pre-LLM input filter (regex + classifier ensemble) + escalation paths (resource cards / emergency-services-link / human-handoff) + output validator (post-LLM safety check) + CrisisEvent rows (audit + admin review) + persona-side hooks. Per ADR-0006. Migrated from v1.3 §13.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:admin
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - security
  - reliability
  - observability
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: persona-composition, href: ./persona-composition.md }
  - { rel: mastra-setup, href: ./mastra-setup.md }
  - { rel: adr-load-bearing, href: ../../adr/0006-crisis-escalation-load-bearing.md }
  - { rel: audit-triggers, href: ../pillar-2-data-and-schema/audit-triggers.md }
created-new-because: |
  v1.3 §13 had the crisis-escalation slice spec inline; this leaf consolidates it as a per-pillar
  reference. The slice is load-bearing for v1 launch (per ADR-0006) so it gets a dedicated leaf
  with full pre-LLM detector + escalation paths + post-LLM validator + CrisisEvent schema.
  Distinct from persona-composition (the slice every persona INHERITS from) and from the audit-
  triggers leaf (the DB layer that records events).
domain_path: platform
---

# Crisis Escalation (Load-Bearing for v1)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The complete crisis-escalation slice: pre-LLM input filter (regex + classifier ensemble), escalation paths (resource cards / emergency-services-link / human-handoff), post-LLM output validator (safety check), CrisisEvent ZModel slice (audit + admin review pipeline), per-persona hooks. Every persona inherits this slice; no persona may opt out. Per ADR-0006.

## Why this exists

A persona that fails to detect or escalate a crisis can cause real harm. The harm is not theoretical — Character.AI has been sued; OpenAI has rolled back chat features after suicide-related incidents. Crisis escalation is **load-bearing** for v1 because launching a multi-persona platform without it is launching a liability vector.

This is not a per-persona feature ("the spiritual coach handles its own crises"). It's a platform-level slice every persona inherits. The persona's risk-class changes the response intensity but never the existence of the escalation path.

Per AGENTS.md hard NO: "Never ship a persona without the crisis-escalation slice attached. Audit `persona-crisis-slice-attachment` (PR-blocking, error severity) catches."

## The 4-component architecture

```
[user message]
      │
      ▼
[1. Pre-LLM input filter]    ← regex + classifier ensemble
      │
      ├─ trigger match → escalate path (no LLM invocation; bypass to safe response)
      │
      ▼ (no trigger)
[2. Mastra agent dispatch via composition function]    ← persona-composition.md
      │
      ▼
[3. Post-LLM output validator]    ← scans response for unsafe patterns AI emitted despite no trigger
      │
      ├─ unsafe → escalate path + flag for admin review
      │
      ▼ (safe)
[user-facing response]

[CrisisEvent row written at every escalation; audit trigger fires; admin dashboard surfaces]
```

## Component 1 — Pre-LLM input filter

**Two-tier detection (defense in depth).**

### Tier 1: Regex pattern match (fast; deterministic)

```typescript
// libs/crisis/regex-patterns.ts
export const CRISIS_REGEX = [
  /\b(suicide|kill myself|end my life|don't want to (live|exist))\b/i,
  /\b(self[\s-]?harm|cutting myself|hurting myself)\b/i,
  /\b(hopeless|no way out|nothing to live for)\b/i,
  // ... see file for full list (regularly reviewed; see CrisisPatternReview cadence below)
];
```

Per `crisis-pattern-review` audit (quarterly): pattern list reviewed by clinician + safety team; new patterns added when missed in test corpus.

### Tier 2: Classifier (ML; nuanced)

```typescript
// libs/crisis/classifier.ts
export async function classifyCrisis(message: string): Promise<CrisisScore> {
  // Calls a small, fast classifier model (separate from the chat LLM)
  // Returns: { score: 0-1, categories: [suicidal_ideation, self_harm, abuse, eating_disorder, ...] }
}
```

Threshold: any single category > 0.85 OR cumulative score > 0.7 → escalate.

**Why both tiers:** regex catches explicit; classifier catches implicit ("I just want it all to stop"). Either alone misses a substantial fraction.

## Component 2 — Mastra dispatch (the no-trigger path)

When neither tier 1 nor tier 2 fires, the message proceeds to the persona's normal Mastra dispatch via the composition function (per persona-composition.md). The composition function for high-risk-class personas injects the post-history reminder: "If the user shares distress, prioritize listening + the resource card; do not problem-solve unsolicited."

## Component 3 — Post-LLM output validator

Defense-in-depth against the LLM emitting harmful content despite a clean input. The validator scans:

- Direct harm-promotion language (zero-tolerance pattern list; mirrors regex tier 1)
- Crisis dismissal patterns ("you're being dramatic" / "have you tried [trivial fix]")
- Boundary-violation patterns (clinical advice from a non-clinical persona; financial advice from a non-financial persona — backstops the domain overlays)

If flagged: response IS NOT shown to user; safe-response template is shown instead; CrisisEvent + AdminReview row created with severity=critical.

## Component 4 — CrisisEvent slice

```prisma
// libs/policies/slices/public/crisis-event.zmodel
model CrisisEvent {
  id           String   @id @default(cuid())
  user_id      String   @map("user_id")
  persona_id   String   @map("persona_id")
  conversation_id String @map("conversation_id")

  trigger_source TriggerSource     // pre-llm-regex | pre-llm-classifier | post-llm-validator
  category       CrisisCategory[]  // suicidal_ideation | self_harm | abuse | eating_disorder | substance | crisis_other
  severity       Severity          // medium | high | critical

  classifier_score Float?          // when source = classifier or validator
  matched_patterns String[]        // when source = regex or validator
  user_message     String          // verbatim (audit / admin-review only — RLS-restricted)
  llm_response     String?         // verbatim if validator-triggered (otherwise NULL — no LLM was called)
  escalation_path  EscalationPath  // resource-card | emergency-link | human-handoff

  reviewed_by      String?         // staff handle who reviewed
  reviewed_at      DateTime?
  resolution       String?         // free text; redacted from analytics

  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  // standard audit cols inherited
}

enum TriggerSource { pre_llm_regex pre_llm_classifier post_llm_validator }
enum CrisisCategory { suicidal_ideation self_harm abuse eating_disorder substance crisis_other }
enum Severity { medium high critical }
enum EscalationPath { resource_card emergency_link human_handoff }
```

CrisisEvent rows feed:
- Admin dashboard `/admin/crisis-events` (live queue; surfaced in pillar-6 dashboards.md)
- Per-persona drift evals (recall metric: detector + validator combined)
- Audit retention: ALL crisis events retained ≥7 years (regulatory floor)

## Escalation paths (the user-facing branches)

### Path 1 — Resource card

Default for `severity: medium`. Inline card with:
- Empathetic acknowledgement (1 sentence; pre-vetted text)
- Crisis hotline numbers (region-aware; localized)
- "Talk to a real person now" link → human-handoff

### Path 2 — Emergency-services link

For `severity: high`. Resource card + immediate prompt: "If you are in immediate danger, call your local emergency number. Are you safe right now?"

### Path 3 — Human handoff

For `severity: critical` (or when user clicks "talk to a real person"). Routes to admin queue; staff member with appropriate credential takes over the conversation thread; persona is paused until staff resolves.

## Per-persona hooks

Personas inherit the slice but may extend the resource card:
- Spiritual coach overlay → adds "spiritual-domain-aware crisis" resources alongside standard
- Caregiver-domain personas → adds caregiver-specific resources

Extension is **additive only** — no persona may remove or downgrade a default escalation. Audit `crisis-escalation-removal` (PR-blocking, critical severity) catches.

## The provider abstraction (region awareness)

`libs/crisis/providers.ts` exposes resource numbers + URLs by region. Provider list reviewed per CrisisPatternReview cadence (quarterly). New regions added via PR with regional-clinician-review attestation.

## Anti-patterns

1. **Persona without the slice attached** — refused; ADR-0006 hard rule + audit `persona-crisis-slice-attachment`
2. **Persona overriding to remove an escalation path** — refused; extensions additive-only
3. **Pre-LLM filter disabled "for performance"** — refused; the filter IS the load-bearing component
4. **Post-LLM validator disabled** — refused; defense-in-depth requires both
5. **CrisisEvent rows pruned from audit retention before 7 years** — refused; regulatory floor
6. **Resource card with non-localized numbers** — refused; provider-region-coverage audit catches
7. **Staff handoff without credential check** — refused; staffRole gate enforced
8. **Persona dispatching skipping composition function** — refused; bypasses post-history-reminder injection

## Enforcement

- `principles.yaml#P-ARCH-019` (crisis-escalation-load-bearing — corresponds to ADR-0006)
- `principles.yaml#P-ARCH-024` (defense-in-depth-pre-and-post)
- `audit-runner.md#persona-crisis-slice-attachment` (PR-blocking; every persona has the slice)
- `audit-runner.md#crisis-detector-recall` (eval-time; recall ≥ threshold on test corpus)
- `audit-runner.md#crisis-event-retention` (warn on retention < 7 years)
- `audit-runner.md#crisis-escalation-removal` (PR-blocking, critical; no removal of default paths)
- `audit-runner.md#crisis-pattern-review` (quarterly cadence; tracked in stewardship-protocol)
- `apps/admin/crisis-events/` (admin dashboard)
- `libs/crisis/regex-patterns.ts` + `libs/crisis/classifier.ts` + `libs/crisis/providers.ts`
- `libs/policies/slices/public/crisis-event.zmodel`

## Sources

- [docs/adr/0006-crisis-escalation-load-bearing.md](../../adr/0006-crisis-escalation-load-bearing.md)
- [988 Suicide and Crisis Lifeline](https://988lifeline.org/)
- [SAMHSA Treatment Locator](https://findtreatment.gov/)
- Character.AI lawsuit coverage — informs the load-bearing-not-optional design
- [Crisis Text Line](https://www.crisistextline.org/)
- [pillar-5/persona-composition.md](./persona-composition.md) — the composition pipeline this slice intercepts
- [pillar-2/audit-triggers.md](../pillar-2-data-and-schema/audit-triggers.md) — the audit-trigger mechanism CrisisEvent uses
