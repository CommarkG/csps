---
id: csps.handoff.vault.inner-ai-defaults.tooling-patterns
name: inner-ai-defaults-tooling-patterns
description: Inner AI tooling + tool-selection training defaults vs CSPS-aligned overrides. Per P-META-017.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
template_used: registry-canonical
template_status: novel-pending-pattern-evaluation
core_spines: [AI, OPER]
tags:
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
session: S006
domain_path: platform
---

# Inner-AI-Defaults — Tooling Patterns

## Active entries

### tooling-sequential-tool-calls
- **default_pattern:** Make tool calls sequentially even when independent
- **csps_aligned_pattern:** Parallel-when-independent — multiple tool calls in single response when no dependencies
- **disposition:** override
- **reason:** Per global-instructions; sequential serialization wastes turns
- **caught_by_validator:** validate-bottleneck-patterns.mjs (LIVE S027 — Class B: detects validators using recursive sequential file walks that could be parallelized; ADVISORY)
- **status:** active

### tooling-bash-over-dedicated
- **default_pattern:** Use Bash for grep / find / cat / ls
- **csps_aligned_pattern:** Use Grep / Glob / Read dedicated tools (better permissions + better UX)
- **disposition:** override
- **reason:** Per global-instructions + CSPS DNA; dedicated tools have schema-aware output
- **caught_by_validator:** validate-token-budget.mjs (LIVE S006 — R5 operating rule: checks AGENTS.md line count + token budget discipline; B_TOKEN_BUDGET R5 requires dedicated tools over Bash for standard operations)
- **status:** active

### tooling-subagent-no-preamble
- **default_pattern:** Spawn Explore / Plan / general-purpose subagents without alignment preamble
- **csps_aligned_pattern:** AAP Class B preamble template prepended to every spawn-prompt
- **disposition:** override
- **reason:** B_AGENT_ALIGNMENT_PROTOCOL P-META-010 — no wildcards; universal-required B_* acks present
- **caught_by_validator:** validate-subagent-spawn-preamble.mjs (LIVE — Level 1/2: verify templates exist + AAP hook registered; Level 3: live spawn scan → VLT-S021-SPAWN-TRANSCRIPT)
- **status:** active

### tooling-todowrite-reactive
- **default_pattern:** Use TodoWrite only when system-reminded
- **csps_aligned_pattern:** Proactive on multi-step tasks (≥3 steps) per CSPS discipline
- **disposition:** override
- **reason:** Reactive use means reminders override judgment; proactive shows planning
- **caught_by_validator:** todowrite-proactive-on-multistep (sampling) — registered; impl deferred
- **status:** active

### tooling-clear-on-idle
- **default_pattern:** Use /clear between tasks or after idle period to "start fresh"
- **csps_aligned_pattern:** At 1M context: /clear ONLY at >80% saturation AND task arc fully closed. The conversation IS the session archive — clearing destroys live governance context that cannot be recovered.
- **disposition:** override
- **concept_ref:** AI L2 inner-defaults — training default is /clear as a housekeeping habit; CSPS override treats conversation history as a valuable governance artifact
- **reason:** B_TOKEN_BUDGET R4 v2 (S018). At 1M context, cache warmth argument is minor vs archive value. Clearing at <80% wastes institutional session knowledge.
- **caught_by_validator:** validate-token-budget.mjs (LIVE S018 — Mode 4: checks /compact vs /clear frequency; R4 B_TOKEN_BUDGET enforces /clear only at >80% saturation, not habitually)
- **status:** active
