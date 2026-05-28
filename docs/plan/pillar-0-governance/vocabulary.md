---
id: csps.pillar-0-governance.vocabulary
name: vocabulary
description: >
  Canonical governance vocabulary for CSPS. Terms introduced or clarified by
  Opus architectural reviews and session-level discoveries. Companion to
  pillar-1-architecture-and-stack/vocabulary.md (AI/agent + platform terms).
  Every governance-domain term has a single definition here.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
session: S020
impl_status: swift-implemented
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
links:
  - { rel: parent, href: ./README.md }
  - { rel: companion-vocab, href: ../pillar-1-architecture-and-stack/vocabulary.md }
  - { rel: drift-registry, href: ../../../tools/config/drift-registry.yaml }
  - { rel: build-verification-map, href: ../../../tools/config/build-verification-map.yaml }
  - { rel: inner-ai-defaults, href: ../../plan/_handoff/VAULT/inner-ai-defaults/ }
domain_path: platform
diataxis_type: reference
core_spine: OPER
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Governance Vocabulary

> Single canonical definitions for governance, AI-behavior, and audit terms used across CSPS.
> Terms are alphabetical. First-introduced session tagged.

---

## Most Commonly Used Acronyms

> Quick-reference for the abbreviations that appear most often in CSPS sessions, council relays, and directives. One-line glosses; fuller definitions live in **Locked Terms** below and the [companion vocabulary](../pillar-1-architecture-and-stack/vocabulary.md). Added S069 (Governor request).

| Acronym | Stands for | One-line meaning |
|---|---|---|
| **CSPS** | Core Sights Platform System | The governed multi-tenant SaaS platform this repo builds. |
| **OPIA** | Opus Post-Implementation Audit | The structured review Opus runs on Sonnet's actual commits (M-43 diff-review, not prose) before accept/seal. |
| **PCR** | Pros / Cons / Recommendation | Canonical 3-block format for any non-trivial decision (P-OP-003). |
| **CIE** | Continuous Intelligence Engine | The platform's continuous measurement/intelligence layer (sub-engines: scope router, seeds monitor, docs engine…). |
| **PE** | Priority Engine | Scores items by urgency × impact / SPI to sequence work + propose bundles (pe-agent). |
| **ZF** | Zero Findings | A verification cycle terminates only when it finds nothing new. |
| **RZF** | Re-Zero Findings | Re-run the ZF cycle — "re-run IS the proof" (P-META-006). |
| **CEC** | Complete Extraction Cycle | Walk every surface to extract maximum value from a ratified insight, until 0 new applications. |
| **PVA** | Practical Validation Audit | Evidence gate that promotes an ADVISORY validator to BLOCKING only after it's shown to catch real drift. |
| **GHG** | Gap-Harmonization-Gate | When no governed element fits → STOP + ratify; never guess (Template-or-Flag). |
| **DPR** | (build-interrupt rating) | Rate a new mid-build input 1–5 → defer (1–2) / interrupt-at-boundary (3) / stop (4–5). P-OP-006. |
| **ZCA** | Zero-Context Assumption | Every cross-boundary message assumes the receiver has zero prior context (P-UX-002). |
| **MUV** | Mutual Understanding Validation | Every AI communication boundary closes the I→I loop (P-META-014). |
| **FSE** | Five-Surface Engraving | A catch hits 5 surfaces atomically: schema + validator + hook + memory + contract. |
| **VLT / vlt** | Vault entry | A persisted, wired idea/finding (`vlt-S###-#####`) so nothing floats. |
| **DNA** | (inheritable governance essence) | What every CSPS element carries from its parent — no orphans (Inheritance Model). |
| **T1 / T2 / T3** | Enforcement Trio | T1 = pre-tool-use hook · T2 = validator / pre-commit (commit-time block) · T3 = session-open injection. |
| **B_\*** | Behavioral Contract | A named, enforceable AI-behavior rule (e.g. B_ENFORCEMENT_TRIO). |
| **M-NN** | Moat | A compounding capability that strengthens the platform (e.g. M-43 cross-tab-diff-review). |
| **P-META / P-ARCH / P-OP(ER)** | Principle namespaces | Governance principles by domain — meta, architecture, operations. |
| **Core Spines** | GVRN · ARCH · AI · OPER · VALD | The 5 routing spines; precedence GVRN > VALD > ARCH > AI > OPER (P-ARCH-028). |
| **NodeFile** | (governed artifact) | Any CSPS artifact that answers the 8 self-identification questions (NODEFILE-CONTRACT). |
| **HPFA** | Handoff Pre-Flight Audit | Whole-session 7-check gate before writing a handoff (P-META-013). |
| **AAP** | Agent Alignment Protocol | Every agent passes alignment checks before invocation (P-META-010). |
| **SROF** | (architectural review request) | Structured Opus-level review (Q1–Q6) for design decisions — not routine step-done reports. |

---

## Locked Terms

### AppendOnlyBase
**Definition:** Planned abstract model variant for immutable records (AuditEvent, event ledgers) that lacks `deletedAt` and `updatedAt`. Distinguishes mutable models (extend `Base`) from immutable (extend `AppendOnlyBase`). Models with `@@deny("create,update,delete", true)` must extend AppendOnlyBase rather than Base.
**First introduced:** S019 L5
**Canonical location:** `libs/policies/schema.zmodel`
**Status:** Planned — Governor ratification required before implementation (schema change with migration).

---

### Build Verification Map
**Definition:** `tools/config/build-verification-map.yaml` — maps governed file types to required validators + checklists. Provides mechanical coupling between "built" and "verified." After any Write/Edit to a governed path, Sonnet reads this map and runs the listed validators before declaring done.
**First introduced:** S019 (sonnet-capability-injection-S019.md Part G)
**Canonical location:** `tools/config/build-verification-map.yaml`
**Format:** `path_pattern` → `required_validators` + `required_checklist` + `positive_zf_claim` + `not_proven`

---

### Coverage Levels
**Definition:** Enumerated dimensions of what a validator covers and explicitly does NOT cover. Format:
```
✓ Level 1: [what it covers]
✗ Level 2: [what it does NOT cover] → VLT-S<NNN>-<SLUG>
```
Every validator must have this header. Prevents false confidence from a passing run when higher-level drift goes undetected.
**First introduced:** S019 L1
**Enforced by:** `tools/validators/validate-drift-registry.mjs` (structural gate for validators)
**See also:** Build Verification Map → `not_proven` field

---

### Drift Registry
**Definition:** `tools/config/drift-registry.yaml` — canonical registry of all 7 drift types CSPS monitors, each with `status` (active/partial/planned/deferred), `validator` reference, `severity`, and `coverage_level`. Coverage percentage tracked in `meta.coverage_percentage`. Meta-validator `validate-drift-registry.mjs` reports coverage at every session.
**First introduced:** S019 (Part H of capability-injection spec)
**Canonical location:** `tools/config/drift-registry.yaml`
**Coverage target:** 5/7 active by S025, 7/7 active by S030

---

### Enforcement Rate
**Definition:** Percentage of inner-AI-defaults behavioral overrides that have live mechanical validators vs. "impl deferred." Tracked by `validate-inner-ai-defaults-enforcement-rate.mjs`. Baseline at S019: **6%** (2 of 31 entries have live validators). Target: 25% by S025.
**Formula:** `entries_with_live_validator / total_entries * 100`
**First introduced:** S019
**Tracked by:** `tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs`
**Session-close invariant:** enforcement_rate must not decrease across sessions

---

### Field Drift
**Definition:** Divergence between ZModel field definitions per model and app Prisma schema fields per model. Distinct from model drift (model-level existence) and live-DB drift (DB vs code). Classified as Level 2 coverage in the drift registry. Confirmed gap in S019: `Tenant.stripeSubscriptionId` existed in app schema but not ZModel.
**First introduced:** S019 L1
**Detected by:** `validate-foundation-schema-drift.mjs` (Level 2 coverage)
**See also:** Schema Model Drift (Level 1 — model existence), Live Database Drift (Level 3 — live DB)

---

### Haiku Pattern Library
**Definition:** `tools/config/haiku-pattern-library.yaml` — pre-defined pattern signatures that Haiku scouts detect during file-scanning tasks. Elevates Haiku from raw scanner to pattern-aware scanner. Each pattern has an `id`, `description`, `detection_hint`, and `severity`. The 7 initial patterns: `satisfaction_point_risk`, `n_plus_one_query`, `layer_boundary_violation`, `raw_prisma_in_business_route`, `billing_logic_in_wrong_layer`, `coverage_header_missing`, `comment_truth_risk`.
**First introduced:** S019 (bottleneck-and-gradual-structures-S019.md §4)
**Canonical location:** `tools/config/haiku-pattern-library.yaml`
**See also:** Haiku Spawn Template — return format for Haiku scouts

---

### Mental Models (5)
**Definition:** The 5 Opus-level reasoning patterns injected into Sonnet via `sonnet-inheritance-model-S019.md`. Patterns describe HOW Opus approaches a reasoning problem — not just what to do (the override) but the cognitive model behind it:
1. **Cross-File Lens** — never evaluate a file in isolation; always check its contract with callers
2. **Time Projection Lens** — evaluate correctness at 10× scale / 1 year out
3. **Coverage Enumeration Lens** — enumerate what is proven + what is NOT proven after each verify run
4. **Self-Referential Governance Lens** — apply governance rules to governance artifacts themselves
5. **Moat Measurement Lens** — assess whether each addition compounds the structural moat
**First introduced:** S019 (`sonnet-inheritance-model-S019.md`)
**Canonical location:** `docs/plan/_handoff/VAULT/sonnet-inheritance-model-S019.md`

---

### Opus Mental Model
**Definition:** The `opus_pattern` field in inner-AI-defaults entries that encodes HOW Opus approaches a reasoning problem — not just WHAT to do (the override) but the mental model behind it. Allows Sonnet to inherit Opus reasoning patterns at session open without requiring an Opus run. Every entry in `reasoning-patterns.md` (and other inner-AI-defaults files) must have `opus_pattern:` populated.
**First introduced:** S019
**Field location:** `docs/plan/_handoff/VAULT/inner-ai-defaults/reasoning-patterns.md` (and code-patterns.md, output-distribution.md, prose-patterns.md)
**See also:** Mental Models (5) — the 5 injected patterns

---

### Opus Trigger Classes
**Definition:** 5 mechanical criteria for triggering an Opus architectural review session. Prevents both over- and under-use of Opus:
- **BPG** (Big Plan Gate) — before any plan that spans 3+ sessions
- **PEG** (Phase Exit Gate) — before exiting a bedrock phase
- **PIA** (Post-Implementation Audit) — after completing a major infrastructure piece
- **SIG** (Session Interval Gate) — every 10 sessions (currently: next due S029)
- **KCP** (K=2 Critical Pattern) — when a second instance of a structural anti-pattern fires
**First introduced:** S019 Part3
**Tracked by:** `tools/validators/validate-opus-audit-due.mjs`
**Current state:** sessions_since_opus_review=0; next due at S029

---

### Platform Layer Boundaries
**Definition:** Hard architectural boundary between:
- **L0 Core** — platform-owned (`libs/`, `tools/`, `packages/`) — inherited by every app
- **L1 Developer Surface** — app developer scope (`apps/*/`)
- **L2 User Surface** — end-user facing (UI components, public APIs)
Import flow is L2 → L1 → L0 → External ONLY. Reverse imports (L0 importing from apps/) are BLOCKING violations.
**First introduced:** S019
**Canonical location:** `tools/config/platform-layer-boundaries.yaml`
**Detected by:** `validate-layer-boundary.mjs` (planned — LAYER-1 task)
**See also:** Architectural Boundary Drift in drift-registry.yaml

---

### Positive ZF Cycle
**Definition:** After a passing `pnpm verify` run: explicitly capturing which specific claims were proven to be true, not just that nothing failed. The complement to the existing negative-ZF (what failed). Format: "This verify run proves: [explicit list from positive_zf_claim fields]" + "This verify run does NOT prove: [explicit list from not_proven fields]". Required at every session close alongside the standard ZF evidence block.
**First introduced:** S019
**Required by:** `sonnet-capability-injection-S019.md` Part C (BUILD AUDIT SUMMARY format)
**See also:** Build Verification Map → `positive_zf_claim` + `not_proven` fields

---

### Rigidity Spectrum (R1–R5)
**Definition:** Classification of behavioral constraint flexibility. Resolves AI flexibility vs. required rigidity tension by assigning every constraint a rigidity level:
- **R1 Absolute** — never override under any circumstances (AGENTS.md hard NOs)
- **R2 Spine-Absolute** — absolute within a specific spine/domain
- **R3 Task-Class-Absolute** — absolute for a specific task class (e.g., production deployments)
- **R4 Contextual** — default behavior that can be overridden with explicit Governor directive
- **R5 Training-Default-Keep** — AI training default that CSPS explicitly keeps (no override needed)
**First introduced:** S019 Part3
**Used in:** `behavioral-contracts.md` `rigidity_level:` field, `inner-ai-defaults/*.md` entries

---

### SAP (Sonnet Audit Protocol)
**Definition:** 6-sweep formal audit procedure run by Sonnet at session close or when requested. Abbreviated version (Sweeps 2+5) runs at every session close; full 6-sweep version runs on complex sessions.
- **Sweep 1 — Coverage Audit:** What does pnpm verify prove and NOT prove?
- **Sweep 2 — Drift Audit:** Which drift types advanced? Enforcement rate delta?
- **Sweep 3 — Scale Audit:** Any N+1 patterns, O(N²) risks, or saturation risks introduced?
- **Sweep 4 — Regulatory Audit:** GDPR erasure path covered? PII fields documented?
- **Sweep 5 — Contract Enforcement Audit:** Which B_* contracts have live validators? Which are declared-only?
- **Sweep 6 — Synergy Audit:** CEC pass — any new insight that enhances other platform surfaces?
**First introduced:** S019 Part2
**Canonical location:** `docs/plan/pillar-0-governance/sonnet-audit-protocol.md` (AUDIT-1 task)
**Session-close:** Sweeps 2+5 mandatory; full 6-sweep on architectural sessions
