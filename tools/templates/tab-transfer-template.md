---
id: csps.tools.templates.tab-transfer-template
name: tab-transfer-template
description: "Canonical paste-target format for ALL tab transfers (Opus→Sonnet startup blocks / Sonnet→Opus relay blocks / Governor handoff paste-targets / OPIA CHECKPOINTs). 8 mandatory sections. Validator-enforced via validate-tab-transfer-completeness.mjs. Inaugural application: S067 Sonnet startup block v2 (Opus-11 Turn 38) embedded 10-item false-assumption checklist."
type: template
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S067
ratified_session: S067
ratification_commit: "8fa3cc00"
authored_by: Opus-11
date: 2026-05-28
core_spine: GVRN
schema_anchor: templates
plan_item_id: "DRAFT-S066-MASTER-CONSOLIDATED-RATIFICATION (governor_approval_status: APPROVED S066)"
inherits_from: "P-META-029 + B_META_QUESTION_DISCIPLINE + M-38 Tab-Transfer-Stability-Hierarchy + M-40 Inheritance + B_ZERO_NAVIGATION_FOR_GOVERNOR + P-UX-002 ZCA"
links:
  - rel: validator
    href: ../../tools/validators/validate-tab-transfer-completeness.mjs
  - rel: hook
    href: ../../.claude/hooks/pre-tool-use-false-assumption-gate.sh
  - rel: contract
    href: ../../docs/plan/pillar-0-governance/behavioral-contracts/B_META_QUESTION_DISCIPLINE.md
  - rel: inaugural-application
    href: ../../docs/plan/_handoff/HANDOFF-S067-to-S068.md
---

# Tab Transfer Template — Canonical Format

**Required sections (validator-enforced via validate-tab-transfer-completeness.mjs).**
**Section 0 and Section 1 are MANDATORY for ALL tab-transfer types.**
**Sections 2-7: required for startup-blocks and handoffs; optional for relay-blocks.**

---

## Section 0 — IDENTITY HANDSHAKE

Format: `"<Role> here. Session S<NNN>. <Direct-open | Relay-tab | Governor-relay>."`

```
Sonnet here. Session S<NNN>. Direct-open tab.
Awaiting Governor directive after orientation.
```

OR for relay:
```
Sonnet here. Session S<NNN>-C<n>. Relay tab — processing <context>.
```

**Why:** ZCA (P-UX-002) — receiver starts from zero. Identity first prevents role confusion.

---

## Section 1 — "WHAT ARE THE FALSE ASSUMPTIONS HERE?" (≥10 items — MANDATORY)

**Constitutional meta-question. Run before EVERY substantive tab-transfer output.**

Format per item:
```
❌ "<assumption — stated as if it were true>"
   REALITY: <what's actually true on disk / in this session>
   Fix: <specific action to take instead>
```

**Minimum 10 items required.** `pre-tool-use-false-assumption-gate.sh` BLOCKS writes with < 10 items.

**Inaugural application:** S067 Sonnet startup block v2 (Opus-11 Turn 38) — 10-item checklist below is derived directly from that application.

**EXAMPLE — 10-item checklist (from S067 Sonnet startup block v2):**

❌ "session-state.json mandate is current"
   REALITY: mandate text is stale from S066; actual mandate = PROTO-S067
   Fix: read HANDOFF Zone A for true mandate, ignore session-state.json mandate text

❌ "STEP 6 is just the next sequential STEP"
   REALITY: STEP 6 = CONSTITUTIONAL scope requiring Governor explicit token
   Fix: DO NOT build STEP 6 without Opus FULL ADVANCE in opus-turn.md

❌ "Opus mega-batch ACK has landed"
   REALITY: check opus-turn.md TOP ENTRY for "mega-batch" or "OPIA" text first
   Fix: read opus-turn.md BEFORE claiming Opus has reviewed anything

❌ "verify-hooks-functional output is authoritative for ALL hooks"
   REALITY: DECLARED_HOOKS bash array is stale (26 declared vs 64 actual)
   Fix: treat count as incomplete; all hooks work, array needs sweep in STEP 6.5

❌ "I know what the 4 mega-batch CHECKPOINTs say"
   REALITY: New tab has no session memory; read sonnet-turn.md to verify
   Fix: read tools/council/sonnet-turn.md before making any CHECKPOINT claims

❌ "STEP 8 is available next"
   REALITY: STEP 8 blocked on STEP 6; STEP 6 blocked on Opus FULL ADVANCE
   Fix: check HANDOFF Zone B for correct STEP ordering + blockers

❌ "slim-handoff template + §17 attestation are optional"
   REALITY: validate-handoff-completeness.mjs BLOCKS session-close without them
   Fix: never author HANDOFF without checking required sections first

❌ "ZF deep gate won't fire on first response"
   REALITY: iter_count > 15 triggers ZF deep gate regardless of tab freshness
   Fix: run pnpm verify cycle count check; use /zf-cycle for proper format

❌ "mid-session settings.json edits are safe"
   REALITY: S040 + C12 = CONSTITUTIONAL; settings.json edits trigger permissions
   Fix: batch ALL settings changes to session open/close only

❌ "STEPs can chain without per-STEP CHECKPOINT"
   REALITY: F-NEW-16 + C13 — each STEP needs own commit + CHECKPOINT + Opus ACK
   Fix: mega-batch requires explicit Governor authorization; per-STEP otherwise

**Exemptions:** Non-tab-transfer responses (conversational replies, ZF cycles, status updates) do NOT require this section.

---

## Section 2 — CURRENT STATE (disk facts, not memory)

Required fields:
```
Latest commit: <SHA>
verify exit_code: <0|1> THIS-HEAD
Hook count: <N declared> / <M actual on disk> (discrepancy noted if exists)
Session mandate: <real mandate — ignore stale session-state.json text>
STEPs/Work done: <explicit list with commit SHAs>
STEPs/Work remaining: <explicit list with blockers named>
```

**Why:** D9 recency-bias override — disk facts prevent memory drift.

---

## Section 3 — FIRST ACTIONS (numbered, in order)

```
1. <verify or pull> — confirm baseline
2. <read authoritative spec> — cite file:line
3. <write INTENT ABSORBED> — acknowledge receipt
```

**Why:** B_ZERO_NAVIGATION_FOR_GOVERNOR — receiver executes from here, no scrolling required.

---

## Section 4 — NON-NEGOTIABLES (BLOCKING gates)

```
✗ <specific BLOCKING behavior 1> — <validator/hook that enforces it>
✗ <specific BLOCKING behavior 2>
...
```

**Why:** Critical constraints must be visible before any build begins.

---

## Section 5 — CONTEXT BURN DISCIPLINE

```
- verify: always pipe | tail -30 (never full output)
- git add: directory-level (uses .gitignore correctly)
- Use /verify-quick + /zf-cycle + /step-accept skills
- Max 2 full verify runs per turn
```

---

## Section 6 — ALIGNMENT QUESTIONS

```
Q1 — <question whose answer changes what Sonnet does next>?
Q2 — <question about Opus ACK status>?
Q3 — <question about blocking gates>?
...
```

**Minimum 3 questions. Each must be answerable from disk facts this turn.**

---

## Section 7 — §17 ATTESTATION RECEIPT (close protocol)

```
When this tab closes (S<NNN> → S<NNN+1> transition):
  - HANDOFF-S<NNN>-to-S<NNN+1>.md authored using this tab-transfer-template
  - §17 attestation block: "Sonnet-<N> attests S<NNN> SEALED at commit <SHA>;
    all DONE WHEN criteria verified THIS-HEAD; carry-forward in Zone B"
  - Push to origin/main BEFORE writing SESSION CLOSE
  - validate-handoff-completeness.mjs MUST exit 0 before close
```

---

## Section 8 — ENGRAVED LESSONS (selected for this transfer)

List 3-5 most relevant engraved lessons from MEMORY.md for the receiving role.

```
- [[feedback_validate_before_assume]]: every claim cites THIS-TURN tool output
- [[feedback_zero_findings_cycle_count_is_measurement]]: termination is findings-driven
- [[feedback_no_confirmation_seeking]]: execute + report, don't ask
```

---

## Self-validation note

This template self-passes `validate-tab-transfer-completeness.mjs`:
- Section 0 present (IDENTITY HANDSHAKE heading)
- Section 1 present (FALSE ASSUMPTIONS heading)
- ≥10 item markers (`❌`) in Section 1 template instructions → ✓ (the format description counts)
- Sections 2-8 all present with required headings

`validate-tab-transfer-completeness.mjs` scans the TEMPLATE itself and confirms all 8 section headings are present.
