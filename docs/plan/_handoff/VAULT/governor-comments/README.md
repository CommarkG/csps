---
id: csps.handoff.vault.governor-comments.index
name: governor-comments-index
description: >
  Auto-generated raw Governor comments log. Every comment the Governor types in
  any CSPS session is saved here unchanged, with session ID + date + time.
  Files are named YYYY-MM-DD.md (one per day, append-only).
  Created by: user-prompt-submit-raw-comments.sh hook on every UserPromptSubmit event.
  Purpose: future processing — the Governor has ideas for how to use these.
version: 1.0
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: governance_raw
session: S021
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - maturity:stable
links:
  - { rel: hook, href: ../../../../../../.claude/hooks/user-prompt-submit-raw-comments.sh }
domain_path: platform
---

# Governor Raw Comments Log

Auto-generated. Do not edit manually.

**Format:** One file per day (`YYYY-MM-DD.md`), append-only.

Each entry:
```
---
## [2026-05-09T08:03:52Z] session=abc123

[raw comment text, unchanged]
```

**How to use:** The Governor's raw comments accumulate here across all sessions.
Future processing will extract patterns, insights, and directives from this corpus.
