---
id: csps.pillar-0-governance.catch-pipeline-spec
name: catch-pipeline-spec
description: >
  Design spec for the Symmetric Catch Pipeline — 3 scopes × 2 polarities.
  P2-DESIGN grade: spec only. No hooks/validators yet (PHASEB, gated on
  cycle-counter reconciliation). Feeds Item-7 cluster ratification + P-META-037
  ratification.
version: "0.1-draft"
status: draft
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
session: S082
gated_by: "cycle-counter reconciliation (gap_CYCLE_COUNTER_DISCREPANCY) — PHASEB build blocked until verify instrument stabilized"
diataxis_type: explanation
impl_status: swift-implemented
links:
  - { rel: governing-principle, href: ../../../packages/principles/principles/P-META-019-structural-prevention-discipline.yaml }
  - { rel: governing-principle, href: ../../../packages/principles/principles/P-META-005-learning-loop.yaml }
  - { rel: contract, href: ./behavioral-contracts/B_STRUCTURAL_PREVENTION_DISCIPLINE.md }
  - { rel: contract, href: ./behavioral-contracts/B_POSITIVE_VALUE_EXTRACTION.md }
  - { rel: register, href: ../../../tools/data/improvement-register.yaml }
  - { rel: register, href: ../../../tools/data/gap-recurrence-register.yaml }
---

# Symmetric Catch Pipeline — Design Spec

**Status:** DRAFT — concept-grade. P2-DESIGN ONLY.
**What is NOT built yet:** hooks, validators, catch-register.yaml, front-end pages (PHASEB).
**What IS done:** spec + consolidation verdict + P-META-037 design seed (ratification pending).

---

## 1 — What Is a Catch?

A **catch** is any in-session detection of consequence, by any source:

| Attribute | Values |
|-----------|--------|
| **Polarity** | NEGATIVE (defect / gap / skipped enforcement / anti-pattern) OR POSITIVE (insight / improvement / confirmed good practice / positive event) |
| **Source** | Q-catch (Governor question triggered it) · Sonnet-catch (builder detected it) · Opus-catch (director detected it) · hook-catch (automated hook fired) |
| **Scope** | The catch itself is scope-0; processing through 3 scopes is mandatory |

**Key constraint:** Catch = detection event, not a failure event. Positive catches are equally mandatory to process through 3 scopes. The asymmetry of the current platform (negative = structural-prevention; positive = positive-value-extraction, two separate half-cycles) is the gap this spec closes.

---

## 2 — The Three Scopes

Every catch — regardless of polarity or source — routes through all three scopes:

```
SCOPE 1 — IMMEDIATE
  Fix or capture the instance NOW, in this session.
  Negative: fix the instance (or register it if unfixable now).
  Positive: capture the insight (write to permanent artifact NOW, not "later").
  Gate: Scope 1 must close before session ends.

SCOPE 2 — RIPPLE
  Where else does this apply?
  Negative: where else is this defect / enforcement gap present?
             → CEC-style scan of all affected surfaces.
  Positive: where else does this insight enhance?
             → CEC (Complete Extraction Cycle) — existing mechanism.
  Gate: Scope 2 must be explicitly discharged ("ripple complete" or
        "N surfaces scanned, M enhanced") — cannot be skipped.

SCOPE 3 — STRUCTURAL / CORE
  System change that PREVENTS recurrence (negative) OR
  INSTITUTIONALIZES the gain (positive).
  Negative: structural fix proposal → hardwire if K≥2 (P-META-019).
  Positive: embed in platform DNA, principle, contract, or validator.
  Gate: Scope 3 must produce a named artifact (proposal / PR / principle / contract)
        OR an explicit "Scope 3 not applicable — rationale: [...]".
```

---

## 3 — The Register Schema (planned: tools/data/catch-register.yaml)

**PHASEB — not built yet.** Schema spec:

```yaml
# Each catch row:
- id:                  "catch_SXXX_NN"       # session + sequence number
  polarity:            negative | positive
  source:              q-catch | sonnet-catch | opus-catch | hook-catch
  detected_session:    SXXX
  scope_1_immediate:
    action:            "what was fixed or captured"
    artifact:          "file:line or register entry created"
    closed:            true | false
  scope_2_ripple:
    surfaces_scanned:  N
    surfaces_enhanced: M
    summary:           "brief description"
    closed:            true | false
  scope_3_structural:
    proposal:          "structural fix proposal or institutionalization artifact"
    applicable:        true | false
    rationale_if_not:  "why Scope 3 not applicable"
    closed:            true | false
  status:              open | complete | deferred
```

---

## 4 — Consolidation Plan (PHASEB)

**Three existing registers to UNIFY into `tools/data/catch-register.yaml`** (none exist as files yet — they are named concepts in improvement-register.yaml and platform docs):

| Source | Role | Current State |
|--------|------|---------------|
| `continuous-drift-log` | Negative catches — drift/enforcement-skip records | Named in improvement-register; not yet a standalone file |
| `error-harvest` | Negative catches — session error collection | Named in improvement-register; not yet a standalone file |
| `positive-value-extraction` | Positive catches — insight/improvement records | Named in improvement-register; not yet a standalone file |

**Consolidation principle:** ALL THREE become a single `catch-register.yaml` with `polarity` field distinguishing negative vs positive catches. No data loss: every field from each source maps to the unified schema.

**Council push-back acknowledged:** If consolidating these three loses a field, the consolidation must not proceed. The field-mapping audit is a PHASEB gate task.

---

## 5 — P-META-037 Consolidation Verdict

### Question
Does P-META-037 (Symmetric Catch Processing) warrant a NEW principle, or is it an EXTENSION of P-META-005 (learning-loop) or P-META-019 (structural-prevention)?

### Analysis

**P-META-005 (learning-loop):**
- Scope: whole-platform INTAKE pipeline — every input stream into CSPS routes through observed → triaged → routed → fixing → validated → closed
- Granularity: platform-level state machine with SLAs, confidence thresholds, weekly audits
- Polarity: intake-neutral (handles what comes in, regardless of polarity)
- **Not the same:** P-META-005 is the macro-level routing mechanism for all platform inputs. P-META-037 governs in-session CATCH PROCESSING depth (how deeply a catch is processed in the session it's detected — immediate / ripple / structural). Different granularity, different lifecycle.

**P-META-019 (structural-prevention-discipline):**
- Scope: when enforcement is skipped/late/partial → fix the STRUCTURE, not the instance
- Polarity: NEGATIVE ONLY — responds to enforcement skips/gaps
- Mechanism: closing-summary §10.0j enhancement proposals; K=2 promotes to mandatory structural fix
- Enforcement: T3-ONLY (AGENTS.md + session-open) — no T1 hook, no T2 validator (the "deepest irony")
- **Not the same:** P-META-019 is the negative-polarity half of P-META-037's Scope 3. P-META-037 adds the positive half + unifies scopes 1 and 2 that P-META-019 never defined.

### Verdict: **P-META-037 is warranted as a new principle.**

**Rationale:**
1. P-META-005 operates at different granularity (platform routing machine vs in-session scope processing). No overlap.
2. P-META-019 covers only Scope 3 negative polarity. P-META-037 covers both polarities × all 3 scopes.
3. P-META-037 fills the gap: there is no symmetric bilateral framework — only two separate half-cycles (structural-prevention for negative, positive-value-extraction for positive).
4. P-META-037 is the PARENT of P-META-019 (negative Scope 3) + positive-value-extraction (positive Scope 3). It extends and unifies both, not duplicates either.

**No-Orphans parent:** P-META-037 ∈ GVRN spine, L2 governance domain. No-Orphans Law satisfied by this declaration.

**P-META-037 is NOT minted in this build** — ratification happens at Item-7 cluster gate. This spec is the design input.

---

## 6 — Planned Hardwire (PHASEB — 7 surfaces, HARDWIRE protocol)

NOT built until cycle-counter reconciliation clears.

| Surface | Artifact | Description |
|---------|----------|-------------|
| T1 hook (BLOCKS) | `.claude/hooks/post-stop-catch-3scope-gate.sh` | Blocks session close if catch logged without all-3-scope disposition |
| T2 validator (exits-1) | `tools/validators/validate-catch-3scope-coverage.mjs` | Added to pnpm verify |
| T3 session | `session-open.sh` injection | "every catch → 3 scopes × 2 polarities" |
| Block-test | `tools/tests/behavioral/catch-3scope-test.sh` | Proves T1 blocks an under-processed catch |
| SP-registry | `tools/data/hardwire-register.yaml` entry | Satisfaction-point registration |
| Audit-runner | audit pipeline entry | Periodic coverage check |
| verify=0 | RE-RUN pnpm verify → exit_code=0 | Gate after all surfaces deployed |

**Also:** B_STRUCTURAL_PREVENTION_DISCIPLINE gets its missing T1+T2 (currently T3-only) as the negative-polarity branch of P-META-037's Scope 3 enforcement. This closes the "deepest irony."

---

## 7 — Cross-References

- `P-META-019-structural-prevention-discipline.yaml` — negative Scope 3 child (currently T3-only; gets T1+T2 in PHASEB)
- `tools/data/improvement-register.yaml` — existing catches tracked here until catch-register.yaml exists
- `tools/data/gap-recurrence-register.yaml` — existing negative catches (structural gaps with K-counts)
- `B_STRUCTURAL_PREVENTION_DISCIPLINE.md` — contract for negative Scope 3
- `B_POSITIVE_VALUE_EXTRACTION.md` — contract for positive Scope 3
- `feedback_structural_prevention_discipline.md` — memory
- `feedback_positive_value_extraction.md` — memory

---
*DRAFT — P2-DESIGN only. PHASEB build gated on verify instrument stabilization.*
