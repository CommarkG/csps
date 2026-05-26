---
name: step-accept
description: Given commit SHA(s) and a STEP claim, re-runs implied validators, and outputs a 1-line ACCEPTED/COURSE-CORRECT verdict with cited evidence. Prevents nominal DONE claims. Composes /verify-quick and /zf-cycle. Triggers on "step-accept", "accept this step", "verify step", "is STEP N done", "evaluate step", "step complete check".
allowed_tools: [Bash, Read, Grep]
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
  returns: ACCEPTED or COURSE-CORRECT verdict + evidence
  max_tokens: 300
  no_synthesis_outside_main: true
trust_tier: platform-owned
preflight_check_required: false
principle_compliance:
  - P-META-010
  - P-META-006
  - P-META-002
consolidation_cross_refs: []
scope_level: S1
batch: BATCH-L
template_grade: A
parent_template: skill-base
links:
  - { rel: verify-quick, href: ../verify-quick/SKILL.md }
  - { rel: zf-cycle, href: ../zf-cycle/SKILL.md }
---

# /step-accept — Step Completion Evaluator

## When to invoke

- Sonnet is about to claim a STEP is DONE and wants THIS-TURN evidence
- Opus is evaluating a Sonnet step-complete report before issuing ADVANCE
- Governor wants a quick verdict before relaying to Opus
- After a commit chain lands and verify needs re-confirmation

## Required inputs

1. Commit SHA(s) that represent the step work
2. STEP claim (e.g., "STEP 2 complete — 66 contracts migrated")
3. What the DONE criteria for this step were (from the PROTO file)

## Execution

1. Run `/verify-quick` (confirms THIS-HEAD exit_code=0)
2. Check the specific files changed in the commit SHA(s):
   ```bash
   git show --stat <SHA> | head -20
   ```
3. Cross-check against the DONE criteria — are the expected files present?
4. Run `/zf-cycle` with the evidence

## Output format

**ACCEPTED:**
```
[step-accept] ACCEPTED — STEP N: <claim>
Evidence: commit <SHA> modified <N> files (git show --stat), verify exit_code=0
<ZF Cycle 1+2 block>
```

**COURSE-CORRECT:**
```
[step-accept] COURSE-CORRECT — STEP N: <claim>
Issue: <specific gap between claim and evidence>
Fix: <what still needs to happen>
```

## Rules

1. NEVER output ACCEPTED without running /verify-quick in this turn
2. NEVER output ACCEPTED if verify exit_code=1
3. The ZF block must cite actual file names (not descriptions) — use /zf-cycle
4. COURSE-CORRECT is not failure — it's honest reporting that prevents gap_DONE_CLAIM recurrence
5. If DONE criteria were not provided, ASK before outputting a verdict

## The pattern this prevents

gap_DONE_CLAIM_BEFORE_VALIDATOR_CONFIRMS (K=4 in S062): claiming DONE when verify hasn't been run THIS-HEAD. /step-accept makes the evidence requirement mechanical.
