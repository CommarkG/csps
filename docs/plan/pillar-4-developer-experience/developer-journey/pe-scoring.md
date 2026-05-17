---
id: csps.pillar4.developer-journey.pe-scoring
name: developer-journey-pe-scoring
description: "PE scoring for every element of the developer journey. Urgency × impact / SPI. Determines what to build next in the developer experience layer."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
diataxis_type: reference
session: S039
pe_score: 0
links:
  - { rel: parent, href: ./README.md }
  - { rel: pe-agent, href: ../../../../docs/plan/pillar-0-governance/meta-platform/pe-agent.md }
tags:
  - domain:dx
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# PE Scoring — Developer Journey

**PE formula:** `(urgency_weight × impact_weight) / spi_estimate`
- urgency: critical=4, high=3, normal=2, low=1
- impact: platform-wide=4, multi-app=3, single-app=2, cosmetic=1

---

## Journey stage scores

| Stage | Element | Urgency | Impact | SPI | PE | Priority band |
|---|---|---|---|---|---|---|
| 1 | **Developer Threshold** — intent crystallization protocol | critical (4) | platform-wide (4) | 0.15 | **107** | BAND-A |
| 3 | **Scaffolding tooling** — `pnpm create:app` + tooling suite | high (3) | platform-wide (4) | 0.15 | **80** | BAND-A |
| 6 | **Validation protocol docs** — what 127 validators check | normal (2) | platform-wide (4) | 0.10 | **80** | BAND-A |
| 7 | **Deployment guide** — Gate 3, env vars, post-deploy checks | normal (2) | platform-wide (4) | 0.10 | **80** | BAND-A |
| 5 | **Feature development protocol** — PI items, user_journey_test | critical (4) | platform-wide (4) | 0.25 | **64** | BAND-B |
| 1 | **Orientation** — what CSPS is, how to understand it | high (3) | platform-wide (4) | 0.20 | **60** | BAND-B |
| 2 | **Planning Grid** — node types, activation, cross-validation | critical (4) | platform-wide (4) | 0.40 | **40** | BAND-B |
| 4 | **Domain Design** — ZenStack schema, state machines, business logic | high (3) | platform-wide (4) | 0.30 | **40** | BAND-B |
| 8 | **Iteration protocol** — growth, extraction, graduation | low (1) | multi-app (3) | 0.15 | **20** | BAND-D |

---

## What the scores tell us

**BAND-A (PE ≥ 80):** These are the highest-value elements. A developer who doesn't have these is blocked before they start, or makes structural mistakes that cost weeks to fix. Build and ratify these first.

**Threshold (PE=107)** is the highest because without correct intent crystallization, every downstream decision is wrong. The developer who skips this will build the right code for the wrong product. No validator catches this.

**Scaffolding (PE=80)** is high because it converts a 3-day setup into a 15-minute start. The `pnpm create:app` command already exists and is validated. The documentation for how to use it compounds its value.

**Validation + Deployment (PE=80)** are high because they're already built. Documentation of what exists is low-cost, high-return.

**BAND-B (PE 40-79):** High value but more complex. These are where most developer mistakes happen — in the feature development protocol (satisfaction points) and the planning grid (which doesn't exist yet as executable tooling).

**Feature Development Protocol (PE=64)** is where the satisfaction point problem manifests. Every developer who skips the `user_journey_test` field on their PI item ships incomplete features. The protocol exists in documentation (Stage 5 of this mini-tree). It does not yet exist as a validator.

**BAND-D (PE < 25):** Real value, but not urgent. Iteration matters once the app is live. No app is live enough yet to need a formal iteration protocol.

---

## Gaps identified (not yet built, PE-scored)

These are elements of the developer journey that are specified but not yet implemented as tooling:

| Gap | What it prevents | PE | Status |
|---|---|---|---|
| `validate-plan-ratification.mjs` | Implementing from pending plans | 88 | Proposed — needs ratification |
| `user_journey_test` PI field + validator | Satisfaction points at done-declaration | 80 | Proposed — needs ratification |
| Planning Grid as runnable tooling | Pre-code cross-validation | 60 | Proposed — significant SPI (0.80) |
| `validate-form-complete.mjs` | Forms without real submit handlers | 72 | Proposed |
| `validate-email-template.mjs` | Email templates never tested | 65 | Proposed |
| Developer orientation site/page | Onboarding friction for new developers | 48 | Proposed |

All gaps are in PROPOSED status. None can be implemented until the relevant PI item reaches RATIFIED status with Governor explicit ratification.

---

## The PE order for the next session (S040)

Based on the gap analysis and what's already built, the recommended order for next session:

1. **Ratify `validate-plan-ratification.mjs`** — closes the "pending plans blocking code" gap mechanically (PE=88)
2. **Ratify `user_journey_test` PI field** — closes the satisfaction point at done-declaration (PE=80)
3. **Ratify `validate-form-complete.mjs`** — catches the most common UI gap (PE=72)
4. **Ratify `validate-email-template.mjs`** — email completeness is currently unvalidated (PE=65)

Note: "ratify" here means the Governor explicitly reviews the specification (written in this mini-tree) and says "ratified." Only then does Sonnet implement.

This is the protocol working correctly.
