---
id: csps.handoff.vault.contexts.governance.platform-readiness.EXT-20260511-001-A
name: platform-core-readiness-three-advisor-synthesis
description: >
  Three external AI advisor frameworks for "ready to work" platform core: GPT (12 domains + 4 gates),
  Gemini (10 fundamental problems + ZF discipline + stability + scalability), Claude AI (6 gates +
  stability/scalability properties + What-If battery). Vaulted for CSPS readiness assessment.
  Used to generate preliminary gap assessment (see CSPS-assessment section).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
source: external-ai-advisors (GPT + Gemini + Claude AI)
received_session: S024
core_spine: GVRN
schema_anchor: vault_files
links:
  - { rel: master-plan, href: ../../csps-master-plan-s025-plus.md }
  - { rel: architecture-synthesis, href: ./EXT-20260512-002-A-csps-complete-architecture-synthesis.md }
received_date: 2026-05-11
note: Claude AI section truncated at 50K char limit — What-If battery received partially
domain_path: platform
---

# Platform Core Readiness — Three Advisor Synthesis

## Purpose

GPT, Gemini, and Claude AI advisors provided frameworks for assessing when a platform core
is "ready to work" — i.e., ready to build apps without rebuilding the platform every time.
Vaulted here for ongoing CSPS readiness assessment. Preliminary CSPS gap analysis below.

---

## GPT Framework: 12 Readiness Domains + 4 Gates

### The core definition
> A platform core is ready to start building apps only when it can repeatedly prove:
> "A new app can be created, secured, deployed, observed, billed, evolved, and recovered
> using inherited platform capabilities — without bespoke foundation work, hidden manual
> fixes, or governance exceptions."

### 12 Domains

1. **Product and app-generation readiness** — App #2 from template, inheritance contract, developer path
2. **Multi-tenancy and authorization** — Tenant isolation proven adversarially, RBAC, policy coverage
3. **Authentication, identity, session** — Tenant context in sessions, invitation flows, permission refresh
4. **Billing, entitlement, plan** — Subscription states, feature gates, webhook idempotency
5. **Data model and migration** — Migration dry-run on dirty data, backward compatibility, FK integrity
6. **Validation and quality** — ZF with current evidence, validator scope, false positive control
7. **Observability and operability** — Structured logs with tenant/app IDs, metrics, traces, SLO alerts
8. **Reliability and recovery** — Backup/restore tested, idempotency, queue behavior, degraded mode
9. **Security and supply-chain** — SCA scan, secret hygiene, SBOM/provenance, least privilege CI
10. **Developer experience and self-service** — One-command setup, golden paths, error messages
11. **Governance and AI-collaboration** — AI routing, behavioral contracts, evidence discipline, handoff
12. **Cost and performance** — Latency budgets, cost per tenant, AI token spend, caching

### 4 Cross-Domain Readiness Gates

| Gate | What it validates | Key question |
|---|---|---|
| **Gate 1 — Foundation Ready** | App bootstrap, tenant isolation, auth, schema, ZF, local dev, observability basics | Can App #2 be built without platform rewrites? |
| **Gate 2 — SaaS Ready** | Billing, entitlements, audit trail, production deploy, backup/restore, app observability | Can a tenant subscribe, use, downgrade, and leave safely? |
| **Gate 3 — Foundry Ready** | Repeatable app generation, foundation/app extraction, app graduation, developer self-service | Can App #5 be built faster than App #2? |
| **Gate 4 — Scale Ready** | 10,000 tenant load tests, SLOs, incident drills, supply-chain provenance, governance automation | What fails first at 10,000 tenants? |

### Stability test (simplest)
> Can a new app be built by a non-founder developer, pass validation, deploy, serve tenants,
> recover from failure, and produce audit evidence without changing the platform core?

### Scalability test (simplest)
> Does App #10 cost less to build, validate, secure, and operate than App #2?

---

## Gemini Framework: 10 Fundamental Problems + ZF Discipline

### 10 fundamental problems a platform core must solve
1. Multi-tenancy isolation (Tenant A cannot access Tenant B data)
2. Authentication & identity (user + tenant context reliable)
3. Billing integrity (subscription lifecycle: activate / expire / change)
4. Schema migration safety (live DB changes without breaking policies)
5. Audit trail compliance (what happened, when, by whom)
6. AI code generation quality (mechanical checks for pattern compliance)
7. Context preservation (knowledge survives session changes)
8. Alignment drift protection (AI behavior monitored + corrected)
9. Evidence discipline ZF (proof, not aspiration)
10. Governance enforcement (rules mechanically enforced, not suggestions)

### Validation must be mechanical
- ZF = only valid proof of readiness
- Tiered: Level 1 per-commit / Level 2 per-phase / Level 3 per-session
- Active validators detecting structural failures
- Behavioral Contracts governing AI behavior
- Progressive batches preventing momentum errors

### Stability properties (Gemini)
- 5 Core Spines with precedence (GVRN > VALD > ARCH > AI > OPER)
- Sealed foundations (User, Tenant, AuditEvent — permanent anchors)
- Governance-as-code (rules embedded in construction, not retrofitted)
- Lifecycle sealing (raw → ratified → sealed = stable anchor for downstream)

### Scalability properties (Gemini)
- GRACE Architecture (context efficiency via tiered loading)
- Subagent isolation for heavy tasks
- App slicing + graduation
- Priority Engine (PE) for build order optimization

---

## Claude AI Framework: 6 Gates + Properties + What-If Battery

### 6 Readiness Gates
1. **Foundation Demonstrable in 3 Minutes** — Golden path: new service in <3 min, CI + deploy + catalog
2. **Tenant Isolation Mechanically Tested** — Adversarial tests that ATTEMPT breaches and CONFIRM failure
3. **Self-Service Provisioning at Scale** — Onboard tenant 1 vs 100 in same time budget
4. **Zero-Downtime Deployment Proven** — Schema migration + rolling deploy under active transactions
5. **Observability Tenant-Scoped From Day One** — Per-tenant metrics/logs/traces without cross-contamination
6. **Failure Modes Catalogued and Tested** — Chaos tests for auth outage, DB pool exhaustion, oversized payload

### 8 Stability Properties
1. Bounded blast radius
2. Statelessness at application layer
3. No single points of failure
4. Idempotent operations
5. Graceful degradation paths
6. Explicit failure semantics
7. Reversible changes
8. Observable internals

### 8 Scalability Properties
1. Horizontal scalability
2. Independent component scaling
3. Database growth strategy (sharding path defined before needed)
4. Caching at every appropriate layer
5. Async processing for non-real-time work
6. Streaming and pagination
7. Tenant-aware resource quotas
8. Cost predictability per unit growth

### Tenant Isolation Models (trade-off matrix)
| Model | Isolation | Cost | Complexity | Best for |
|---|---|---|---|---|
| Pool (shared schema + tenant_id) | Application-enforced | Lowest | Lowest | Early stage, many small tenants |
| Bridge (schema per tenant) | Database-enforced | Medium | Medium | Mid-market |
| Silo (DB per tenant) | Infrastructure-enforced | Highest | Highest | Enterprise, regulated |

Mature platforms: HYBRID (pool for entry tier, silo for enterprise tier). Platform core must support all three from day one.

### What-If Battery (partial — message truncated)
Tenant lifecycle: multi-tenant user, tenant merge, tenant split, downgrade with excess data, payment failure grace period, GDPR right-to-be-forgotten while audit logs reference user... [truncated]

---

## CSPS Preliminary Gap Assessment (S024)

| Domain | Status | Evidence |
|---|---|---|
| AI governance (Domain 11) | ✅ EXCEPTIONAL | 74 validators, 20 hooks, B_* contracts, ZF discipline |
| Multi-tenancy isolation (Domain 2) | ✅ STRONG | ZenStack RLS; adversarial tests not confirmed |
| Auth / identity (Domain 3) | ✅ FUNCTIONAL | Clerk; local webhook manual workaround documented |
| Schema / migration (Domain 5) | ✅ STRONG | Foundation slices, validate-foundation-schema-drift.mjs |
| Audit trail (Domain 5) | ✅ AppendOnlyBase | S022 implementation |
| Validation / ZF (Domain 6) | ✅ EXCEPTIONAL | ZF is CSPS core moat |
| App bootstrap — App #2 (Domain 1) | ⚠️ NOT YET | apps/template/ exists; App #2 not built |
| Billing / entitlements (Domain 4) | ❓ UNKNOWN | In scope; status unconfirmed |
| Observability (Domain 7) | ❓ WEAK | No evidence of structured logs/traces/metrics |
| Recovery / backup (Domain 8) | ❓ UNKNOWN | No evidence of DR testing |
| Security supply-chain (Domain 9) | ⚠️ PARTIAL | RLS strong; SCA/SBOM/secret hygiene not confirmed |
| DevEx cold-start (Domain 10) | ❓ UNKNOWN | Not tested |
| Cost per tenant (Domain 12) | ⚠️ PARTIAL | AI token cost tracked; infra cost unclear |
| Load testing (Gate 4) | ❌ NOT DONE | — |

**GPT Gate Assessment:**
- Gate 1 (Foundation Ready): ✅ YES — auth + isolation + schema + ZF + governance
- Gate 2 (SaaS Ready): ⚠️ PARTIAL — billing + observability + recovery unclear
- Gate 3 (Foundry Ready): ❌ NOT YET — App #2 not built
- Gate 4 (Scale Ready): ❌ NOT YET — no load tests

**Strategy ratified S024:** Build App #2 first — directly exercises all 12 domains under real conditions and generates Gate 3 evidence. Building IS the readiness assessment.
