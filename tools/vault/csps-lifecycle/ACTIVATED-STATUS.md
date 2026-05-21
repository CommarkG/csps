---
id: csps.vault.csps-lifecycle.activated-status
name: ACTIVATED-STATUS
description: "Canonical definition of the 'activated' quality_state — the transition between implemented and sealed. Implemented ≠ Sealed."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
batch: BATCH-A
session: S050
impl_status: swift-implemented
links:
  - { rel: closed-enum, href: ../../../docs/plan/pillar-0-governance/frontmatter-closed-enums.md }
  - { rel: validator, href: ../../validators/validate-frontmatter.mjs }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/frontmatter-closed-enums.md
  - tools/validators/validate-frontmatter.mjs
---

# ACTIVATED-STATUS — The Implemented ≠ Sealed Principle

## Core Principle

> **Implemented ≠ Sealed.**
> `validated` = done. `activated` = live + measuring. `certified` = proven + sealed.

Building something and sealing it are different activities. Without the `activated` stage, artifacts get "certified" based on theoretical correctness rather than proven real-world behavior. This produces governance theater — rules that exist but don't protect.

---

## The Full quality_state Lifecycle

```
draft → validated → activated → certified
```

| Stage | Meaning | Trigger | protection_level |
|---|---|---|---|
| `draft` | Being designed; mutable | Created | none |
| `validated` | Implemented; `pnpm verify` exit_code=0 | All validators pass | none |
| `activated` | Live in production; measuring intent-vs-results | activation_exit conditions met | `protected` |
| `certified` | Proven; intent and results align; sealed | Governor authorization + evidence | `sacred` |

---

## What 'activated' Means

An artifact is `activated` when:
1. It is **live in production** — the code/rule/contract is actually running
2. **Measurement is in place** — there is a way to observe whether it's working as intended
3. **activation_exit conditions were defined at creation** — the criteria for graduating to `certified` are explicit

An artifact in `activated` state:
- Has `protection_level: protected` (changes require ratification, not freestyle editing)
- Is being observed for intent-results correlation
- Cannot skip to `certified` without evidence

---

## activation_exit Conditions

Every artifact that will become `activated` must declare its exit conditions when it is created:

```yaml
activation_exit: "governor-explicit"
# OR
activation_exit: "n-sessions: 3"
# OR
activation_exit: "n-uses: 100"
# OR
activation_exit: "evaluation-passed"
```

The exit condition determines when the artifact is eligible for `certified` promotion.
Without declared exit conditions, the artifact cannot be promoted to `activated`.

---

## Evidence Block Required for certified Promotion

Before an artifact can move from `activated` → `certified`, the following evidence block must be present:

```yaml
evidence_block_ref: "path/to/evidence-block.md"
activation_evidence:
  intent: "what the artifact was intended to achieve"
  result: "what it actually achieved (measured, not claimed)"
  correlation: "aligned | partially-aligned | misaligned"
  measurement_method: "how correlation was measured"
  sessions_active: N
  governor_authorization: "AUTHORIZED: [reason] — [date]"
```

---

## Relationship to Sacred Files

`sacred` = `certified` + `protection_level: sacred`.

The CSPS sacred files registry (`apps/csps-playground/_sacred.json`) tracks files with `protection_level: sacred`. To reach sacred status, an artifact must:

1. Be `certified` (passed through `activated` with evidence)
2. Have Governor explicit authorization to be marked sacred
3. Be registered in `_sacred.json`

**NOT every certified artifact is sacred.** Sacred means the Governor has explicitly decided that modification requires extreme caution and written authorization.

---

## Common Violations (Anti-patterns)

| Anti-pattern | Correct behavior |
|---|---|
| Marking a new validator `certified` immediately | Start at `draft` → `validated` → `activated` |
| Using `protection_level: sacred` without `certified` status | Only `certified` artifacts may be sacred |
| Declaring "done" at `validated` stage | `validated` = technically correct; `activated` = behaviorally proven |
| Skipping `activated` because "it's obviously working" | Obvious ≠ measured. Run the activation period. |

---

## Examples

**validate-playground-links.mjs (correct lifecycle):**
1. `draft` — being written
2. `validated` — first time all playground links pass
3. `activated` (n-sessions: 3) — confirmed working across 3 sessions
4. `certified` — 6 sessions clean, Governor marked permanent

**B_PRACE behavioral contract (current state):**
- T1/T2/T3 all wired → `validated`
- Active in production → `activated` (ongoing)
- Not yet `certified` — would require governance review that PRACE actually prevents the failure modes it claims to prevent

---

*Ratified S050 | OPUS-6 PROTO | P-META: see B_DONE_RIGHT_FROM_THE_START*
