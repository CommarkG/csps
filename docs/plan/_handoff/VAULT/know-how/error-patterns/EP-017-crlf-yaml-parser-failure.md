---
id: csps.ep.017
name: EP-017-crlf-yaml-parser-failure
description: YAML frontmatter regex fails on Windows CRLF line endings — sub_files: not detected.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: VALD
schema_anchor: vault_files
impl_status: swift-implemented
diataxis_type: reference
session: S032
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
links:
  - { rel: fix, href: ../../../../tools/validators/validate-mini-tree-integrity.mjs }
---

# EP-017 — CRLF YAML Parser Failure

**Symptom:** Validator says "has mini_tree_root: true but no sub_files: array" even though the frontmatter clearly has sub_files.

**Root cause:** Regex `/^sub_files:$/` fails to match `sub_files:\r` (Windows CRLF). Line ends with `\r\n`, split on `\n` leaves `\r` in line. The trailing `\r` prevents exact match.

**Also:** Condition ordering bug — when processing the `sub_files:` line, both "set flag" AND "clear flag" conditions fire in the same iteration (since `sub_files:` doesn't start with whitespace/dash, condition 4 clears the flag immediately). Fixed with `else if` logic.

**Fix pattern:** All CSPS YAML frontmatter parsers must:
1. `content.replace(/\r/g, '')` before processing
2. Use `else if` for state-machine conditions that set AND check in same loop

**Applied to:** `validate-mini-tree-integrity.mjs` S032
**Platform risk:** Any validator that parses YAML frontmatter via string matching is vulnerable.
