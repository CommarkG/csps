---
id: csps.pillar-0-governance.sonnet-audit-protocol
name: sonnet-audit-protocol
description: >
  Formal 6-sweep Sonnet Audit Protocol (SAP). Provides Sonnet with a standardized
  multi-angle audit sweep that substitutes for Opus-level architectural intuition on
  non-Opus sessions. Abbreviated version (Sweeps 2+5) runs at every session close;
  full 6-sweep version runs on complex or architectural sessions. Spec source:
  sonnet-capability-injection-S019.md Part E.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
impl_status: swift-implemented
core_spine: VALD
core_spines: [VALD, AI, GVRN]
schema_anchor: pillar_0_governance_leaves
session: S020
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: parent, href: ./README.md }
  - { rel: spec-source, href: ../../plan/_handoff/VAULT/sonnet-capability-injection-S019.md }
  - { rel: closing-summary, href: ../_handoff/VAULT/closing-summary-template.md }
  - { rel: drift-registry, href: ../../../tools/config/drift-registry.yaml }
  - { rel: inner-ai-defaults, href: ../../plan/_handoff/VAULT/inner-ai-defaults/ }
  - { rel: build-verification-map, href: ../../../tools/config/build-verification-map.yaml }
domain_path: platform
diataxis_type: how-to
---

# Sonnet Audit Protocol (SAP)

> **Formal 6-sweep audit procedure.** SAP provides Sonnet with a structured multi-angle audit that surfaces what wasn't explicitly asked about — the key gap between Sonnet's reactive default and Opus's proactive default. Abbreviated (Sweeps 2+5) at every session close. Full 6-sweep for complex/architectural sessions.

---

## When to Run SAP

| Trigger | Sweeps | Duration |
|---|---|---|
| Every session close | Sweeps 2 + 5 (abbreviated) | ~10 minutes |
| Complex implementation session | All 6 sweeps | ~30 minutes |
| Before any Opus consultation | All 6 sweeps — this IS the Opus baseline evidence | ~1 hour |
| After K=2 structural pattern detected | Sweeps 1 + 5 | ~15 minutes |

---

## Sweep 1 — Coverage Audit

**Purpose:** Surface what the current validator suite proves and explicitly does NOT prove. Prevents false confidence from passing ZF runs.

**Procedure:**

- [ ] For every validator in `pnpm verify` output: read its Coverage Levels header
- [ ] List all levels marked ✗ (not covered)
- [ ] For each uncovered level: is there a VLT registered? If not: surface as ADVISORY
- [ ] Check `tools/config/build-verification-map.yaml` `not_proven` fields — verify they match validator headers

**Output format:**

```
COVERAGE AUDIT — Sweep 1
Covered at Level 1: [validator_name] → [what it proves]
NOT covered (deferred): [what is NOT proven by exit_code 0]
  - [level]: [what is not checked] → VLT: [VLT-ID or NEEDED]
Advisory: [N] uncovered levels without VLTs
```

---

## Sweep 2 — Drift Audit (Abbreviated — runs at EVERY session close)

**Purpose:** Track all 7 drift types. Did coverage advance or regress this session?

**Procedure:**

- [ ] Run `node tools/validators/validate-drift-registry.mjs` — paste output
- [ ] For each drift type in `tools/config/drift-registry.yaml`:
  - [ ] Schema model drift → `validate-foundation-schema-drift.mjs` Level 1: PASS/FAIL
  - [ ] Schema field drift → `validate-foundation-schema-drift.mjs` Level 2: PASS/FAIL
  - [ ] Behavioral contract enforcement drift → `validate-inner-ai-defaults-enforcement-rate.mjs`: rate=X%
  - [ ] Conceptual AI drift → `validate-inner-ai-defaults-freshness.mjs`: warnings=N
  - [ ] Documentation/comment drift → manual: grep for P-ARCH-\* / P-META-\* in .ts files with stale mechanism claims
  - [ ] Coverage header drift → manual: `validate-layer-boundary.mjs` Coverage Levels header present?
  - [ ] Architectural boundary drift → `validate-layer-boundary.mjs`: violations=N
- [ ] Compare coverage % to previous session baseline: advanced / regressed / unchanged
- [ ] If coverage regressed: create VLT before session close

**Output format:**

```
DRIFT AUDIT — Sweep 2
drift_coverage: X% (previous session: Y%)
enforcement_rate: X% (previous session: Y%)
Status per drift type:
  schema-model-drift: [ACTIVE/DEFERRED] — validator: [name]
  schema-field-drift: [ACTIVE/DEFERRED] — validator: [name]
  behavioral-contract-drift: [ACTIVE/DEFERRED] — rate: X%
  conceptual-drift: [ACTIVE/PARTIAL] — warnings: N
  documentation-drift: [PLANNED] — VLT: VLT-S019-COMMENT-TRUTH
  coverage-header-drift: [MANUAL] — findings: N
  architectural-boundary-drift: [ACTIVE] — violations: N
Coverage delta: +X% / -X% / unchanged
```

---

## Sweep 3 — Scale Audit

**Purpose:** Surface O(N) and O(N²) risks before they become production incidents.

**Procedure:**

- [ ] For every model in `libs/policies/schema.zmodel`:
  - [ ] What is the expected max row count at 30× scale?
  - [ ] Does every query that runs on this model use an indexed field?
  - [ ] Does any validator walk files related to this model? Is it O(N)?
- [ ] For every validator in `pnpm verify`: does it walk all files? Flag O(N) file-walkers
- [ ] For every API route in `apps/*/src/app/api/**`: does it make N+1 queries?
- [ ] Apply the 3 cruel-critic scale questions: 30→300 tenants / 10→100 concurrent users / 1→10 apps

**Output format:**

```
SCALE AUDIT — Sweep 3
Models at scale risk:
  [model_name]: expected rows at 30× = [N]; query uses [indexed/unindexed field]; O([complexity])
O(N) validators flagged:
  [validator_name]: walks [dir] recursively; O(N) in [metric]
N+1 query risks:
  [file:line]: [description]
Scale verdict: [CLEAN / N risks found]
```

---

## Sweep 4 — Regulatory Audit

**Purpose:** Ensure GDPR/privacy obligations are tracked for all PII-bearing models.

**Procedure:**

- [ ] List every model in `libs/policies/schema.zmodel` that stores PII (email, name, phone, any user-linked identifiers)
- [ ] For each PII model: is there an erasure path? (`libs/gdpr.ts` or explicit documentation)
- [ ] For each PII model: is `deletedAt` (soft-delete) vs `AppendOnlyBase` (immutable) correctly chosen?
- [ ] For each PII model: is there a retention policy documented?
- [ ] Check `bedrock.md` GDPR checklist item status

**Output format:**

```
REGULATORY AUDIT — Sweep 4
PII models:
  [model_name]: fields=[email, name, ...]; erasure_path=[yes/NO]; retention=[yes/NO]; model_type=[Base/AppendOnlyBase]
GDPR gaps: [N gaps found]
  - [model_name]: missing erasure path → VLT: [ID or NEEDED]
```

---

## Sweep 5 — Contract Enforcement Audit (Abbreviated — runs at EVERY session close)

**Purpose:** Track behavioral contract enforcement rate. Are declared contracts backed by running validators?

**Procedure:**

- [ ] Run `node tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs` — paste output
- [ ] For each entry with `caught_by_validator: impl deferred`:
  - [ ] How many sessions has it been deferred? (check `added_session` field)
  - [ ] Has it passed K=2 threshold (deferred ≥2 sessions)? If yes: VLT required
- [ ] Calculate enforcement_rate = live / total
- [ ] Compare to previous session: advanced / regressed
- [ ] If regressed: surface as FINDING before session close

**Output format:**

```
CONTRACT ENFORCEMENT AUDIT — Sweep 5
enforcement_rate: X% (Y live / Z total entries)
Previous session: X%
Deferred >2 sessions (K=2 candidates):
  [entry_name]: deferred since S[NNN] ([N] sessions)
K=2 VLTs created this session: [N]
Status: [IMPROVED / UNCHANGED / REGRESSED]
```

---

## Sweep 6 — Synergy Audit

**Purpose:** Surface cross-platform enhancement opportunities from this session's work. Runs the CEC (Complete Extraction Cycle) on any new insight ratified this session.

**Procedure:**

- [ ] List every new artifact created or significantly modified this session
- [ ] For each: which other platform components could benefit from this change?
- [ ] For each: which other inner-AI-defaults entries relate to this pattern?
- [ ] For each: which other validators should be updated to reflect this insight?
- [ ] Run the CEC test: "Where else does the essence of this insight enhance other platform surfaces?"
- [ ] Register any synergy opportunities as VLTs or CEC notes in §10.0h

**Output format:**

```
SYNERGY AUDIT — Sweep 6
New artifacts this session: [list]
Synergy opportunities found: [N]
  [artifact]: → enhances [other_surface] via [mechanism] → [VLT or CEC note]
CEC complete when: [cycle returns 0 new opportunities]
```

---

## Abbreviated SAP — Session-Close Checklist (Sweeps 2+5)

Copy this into every session close §10.0:

```markdown
### SAP Abbreviated (Sweeps 2 + 5)

**Sweep 2 — Drift:**
- drift_coverage: ___% (previous: ___%)
- enforcement_rate: ___% (previous: ___%)
- validate-drift-registry.mjs: total=7 active=___ coverage=___% status=___
- Coverage delta: [advanced / unchanged / regressed]

**Sweep 5 — Contract Enforcement:**
- validate-inner-ai-defaults-enforcement-rate.mjs: rate=___% live=___ total=___
- K=2 candidates (deferred ≥2 sessions): ___
- Status: [IMPROVED / UNCHANGED / REGRESSED]

**Session-close invariants:**
- [ ] enforcement_rate >= ___% (this session ≥ previous session)
- [ ] drift_coverage >= ___% (this session ≥ previous session)
- [ ] If either decreased: VLT created → [VLT-ID]
```

---

## Integration Points

| Surface | How SAP integrates |
|---|---|
| `closing-summary-template.md §10` | §10.X SAP Abbreviated (Sweeps 2+5) — mandatory at every session close |
| `validate-inner-ai-defaults-enforcement-rate.mjs` | Provides Sweep 5 data |
| `validate-drift-registry.mjs` | Provides Sweep 2 data |
| `tools/config/drift-registry.yaml` | Sweep 2 source of truth |
| `tools/config/build-verification-map.yaml` | Sweep 1 not_proven field source |
| Opus consultation brief | All 6 sweeps are mandatory baseline evidence for Opus review |

---

## Composition

- [sonnet-capability-injection-S019.md Part E](../../plan/_handoff/VAULT/sonnet-capability-injection-S019.md) — spec source
- [drift-registry.yaml](../../../tools/config/drift-registry.yaml) — Sweep 2 canonical data
- [validate-drift-registry.mjs](../../../tools/validators/validate-drift-registry.mjs) — Sweep 2 validator
- [validate-inner-ai-defaults-enforcement-rate.mjs](../../../tools/validators/validate-inner-ai-defaults-enforcement-rate.mjs) — Sweep 5 validator
- [build-verification-map.yaml](../../../tools/config/build-verification-map.yaml) — Sweep 1 not_proven fields

---

**Protocol signature:** `S020-VALD-sonnet-audit-protocol-v1.0-2026-05-08`
