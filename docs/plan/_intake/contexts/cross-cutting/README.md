---
id: csps.intake.contexts.cross-cutting
name: external-input-context-cross-cutting
description: Cross-cutting destination for content spanning ≥3 leaves OR ≥2 pillars. Canonical extraction lives here; leaf folders get 2-line stubs pointing back. The "ripple to all relevant domains" mechanism — content that affects many parts of the schema lives in ONE place but is visible to all its downstream consumers via stubs.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ../README.md }
---

# Context: Cross-Cutting

## What lands here

Content where a single section ripples across:
- ≥3 leaves within ONE pillar (e.g., a meta-principle change touches stewardship + learning-loop + operating-principles)
- OR ≥2 pillars (e.g., a vocabulary-rename insight touches architecture + governance + dx)

The CANONICAL extraction note lives in this folder. Each affected leaf folder gets a 2-line stub pointing back here.

## Routing pattern

```
single section identified as cross-cutting
   │
   ▼
canonical note → cross-cutting/EXT-NNN-X-<slug>.md
   │
   ├──→ stub in leaf-A/EXT-NNN-X-stub.md ("see canonical note: ../../cross-cutting/...")
   ├──→ stub in leaf-B/EXT-NNN-X-stub.md
   └──→ stub in leaf-C/EXT-NNN-X-stub.md
```

This keeps content de-duplicated while preserving each leaf's subscriber visibility (per-leaf domain owners still see the stub when they scan their leaf folder).

## Frontmatter additions for cross-cutting notes

```yaml
fan_out:
  cross_cutting: true
  ripples_to_leaves:
    - <pillar>/<leaf>
    - <pillar>/<leaf>
    - <pillar>/<leaf>
```

The `ripples_to_leaves` list is enumerable; the `cross-cutting/` README aggregates a current view of all active cross-cutting items via filesystem scan (pre-runtime) or LearningLoopItem query (post-runtime).

## SLA tier

**P1 default** — cross-cutting work is load-bearing across multiple domains; same-class as governance + intake.

## Anti-pattern

**Don't auto-default to cross-cutting** when classification is uncertain — that's `raw-uncategorized/`'s job. Cross-cutting is for content where the multi-leaf ripple is identified + intentional, not for "I'm not sure where this goes."
