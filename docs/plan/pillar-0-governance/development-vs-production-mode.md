---
id: csps.pillar-0-governance.development-vs-production-mode
name: development-vs-production-mode
description: >
  The canonical definition of Development Mode vs Production Mode in CSPS.
  Governor directive S019: "I want it to be evident in everything we are doing"
  and "mechanically enforced." These are two fundamentally different operational
  contexts with different optimization targets. Confusion between them = applying
  development-grade token consumption to production-grade service delivery,
  or applying production-grade efficiency constraints to development-grade
  exploration. Both failures are expensive.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
enforcement_stage: active
cdp_status: ratified
core_spine: GVRN
core_spines: [GVRN, AI, OPER, ARCH, VALD]
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - domain:ops
  - domain:ai
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S019
depth_levels:
  l1: "Development Mode = invest tokens for quality. Production Mode = serve users efficiently. Never confuse them."
  l1_tokens: 60
  l2: "Two optimization targets. Two model tiers. Two context strategies. Mechanically separated by platform_mode field."
  l2_tokens: 400
  l3: "See this document for full specification. Enforced by B_DEVELOPMENT_VS_PRODUCTION."
  l3_location: "./development-vs-production-mode.md"
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: contracts, href: ./behavioral-contracts.md }
  - { rel: token-budget, href: ./behavioral-contracts.md }
  - { rel: grace-architecture, href: ../../platform-audit/platform-services/context-orchestrator.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/platform-audit/platform-services/context-orchestrator.md
  - AGENTS.md
domain_path: platform
diataxis_type: explanation
---

# Development Mode vs Production Mode

> **Governor directive S019:** "I don't mind things taking time or consuming tokens in development as long as they are reasonable. Development requires resources, time, and depth. But we should see that we are not letting the severe considerations we are applying in development slip out into the way the platform will be giving services externally."

---

## The Two Modes — Canonical Definitions

### DEVELOPMENT MODE
*Context: Building and evolving the CSPS platform itself — governance, apps, tooling, validators, plans.*

| Dimension | Development Mode |
|---|---|
| **Optimization target** | Quality, correctness, completeness |
| **Token philosophy** | Tokens are INVESTMENT in reasoning quality (P-META-009 CCA) |
| **Model selection** | Sonnet standard; Opus for constitutional/ratification; Haiku for scanning |
| **Context depth** | L3 acceptable; full domain card context; all governance artifacts loaded as needed |
| **ZF discipline** | Full Level 1/2/3 cycles; deep exploration of findings |
| **Exploration** | Allowed and valuable; raw thoughts vaulted, iterated on |
| **Time investment** | Appropriate for quality; no SLA pressure |
| **GEP** | Stage 1→2→3 required before full-scope deployment |
| **SQR** | CHECKPOINT items tracked and acknowledged |
| **Iterations** | Virtues — fast track to stable, scalable results |
| **Failure handling** | Fail at Stage 1 (1-3 cases), fix, retry — cheap |

**The development philosophy:** "Measure twice, cut once." Spend tokens on understanding, ratification, and depth. The cost of getting it right in development is far lower than the cost of getting it wrong in production.

---

### PRODUCTION MODE
*Context: CSPS apps serving external users — tenants of the 30+ SaaS apps.*

| Dimension | Production Mode |
|---|---|
| **Optimization target** | Efficiency, latency, cost-per-request |
| **Token philosophy** | Tokens are operational cost; minimize while maintaining quality |
| **Model selection** | Haiku for classification/routing; Sonnet for standard responses; Opus NEVER in production paths unless explicitly justified |
| **Context depth** | L1 only by default; GRACE Tier 0-2; pre-computed cache used maximally |
| **ZF discipline** | Not applicable — production paths don't run ZF |
| **Exploration** | Not applicable — production paths serve known use cases |
| **Time investment** | SLA-bounded; latency matters |
| **GEP** | Applied at development time before production deployment |
| **SQR** | Not applicable — users don't manage governance SQRs |
| **Iterations** | Deployment strategies (blue/green, canary) — not governance iterations |
| **Failure handling** | Circuit breakers, fallbacks, graceful degradation |

**The production philosophy:** "Serve the user efficiently. Compute cost is per-tenant revenue margin." Every token spent in a production API call reduces margin. The GRACE architecture exists specifically to minimize production token cost.

---

## The Boundary — Where One Ends and the Other Begins

**Development → Production transition occurs when:**
- A feature has passed GEP Stage 1 + Stage 2 validation
- The validator/hook/contract is at `enforcement_stage: active` (not stub/planned/week-4)
- The implementation is behind a stable API consumed by tenant apps
- ZF has been achieved for the deployment unit

**Critical:** The platform's internal governance (behavioral contracts, ZF cycles, AGENTS.md rules) is DEVELOPMENT context. It governs how the platform is BUILT. It does NOT govern how the apps serve users. An app's API routes are PRODUCTION context.

**The confusion failure mode:** Applying GRACE Tier 0-4 architecture thinking to internal AI development sessions. The GRACE architecture was designed for PRODUCTION (serving 30 apps efficiently). In DEVELOPMENT sessions, the priority is depth — use L3, Opus, full ZF, multiple iterations. Don't optimize development sessions for production efficiency.

---

## Mechanical Enforcement

**`platform_mode:` field** — every context-loading template should declare which mode it applies to:

```yaml
platform_mode: development | production
```

- `development`: full governance context loads; Opus available; ZF required; SQR active
- `production`: GRACE Tier 0-2 preferred; Haiku for mechanical; no ZF in request path

**Hard NO (AGENTS.md):** Never apply production-mode efficiency constraints to development sessions. Never apply development-mode depth requirements to production API serving.

**Context orchestrator behavior by mode:**
- `development`: loads governance artifacts, session-state, behavioral contracts
- `production`: loads only the domain-specific context needed for this user request; no governance overhead

**Validator:** `validate-platform-mode-consistency.mjs` (week-4) — checks that:
- Production API routes don't load development governance artifacts
- Development sessions aren't constrained by production SLAs

---

## Why This Matters for External Positioning

When CSPS is marketed and users consume its services, they experience PRODUCTION mode:
- Fast responses (GRACE Tier 0-2, pre-computed)
- Predictable costs (Haiku + cache > Sonnet + cold)
- Stable behavior (no ZF cycles, no SQR checkpoints)

When the platform team builds and governs CSPS, they operate in DEVELOPMENT mode:
- Deep exploration (L3 context, Opus for ratification)
- Full governance (ZF, SQR, GEP, CEC)
- Quality over speed

The platform's competitive advantage is that DEVELOPMENT mode produces exceptionally high-quality governance artifacts, which PRODUCTION mode then serves efficiently. The two modes are complementary — each strengthens the other. Development-grade governance → production-grade reliability.
