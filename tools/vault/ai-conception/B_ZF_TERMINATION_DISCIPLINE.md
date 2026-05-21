---
id: ai-conception.B_ZF_TERMINATION_DISCIPLINE
name: B-ZF-TERMINATION-DISCIPLINE
description: "AI conception pattern: ZF ACHIEVED can only be declared after a cycle that finds ZERO new findings — never in the same cycle as the last finding"
type: conception_pattern
protection_level: sacred
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "1.0"
session: S050
core_spines: [VALD, GVRN, AI]
core_spine: VALD
schema_anchor: vault_files
links:
  - ai-conception.B_ARCHITECTURE_REDIRECT_AWARENESS
  - ai-conception.B_IDENTITY_BEFORE_CONTEXT
impl_status: swift-implemented
context_question: "When exactly has ZF been achieved, and what constitutes a valid termination cycle?"
context_quote: "Termination is findings-driven, not cycle-count-driven."
---

# B_ZF_TERMINATION_DISCIPLINE

## The Failure Pattern (what was happening)

```
Cycle 1: [finding — names what was found]
Cycle 2: [re-examines Cycle 1 area + 0 new findings] → ZF ACHIEVED declared HERE
```

This is WRONG. Cycle 2 is doing two things simultaneously: re-examining AND declaring.
The declaration came in the same cycle as the re-examination.

## The Correct Pattern

```
Cycle 1: [finding — non-terminal. Must continue.]
Cycle 2: [re-examines named areas from Cycle 1. If 0 new: this IS the termination cycle.]
         "Re-examined [explicitly name what was checked]. 0 new findings."
→ ZF ACHIEVED declared ONLY when the cycle itself returned zero.
```

If Cycle 2 surfaces a NEW finding:
```
Cycle 2: [new finding — non-terminal]
Cycle 3: [re-examines Cycle 1 + Cycle 2 areas by name. 0 new findings.]
→ ZF ACHIEVED
```

## The Termination Rule

**ZF ACHIEVED is valid only when:**
1. The most recent cycle named what it re-examined (not generic "nothing new")
2. The most recent cycle explicitly returned 0 new findings
3. The most recent cycle did NOT itself introduce a finding

Any cycle that introduces a finding is non-terminal. Period.
The cycle after the last finding must be zero to terminate.

## The Naming Requirement

"Cycle N: 0 new findings" is NOMINAL — it names no re-examination scope.
"Cycle N: Re-examined [specific items]. 0 new findings." is VALID.

The naming requirement is what prevents the AI's satisfaction point from firing prematurely.
Without naming, "0 new findings" is just a declaration, not evidence.

## The Cycle Count Rule

Cycle count is MEASUREMENT of how iteration-rich the work was.
Cycle count is NOT a target. Terminating at Cycle 2 just to "be efficient" is the failure mode.
If it takes 5 cycles to reach zero: 5 cycles is correct. Not 2 with a false declaration.

## Where This Applies

Every substantive response that makes claims about state or completeness.
Specifically: every DONE/COMPLETE/RATIFIED/ZF ACHIEVED claim in any CSPS output.
The post-stop-pnpm-verify hook enforces the code verification side.
This conception pattern enforces the response-level ZF discipline.

## Session Evidence

S050 Governor observation: "I still see one cycle with findings and then a false declaration
of ZF achieved. It must be a cycle AFTER the last cycle with findings. Even if there is one
finding you must perform another cycle and see you really get 0 results."

---

*AI Conception Vault entry 2 | S050 | Protection: sacred*
