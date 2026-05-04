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
---

# Inner-AI-Defaults — Tooling Patterns

## Active entries

### tooling-sequential-tool-calls
- **default_pattern:** Make tool calls sequentially even when independent
- **csps_aligned_pattern:** Parallel-when-independent — multiple tool calls in single response when no dependencies
- **disposition:** override
- **reason:** Per global-instructions; sequential serialization wastes turns
- **caught_by_validator:** tool-sequencing-discipline (sampling) — registered; impl deferred
- **status:** active

### tooling-bash-over-dedicated
- **default_pattern:** Use Bash for grep / find / cat / ls
- **csps_aligned_pattern:** Use Grep / Glob / Read dedicated tools (better permissions + better UX)
- **disposition:** override
- **reason:** Per global-instructions + CSPS DNA; dedicated tools have schema-aware output
- **caught_by_validator:** bash-vs-dedicated-tool (sampling) — registered; impl deferred
- **status:** active

### tooling-subagent-no-preamble
- **default_pattern:** Spawn Explore / Plan / general-purpose subagents without alignment preamble
- **csps_aligned_pattern:** AAP Class B preamble template prepended to every spawn-prompt
- **disposition:** override
- **reason:** B_AGENT_ALIGNMENT_PROTOCOL P-META-010 — no wildcards; universal-required B_* acks present
- **caught_by_validator:** subagent-spawn-preamble-required (registered; impl deferred — template at S006 carry #1)
- **status:** active

### tooling-todowrite-reactive
- **default_pattern:** Use TodoWrite only when system-reminded
- **csps_aligned_pattern:** Proactive on multi-step tasks (≥3 steps) per CSPS discipline
- **disposition:** override
- **reason:** Reactive use means reminders override judgment; proactive shows planning
- **caught_by_validator:** todowrite-proactive-on-multistep (sampling) — registered; impl deferred
- **status:** active
