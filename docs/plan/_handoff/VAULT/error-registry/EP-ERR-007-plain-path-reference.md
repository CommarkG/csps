---
id: EP-ERR-007
name: EP-ERR-007
description: "Error pattern registry: plain-path-reference — AI outputs bare file paths instead of clickable markdown links despite memory rule and AGENTS.md hard NO."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
pattern_name: plain-path-reference
first_observed: S036
recurrence_count: 30+
trigger: "Any AI response containing bare file paths (.mjs/.md/.ts/.yaml/.sh/.json) not preceded by ( in markdown link syntax"
sample_incident: "30+ OPUS-2 turns used bare file paths despite feedback_always_git_links.md in memory (K=3+) and AGENTS.md hard rule (B_ALWAYS_GIT_LINKS). Bare paths are faster to type — AI defaults to speed."
mechanical_prevention: post-stop-link-discipline.sh (S037-F ACTIVE — detects bare paths advisory)
principle_reference: P-UX-001
status: advisory_enforced
session: S037
links:
  - { rel: parent, href: ./README.md }
  - { rel: hook, href: ../../../../.claude/hooks/post-stop-link-discipline.sh }
  - { rel: drift-entry, href: ../inner-ai-defaults/continuous-drift-log.md }
---

# EP-ERR-007 — Plain Path Reference

## Pattern

AI output includes bare file paths like `tools/verify.mjs` instead of clickable markdown links like `[verify.mjs](tools/verify.mjs)`.

## Root cause

Bare paths require fewer keystrokes. Under context pressure or speed optimization, formatting is the first thing AI drops. The rule exists in memory (K=3+) and AGENTS.md but was Tier 3 only — no mechanical enforcement until S037-F.

## Sample incident

**Sessions:** S036–S037 (30+ turns)
**Incident:** Every OPUS-2 directive and Sonnet report used bare paths despite B_ALWAYS_GIT_LINKS being in AGENTS.md and memory since S002. Memory + AGENTS.md = Tier 3 only. Tier 3 drifts under context pressure. K=30+ before any Tier 1 hook existed.

## Prevention

**Tier 1 (hook):** `post-stop-link-discipline.sh` extended S037-F — detects bare `.mjs/.md/.ts/.yaml/.sh` paths not preceded by `(` and emits ADVISORY. Active.

**Tier 3 (session injection):** "FORMATTING: Every file path = clickable markdown link [name](path). Never bare paths."

## Why it matters

Bare paths are inert in cross-boundary communication (handoff to new AI, Governor reading reports, SROF). They violate P-UX-001 (contextual locality) — a path that can't be clicked is not at the point of use.

*Engraved S037-F | post-stop-link-discipline.sh extended | 2026-05-16*
