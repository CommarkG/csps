---
id: csps.intake.contexts.raw-uncategorized
name: external-input-context-raw-uncategorized
description: Default destination for content where the AI cannot confidently classify into a specific leaf (confidence < 0.75 on classification). NEVER default-to-discard — default-to-here. Surfaced at every fresh-chat open so the user can resolve.
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
domain_path: platform
---

# Context: Raw / Uncategorized

> **Default-to-here, NEVER default-to-discard.** — P-META-005 design principle 4 (capture in flow)

## What lands here

Content where the AI's classification confidence is < 0.75 — the input clearly contains something useful but the AI cannot determine which leaf it belongs to.

This is NOT the same as `human-review` confidence band (0.75–0.90) — those items have been classified but need human review. Items here have NOT been classified at all.

## What does NOT land here

- Quarantined content (failed prompt-injection scan) → goes to `processed/<EXT-ID>/quarantined.md`, NOT here
- Discarded content (confidence < 0.75 on EXTRACTION, not classification) → logged to extraction-precision metrics, NOT here
- Cross-cutting content → goes to `../cross-cutting/`, NOT here

## SLA + surfacing

- **SLA:** 7 days `pending-review`. Beyond that, escalation.
- **Fresh-chat surfacing:** every fresh-chat open, items here are listed first in `/stewardship-review` output. They cannot be silently ignored across multiple sessions.
- **The user resolves:** during the session, the user looks at the item and either:
  - Tells the AI which leaf it belongs to → AI moves the file to `<pillar>/<leaf>/` and updates routing
  - Marks it deprecated with reason
  - Promotes it to active in raw-uncategorized (long-term parking with explicit reason; rare)

## Anti-pattern this context resists

**Silent-discard** — the dominant KM failure mode. Without this default-destination, low-confidence content gets dropped. By default-routing here + surfacing every session, low-confidence content stays visible until resolved.

## Tier

**P3** (72h triage SLA → 7d before escalation). Low-confidence content shouldn't pre-empt P0/P1 work, but escalation after 7d is non-negotiable.
