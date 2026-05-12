---
id: csps.pillar-0-governance.csps-core-manifest
name: csps-core-manifest
description: The CSPS CORE manifest. Declares the 5 Core Spines (GVRN/ARCH/AI/OPER/VALD) + per-spine universal undebatable fundamentals + outward-layering discipline + pillar↔spine mapping. CORE is what cannot be changed without re-grounding the entire platform; everything else extends outward from CORE with increasing specificity. Generalizes P-ARCH-013 (universal-traits-at-trunk-domain-overlays) from persona system-prompts to ALL platform topics. Adopts CSP architectural pattern + adapts spine names to CSPS specifics. Engraved S006 turn 7 per user directive "the Core is the universal fundamental undebatable things of each core spine".
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: pillar-leaf-architectural-manifest
template_status: novel-pending-pattern-evaluation
core_spines: [GVRN, ARCH, AI, OPER, VALD]
tags:
  - domain:governance
  - domain:architecture
  - type:reference
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:draft
crosscutting:
  - reliability
  - observability
  - security
diataxis_type: explanation
session: S006
links:
  - { rel: parent, href: ./README.md }
  - { rel: governs, href: ./behavioral-contracts.md }
  - { rel: composes-with, href: ./csps-build-dna.md }
  - { rel: generalizes, href: ./architecture-principles.md#L249 }
  - { rel: schema, href: ../../../packages/principles/principles.yaml }
  - { rel: pe-source, href: ../_handoff/VAULT/topic-plans/s006-governance-foundation.md }
domain_path: platform
---

# CSPS CORE Manifest

> **Context is the palace, Alignment is the King, and Timing is the Queen.** *(Adopted from CSP CC-034.)*
>
> CSPS CORE is the universal fundamental undebatable bedrock of the platform. Everything else extends outward from CORE with increasing specificity. The platform's DNA stays consistent no matter how far a slice travels from CORE because every layer enforces the layer beneath it.

## What this manifest locks

The CSPS CORE consists of **5 Core Spines**. Each spine has:
- A **CORE** (universal undebatable fundamentals — *what cannot change without re-grounding the entire platform*)
- **Outward layers** that progressively specialize toward concrete instances
- **DNA-consistency enforcement** at every layer transition (validators + audits + AI behavior)

The 5 Core Spines are **CONSTITUTIONAL** — they are L0 peers; none is a child of another. They compose orthogonally to the 7 Pillars (which are domain-organized for navigation). Every persisted CSPS artifact maps to ≥1 Core Spine via `core_spines:` frontmatter.

## Precedence ordering (S006 turn 9 — adopted from CSP precedent)

```
GVRN > VALD > ARCH > AI > OPER
```

**The lower-defers-to-higher rule:** when an artifact tagged with multiple spines has cross-cutting governance disputes, the higher-precedence spine adjudicates. Per CSP CSP_CORE.md DO-1 (adopted): *"When two spines conflict, lower precedence defers."*

| Precedence reasoning | Why |
|---|---|
| **GVRN beats VALD** | Governor (user) has sovereign override authority via documented reason; PE Rule 3 — sequence-vs-whether distinction |
| **VALD beats ARCH** | Broken validation = structure cannot be trusted regardless of architectural preference |
| **ARCH beats AI** | AI agents BUILD ON architecture; agents must not violate slice contracts; CCA QGs do not override slice integrity |
| **AI beats OPER** | AI design (CCA Quality Gates / AAP / inner-defaults override) takes precedence over operational pace |
| **OPER is most adaptive** | Operations must flex to honor everything above; workflow adapts to architecture, not the other way around |

**Mechanical enforcement:** `spine-precedence-conflict-detector` validator (registered atomically per FSE; impl deferred week-4) — scans for artifacts declaring multiple `governed_by:` references and flags YELLOW finding when lower-precedence overrides higher.

**Deferred decision (S006 element-review queued):** CSP precedent splits Constitutional (CNST) from Governance (GVRN); CSPS currently treats CNST as embedded INSIDE GVRN's CORE. Whether to split GVRN → CNST + GVRN (= 6 spines) is documented in [element-reviews/csps-core-spines-S006.md](../_handoff/VAULT/element-reviews/csps-core-spines-S006.md) for future ADR decision. Deferred per P-META-016 (foundation stability before amendment) — just engraved 5 spines in L1; changing cardinality immediately violates gradual-build discipline.

## 3-Layer doctrine model (S006 turn 9 — adopted from CSP S331 Bundle 1 Scope A)

This manifest IS L0 (the root doctrine; analog to CSP's CSP_CORE.md). Each Core Spine then decomposes into 3 layers per CSP precedent:

| Layer | Files | Purpose | Amendment protocol |
|---|---|---|---|
| **L0 (THIS file)** | csps-core-manifest.md | Root doctrine — children = [GVRN, ARCH, AI, OPER, VALD]; precedence ordering; cross-cutting principles | ADR + ratification (CONSTITUTIONAL change) |
| **L1 sealed core** | `.claude/core-spines/L1_CORE_<SPINE>.md` (5 files) | Permanent essence of each spine — pure prose; no examples; no cross-references; no decomposition | ADR + ratification ("CC-equivalent" — sealed text changes require ratification) |
| **L2 domain decomposition** | `.claude/core-spines/L2_DOMAIN_<SPINE>_<DOMAIN>.md` (~16 files; 3-4 per spine) | How each spine breaks into governable domains — operationally concrete | Normal review (PCR + amendment) |
| **L3 instance registry** | `.claude/core-spines/L3_INSTANCES_<SPINE>.md` (5 files) | Which actual artifacts CURRENTLY instantiate the spine — populated per-session | Per-session edit (no formal amendment) |

**Why 3 layers** (per CSP §3.2): single-layer monolithic spine docs conflate "what permanently means" + "how decomposes" + "what currently instantiates." Conflating these makes amendment risky (touch one paragraph, accidentally amend constitutional text), instance lists go stale, and cross-spine consistency becomes impossible.

**Sealed L1 discipline (`do_not_expand` list):** every L1_CORE_*.md file declares an explicit `do_not_expand:` list:
- "No examples in this file"
- "No cross-references to other artifacts in this file"
- "No domain decomposition (L2 owns that)"

Validator: `L1_DO_NOT_EXPAND_VIOLATION` (registered atomic; impl deferred) — scans L1 files for example blocks, cross-reference patterns, decomposition headers; flags violations.

**Sequencing:** L1 files authored as part of S006 governance-foundation L2 (Foundation composition). L2 domain files authored in L3 (Core). L3 instance registries auto-populated via `instance-registry-populator.mjs` in L4 (Integration).

## Frontmatter convention (S006 turn 9 — adopted from CSP)

Every governed artifact declares:

```yaml
core_spine: <SPINE>          # singular primary owner — REQUIRED
core_spines: [<SPINE>, ...]  # plural cross-cutting list — optional
schema_anchor: <table-id>    # which schema governs this artifact — REQUIRED
```

**Routing certainty:** when an artifact needs adjudication, ONE spine owns the decision (`core_spine:`); cross-cutting spines (`core_spines:` plural) are interested parties.

**Validators (registered atomically per FSE; impl L4):**
- `nothing_stands_alone_audit` — RED on `ORPHAN_NO_CORE_SPINE` (singular missing) OR `ORPHAN_NO_SCHEMA_ANCHOR` (schema missing)
- `corespine_layer_compliance` — checks `core_spine:` value ∈ {GVRN, ARCH, AI, OPER, VALD} canonical set + L1_CORE_<X>.md exists

**Backward compat:** existing CSPS artifacts with only `core_spines:` plural are grandfathered until L4 sweep adds `core_spine:` singular per artifact (opportunistic backfill discipline per P-META-001).

---

## The 5 CSPS Core Spines

### Spine 1 — GVRN (Governance)

**CORE (universal undebatable):**
- Principles registry is the source of truth ([principles.yaml](../../../packages/principles/principles.yaml))
- 5/5 Surface Engraving for any new discipline (memory + contract + AGENTS NO + spine row + audit)
- Atomic validator-surface registration (per FSE amendment S005 turn 18 — registration mandatory atomic; implementation may defer)
- Zero-Findings cycle before any RATIFIED/CLOSED/DONE claim
- Mutual Understanding Validation closes every I→I communication boundary
- AI prompts and outputs are governance-tracked (Governor Prompts)
- Handoff Pre-Flight Audit before every handoff write
- Cognitive Context Architecture's 4 Quality Gates (immutable)

**Outward layers:**
- L1 Per-pillar AI-behavior rules (AGENTS.md cascade)
- L2 Per-skill AAP frontmatter (Class A/B/C/D)
- L3 Per-persona system-prompt assembly overlays
- L4 Per-app governance overlays (custom AI behavior per SaaS app)
- L5 Per-customer-tier governance gating (enterprise vs starter)

**Audits enforcing CORE outward:** ~50+ across 9 audit-hub pipelines

---

### Spine 2 — ARCH (Architecture)

**CORE (universal undebatable):**
- Slice contract: every feature is a slice with isolated boundary + 90% scorecard + audit-event emission
- ZModel as the schema source of truth + multi-schema preview-feature (schema-per-app boundaries)
- Postgres RLS + tenant_id ubiquity at every row + audit-trigger DDL on every table
- Monorepo with workspace packages + Nx generators + Hygen templates (no bespoke `page.tsx`)
- Template-first creation (every persisted artifact + every output passes through template gate)
- Universal-required core frontmatter + per-file-type extensions (per ADR-0023)
- Customer kit primitives are the only React surface (`<EntityList>`, `<EntityForm>`, etc.)

**Outward layers:**
- L1 Per-pillar slice patterns (data slice / service slice / AI slice / UI slice shapes)
- L2 Per-app schema-per-app boundaries (Booking app's Customer ≠ CRM app's Customer)
- L3 Per-feature template selection (which of 22 UI templates / which slice variant)
- L4 Per-customer-tier feature gates (Stripe Entitlements wired)
- L5 Per-tenant configuration overlays (within feature gates)

**Audits enforcing CORE outward:** slice-scorecard / template-citation-on-creation / universal-required-frontmatter / schema-per-app / no-restricted-imports / generator-only-page-creation / Storybook+Chromatic / etc.

---

### Spine 3 — AI (AI Systems)

**CORE (universal undebatable):**
- Mastra `BaseAgent` is the only agent runtime; no custom orchestrators
- AAP (Agent Alignment Protocol) — every agent passes 9-check alignment before invocation
- CCA (Cognitive Context Architecture) — 5-layer model + 4 Quality Gates immutable
- Skill-eval-Worker (Cloudflare) for every skill before promotion
- Persona system-prompt assembly: PLATFORM_CONSTITUTION → DOMAIN_OVERLAYS → traits → renderPersonaBlock (per P-ARCH-013)
- CSPS-Alignment-Over-Inner-Defaults — every AI output gated by inner-defaults registry (training defaults overridden where they conflict with CSPS)
- PE_ALIGNMENT_GUARDIAN — AI confronts humans on PE-misaligned requests with structured deflection (anti-sycophancy)
- Mutual Understanding Validation at every AI-to-AI / AI-to-human boundary

**Outward layers:**
- L1 Per-domain agents (Booking agent / CRM agent / Marketing agent)
- L2 Per-customer personas (with domain overlays applied)
- L3 Per-feature skills (booking-confirmation skill / CRM-followup skill)
- L4 Per-app AI surfaces (chat shell / wizard / inline assistant)
- L5 Per-tenant agent configuration (which persona, which skills enabled)

**Audits enforcing CORE outward:** aap_frontmatter_coverage / agent-alignment-coverage / subagent-spawn-preamble-required / cognitive-context-discipline-coverage / inner-default-leak-detector / pe-alignment-guardian-coverage / etc.

---

### Spine 4 — OPER (Operations)

**CORE (universal undebatable):**
- Build-order discipline (week-1 → week-12; foundation first; no skipping)
- Vercel + Cloudflare hybrid deployment per [ADR-0024](../../adr/0024-deployment-platform-vercel-cloudflare-hybrid.md) (Vercel for Next.js apps; Cloudflare for Workers)
- Observability via audit-event emission on every state change + structured log correlation
- Dependency management via pnpm + frozen-lockfile + `pnpm verify` orchestrator
- Drift detection (continuous: alignment-drift-over-time + handoff-pre-flight-audit + Stewardship Protocol)
- Governor Prompts logged for every session
- Handoff Pre-Flight Audit before every handoff write
- Gradual-Build-by-Foundations (depth 3/4/5; ZF gate per level; priority engine sequencing)

**Outward layers:**
- L1 Per-app CI/CD pipeline (lint + test + slice-scorecard + Storybook+Chromatic)
- L2 Per-deploy environment (preview / staging / production)
- L3 Per-week build-order phase (week-2 foundation slices / week-3 generators / week-4 audit-runner ship)
- L4 Per-session handoff (HPFA + governor-prompts log + chat-jump-prompt + receipt signature)
- L5 Per-customer-tier SLA (uptime / response-time / support tier)

**Audits enforcing CORE outward:** build-order-week-respected / pre-close-cycle-coverage / handoff-pre-flight-coverage / governor-prompt-distribution-complete / pipeline-coverage / etc.

---

### Spine 5 — VALD (Validation)

**CORE (universal undebatable):**
- Zero-Findings discipline — re-run IS the proof; memory of earlier runs ≠ validation
- audit-runner.md as the audit source of truth (~129+ audits across 9 pipelines)
- `pnpm verify` orchestrator at every closing-summary §10.0 (mandatory gate before any §10.10 RZF)
- Frontmatter validators (universal-required + per-file-type extensions)
- RZF (Re-Zero Findings) cycle — applied to RZF process itself; meta-RZF
- CEC (Complete Extraction Cycle) — ratification triggers cycle until 0 new opportunities
- HPFA (Handoff Pre-Flight Audit) — 7-check whole-session walk
- Validate-before-assume — every state-claim cites a tool call IN THIS RESPONSE

**Outward layers:**
- L1 Per-pillar validators (governance validators / data validators / AI validators)
- L2 Per-artifact-type schema enforcement (B_* contract structure / ADR MADR / SKILL.md AAP)
- L3 Per-session verify gate (every closing summary §10.0 runs `pnpm verify`)
- L4 Per-deploy CI gate (every PR runs full audit-runner)
- L5 Per-runtime drift detection (alignment-drift-over-time per quarter; full re-registration per major model update)

**Audits enforcing CORE outward:** principles_validate / frontmatter_validate / aap_frontmatter_coverage / principle_count_staleness / pre-close-cycle-coverage / nominal-rzf-detection / cross-ref-resolution / enforcer-orphans / audit-of-audits / etc.

---

## Pillar ↔ Core Spine mapping (orthogonal)

Pillars are **domain-organized** for human navigation. Core Spines are **responsibility-organized** for DNA-consistency enforcement. Every pillar leaf maps to ≥1 spine via `core_spines:` frontmatter.

| Pillar | Primary spine | Secondary spines |
|---|---|---|
| [pillar-0-governance](../README.md) | GVRN | VALD |
| [pillar-1-architecture-and-stack](../../pillar-1-architecture-and-stack/README.md) | ARCH | GVRN |
| [pillar-2-data-and-schema](../../pillar-2-data-and-schema/README.md) | ARCH (data subspine) | GVRN, VALD |
| [pillar-3-platform-services](../../pillar-3-platform-services/README.md) | ARCH (services subspine) | OPER |
| [pillar-4-developer-experience](../../pillar-4-developer-experience/README.md) | OPER | GVRN, VALD |
| [pillar-5-ai-systems](../../pillar-5-ai-systems/README.md) | AI | GVRN, OPER |
| [pillar-6-operations-and-delivery](../../pillar-6-operations-and-delivery/README.md) | OPER | VALD, GVRN |

---

## Outward-layering discipline (the universal pattern)

Every Core Spine follows the same outward-layering pattern:

```
CORE (universal undebatable)
  ↓ enforced via principle + contract + audit
L1 (slightly more specific — per-pillar / per-class)
  ↓ enforced via principle + audit
L2 (more specific — per-app / per-domain)
  ↓ enforced via audit + lint
L3 (more specific — per-feature / per-customer-tier)
  ↓ enforced via lint + CI gate
L4 (specific — per-instance / per-deployment)
  ↓ enforced via runtime check
L5 (most specific — per-tenant / per-runtime configuration)
  ↓ enforced via runtime drift detection
```

**DNA consistency mechanism:** every layer must cite the layer beneath it (template-first discipline). Going outward NEVER amends inward. To change CORE, the entire platform re-grounds — that's why CORE is undebatable. Outward layers are debatable + amendable freely as long as they don't violate inward layers.

**Backward propagation (rare):** if an outward layer reveals that CORE is wrong, this triggers a **CORE re-grounding event** — full platform amendment with ADR + 5/5 engraving + multi-session arc. Per CSP precedent, this happens 1-2x per platform-year.

---

## Composition with existing CSPS principles

This manifest **generalizes** [P-ARCH-013](./architecture-principles.md#L249) (universal-traits-at-trunk-domain-overlays) from persona system-prompt assembly to ALL platform topics. P-ARCH-013 stays as the persona-prompt-specific instance; this manifest is the meta-pattern.

**Composes with:**

| Principle / Contract | How |
|---|---|
| [P-OP-001 reuse-first](./operating-principles.md) | Outward layers MUST reuse-first from inward layers; "find what exists at L<N-1> before creating at L<N>" |
| [P-META-007 FSE](./five-surface-engraving.md) | 5-Surface Engraving applied to a topic IS that topic's CORE→L1 transition (5 surfaces = 5 enforcement layers) |
| [P-META-008 cycle-mandatory-in-plan](./mechanical-enforcement.md) | Every layer transition (L→L+1) requires ZF cycle on layer L before layer L+1 starts |
| [P-META-014 MUV](./mutual-understanding-validation.md) | Every layer-transition is a communication boundary; MUV closes the I→I loop between layers |
| [P-META-009 CCA](./cognitive-context-architecture.md) | 5-layer cognitive architecture is the AI side of the same outward-layering pattern |

---

## Mechanical enforcement (audits + validators)

| Audit slug | What it catches | Layer enforcement |
|---|---|---|
| `core-spine-citation-on-artifact` | Persisted artifact missing `core_spines:` frontmatter | CORE→L1 |
| `outward-layer-not-citing-inward` | Layer N artifact violates Layer N-1 (template-first violation) | L<N> validation |
| `core-amendment-without-adr` | CORE-level change without re-grounding ADR | CORE governance |
| `pillar-spine-mapping-coverage` | New pillar leaf without verified spine mapping | pillar↔spine |
| `cross-spine-collision` | Artifact citing 2+ spines with conflicting CORE rules | CORE consistency |

---

## Why 5 spines (not 3, not 7, not 12)

Per CSP precedent: 5 is the right cardinality. Fewer (3) collapses concerns that should stay separate (e.g., GVRN ≠ VALD; one declares, the other proves). More (7+) creates over-specialization where pillar-domain-organization already serves human navigation. 5 spines × 7 pillars × 5 outward layers = ~175 cells; each CSPS artifact lives in ≥1 cell with explicit identity.

The 5-cardinality is also empirically validated by CSP's 330+ session evolution — they collapsed from 8 spines → 5 over time as redundancies surfaced. CSPS adopts the converged form rather than re-evolving.

---

## Authority and amendment

**Amending CORE:** requires multi-session ADR (CORE re-grounding event) + 5/5 engraving + meta-RZF cycle. Ratified by user-as-Governor.

**Amending outward layers:** standard ADR or PCR (depending on blast radius); Layer-N changes don't require Layer-N-1 amendment unless the change reveals CORE drift.

**Amending pillar↔spine mapping:** PCR-then-amend; mapping is editorial (which spine claims primary stewardship of a pillar leaf).

**Amending the 5-spine cardinality:** would require multi-session ADR + collapse/split CC-equivalent; not expected within v1 (target: 12 weeks per build-order.md).

---

## Engraving status

| Surface | Status |
|---|---|
| **Memory** | feedback_core_spine_discipline.md (L2) |
| **Contract** | B_CORE_SPINE_DISCIPLINE in behavioral-contracts.md (L2) |
| **AGENTS.md hard NO** | "never create persisted artifact without core_spines: frontmatter" (L2) |
| **Spine matrix row** | P-ARCH-028 csps-core-spines (L2) |
| **Audit (atomic)** | `core-spine-citation-on-artifact` registered in audit-hub Pipeline 1 (L2) |
| **Validator (registration atomic; implementation week-4)** | `tools/validators/validate-core-spine-citation.mjs` (L3) |
| **Dashboard leaf** | THIS file (L1) |

**Engraving signature:** `S006-AI-csps-core-manifest-2026-05-04T15:00:00Z`
---

## CDAB — Context Driven AI Behavior (canonical label — S016)

**CDAB** is the name for the complete infrastructure CSPS has built to ensure AI behavior is governed by context, not by rule lookup. Built over 16 sessions without a canonical name. This section names it.

**Core insight (P-META-020 alias `context-driven-navigation`):** Rules are finite. Situations are infinite. Only deep context understanding handles the long tail. AI with rules but not their WHY pattern-matches and fails at edge cases.

### CDAB Infrastructure Map

| Layer | Mechanism | Mechanical? |
|---|---|---|
| Static context | session-open.sh Q1-Q15, AGENTS.md, inner-ai-defaults/ | Soft (read once at start) |
| Override registry | 10 inner-ai-defaults files with disposition: fields | Partial (freshness validator) |
| Decision-time context | B_AUTONOMOUS_BATCH pre-flight Q-GATE/Q-COMPLETE/Q-GLOBAL/Q-INITIATED | Soft (format defined) |
| Milestone context | B_HUMBLE_EXECUTOR at every phase gate | Soft (week-4 validator) |
| Principle context | packages/principles-mcp (live MCP queries) | Mechanical ✅ |
| Phase gate context | FOUNDATION_EXIT_GATE, bedrock, stale-plans | Mechanical ✅ |

### CDAB Roadmap

- ✅ S016: Name CDAB, disposition fields, plan-harvest + execution-mode validators
- ⏳ S017+: PE mechanical computation (pe-compute.mjs as live scorer)
- ⏳ S018: MCP dynamic context — `get_context(decision_type)` closes the measurement gap
- ⏳ week-4: context-sensitive-rule-coverage validator (escape hatch enforcement)

**Amendment:** `S016-CDAB-label-2026-05-07T00:00:00Z`

