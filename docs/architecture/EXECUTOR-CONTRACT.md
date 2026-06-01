---
id: csps.architecture.executor-contract
name: EXECUTOR-CONTRACT
description: >
  Model-agnostic executor contract — the 4 clauses any executor (Opus, Sonnet, one-agent, CI, Governor)
  must satisfy to participate in CSPS quality governance. The Opus/Sonnet council is ONE IMPLEMENTATION
  of this contract (the mutual-review amplifier above the floor, not the floor itself).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
quality_state: validated
core_spine: ARCH
core_spines: [ARCH, GVRN, AI]
schema_anchor: vault_files
session: S076
authored_by: Sonnet S076
layer: system
links:
  - { rel: source-spec, href: ../../docs/plan/_handoff/VAULT/SANDBOX-agent-decoupling-spec-S076.md }
  - { rel: validator, href: ../../tools/validators/validate-executor-contract.mjs }
  - { rel: layer-split, href: ../../tools/validators/validate-layer-split.mjs }
  - { rel: deletion-test, href: ../../tools/validators/validate-agent-deletion-test.mjs }
---

# CSPS Executor Contract v1.0

**Status**: RATIFIED (S076 Phase D, Opus-16 OPIA)
**Layer**: system — applies to any executor, model-agnostic

---

## The Contract

```
CSPS EXECUTOR CONTRACT v1.0
════════════════════════════════════════════════════════════════════
Applies to: Opus, Sonnet, one-agent, different-model, CI verifier, Governor
Any executor satisfying this contract participates in CSPS quality governance.
════════════════════════════════════════════════════════════════════

CLAUSE 1 — CITE EVIDENCE
  Every state-claim (DONE / SEAL / VERIFIED / ACCEPTED / BLOCKED)
  includes a THIS-SESSION tool result proving it.
  Memory of a prior run ≠ evidence. Re-run IS the proof.
  T1: pre-tool-use-rzf-evidence-gate.sh
  T2: validate-nominal-rzf-detector.mjs

CLAUSE 2 — VERIFY-BEFORE-SEAL
  Before any SEAL/DONE/RATIFIED claim: verify.mjs exit_code=0 cited
  in the same message as the claim.
  T1: post-stop-pnpm-verify.sh
  T2: validate-push-status.mjs

CLAUSE 3 — THRESHOLD-ROUTING
  Every new intent: threshold routing before implementation begins.
  No code without a plan item. No plan item = exploration only.
  T1: pre-tool-use-plan-coverage-gate.sh
  T2: validate-completion-before-new.mjs

CLAUSE 4 — SP-REGISTRY-COMPLIANCE
  Every completion checked against satisfaction_point.verify_mechanically
  before marking done. File written ≠ done. Mechanism verified = done.
  T1: post-stop-exists-not-equals-active.sh
  T2: validate-satisfaction-point-coverage.mjs
════════════════════════════════════════════════════════════════════
```

---

## How Implementations Relate to the Contract

```
EXECUTOR CONTRACT (floor — system layer, permanent)
        │
        ├─ Opus/Sonnet mutual-review council (amplifier — scaffold layer)
        │   The council adds quality via independent re-derivation ABOVE the floor.
        │   It is NOT the floor. If the council goes away, the floor remains.
        │
        ├─ One-agent + self-review loop (alternative implementation)
        │   Satisfies the contract without a second agent.
        │   Quality ceiling is lower (no independent re-derivation).
        │
        └─ CI verifier + human spot-check (CI implementation)
            verify.mjs runs in CI. Pre-commit hooks run in git.
            Clauses 2+3+4 are fully CI-compatible.
            Clause 1 requires validate-nominal-rzf-detector promotion to BLOCKING
            for complete CI coverage (Q3, pending clean-window).
```

---

## What Changes Per Implementation

| Feature | Council (current) | One-agent | CI verifier |
|---------|------------------|-----------|-------------|
| Clause 1 (cite evidence) | ✓ both agents | ✓ single agent | ⚠ advisory only until Q3 |
| Clause 2 (verify-before-seal) | ✓ | ✓ | ✓ (pnpm verify in CI) |
| Clause 3 (threshold routing) | ✓ | ✓ | Human-gated |
| Clause 4 (SP-registry) | ✓ | ✓ | ✓ (pre-commit hooks) |
| Quality amplifier | Opus re-derives Sonnet | Self-review | Human spot-check |
| OPIA gate | ✓ | ❌ (no second agent) | ❌ (human-only) |

---

## What the Council ADDS (amplifier, not contract)

The Opus/Sonnet mutual-review council is an **amplifier** that raises quality above the Contract floor:

1. **Independent re-derivation**: Opus re-runs the tool output Sonnet claims. Neither trusts the other's assertion alone (D14 — unverified-agreement). This is strictly ABOVE Clause 1.
2. **Director-role defaults (D15-D18)**: Opus applies director-specific scrutiny (pasted-command-as-go, cascade-approval awareness). These apply ONLY when the council is active. Classified `layer: scaffold`.
3. **OPIA gate**: The ACCEPT/SEAL verdict requires a director re-run. No OPIA equivalent exists in one-agent or CI. The floor survives; the amplifier does not.

---

## Validator

```bash
node tools/validators/validate-executor-contract.mjs
# exit 0 = all 4 clauses have system-layer T1+T2
# exit 1 = one or more clauses missing T1 or T2
```

Registered in `tools/verify.mjs` as `executor_contract` (STANDARD tier).

---

## Author
Sonnet S076 | Phase D | Ratified per OPIA (Opus-16) | 2026-06-01
Layer: system | Core spine: ARCH
