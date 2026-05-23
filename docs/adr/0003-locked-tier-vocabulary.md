---
id: csps.adr.0003-locked-tier-vocabulary
title: ADR-0003 — Locked tier vocabulary (Free → Pro → Business → Enterprise)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, end-users
tags:
  - domain:architecture
  - type:explanation
  - audience:developer
  - audience:end-user
  - audience:ai-agent
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-1-architecture-and-stack/vocabulary.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0003 — Tier vocabulary

## Context and problem statement

CSPS apps offer tiered functionality. Cross-system convergence on tier names matters because every Stripe Product, every Clerk role, every UI badge uses the same labels. Inconsistent tier vocabulary across apps = customer confusion + ops debt.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Free / Premium / Enterprise (3 tiers) | Simple | Notion / Slack / GitHub already use 4-tier convention; we'd be the outlier |
| Free / Pro / Team / Enterprise (Slack convention) | Familiar | "Team" suggests headcount which doesn't map to all apps |
| **Free / Pro / Business / Enterprise** (Notion + Slack convergence) | Industry-standard; "Business" is product-agnostic | None significant |
| Custom tiers per app | Maximum flexibility | Catastrophic ops + vocabulary debt; same SKU code refers to different things |

## Decision outcome

**Chosen:** Free → Pro → Business → Enterprise. Numeric ranks 0/10/20/30 (gaps allow future intermediate tiers). Identical across every app.

**Reasoning:** Vocabulary friction across AI systems and customer-facing surfaces compounds. Convergence with Notion + Slack maximizes recognition; AI assistants (Cursor, Codex, Claude) already understand these tier names without explanation.

## Consequences

- Every Stripe Product uses these tier names.
- Every Clerk Organization role maps to one of the four.
- The `tier:` frontmatter dimension (per `frontmatter-standard.md`) is closed: `free | pro | business | enterprise | internal`.
- Apps cannot invent tier names; PR fails frontmatter validation if a non-enum tier is used.
- Numeric ranks (0/10/20/30) are used in entitlement checks (`hasFeature(user, 'foo') = user.tier_rank >= feature.min_tier_rank`).

## Enforcement

- `principles.yaml#P-ARCH-019` (glossary owns vocabulary; tier values closed-enum)
- `tools/validators/validate-frontmatter.mjs` (PR-level rejection)
- `eslint-config-csps/forbidden-identifiers.js` (auto-generated from glossary; flags forbidden tier names in code)
- `audit-runner.md#tier-feature-key-reconcile` (Stripe Features ↔ feature_keys reconciliation)

## Open questions

None substantive — locked at S001.

## Sources / references

- [pillar-1/vocabulary.md](../plan/pillar-1-architecture-and-stack/vocabulary.md)
- [Notion pricing](https://www.notion.so/pricing)
- [Slack pricing](https://slack.com/pricing)
