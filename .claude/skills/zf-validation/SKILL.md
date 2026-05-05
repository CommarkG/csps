---
name: zf-validation
description: When running validation cycles OR before any DONE/RATIFIED/VALIDATED/CLOSED claim OR composing closing-summary §10.0 verification block — load Zero-Findings discipline + RZF (Re-Zero Findings) + CEC (Complete Extraction Cycle) + meta-RZF + pnpm verify orchestrator + cycle taxonomy. Triggers on "ZF", "RZF", "CEC", "verify", "zero findings", "validation", "pnpm verify", "DONE", "RATIFIED", "VALIDATED", "CLOSED", "evidence block".
allowed_tools: [Read, Bash, Grep]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-META-006
backed_by_contract: B_RZF
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_RZF
  - B_PRE_CLOSE_VERIFICATION
  - B_POSITIVE_VALUE_EXTRACTION
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-zf-evidence-block-or-cycle-status
  max_tokens: 2000
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

---

# /zf-validation — Zero-Findings Discipline Reference

## When to invoke

- Before emitting any DONE / COMPLETE / RATIFIED / VALIDATED / CLOSED claim
- Composing closing-summary §10.0 / §10.10 / §10.11 / §10.13 evidence blocks
- Running `pnpm verify` orchestrator at session-close gate

## When to skip (counterweight)

Trivial in-flight microsteps (single-line edit / typo fix / linting auto-fix) — the cycle is the next batch boundary's responsibility.

## The 3 disciplines (P-META-006)

### RZF — Re-Zero Findings
- Re-run IS the proof
- Memory of earlier validator runs ≠ this-session evidence
- Every artifact reaching DONE/RATIFIED/VALIDATED/CLOSED emits evidence block
- Cycle count is MEASUREMENT not TARGET (CSP S227 origin)

### CEC — Complete Extraction Cycle
- After every ratification: walk platform asking "where does the essence enhance other elements?"
- Iterate until cycle returns 0 new opportunities
- Counters AI's universal "ratify, move on" default
- Trigger set extended (S005 turn 20): ratifications + insights + user-directives + improvements + EXT-IDs + bug-fixes + AI-self-corrections + generator-outputs + meta-findings

### Meta-RZF
- Apply RZF process to RZF process itself
- Catches process-drift in the validation pattern
- CSP S227 + CSPS turn-10 extension

## pnpm verify orchestrator (P-META-008 + B_PRE_CLOSE_VERIFICATION)

`tools/verify.mjs` runs 7 cycles:

| Cycle | Default | Strict |
|---|---|---|
| `pnpm_install_frozen` | DEFERRED-WITH-REASON ok | mandatory |
| `typecheck_recursive` | PASS required | PASS required |
| `principles_validate` | PASS required (0 findings) | PASS required |
| `frontmatter_validate` | errors=0 (warnings allowed) | warnings=0 also |
| `aap_frontmatter_coverage` | PASS required | PASS required |
| `principle_count_staleness` | PASS required | PASS required |
| `audit_runner_full_pass` | DEFERRED-WITH-REASON ok (week-4 ship) | mandatory once shipped |

Pre-close mandatory: paste structured output into closing-summary §10.0 BEFORE emitting any §10.10 RZF block.

## Evidence block structure

```yaml
rzf_aggregate:
  scope: <which artifacts>
  cycles_run: <N>
  total_findings: <count + categorization>
  status_per_artifact: ZF-0-ACHIEVED-CYCLE-<N>
  validators_run: <list>
  meta_rzf_cycle: applied? PASS/FAIL
  signature: S<NNN>-AI-rzf-<iso>-<scope>
```

## Anti-patterns

- nominal-RZF (RZF block emitted without paired `pnpm verify` stdout same-session)
- compressed-RZF-under-context-pressure (defer to next session with BLK-* instead)
- single-cycle-claim-when-multiple-needed (cycle count is data, not target)
- ratify-and-move-on (CEC trigger missed)

## Backed by

P-META-006 Zero-Findings Discipline (CSP S333 / treasure #5 EXT-20260502-005) + B_RZF (S002 turn 10) + B_PRE_CLOSE_VERIFICATION (S005 turn 19) + B_POSITIVE_VALUE_EXTRACTION (S005 turn 20). Full canonical: [zero-findings-discipline.md](../../../docs/plan/pillar-0-governance/zero-findings-discipline.md).
