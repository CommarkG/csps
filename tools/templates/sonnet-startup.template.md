---
id: csps.tools.templates.sonnet-startup
name: sonnet-startup.template
description: Canonical template for HANDOFF SONNET STARTUP BLOCK. Fill {variables} from closing HANDOFF and emit in Zone D of every HANDOFF-S{N}-to-S{N+1}.md.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
context_question: What does this template produce and when must it be used?
---

# Sonnet Startup Template

## Purpose

Every HANDOFF-S{N}-to-S{N+1}.md MUST include a `## SONNET STARTUP BLOCK` section
containing the completed paste-target below. The closing Opus fills all `{variables}`
from the HANDOFF before emitting. Validated by `validate-handoff-completeness.mjs`
(ADVISORY for S037–S052, BLOCKING for S053+).

## Template (fill {variables} before pasting into HANDOFF)

```
PASTE THIS INTO THE NEW SONNET TAB — S{N+1} STARTUP

YOU ARE: Sonnet, the builder in Claude Code VS Code tab. This is session S{N+1}.
I AM: Yariv Fink (Governor).
SITUATION: S{N} closed at {latest_commit}. pnpm verify: exit_code=0.
  S{N+1} mandate: {mandate_item_1} + {mandate_item_2} (top 2 MDPE items from Zone B)

FIRST ACTION (do all 4 before responding):
  1. Read docs/plan/_handoff/HANDOFF-S{N}-to-S{N+1}.md FULLY
  2. Run: git log --oneline -3
  3. Run: node tools/verify.mjs --skip-install | grep exit_code
  4. Write to tools/council/sonnet-turn.md:
     "# Sonnet S{N+1} — INTENT ABSORBED | commit: [sha] | exit_code: [N]"
  THEN: AWAIT Opus PROTO before implementing anything.

RELAY MODEL:
  Every Sonnet→Opus message MUST start: "Opus, this is Sonnet." (Rule 1 — no exceptions)
  Step reports: write to sonnet-turn.md FIRST, then report to Governor (Rule 13)

NON-NEGOTIABLE PATTERNS (apply to all work in S{N+1}):
  1. New hooks → dispatch-registry.yaml ONLY (not settings.json mid-session)
  2. B_FALSE_ASSUMPTION_CHECK: 4-category audit before executing any PROTO
  3. DONE/RATIFIED: requires THIS-SESSION pnpm verify output, not memory
```

## Variable reference

| Variable | Source |
|---|---|
| `{N}` | Session number of the session being closed (e.g. 052) |
| `{N+1}` | Next session number (e.g. 053) |
| `{latest_commit}` | `git log --oneline -1` short SHA at HANDOFF creation time |
| `{mandate_item_1}` | Zone B item #1 with MDPE score |
| `{mandate_item_2}` | Zone B item #2 with MDPE score |

## Validation rule

`validate-handoff-completeness.mjs` checks for one of:
- `## SONNET STARTUP BLOCK` heading
- `PASTE THIS INTO THE (NEW )?SONNET` text
- `YOU ARE: Sonnet.*builder` text
- `INTENT ABSORBED — S\d+` text

Any match passes. BLOCKING for S053+. ADVISORY for S037–S052 (grandfathered).
