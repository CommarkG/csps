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
---

# Governance Vocabulary

> Single canonical definitions for governance, AI-behavior, and audit terms used across CSPS.
> Terms are alphabetical. First-introduced session tagged.

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
