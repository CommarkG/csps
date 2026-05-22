---
id: csps.intake.contexts.trunk
name: external-input-context-trunk
description: Trunk-level destination for content that affects MASTER_PLAN.md or cross-cuts ALL pillars. Reserved for the highest-impact extractions — vocabulary changes, brand decisions, fundamental architecture shifts. Every entry here triggers an ADR.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:planning
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
  - { rel: trunk, href: ../../../../MASTER_PLAN.md }
domain_path: platform
scope_level: S1
---

# Context: Trunk (MASTER_PLAN-level)

## What lands here

Content that affects:
- The trunk index itself (`MASTER_PLAN.md`)
- Brand decisions (e.g., the "CSPS" name, tier vocabulary)
- Pillar architecture (adding/renaming pillars)
- Fundamental cross-pillar conventions (the operating principles, the meta-principles)
- Trunk-level renames (e.g., S001's 8 vocabulary renames)

This is the **highest-impact tier**. Every entry here triggers an ADR.

## What does NOT land here

If the content fits inside ANY pillar (even if it's cross-cutting across leaves WITHIN the pillar), it does NOT go here. It goes to the appropriate pillar/leaf or `cross-cutting/`. Trunk is for trunk-level changes only.

## SLA

**P0 default** (1h triage SLA). Trunk-level changes are foundation-shifts; need fast review.

## Examples of trunk-level extractions

- "We should rename the platform from CSPS to Y" → trunk
- "The tier vocabulary should be 5 tiers, not 4" → trunk
- "Pillar 5 (AI Systems) should split into Pillar 5a (Personas) + 5b (Mastra Runtime)" → trunk
- "The 6 operating principles need a 5th: <X>" → trunk + governance/operating-principles

## Anti-pattern

Routing pillar-level content to trunk inflates the SLA pressure on the wrong items. **Default to the most-specific destination; promote to trunk only when the content provably affects ALL pillars.**
