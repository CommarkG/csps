---
id: csps.handoff.vault.sonnet-task-list.S020
name: sonnet-task-list-S020
description: >
  Complete prioritized task list for the S020 Sonnet session. Every item is
  specification-level — no judgment calls needed. Built from: sonnet-capability-injection-S019.md,
  bottleneck-and-gradual-structures-S019.md, opus-lessons-S019 enforcement matrix,
  vocabulary audit, and partially-built items from S019.
  PASTE THIS AS SESSION MANDATE WHEN OPENING S020.
version: 1.0
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: opus_consultations
session: S019
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: capability-injection, href: ./sonnet-capability-injection-S019.md }
  - { rel: bottleneck-spec, href: ./bottleneck-and-gradual-structures-S019.md }
  - { rel: opus-lessons, href: ./opus-lessons-S019/README.md }
  - { rel: drift-registry, href: ../../../../tools/config/drift-registry.yaml }
  - { rel: build-verification-map, href: ../../../../tools/config/build-verification-map.yaml }
domain_path: platform
---

# S020 Sonnet Task List
## Complete Specification — Start Here

---

## Session Context (S019 Handoff)

**What S019 accomplished (all verified, pnpm verify: exit_code 0):**
- Opus-designated architectural review: 15 lessons (opus-lessons-S019/)
- P1: AGENTS.md hard NO for satisfaction point (declaration → demonstration)
- P2: Field-level drift validator extended + stripeSubscriptionId fixed in ZModel
- P3: validate-inner-ai-defaults-enforcement-rate.mjs (baseline: 6%)
- validate-opus-audit-due.mjs (blocks at 10 sessions; next due S029)
- validate-core-seeds.mjs promoted stub→advisory
- sonnet-capability-injection-S019.md (10-part injection spec)
- sonnet-inheritance-model-S019.md (5 mental models HOW and WHY)
- bottleneck-and-gradual-structures-S019.md (S1-S8 spec)
- tools/config/drift-registry.yaml (7 drift types, 43% monitored)
- tools/config/build-verification-map.yaml (file→validator coupling)
- tools/config/platform-layer-boundaries.yaml (L0/L1/L2 hard boundaries)
- csps-pitch-and-value-S019.md (value proposition consolidated)

**Key metrics:**
- Behavioral enforcement rate: **6%** (2/31 entries — target 25% by S025)
- Drift coverage: **43%** (3/7 types active — target 5/7 by S025)
- Opus audit: **S029** (sessions_since=0, threshold=10)
- pnpm verify: **exit_code 0** (all 41+ validators passing)

---

## Vocabulary Additions Required (Do First — Low Effort, High Alignment)

**File to update:** `docs/plan/pillar-0-governance/vocabulary.md`

Add these terms (all introduced or clarified in S019):

| Term | Definition | First Used |
|---|---|---|
| `Enforcement Rate` | % of inner-AI-defaults behavioral overrides with live mechanical validators vs. "impl deferred." Baseline S019: 6%. Tracked by validate-inner-ai-defaults-enforcement-rate.mjs. | S019 |
| `Platform Layer Boundaries` | Hard architectural boundary between L0 Core (platform-owned), L1 Developer Surface (app developer scope), L2 User Surface (end-user facing). Import flows L2→L1→L0→External only. | S019 |
| `Opus Trigger Classes` | 5 mechanical criteria for triggering Opus architectural review: BPG (Big Plan Gate), PEG (Phase Exit Gate), PIA (Post-Implementation Audit), SIG (Session Interval Gate at 10 sessions), KCP (K=2 Critical Pattern). | S019 Part3 |
| `Coverage Levels` | Enumerated dimensions of what a validator covers and explicitly doesn't cover. Format: ✓ Level 1: [what] ✗ Level 2: [what] → VLT. Every validator must have this in its header. | S019 L1 |
| `Rigidity Spectrum (R1-R5)` | Classification of behavioral constraint flexibility: R1 Absolute (never override), R2 Spine-Absolute, R3 Task-Class-Absolute, R4 Contextual, R5 Training-Default-Keep. Resolves AI flexibility vs. required rigidity tension. | S019 Part3 |
| `Drift Registry` | Canonical registry (tools/config/drift-registry.yaml) of all 7 drift types CSPS monitors with status (active/deferred/planned) and validator references. | S019 |
| `Build Verification Map` | tools/config/build-verification-map.yaml — maps governed file types to required validators + checklists. Mechanical coupling between "built" and "verified." | S019 |
| `Positive ZF Cycle` | After a passing verify run: explicitly capturing which specific claims were proven to be true, not just that nothing failed. Complement to the existing negative-ZF (what failed). | S019 |
| `AppendOnlyBase` | Planned abstract model variant for immutable records (AuditEvent, event ledgers) that lacks `deletedAt` and `updatedAt`. Distinguishes mutable models (extend Base) from immutable (extend AppendOnlyBase). | S019 L5 |
| `Field Drift` | Divergence between ZModel field definitions per model and app schema fields per model. Distinct from model drift (model-level) and live-DB drift (DB vs code). Level 2 coverage. | S019 L1 |
| `SAP (Sonnet Audit Protocol)` | 6-sweep formal audit procedure: Coverage Audit, Drift Audit, Scale Audit, Regulatory Audit, Contract Enforcement Audit, Synergy Audit. Abbreviated (Sweeps 2+5) at session close. | S019 Part2 |
| `Mental Models (5)` | The 5 Opus-level reasoning patterns injected into Sonnet: Cross-File Lens, Time Projection Lens, Coverage Enumeration Lens, Self-Referential Governance Lens, Moat Measurement Lens. | S019 sonnet-inheritance-model |
| `Haiku Pattern Library` | Pre-defined pattern signatures (tools/config/haiku-pattern-library.yaml) that Haiku scouts should detect during file scanning tasks. Elevates Haiku from raw scanner to pattern-aware scanner. | S019 |
| `Opus Mental Model` | The `opus_pattern` field in inner-AI-defaults entries that encodes HOW Opus approaches a reasoning problem — not just WHAT to do (the override) but the mental model behind it. | S019 |

---

## Priority Tasks — Ordered for S020 Execution

### Tier 1: Trivial + High Impact (do in first 30 minutes)

**VOCAB-1:** Add all 14 terms above to `docs/plan/pillar-0-governance/vocabulary.md`
- File: vocabulary.md
- Action: append 14 new entries in alphabetical order
- Verify: validate-frontmatter.mjs passes (no schema errors)

**HAIKU-1:** Create `tools/config/haiku-pattern-library.yaml`
```yaml
# 7 patterns Haiku should detect (spec in bottleneck-and-gradual-structures-S019.md §4):
# satisfaction_point_risk, n_plus_one_query, layer_boundary_violation,
# raw_prisma_in_business_route, billing_logic_in_wrong_layer, coverage_header_missing,
# comment_truth_risk
```
- Verify: file exists and is valid YAML

**HAIKU-2:** Create `tools/templates/haiku-spawn-template.md`
- Content: return format (haiku_scout_return + pattern_flags fields), NEVER sections, pattern library reference
- Verify: file exists, has all required return format fields

**AUDIT-1:** Create `docs/plan/pillar-0-governance/sonnet-audit-protocol.md`
- Content: 6 SAP sweeps as a formal protocol with checkboxes
- Integration note: add to closing-summary-template.md §10 as optional Sweeps 2+5

---

### Tier 2: Medium Complexity (core S020 work)

**DRIFT-1:** Create `tools/validators/validate-drift-registry.mjs`
- Source: tools/config/drift-registry.yaml
- Behavior: reads registry, reports % of drift types with active validators
- Exit: ADVISORY (0) when coverage < 50%, BLOCKING (1) when < 25% AND critical drift type has no VLT
- Wire into: pnpm verify + audit-runner.md entry
- Verify: `node tools/validators/validate-drift-registry.mjs` shows coverage=43% status=ADVISORY

**LAYER-1:** Create `tools/validators/validate-layer-boundary.mjs`
- Source: tools/config/platform-layer-boundaries.yaml
- Behavior: scan `libs/**/*.ts` for `import.*from.*apps/` — flag BLOCKING
- Exit: BLOCKING when L0→L1 or L0→L2 import found
- Wire into: pnpm verify + audit-runner.md entry
- Verify: no current L0→L1 imports exist (clean baseline)

**ORCH-1:** Add accuracy tracking to context orchestrator
- File: `tools/context-orchestrator-last-run.json` schema update
- Add: `declared_spine: ""`, `orchestrator_match: null` fields
- Purpose: after every session close, compare orchestrator-recommended task_class vs. CONCEPT_LOAD declared spine
- Store in: `tools/context-orchestrator-accuracy.json` (append-only per session)

**INNER-AI-1:** Add `opus_pattern` field to ALL reasoning-patterns.md entries
- File: `docs/plan/_handoff/VAULT/inner-ai-defaults/reasoning-patterns.md`
- Action: for each of the 13 entries, add `opus_pattern: "[how Opus approaches this]"` and `moat_relevance: compound|maintenance|neutral`
- Source: sonnet-inheritance-model-S019.md (the 5 mental models provide the patterns)

---

### Tier 3: Architecture (requires Governor review before implementation)

**SCHEMA-1:** Create `abstract model AppendOnlyBase` in `libs/policies/schema.zmodel`
- Contains: `id`, `createdAt` only (no `deletedAt`, no `updatedAt`)
- Update `AuditEvent` to extend `AppendOnlyBase` instead of `Base`
- Create validator check: models with `@@deny("create,update,delete", true)` must extend AppendOnlyBase
- **Requires Governor ratification** (schema change with migration)

**BILLING-1:** Move billing trigger to `libs/integrations`
- Move `memberCount === 2` logic from `apps/task-mgmt/src/app/api/webhooks/clerk/route.ts`
- Into: `buildTenantBillingHook` in `libs/integrations/`
- **Requires Governor ratification** (refactoring shared infrastructure)

**GDPR-1:** Create `libs/gdpr.ts` pseudonymization service
- Spec: sonnet-capability-injection-S019.md and opus-lessons-S019/part1-schema-and-security.md L7
- Function: `eraseUser(userId)` → replace PII fields → write AuditEvent → return receipt
- Add to bedrock checklist: `[ ] GDPR erasure path in libs/gdpr.ts`
- **Requires Governor ratification** (new shared library + schema implications)

**RENAME-1:** Rename `User.tenantId` → `User.activeSessionTenantId`
- Migration required
- Update all references in API routes
- **Requires Governor ratification** (migration + blast radius review)

---

### Tier 4: Governance Document Updates

**CDP-1:** Create `tools/validators/validate-cdp-transitions.mjs`
- Validates cdp_status is in closed enum
- Reports backward transitions as ADVISORY
- Source spec: bottleneck-and-gradual-structures-S019.md §2 Structure 2

**SPINE-1:** Create `tools/validators/validate-spine-health.mjs`
- For each spine's domain card §10 "Planned" items: check corresponding VLTs exist
- Reports: spine coverage completeness %
- Source spec: opus-lessons-S019/part2-spines-ai-and-vision.md L10

**INNER-AI-2:** Add `opus_pattern` field to code-patterns.md, output-distribution.md, prose-patterns.md
- Same as INNER-AI-1 but for the remaining 3 inner-AI-defaults files
- Lower priority than reasoning-patterns.md (those are the most critical overrides)

**SESSION-1:** Add Session-Close Invariants to `docs/plan/_handoff/closing-summary-template.md`
- Add `### Session-Close Invariants` section with enforcement_rate and drift_coverage checkboxes
- Source: sonnet-capability-injection-S019.md Part J

---

### Tier 5: Context Orchestrator Improvements (S021+)

These are specified but not yet ready for implementation — document the VLTs:

**ORCH-VLT-1:** Multi-class task detection for hybrid prompts → VLT-S020-ORCH-MULTICLASS
**ORCH-VLT-2:** Depth-selection per artifact in bundle templates → VLT-S020-ORCH-DEPTH
**ORCH-VLT-3:** Opus escalation signal from orchestrator → VLT-S020-ORCH-OPUS

---

## Key Files to Load at S020 Session Open

In this order (L1 depth only):
1. `tools/session-state.json` — current state
2. `tools/config/build-verification-map.yaml` — file→validator coupling
3. `docs/plan/_handoff/VAULT/sonnet-inheritance-model-S019.md` — mental models
4. `docs/plan/_handoff/VAULT/bottleneck-and-gradual-structures-S019.md` — implementation specs S1-S8
5. `tools/config/drift-registry.yaml` — what drift types are and aren't monitored

---

## Verification Protocol for S020

After each task, run:
```bash
pnpm verify
```
Expected: `exit_code: 0`

After adding new validators, additionally run:
```bash
pnpm audit-runner:split
```

Session close invariants to check:
- enforcement_rate >= 6% (current baseline — each session must maintain or improve)
- drift_coverage >= 43% (current baseline)
- pnpm verify: exit_code 0 WITH tool output pasted as demonstration

---

## The Chat-Jump Prompt (Copy This Exactly)

```
CSPS Session S020 — Sonnet session after Opus-designated architectural review S019.
Read in order: (1) https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/sonnet-task-list-S020.md for your full task list, (2) https://github.com/CommarkG/csps/blob/main/docs/plan/_handoff/VAULT/sonnet-inheritance-model-S019.md for the 5 mental models you must apply. Start with VOCAB-1 (vocabulary additions), then HAIKU-1, HAIKU-2, DRIFT-1 — in that order. Key metrics: enforcement_rate=6% (target 25%), drift_coverage=43%, Opus audit due S029, pnpm verify exit_code=0. Build verification map at tools/config/build-verification-map.yaml governs what to verify after each write. Do NOT declare any task complete without pasting tool output as demonstration.
```

---

*S019 output complete. This file is the S020 session mandate.*
