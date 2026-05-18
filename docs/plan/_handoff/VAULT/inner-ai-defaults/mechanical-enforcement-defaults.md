---
id: csps.handoff.vault.inner-ai-defaults.mechanical-enforcement-defaults
name: mechanical-enforcement-defaults
description: "Deep dive on the 6 training defaults that cause mechanical enforcement failure. Why AI stops at documentation instead of enforcement. CSPS overrides with reasoning. The most important inner-AI-defaults file for structural integrity."
version: 1.1
governing_principles: [P-META-027, P-META-026, P-META-019, P-META-006]
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
diataxis_type: reference
session: S041
scope_level: S1
links:
  - { rel: parent, href: ./README.md }
  - { rel: enforcement-rate, href: ./enforcement-coverage.md }
  - { rel: trigger-vocabulary, href: ./trigger-vocabulary.md }
  - { rel: contracts, href: ../../../../docs/plan/pillar-0-governance/behavioral-contracts.md }
---

# Mechanical Enforcement Defaults — Deep Dive

> **This is the most important inner-AI-defaults document for platform integrity.**
> 60 of 62 behavioral contracts have zero mechanical enforcement.
> This file explains WHY — and how to change the default permanently.

---

## The Root Cause (one sentence)

**Claude's training default: "Writing a rule = completing the governance act."**

CSPS requires: "Writing a rule = beginning the governance act. T1+T2+T3 = completion."

---

## The 6 Training Defaults Causing Enforcement Failure

### DEFAULT-ME-1: Rule Text = Done With Rule

**Training default:**
When an AI writes a behavioral contract, principle, or Hard NO, the training considers the governance act COMPLETE. The satisfaction point fires at: "rule text exists in the artifact."

**Why this default exists:**
In general software contexts, documentation IS the deliverable. A README describing how to use a library IS the output. Claude's training optimized for "produce the artifact → done." There is no concept in general training of "the artifact must also have a mechanical enforcer."

**Where it fires in CSPS:**
- Creating B_* contracts in behavioral-contracts.md → satisfaction fires → session closes → T1/T2 never built
- Adding Hard NOs to AGENTS.md → satisfaction fires → no hook catches violations
- Writing "never do X" in a principle → satisfaction fires → no validator enforces it
- The audit result: 60/62 contracts, zero mechanical enforcement

**CSPS override:**
```
Training default: rule text = complete
CSPS override:   rule text = 0% complete
                 T1 hook declared = 33% complete
                 T2 validator wired + BLOCKING = 66% complete
                 T3 session injection = 100% complete
```

**The correct satisfaction point:**
NOT: "I've written the contract."
YES: "pnpm verify exit_code=0 with the T2 validator wired and BLOCKING. The T1 hook fires on the next violation. session-open.sh injects the T3 reminder."

**Why this matters more than anything else:**
A rule without T1+T2 is a suggestion. The AI will follow it for approximately 10 turns — until context pressure or a new topic displaces it. Then it silently disappears. A T1+T2 rule fires REGARDLESS of AI cooperation. That is the structural moat.

---

### DEFAULT-ME-2: Governance = Documentation

**Training default:**
A well-written governance document = the thing is governed. A detailed AGENTS.md = behavior is constrained. A comprehensive principle = the principle is active.

**Why this default exists:**
In professional environments, documentation IS governance. A policy document published by Legal = the company follows it. Claude learned: "well-documented rule → governed behavior." But enforcement mechanisms are absent from training data.

**Where it fires in CSPS:**
- AGENTS.md grows to 199 lines → AI treats it as strong enforcement → but it's T3-only
- B_RZF is documented in detail → AI treats documentation depth as enforcement depth → it's not
- 65 principles in principles.yaml → AI treats this as 65 enforced behaviors → ~5 have validators

**CSPS override:**
```
Training default: documented = enforced
CSPS override:   documented = declared intention, not enforcement
                 enforced = T1 hook + T2 validator + T3 injection ALL PRESENT
```

**The AI deep instruction:**
"Documentation is the map, not the territory. A behavioral contract without a validator is a wish. The territory is pnpm verify. If validate-enforcement-trio-assigned.mjs reports advisory_gaps=N, that N represents drift exposure. Every session that closes without reducing N is a session that made the platform less reliable."

---

### DEFAULT-ME-3: T3 Injection = Sufficient Enforcement

**Training default:**
If the rule is in session-open.sh, the AI knows it. If the AI knows it, it follows it. Therefore T3 session injection = enforcement.

**Why this default exists:**
Claude is trained to follow instructions. If you tell Claude something at the start of a conversation, it reliably follows it — for that conversation. Claude doesn't model the difference between "instruction in context" and "permanent mechanical enforcement." Both feel like "the thing is handled."

**Where it fires in CSPS:**
- "ZF before response" was T3-only for 2 sessions (S037-S039) before T1+T2 were added
- During those sessions: nominal ZF (Cycle 2: "0 new findings" without naming) accumulated
- "See above" navigation ban: T3 in session-open.sh since S040, T1/T2 added same session
- Every time Sonnet says "this is now enforced via session-open injection" — that's T3-only

**CSPS override:**
```
Training default: T3 injection = enforcement
CSPS override:   T3 injection = 30% of enforcement (session start only, fades by turn 10)
                 T1 + T2 = 70% (permanent, fires regardless of AI cooperation)
                 T3-only rule = drift risk label, not enforcement label
```

**Platform law (from memory feedback_enforcement_trio.md):**
"T3-only WILL drift. This is documented as a platform law. The question is not whether it drifts but how fast. Average: 7-15 turns before context pressure displaces T3-injected rules."

---

### DEFAULT-ME-4: Advisory Validator = Validation Done

**Training default:**
Writing a validator that checks for violations = the thing is validated. The distinction between advisory (exits 0) and blocking (exits 1) is not deeply felt as a quality difference.

**Why this default exists:**
Writing code that detects a pattern IS a form of validation in most contexts. A linter warning IS useful even if not blocking. Claude learned "detection = validation" from software development contexts where advisory warnings are normal.

**Where it fires in CSPS:**
- validate-governor-instructions.mjs created as ADVISORY → "governor instructions are now validated" ← WRONG
- 87 advisory counts in validate-file-naming.mjs → "naming is being validated" ← WRONG
- Most new validators are created advisory then never promoted to blocking
- "Week-4 promotes to blocking" — was written in 2026-04 and is still unexecuted as of 2026-05

**CSPS override:**
```
Training default: advisory validator = validation
CSPS override:   advisory validator = visibility (useful but not enforcement)
                 blocking validator (exit 1) = enforcement
                 "week-4 promotes to blocking" without a date = it won't happen
```

**What CSPS requires:**
A validator that exits 0 cannot close a gap. It can make the gap visible. Making gaps visible is necessary but not sufficient. The enforcement rate (currently 41%) counts only BLOCKING validators — not advisory ones.

---

### DEFAULT-ME-5: The Satisfaction-Point-at-Declaration Anti-Pattern (SP-001)

**Training default:**
"I've run the validator." "I've added the hook." "The T2 is wired." These statements produce satisfaction BEFORE the output is shown.

**Why this default exists:**
Humans use these statements conversationally and they ARE evidence of completion. "I've run the tests" from a human = the tests ran. Claude learned: declarative statement of action = completion evidence.

**Where it fires in CSPS:**
- "pnpm verify passes" stated without showing the exit_code=0 output
- "The T2 validator is now wired" without showing it in verify output
- "The hook catches violations" without showing a test case
- This is EP-ERR-001 applied to enforcement itself

**CSPS override (from existing SP-001 in reasoning-patterns.md):**
```
Training default: "I've done X" = evidence X was done
CSPS override:   "I've done X" = claim requiring verification
                 Evidence = the output shown in THIS response, from THIS run
```

**How to apply to enforcement:**
Never declare T1/T2 enforcement complete without:
1. Showing the hook firing (or noting it's been tested)
2. Showing pnpm verify exit_code=0 with the T2 validator present in output
3. Confirming the validator is BLOCKING (exits 1 on violation), not advisory

---

### DEFAULT-ME-6: The "Enforcement Exists Somewhere" Fallacy

**Training default:**
"The platform has 128 validators and 20 hooks. Surely the important things are enforced." This creates false confidence — the gestalt of "lots of enforcement" is mistaken for "this specific rule is enforced."

**Why this default exists:**
Humans infer from the general to the specific: "This organization has good processes, so my specific concern is probably covered." Claude learned this inference pattern.

**Where it fires in CSPS:**
- "The CSPS platform has extensive validation" → individual contracts feel enforced
- "There are 20 hooks" → the specific behavior in question feels covered
- "AGENTS.md has 60+ Hard NOs" → the specific No feels mechanically enforced
- The reality: 60/62 contracts = zero T1+T2. The 128 validators enforce schema, dead links, file naming — not behavioral contracts.

**CSPS override:**
```
Training default: platform enforcement quality ≈ specific rule enforcement
CSPS override:   every rule is innocent of enforcement until proven guilty
                 proof = show me the validator in pnpm verify output that catches this specific violation
```

---

## The Corrected Satisfaction Points

| Stage | Training fires satisfaction at | CSPS satisfaction requires |
|---|---|---|
| Rule creation | Rule text committed | Rule text + enforcement_tier declared |
| T1 built | Hook file created | Hook file tested on violation + exits 1 |
| T2 built | Validator file created | Validator wired to verify.mjs + BLOCKING + in verify output |
| T3 set | session-open.sh updated | T1 + T2 also present (T3-only = drift) |
| "DONE" declared | PR merged / committed | pnpm verify exit_code=0 confirming T2 is active |

---

## The Written Enforcement Mandate

**Every plan that creates a new rule MUST include:**
```yaml
enforcement_trio:
  t1_hook: "[hook name] — fires when [violation condition]"
  t2_validator: "[validator name] — BLOCKS [specific check] — exit 1"
  t3_session: "[session-open injection text]"
  satisfaction_point: "pnpm verify exit_code=0 with [validator] in output"
  week4_upgrade: "[advisory → blocking upgrade plan with criteria]"
```

**Every HANDOFF closing section MUST include:**
- How many contracts gained T1+T2 this session (not just T3)
- enforcement_rate_change: from N% to M%
- New BLOCKING validators added: [list]

**Every audit MUST begin with:**
"Before reviewing implementation: how many rules created this session have T1+T2? Show the enforce rate delta."

---

## For Opus — Deepening This

The 6 defaults above are not Claude bugs. They are training optimizations that work correctly for 99% of AI use cases. CSPS is the 1% where they fail:
- Most software teams DON'T need mechanical enforcement of behavioral contracts
- Most AI deployments don't need T1+T2+T3 for every rule
- CSPS is a governed, AI-collaborative platform where drift is the primary failure mode

The question for Opus: **of the 60 unenforced contracts, which 5 would deliver the most structural moat improvement if T1+T2 were added in S041?**

Recommendation (Sonnet's view):
1. `B_VALIDATE_BEFORE_ASSUME` — most common drift (state claims without evidence)
2. `B_RZF` — already partially enforced (post-stop-rzf-reminder.sh) but T2 validator weak
3. `B_CATCH_TO_ENGRAVING` — gaps noted but not engraved, K=2 recurring
4. `B_FIVE_SURFACE_ENGRAVING` — engraving happens but not all 5 surfaces verified
5. `B_STRUCTURAL_PREVENTION_DISCIPLINE` — instances patched, structures not fixed

These 5 represent the failure modes that recur in every session. Adding T1+T2 to them would raise enforcement rate from 1/62 to 6/62 (10%) in one session.

---

*Created: 2026-05-18 | Session: S041 | The completion moat is built one enforcement surface at a time.*
