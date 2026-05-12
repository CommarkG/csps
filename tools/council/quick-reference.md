# CSPS Council Quick Reference
## The operational flow — read this first

---

## The Turn Cycle (OPUS-1 ↔ Governor ↔ Sonnet)

```
OPUS-1 writes Turn N to opus-turn.md
  (State at Writing + Tier 1 + Tier 2 + Prohibited + RZF VERIFICATION)

  >

Governor pastes chat-jump-[session].md to fresh Sonnet tab

  >

Sonnet writes INTENT ABSORBED to sonnet-turn.md
  (task understanding + why Layer 3 + constraints + first action)
  Governor sees it — corrects if wrong — BEFORE any file is touched

  >

Sonnet executes Tier 1 items
  (each with grep verification — item not done without proof)

  >

Sonnet appends SONNET REPORT to sonnet-turn.md
  (done + commit sha | differs from spec | deferred + reason | state at close)

  >

Sonnet writes closing-summary + HANDOFF + git push

  >

Governor pastes: "Opus: read tools/council/sonnet-turn.md, then [directive]"
  to Opus tab

  >

OPUS-1 reads sonnet-turn.md BEFORE writing Turn N+1
  (what Sonnet actually did — verified state, not assumed)

  >

OPUS-1 writes Turn N+1

  >

repeat
```

---

## The Enterprise Arc (S024 → S031+)

```
S024 → Protocol validators + P-META-022 Tier 1 + libs/ gate upgrade
  >
S025 → P-META-022 Tier 2 + Core Spines Option A + UPDATE-010 (rigidity_level)
  >
S026 → Core Council seal enforcement + UPDATE-011 (AGENTS.md R1-refactor) + dead-links
  >
S027 → Threshold Wizard (if ratified by Governor) + CalendarEngine Phase 1
  >
S028 → NotificationService Phase 1 + Core Spines Option B design (ADR)
  >
S029 → Core Spines Option B ratification + validate-core-primitive-usage.mjs
  >
S030 → Core Spines Option B implementation + App #2 complete + graduation tracker
  >
S031+ → App #3... App #4... WisdomVault when 3+ apps generating data
```

---

## Key Files

| What | Where |
|---|---|
| Full enterprise arc plan | `docs/plan/_handoff/VAULT/topic-plans/opus-advisory-arc-S023.md` |
| P-META-022 canonical principle | `docs/plan/pillar-0-governance/human-intent-crystallization.md` |
| Alignment plan (16 items, exact edits) | `tools/council/p-meta-022-alignment-plan.md` |
| S024 chat-jump (paste to Sonnet) | `tools/council/chat-jump-S023-p-meta-022.md` |
| Full communication protocol | `tools/council/PROTOCOL.md` |
| Opus turns 1-7 | `tools/council/opus-turn.md` |
| Sonnet reports | `tools/council/sonnet-turn.md` |
| Council templates | `tools/council/templates/` |

---

## Governor Trigger Lines (copy-paste)

**Open Opus tab:**
```
OPUS-[N]: [topic or directive]
```

**Send Opus output to Sonnet (new tab):**
```
Paste the full contents of tools/council/chat-jump-[session].md
```

**Send Sonnet report to Opus:**
```
Opus: read tools/council/sonnet-turn.md, then [directive]
```

**Sonnet close instruction:**
```
Close S[NNN]: run pnpm verify + zf-orchestrator --level 3, write closing-summary + HANDOFF + SONNET REPORT to sonnet-turn.md, git push
```

---

## Zero-Freestyle Rules (NEVER break these)

```
Opus: NEVER write Turn N+1 without reading sonnet-turn.md first
Sonnet: NEVER edit a file before INTENT ABSORBED is in sonnet-turn.md
Sonnet: NEVER close without SONNET REPORT in sonnet-turn.md
Either: NEVER claim state without reading the actual files
```

---

## Current Status (update at each session)

| Metric | Value |
|---|---|
| Active session | S024 |
| Sonnet status | Active (parallel) |
| Validators | 72 active |
| pnpm verify | exit_code=0 ✅ |
| Opus turn | Turn 7 written |
| Sonnet report | Pending (S024 in progress) |
| Next Opus turn | Turn 8 — after Sonnet S024 closes |

---

*Quick Reference | S023 Opus advisory session | 2026-05-12*
*Update "Current Status" at each session boundary*
