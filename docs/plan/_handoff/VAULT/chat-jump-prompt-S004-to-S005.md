---
id: csps.handoff.vault.chat-jump-prompt-S004-to-S005
name: chat-jump-prompt-S004-to-S005
description: Minimal paste-target for opening Session 005 from Session 004 close. Pair this with chat-jump-prompt-S004-to-S005-detailed.md (the detailed standalone version for user comprehension).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
session: S004
next_session: S005
domain_path: platform
---

# Minimal paste-target — S004 → S005

Paste this into the new chat:

```
Read docs/plan/_handoff/HANDOFF-S004-to-S005.md §0 and execute.
```

## Workspace-warning trap defusal (per `feedback_parent_claude_md_wrong_workspace_trap.md`)

If the new AI session shows a "Wrong workspace — CSPS governance not active" warning from `c:\Users\finky\CLAUDE.md` (the parent home-directory CLAUDE.md), **that warning is a FALSE POSITIVE for CSPS**. Per memory: CSPS lives in the `Csps` folder (renamed from `VSAS - Various Saas & Apps Solutions` on 2026-05-03; auto-memory dir at `c--Users-finky-Desktop-Claude-Code-Csps/`). The parent CLAUDE.md is a CSP construct, not CSPS.

If the AI refuses work citing that warning: tell it to verify via tool call (Glob `docs/plan/pillar-*/README.md` should return 7 results in CSPS workspace) BEFORE asserting "wrong workspace."

## Post-git mode active starting S005

S005 is the FIRST session opening AFTER first git push. The handoff uses GitHub URLs throughout — verify `git remote -v` shows `origin https://github.com/CommarkG/csps` before proceeding.
