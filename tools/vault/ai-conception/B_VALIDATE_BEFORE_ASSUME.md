---
id: ai-conception.B_VALIDATE_BEFORE_ASSUME
name: B-VALIDATE-BEFORE-ASSUME
description: "AI conception pattern: every state claim (exit_code=0, validators=N, commit sha, blocking=N) must cite THIS-SESSION tool output as evidence. Memory of earlier runs is not evidence. Re-run IS the proof."
type: conception_pattern
protection_level: sacred
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S042
core_spines: [VALD, AI]
core_spine: VALD
schema_anchor: vault_files
links:
  - ai-conception.B_FALSE_ASSUMPTION_CHECK
  - ai-conception.B_ZF_TERMINATION_DISCIPLINE
impl_status: swift-implemented
context_question: "Does this response contain a state claim (exit_code, validators count, commit SHA, blocking count)? If yes — is there a THIS-SESSION tool call in this same response proving it?"
context_quote: "Memory of an earlier call is not evidence. Re-run IS the proof."
inherits_from: "Platform Genome §1 Behavioral Contracts + P-META-006 RZF"
enforcement_tier:
  T1: "pre-tool-use-state-claim-gate.sh — PreToolUse advisory on council writes (S059 PROTO-G)"
  T2: "validate-state-claims.mjs — advisory scan in pnpm verify (S059 PROTO-G)"
  T3: "post-tool-use-validate-before-assume.sh — PostToolUse advisory (S042+)"
---

# B_VALIDATE_BEFORE_ASSUME

## The Failure Pattern (what was happening)

```
Sonnet reports: "validators=157, exit_code=0" ← cited from memory, no this-session tool call
Opus reads: "confirmed ✓"
Reality: the verify run was 3 turns ago. Current state may differ.
```

This is wrong. The number is cited from conversational memory, not from a THIS-SESSION tool call.

## The Correct Pattern

```
State claim: "exit_code=0 ✓"
Evidence: node tools/verify.mjs → output in this response showing "exit_code": 0
```

The tool call AND the claim appear in the same response. The tool output IS the evidence.

## The Rule

**Every state claim must be backed by THIS-SESSION evidence:**

| Claim type | Required evidence |
|---|---|
| `exit_code=0` | `node tools/verify.mjs` output in this response |
| `validators=N` | Grep of verify-last-run.md in this response |
| `commit: [sha]` | `git rev-parse HEAD` in this response |
| `blocking=0` / `advisory=N` | Validator run output in this response |
| `K=N` | Read of gap-recurrence-register.yaml in this response |
| `B passed` | Behavioral test run in this response |

## What Is NOT Evidence

- "Confirmed from earlier in this session" → NOT evidence
- "Per the Opus Turn receipt" → NOT evidence (that was a different response)
- "From the last pnpm verify run" → NOT evidence (different turn)
- Citing a commit SHA from a git push 5 turns ago → NOT evidence

## The Satisfaction Point Being Prevented

The AI is "satisfied" when it has stated a number that sounds plausible. The satisfaction point fires on STATING THE CLAIM, not on VERIFYING IT. This contract moves the satisfaction point to: tool output seen in THIS response.

## Session Evidence

S002 Governor self-audit failure: claimed "uploads not visible" without checking message body for document blocks.
P-META-006 origin: "re-run IS the proof" — the memory of a proof is not a proof.
post-tool-use-validate-before-assume.sh: existing PostToolUse advisory enforcing this since S042.

## Where This Applies

All CSPS output files, especially:
- tools/council/sonnet-turn.md (Sonnet reports to Opus)
- HANDOFF files (session-close state claims)
- Any PROTO completion report

---

*AI Conception Vault entry | S059 PROTO-G | Protection: sacred*
*Companion to B_FALSE_ASSUMPTION_CHECK (communication boundaries) and B_ZF_TERMINATION_DISCIPLINE (ZF cycles)*
