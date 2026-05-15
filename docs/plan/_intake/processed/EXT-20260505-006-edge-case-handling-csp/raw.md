---
title: "AI Builder Edge Case Handling — How CSP Manages Permission Popups + Mid-Session Friction"
prepared_by: Core Sights Platform (CSP)
date: 2026-05-05
core_spine: OPER
core_spines: [OPER, VALD, CNST]
pillars: [TIMING, GOVERNANCE, INTEGRITY]
pe_score: 7.0
status: ACTIVE_OPERATIONAL_NOTE
github: https://github.com/CommarkG/core-sights-platform/blob/main/.claudecode/platform-brief/AI_BUILDER_EDGE_CASE_HANDLING_NOTE_prepared_by_CSP_2026-05-05.md
scope_level: S1
---

# AI Builder Edge Case Handling Note (CSP)

[Verbatim raw preserved per B_INTAKE_DISCIPLINE Step 3. Full ~13K-byte CSP operational note — NOT part of 5-document series; separate operational reference. 6 sections covering 5 specific edge cases + 7 forward-going patterns + single rule. Full content in S008 turn 11 chat transcript; GitHub URL canonical.]

## Section enumeration (6 sections)

§1 The principle: edge cases are not bugs; they are signals
§2 5 specific edge cases encountered + resolutions:
   - #1 Pre-push gate block (BATCH_CLOSE token absence)
   - #2 Bash hook intercepting compound git commit && git push
   - #3 /tmp path inaccessible to git on Windows
   - #4 PowerShell em-dash parser error
   - #5 CD-087 surface_path regression caught at S336 close
§3 7 forward-going patterns:
   - A. Permission popups for new file paths (.claude/hooks/)
   - B. Validator findings during execution
   - C. Mid-session model switches
   - D. Auto-compaction at 95% context
   - E. HEREDOC multi-line commit messages
   - F. System reminder noise (TodoWrite + MCP cross-pollution)
   - G. Settings.json writes
§4 The single rule for edge case handling
§5 Composition with rest of CSP
§6 Closing

## Source

- Prepared by CSP / Drafter Claude Opus 4.7 (1M context) / S337-prep H11 chat
- Authority Governor Yariv (CSP) — *"present a short file on how did you manage to cover all of these not usefull popup to stop and how did you solve edge cases to apear.. and handle edge cases that will apear"*
- **Operational note** — NOT in CSP DNA export 5-document series; separate reference
- Received via chat-paste S008 turn 11 (alongside EXT-005); received in CSPS as EXT-20260505-006
- **CSPS-IMMEDIATE APPLICATION:** §3 Pattern A solution = engraved THIS BATCH as `feedback_diff_before_protected_path_writes.md` per user verbatim "I keep asking you to stop these from disturbing us — enforce it."
