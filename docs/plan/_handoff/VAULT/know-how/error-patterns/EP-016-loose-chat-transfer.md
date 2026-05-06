---
id: csps.know-how.error-patterns.ep-016
name: loose-chat-transfer
description: AI-to-AI task transfer prompt has too much interpretation space — no explicit sender/receiver declaration, vague task description, no required output per step, no BLOCKED path, no exact completion format. The receiving AI drifts.
severity: HIGH
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: know_how_error_patterns
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
first_seen: S011
recurrence_count: 2
source_sessions: [S011]
applies_to: [plan, implement]
prevention_checklist_item: "Every AI-to-AI task transfer MUST use tools/templates/chat-transfer-protocol.template.md. No free-form handoff prompts. Template structure: SENDER/RECEIVER explicit + DECLARE FIRST + REQUIRED OUTPUT per step + BLOCKED path + EXACT completion format."
mechanical_prevention: "chat-transfer-protocol.template.md registered in template-registry.md + AGENTS.md hard DO (use template, never free-form)"
consolidation_cross_refs:
  - tools/templates/chat-transfer-protocol.template.md
  - AGENTS.md
  - docs/plan/_handoff/VAULT/know-how/checklists/pre-plan-creation.md
---

# EP-016 — Loose Chat Transfer

**Pattern:** When transferring a task to a new AI chat, the prompt uses natural language ("implement X", "identify yourself") instead of a structured zero-drift template. The receiving AI has interpretation space → drifts → produces output that doesn't match the intent.

**What "too much interpretation space" means:**
- "identify yourself honestly" → subjective; AI may claim to be a session number
- "implement Clerk webhook" → vague; no REQUIRED OUTPUT specified
- No BLOCKED path → AI continues past failures
- No exact completion format → AI invents its own format

**The zero-drift template fixes this by:**
1. SENDER/RECEIVER explicit (no ambiguity about who wrote this and who should read it)
2. DECLARE FIRST block (receiver must declare before acting — proves it read the prompt)
3. REQUIRED OUTPUT per step (no step is "done" without specific evidence)
4. BLOCKED path (failure = immediate stop + report, never continue)
5. EXACT completion format (template with [substitutions only], no prose)

**Why it recurs:** I (the building AI) feel "done" after fixing the immediate prompt. EP-015 (satisfaction point) fires — I don't extract the pattern into permanent structures. This is the SAME pattern at the meta-level.
