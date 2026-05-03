---
id: csps.pillar-6.observability
name: observability
description: Observability strategy stub — OpenTelemetry GenAI semantic conventions + structured logging + tracing. Listed in pillar-6 README "future leaves" section as post-v1. Stubbed in extended-S003 to give the topic a place + stewardship trigger (next_review_at: 2026-12-01) per cardinal directive "nothing stands alone." Full spec authored when first apps ship to paying customers and real production data drives concrete decisions.
version: 0.1
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-protocol
next_review_at: 2026-12-01
tags:
  - domain:ops
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:draft
crosscutting:
  - observability
  - reliability
  - performance
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: build-order, href: ./build-order.md }
  - { rel: dashboards, href: ./dashboards.md }
  - { rel: mastra-setup, href: ../pillar-5-ai-systems/mastra-setup.md }
created-new-because: |
  Listed in pillar-6 README future-leaves section but not created in S003 §3.3 batch.
  Stubbed in extended-S003 to give the topic a place + stewardship trigger per "nothing
  stands alone" cardinal directive. Distinct from dashboards.md (the surface) and
  mastra-setup.md (the runtime that emits OTel spans).
---

# Observability (stub)

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## Status

⚠️ **STUB.** Full specification deferred until first apps ship to paying customers. Real production data should drive concrete decisions on:
- Which OTel GenAI semantic-convention spans matter most
- Per-tenant trace sampling rates
- Cost-tier audit retention windows
- Persona-eval observability surfaces

## What this leaf will lock (when authored)

- OpenTelemetry GenAI semantic conventions adoption (likely pillar-5/mastra-setup integration point)
- Structured logging conventions (JSON; correlation-id propagation; per-tenant scoping)
- Tracing strategy (sampled per tenant; 100% on crisis-event path per [crisis-escalation.md](../pillar-5-ai-systems/crisis-escalation.md))
- Per-app emit-budget enforcement (cost gate)
- Audit dashboard integration ([dashboards.md](./dashboards.md))

## Discovery triggers (when this stub graduates to full leaf)

- First app graduates to paying-customer status → real cost-of-observability data available
- OTel GenAI conventions reach 1.0 stable (currently 0.x as of 2026-01)
- First production incident requiring trace replay → exposes actual instrumentation gaps

## Interim posture (until graduation)

Pre-week-1: no observability instrumentation built.

Weeks 1-12 build: minimum viable observability = audit-trigger writes + Vercel logs + Supabase logs. NOT OTel GenAI yet (defer to post-v1).

Post-v1 first production app: this stub becomes a full leaf authored against real-traffic data.

## Anti-patterns (locked early to prevent rework)

1. Per-app observability stack — refused; one observability surface per pillar-6/dashboards admin singleton
2. Trace sampling > 1% for non-critical paths without ADR — refused (cost driver)
3. Logging PII without redaction — refused (compliance)
4. Audit dashboard reading raw application tables — refused (per dashboards.md `dashboard-direct-table-read` audit)

## Sources

- [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions/tree/main/docs/gen-ai)
- v1.3 §19 (open-frontiers list — observability noted as post-v1)
- [pillar-6/dashboards.md](./dashboards.md) — the dashboard surface that consumes observability data
- [pillar-5/mastra-setup.md](../pillar-5-ai-systems/mastra-setup.md) — the runtime that emits OTel spans
