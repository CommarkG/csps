---
name: verify-quick
description: Runs pnpm verify in condensed mode and outputs a single-line summary with exit_code + first failing validator name. Replaces the 25-line verify ritual. Triggers on "verify-quick", "quick verify", "run verify", "check verify", "pnpm verify" when user wants a fast gate check.
allowed_tools: [Bash]
allowed_subagents: []
allowed_outbound_hosts: []
sensitive_data_access: false
backed_by_principle: P-META-006
backed_by_contract: B_PRE_CLOSE_VERIFICATION
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE
  - B_VALIDATE_BEFORE_ASSUME
  - B_PRE_CLOSE_VERIFICATION
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: one-line verify summary
  max_tokens: 200
  no_synthesis_outside_main: true
trust_tier: platform-owned
preflight_check_required: false
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-006    # RZF — re-zero-findings, this skill is the verification step
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []
scope_level: S1
batch: BATCH-L
template_grade: A
parent_template: skill-base
links:
  - { rel: verify-mjs, href: ../../../../tools/verify.mjs }
---

# /verify-quick — Condensed Verify Gate

## When to invoke

- Before any DONE/SEALED/COMPLETE claim (required — see gap_DONE_CLAIM K=4 fix)
- End of a work chunk before committing
- After any code change to confirm no regressions
- When Governor or Opus asks "is verify clean?"

## Execution

Run exactly:
```bash
node tools/verify.mjs --skip-install 2>&1 | tail -30
```

Then extract and output in this format:
```
[verify-quick] exit_code=N | validators=N | PASS=N | FAIL=0
```

If FAIL > 0:
```
[verify-quick] exit_code=1 | FAIL: <first-failing-validator-name>
Fix before proceeding.
```

## Output rules

- Single line summary only — do NOT paste the full JSON
- Always include exit_code, validator count, and first FAIL name if any
- This is THIS-SESSION evidence — valid for THIS-HEAD claims

## Composability

- Used by /zf-cycle (embeds verify evidence)
- Used by /step-accept (re-runs for ADVANCE evidence)
- Used directly whenever a quick gate check is needed

## Anti-pattern

Do NOT pipe to `| grep` and claim it "passed" — run the full output and check the outer `exit_code` field (the last JSON key, no trailing comma).
