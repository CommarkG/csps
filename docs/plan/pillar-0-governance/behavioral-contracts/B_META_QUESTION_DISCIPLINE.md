---
id: B_META_QUESTION_DISCIPLINE
name: B_META_QUESTION_DISCIPLINE
description: "Constitutional behavioral contract: 'What are the false assumptions here?' — minimum 10-item checklist BEFORE any tab-transfer artifact (startup-block / paste-target / relay-block / handoff / OPIA checkpoint). The question is constitutional because it caught its own absence in S067 startup block v2."
type: behavioral_contract
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S067
ratified_session: S067
opus_reviewed_seed: "8fa3cc00"
authored_by: Opus-11
date: 2026-05-28
core_spine: GVRN
schema_anchor: behavioral_contracts
plan_item_id: "DRAFT-S066-MASTER-CONSOLIDATED-RATIFICATION (governor_approval_status: APPROVED S066)"
inherits_from: "P-META-029 + B_HUMBLE_CONSOLIDATION_DISCIPLINE + M-38 Tab-Transfer-Stability-Hierarchy + B_ZERO_NAVIGATION_FOR_GOVERNOR + P-UX-002 ZCA"
enforcement_tier: "T1+T2+T3 (mechanical — ADVISORY S067, BLOCKING S068)"
fse_5_surface: "contract(this) + template(tools/templates/tab-transfer-template.md) + hook(pre-tool-use-false-assumption-gate.sh) + validator(validate-tab-transfer-completeness.mjs) + session-open T3 injection"
governing_intent: "Tab transfers accumulate false assumptions silently — 10 items in S067 startup block caught: stale session-state mandate / missing Opus ACK / stale hook count / mega-batch CHECKPOINT gaps / STEP ordering confusion. The checklist REVERSES the default (D3 surface-completeness): responses LOOK correct by default; the checklist surfaces what's actually wrong."
inaugural_application: "S067 Sonnet startup block v2 (Opus-11 Turn 38) — 10-point checklist embedded. The question caught its own absence: prior startup blocks lacked this section entirely."
links:
  - rel: template
    href: ../../../../tools/templates/tab-transfer-template.md
  - rel: validator
    href: ../../../../tools/validators/validate-tab-transfer-completeness.mjs
  - rel: hook
    href: ../../../../.claude/hooks/pre-tool-use-false-assumption-gate.sh
  - rel: inaugural-application
    href: ../../_handoff/HANDOFF-S067-to-S068.md
enforcement_trio:
  t1:
    tier: hook
    path: ".claude/hooks/pre-tool-use-false-assumption-gate.sh"
    status: active
  t2:
    tier: validator
    path: "tools/validators/validate-tab-transfer-completeness.mjs"
    status: advisory
  t3:
    tier: memory
    path: "session-open.sh B_META_QUESTION T3 injection + this memory entry + MEMORY.md"
    status: active
---

## B_META_QUESTION_DISCIPLINE — false-assumption checklist before any tab-transfer

**Core question (constitutional):**

> "What are the false assumptions here?"

**Canonical rule:**

> Before emitting ANY tab-transfer artifact (startup-block / paste-target / relay-block / handoff / OPIA checkpoint), author a minimum 10-item false-assumption checklist using the format:
>
> ```
> ❌ "<assumption — stated as if it were true>"
>    REALITY: <what's actually true on disk / in this session>
>    Fix: <specific action to take instead>
> ```
>
> Minimum 10 items. `pre-tool-use-false-assumption-gate.sh` BLOCKS (S068) if missing.

## Why this is constitutional

S067 Sonnet startup block v2 (Opus-11 Turn 38) — the inaugural application — surfaced 10 false assumptions that were silently operating:

1. session-state.json mandate is current (REALITY: stale S066 text)
2. STEP 6 is sequential (REALITY: CONSTITUTIONAL scope requiring explicit token)
3. Opus mega-batch ACK has landed (REALITY: needs reading opus-turn.md)
4. verify-hooks count is accurate (REALITY: 26 declared vs 64 actual)
5. Previous tab CHECKPOINTs are known (REALITY: new tab = zero memory)
6. STEP 8 is available next (REALITY: blocked on STEP 6)
7. §17 attestation is optional (REALITY: BLOCKING gate)
8. ZF deep gate won't fire (REALITY: iter_count > 15 triggers it)
9. Mid-session settings.json edits are safe (REALITY: CONSTITUTIONAL scope)
10. STEPs can auto-chain (REALITY: F-NEW-16 + C13 prevention)

**The recursion is the test**: the question caught its own absence — prior startup blocks lacked this section. The 10-item checklist didn't exist before S067. It was authored by Opus-11 as a response to accumulated session-start failures. By making it constitutional (not optional), CSPS ensures every tab starts by challenging its own assumptions.

## Training defaults overridden

| Default | Pattern | Override |
|---|---|---|
| D3 surface-completeness | Response LOOKS correct; no checklist needed | Checklist surfaces what's actually wrong |
| D9 recency-bias | Older startup failures fade from context | Permanent structural check at every tab start |
| D1 eager-helpfulness | Start building immediately | Check assumptions first, then build |

## Enforcement Trio

- **T1 (hook):** `.claude/hooks/pre-tool-use-false-assumption-gate.sh`
  ADVISORY S067 — warns when tab-transfer artifact missing checklist
  BLOCKING S068 — prevents write without ≥10 ❌ items

- **T2 (validator):** `tools/validators/validate-tab-transfer-completeness.mjs`
  Scans HANDOFF files + tab-transfer-template for FA section + ≥10 items
  Advisory mode S067; template self-validates (recursive consistency check)

- **T3 (session-open):** `session-open.sh B_META_QUESTION injection`
  Every tab start: "Before any HANDOFF/startup-block/CHECKPOINT: run false-assumption checklist"

## What counts as a tab-transfer artifact

- HANDOFF-S<N>-to-S<N+1>.md (session handoffs)
- Sonnet startup blocks (paste-targets in handoffs)
- Relay blocks (Opus→Sonnet / Sonnet→Opus via Governor)
- OPIA CHECKPOINTs (post-implementation audit blocks)
- tools/templates/tab-transfer-template.md (self-validates)

## What does NOT require the checklist

- Conversational replies / ZF cycles / status updates
- Direct code or file fixes (not tab-transfer artifacts)
- INTENT ABSORBED entries (session admin, not tab-transfer)
- Behavioral tests / validator output (not tab-transfer)

## 5-Surface Engraving Evidence

| Surface | Artifact | Session |
|---|---|---|
| Contract | This file | S067 STEP 6.4 |
| Template | `tools/templates/tab-transfer-template.md` | S067 STEP 6.4 |
| Hook (T1) | `.claude/hooks/pre-tool-use-false-assumption-gate.sh` | S067 STEP 6.4 |
| Validator (T2) | `tools/validators/validate-tab-transfer-completeness.mjs` | S067 STEP 6.4 |
| Session-open (T3) | `session-open.sh` B_META_QUESTION injection | S067 STEP 6.4 |

## Satisfaction point to avoid

❌ "I'll include the false-assumption checklist" stated in chat — behavioral claim
✅ Writing the actual 10+ ❌ items in the HANDOFF/startup-block content — mechanical output

The discipline is the 10 written items, not the intention to write them.
