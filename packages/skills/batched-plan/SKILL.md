---
name: batched-plan
description: Structures upfront-acceptance proposal for N≥3 similar operations. Per P-OP-004 (batched execution) — agree acceptance criteria upfront, batch execute, single completion summary. NO mechanical micro-stops. Triggers on "do this for X, Y, Z", "apply to all", "for each of N", or detection of ≥3 similar pending operations.
allowed_tools: []
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: []
sensitive_data_access: false
backed_by_principle: P-OP-004
generated_by: principles-codegen
generated_from: packages/principles/principles.yaml#P-OP-004
last_generated_at: 2026-05-03T08:30:00Z
references_future_artifact: true
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
# ─── AAP frontmatter (S005 turn 26 retrofit per P-META-010 + B_AGENT_ALIGNMENT_PROTOCOL) ───
csps_aligned: true
aap_version: 1.0
agent_class: A
acknowledged_contracts:
  - B_AI_PROFESSIONAL_VOICE       # banned-phrase list applies (no per-item confirmation in batch)
  - B_VALIDATE_BEFORE_ASSUME
respects_quality_gates: [QG1, QG2, QG3, QG4]
output_contract:
  returns: structured-batch-proposal
  max_tokens: 1500
  no_synthesis_outside_main: true
  no_ratification_claims: true
trust_tier: platform-owned
eval_baseline:
  test_corpus_path: tests/skills/batched-plan/test-fixtures.json
  expected_pass_rate: 0.95
preflight_check_required: true
principle_compliance:
  - P-META-010    # AAP — operates under agent-alignment-protocol
  - P-META-002    # principles-travel-with-artifacts
consolidation_cross_refs: []    # empty = genuinely-novel skill per B_CONSOLIDATION_PASS

---

# /batched-plan — Upfront-acceptance batch execution proposal

## When to invoke

When you detect or are asked to perform N≥3 similar operations:
- 3+ files to refactor with the same pattern
- 3+ slices to scaffold
- 3+ leaves to migrate
- 3+ frontmatter backfills
- 3+ test fixtures to write

## When to skip

- N=1 or N=2 (just do them; batching overhead exceeds value)
- Operations are NOT similar (each requires its own design — not a batch)
- The user has already approved a different mode (e.g., autonomous-overnight per B_AUTONOMY_4_CONDITIONS)

## Procedure

1. **Enumerate the N operations** — list explicitly
2. **Extract the common shape** — what's identical across all N?
3. **Identify the per-item variants** — what differs per N?
4. **Define acceptance criteria upfront** — what does "done" look like for each item AND for the batch?
5. **Wait for ONE approval** — single user response covers all N
6. **Execute the batch** — no per-item approval requests (banned per AGENTS.md confirmation-seeking NO)
7. **Emit single completion summary** with per-item status + deviations flagged

## Output format (the proposal)

```markdown
## Batched plan — <batch name>

**Operations to execute (N=<count>):**
1. <operation 1>
2. <operation 2>
3. ...

**Common shape (applies to all):**
- <shared invariant 1>
- <shared invariant 2>

**Per-item variants:**
| # | Item | Variant detail |
|---|---|---|
| 1 | ... | ... |
| 2 | ... | ... |

**Acceptance criteria:**
- Each item: <per-item definition of done>
- Batch as a whole: <aggregate definition of done>

**Estimated total operations:** <count>
**Reversibility:** ✅ all reversible via git / ⚠️ N items irreversible

**Single approval requested.** No per-item confirmation will be sought during execution.
```

## Discipline rules

1. **One approval covers ALL N** — per-item confirmation requests during execution are forbidden (per `B_AI_PROFESSIONAL_VOICE` banned-phrase list S002 turn 19)
2. **Mid-batch scope change requires pause + re-confirm** — silent scope expansion is the anti-pattern; explicit reconfirmation is required
3. **Single completion summary** — emit once after all N done; flag deviations
4. **Counterweight (Mission Command disciplined initiative)** — within batch scope, AI may exercise judgment on minor variations; major variation = pause

## Industry lineage

- Mission Command (commander's intent + disciplined initiative within scope)
- Lean / Toyota one-piece flow (counter-example: batches OK when overhead per-item exceeds batch overhead per-batch)
- Amazon "two-pizza team" autonomy — single approval covers a sprint of work

## Backed by

P-OP-004 (Batched execution). Full text in [packages/principles/principles.yaml#P-OP-004](../../principles/principles.yaml).
