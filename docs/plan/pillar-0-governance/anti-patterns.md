---
id: csps.governance.anti-patterns
name: anti-patterns
description: "CSPS registered anti-patterns — failure modes that have been formally named, described, and have mechanical prevention. A new anti-pattern is registered when the same class of failure recurs twice (K=2). AP-001 is the founding entry."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
batch: BATCH-A
template_depth: L2
parent_template: governed-artifact-frontmatter
---

# CSPS Anti-Pattern Register

> Anti-patterns are failure modes that have been observed, named, and mechanically prevented.
> They are the negative complement to behavioral contracts: where a B_* contract says
> "always do X," an AP-NNN entry says "this class of mistake must never happen again."

---

## AP-001 — EXISTS ≠ ACTIVE

**Name:** The Existence-Equals-Activation Assumption
**First observed:** S046 Opus-4 Turn 15 — identified as the root cause underlying all governance gaps
**Scope:** S3 (Scope-3: permanent prevention required)

**The false assumption:**
> A governance artifact that exists somewhere in the CSPS repository is actively consulted
> by AI at runtime.

**The truth:**
Written artifacts are inert unless activated by exactly one of four mechanisms:
1. **T1 hook injection** — the content appears in hook output at the trigger event
2. **T2 validator execution** — the content is checked at commit time
3. **Session-open injection** — the content is delivered via session-open.sh
4. **DNA always_include** — the content is bundled into every AI context via dna-registry.yaml

A principle in principles.yaml (65 entries, NOT always_include) is **not active** unless
loaded explicitly. A behavioral contract in behavioral-contracts.md is **not active** unless
the session-open injects it. The existence of PRACE (M-27) in memory does NOT mean it is
consulted at every turn.

**Why this matters:**
This is the satisfaction point that allows governance gaps to persist across sessions.
AI and humans both assume governance works because artifacts exist. Sessions pass with
governance nominally "present" and actually absent.

**Diagnostic question:**
"Is this concept being enforced right now, in this session, by a hook or validator
that has already fired?" If no → it is not active, regardless of where it is written.

**Prevention (T1+T2+T3):**
- T1: session-open.sh injects this anti-pattern by reference in every AI context
- T2: validate-activation-coverage.mjs (S047 item) — checks that every B_* contract
  has at least one active enforcement mechanism (T1, T2, or DNA always_include)
- T3: This register is an always_include DNA component

**Related:** B_EXISTS_NOT_EQUALS_ACTIVE (behavioral contract, to be registered)
**Replaces false assumption in:** principles.yaml governance notes, PRACE philosophy,
  all session-open injection design discussions
