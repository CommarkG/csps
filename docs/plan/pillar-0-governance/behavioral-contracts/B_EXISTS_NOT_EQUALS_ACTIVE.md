---
id: B_EXISTS_NOT_EQUALS_ACTIVE
name: B_EXISTS_NOT_EQUALS_ACTIVE
type: behavioral-contract
enforcement_tier: T1+T2+T3
governing_intent: "Every governance concept that must be active at runtime has a corresponding activation mechanism. Documentation without activation is not governance."
batch: BATCH-A
template_depth: L2
parent_template: b-star-contract
lifecycle_state: ratified
diataxis_type: reference
council_state: none
session: S046
---

# B_EXISTS_NOT_EQUALS_ACTIVE

**Contract:** No governance artifact may be cited as "enforcing" a rule unless it is
activated by T1 hook, T2 validator, session-open injection, or DNA always_include.

**Satisfied by:** AP-001 diagnostic question passes — "is this concept enforced by
  a mechanism that has already fired this session?"

**Violated by:** Citing a principle, contract, or document as active enforcement
  without naming the activation mechanism.

**Training default overridden:** "Writing a rule makes it a rule."
**CSPS override:** Writing a rule + activating it = enforcing a rule. Writing alone = documentation.

**The 4 activation mechanisms:**
1. T1 hook — fires at a specific trigger event (PreToolUse, PostToolUse, Stop, etc.)
2. T2 validator — fires at commit time via pnpm verify
3. Session-open injection — delivered by session-open.sh at every session start
4. DNA always_include — bundled into every AI context via dna-registry.yaml

**Enforcement (T1+T2+T3):**
- T1: post-stop-exists-not-equals-active.sh — STUB (S046); ADVISORY (S047)
- T2: validate-activation-coverage.mjs (S047) — checks B_* contracts have activation mechanism
- T3: session-open.sh + anti-patterns.md always_include (AP-001) + this contract

**Related:** AP-001 (anti-patterns.md) — the negative-space description of this contract
