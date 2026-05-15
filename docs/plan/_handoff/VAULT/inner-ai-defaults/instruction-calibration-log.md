---
id: csps.handoff.vault.inner-ai-defaults.instruction-calibration-log
name: instruction-calibration-log
description: >
  Log of instruction audits — scanning AGENTS.md, behavioral-contracts.md, and
  other governance instruction files for trigger vocabulary that may activate
  AI training defaults. Part of CHUNK 2 (Instruction Calibration) in the
  "Drive Don't Fight" architecture. Governor ratified: S026 Opus Turn 12.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
session: S026
core_spine: AI
schema_anchor: vault_files
links:
  - { rel: parent, href: ./README.md }
  - { rel: trigger-vocabulary, href: ./trigger-vocabulary.md }
  - { rel: alternative-vocabulary, href: ./alternative-vocabulary.md }
scope_level: S1
---

# Instruction Calibration Log

---

## AUDIT-001 — S026 Initial Trigger Scan

**Date:** 2026-05-12
**Files scanned:** AGENTS.md, behavioral-contracts.md (spot-check)
**Method:** grep for T1-T7 trigger vocabulary

### AGENTS.md Results

| Trigger | Occurrences | Risk Level | Action |
|---|---|---|---|
| `Never` / `NEVER` | 77 | Medium | Most are intentional AGENTS.md hard NOs — format "❌ Never [do X]" which is correct governance. Review for inadvertent uses. |
| `must` / `MUST` | 9 | Medium | Check each: do they include WHY? Some may activate rigid-rule following without intent transmission. |
| `complete` / `COMPLETE` / `done` / `DONE` | 11 | High | Review each: are these completion declarations or completion criteria? Declarations without evidence = T1 trigger. |
| `always` / `Always` | 4 | Medium | Review for escape hatches — "always" without conditions creates rigid rule following. |
| `exactly` / `EXACTLY` | 3 | Low | Context-dependent — some are appropriate ("exactly once"). |
| `good point` / `Good point` | 2 | High | AGENTS.md should NOT model agreement bias. These should be removed or reframed. |
| `quickly` | 0 | — | Not found — good. |
| `just need` | 0 | — | Not found — good. |

### Findings Requiring Action

**FINDING 1 — `good point` in AGENTS.md (HIGH)**
AGENTS.md models AI behavior. If it contains "good point," it implicitly normalizes agreement language.
Action: Locate and remove or replace with specific acknowledgment.

**FINDING 2 — `DONE` / `done` + `COMPLETE` / `complete` declarations**
Some instances may be genuine completion declarations ("DONE" as status label = fine; "it's done" as evidence-free claim = T1 trigger).
Action: Review each instance — change evidence-free declarations to: "DONE — evidence: [specific validator output]"

**FINDING 3 — `must` without WHY**
Per SP-007 (rigid rule), `must` without WHY activates checklist compliance without intent transmission.
Action (low urgency): In next AGENTS.md revision, add "because [WHY]" to each `must` statement.

### Conclusion

AGENTS.md is largely clean. The `Never/NEVER` usage is structurally correct (hard NO format). The `good point` instances need removal. The `done/complete` instances need review — those that are evidence-free declarations should be updated.

**Net: 2 high-priority fixes, 1 low-priority improvement.**

---

### Opus Review — AUDIT-001 Findings (Turn 14, S026)

**FINDING 1 — RESOLVED:**
AGENTS.md line 51 Governor directive contains "good point" (T2 trigger).
Line 56 already has the annotation "[Note: avoid 'Good point' prefix]".
Fix applied: added `[CSPS behavioral override — AUDIT-001 Finding 1]` note immediately after the Governor's verbatim quote (B_VERBATIM_HUMAN_TEXT preserved — quote unchanged; clarification added).
Commit: included in S026 Turn 14 commit.

**FINDING 2 — ADVISORY (no action this turn):**
DONE/COMPLETE instances in AGENTS.md are mostly correct status labels, not evidence-free declarations.
The one risk: "pnpm verify exit_code=0 REQUIRED" style uses — these are criteria definitions, not satisfaction-point patterns. No changes needed. Monitor in AUDIT-002.

**FINDING 3 — DEFERRED:**
`must` without WHY in AGENTS.md — low urgency. Add to AUDIT-002 agenda.

**Sample library status:** SP-001 through SP-007 all present. 7/7 pairs complete. Library is functional.

---

## AUDIT-002 — To Be Scheduled

**Target:** behavioral-contracts.md B_* contract bodies (spot-check for inadvertent triggers)
**Target:** session-open.sh (check injected reminders for trigger vocabulary)
**Target:** closing-summary-template.md (check §10.0 language)
**Frequency:** Monthly
**Assigned to:** Sonnet (scans) → Opus Turn 13 (reviews C+D findings)
