---
id: csps.vault.research.S068-threshold-scalability-and-depth-levels
name: S068-threshold-scalability-and-depth-levels
description: "S068 research (2 background agents) feeding PART 2 (Threshold) + the depth-level/NodeFile design. (A) Multi-level node activation across platforms — validated in graphics (3D Tiles HLOD) but rare in capability graphs = moat. (B) Overload-survival patterns — load shedding + criticality classes, circuit breakers, bulkheads, rate limiting; central router scales via stateless + tenant-sharding + fast/slow path. Persisted per Planning-Discipline §10 (deferral-must-be-wired); consumed by AMENDMENT E threshold design."
type: vault_files
protection_level: protected
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S068
authored_by: Opus-13 (synthesizing 2 research agents)
date: 2026-05-28
core_spine: ARCH
core_spines: [ARCH, OPER, VALD]
schema_anchor: vault_files
ns_quality: [core-first, self-improving]
ns_path: "this research → ARCH spine → North Star (stable without slowness)"
context_question: "Before designing the threshold or the depth-level mechanism: have these validated external patterns been applied, or are we reinventing?"
inherits_from: "MASTER-RE-GATE-PLAN AMENDMENT E (Threshold-Accuracy Mandate) + CORE-MAXIMAL-DOCTRINE + CIE d_level pattern (cie-state.ts)"
links:
  - { rel: master-plan, href: ../../MASTER-RE-GATE-PLAN-S068.md }
  - { rel: cie, href: ../../../../libs/intelligence/cie-state.ts }
pipeline_wiring: "Consumed by PART 2 (Threshold) design + PART 1 NodeFile depth-level field. Read at PART 2 PROTO authoring. Wired to PE (criticality → priority) + CIE (d_level → activation)."
---

# S068 Research — Threshold Scalability + Node Depth-Levels

> Two background research agents, S068. Persisted per §10 so PART 2 consumes validated patterns, not reinvention.

## Research A — Multi-Level Node Activation

**Finding:** multi-level *consumption* (load only the depth you need) is COMMON as an access technique (GraphQL partial resolution, progressive disclosure, C4 model's 4 zoom levels). But **authored 2-3 depth tiers as a first-class node property, selected by an automated bundling+priority engine, is RARE** — mature only in 3D graphics/geospatial (**Cesium 3D Tiles HLOD**), where a "screen-space-error metric" picks the level per need.

**Models to learn from:** Cesium 3D Tiles HLOD (gold standard — authored multi-depth + runtime selection engine) · GraphQL + DataLoader (demand-shaped partial activation) · C4 Model (4 graduated depths as authoring discipline).

**Verdict:** CSPS "every node has authored depth-levels, PE/CIE selects activation depth" = a validated mechanism (proven in graphics) transplanted to a governance/capability graph = **genuinely uncommon = moat candidate.** Don't start from zero: **generalize the existing CIE `d_level: 1|2|3` ([cie-state.ts:18]) to all NodeFiles**, with PE/CIE as the HLOD-style selection metric.

## Research B — Overload Survival (multi-tenant scale)

**The 4 canonical patterns (production-proven):**
1. **Load shedding + criticality classes** (Google SRE: CRITICAL_PLUS / CRITICAL / SHEDDABLE_PLUS / SHEDDABLE) — under overload, reject lowest-criticality fast (partial service > collapse).
2. **Circuit breaker** (Netflix Hystrix → resilience4j) — trip + fail-fast when a dependency keeps failing; auto-recover.
3. **Bulkhead isolation** (AWS) — partition resources per tenant so one tenant's overload can't sink others.
4. **Token-bucket rate limiting + adaptive client throttling** (Google) — per-tenant quotas; clients self-throttle on observed reject ratio.

**How a central router avoids being a bottleneck:** stateless + horizontally cloned (no master) · **shard by tenant_id** (non-overlapping subsets) · **fast-path** (cheap in-memory classification, common case) split from **slow-path** (expensive deep routing, async queue) · no shared mutable state in the hot path.

**Graceful partial service — who decides:** the request carries its **criticality** (explicit field or derived from tenant tier: paying > logged-in > anonymous > bot); criticality **propagates through the chain**; shed the lowest bucket first. Policy decides, not per-request human judgment.

**Highest-leverage pattern:** *stateless, tenant-sharded, horizontally-replicated routing with criticality stamped on every request at ingress* — removes the bottleneck AND makes graceful shedding a free byproduct.

## Integration → CSPS Threshold (PART 2 design inputs)

The threshold-router MUST be:
1. **Stateless + tenant-sharded** — horizontally cloneable; shard by tenant_id. (Not a single synchronous router — that was the bottleneck risk.)
2. **Criticality as a classifier output** — the 4-axis classifier (spine×scope×intent×mandate) gains a derived **criticality class** stamped at ingress; PE consumes it for priority.
3. **Fast-path / slow-path** — common-case classification in-memory; deep routing async via sharded queue.
4. **Brownout via d_level** — under load, run nodes at D1 (lightweight) only; escalate to D2/D3 when capacity allows. The depth-level mechanism doubles as the graceful-degradation lever.
5. **Circuit breakers + bulkheads** per downstream pipeline + per tenant.

This makes the threshold accurate AND scalable — folds into AMENDMENT E (now accuracy + scalability).

Sources: Google SRE (Handling Overload, Cascading Failures) · Netflix Prioritized Load Shedding · AWS Builders' Library (load shedding, bulkhead) · Cesium 3D Tiles HLOD · SPQR stateless router · GraphQL DataLoader · C4 Model.
