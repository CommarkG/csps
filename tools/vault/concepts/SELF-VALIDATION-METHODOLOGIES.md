---
id: vault.concepts.SELF-VALIDATION-METHODOLOGIES
name: SELF-VALIDATION-METHODOLOGIES
description: "5 established methodologies for platforms that validate their own governance effectiveness. Sourced from Reflexive Systems, Online Self-Correction, MAPE-K, Governance-Embedded Validation, and Self-Healing patterns. Mapped directly to CSPS gaps."
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spines: [VALD, ARCH, AI]
core_spine: VALD
schema_anchor: vault_files
version: "1.0"
session: S053
impl_status: swift-implemented
links:
  - csps.governance.PLATFORM-GENOME
  - csps.data.gap-recurrence-register
  - csps.data.improvement-register
  - csps.governance.THE-IDEAL-BUILD
context_question: "For each CSPS governance mechanism, is it reflexive (findings causally patch enforcement surfaces) or merely introspective (findings are logged but don't trigger automated changes)?"
context_quote: "A system is reflexive when its internal representation of its own structure causally intervenes in its behavior — not just observes, but modifies. The gap between 'we logged a recurrence' and 'we patched the enforcement surface' is the reflexivity gap."
---

# Self-Validation Methodologies

> External research mapped to CSPS. Used for: playground self-validation page design,
> gap identification, and audit pipeline architecture.
> Source: Agent research, S053.

---

## Methodology 1 — Reflexive Systems Architecture

**Definition**: A system is reflexive when its internal representation of its own structure causally intervenes in its behavior — not just observes, but modifies. Introspection describes; reflexivity modifies.

**Key Principles**:
- The self-model must be causally wired to outputs (not decorative)
- The representation changes when behavior changes
- Observation loops are distinct from modification loops

**CSPS Current State**: gap-recurrence-register.yaml is introspective (logs recurrences). To become reflexive, findings must wire directly to hook/validator modification.

**CSPS Gap**: K=6 for nominal ZF cycles. The register logs K=6. Nothing automatically patches the enforcement surface when K crosses a threshold.

**CSPS Solution Direction**: validate-gap-recurrence.mjs at K>=3 blocks session close — this IS a reflexive intervention. The missing piece: at K>=2, a SUGGESTED fix is automatically drafted (not just blocked).

---

## Methodology 2 — Online Self-Correction Loop

**Definition**: Errors detected and corrected during inference (online), not post-hoc (batch). Separate corrector module with different reward function from generator. Interleaved correction outperforms end-of-pass by 18.5%.

**Key Principles**:
- Correction is a separate architectural layer from generation
- Corrections feed back as training signal
- The loop is online (continuous), not batch

**CSPS Current State**: validate-zf-cycle-format.mjs is batch (post-session close).

**CSPS Gap**: Nominal ZF written at Turn 10 isn't caught until session close (iter 25+ in this session).

**CSPS Solution Direction**: per-turn ZF check (9112449 in S054) — fires after every stop, not just at close. This IS the online corrector implementation.

---

## Methodology 3 — Closed-Loop Quality / MAPE-K

**Definition**: Monitor → Analyze → Plan → Execute over a Knowledge base. The knowledge base must update from loop outputs, not just from human ratification.

**Key Principles**:
- Knowledge base is a first-class artifact, not implicit memory
- Monitor and executor are architecturally decoupled
- Every loop iteration produces a verifiable evidence artifact

**CSPS Mapping**:
| MAPE-K | CSPS Implementation |
|---|---|
| Monitor | gap-recurrence-register.yaml |
| Analyze | improvement-register.yaml |
| Plan | unified-plan.yaml (PE scoring) |
| Execute | hooks + validators |
| Knowledge | principles.yaml + PLATFORM-GENOME.md |

**CSPS Gap**: Knowledge base (principles.yaml, contracts) does NOT update from loop outputs automatically. Human ratification required for every update.

**CSPS Solution Direction**: Core Signal Finder (ratified S052) is the Analyze-to-Knowledge pathway. Needs T2 enforcement (CEC validator).

---

## Methodology 4 — Governance-Embedded Validation

**Definition**: Validate at the point of creation, not at review. Governance metrics aggregated as observable signals. Validation embedded in write path catches 80%+ of errors vs. 20% for post-hoc audits.

**Key Principles**:
- Validate at creation, not at review
- Schema changes require version-controlled justification
- Observability includes governance metrics, not just performance

**CSPS Current State**: Write-path hooks (pre-tool-use-*.sh) — this is the correct pattern ✓

**CSPS Gap**: No governance metrics dashboard showing: hook violations per session, DNA validation pass rate per commit, contract violation frequency. This data exists in hook outputs but is not aggregated.

**CSPS Solution Direction**: Simulation Hub (/platform/simulation/) has the gap register and behavioral test results. Missing: governance observability dashboard with aggregate metrics over sessions.

---

## Methodology 5 — Self-Healing Patterns (Meta-Validator Layer)

**Definition**: Healing layer must be architecturally above or beside the layer being healed. Self-diagnosis of the same layer you operate on is unreliable. Five canonical patterns: Health Check + Auto-Restart, Circuit Breaker, Bulkhead, Retry with Backoff, Saga/Compensating Transaction.

**Key Principles**:
- Healing agent is architecturally separate from the layer being healed
- Every heal action produces an audit artifact
- Compensating transactions defined before failure, not after

**CSPS Gap**: Validators are at the same architectural layer as what they validate (both in tools/). Nothing governs whether the behavioral contracts are FIRING CORRECTLY except manual session review.

**CSPS Solution Direction**: A meta-validator layer: `validate-validators.mjs` — checks that registered validators actually ran last session, produced results, and haven't been silently bypassed. This would catch the case where a T2 validator exists but is never triggered.

---

## Synthesis — Three Requirements CSPS Needs

All 5 methodologies agree on three missing elements:

1. **Reflexivity Gap**: Knowledge/contract layer must update from loop outputs, not just human ratification. Core Signal Finder → CEC validator → automatic contract suggestions.

2. **Governance Observability**: Aggregate governance metrics as a dashboard signal. Not per-run outputs — session-level trends, K count visualizations, contract violation frequency over time.

3. **Meta-Validator Layer**: A layer architecturally above governance that validates whether governance is actually firing. Currently: no mechanism catches "this T2 validator exists but has fired 0 times in 20 sessions."

**CSPS Strongest Asset**: write-path hook pattern (Methodology 4) — already implemented.
**CSPS Biggest Gap**: Reflexivity — findings log, don't automatically patch enforcement surfaces.

---

## Implementation Roadmap for CSPS

| Methodology | Current | Target | Priority |
|---|---|---|---|
| Reflexive | K logging only | K >= threshold → automated fix suggestion | S055 |
| Online correction | post-session batch | per-turn (9112449 implementing) | S054 ✓ |
| MAPE-K | partial | CEC validator auto-updates Knowledge base | S055 |
| Governance-embedded | write-path hooks ✓ | + governance metrics dashboard | S054 |
| Meta-validator | none | validate-validators.mjs | S055 |

---

*Self-Validation Methodologies | S053 | Research by Agent subagent*
*For playground page: /platform/self-validation/*
*For recurring audit: audit-runner.md pipeline "self-validation-coverage"*
