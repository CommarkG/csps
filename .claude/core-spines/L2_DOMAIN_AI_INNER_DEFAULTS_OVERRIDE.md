---
id: csps.core-spines.l2-domain-ai-inner-defaults-override
name: L2_DOMAIN_AI_INNER_DEFAULTS_OVERRIDE
description: AI spine domain governing inner-AI-defaults registry + continuous validation as AI evolves. 5 categories (code/prose/reasoning/tooling/output) + continuous-drift-log. Per-session leak detection + per-week drift + per-quarter coverage + per-major-model-update full re-registration. PE_ALIGNMENT_GUARDIAN as anti-sycophancy gate.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
amendment_protocol: normal review (PCR + amendment)
template_used: l2-domain-doctrine
template_status: novel-pending-pattern-evaluation
core_spine: AI
schema_anchor: core_spines_l2_domain
parent_l1_doctrine: ./L1_CORE_AI.md
domain: INNER_DEFAULTS_OVERRIDE
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S006
---

# L2_DOMAIN_AI_INNER_DEFAULTS_OVERRIDE

Operational decomposition of AI spine — the domain governing **inner-AI-defaults registry + continuous validation as AI evolves**.

## What this domain governs

AI training bakes patterns: sycophantic prose / reflexive try-catch / narrative comments / generic naming / finish-fast urge / batch-unrelated-for-speed / premature DONE claims. Most are good for general-purpose work; many drift CSPS toward generic-AI-output rather than CSPS-DNA-aligned-output.

The inner-AI-defaults registry at `_handoff/VAULT/inner-ai-defaults/` makes the drift VISIBLE + MECHANICAL to catch. 5 categories: code / prose / reasoning / tooling / output. Each entry carries disposition (keep / override / adjust) + reason + caught_by_validator.

Continuous validation runs at multiple cadences. Per-session: inner-default-leak-detector at session-close. Per-week: alignment-drift-over-time diffs current session output patterns vs 4-weeks-ago snapshot. Per-quarter: full audit of registry entries vs current AI behavior. Per-major-model-update: mandatory full re-registration sweep.

PE_ALIGNMENT_GUARDIAN is the anti-sycophancy gate within this domain. When human input misaligns with PE current top-priority + does NOT meet ESSENTIAL-bar → AI deflects with structured 3-step (Acknowledge / SWIFT-or-Vault / Anchor focus).

## Operational governance surfaces

- **Inner-AI-defaults registry** (_handoff/VAULT/inner-ai-defaults/ — 5 categories + continuous-drift-log)
- **B_CSPS_ALIGNMENT_OVER_INNER_DEFAULTS** (P-META-017)
- **B_PE_ALIGNMENT_GUARDIAN** (P-META-018; CONSTITUTIONAL anti-sycophancy)
- **Closing-summary §10.0h + §10.0i** (mandatory headers — leak report + alignment-citation)
- **K=2 promotion** (continuous-drift-log entries → category file after 2 occurrences)

## Per-domain validators

- `inner-default-leak-detector` (per-session; chat transcript scan)
- `alignment-citation-on-substantial-output` (per-session; §10.0i citations match)
- `alignment-drift-over-time` (per-week; 4-weeks-ago snapshot diff)
- `pe-alignment-guardian-coverage` (PR; substantial responses cite verdict)

## Composition

Composes with L2_DOMAIN_AI_COGNITIVE_CONTEXT (CCA QGs override training-default of cost-minimization) + L2_DOMAIN_AI_ALIGNMENT_PROTOCOL (alignment includes inner-defaults override compliance) + the GVRN Spine's DECISION_RIGHTS_CLARITY domain (PE_ALIGNMENT_GUARDIAN protects user's stated long-term intent against immediate-request drift).

**Domain signature:** S006-AI-l2-domain-ai-inner-defaults-override-2026-05-04T20:00:00Z
